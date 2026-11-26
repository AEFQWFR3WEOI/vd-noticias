/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import EditorialMedia, { getMediaKind } from "../../components/EditorialMedia";
import { PageFooter, PageHeader } from "../../components/PageChrome";
import ListenSummary from "../../components/ListenSummary";
import { isSpeechEnabled } from "../../lib/speech";
import { isIndexableArticle, wordCount } from "../../lib/editorial-quality";
import { getArticleAuthorName, getArticleWithCanonical, getPublishedArticles } from "../../lib/public-content";
import { absoluteUrl, DEFAULT_SHARE_IMAGE, formatPublishedDate, PUBLISHER_NAME, SITE_NAME, SITE_URL } from "../../lib/site-config";

type Props = { params: Promise<{ slug: string }> };
type Source = { name: string; url?: string };

function parseArticleBody(body: string) {
  const paragraphs: string[] = [];
  const sources: Source[] = [];
  for (const block of body.split(/\n+/).map((value) => value.trim()).filter(Boolean)) {
    if (block.startsWith("Fuente consultada:")) {
      const [name, url] = block.replace("Fuente consultada:", "").split("|").map((value) => value.trim());
      sources.push({ name, url: /^https?:\/\//.test(url || "") ? url : undefined });
    } else {
      paragraphs.push(block);
    }
  }
  return { paragraphs, sources };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticleWithCanonical(slug);
  if (!result) return { title: "Noticia no encontrada", robots: { index: false, follow: false } };
  const { article, canonical } = result;
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.summary;
  const canonicalPath = `/noticia/${canonical.slug}`;
  const image = article.heroImageUrl ? absoluteUrl(article.heroImageUrl) : DEFAULT_SHARE_IMAGE;
  const indexable = isIndexableArticle(article) && canonical.slug === slug;
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    authors: [{ name: "Redacción VD Noticias", url: "/autores/redaccion-vd-noticias" }],
    keywords: [article.categorySlug, "República Dominicana", "VD Noticias", ...article.title.split(/\s+/).filter((word) => word.length > 6).slice(0, 6)],
    openGraph: { type: "article", url: canonicalPath, siteName: SITE_NAME, locale: "es_DO", title, description, publishedTime: article.publishedAt || article.createdAt, modifiedTime: article.updatedAt, section: article.categorySlug, authors: [absoluteUrl("/autores/redaccion-vd-noticias")], images: [{ url: image, alt: article.title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: { index: indexable, follow: true, googleBot: { index: indexable, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    other: { "news_keywords": `${article.categorySlug}, República Dominicana, VD Noticias` },
  };
}

const SECTION_LABELS: Record<string, string> = { nacionales: "Nacionales", politica: "Política", economia: "Economía", mundo: "Mundo", deportes: "Deportes", entretenimiento: "Entretenimiento", revista: "Revista", tecnologia: "Tecnología", salud: "Salud", educacion: "Educación", turismo: "Turismo", cultura: "Cultura", opinion: "Opinión", planeta: "Planeta", videos: "Videos" };
const sectionLabel = (slug: string) => SECTION_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);

function timeAgo(value?: string | null) {
  if (!value) return "Reciente";
  const date = new Date(value);
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (Number.isNaN(minutes)) return "Reciente";
  if (minutes < 60) return `Hace ${Math.max(1, minutes)} min`;
  if (minutes < 24 * 60) return `Hace ${Math.round(minutes / 60)} h`;
  return new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "short", timeZone: "America/Santo_Domingo" }).format(date).replace(".", "");
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const result = await getArticleWithCanonical(slug);
  if (!result) notFound();
  if (result.canonical.slug !== slug) permanentRedirect(`/noticia/${result.canonical.slug}`);
  const article = result.article;
  const { paragraphs, sources } = parseArticleBody(article.body);
  const mediaKind = getMediaKind(article.heroImageUrl || "");
  const titleSize = article.title.length > 115 ? "article-title--extra-long" : article.title.length > 78 ? "article-title--long" : article.title.length > 55 ? "article-title--medium" : "";
  const [authorName, sameCategory, latestArticles, speechEnabled] = await Promise.all([
    getArticleAuthorName(article.authorEmail),
    getPublishedArticles(article.categorySlug, 8),
    getPublishedArticles(undefined, 16),
    isSpeechEnabled(),
  ]);
  const recommended = [...sameCategory, ...latestArticles].filter((story, index, stories) => story.slug !== slug && stories.findIndex((candidate) => candidate.slug === story.slug) === index).slice(0, 4);
  const storyUrl = `${SITE_URL}/noticia/${article.slug}`;
  const shareText = encodeURIComponent(`${article.title} — VD Noticias`);
  const shareUrl = encodeURIComponent(storyUrl);
  const minutes = Math.max(2, Math.ceil(wordCount(article.body) / 210));
  const image = article.heroImageUrl ? absoluteUrl(article.heroImageUrl) : DEFAULT_SHARE_IMAGE;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${storyUrl}#article`,
    mainEntityOfPage: storyUrl,
    headline: article.title,
    description: article.summary,
    image: [image],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    articleSection: article.categorySlug,
    inLanguage: "es-DO",
    isAccessibleForFree: true,
    wordCount: wordCount(article.body),
    author: { "@type": authorName === "Redacción VD Noticias" ? "Organization" : "Person", name: authorName, url: absoluteUrl("/autores/redaccion-vd-noticias") },
    publisher: { "@type": "NewsMediaOrganization", "@id": `${SITE_URL}/#organization`, name: PUBLISHER_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/vd-noticias-logo.png") } },
    citation: sources.flatMap((source) => source.url ? [source.url] : []),
  };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Portada", item: SITE_URL }, { "@type": "ListItem", position: 2, name: article.categorySlug, item: absoluteUrl(`/seccion/${article.categorySlug}`) }, { "@type": "ListItem", position: 3, name: article.title, item: storyUrl }] };

  return (
    <main className="public-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <PageHeader />
      <article className="container article-page pro-article">
        <nav className="breadcrumbs"><a href="/">Portada</a><span>›</span><a href={`/seccion/${article.categorySlug}`}>{article.categorySlug}</a><span>›</span><b>Noticia</b></nav>
        <div className="article-topic-row"><a className="article-category" href={`/seccion/${article.categorySlug}`}>{article.categorySlug.toUpperCase()}</a><a href="/terminos#metodologia">Cómo verificamos</a></div>
        <h1 className={`article-title ${titleSize}`.trim()}>{article.title}</h1>
        <p className="article-deck">{article.summary}</p>{speechEnabled && <ListenSummary slug={article.slug} />}
        <div className="article-byline"><div className="avatar article-avatar"><img src="/vd-noticias-logo.png" alt="VD Noticias" width="96" height="96" /></div><div><b><a href="/autores/redaccion-vd-noticias">{authorName}</a></b><span>Santo Domingo · Publicado <time dateTime={article.publishedAt || article.createdAt}>{formatPublishedDate(article.publishedAt || article.createdAt, true)}</time> · <i>{minutes} min de lectura</i></span>{article.updatedAt !== article.createdAt && <small>Actualizado <time dateTime={article.updatedAt}>{formatPublishedDate(article.updatedAt, true)}</time></small>}</div></div>
        <nav className="article-share-bar" aria-label="Compartir noticia"><a className="whatsapp" href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir por WhatsApp">wa</a><a className="facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir en Facebook">f</a><a className="x-social" href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir en X">𝕏</a><a className="email" href={`mailto:?subject=${shareText}&body=${shareUrl}`} aria-label="Compartir por correo">✉</a><a className="telegram" href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noreferrer" aria-label="Compartir por Telegram">➤</a></nav>
        {article.heroImageUrl && <figure className={`article-hero-media ${mediaKind}`}><EditorialMedia src={article.heroImageUrl} alt={article.title} controls priority /><figcaption>{mediaKind === "video" ? "Video" : mediaKind === "audio" ? "Audio" : "Imagen"} principal de la cobertura · VD Noticias.</figcaption></figure>}
        <div className="article-layout pro-article-layout">
          <aside className="share-rail"><b>COMPARTIR</b><a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer">f</a><a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer">X</a><a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer">wa</a></aside>
          <div className="article-body">
            {paragraphs.map((paragraph, index) => <div key={`${paragraph.slice(0, 24)}-${index}`}><p className={index === 0 ? "dropcap" : ""}>{paragraph}</p>{index === 2 && <aside className="article-ad"><span>PUBLICIDAD</span><strong>Espacio publicitario identificado</strong><small>La publicidad no interviene en las decisiones editoriales.</small></aside>}</div>)}
            <footer className="article-endnote">
              <p className="article-endnote-meta"><span>{authorName}</span><span aria-hidden="true">·</span><a href="/terminos">Cómo trabajamos</a><span aria-hidden="true">·</span><a href="/contacto?asunto=correccion">¿Viste un error? Avísanos</a></p>
            </footer>
          </div>
          <aside className="most-read vd-latest" aria-labelledby="vd-latest-title">
            <header><h2 id="vd-latest-title"><i aria-hidden="true" />Lo último</h2><a href="/seccion/ultimas">Ver todo</a></header>
            {(() => {
              const items = latestArticles.filter((item) => item.slug !== slug).slice(0, 5);
              const [first, ...rest] = items;
              if (!first) return null;
              return <>
                <a className="vd-latest-feature" href={`/noticia/${first.slug}`}>
                  <EditorialMedia src={first.heroImageUrl || "/vd-noticias-logo.png"} alt={first.title} />
                  <span className="vd-latest-shade" aria-hidden="true" />
                  <span className="vd-latest-feature-text"><em>{sectionLabel(first.categorySlug)}</em><b>{first.title}</b><time>{timeAgo(first.publishedAt)}</time></span>
                </a>
                <ol className="vd-latest-list">
                  {rest.map((item) => <li key={item.slug}><a href={`/noticia/${item.slug}`}><span className="vd-latest-copy"><time>{timeAgo(item.publishedAt)} · {sectionLabel(item.categorySlug)}</time><b>{item.title}</b></span><EditorialMedia src={item.heroImageUrl || "/vd-noticias-logo.png"} alt="" /></a></li>)}
                </ol>
              </>;
            })()}
          </aside>
        </div>
        <div className="article-end"><div className="topic-tags" id="temas"><span>TEMAS</span><a href={`/seccion/${article.categorySlug}`}>{article.categorySlug}</a><a href="/seccion/nacionales">República Dominicana</a></div><aside className="author-card"><div className="avatar">VD</div><div><span>SOBRE EL AUTOR</span><b>{authorName}</b><p>Redacción responsable de verificar, contextualizar y actualizar la cobertura de VD Noticias.</p></div><a href="/autores/redaccion-vd-noticias">Ver perfil editorial</a></aside></div>
      </article>
      {recommended.length > 0 && <section className="container article-recommendations" aria-labelledby="recommendations-heading"><div className="article-recommendations-title"><h2 id="recommendations-heading">Noticias que te pueden interesar</h2><a href={`/seccion/${article.categorySlug}`}>Ver la sección</a></div><div className="article-recommendations-grid">{recommended.map((story) => <article key={story.slug}><a href={`/noticia/${story.slug}`}><EditorialMedia src={story.heroImageUrl || "/vd-noticias-logo.png"} alt={story.title} /><span>{story.categorySlug.toUpperCase()}</span><h3>{story.title}</h3><p>{story.summary}</p></a></article>)}</div></section>}
      <PageFooter />
    </main>
  );
}
