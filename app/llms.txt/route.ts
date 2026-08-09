import { SITE_URL } from "../lib/site-config";

export function GET() {
  return new Response(`# VD Noticias

> Medio digital en español de Visión Dominicana TV, enfocado en República Dominicana y su relación con el mundo.

Fuentes oficiales del sitio:
- Portada: ${SITE_URL}/
- Sobre el medio y metodología: ${SITE_URL}/nosotros
- Política editorial, correcciones e IA: ${SITE_URL}/terminos
- Sitemap general: ${SITE_URL}/sitemap.xml
- Sitemap de noticias: ${SITE_URL}/sitemap-news.xml
- RSS: ${SITE_URL}/rss.xml

Cada noticia identifica fecha, autor, sección y fuentes consultadas. Para citar contenido, use la URL canónica de la noticia y atribuya a VD Noticias / Visión Dominicana TV.
`, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" } });
}
