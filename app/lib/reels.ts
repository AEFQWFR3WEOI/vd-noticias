import { desc, eq } from "drizzle-orm";
import { getDbReady } from "../../db";
import { videoReels } from "../../db/schema";

export type ReelFormat = "reel" | "post" | "horizontal";
export type PublicReel = { id: number; shortcode: string; url: string; title: string; category: string; coverUrl: string; format: ReelFormat; createdAt: string };

export function isReelFormat(value: unknown): value is ReelFormat {
  return value === "reel" || value === "post" || value === "horizontal";
}

/** Extrae el código del reel de un enlace de Instagram (reel, p o tv). */
export function parseInstagramUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (!/(^|\.)instagram\.com$/.test(url.hostname)) return null;
    const match = url.pathname.match(/^\/(?:[A-Za-z0-9._]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]{5,40})/);
    if (!match) return null;
    const kind = match[1] === "p" ? "p" : "reel";
    return { shortcode: match[2], url: `https://www.instagram.com/${kind}/${match[2]}/`, format: (kind === "reel" ? "reel" : "post") as ReelFormat };
  } catch {
    return null;
  }
}

export function reelEmbedUrl(reel: Pick<PublicReel, "url">) {
  return `${reel.url.replace(/\/?$/, "/")}embed/`;
}

export async function getReels(limit = 12): Promise<PublicReel[]> {
  try {
    const rows = await (await getDbReady())
      .select()
      .from(videoReels)
      .where(eq(videoReels.active, true))
      .orderBy(desc(videoReels.createdAt), desc(videoReels.id))
      .limit(limit);
    return rows.map(({ id, shortcode, url, title, category, coverUrl, format, createdAt }) => ({ id, shortcode, url, title, category, coverUrl, format, createdAt }));
  } catch {
    return [];
  }
}
