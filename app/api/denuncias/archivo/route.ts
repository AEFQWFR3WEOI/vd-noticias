import { getEditorialUser } from "../../../lib/editorial-auth";

type Bucket = { get(key: string): Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string }; size: number } | null> };

// Archivos de las denuncias: solo los ve el equipo de redacción.
export async function GET(request: Request) {
  const user = await getEditorialUser();
  if (!user) return new Response("Acceso no autorizado", { status: 401 });
  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!/^denuncias\/[\w./-]+$/.test(key) || key.includes("..")) return new Response("Not found", { status: 404 });
  const { env } = await import("cloudflare:workers");
  const object = await (env as unknown as { BUCKET?: Bucket }).BUCKET?.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, { headers: { "content-type": object.httpMetadata?.contentType ?? "application/octet-stream", "content-length": String(object.size), "cache-control": "private, max-age=3600" } });
}
