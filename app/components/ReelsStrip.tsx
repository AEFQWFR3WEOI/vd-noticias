"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ReelItem = { id: number; url: string; title: string; category: string; coverUrl: string; format?: "reel" | "post" | "horizontal" };


type Props = { reels: ReelItem[]; variant?: "strip" | "grid" };

const embedUrl = (reel: ReelItem) => `${reel.url.replace(/\/?$/, "/")}embed/`;

function Cover({ reel }: { reel: ReelItem }) {
  if (reel.coverUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={reel.coverUrl} alt={reel.title || "Video de VD Noticias"} loading="lazy" />;
  }
  // Sin portada: vista previa del propio Instagram (sin interacción).
  return <span className="ig-crop"><iframe src={embedUrl(reel)} title={reel.title || "Video de Instagram"} loading="lazy" tabIndex={-1} aria-hidden="true" scrolling="no" /></span>;
}

// «VD Reels»: videos verticales de Instagram con reproductor a pantalla completa.
export default function ReelsStrip({ reels, variant = "strip" }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpenIndex(null), []);
  const move = useCallback((step: number) => setOpenIndex((index) => (index === null ? null : (index + step + reels.length) % reels.length)), [reels.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight" || event.key === "ArrowDown") move(1);
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") move(-1);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [openIndex, close, move]);

  if (!reels.length) return null;
  const current = openIndex === null ? null : reels[openIndex];

  return (
    <>
      <div className={`reels-list reels-${variant}`}>
        {reels.map((reel, index) => (
          <button type="button" key={reel.id} className={`reel-card is-${reel.format ?? "reel"}`} onClick={() => setOpenIndex(index)} aria-label={`Ver video: ${reel.title || "VD Noticias"}`}>
            <span className="reel-cover"><Cover reel={reel} /></span>
            <span className="reel-shade" aria-hidden="true" />
            <span className="reel-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg></span>
            {(reel.category || reel.title) && (
              <span className="reel-text">
                {reel.category && <em>{reel.category}</em>}
                {reel.title && <b>{reel.title}</b>}
              </span>
            )}
          </button>
        ))}
      </div>

      {mounted && current && createPortal(
        <div className="reel-viewer" role="dialog" aria-modal="true" aria-label={current.title || "Video de VD Noticias"} onClick={close}>
          <div className="reel-viewer-frame" onClick={(event) => event.stopPropagation()}>
            <span className="ig-crop is-player"><iframe key={current.id} src={embedUrl(current)} title={current.title || "Video de Instagram"} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen scrolling="no" /></span>
          </div>
          <button type="button" className="reel-viewer-close" onClick={close} aria-label="Cerrar video">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
          {reels.length > 1 && <>
            <button type="button" className="reel-viewer-nav is-prev" onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Video anterior">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" className="reel-viewer-nav is-next" onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Video siguiente">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </>}
          <a className="reel-viewer-ig" href={current.url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>Ver en Instagram</a>
        </div>,
        document.body,
      )}
    </>
  );
}
