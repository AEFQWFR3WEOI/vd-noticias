import { and, desc, eq, inArray, like } from "drizzle-orm";
import { getDbReady } from "../../db";
import { articles, broadcastPrograms, broadcastSettings, editorialUsers, mediaAssets } from "../../db/schema";

export type PublicArticle = typeof articles.$inferSelect;
export type PublicVideo = typeof mediaAssets.$inferSelect & {
  url: string;
  articleSlug: string;
  articleTitle: string;
  articleCategorySlug: string;
  articleSummary: string;
};
export type PublicBroadcastSettings = typeof broadcastSettings.$inferSelect;
export type PublicBroadcastProgram = typeof broadcastPrograms.$inferSelect;

export type BroadcastHubData = {
  settings: PublicBroadcastSettings;
  programs: PublicBroadcastProgram[];
};

const defaultBroadcastSettings: PublicBroadcastSettings = {
  id: 1,
  isLive: false,
  streamUrl: "",
  title: "Visión Dominicana TV en vivo",
  description: "Noticias, entrevistas y cobertura especial desde República Dominicana.",
  posterUrl: "",
  updatedAt: new Date(0).toISOString(),
};

const defaultPrograms: PublicBroadcastProgram[] = [
  {
    id: -1,
    title: "VD Noticias Central",
    slug: "vd-noticias-central",
    kind: "program",
    description: "El resumen visual de la jornada con noticias, contexto y protagonistas.",
    presenter: "Equipo VD Noticias",
    coverImageUrl: "",
    scheduleDay: "Próximamente",
    scheduleTime: "",
    destinationUrl: "",
    active: true,
    position: 1,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: -2,
    title: "En Contexto",
    slug: "en-contexto",
    kind: "program",
    description: "Conversaciones y análisis para entender lo que hay detrás del titular.",
    presenter: "Visión Dominicana TV",
    coverImageUrl: "",
    scheduleDay: "Próximamente",
    scheduleTime: "",
    destinationUrl: "",
    active: true,
    position: 2,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: -3,
    title: "Conversaciones VD",
    slug: "conversaciones-vd",
    kind: "podcast",
    description: "Historias, ideas y voces dominicanas en una conversación sin prisa.",
    presenter: "VD Podcasts",
    coverImageUrl: "",
    scheduleDay: "Próximamente",
    scheduleTime: "",
    destinationUrl: "",
    active: true,
    position: 3,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
];

function normalizeTitle(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function chooseCanonical(candidates: PublicArticle[]) {
  return [...candidates].sort((a, b) => {
    const bodyDifference = (b.body?.length ?? 0) - (a.body?.length ?? 0);
    if (bodyDifference) return bodyDifference;
    return a.id - b.id;
  })[0];
}

export function deduplicateArticles(rows: PublicArticle[]) {
  const groups = new Map<string, PublicArticle[]>();
  for (const row of rows) {
    const key = normalizeTitle(row.title);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const canonical = new Set([...groups.values()].map((group) => chooseCanonical(group).id));
  return rows.filter((row) => canonical.has(row.id));
}

export async function getPublishedArticles(category?: string, limit = 24): Promise<PublicArticle[]> {
  try {
    const db = await getDbReady();
    const queryLimit = Math.max(limit * 3, 100);
    if (category) {
      const rows = await db.select().from(articles).where(and(eq(articles.status, "published"), eq(articles.categorySlug, category))).orderBy(desc(articles.publishedAt), desc(articles.id)).limit(queryLimit);
      return deduplicateArticles(rows).slice(0, limit);
    }
    const rows = await db.select().from(articles).where(eq(articles.status, "published")).orderBy(desc(articles.publishedAt), desc(articles.id)).limit(queryLimit);
    return deduplicateArticles(rows).slice(0, limit);
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<PublicArticle | null> {
  try {
    const rows = await (await getDbReady()).select().from(articles).where(and(eq(articles.slug, slug), eq(articles.status, "published"))).limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getArticleWithCanonical(slug: string): Promise<{ article: PublicArticle; canonical: PublicArticle } | null> {
  try {
    const db = await getDbReady();
    const requested = await db.select().from(articles).where(and(eq(articles.slug, slug), eq(articles.status, "published"))).limit(1);
    const article = requested[0];
    if (!article) return null;
    const matches = await db.select().from(articles).where(and(eq(articles.title, article.title), eq(articles.status, "published"))).limit(25);
    return { article, canonical: chooseCanonical(matches.length ? matches : [article]) };
  } catch {
    return null;
  }
}

export async function getArticleAuthorName(email?: string | null): Promise<string> {
  if (!email) return "Redacción VD Noticias";
  try {
    const rows = await (await getDbReady()).select({ displayName: editorialUsers.displayName }).from(editorialUsers).where(eq(editorialUsers.email, email)).limit(1);
    return rows[0]?.displayName || email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  } catch {
    return email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
}

export async function getRecentVideos(limit = 24): Promise<PublicVideo[]> {
  try {
    const db = await getDbReady();
    const linkedArticles = await db
      .select({ slug: articles.slug, title: articles.title, summary: articles.summary, categorySlug: articles.categorySlug, heroImageUrl: articles.heroImageUrl })
      .from(articles)
      .where(and(eq(articles.status, "published"), like(articles.heroImageUrl, "%kind=video%")))
      .orderBy(desc(articles.publishedAt), desc(articles.id))
      .limit(Math.max(100, limit * 4));
    const articleMedia = linkedArticles.flatMap((article) => {
      const match = article.heroImageUrl?.match(/\/api\/media\/(\d+)/);
      return match ? [{ ...article, mediaId: Number(match[1]) }] : [];
    });
    const mediaIds = [...new Set(articleMedia.map((article) => article.mediaId))];
    if (!mediaIds.length) return [];
    const videos = await db.select().from(mediaAssets).where(and(inArray(mediaAssets.id, mediaIds), like(mediaAssets.contentType, "video/%")));
    const videosById = new Map(videos.map((video) => [video.id, video]));
    const used = new Set<number>();
    return articleMedia.flatMap((article) => {
      const video = videosById.get(article.mediaId);
      if (!video || used.has(video.id)) return [];
      used.add(video.id);
      return [{
        ...video,
        url: `/api/media/${video.id}?kind=video`,
        articleSlug: article.slug,
        articleTitle: article.title,
        articleCategorySlug: article.categorySlug,
        articleSummary: article.summary,
      }];
    }).slice(0, limit);
  } catch {
    return [];
  }
}

export async function getBroadcastHub(): Promise<BroadcastHubData> {
  try {
    const db = await getDbReady();
    const [settingsRows, programs] = await Promise.all([
      db.select().from(broadcastSettings).where(eq(broadcastSettings.id, 1)).limit(1),
      db.select().from(broadcastPrograms).where(eq(broadcastPrograms.active, true)).orderBy(broadcastPrograms.position, desc(broadcastPrograms.createdAt)).limit(24),
    ]);
    return {
      settings: settingsRows[0] ?? defaultBroadcastSettings,
      programs: programs.length ? programs : defaultPrograms,
    };
  } catch {
    return { settings: defaultBroadcastSettings, programs: defaultPrograms };
  }
}

export function formatVideoTitle(video: Pick<PublicVideo, "filename" | "altText">, index = 0) {
  const source = (video.altText || video.filename)
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const looksAutomatic = !source || /^(sss(?:twitter)?|twitter|x com|video)\b/i.test(source) || /^\d+$/.test(source.replace(/\s/g, ""));
  if (looksAutomatic) return index === 0 ? "Actualidad en video: la mirada de VD Noticias" : `Video reciente de VD Noticias ${String(index + 1).padStart(2, "0")}`;
  return source.charAt(0).toUpperCase() + source.slice(1);
}
