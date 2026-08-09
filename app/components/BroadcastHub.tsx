/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import type { BroadcastHubData, PublicBroadcastProgram, PublicVideo } from "../lib/public-content";

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

function formatTime(value: string) {
  const [hourValue, minute = "00"] = value.split(":");
  const hour = Number(hourValue);
  if (!Number.isFinite(hour)) return value;
  const suffix = hour >= 12 ? "p. m." : "a. m.";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function ProgramArt({ program }: { program: PublicBroadcastProgram }) {
  if (program.coverImageUrl) return <img src={program.coverImageUrl} alt={program.title} loading="lazy" />;
  return <div className="program-art-fallback"><img src="/vd-noticias-logo.png" alt="" /><strong>{program.title.split(" ").slice(0, 2).map((word) => word[0]).join("")}</strong></div>;
}

function ProgramCard({ program }: { program: PublicBroadcastProgram }) {
  const href = program.destinationUrl || "/programacion#programas";
  return (
    <article className="vd-program-card">
      <a href={href}>
        <div className="vd-program-art"><ProgramArt program={program} /><span>{program.kind === "podcast" ? "PÓDCAST" : "PROGRAMA"}</span></div>
        <div className="vd-program-copy">
          <small>{program.scheduleDay}{program.scheduleTime ? ` · ${formatTime(program.scheduleTime)}` : ""}</small>
          <h3>{program.title}</h3>
          <p>{program.description}</p>
          <b>{program.presenter || "Equipo VD"}</b>
        </div>
      </a>
    </article>
  );
}

export default function BroadcastHub({ data, videos, expanded = false }: { data: BroadcastHubData; videos: PublicVideo[]; expanded?: boolean }) {
  const { settings, programs } = data;
  const playerKind = streamKind(settings.streamUrl);
  const schedule = programs.slice(0, expanded ? 8 : 4);
  const videoLimit = expanded ? 8 : 4;
  return (
    <section className={`vd-media-hub ${expanded ? "expanded" : ""}`} id="en-vivo">
      <div className="container">
        <header className="vd-media-heading">
          <div><span><i /> VD MEDIA CENTER</span><h2>La noticia se ve, se escucha y se vive</h2><p>Señal en vivo, videos, programas y pódcasts de Visión Dominicana TV.</p></div>
          {!expanded && <a href="/programacion">Abrir programación completa →</a>}
        </header>

        <div className="vd-live-stage">
          <article className="vd-live-player">
            <div className="vd-live-screen">
              {playerKind === "video" ? <video src={settings.streamUrl} controls autoPlay muted playsInline poster={settings.posterUrl || undefined} /> : playerKind === "embed" ? <iframe src={embedUrl(settings.streamUrl)} title={settings.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <div className="vd-live-offline" style={settings.posterUrl ? { backgroundImage: `linear-gradient(90deg, rgba(1, 13, 39, .9), rgba(1, 45, 116, .55)), url(${settings.posterUrl})` } : undefined}><img src="/vd-noticias-logo.png" alt="VD Noticias" /><span>PRÓXIMA TRANSMISIÓN</span><b>La señal en vivo aparecerá aquí</b><small>Actívala desde Emisión y programación en la sala de redacción.</small></div>}
              <div className={`vd-live-badge ${settings.isLive ? "is-live" : ""}`}><i />{settings.isLive ? "EN VIVO" : "PRÓXIMAMENTE"}</div>
            </div>
            <div className="vd-live-copy"><span>SEÑAL DE VISIÓN DOMINICANA TV</span><h3>{settings.title}</h3><p>{settings.description}</p>{settings.streamUrl ? <a href={settings.streamUrl} target="_blank" rel="noreferrer">Abrir transmisión ↗</a> : <a href="/programacion#programas">Conocer los programas →</a>}</div>
          </article>

          <aside className="vd-on-air">
            <header><div><span>EN ANTENA</span><h3>Programación</h3></div><time>Hora RD</time></header>
            <div className="vd-schedule-list">
              {schedule.map((program, index) => <article key={program.id}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{program.scheduleDay}</small><h4>{program.title}</h4><p>{program.kind === "podcast" ? "Pódcast" : "Programa"}{program.scheduleTime ? ` · ${formatTime(program.scheduleTime)}` : ""}</p></div></article>)}
            </div>
            <a className="vd-schedule-link" href="/programacion#programas">Ver todos los espacios →</a>
          </aside>
        </div>

        <div className="vd-video-block" id="videos">
          <div className="vd-media-subheading"><div><span>VD PLAY</span><h3>La noticia también se ve</h3></div><a href="/seccion/videos">Todos los videos →</a></div>
          {videos.length ? <div className="vd-video-emphasis">
            <article className="vd-video-featured"><video src={videos[0].url} controls preload="metadata" playsInline /><div><span>{videos[0].articleCategorySlug.toUpperCase()}</span><h3><a href={`/noticia/${videos[0].articleSlug}`}>{videos[0].articleTitle}</a></h3><p>{videos[0].articleSummary}</p><a href={`/noticia/${videos[0].articleSlug}`}>Ver noticia completa →</a></div></article>
            <div className="vd-video-rail">{videos.slice(1, videoLimit).map((video) => <article key={video.id}><video src={video.url} controls preload="metadata" playsInline /><span>{video.articleCategorySlug.toUpperCase()}</span><h4><a href={`/noticia/${video.articleSlug}`}>{video.articleTitle}</a></h4><p>{video.articleSummary}</p></article>)}</div>
          </div> : <div className="vd-video-empty"><span>VD PLAY</span><h3>Los próximos reportajes en video aparecerán aquí</h3><p>Al publicar una noticia con video desde la sala de redacción, se integrará automáticamente.</p></div>}
        </div>

        <div className="vd-program-block" id="programas">
          <div className="vd-media-subheading"><div><span>ORIGINALES VD</span><h3>Programas y pódcasts</h3></div><p>Información, conversación y análisis con identidad dominicana.</p></div>
          <div className="vd-program-rail">{programs.slice(0, expanded ? 12 : 6).map((program) => <ProgramCard program={program} key={program.id} />)}</div>
        </div>
      </div>
    </section>
  );
}
