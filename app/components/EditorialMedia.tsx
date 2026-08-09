/* eslint-disable @next/next/no-img-element */

type Props = {
  src: string;
  alt?: string;
  className?: string;
  controls?: boolean;
  priority?: boolean;
};

export function getMediaKind(src: string) {
  try {
    const kind = new URL(src, "https://vd.local").searchParams.get("kind");
    return kind === "video" || kind === "audio" || kind === "document" ? kind : "image";
  } catch {
    return "image";
  }
}

export default function EditorialMedia({ src, alt = "", className = "", controls = false, priority = false }: Props) {
  const kind = getMediaKind(src);
  const mediaClass = `editorial-media-element ${className}`.trim();
  if (kind === "video") return <video className={mediaClass} src={src} controls={controls} muted={!controls} playsInline preload="metadata" />;
  if (kind === "audio") return <div className={`editorial-audio-element ${className}`.trim()}><span>VD AUDIO</span><audio src={src} controls preload="metadata" /></div>;
  if (kind === "document") return <a className={`editorial-document-element ${className}`.trim()} href={src} target="_blank" rel="noreferrer"><span>PDF</span><b>Abrir documento</b></a>;
  return <img className={mediaClass} src={src} alt={alt} width={1200} height={675} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />;
}
