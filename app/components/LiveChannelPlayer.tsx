"use client";
/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import type { PublicBroadcastSettings } from "../lib/public-content";
import { getInitialChannelStatus, type ChannelStatus } from "../lib/live-channel";

function streamKind(url: string) {
  if (!url) return "empty";
  if (/\/api\/media\/|\.(mp4|webm|ogg)(\?|$)/i.test(url)) return "video";
  return "embed";
}

function embedUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${url.pathname.split("/").filter(Boolean)[0]}?autoplay=1&mute=1`;
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v") || url.pathname.match(/\/(?:live|embed)\/([^/?]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1` : value;
    }
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1&muted=1` : value;
    }
    return value;
  } catch {
    return value;
  }
}

export default function LiveChannelPlayer({ settings }: { settings: PublicBroadcastSettings }) {
  const [channel, setChannel] = useState<ChannelStatus>(() => getInitialChannelStatus(settings));

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/live-status", { headers: { accept: "application/json" } });
      if (response.ok) setChannel(await response.json() as ChannelStatus);
    } catch {
      // Keep the last working source during a temporary status-service outage.
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const kind = streamKind(channel.url);
  const showOffline = kind === "empty";
  return (
    <>
      {kind === "video" ? <video key={channel.url} src={channel.url} controls autoPlay muted playsInline loop={channel.source === "continuity"} poster={settings.posterUrl || undefined} onError={() => void refresh()} /> : kind === "embed" ? <iframe key={channel.url} src={embedUrl(channel.url)} title={settings.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <div className="vd-live-offline" style={settings.posterUrl ? { backgroundImage: `linear-gradient(90deg, rgba(1, 13, 39, .9), rgba(1, 45, 116, .55)), url(${settings.posterUrl})` } : undefined}><img src="/vd-noticias-logo.png" alt="VD Noticias" /><span>{channel.source === "maintenance" ? "MANTENIMIENTO PROGRAMADO" : "CANAL VD 24/7"}</span><b>{channel.source === "maintenance" ? "Volvemos en breve" : "Preparando la señal permanente"}</b><small>{showOffline ? "Configura las fuentes desde el Centro de control de transmisión." : "La señal se actualizará automáticamente."}</small></div>}
      <div className={`vd-live-badge ${channel.live ? "is-live" : channel.source === "continuity" || channel.source === "primary" ? "is-continuous" : ""}`}><i />{channel.label}</div>
      {channel.source === "backup" && <div className="vd-live-source-note">RESPALDO ACTIVO</div>}
    </>
  );
}
