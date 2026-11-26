// Voz que resume la noticia: Azure Speech (voces con acento dominicano).
// Variables en Cloudflare: AZURE_SPEECH_KEY (secreto), AZURE_SPEECH_REGION
// (p. ej. "eastus") y, opcional, AZURE_SPEECH_VOICE (por defecto
// "es-DO-RamonaNeural"; la voz masculina es "es-DO-EmilioNeural").

type SpeechEnv = { AZURE_SPEECH_KEY?: string; AZURE_SPEECH_REGION?: string; AZURE_SPEECH_VOICE?: string };

const DEFAULT_VOICE = "es-DO-RamonaNeural";
const MAX_CHARS = 900;

export async function speechConfig() {
  const { env } = await import("cloudflare:workers");
  const vars = env as unknown as SpeechEnv;
  const key = String(vars.AZURE_SPEECH_KEY ?? "").trim();
  const region = String(vars.AZURE_SPEECH_REGION ?? "").trim().toLowerCase();
  const voice = String(vars.AZURE_SPEECH_VOICE ?? "").trim() || DEFAULT_VOICE;
  if (!key || !/^[a-z0-9]+$/.test(region)) return null;
  return { key, region, voice };
}

export async function isSpeechEnabled() {
  return (await speechConfig()) !== null;
}

/** Texto que se narra: titular, resumen y el inicio de la noticia (~1 minuto). */
export function narrationText(article: { title: string; summary: string; body: string }) {
  const parts = [article.title.trim().replace(/[.:]$/, "") + ".", article.summary.trim()];
  let text = parts.filter(Boolean).join(" ");
  const paragraphs = article.body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("Fuente consultada:"));
  for (const paragraph of paragraphs) {
    if (text.length >= MAX_CHARS * 0.6) break;
    text += " " + paragraph;
  }
  if (text.length > MAX_CHARS) {
    const cut = text.slice(0, MAX_CHARS);
    const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
    text = lastStop > MAX_CHARS * 0.5 ? cut.slice(0, lastStop + 1) : cut.replace(/\s+\S*$/, "") + ".";
  }
  return text.replace(/\s+/g, " ").trim();
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char] as string);
}

export async function synthesize(text: string) {
  const config = await speechConfig();
  if (!config) throw new Error("Azure Speech no está configurado");
  const ssml = `<speak version="1.0" xml:lang="es-DO"><voice name="${escapeXml(config.voice)}"><prosody rate="+4%">${escapeXml(text)}</prosody></voice></speak>`;
  const response = await fetch(`https://${config.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": config.key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
      "User-Agent": "vd-noticias",
    },
    body: ssml,
  });
  if (!response.ok) throw new Error(`Azure Speech respondió ${response.status}`);
  return new Uint8Array(await response.arrayBuffer());
}

export async function textHash(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].slice(0, 8).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
