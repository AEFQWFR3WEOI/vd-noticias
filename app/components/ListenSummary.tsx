"use client";

import { useRef, useState } from "react";

type Props = { slug: string };

// Botón «Escuchar resumen» de cada noticia.
export default function ListenSummary({ slug }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (state === "playing") {
      audio.pause();
      return;
    }
    if (state === "idle" || state === "error") {
      setState("loading");
      audio.src = `/api/audio/${encodeURIComponent(slug)}`;
    }
    try {
      await audio.play();
    } catch {
      setState("error");
    }
  }

  const format = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  const label = state === "playing" ? "Pausar" : state === "loading" ? "Preparando audio…" : state === "paused" ? "Continuar" : state === "error" ? "Reintentar" : "Escuchar resumen";

  return (
    <div className={`listen-summary is-${state}`}>
      <button type="button" onClick={() => void toggle()} disabled={state === "loading"} aria-label={label}>
        <span className="listen-icon" aria-hidden="true">{state === "playing" ? "❚❚" : "▶"}</span>
        <span className="listen-text">
          <b>{label}</b>
          <small>{state === "error" ? "No se pudo cargar el audio" : duration ? `${format(progress)} / ${format(duration)}` : "Voz VD · aprox. 1 minuto"}</small>
        </span>
      </button>
      <div className="listen-bar" aria-hidden="true"><i style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }} /></div>
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => setState("playing")}
        onPause={() => setState((value) => (value === "playing" ? "paused" : value))}
        onEnded={() => { setState("idle"); setProgress(0); }}
        onError={() => setState("error")}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
      />
    </div>
  );
}
