import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { currentEditionArticles } from "./current-edition";

let initialization: Promise<void> | null = null;

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS editorial_users (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL, role TEXT DEFAULT 'journalist' NOT NULL, active INTEGER DEFAULT 1 NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT DEFAULT '' NOT NULL, position INTEGER DEFAULT 0 NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, summary TEXT DEFAULT '' NOT NULL, body TEXT DEFAULT '' NOT NULL, category_slug TEXT NOT NULL, author_email TEXT NOT NULL, hero_image_url TEXT, status TEXT DEFAULT 'draft' NOT NULL, is_breaking INTEGER DEFAULT 0 NOT NULL, is_featured INTEGER DEFAULT 0 NOT NULL, seo_title TEXT, seo_description TEXT, published_at TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS article_revisions (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, article_id INTEGER NOT NULL, editor_email TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, status TEXT NOT NULL, note TEXT DEFAULT '' NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS media_assets (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, object_key TEXT NOT NULL UNIQUE, filename TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL, alt_text TEXT DEFAULT '' NOT NULL, uploaded_by TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS broadcast_settings (id INTEGER PRIMARY KEY NOT NULL, is_live INTEGER DEFAULT 0 NOT NULL, stream_url TEXT DEFAULT '' NOT NULL, title TEXT DEFAULT 'Visión Dominicana TV en vivo' NOT NULL, description TEXT DEFAULT 'Noticias, entrevistas y cobertura especial desde República Dominicana.' NOT NULL, poster_url TEXT DEFAULT '' NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS broadcast_programs (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, kind TEXT DEFAULT 'program' NOT NULL, description TEXT DEFAULT '' NOT NULL, presenter TEXT DEFAULT '' NOT NULL, cover_image_url TEXT DEFAULT '' NOT NULL, schedule_day TEXT DEFAULT 'Próximamente' NOT NULL, schedule_time TEXT DEFAULT '' NOT NULL, destination_url TEXT DEFAULT '' NOT NULL, active INTEGER DEFAULT 1 NOT NULL, position INTEGER DEFAULT 0 NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS ad_placements (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, dimensions TEXT NOT NULL, location TEXT NOT NULL, base_rate INTEGER DEFAULT 0 NOT NULL, active INTEGER DEFAULT 1 NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS ad_campaigns (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, client_name TEXT NOT NULL, contact_email TEXT NOT NULL, placement_code TEXT NOT NULL, creative_media_id INTEGER, destination_url TEXT, starts_at TEXT NOT NULL, ends_at TEXT NOT NULL, status TEXT DEFAULT 'proposal' NOT NULL, impressions INTEGER DEFAULT 0 NOT NULL, clicks INTEGER DEFAULT 0 NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS advertiser_leads (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, company TEXT NOT NULL, contact_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT DEFAULT '' NOT NULL, objective TEXT DEFAULT '' NOT NULL, budget TEXT DEFAULT '' NOT NULL, status TEXT DEFAULT 'new' NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS newsletter_subscribers (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email TEXT NOT NULL UNIQUE, active INTEGER DEFAULT 1 NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, topic TEXT DEFAULT 'editorial' NOT NULL, message TEXT NOT NULL, status TEXT DEFAULT 'new' NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, actor_email TEXT NOT NULL, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, detail TEXT DEFAULT '' NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)`,
];

export async function getDbReady() {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Configure the DB binding in the Worker before using the database."
    );
  }
  initialization ??= (async () => {
    await env.DB.batch(schemaStatements.map((statement) => env.DB.prepare(statement)));

    await env.DB.prepare(
      `INSERT OR IGNORE INTO editorial_users (email, display_name, role, active) VALUES (?, ?, ?, 1)`
    )
      .bind("redaccion@vdnoticias.do", "Redacción VD Noticias", "editor")
      .run();

    await env.DB.prepare(
      `INSERT OR IGNORE INTO broadcast_settings (id, is_live, title, description) VALUES (1, 0, ?, ?)`
    )
      .bind(
        "Visión Dominicana TV en vivo",
        "Noticias, entrevistas y cobertura especial desde República Dominicana."
      )
      .run();

    const articleInsert = `INSERT INTO articles
      (title, slug, summary, body, category_slug, author_email, hero_image_url, status, is_breaking, is_featured, seo_title, seo_description, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        summary = excluded.summary,
        body = excluded.body,
        category_slug = excluded.category_slug,
        hero_image_url = excluded.hero_image_url,
        status = 'published',
        is_breaking = excluded.is_breaking,
        is_featured = excluded.is_featured,
        seo_title = excluded.seo_title,
        seo_description = excluded.seo_description,
        updated_at = excluded.updated_at`;

    await env.DB.batch(
      currentEditionArticles.map((article) =>
        env.DB
          .prepare(articleInsert)
          .bind(
            article.title,
            article.slug,
            article.summary,
            article.body,
            article.categorySlug,
            "redaccion@vdnoticias.do",
            article.heroImageUrl,
            article.isBreaking ? 1 : 0,
            article.isFeatured ? 1 : 0,
            article.title,
            article.summary,
            article.publishedAt,
            article.publishedAt,
            article.publishedAt
          )
      )
    );
  })();
  await initialization;
  return drizzle(env.DB, { schema });
}
