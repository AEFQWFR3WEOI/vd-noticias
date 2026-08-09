"use client";
/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-html-link-for-pages */

import { useEffect, useMemo, useState } from "react";

export type BriefingArticle = { slug: string; title: string; summary: string; category: string };

export function SmartBriefing({ articles }: { articles: BriefingArticle[] }) {
  const [minutes, setMinutes] = useState(5);
  const [topics, setTopics] = useState<string[]>(["Nacionales", "Economía", "Deportes"]);
  const topicOptions = useMemo(() => [...new Set(articles.map((article) => article.category))].slice(0, 7), [articles]);

  useEffect(() => {
    const saved = window.localStorage.getItem("vd-topics");
    if (saved) setTopics(JSON.parse(saved));
  }, []);

  const visible = useMemo(() => {
    const selected = articles.filter((article) => topics.some((topic) => topic.toLowerCase() === article.category.toLowerCase()));
    const source = selected.length ? [...selected, ...articles.filter((article) => !selected.includes(article))] : articles;
    return source.slice(0, minutes === 3 ? 3 : minutes === 5 ? 4 : 6);
  }, [articles, minutes, topics]);

  function toggleTopic(topic: string) {
    const next = topics.includes(topic) ? topics.filter((item) => item !== topic) : [...topics, topic];
    setTopics(next);
    window.localStorage.setItem("vd-topics", JSON.stringify(next));
  }

  return (
    <section className="smart-briefing" aria-labelledby="smart-briefing-title">
      <div className="smart-briefing-copy">
        <span>VD INTELIGENCIA</span>
        <h2 id="smart-briefing-title">Tu resumen, a tu ritmo</h2>
        <p>Selecciona cuánto tiempo tienes y recibe una lectura priorizada de la jornada.</p>
        <div className="briefing-time" aria-label="Duración del resumen">
          {[3, 5, 10].map((value) => <button className={minutes === value ? "active" : ""} onClick={() => setMinutes(value)} aria-pressed={minutes === value} key={value}>{value} min</button>)}
        </div>
        <b>Personaliza tu portada</b>
        <div className="topic-picker">
          {topicOptions.map((topic) => <button className={topics.includes(topic) ? "selected" : ""} onClick={() => toggleTopic(topic)} aria-pressed={topics.includes(topic)} key={topic}>{topics.includes(topic) ? "✓ " : "+ "}{topic}</button>)}
        </div>
        <small>{topics.length ? `Tus prioridades: ${topics.join(", ")}.` : "Selecciona al menos un tema para personalizar tu experiencia."}</small>
      </div>
      <div className="briefing-results" aria-live="polite">
        <header><span>LECTURA DE {minutes} MINUTOS</span><b>{visible.length} claves seleccionadas</b></header>
        {visible.map((article, index) => (
          <article key={article.slug}><b>{String(index + 1).padStart(2, "0")}</b><div><span>{article.category.toUpperCase()}</span><a href={`/noticia/${article.slug}`}>{article.title}</a><small>{article.summary}</small></div></article>
        ))}
        <a className="briefing-action" href="/seccion/ultimas">Abrir resumen completo →</a>
      </div>
    </section>
  );
}
