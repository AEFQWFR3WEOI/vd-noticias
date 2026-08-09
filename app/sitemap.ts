import type { MetadataRoute } from "next";
import { getPublishedArticles } from "./lib/public-content";
import { SITE_URL } from "./lib/site-config";

const staticPages = ["", "/nosotros", "/contacto", "/terminos", "/publicidad", "/buscar"];
const sections = ["nacionales", "politica", "economia", "mundo", "deportes", "entretenimiento", "tecnologia", "salud", "educacion", "turismo", "cultura", "opinion", "planeta", "videos"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles(undefined, 1000);
  const now = new Date();
  return [
    ...staticPages.map((path) => ({ url: `${SITE_URL}${path || "/"}`, lastModified: now, changeFrequency: path ? "monthly" as const : "hourly" as const, priority: path ? 0.6 : 1 })),
    ...sections.map((slug) => ({ url: `${SITE_URL}/seccion/${slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/noticia/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.publishedAt || now),
      changeFrequency: "weekly" as const,
      priority: article.isFeatured ? 0.9 : 0.7,
      images: article.heroImageUrl ? [new URL(article.heroImageUrl, SITE_URL).toString()] : undefined,
    })),
  ];
}

