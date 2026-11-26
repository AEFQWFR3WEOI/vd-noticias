/* eslint-disable @next/next/no-html-link-for-pages */
import EditorialMedia from "./EditorialMedia";

// Secciones de la portada, cada una con un diseño propio (apertura, franja,
// sobria, visual, compacta y opinión). Todas se adaptan al teléfono.

export type HomeStory = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  publishedAt: string | null;
};

type Layout = "apertura" | "franja" | "sobria" | "visual" | "compacta" | "opinion";

type SectionConfig = { slug: string; label: string; layout: Layout; subsections: string[] };

export const HOME_SECTIONS: SectionConfig[] = [
  { slug: "nacionales", label: "Nacionales", layout: "apertura", subsections: ["Ciudad", "Justicia", "Educación", "Salud", "Sucesos"] },
  { slug: "politica", label: "Política", layout: "franja", subsections: ["Gobierno", "Congreso", "Partidos", "Elecciones"] },
  { slug: "economia", label: "Economía", layout: "sobria", subsections: ["Finanzas", "Empleo", "Negocios", "Turismo", "Energía"] },
  { slug: "deportes", label: "Deportes", layout: "visual", subsections: ["Béisbol", "Baloncesto", "Fútbol", "Olimpismo"] },
  { slug: "mundo", label: "Mundo", layout: "compacta", subsections: ["Estados Unidos", "América Latina", "Haití", "Europa"] },
  { slug: "entretenimiento", label: "Entretenimiento", layout: "apertura", subsections: ["Música", "Cine", "Farándula", "Cultura"] },
  { slug: "opinion", label: "Opinión", layout: "opinion", subsections: ["Editorial", "Columnistas"] },
  { slug: "planeta", label: "Planeta", layout: "compacta", subsections: ["Medioambiente", "Ciencia", "Clima"] },
];

const slugOf = (value: string) =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function timeLabel(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (Number.isNaN(minutes)) return "";
  if (minutes < 60) return `Hace ${Math.max(1, minutes)} min`;
  if (minutes < 24 * 60) return `Hace ${Math.round(minutes / 60)} h`;
  return new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "long", timeZone: "America/Santo_Domingo" }).format(date);
}

const href = (story: HomeStory) => `/noticia/${story.slug}`;

function SectionHeader({ config, dark = false }: { config: SectionConfig; dark?: boolean }) {
  return (
    <header className={`hs-head${dark ? " is-dark" : ""}`}>
      <h2><a href={`/seccion/${config.slug}`}>{config.label}</a></h2>
      <nav aria-label={`Subsecciones de ${config.label}`}>
        {config.subsections.map((name) => <a key={name} href={`/seccion/${slugOf(name)}`}>{name}</a>)}
      </nav>
      <a className="hs-more" href={`/seccion/${config.slug}`}>Más de {config.label}</a>
    </header>
  );
}

function Thumb({ story, priority = false }: { story: HomeStory; priority?: boolean }) {
  return <span className="hs-media"><EditorialMedia src={story.image} alt={story.title} priority={priority} /></span>;
}

function Apertura({ stories }: { stories: HomeStory[] }) {
  const [lead, ...rest] = stories;
  return (
    <>
      <article className="hs-apertura-lead">
        <a href={href(lead)} className="hs-apertura-media"><Thumb story={lead} /></a>
        <div>
          <h3><a href={href(lead)}>{lead.title}</a></h3>
          <p>{lead.summary}</p>
          <time>{timeLabel(lead.publishedAt)}</time>
        </div>
      </article>
      {rest.length > 0 && (
        <div className={`hs-row hs-row-${Math.min(rest.length, 4)}`}>
          {rest.slice(0, 4).map((story) => (
            <article key={story.slug} className="hs-card">
              <a href={href(story)}><Thumb story={story} /><h4>{story.title}</h4></a>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function Franja({ stories }: { stories: HomeStory[] }) {
  const cards = stories.slice(0, 3);
  const extra = stories.slice(3, 6);
  return (
    <>
      <div className={`hs-franja-grid hs-row-${cards.length}`}>
        {cards.map((story, index) => (
          <article key={story.slug} className={`hs-franja-card${index === 0 ? " is-first" : ""}`}>
            <a href={href(story)}><Thumb story={story} /><h3>{story.title}</h3></a>
            {index === 0 && <p>{story.summary}</p>}
          </article>
        ))}
      </div>
      {extra.length > 0 && (
        <ul className="hs-franja-links">
          {extra.map((story) => <li key={story.slug}><a href={href(story)}>{story.title}</a></li>)}
        </ul>
      )}
    </>
  );
}

function Sobria({ stories }: { stories: HomeStory[] }) {
  const [lead, ...rest] = stories;
  const half = Math.ceil(rest.length / 2);
  const columns = [rest.slice(0, half), rest.slice(half)].filter((column) => column.length);
  return (
    <div className="hs-sobria">
      <article className="hs-sobria-lead">
        <a href={href(lead)}><Thumb story={lead} /></a>
        <h3><a href={href(lead)}>{lead.title}</a></h3>
        <p>{lead.summary}</p>
        <time>{timeLabel(lead.publishedAt)}</time>
      </article>
      {columns.map((column, index) => (
        <ul key={index} className="hs-sobria-list">
          {column.map((story) => (
            <li key={story.slug}>
              <a href={href(story)}><b>{story.title}</b><span>{story.summary}</span></a>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function Visual({ stories }: { stories: HomeStory[] }) {
  return (
    <div className={`hs-visual hs-visual-${Math.min(stories.length, 5)}`}>
      {stories.slice(0, 5).map((story, index) => (
        <a key={story.slug} href={href(story)} className={`hs-overlay${index === 0 ? " is-big" : ""}`}>
          <Thumb story={story} />
          <span className="hs-overlay-shade" aria-hidden="true" />
          <span className="hs-overlay-text"><b>{story.title}</b>{index === 0 && <small>{timeLabel(story.publishedAt)}</small>}</span>
        </a>
      ))}
    </div>
  );
}

function Compacta({ stories }: { stories: HomeStory[] }) {
  return (
    <ul className="hs-compacta">
      {stories.slice(0, 6).map((story) => (
        <li key={story.slug}>
          <a href={href(story)}>
            <Thumb story={story} />
            <span><b>{story.title}</b><time>{timeLabel(story.publishedAt)}</time></span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function Opinion({ stories, authors }: { stories: HomeStory[]; authors: Record<string, string> }) {
  return (
    <div className="hs-opinion">
      {stories.slice(0, 4).map((story) => {
        const author = authors[story.slug] || "Redacción VD Noticias";
        const initials = /VD/.test(author) ? "VD" : author.split(/\s+/).filter((word) => /^[A-ZÁÉÍÓÚÑ]/.test(word)).slice(0, 2).map((word) => word[0]).join("") || "VD";
        return (
          <article key={story.slug} className="hs-opinion-card">
            <a href={href(story)}>
              <span className="hs-opinion-author"><i aria-hidden="true">{initials}</i><span>{author}</span></span>
              <h3>{story.title}</h3>
              <p>{story.summary}</p>
            </a>
          </article>
        );
      })}
    </div>
  );
}

export default function HomeSections({ sections, authors }: { sections: Record<string, HomeStory[]>; authors: Record<string, string> }) {
  return (
    <div className="home-sections">
      {HOME_SECTIONS.map((config) => {
        const stories = sections[config.slug] ?? [];
        if (!stories.length) return null;
        const dark = config.layout === "franja";
        return (
          <section key={config.slug} id={config.slug} className={`hs-section hs-${config.layout}-section`}>
            <SectionHeader config={config} dark={dark} />
            {config.layout === "apertura" && <Apertura stories={stories} />}
            {config.layout === "franja" && <Franja stories={stories} />}
            {config.layout === "sobria" && <Sobria stories={stories} />}
            {config.layout === "visual" && <Visual stories={stories} />}
            {config.layout === "compacta" && <Compacta stories={stories} />}
            {config.layout === "opinion" && <Opinion stories={stories} authors={authors} />}
          </section>
        );
      })}
    </div>
  );
}
