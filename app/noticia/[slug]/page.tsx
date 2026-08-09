/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import EditorialMedia, { getMediaKind } from "../../components/EditorialMedia";
import { PageFooter, PageHeader } from "../../components/PageChrome";
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const result = await getArticleWithCanonical(slug);
  if (!result) notFound();
  if (result.canonical.slug !== slug) permanentRedirect(`/noticia/${result.canonical.slug}`);
  const article = result.article;
  const { paragraphs, sources } = parseArticleBody(article.body);
  const mediaKind = getMediaKind(article.heroImageUrl || "");
  const titleSize = article.title.length > 115 ? "article-title--extra-long" : article.title.length > 78 ? "article-title--long" : article.title.length > 55 ? "article-title--medium" : "";
  const [authorName, sameCategory, latestArticles] = await Promise.all([
    getArticleAuthorName(article.authorEmail),
    getPublishedArticles(article.categorySlug, 8),
    getPublishedArticles(undefined, 16),
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
        <p className="article-deck">{article.summary}</p>
        <div className="article-byline"><div className="avatar article-avatar"><img src="/vd-noticias-logo.png" alt="VD Noticias" width="96" height="96" /></div><div><b><a href="/autores/redaccion-vd-noticias">{authorName}</a></b><span>Santo Domingo · Publicado <time dateTime={article.publishedAt || article.createdAt}>{formatPublishedDate(article.publishedAt || article.createdAt, true)}</time> · <i>{minutes} min de lectura</i></span>{article.updatedAt !== article.createdAt && <small>Actualizado <time dateTime={article.updatedAt}>{formatPublishedDate(article.updatedAt, true)}</time></small>}</div></div>
        <nav className="article-share-bar" aria-label="Compartir noticia"><a className="whatsapp" href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir por WhatsApp">wa</a><a className="facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir en Facebook">f</a><a className="x-social" href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir en X">𝕏</a><a className="email" href={`mailto:?subject=${shareText}&body=${shareUrl}`} aria-label="Compartir por correo">✉</a><a className="telegram" href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noreferrer" aria-label="Compartir por Telegram">➤</a></nav>
        {article.heroImageUrl && <figure className={`article-hero-media ${mediaKind}`}><EditorialMedia src={article.heroImageUrl} alt={article.title} controls priority /><figcaption>{mediaKind === "video" ? "Video" : mediaKind === "audio" ? "Audio" : "Imagen"} principal de la cobertura · VD Noticias.</figcaption></figure>}
        <div className="article-layout pro-article-layout">
          <aside className="share-rail"><b>COMPARTIR</b><a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer">f</a><a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer">X</a><a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer">wa</a></aside>
          <div className="article-body">
            {paragraphs.map((paragraph, index) => <div key={`${paragraph.slice(0, 24)}-${index}`}><p className={index === 0 ? "dropcap" : ""}>{paragraph}</p>{index === 2 && <aside className="article-ad"><span>PUBLICIDAD</span><strong>Espacio publicitario identificado</strong><small>La publicidad no interviene en las decisiones editoriales.</small></aside>}</div>)}
            {sources.length > 0 && <section className="article-sources" aria-labelledby="sources-title"><span>DOCUMENTACIÓN</span><h2 id="sources-title">Fuentes consultadas</h2><ul>{sources.map((source, index) => <li key={`${source.name}-${index}`}>{source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer nofollow">{source.name} ↗</a> : source.name}</li>)}</ul></section>}
            <aside className="coverage-transparency"><span>TRANSPARENCIA</span><h2>Sobre esta cobertura</h2><dl><div><dt>Autoría</dt><dd>{authorName}</dd></div><div><dt>Sección</dt><dd>{article.categorySlug}</dd></div><div><dt>Extensión</dt><dd>{wordCount(article.body)} palabras</dd></div><div><dt>Correcciones</dt><dd><a href="/contacto?asunto=correccion">Reportar un dato →</a></dd></div></dl></aside>
          </div>
          <aside className="most-read article-visual-latest"><span>ÚLTIMAS NOTICIAS</span>{latestArticles.filter((item) => item.slug !== slug).slice(0, 5).map((item) => <article key={item.slug}><a href={`/noticia/${item.slug}`}><EditorialMedia src={item.heroImageUrl || "/vd-noticias-logo.png"} alt={item.title} /><div><small>{item.categorySlug.toUpperCase()}</small><h3>{item.title}</h3><p>{item.summary}</p></div></a></article>)}</aside>
        </div>
        <div className="article-end"><div className="topic-tags" id="temas"><span>TEMAS</span><a href={`/seccion/${article.categorySlug}`}>{article.categorySlug}</a><a href="/seccion/nacionales">República Dominicana</a></div><aside className="author-card"><div className="avatar">VD</div><div><span>SOBRE EL AUTOR</span><b>{authorName}</b><p>Redacción responsable de verificar, contextualizar y actualizar la cobertura de VD Noticias.</p></div><a href="/autores/redaccion-vd-noticias">Ver perfil editorial →</a></aside></div>
      </article>
      {recommended.length > 0 && <section className="container article-recommendations" aria-labelledby="recommendations-heading"><div className="article-recommendations-title"><h2 id="recommendations-heading">Noticias que te pueden interesar</h2><a href={`/seccion/${article.categorySlug}`}>Ver la sección →</a></div><div className="article-recommendations-grid">{recommended.map((story) => <article key={story.slug}><a href={`/noticia/${story.slug}`}><EditorialMedia src={story.heroImageUrl || "/vd-noticias-logo.png"} alt={story.title} /><span>{story.categorySlug.toUpperCase()}</span><h3>{story.title}</h3><p>{story.summary}</p></a></article>)}</div></section>}
      <PageFooter />
    </main>
  );
}
