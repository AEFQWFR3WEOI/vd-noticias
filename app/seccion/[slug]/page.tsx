/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import EditorialMedia from "../../components/EditorialMedia";
import { PageFooter, PageHeader } from "../../components/PageChrome";
import { sectionDescriptions, sectionNames } from "../../lib/editorial-data";
import { getPublishedArticles, getRecentVideos } from "../../lib/public-content";
import { absoluteUrl, SITE_NAME } from "../../lib/site-config";

type Props = { params: Promise<{ slug: string }> };

function displayName(slug: string) {
  return sectionNames[slug] ?? slug.replace(/-/g, " ").replace(/^./, (letter) => letter.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent((await params).slug);
  const name = displayName(slug);
  const description = sectionDescriptions[slug] ?? `Últimas noticias, reportajes y análisis de ${name} en VD Noticias.`;
  return { title: name, description, alternates: { canonical: `/seccion/${slug}` }, openGraph: { title: `${name} | ${SITE_NAME}`, description, url: `/seccion/${slug}`, type: "website" } };
}

export default async function SectionPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug);
  const title = displayName(slug);
  const description = sectionDescriptions[slug] ?? `Noticias, reportajes y análisis de ${title} en VD Noticias.`;
  const [sectionStories, allStories, liveVideos] = await Promise.all([getPublishedArticles(slug === "ultimas" ? undefined : slug, 50), getPublishedArticles(undefined, 12), slug === "videos" ? getRecentVideos(24) : Promise.resolve([])]);
  const stories = slug === "ultimas" ? sectionStories : sectionStories;
  const lead = stories[0];
  const collectionSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: `${title} | VD Noticias`, description, url: absoluteUrl(`/seccion/${slug}`), isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") }, mainEntity: { "@type": "ItemList", itemListElement: stories.slice(0, 20).map((story, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(`/noticia/${story.slug}`), name: story.title })) } };
  return <main className="public-site"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c") }} /><PageHeader active={title} /><div className="container pro-section-page"><nav className="breadcrumbs"><a href="/">Portada</a><span>›</span><b>{title}</b></nav><header className="pro-section-masthead"><span>VD NOTICIAS</span><h1>{title}</h1><p>{description}</p></header>
    {slug === "videos" && liveVideos.length > 0 && <section className="section-video-library" id="videos"><div className="pro-section-title"><div><span>BIBLIOTECA VD</span><h2>Videos recientes</h2></div><b>{liveVideos.length} {liveVideos.length === 1 ? "video" : "videos"}</b></div><div className="section-video-grid">{liveVideos.map((video) => <article key={video.id}><video src={video.url} controls preload="metadata" playsInline /><span>{video.articleCategorySlug.toUpperCase()}</span><h3><a href={`/noticia/${video.articleSlug}`}>{video.articleTitle}</a></h3></article>)}</div></section>}
    {lead ? <><section className="pro-section-lead" id="destacadas"><article className="section-primary"><a href={`/noticia/${lead.slug}`}><EditorialMedia src={lead.heroImageUrl || "/vd-noticias-logo.png"} alt={lead.title} priority /><span>{lead.categorySlug.toUpperCase()}</span><h2>{lead.title}</h2></a><p>{lead.summary}</p></article><aside className="section-side section-visual-list">{stories.slice(1, 4).map((story) => <article key={story.slug}><a href={`/noticia/${story.slug}`}><EditorialMedia src={story.heroImageUrl || "/vd-noticias-logo.png"} alt={story.title} /><div><span>{story.categorySlug.toUpperCase()}</span><h3>{story.title}</h3><p>{story.summary}</p></div></a></article>)}</aside></section><div className="section-content-grid" id="ultimas"><section><div className="pro-section-title"><div><span>ARCHIVO</span><h2>Últimas de {title}</h2></div></div><div className="pro-archive-grid">{stories.slice(4).map((story) => <article key={story.slug}><a href={`/noticia/${story.slug}`}><EditorialMedia src={story.heroImageUrl || "/vd-noticias-logo.png"} alt={story.title} /><span>{story.categorySlug.toUpperCase()}</span><h3>{story.title}</h3></a><p>{story.summary}</p></article>)}</div></section><aside className="section-ranking visual-ranking"><header><span>RECIENTES</span><h2>Ahora en VD</h2></header>{allStories.filter((story) => !stories.some((item) => item.slug === story.slug)).slice(0, 5).map((story, index) => <article key={story.slug}><b>{String(index + 1).padStart(2, "0")}</b><a href={`/noticia/${story.slug}`}><EditorialMedia src={story.heroImageUrl || "/vd-noticias-logo.png"} alt={story.title} /><div><span>{story.categorySlug.toUpperCase()}</span><h3>{story.title}</h3><p>{story.summary}</p></div></a></article>)}</aside></div></> : <section className="empty-publication"><h2>Aún no hay publicaciones en {title}</h2><p>La sección mostrará únicamente contenidos publicados y verificados.</p><a href="/">Volver a la portada →</a></section>}
  </div><PageFooter /></main>;
}
