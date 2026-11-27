export const SITE_NAME = "VD Noticias";
export const PUBLISHER_NAME = "Visión Dominicana TV";
export const SITE_DESCRIPTION =
  "Noticias verificadas de República Dominicana y el mundo, con contexto, fuentes, opinión y video de Visión Dominicana TV.";

const fallbackUrl = "https://visiondominicanatv.com";

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


// WhatsApp de denuncias (el mismo que aparece en los reels) y canal de WhatsApp.
export const WHATSAPP_NUMBER = "18299123075";
export const WHATSAPP_DISPLAY = "+1 (829) 912-3075";
// Pega aquí el enlace del canal de WhatsApp cuando exista (https://whatsapp.com/channel/…).
export const WHATSAPP_CHANNEL_URL = "";

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
