import { desc } from "drizzle-orm";
import { getDbReady } from "../../../db";
import { mediaAssets } from "../../../db/schema";
import { getEditorialUser } from "../../lib/editorial-auth";

type UploadedPart = { partNumber: number; etag: string };
type MultipartUpload = {
  key: string;
  uploadId: string;
  uploadPart(partNumber: number, value: ReadableStream): Promise<UploadedPart>;
  complete(parts: UploadedPart[]): Promise<unknown>;
  abort(): Promise<void>;
};
type Bucket = {
  createMultipartUpload(key: string, options?: { httpMetadata?: { contentType?: string } }): Promise<MultipartUpload>;
  resumeMultipartUpload(key: string, uploadId: string): MultipartUpload;
};

function assetKind(contentType: string) {
  if (contentType.startsWith("video/")) return "video";
  if (contentType.startsWith("audio/")) return "audio";
  if (contentType === "application/pdf") return "document";
  return "image";
}

function publicAsset<T extends { id: number; contentType: string }>(asset: T) {
  const kind = assetKind(asset.contentType);
  return { ...asset, kind, url: `/api/media/${asset.id}?kind=${kind}` };
}

export async function GET() {
  try {
    const user = await getEditorialUser();
    if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 401 });
    const assets = await (await getDbReady()).select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt), desc(mediaAssets.id)).limit(100);
    return Response.json({ assets: assets.map(publicAsset) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo cargar la biblioteca" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getEditorialUser();
    if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 401 });
    const { env } = await import("cloudflare:workers");
    const bucket = (env as unknown as { BUCKET?: Bucket }).BUCKET;
    if (!bucket) throw new Error("Biblioteca multimedia no disponible");
    const operation = new URL(request.url).searchParams.get("operation");

    if (operation === "init") {
      const body = await request.json() as { filename?: string; contentType?: string; size?: number };
      const filename = String(body.filename ?? "").trim();
      const contentType = String(body.contentType ?? "").trim();
      const size = Number(body.size ?? 0);
      const supported = contentType.startsWith("image/") || contentType.startsWith("video/") || contentType.startsWith("audio/") || contentType === "application/pdf";
      if (!filename || !supported || !Number.isFinite(size) || size <= 0) return Response.json({ error: "El archivo no es válido o su formato no es compatible" }, { status: 415 });
      if (size > 100 * 1024 * 1024) return Response.json({ error: "El archivo supera el límite de 100 MB" }, { status: 413 });
      const safeName = filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "archivo";
      const objectKey = `media/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
      const upload = await bucket.createMultipartUpload(objectKey, { httpMetadata: { contentType } });
      return Response.json({ objectKey, uploadId: upload.uploadId, chunkSize: 8 * 1024 * 1024 }, { status: 201 });
    }

    if (operation === "part") {
      const url = new URL(request.url);
      const objectKey = url.searchParams.get("objectKey") ?? "";
      const uploadId = url.searchParams.get("uploadId") ?? "";
      const partNumber = Number(url.searchParams.get("partNumber"));
      if (!objectKey.startsWith("media/") || !uploadId || !Number.isInteger(partNumber) || partNumber < 1 || !request.body) return Response.json({ error: "Bloque de carga inválido" }, { status: 400 });
      const upload = bucket.resumeMultipartUpload(objectKey, uploadId);
      const part = await upload.uploadPart(partNumber, request.body);
      return Response.json({ part });
    }

    if (operation === "complete") {
      const body = await request.json() as { objectKey?: string; uploadId?: string; filename?: string; contentType?: string; size?: number; altText?: string; parts?: UploadedPart[] };
      const objectKey = String(body.objectKey ?? "");
      const uploadId = String(body.uploadId ?? "");
      const filename = String(body.filename ?? "").trim();
      const contentType = String(body.contentType ?? "").trim();
      const size = Number(body.size ?? 0);
      const parts = Array.isArray(body.parts) ? body.parts.filter((part) => Number.isInteger(part.partNumber) && part.partNumber > 0 && typeof part.etag === "string").sort((a, b) => a.partNumber - b.partNumber) : [];
      if (!objectKey.startsWith("media/") || !uploadId || !filename || !contentType || !size || !parts.length) return Response.json({ error: "No se pudo verificar la carga" }, { status: 400 });
      await bucket.resumeMultipartUpload(objectKey, uploadId).complete(parts);
      const [asset] = await (await getDbReady()).insert(mediaAssets).values({ objectKey, filename, contentType, size, altText: String(body.altText ?? ""), uploadedBy: user.email }).returning();
      return Response.json({ asset: publicAsset(asset) }, { status: 201 });
    }

    if (operation === "abort") {
      const body = await request.json() as { objectKey?: string; uploadId?: string };
      const objectKey = String(body.objectKey ?? "");
      const uploadId = String(body.uploadId ?? "");
      if (objectKey.startsWith("media/") && uploadId) await bucket.resumeMultipartUpload(objectKey, uploadId).abort();
      return Response.json({ aborted: true });
    }

    return Response.json({ error: "Operación de carga no válida. Actualiza la página e inténtalo nuevamente." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo subir el archivo" }, { status: 500 });
  }
}
