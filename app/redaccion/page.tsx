/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import { desc, eq, sql } from "drizzle-orm";
import { getDbReady } from "../../db";
import {
  adCampaigns,
  articles,
  broadcastPrograms,
  contactMessages,
  editorialUsers,
  mediaAssets,
} from "../../db/schema";
import {
  chatGPTSignOutPath,
  isLocalEditorialIdentity,
  requireChatGPTUser,
} from "../chatgpt-auth";
import {
  canManageAds,
  canPublish,
  getEditorialUser,
} from "../lib/editorial-auth";
import { CampaignManager, TeamManager } from "./AdminTools";
import ArticleEditor from "./ArticleEditor";
import BroadcastManager from "./BroadcastManager";
import MediaLibrary from "./MediaLibrary";
import { evaluateEditorialQuality } from "../lib/editorial-quality";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Sala de redacción",
  robots: { index: false, follow: false },
};

async function Newsroom() {
  const identity = await requireChatGPTUser("/redaccion");
  const user = await getEditorialUser();
  if (!user)
    return (
      <main className="access-denied">
        <div>
          <span>VD NOTICIAS</span>
          <h1>Acceso pendiente</h1>
          <p>
            Tu identidad fue confirmada, pero todavía no formas parte del equipo
            editorial. Un administrador debe agregarte.
          </p>
          {isLocalEditorialIdentity(identity.email) ? (
            <small>Modo local</small>
          ) : (
            <a href={chatGPTSignOutPath("/")}>Cerrar sesión</a>
          )}
        </div>
      </main>
    );
  const db = await getDbReady();
  const [
    statusCounts,
    recent,
    inventory,
    inbox,
    userCount,
    campaignCount,
    mediaCount,
    programCount,
  ] = await Promise.all([
    db
      .select({ status: articles.status, count: sql<number>`count(*)` })
      .from(articles)
      .groupBy(articles.status),
    db.select().from(articles).orderBy(desc(articles.updatedAt)).limit(6),
    db.select().from(articles).orderBy(desc(articles.updatedAt)).limit(500),
    db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(20),
    db
      .select({ count: sql<number>`count(*)` })
      .from(editorialUsers)
      .where(eq(editorialUsers.active, true)),
    db.select({ count: sql<number>`count(*)` }).from(adCampaigns),
    db.select({ count: sql<number>`count(*)` }).from(mediaAssets),
    db.select({ count: sql<number>`count(*)` }).from(broadcastPrograms),
  ]);
  const count = (status: string) =>
    statusCounts.find((item) => item.status === status)?.count ?? 0;
  const publishedInventory = inventory.filter(
    (article) => article.status === "published",
  );
  const qualityAlerts = publishedInventory.filter((article) =>
    evaluateEditorialQuality(article).some(
      (finding) => finding.level === "error",
    ),
  ).length;
  const titleGroups = new Map<string, number>();
  publishedInventory.forEach((article) =>
    titleGroups.set(
      article.title.toLowerCase().trim(),
      (titleGroups.get(article.title.toLowerCase().trim()) || 0) + 1,
    ),
  );
  const duplicateGroups = [...titleGroups.values()].filter(
    (value) => value > 1,
  ).length;
  const seoMissing = publishedInventory.filter(
    (article) => !article.seoTitle || !article.seoDescription,
  ).length;
  const sourceMissing = publishedInventory.filter(
    (article) =>
      article.categorySlug !== "opinion" &&
      !/^Fuente consultada:/m.test(article.body),
  ).length;
  return (
    <main className="newsroom">
      <aside className="newsroom-sidebar">
        <a
          className="newsroom-brand"
          href="/"
          aria-label="VD Noticias, portada"
        >
          <img src="/vd-noticias-logo.png" alt="VD Noticias" />
        </a>
        <nav>
          <a className="active" href="#panel">
            ▦ Panel
          </a>
          <a href="#agentes">◇ Control GEO</a>
          <a href="#nueva">＋ Nueva noticia</a>
          <a href="#contenido">▤ Contenido</a>
          <a href="#buzon">✉ Buzón</a>
          <a href="#multimedia">▧ Multimedia</a>
          {canPublish(user.role) && <a href="#emision">◉ Emisión y programas</a>}
          {canManageAds(user.role) && <a href="#publicidad">◫ Publicidad</a>}
          {user.role === "administrator" && <a href="#equipo">◎ Equipo</a>}
        </nav>
        <div className="sidebar-bottom">
          <small>Sesión de</small>
          <b>{identity.displayName}</b>
          <span>{user.role}</span>
          {isLocalEditorialIdentity(identity.email) ? (
            <small>Modo local · datos aislados</small>
          ) : (
            <a href={chatGPTSignOutPath("/")}>Cerrar sesión</a>
          )}
        </div>
      </aside>
      <section className="newsroom-main">
        <header>
          <div>
            <span>SALA DE REDACCIÓN</span>
            <h1>Buenos días, {identity.displayName.split(" ")[0]}</h1>
            <p>Este es el pulso editorial de VD Noticias.</p>
          </div>
          <a href="/" target="_blank">
            Ver periódico ↗
          </a>
        </header>
        <div className="dashboard-cards" id="panel">
          <article>
            <span>Borradores</span>
            <b>{count("draft")}</b>
            <small>En preparación</small>
          </article>
          <article>
            <span>En revisión</span>
            <b>{count("review")}</b>
            <small>Pendientes del editor</small>
          </article>
          <article>
            <span>Publicadas</span>
            <b>{count("published")}</b>
            <small>Noticias activas</small>
          </article>
          <article>
            <span>Multimedia</span>
            <b>{mediaCount[0]?.count ?? 0}</b>
            <small>Archivos disponibles</small>
          </article>
          <article>
            <span>Programas</span>
            <b>{programCount[0]?.count ?? 0}</b>
            <small>TV y pódcasts</small>
          </article>
          <article>
            <span>Campañas</span>
            <b>{campaignCount[0]?.count ?? 0}</b>
            <small>Publicidad registrada</small>
          </article>
        </div>
        <section className="content-panel agent-console" id="agentes">
          <div className="panel-heading">
            <div>
              <span>CONTROL AUTOMÁTICO + DECISIÓN HUMANA</span>
              <h2>Agentes editoriales y GEO</h2>
            </div>
            <p>Auditoría sobre {publishedInventory.length} publicaciones</p>
          </div>
          <div className="agent-console-grid">
            <article className={qualityAlerts ? "needs-attention" : "healthy"}>
              <span>AGENTE DE CALIDAD</span>
              <b>{qualityAlerts}</b>
              <p>Artículos con bloqueos de extensión, resumen o atribución.</p>
            </article>
            <article
              className={duplicateGroups ? "needs-attention" : "healthy"}
            >
              <span>AGENTE CANÓNICO</span>
              <b>{duplicateGroups}</b>
              <p>
                Grupos duplicados; el sitio redirige automáticamente a una sola
                URL.
              </p>
            </article>
            <article className={seoMissing ? "needs-attention" : "healthy"}>
              <span>AGENTE GEO / SEO</span>
              <b>{seoMissing}</b>
              <p>
                Publicaciones sin título o descripción específica para
                buscadores.
              </p>
            </article>
            <article className={sourceMissing ? "needs-attention" : "healthy"}>
              <span>AGENTE DE FUENTES</span>
              <b>{sourceMissing}</b>
              <p>
                Noticias que requieren documentación visible antes de
                promoverse.
              </p>
            </article>
          </div>
          <small>
            Estos controles detectan riesgos técnicos; solo un editor o
            administrador puede aprobar la publicación.
          </small>
        </section>
        <section className="editor-panel" id="nueva">
          <div className="panel-heading">
            <div>
              <span>NUEVA PUBLICACIÓN</span>
              <h2>Redactar noticia</h2>
            </div>
            <p>Se guardará el autor y cada versión.</p>
          </div>
          <ArticleEditor canPublish={canPublish(user.role)} />
        </section>
        <section className="content-panel" id="contenido">
          <div className="panel-heading">
            <div>
              <span>FLUJO EDITORIAL</span>
              <h2>Contenido reciente</h2>
            </div>
            <p>{userCount[0]?.count ?? 1} miembros activos</p>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">
              <b>Aún no hay noticias creadas</b>
              <p>
                La primera noticia que guardes aparecerá aquí con su estado.
              </p>
            </div>
          ) : (
            <div className="content-table">
              <div className="table-head">
                <span>Titular</span>
                <span>Sección</span>
                <span>Estado</span>
                <span>Actualización</span>
              </div>
              {recent.map((article) => (
                <article key={article.id}>
                  <div>
                  <b><a href={`/redaccion/editar/${article.id}`}>{article.title}</a></b>
                    <small>{article.authorEmail}</small>
                  </div>
                  <span>{article.categorySlug}</span>
                  <span className={`status ${article.status}`}>
                    {article.status}
                  </span>
                  <span>
                    {new Date(article.updatedAt).toLocaleDateString("es-DO")}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
        <section className="content-panel" id="buzon">
          <div className="panel-heading">
            <div>
              <span>CONTACTO PÚBLICO</span>
              <h2>Buzón de redacción</h2>
            </div>
            <p>{inbox.length} mensajes recientes</p>
          </div>
          {inbox.length ? (
            <div className="newsroom-inbox">
              {inbox.map((message) => (
                <article key={message.id}>
                  <div>
                    <span>{message.topic}</span>
                    <b>{message.name}</b>
                    <a href={`mailto:${message.email}`}>{message.email}</a>
                  </div>
                  <p>{message.message}</p>
                  <time>
                    {new Date(message.createdAt).toLocaleString("es-DO")}
                  </time>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <b>No hay mensajes todavía</b>
              <p>
                Las correcciones, réplicas y denuncias enviadas desde la web
                aparecerán aquí.
              </p>
            </div>
          )}
        </section>
        <section className="content-panel" id="multimedia">
          <div className="panel-heading">
            <div>
              <span>BIBLIOTECA VD</span>
              <h2>Multimedia</h2>
            </div>
            <p>Imágenes, videos, audios y documentos</p>
          </div>
          <MediaLibrary />
        </section>
        {canPublish(user.role) && (
          <section className="content-panel" id="emision">
            <div className="panel-heading">
              <div>
                <span>VD MEDIA CENTER</span>
                <h2>Emisión y programación</h2>
              </div>
              <p>Señal en vivo, programas y pódcasts</p>
            </div>
            <BroadcastManager />
          </section>
        )}
        {canManageAds(user.role) && (
          <section className="content-panel" id="publicidad">
            <div className="panel-heading">
              <div>
                <span>GESTIÓN COMERCIAL</span>
                <h2>Nueva campaña</h2>
              </div>
              <p>Posición, periodo y cliente</p>
            </div>
            <CampaignManager />
          </section>
        )}
        {user.role === "administrator" && (
          <section className="content-panel" id="equipo">
            <div className="panel-heading">
              <div>
                <span>PERMISOS</span>
                <h2>Agregar al equipo</h2>
              </div>
              <p>Periodistas, editores y comerciales</p>
            </div>
            <TeamManager />
          </section>
        )}
      </section>
    </main>
  );
}

export default function NewsroomPage() {
  return <Newsroom />;
}
