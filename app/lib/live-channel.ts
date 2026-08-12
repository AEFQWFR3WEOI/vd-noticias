import type { PublicBroadcastSettings } from "./public-content";

export type ChannelSource = "primary" | "backup" | "continuity" | "maintenance" | "offline";

export type ChannelStatus = {
  source: ChannelSource;
  url: string;
  live: boolean;
  label: "EN VIVO" | "SEÑAL 24/7" | "RESPALDO" | "CONTINUIDAD" | "MANTENIMIENTO" | "FUERA DEL AIRE";
  checkedAt: string;
};

function cloudflareLifecycleUrl(value: string) {
  try {
    const url = new URL(value);
    if (!/^customer-[a-z0-9-]+\.cloudflarestream\.com$/i.test(url.hostname)) return "";
    const inputId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    if (!/^[a-z0-9]{16,64}$/i.test(inputId)) return "";
    return `https://${url.hostname}/${inputId}/lifecycle`;
  } catch {
    return "";
  }
}

async function cloudflareInputIsLive(value: string) {
  const lifecycleUrl = cloudflareLifecycleUrl(value);
  if (!lifecycleUrl) return null;
  try {
    const response = await fetch(lifecycleUrl, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) return false;
    const result = await response.json() as { live?: boolean; isInput?: boolean };
    return result.isInput === true && result.live === true;
  } catch {
    return false;
  }
}

function status(source: ChannelSource, url: string, settings: PublicBroadcastSettings): ChannelStatus {
  const live = settings.isLive && (source === "primary" || source === "backup");
  const label = source === "maintenance"
    ? "MANTENIMIENTO"
    : source === "offline"
      ? "FUERA DEL AIRE"
      : live
        ? "EN VIVO"
        : source === "continuity"
          ? "CONTINUIDAD"
          : source === "backup"
            ? "RESPALDO"
            : "SEÑAL 24/7";
  return { source, url, live, label, checkedAt: new Date().toISOString() };
}

export function getInitialChannelStatus(settings: PublicBroadcastSettings) {
  if (!settings.enabled) return status("offline", "", settings);
  if (settings.sourceMode === "maintenance") return status("maintenance", "", settings);
  if (settings.sourceMode === "primary") return status(settings.primaryUrl ? "primary" : "offline", settings.primaryUrl, settings);
  if (settings.sourceMode === "backup") return status(settings.backupUrl ? "backup" : "offline", settings.backupUrl, settings);
  if (settings.sourceMode === "continuity") return status(settings.continuityUrl ? "continuity" : "offline", settings.continuityUrl, settings);
  if (settings.primaryUrl) return status("primary", settings.primaryUrl, settings);
  if (settings.backupUrl) return status("backup", settings.backupUrl, settings);
  if (settings.alwaysOn && settings.continuityUrl) return status("continuity", settings.continuityUrl, settings);
  return status("offline", "", settings);
}

export async function resolveChannelStatus(settings: PublicBroadcastSettings) {
  const initial = getInitialChannelStatus(settings);
  if (settings.sourceMode !== "automatic" || !settings.enabled) return initial;

  const [primaryHealth, backupHealth] = await Promise.all([
    settings.primaryUrl ? cloudflareInputIsLive(settings.primaryUrl) : Promise.resolve(false),
    settings.backupUrl ? cloudflareInputIsLive(settings.backupUrl) : Promise.resolve(false),
  ]);

  // A null result means a non-Cloudflare provider, whose health cannot be
  // inspected safely without provider credentials. It remains the active input.
  if (settings.primaryUrl && primaryHealth !== false) return status("primary", settings.primaryUrl, settings);
  if (settings.backupUrl && backupHealth !== false) return status("backup", settings.backupUrl, settings);
  if (settings.alwaysOn && settings.continuityUrl) return status("continuity", settings.continuityUrl, settings);
  return status("offline", "", settings);
}
