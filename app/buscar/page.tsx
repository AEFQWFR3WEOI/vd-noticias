import { PageFooter, PageHeader } from "../components/PageChrome";
import EditorialMedia from "../components/EditorialMedia";
import { getPublishedArticles } from "../lib/public-content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Buscar", description: "Busca noticias por tema, persona, lugar o sección en el archivo de VD Noticias.", alternates: { canonical: "/buscar" }, robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const normalized = q.toLowerCase();
  const live = await getPublishedArticles(undefined, 100);
  const source = live.map((story) => ({ category: story.categorySlug, title: story.title, summary: story.summary, image: story.heroImageUrl || "/vd-noticias-logo.png", slug: story.slug }));
  const results = normalized ? source.filter((story) => `${story.title} ${story.summary} ${story.category}`.toLowerCase().includes(normalized)) : source;
  return <main><PageHeader /><div className="container inner-page search-page"><header><span>ARCHIVO VD</span><h1>Buscar noticias</h1></header><form action="/buscar"><label className="sr-only" htmlFor="q">Buscar</label><input id="q" name="q" defaultValue={q} placeholder="Escribe un tema, persona o lugar" /><button>Buscar</button></form><p className="search-count">{q ? `${results.length} resultados para “${q}”` : "Explora las noticias publicadas más recientes"}</p><div className="search-results">{results.map((story) => <article key={story.slug}><EditorialMedia src={story.image} alt={story.title} /><div><span>{story.category.toUpperCase()}</span><h2><a href={`/noticia/${story.slug}`}>{story.title}</a></h2><p>{story.summary}</p><small>VD Noticias</small></div></article>)}</div>{q && results.length === 0 && <div className="empty-publication"><h2>No encontramos esa búsqueda</h2><p>Prueba con menos palabras, el apellido de una persona o el nombre de una sección.</p></div>}</div><PageFooter /></main>;
}
