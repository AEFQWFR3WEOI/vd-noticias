import { getPublishedArticles } from "../lib/public-content";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/site-config";

export const dynamic = "force-dynamic";

function xml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await getPublishedArticles(undefined, 100);
  const items = articles.map((article) => `
    <item>
      <title>${xml(article.title)}</title>
      <link>${SITE_URL}/noticia/${xml(article.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/noticia/${xml(article.slug)}</guid>
      <description>${xml(article.summary)}</description>
      <category>${xml(article.categorySlug)}</category>
      <pubDate>${new Date(article.publishedAt || article.createdAt).toUTCString()}</pubDate>
    </item>`).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
    <title>${xml(SITE_NAME)}</title><link>${SITE_URL}</link><description>${xml(SITE_DESCRIPTION)}</description>
    <language>es-DO</language><atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel></rss>`;
  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=900" } });
}

