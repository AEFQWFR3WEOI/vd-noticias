import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const editorialUsers = sqliteTable("editorial_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  role: text("role", { enum: ["administrator", "editor", "journalist", "commercial"] })
    .notNull()
    .default("journalist"),
  passwordHash: text("password_hash"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const editorialSessions = sqliteTable(
  "editorial_sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    lastSeenAt: text("last_seen_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("editorial_sessions_user_id_idx").on(table.userId),
    index("editorial_sessions_expires_at_idx").on(table.expiresAt),
  ],
);

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  position: integer("position").notNull().default(0),
});

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  categorySlug: text("category_slug").notNull(),
  authorEmail: text("author_email").notNull(),
  heroImageUrl: text("hero_image_url"),
  status: text("status", { enum: ["draft", "review", "scheduled", "published", "archived"] })
    .notNull()
    .default("draft"),
  isBreaking: integer("is_breaking", { mode: "boolean" }).notNull().default(false),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const articleRevisions = sqliteTable("article_revisions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  articleId: integer("article_id").notNull(),
  editorEmail: text("editor_email").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull(),
  note: text("note").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const mediaAssets = sqliteTable("media_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  objectKey: text("object_key").notNull().unique(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  altText: text("alt_text").notNull().default(""),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const broadcastSettings = sqliteTable("broadcast_settings", {
  id: integer("id").primaryKey(),
  isLive: integer("is_live", { mode: "boolean" }).notNull().default(false),
  streamUrl: text("stream_url").notNull().default(""),
  title: text("title").notNull().default("Visión Dominicana TV en vivo"),
  description: text("description").notNull().default("Noticias, entrevistas y cobertura especial desde República Dominicana."),
  posterUrl: text("poster_url").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// The public player reads this single-row channel control table. It is separate
// from broadcast_settings so existing installations can be upgraded without a
// destructive ALTER TABLE migration.
export const broadcastChannels = sqliteTable("broadcast_channels", {
  id: integer("id").primaryKey(),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  alwaysOn: integer("always_on", { mode: "boolean" }).notNull().default(true),
  isLive: integer("is_live", { mode: "boolean" }).notNull().default(false),
  sourceMode: text("source_mode", { enum: ["automatic", "primary", "backup", "continuity", "maintenance"] })
    .notNull()
    .default("automatic"),
  provider: text("provider", { enum: ["cloudflare", "youtube", "vimeo", "direct"] })
    .notNull()
    .default("cloudflare"),
  primaryUrl: text("primary_url").notNull().default(""),
  backupUrl: text("backup_url").notNull().default(""),
  continuityUrl: text("continuity_url").notNull().default(""),
  title: text("title").notNull().default("Visión Dominicana TV en vivo"),
  description: text("description").notNull().default("Noticias, entrevistas y cobertura especial desde República Dominicana."),
  posterUrl: text("poster_url").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const broadcastPrograms = sqliteTable("broadcast_programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  kind: text("kind", { enum: ["program", "podcast"] }).notNull().default("program"),
  description: text("description").notNull().default(""),
  presenter: text("presenter").notNull().default(""),
  coverImageUrl: text("cover_image_url").notNull().default(""),
  scheduleDay: text("schedule_day").notNull().default("Próximamente"),
  scheduleTime: text("schedule_time").notNull().default(""),
  destinationUrl: text("destination_url").notNull().default(""),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  position: integer("position").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adPlacements = sqliteTable("ad_placements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  dimensions: text("dimensions").notNull(),
  location: text("location").notNull(),
  baseRate: integer("base_rate").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const adCampaigns = sqliteTable("ad_campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientName: text("client_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  placementCode: text("placement_code").notNull(),
  creativeMediaId: integer("creative_media_id"),
  destinationUrl: text("destination_url"),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at").notNull(),
  status: text("status", { enum: ["proposal", "approved", "active", "paused", "completed"] })
    .notNull()
    .default("proposal"),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const advertiserLeads = sqliteTable("advertiser_leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company: text("company").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  objective: text("objective").notNull().default(""),
  budget: text("budget").notNull().default(""),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic").notNull().default("editorial"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const auditLog = sqliteTable("audit_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  detail: text("detail").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
