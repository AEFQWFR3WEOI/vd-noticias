export type UploadedMediaAsset = {
  id: number;
  filename: string;
  contentType: string;
  size: number;
  altText: string;
  createdAt: string;
  kind: "image" | "video" | "audio" | "document";
  url: string;
};

type UploadedPart = { partNumber: number; etag: string };

async function readJson<T>(response: Response): Promise<T> {
  const raw = await response.text();
  try {
    return JSON.parse(raw || "{}") as T;
  } catch {
    throw new Error(response.status === 413 ? "El archivo supera el límite permitido por el servidor" : `El servidor rechazó la carga (${response.status || "sin respuesta"})`);
  }
}

export async function uploadMediaFile(file: File, altText = "", onProgress?: (progress: number) => void): Promise<UploadedMediaAsset> {
  const supported = file.type.startsWith("image/") || file.type.startsWith("video/") || file.type.startsWith("audio/") || file.type === "application/pdf";
  if (!supported) throw new Error("Formato no compatible. Usa imágenes, videos, audios o PDF");
  if (file.size > 100 * 1024 * 1024) throw new Error("El archivo supera el límite de 100 MB");

  const initResponse = await fetch("/api/media?operation=init", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size, altText }),
  });
  const init = await readJson<{ objectKey?: string; uploadId?: string; chunkSize?: number; error?: string }>(initResponse);
  if (!initResponse.ok || !init.objectKey || !init.uploadId) throw new Error(init.error ?? "No se pudo iniciar la carga");

  const chunkSize = init.chunkSize ?? 8 * 1024 * 1024;
  const parts: UploadedPart[] = [];
  try {
    for (let start = 0, partNumber = 1; start < file.size; start += chunkSize, partNumber += 1) {
      const end = Math.min(start + chunkSize, file.size);
      const query = new URLSearchParams({ operation: "part", objectKey: init.objectKey, uploadId: init.uploadId, partNumber: String(partNumber) });
      const partResponse = await fetch(`/api/media?${query}`, { method: "POST", headers: { "content-type": "application/octet-stream" }, body: file.slice(start, end) });
      const part = await readJson<{ part?: UploadedPart; error?: string }>(partResponse);
      if (!partResponse.ok || !part.part) throw new Error(part.error ?? `No se pudo subir el bloque ${partNumber}`);
      parts.push(part.part);
      onProgress?.(Math.min(95, Math.round((end / file.size) * 95)));
    }

    const completeResponse = await fetch("/api/media?operation=complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ objectKey: init.objectKey, uploadId: init.uploadId, filename: file.name, contentType: file.type, size: file.size, altText, parts }),
    });
    const complete = await readJson<{ asset?: UploadedMediaAsset; error?: string }>(completeResponse);
    if (!completeResponse.ok || !complete.asset) throw new Error(complete.error ?? "No se pudo completar la carga");
    onProgress?.(100);
    return complete.asset;
  } catch (error) {
    void fetch("/api/media?operation=abort", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ objectKey: init.objectKey, uploadId: init.uploadId }),
    }).catch(() => undefined);
    throw error;
  }
}
