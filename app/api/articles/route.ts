import { and, desc, eq } from "drizzle-orm";
import { getDbReady } from "../../../db";
import { articleRevisions, articles, auditLog } from "../../../db/schema";
import { canPublish, getEditorialUser } from "../../lib/editorial-auth";
import { evaluateEditorialQuality } from "../../lib/editorial-quality";

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const includeAll = url.searchParams.get("scope") === "newsroom";
  if (includeAll && !(await getEditorialUser())) return Response.json({ error: "Acceso no autorizado" }, { status: 401 });
  const db = await getDbReady();
  const rows = includeAll
    ? await db.select().from(articles).orderBy(desc(articles.updatedAt)).limit(100)
    : await db.select().from(articles).where(eq(articles.status, "published")).orderBy(desc(articles.publishedAt)).limit(50);
  return Response.json({ articles: rows });
}

export async function POST(request: Request) {
  try {
    const user = await getEditorialUser();
    if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 401 });
    const body = (await request.json()) as Record<string, string | boolean>;
    const title = String(body.title ?? "").trim();
    let articleBody = String(body.body ?? "").trim();
    const sourceName = String(body.sourceName ?? "").trim();
    const sourceUrl = String(body.sourceUrl ?? "").trim();
    if (sourceName && !/^Fuente consultada:/m.test(articleBody)) articleBody += `\n\nFuente consultada: ${sourceName}${sourceUrl ? ` | ${sourceUrl}` : ""}`;
    const requestedStatus = String(body.status ?? "draft");
    if (!title || !articleBody) return Response.json({ error: "El titular y el contenido son obligatorios" }, { status: 400 });
    if (requestedStatus === "published" && !canPublish(user.role)) return Response.json({ error: "Solo editores y administradores pueden publicar" }, { status: 403 });
    const db = await getDbReady();
    const now = new Date().toISOString();
    const status = ["draft", "review", "scheduled", "published"].includes(requestedStatus) ? requestedStatus as "draft" | "review" | "scheduled" | "published" : "draft";
    const summary = String(body.summary ?? "").trim();
    const categorySlug = String(body.categorySlug ?? "nacionales");
    const heroImageUrl = String(body.heroImageUrl ?? "") || null;
    const findings = evaluateEditorialQuality({ title, summary, body: articleBody, categorySlug, heroImageUrl });
    const blocking = findings.filter((finding) => finding.level === "error");
    if (status === "published" && blocking.length) return Response.json({ error: `Control editorial: ${blocking.map((finding) => finding.label).join(" ")}`, findings }, { status: 422 });
    const duplicate = await db.select({ id: articles.id, slug: articles.slug }).from(articles).where(and(eq(articles.title, title), eq(articles.status, "published"))).limit(1);
    if (status === "published" && duplicate.length) return Response.json({ error: `Ya existe una noticia publicada con este titular (${duplicate[0].slug}). Edita la existente en lugar de crear un duplicado.` }, { status: 409 });
    const base = slugify(title) || "noticia";
    const slug = `${base}-${Date.now().toString(36)}`;
    const [article] = await db.insert(articles).values({
      title,
      slug,
      summary,
      body: articleBody,
      categorySlug,
      authorEmail: user.email,
      heroImageUrl,
      status,
      isBreaking: Boolean(body.isBreaking),
      isFeatured: Boolean(body.isFeatured),
      seoTitle: title.slice(0, 70),
      seoDescription: summary.slice(0, 170),
      publishedAt: status === "published" ? now : null,
      updatedAt: now,
    }).returning();
    await db.insert(articleRevisions).values({ articleId: article.id, editorEmail: user.email, title, body: articleBody, status });
    await db.insert(auditLog).values({ actorEmail: user.email, action: "article.created", entityType: "article", entityId: String(article.id), detail: status });
    return Response.json({ article }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar la noticia";
    return Response.json({ error: message }, { status: 500 });
  }
}
