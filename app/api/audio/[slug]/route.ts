import { and, eq } from "drizzle-orm";
import { getDbReady } from "../../../../db";
import { articles } from "../../../../db/schema";
import { narrationText, speechConfig, synthesize, textHash } from "../../../lib/speech";

type StoredObject = { body: ReadableStream; size: number };
type Bucket = {
  head(key: string): Promise<{ size: number } | null>;
  get(key: string, options?: { range?: { offset: number; length: number } }): Promise<StoredObject | null>;
  put(key: string, value: Uint8Array, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
};

// Audio del resumen de una noticia publicada. Se genera con Azure la primera
// vez, se guarda en R2 y luego se sirve desde ahí (no se vuelve a cobrar).
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = decodeURIComponent((await params).slug);
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return new Response("Not found", { status: 404 });
  if (!(await speechConfig())) return new Response("Audio no disponible", { status: 404 });

  const [article] = await (await getDbReady())
    .select({ title: articles.title, summary: articles.summary, body: articles.body })
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);
  if (!article) return new Response("Not found", { status: 404 });

  const { env } = await import("cloudflare:workers");
  const bucket = (env as unknown as { BUCKET?: Bucket }).BUCKET;
  if (!bucket) return new Response("Audio no disponible", { status: 503 });

  const text = narrationText(article);
  const key = `audio/resumen/${slug}-${await textHash(text)}.mp3`;
  let head = await bucket.head(key);
  if (!head) {
    try {
      const audio = await synthesize(text);
      await bucket.put(key, audio, { httpMetadata: { contentType: "audio/mpeg" } });
      head = { size: audio.byteLength };
    } catch {
      return new Response("No se pudo generar el audio", { status: 502 });
    }
  }

  const size = head.size;
  const rangeHeader = request.headers.get("range");
  let range: { start: number; end: number } | null = null;
  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
    const start = match?.[1] ? Number(match[1]) : match?.[2] ? Math.max(0, size - Number(match[2])) : 0;
    const end = match?.[1] && match?.[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    if (!match || start > end || start >= size) {
      return new Response(null, { status: 416, headers: { "content-range": `bytes */${size}` } });
    }
    range = { start, end };
  }
  const object = await bucket.get(key, range ? { range: { offset: range.start, length: range.end - range.start + 1 } } : undefined);
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, {
    status: range ? 206 : 200,
    headers: {
      "content-type": "audio/mpeg",
      "content-length": String(range ? range.end - range.start + 1 : size),
      "accept-ranges": "bytes",
      "cache-control": "public, max-age=3600",
      ...(range ? { "content-range": `bytes ${range.start}-${range.end}/${size}` } : {}),
    },
  });
}
