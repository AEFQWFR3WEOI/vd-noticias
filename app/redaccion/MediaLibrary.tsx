"use client";
/* eslint-disable @next/next/no-img-element, react-hooks/set-state-in-effect */

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { uploadMediaFile, type UploadedMediaAsset } from "./media-upload";

type MediaAsset = UploadedMediaAsset;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function MediaPreview({ asset }: { asset: MediaAsset }) {
  if (asset.kind === "video") return <video src={asset.url} controls preload="metadata" />;
  if (asset.kind === "audio") return <div className="media-audio-preview"><span>♫</span><audio src={asset.url} controls preload="metadata" /></div>;
  if (asset.kind === "document") return <div className="media-document-preview"><span>PDF</span><b>Documento</b></div>;
  return <img src={asset.url} alt={asset.altText || asset.filename} />;
}

export default function MediaLibrary() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [message, setMessage] = useState("Cargando biblioteca…");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function loadAssets() {
    try {
      const response = await fetch("/api/media");
      const result = await response.json() as { assets?: MediaAsset[]; error?: string };
      if (!response.ok) {
        setMessage(result.error ?? "No se pudo cargar la biblioteca");
        return;
      }
      setAssets(result.assets ?? []);
      setMessage(result.assets?.length ? "" : "Aún no hay archivos. Sube el primero.");
    } catch {
      setMessage("No se pudo conectar con la biblioteca multimedia");
    }
  }

  useEffect(() => { void loadAssets(); }, []);

  async function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (!files.length) return;
    setBusy(true);
    setMessage(`Preparando ${files.length === 1 ? files[0].name : `${files.length} archivos`}…`);
    try {
      const uploaded: MediaAsset[] = [];
      for (let index = 0; index < files.length; index += 1) {
        setProgress(0);
        setMessage(`Subiendo ${index + 1} de ${files.length}: ${files[index].name}`);
        const altText = files[index].name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        uploaded.push(await uploadMediaFile(files[index], altText, setProgress));
      }
      setAssets((current) => [...uploaded.reverse(), ...current]);
      setMessage(`${files.length === 1 ? "Archivo subido" : "Archivos subidos"} correctamente.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo completar la carga");
    } finally {
      setBusy(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) void uploadFiles(event.target.files);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (!busy) void uploadFiles(event.dataTransfer.files);
  }

  async function copyUrl(asset: MediaAsset) {
    try {
      const absoluteUrl = `${window.location.origin}${asset.url}`;
      await navigator.clipboard.writeText(absoluteUrl);
      setMessage(`Enlace copiado: ${asset.filename}`);
    } catch {
      setMessage("No se pudo copiar automáticamente. Abre el archivo y copia la dirección del navegador.");
    }
  }

  function selectForArticle(asset: MediaAsset) {
    const mediaUrl = document.querySelector<HTMLInputElement>('#nueva input[name="mediaUrl"]');
    const mediaDescription = document.querySelector<HTMLInputElement>('#nueva input[name="imageAlt"]');
    if (!mediaUrl) {
      setMessage("No se encontró el formulario de noticias.");
      return;
    }
    mediaUrl.value = `${window.location.origin}${asset.url}`;
    if (mediaDescription && !mediaDescription.value) mediaDescription.value = asset.altText || asset.filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    document.querySelector("#nueva")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMessage(`${asset.filename} está listo para usar en una noticia. Completa el artículo y publícalo.`);
  }

  return (
    <div className="media-library">
      <div
        className={`media-dropzone ${dragging ? "dragging" : ""} ${busy ? "busy" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" multiple accept="image/*,video/*,audio/*,application/pdf" onChange={handleInput} disabled={busy} />
        <div className="media-drop-icon">＋</div>
        <div><b>{busy ? "Subiendo archivo…" : "Arrastra tus archivos aquí"}</b><p>Imágenes, videos, audios y PDF · máximo 100 MB por archivo</p></div>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}>{busy ? `${progress}%` : "Seleccionar archivos"}</button>
        {busy && <i><span style={{ width: `${progress}%` }} /></i>}
      </div>

      {message && <p className="media-library-message" aria-live="polite">{message}</p>}

      <div className="media-library-toolbar"><b>{assets.length} archivos</b><span>Los más recientes aparecen primero</span></div>
      {assets.length > 0 && <div className="media-library-grid">{assets.map((asset) => (
        <article key={asset.id}>
          <div className="media-preview"><MediaPreview asset={asset} /><span>{asset.kind === "image" ? "IMAGEN" : asset.kind === "video" ? "VIDEO" : asset.kind === "audio" ? "AUDIO" : "PDF"}</span></div>
          <div className="media-card-info"><b title={asset.filename}>{asset.filename}</b><small>{formatBytes(asset.size)} · {new Date(asset.createdAt).toLocaleDateString("es-DO")}</small></div>
          <div className="media-card-actions"><button type="button" onClick={() => selectForArticle(asset)}>Usar en noticia</button><button type="button" onClick={() => void copyUrl(asset)}>Copiar enlace</button><a href={asset.url} target="_blank" rel="noreferrer">Abrir ↗</a></div>
        </article>
      ))}</div>}
    </div>
  );
}
