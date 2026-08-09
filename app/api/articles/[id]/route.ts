import { eq } from "drizzle-orm";
import { getDbReady } from "../../../../db";
import { articleRevisions, articles, auditLog } from "../../../../db/schema";
import { canPublish, getEditorialUser } from "../../../lib/editorial-auth";
import { evaluateEditorialQuality } from "../../../lib/editorial-quality";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getEditorialUser();
    if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 401 });
    const id = Number((await params).id);
    if (!Number.isInteger(id)) return Response.json({ error: "Identificador inválido" }, { status: 400 });
    const body = (await request.json()) as Record<string, string | boolean>;
    const requestedStatus = String(body.status ?? "draft");
    if (requestedStatus === "published" && !canPublish(user.role)) return Response.json({ error: "Solo editores y administradores pueden publicar" }, { status: 403 });
    const db = await getDbReady();
    const current = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    if (!current[0]) return Response.json({ error: "Noticia no encontrada" }, { status: 404 });
    const title = String(body.title ?? current[0].title).trim();
    let articleBody = String(body.body ?? current[0].body).trim();
    const sourceName = String(body.sourceName ?? "").trim();
    const sourceUrl = String(body.sourceUrl ?? "").trim();
    if (sourceName) articleBody += `\n\nFuente consultada: ${sourceName}${sourceUrl ? ` | ${sourceUrl}` : ""}`;
    const summary = String(body.summary ?? current[0].summary).trim();
    const categorySlug = String(body.categorySlug ?? current[0].categorySlug);
    const heroImageUrl = String(body.heroImageUrl ?? current[0].heroImageUrl ?? "") || null;
    const findings = evaluateEditorialQuality({ title, summary, body: articleBody, categorySlug, heroImageUrl });
    if (requestedStatus === "published" && findings.some((finding) => finding.level === "error")) return Response.json({ error: `Control editorial: ${findings.filter((finding) => finding.level === "error").map((finding) => finding.label).join(" ")}`, findings }, { status: 422 });
    const [updated] = await db.update(articles).set({ title, body: articleBody, summary, categorySlug, heroImageUrl, status: requestedStatus as "draft" | "review" | "scheduled" | "published" | "archived", isBreaking: Boolean(body.isBreaking ?? current[0].isBreaking), seoTitle: title.slice(0, 70), seoDescription: summary.slice(0, 170), publishedAt: requestedStatus === "published" ? current[0].publishedAt ?? new Date().toISOString() : current[0].publishedAt, updatedAt: new Date().toISOString() }).where(eq(articles.id, id)).returning();
    await db.insert(articleRevisions).values({ articleId: id, editorEmail: user.email, title, body: articleBody, status: requestedStatus, note: String(body.note ?? "") });
    await db.insert(auditLog).values({ actorEmail: user.email, action: "article.updated", entityType: "article", entityId: String(id), detail: requestedStatus });
    return Response.json({ article: updated });
  } catch { return Response.json({ error: "No se pudo actualizar la noticia" }, { status: 500 }); }
}
