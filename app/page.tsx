/* eslint-disable @next/next/no-html-link-for-pages */
import EditorialMedia from "./components/EditorialMedia";
import NewsletterForm from "./components/NewsletterForm";
import { PageFooter, PageHeader } from "./components/PageChrome";
import { SmartBriefing } from "./components/SmartNewsDesk";
import LatestNewsStage from "./components/LatestNewsStage";
import BroadcastHub from "./components/BroadcastHub";
import { getBroadcastHub, getPublishedArticles, getRecentVideos, type PublicArticle } from "./lib/public-content";
import { absoluteUrl, PUBLISHER_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site-config";

export const dynamic = "force-dynamic";

const sectionLabels: Record<string, string> = {
  nacionales: "Nacionales",
  politica: "Política",
  economia: "Economía",
  mundo: "Mundo",
  deportes: "Deportes",
  entretenimiento: "Entretenimiento",
  revista: "Revista",
  tecnologia: "Tecnología",
  salud: "Salud",
  educacion: "Educación",
  turismo: "Turismo",
  cultura: "Cultura",
  opinion: "Opinión",
  planeta: "Planeta",
};

const sectionOrder = ["nacionales", "politica", "economia", "mundo", "deportes", "entretenimiento", "planeta", "opinion"];

function articleImage(article: PublicArticle) {
  return article.heroImageUrl || "/vd-noticias-logo.png";
}

function readingTime(article: PublicArticle) {
  return Math.max(2, Math.ceil(article.body.trim().split(/\s+/).length / 210));
}

function StoryCard({ article, priority = false }: { article: PublicArticle; priority?: boolean }) {
  return (
    <article className="vd-story-card">
      <a href={`/noticia/${article.slug}`}>
        <EditorialMedia src={articleImage(article)} alt={article.title} priority={priority} />
        <span>{(sectionLabels[article.categorySlug] || article.categorySlug).toUpperCase()}</span>
        <h3>{article.title}</h3>
      </a>
      <p>{article.summary}</p>
      <small>{readingTime(article)} min de lectura</small>
    </article>
  );
}

function EditorialSection({ slug, articles }: { slug: string; articles: PublicArticle[] }) {
  if (!articles.length) return null;
  const [lead, ...rest] = articles;
  const label = sectionLabels[slug] || slug;
  return (
    <section className="deep-editorial-section" id={slug}>
      <div className="deep-section-title"><h2>{label}</h2><a href={`/seccion/${slug}`}>Ver toda la sección →</a></div>
      <div className="deep-lead-grid real-news-grid">
        <article className="deep-main-story">
          <a href={`/noticia/${lead.slug}`}><EditorialMedia src={articleImage(lead)} alt={lead.title} /><span>{label.toUpperCase()}</span><h3>{lead.title}</h3></a>
          <p>{lead.summary}</p><small>{readingTime(lead)} min de lectura</small>
        </article>
        <div className="deep-right-list visual-story-list">
          {rest.slice(0, 3).map((article) => <article key={article.slug}><a href={`/noticia/${article.slug}`}><EditorialMedia src={articleImage(article)} alt={article.title} /><div><span>{(sectionLabels[article.categorySlug] || article.categorySlug).toUpperCase()}</span><h3>{article.title}</h3><p>{article.summary}</p><small>{readingTime(article)} min de lectura</small></div></a></article>)}
        </div>
      </div>
      {rest.length > 3 && <div className="deep-card-row">{rest.slice(3, 7).map((article) => <StoryCard article={article} key={article.slug} />)}</div>}
    </section>
  );
}

export default async function Home() {
  const [published, uploadedVideos, broadcastHub] = await Promise.all([
    getPublishedArticles(undefined, 100),
    getRecentVideos(8),
    getBroadcastHub(),
  ]);
  const lead = published.find((article) => article.isFeatured) || published[0];
  const secondary = published.filter((article) => article.slug !== lead?.slug).slice(0, 4);
  const breaking = published.find((article) => article.isBreaking) || lead;
  const sections = new Map(sectionOrder.map((slug) => [slug, published.filter((article) => article.categorySlug === slug)]));
  const briefing = published.slice(0, 18).map((article) => ({ slug: article.slug, title: article.title, summary: article.summary, category: sectionLabels[article.categorySlug] || article.categorySlug }));
  const latestStageArticles = published.slice(0, 8).map((article) => ({
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    category: sectionLabels[article.categorySlug] || article.categorySlug,
    categorySlug: article.categorySlug,
    image: articleImage(article),
    time: article.publishedAt ? new Date(article.publishedAt).toLocaleTimeString("es-DO", { hour: "numeric", minute: "2-digit", timeZone: "America/Santo_Domingo" }) : "Ahora",
    publishedAt: article.publishedAt,
    readingMinutes: readingTime(article),
  }));
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "NewsMediaOrganization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, alternateName: PUBLISHER_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: absoluteUrl("/vd-noticias-logo.png") }, publishingPrinciples: absoluteUrl("/terminos"), ethicsPolicy: absoluteUrl("/terminos#etica"), correctionsPolicy: absoluteUrl("/terminos#correcciones"), contactPoint: { "@type": "ContactPoint", contactType: "newsroom", url: absoluteUrl("/contacto"), availableLanguage: ["es"] } },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, description: SITE_DESCRIPTION, publisher: { "@id": `${SITE_URL}/#organization` }, inLanguage: "es-DO", potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/buscar?q={search_term_string}` }, "query-input": "required name=search_term_string" } },
    ],
  };

  return (
    <main className="public-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
      <PageHeader active="Portada" showAd />

      {breaking && <section className="news-alert"><div className="container news-alert-inner"><strong>ÚLTIMA HORA</strong><a href={`/noticia/${breaking.slug}`}>{breaking.title}</a><time dateTime={breaking.publishedAt || undefined}>Ahora</time></div></section>}

      <div className="container front-page">
        {lead ? (
          <section className="front-grid" aria-labelledby="portada-heading">
            <h1 id="portada-heading" className="sr-only">Portada de VD Noticias</h1>
            <article className="front-lead">
              <a href={`/noticia/${lead.slug}`}><div className="front-lead-media"><EditorialMedia src={articleImage(lead)} alt={lead.title} priority /><span>{(sectionLabels[lead.categorySlug] || lead.categorySlug).toUpperCase()}</span></div><h2>{lead.title}</h2></a>
              <p>{lead.summary}</p><div className="editorial-meta"><b>Redacción VD Noticias</b><span>{readingTime(lead)} min de lectura</span></div>
            </article>
            <div className="front-secondary">
              {secondary.slice(0, 3).map((article) => <StoryCard article={article} key={article.slug} />)}
            </div>
            <aside className="front-most-read front-visual-selection"><header><span>CURADURÍA HUMANA</span><h2>Selección editorial</h2></header><div className="front-curated-grid">{published.slice(5, 9).map((article) => <article key={article.slug}><a href={`/noticia/${article.slug}`}><EditorialMedia src={articleImage(article)} alt={article.title} /><div><span>{(sectionLabels[article.categorySlug] || article.categorySlug).toUpperCase()}</span><h3>{article.title}</h3><p>{article.summary}</p></div></a></article>)}</div><a className="all-link" href="/seccion/ultimas">Ver todas las noticias →</a></aside>
          </section>
        ) : <section className="empty-publication"><span>VD NOTICIAS</span><h1>La próxima edición está en preparación</h1><p>La redacción publicará aquí las informaciones verificadas.</p></section>}

        {latestStageArticles.length > 4 && <LatestNewsStage articles={latestStageArticles} />}
      </div>

      <BroadcastHub data={broadcastHub} videos={uploadedVideos} />

      <div className="container front-page-after-media">
        {briefing.length > 0 && <div className="smart-briefing-shell"><SmartBriefing articles={briefing} /></div>}
        <aside className="pro-inline-ad" aria-label="Publicidad horizontal"><span>PUBLICIDAD · SUPER BANNER 970 × 90</span><div><b>Su empresa frente a una audiencia informada</b><a href="/publicidad">Solicitar propuesta comercial →</a></div></aside>
      </div>

      <div className="container complete-newspaper">
        {sectionOrder.map((slug) => <EditorialSection slug={slug} articles={sections.get(slug) || []} key={slug} />)}
      </div>

      <section className="services-section"><div className="container services-grid"><article><span>01</span><div><b>Resumen inteligente</b><p>Una portada personalizada con noticias realmente publicadas.</p><a href="#smart-briefing-title">Personalizar →</a></div></article><article><span>02</span><div><b>Fuentes visibles</b><p>La documentación aparece junto a cada cobertura.</p><a href="/terminos#fuentes">Conocer el estándar →</a></div></article><article><span>03</span><div><b>Archivo abierto</b><p>Busca personas, lugares y temas en toda la edición.</p><a href="/buscar">Buscar →</a></div></article><article><span>04</span><div><b>RSS para lectores y sistemas</b><p>Un canal estructurado para seguir las publicaciones.</p><a href="/rss.xml">Abrir RSS →</a></div></article></div></section>

      <section className="newsletter pro-newsletter" id="boletin"><div className="container newsletter-inner"><div><span>EL RESUMEN VD</span><h2>Lo esencial, directo a tu correo</h2><p>Noticias verificadas, contexto y las claves del día. Puedes darte de baja cuando quieras.</p></div><NewsletterForm /></div></section>
      <PageFooter />
    </main>
  );
}
