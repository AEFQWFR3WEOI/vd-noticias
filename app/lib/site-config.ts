export const SITE_NAME = "VD Noticias";
export const PUBLISHER_NAME = "Visión Dominicana TV";
export const SITE_DESCRIPTION =
  "Noticias verificadas de República Dominicana y el mundo, con contexto, fuentes, opinión y video de Visión Dominicana TV.";

const fallbackUrl = "https://periodico-digital-rd.miguel45156.chatgpt.site";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || fallbackUrl).replace(/\/$/, "");
export const DEFAULT_SHARE_IMAGE = `${SITE_URL}/vd-noticias-logo.png`;

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function formatPublishedDate(value?: string | null, includeTime = false) {
  if (!value) return "Fecha pendiente";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "long",
    ...(includeTime ? { timeStyle: "short" as const } : {}),
    timeZone: "America/Santo_Domingo",
  }).format(parsed);
}

