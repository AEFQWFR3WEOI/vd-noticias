"use client";
/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */

import { useEffect, useState } from "react";
import { getMediaKind } from "./EditorialMedia";

export type LatestStageArticle = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  categorySlug: string;
  image: string;
  time: string;
  publishedAt?: string | null;
  readingMinutes: number;
};

export default function LatestNewsStage({ articles }: { articles: LatestStageArticle[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || articles.length < 2) return;
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % articles.length), 7000);
    return () => window.clearInterval(timer);
  }, [articles.length, paused, reducedMotion]);

  if (!articles.length) return null;
  const active = articles[current];
  const mediaKind = getMediaKind(active.image);

  function goTo(index: number) {
    setCurrent((index + articles.length) % articles.length);
  }

  function finishSwipe(end: number) {
    if (touchStart === null) return;
    const distance = touchStart - end;
    if (Math.abs(distance) > 45) goTo(current + (distance > 0 ? 1 : -1));
    setTouchStart(null);
  }

  return (
    <section className="latest-stage-section" aria-labelledby="latest-stage-title">
      <header className="latest-stage-heading">
        <div><span>EN DESARROLLO</span><h2 id="latest-stage-title">Últimas noticias</h2></div>
        <div><small>{String(current + 1).padStart(2, "0")} / {String(articles.length).padStart(2, "0")}</small><a href="/seccion/ultimas">Ver todas →</a></div>
      </header>

      <div
        className="latest-stage"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Últimas noticias destacadas"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") goTo(current - 1);
          if (event.key === "ArrowRight") goTo(current + 1);
        }}
        onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
        onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)}
      >
        <div className="latest-stage-progress" aria-hidden="true">
          {!paused && !reducedMotion && <i key={current} />}
        </div>
        <div className="latest-stage-media" key={`media-${active.slug}`}>
          {mediaKind === "video" ? (
            <video src={active.image} muted autoPlay loop playsInline preload="metadata" aria-label={`Video: ${active.title}`} />
          ) : (
            <img src={active.image} alt={active.title} width="1600" height="900" loading={current === 0 ? "eager" : "lazy"} fetchPriority={current === 0 ? "high" : "auto"} />
          )}
        </div>
        <div className="latest-stage-shade" aria-hidden="true" />
        <article className="latest-stage-story" key={`story-${active.slug}`} aria-live="polite">
          <div className="latest-stage-meta"><a href={`/seccion/${active.categorySlug}`}>{active.category}</a><time dateTime={active.publishedAt || undefined}>{active.time}</time><span>{active.readingMinutes} min de lectura</span></div>
          <h3><a href={`/noticia/${active.slug}`}>{active.title}</a></h3>
          <p>{active.summary}</p>
          <a className="latest-stage-cta" href={`/noticia/${active.slug}`}>Leer noticia completa <b>→</b></a>
        </article>
        <div className="latest-stage-controls" aria-label="Controles del carrusel">
          <button type="button" onClick={() => goTo(current - 1)} aria-label="Noticia anterior">←</button>
          <button className="latest-stage-pause" type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Reanudar cambio automático" : "Pausar cambio automático"}>{paused ? "▶" : "Ⅱ"}</button>
          <button type="button" onClick={() => goTo(current + 1)} aria-label="Noticia siguiente">→</button>
        </div>
      </div>

      <nav className="latest-stage-rail" aria-label="Seleccionar última noticia">
        {articles.map((article, index) => (
          <button className={index === current ? "active" : ""} type="button" onClick={() => goTo(index)} aria-current={index === current ? "true" : undefined} key={article.slug}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {getMediaKind(article.image) === "image" ? <img src={article.image} alt="" width="180" height="110" loading="lazy" /> : <span className="latest-stage-video-thumb" aria-hidden="true">▶</span>}
            <div><small>{article.category}</small><b>{article.title}</b></div>
          </button>
        ))}
      </nav>
      <p className="latest-stage-hint">Se actualiza automáticamente · Desliza o usa las flechas para explorar</p>
    </section>
  );
}
