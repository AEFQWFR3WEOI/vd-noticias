import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/redaccion", "/api/"] },
      { userAgent: "Googlebot-News", allow: ["/noticia/", "/seccion/"] },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap-news.xml`],
    host: SITE_URL,
  };
}

