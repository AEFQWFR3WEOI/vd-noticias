/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import SectionsMenu, { type MenuEntry } from "./SectionsMenu";
import HeaderScroll from "./HeaderScroll";
import { getLiveVisible } from "../lib/public-content";
import DailyBar from "./DailyBar";

const sections = [
  "Nacionales",
  "Política",
  "Economía",
  "Mundo",
  "Revista",
  "Deportes",
  "Entretenimiento",
  "Tecnología",
  "Salud",
  "Educación",
  "Turismo",
  "Cultura",
  "Opinión",
  "Planeta",
  "Videos",
  "Reels",
  "Programación",
];

const sectionSlug = (section: string) =>
  section
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const sectionHref = (section: string) => {
  if (section === "Programación") return "/programacion";
  if (section === "En vivo") return "/programacion#en-vivo";
  if (section === "Pódcasts") return "/programacion#programas";
  if (section === "Videos") return "/seccion/videos";
  if (section === "Reels") return "/reels";
  return `/seccion/${sectionSlug(section)}`;
};

const sub = (...labels: string[]) => labels.map((label) => ({ label, href: sectionHref(label) }));

// Menú lateral (botón «Menú»): mismo orden y estilo de lista con «+».
const drawerEntries: MenuEntry[] = [
  { title: "Última Hora", href: "/seccion/ultimas" },
  { title: "Actualidad", href: "/seccion/nacionales", links: sub("Nacionales", "Ciudad", "Educación", "Salud", "Justicia", "Sucesos", "A Fondo", "Reportajes") },
  { title: "Política", href: "/seccion/politica", links: sub("Gobierno", "Congreso", "Partidos", "Elecciones") },
  { title: "Mundo", href: "/seccion/mundo", links: sub("Estados Unidos", "América Latina", "Haití", "Europa", "Medio Oriente", "Asia", "África", "Caribe") },
  { title: "Economía", href: "/seccion/economia", links: sub("Finanzas", "Turismo", "Agro", "Empleo", "Negocios", "Energía", "Consumo", "Vivienda") },
  { title: "Revista", href: "/seccion/revista", links: sub("Música", "Cine", "Cultura", "Farándula", "Moda", "Belleza", "Buena Vida", "Sociales") },
  { title: "Deportes", href: "/seccion/deportes", links: sub("Béisbol", "Baloncesto", "Fútbol", "Motor", "Golf", "Ciclismo", "Tenis", "Olimpismo") },
  { title: "Opinión", href: "/seccion/opinion", links: sub("Editorial", "En Desarrollo", "Columnistas", "Ágora", "En Directo", "El Espía") },
  { title: "Planeta", href: "/seccion/planeta", links: sub("Medioambiente", "Ciencia", "Clima", "Tecnología", "Historia", "Cambio Climático") },
  { title: "Videos", href: "/seccion/videos", links: sub("En vivo", "Programación", "Videos") },
  { title: "Reels", href: "/reels" },
  { title: "Pódcasts", href: "/programacion#programas" },
  { title: "Envía tu denuncia", href: "/denuncia" },
];

const footerGroups = [
  { title: "Actualidad", links: ["Nacional", "Ciudad", "Educación", "Salud", "Justicia", "Política", "Sucesos", "A Fondo", "Reportajes"] },
  { title: "Economía", links: ["Finanzas", "Turismo", "Agro", "Empleo", "Negocios", "Energía", "Consumo", "Vivienda", "Macroeconomía"] },
  { title: "Revista", links: ["Música", "Cine", "Cultura", "Farándula", "Moda", "Belleza", "Buena Vida", "Sociales", "Vida y Familia"] },
  { title: "Deportes", links: ["Baloncesto", "Fútbol", "Béisbol", "Motor", "Golf", "Ciclismo", "Tenis", "Olimpismo", "Resultados"] },
  { title: "Opinión", links: ["Editorial", "En Desarrollo", "Columnistas", "Ágora", "En Directo", "El Espía"] },
  { title: "Mundo", links: ["Estados Unidos", "América Latina", "Haití", "Europa", "Canadá", "Medio Oriente", "Asia", "África", "Caribe"] },
  { title: "Planeta", links: ["Medioambiente", "Ciencia", "Clima", "Tecnología", "Historia", "Cambio Climático"] },
  { title: "Videos", links: ["Actualidad", "Mundo", "Economía", "Revista", "Deportes", "Opinión", "Planeta"] },
  { title: "VD Media", links: ["En vivo", "Programación", "Videos", "Reels", "Pódcasts"] },
];

type HeaderProps = {
  active?: string;
  showAd?: boolean;
};

export async function PageHeader({ active, showAd = false }: HeaderProps) {
  const liveVisible = await getLiveVisible();
  const menuEntries = liveVisible ? drawerEntries : drawerEntries
    .filter((entry) => entry.title !== "Pódcasts")
    .map((entry) => {
      if (!entry.links) return entry;
      const links = entry.links.filter((link) => !["En vivo", "Programación"].includes(link.label));
      return { ...entry, links: links.length > 1 ? links : undefined };
    });
  const today = new Intl.DateTimeFormat("es-DO", { dateStyle: "full", timeZone: "America/Santo_Domingo" }).format(new Date());
  const displayDate = today.charAt(0).toUpperCase() + today.slice(1);
  return (
    <>
      <div className="vd-topbar">
        <div className="container vd-topbar-inner">
          <span className="vd-topbar-date">{displayDate}</span>
          <DailyBar />
          <nav className="vd-topbar-links" aria-label="Enlaces rápidos">
            <a className="vd-topbar-tip" href="/denuncia">Envía tu denuncia</a>
            <a href="/#boletin">Boletín</a>
            <a href="/publicidad">Anúnciate</a>
            <a href="/rss.xml">RSS</a>
          </nav>
        </div>
      </div>

      <HeaderScroll />
      <header className="vd-header" data-show-ad={showAd ? "1" : undefined}>
        <div className="vd-header-main">
          <div className="container vd-header-grid">
            <div className="vd-header-left">
              <SectionsMenu entries={menuEntries} showLive={liveVisible} />
              <a className="vd-icon-btn" href="/buscar" aria-label="Buscar noticias">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                <span>Buscar</span>
              </a>
            </div>

            <a className="vd-logo" href="/" aria-label="VD Noticias, portada">
              <img src="/vd-logo-header.png" alt="VD Noticias" width="525" height="365" />
            </a>

            <div className="vd-header-right">
              {liveVisible && <a className="vd-live" href="/programacion#en-vivo"><i aria-hidden="true" /><span>En vivo</span></a>}
              <a className="vd-cta" href="/#boletin">Recibe el boletín</a>
            </div>
          </div>
        </div>

        <nav className="vd-nav" aria-label="Secciones principales">
          <div className="container vd-nav-scroll">
            {sections.filter((section) => section !== "Programación").map((section) => (
              <a className={[active === section ? "is-active" : "", section === "Videos" ? "is-video" : section === "Reels" ? "is-reels" : ""].join(" ").trim() || undefined} aria-current={active === section ? "page" : undefined} href={sectionHref(section)} key={section}>{section === "Videos" && <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>}{section === "Reels" && <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M10.5 9.5v5l4-2.5z" fill="currentColor" /></svg>}{section}</a>
            ))}
          </div>
        </nav>
      </header>

      <section className="topics-bar">
        <div className="container topics-inner">
          <strong>Temas del día</strong>
          <a href="/seccion/nacionales">Actualidad nacional</a>
          <a href="/seccion/economia">Economía dominicana</a>
          <a href="/seccion/deportes">Deporte RD</a>
          <a href="/seccion/mundo">Caribe y el mundo</a>
          <a href="/seccion/tecnologia">Inteligencia artificial</a>
        </div>
      </section>
    </>
  );
}

export async function PageFooter() {
  const liveVisible = await getLiveVisible();
  return (
    <footer className="site-footer pro-footer">
      <div className="container footer-newsroom">
        <a className="vd-footer-logo" href="/" aria-label="VD Noticias, portada"><img src="/vd-noticias-logo.png" alt="VD Noticias" width="512" height="512" loading="lazy" /></a>
        <div>
          <b>Información clara. Contexto real. Visión dominicana.</b>
          <p>Una plataforma de Visión Dominicana TV para informar con rapidez, profundidad y responsabilidad.</p>
        </div>
        {liveVisible ? <a className="footer-live" href="/programacion#en-vivo"><i /> Ver señal en vivo</a> : <a className="footer-live" href="/seccion/videos">Ver videos VD</a>}
      </div>
      <div className="container footer-sitemap">
        {footerGroups.map((group) => ({ ...group, links: liveVisible ? group.links : group.links.filter((link) => !["En vivo", "Programación", "Pódcasts"].includes(link)) })).filter((group) => group.links.length).map((group) => <nav key={group.title} aria-label={group.title}><h3>{group.title}</h3>{group.links.map((link) => <a href={sectionHref(link)} key={link}>{link}</a>)}</nav>)}
      </div>
      <div className="container footer-corporate">
        <a href="/denuncia">Envía tu denuncia</a><a href="/nosotros">Equipo y metodología</a><a href="/publicidad">Publicidad</a><a href="/contacto">Contacto</a><a href="/terminos#correcciones">Correcciones</a><a href="/buscar">Buscar</a><a href="/#boletin">Boletines</a><a href="/rss.xml">RSS</a>
      </div>
      <div className="container footer-legal">
        <span>© 2026 Visión Dominicana TV. Todos los derechos reservados.</span>
        <span><a href="/terminos">Términos y privacidad</a> · Santo Domingo, República Dominicana</span>
        <span className="footer-data-credits">Clima: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> · Tasas: <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">ExchangeRate-API</a></span>
      </div>
    </footer>
  );
}
