import { eq } from "drizzle-orm";
import { getDbReady } from "../../../../db";
import { mediaAssets } from "../../../../db/schema";

type StoredObject = { body: ReadableStream; httpMetadata?: { contentType?: string }; etag?: string };
type Bucket = { get(key: string, options?: { range?: { offset: number; length: number } }): Promise<StoredObject | null> };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return new Response("Not found", { status: 404 });
  const [asset] = await (await getDbReady()).select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!asset) return new Response("Not found", { status: 404 });
  const { env } = await import("cloudflare:workers");
  const bucket = (env as unknown as { BUCKET?: Bucket }).BUCKET;
  const rangeHeader = request.headers.get("range");
  let range: { start: number; end: number } | null = null;
  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
    if (!match) return new Response(null, { status: 416, headers: { "content-range": `bytes */${asset.size}` } });
    const requestedStart = match[1] ? Number(match[1]) : null;
    const requestedEnd = match[2] ? Number(match[2]) : null;
    const start = requestedStart ?? Math.max(0, asset.size - (requestedEnd ?? asset.size));
    const end = Math.min(requestedStart === null ? asset.size - 1 : requestedEnd ?? asset.size - 1, asset.size - 1);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end || start >= asset.size) return new Response(null, { status: 416, headers: { "content-range": `bytes */${asset.size}` } });
    range = { start, end };
  }
  const object = await bucket?.get(asset.objectKey, range ? { range: { offset: range.start, length: range.end - range.start + 1 } } : undefined);
  if (!object) return new Response("Not found", { status: 404 });
  const filename = asset.filename.replace(/[\r\n"]/g, "_");
  return new Response(object.body, { status: range ? 206 : 200, headers: {
    "content-type": object.httpMetadata?.contentType ?? asset.contentType,
    "content-length": String(range ? range.end - range.start + 1 : asset.size),
    "content-disposition": `inline; filename="${filename}"`,
    "accept-ranges": "bytes",
    "cache-control": "public, max-age=31536000, immutable",
    ...(range ? { "content-range": `bytes ${range.start}-${range.end}/${asset.size}` } : {}),
    ...(object.etag ? { etag: object.etag } : {}),
  } });
}
