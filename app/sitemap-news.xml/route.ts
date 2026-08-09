import { getPublishedArticles } from "../lib/public-content";
import { PUBLISHER_NAME, SITE_URL } from "../lib/site-config";

export const dynamic = "force-dynamic";

function xml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const articles = (await getPublishedArticles(undefined, 1000)).filter((article) => new Date(article.publishedAt || article.createdAt).getTime() >= cutoff);
  const urls = articles.map((article) => `
    <url><loc>${SITE_URL}/noticia/${xml(article.slug)}</loc><news:news>
      <news:publication><news:name>${xml(PUBLISHER_NAME)}</news:name><news:language>es</news:language></news:publication>
      <news:publication_date>${new Date(article.publishedAt || article.createdAt).toISOString()}</news:publication_date>
      <news:title>${xml(article.title)}</news:title>
    </news:news></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}</urlset>`, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=900" },
  });
}

