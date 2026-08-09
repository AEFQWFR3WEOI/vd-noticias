/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
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
  return `/seccion/${sectionSlug(section)}`;
};

const menuGroups = [
  { title: "Actualidad", links: ["Nacionales", "Ciudad", "Educación", "Salud", "Justicia", "Política", "Sucesos", "A Fondo", "Reportajes"] },
  { title: "Economía", links: ["Finanzas", "Turismo", "Agro", "Empleo", "Negocios", "Energía", "Consumo", "Vivienda"] },
  { title: "Revista", links: ["Música", "Cine", "Cultura", "Farándula", "Moda", "Belleza", "Buena Vida", "Sociales"] },
  { title: "Deportes", links: ["Baloncesto", "Fútbol", "Béisbol", "Motor", "Golf", "Ciclismo", "Tenis", "Olimpismo"] },
  { title: "Opinión", links: ["Editorial", "En Desarrollo", "Columnistas", "Ágora", "En Directo", "El Espía"] },
  { title: "Mundo", links: ["Estados Unidos", "América Latina", "Haití", "Europa", "Medio Oriente", "Asia", "África", "Caribe"] },
  { title: "Planeta", links: ["Medioambiente", "Ciencia", "Clima", "Tecnología", "Historia", "Cambio Climático"] },
  { title: "VD Media", links: ["En vivo", "Programación", "Videos", "Pódcasts"] },
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
  { title: "VD Media", links: ["En vivo", "Programación", "Videos", "Pódcasts"] },
];

type HeaderProps = {
  active?: string;
  showAd?: boolean;
};

export function PageHeader({ active, showAd = false }: HeaderProps) {
  const today = new Intl.DateTimeFormat("es-DO", { dateStyle: "full", timeZone: "America/Santo_Domingo" }).format(new Date());
  const displayDate = today.charAt(0).toUpperCase() + today.slice(1);
  return (
    <>
      <div className="utility-bar pro-utility">
        <div className="container utility-inner">
          <span>{displayDate}</span>
          <div className="utility-links">
            <span>Santo Domingo · República Dominicana</span>
            <a href="/rss.xml">RSS</a>
            <a href="/publicidad">Anúnciate</a>
          </div>
        </div>
      </div>

      {showAd && (
        <aside className="ad-shell pro-top-ad container" aria-label="Espacio publicitario superior">
          <span>PUBLICIDAD</span>
          <strong>Presencia principal para marcas e instituciones</strong>
          <small>Leaderboard premium · 970 × 90</small>
        </aside>
      )}

      <header className="site-header pro-header">
        <div className="container pro-masthead">
          <div className="masthead-left">
            <details className="mega-menu">
              <summary aria-label="Abrir menú de secciones">
                <span className="hamburger" aria-hidden="true"><i /><i /><i /></span>
                <b>Menú</b>
              </summary>
              <div className="mega-panel">
                <div className="container mega-panel-inner">
                  <div className="mega-intro">
                    <span>EXPLORA VD NOTICIAS</span>
                    <h2>Todo lo que importa, en un solo lugar.</h2>
                    <p>Noticias, análisis, opinión, multimedia y servicios para entender el país.</p>
                  </div>
                  {menuGroups.map((group) => (
                    <nav key={group.title} aria-label={group.title}>
                      <h3>{group.title}</h3>
                      {group.links.map((link) => <a href={sectionHref(link)} key={link}>{link}</a>)}
                    </nav>
                  ))}
                  <div className="mega-service">
                    <span>VD EN VIVO</span>
                    <b>La señal de Visión Dominicana TV</b>
                    <a href="/programacion#en-vivo">Ver transmisión →</a>
                  </div>
                </div>
              </div>
            </details>
            <span className="edition-label">Edición RD</span>
          </div>

          <a className="vd-masthead-logo" href="/" aria-label="VD Noticias, portada">
            <img src="/vd-noticias-logo.png" alt="VD Noticias" width="512" height="512" />
          </a>

          <div className="masthead-actions">
            <a className="live-link" href="/programacion#en-vivo"><i /> En vivo</a>
            <a className="pro-search" href="/buscar" aria-label="Buscar noticias"><span>⌕</span><b>Buscar</b></a>
          </div>
        </div>

        <nav className="main-nav pro-nav" aria-label="Secciones principales">
          <div className="container nav-scroll">
            <a className={active === "Portada" ? "active" : ""} href="/">Portada</a>
            {sections.map((section) => (
              <a className={active === section ? "active" : ""} href={sectionHref(section)} key={section}>{section}</a>
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

export function PageFooter() {
  return (
    <footer className="site-footer pro-footer">
      <div className="container footer-newsroom">
        <a className="vd-footer-logo" href="/" aria-label="VD Noticias, portada"><img src="/vd-noticias-logo.png" alt="VD Noticias" width="512" height="512" loading="lazy" /></a>
        <div>
          <b>Información clara. Contexto real. Visión dominicana.</b>
          <p>Una plataforma de Visión Dominicana TV para informar con rapidez, profundidad y responsabilidad.</p>
        </div>
        <a className="footer-live" href="/programacion#en-vivo"><i /> Ver señal en vivo</a>
      </div>
      <div className="container footer-sitemap">
        {footerGroups.map((group) => <nav key={group.title} aria-label={group.title}><h3>{group.title}</h3>{group.links.map((link) => <a href={sectionHref(link)} key={link}>{link}</a>)}</nav>)}
      </div>
      <div className="container footer-corporate">
        <a href="/nosotros">Equipo y metodología</a><a href="/publicidad">Publicidad</a><a href="/contacto">Contacto</a><a href="/terminos#correcciones">Correcciones</a><a href="/buscar">Buscar</a><a href="/#boletin">Boletines</a><a href="/rss.xml">RSS</a>
      </div>
      <div className="container footer-legal">
        <span>© 2026 Visión Dominicana TV. Todos los derechos reservados.</span>
        <span><a href="/terminos">Términos y privacidad</a> · Santo Domingo, República Dominicana</span>
      </div>
    </footer>
  );
}
