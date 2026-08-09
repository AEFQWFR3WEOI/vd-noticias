import type { Metadata } from "next";
import EditorialMedia from "../../components/EditorialMedia";
import { PageFooter, PageHeader } from "../../components/PageChrome";
import { getPublishedArticles } from "../../lib/public-content";
import { absoluteUrl, SITE_URL } from "../../lib/site-config";

export const metadata: Metadata = { title: "Redacción VD Noticias", description: "Perfil de la redacción colectiva responsable de las coberturas de VD Noticias.", alternates: { canonical: "/autores/redaccion-vd-noticias" } };

export default async function AuthorPage() {
  const articles = await getPublishedArticles(undefined, 24);
  const schema = { "@context": "https://schema.org", "@type": "Organization", "@id": `${SITE_URL}/#newsroom`, name: "Redacción VD Noticias", url: absoluteUrl("/autores/redaccion-vd-noticias"), parentOrganization: { "@id": `${SITE_URL}/#organization` }, knowsAbout: ["República Dominicana", "Política", "Economía", "Deportes", "Cultura", "Tecnología"] };
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><PageHeader /><section className="container simple-page author-profile"><span>AUTORÍA INSTITUCIONAL</span><h1>Redacción VD Noticias</h1><p>Firma colectiva de periodistas y editores de VD Noticias. Se utiliza cuando una cobertura es producida o actualizada por varias personas bajo supervisión editorial.</p><div className="author-standards"><b>Especialidades</b><p>Actualidad dominicana, política pública, economía, deportes, cultura, tecnología y asuntos internacionales.</p><b>Estándar</b><p>Fuentes identificadas, revisión humana antes de publicar y corrección transparente.</p><a href="/nosotros#metodologia">Conocer la metodología →</a></div><div className="deep-section-title"><h2>Publicaciones recientes</h2></div><div className="pro-archive-grid">{articles.slice(0, 12).map((article) => <article key={article.slug}><a href={`/noticia/${article.slug}`}><EditorialMedia src={article.heroImageUrl || "/vd-noticias-logo.png"} alt={article.title} /><span>{article.categorySlug.toUpperCase()}</span><h3>{article.title}</h3></a><p>{article.summary}</p></article>)}</div></section><PageFooter /></main>;
}
