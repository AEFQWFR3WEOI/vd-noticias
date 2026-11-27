import { eq } from "drizzle-orm";
import { getDbReady } from "../../../db";
import { auditLog, videoReels } from "../../../db/schema";
import { getEditorialUser } from "../../lib/editorial-auth";
import { getReels, isReelFormat, parseInstagramUrl } from "../../lib/reels";

export async function GET() {
  return Response.json({ reels: await getReels(60) });
}

// Agregar un reel (cualquier miembro del equipo).
export async function POST(request: Request) {
  const user = await getEditorialUser();
  if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 401 });
  let body: { url?: string; title?: string; category?: string; coverUrl?: string; format?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  }
  const parsed = parseInstagramUrl(String(body.url ?? ""));
  if (!parsed) return Response.json({ error: "Pega un enlace de Instagram válido (reel o publicación)" }, { status: 400 });
  const coverUrl = String(body.coverUrl ?? "").trim();
  const db = await getDbReady();
  const values = {
    url: parsed.url,
    shortcode: parsed.shortcode,
    title: String(body.title ?? "").trim().slice(0, 200),
    category: String(body.category ?? "").trim().slice(0, 40),
    coverUrl: coverUrl.startsWith("/api/media/") || coverUrl.startsWith("https://") ? coverUrl.slice(0, 500) : "",
    format: isReelFormat(body.format) ? body.format : parsed.format,
    active: true,
    createdBy: user.email,
  };
  const [reel] = await db
    .insert(videoReels)
    .values(values)
    .onConflictDoUpdate({ target: videoReels.shortcode, set: { title: values.title, category: values.category, coverUrl: values.coverUrl, format: values.format, active: true } })
    .returning();
  await db.insert(auditLog).values({ actorEmail: user.email, action: "reel.added", entityType: "video_reel", entityId: String(reel.id), detail: parsed.url });
  return Response.json({ reel }, { status: 201 });
}

// Quitar un reel del periódico (no lo borra de Instagram).
export async function DELETE(request: Request) {
  const user = await getEditorialUser();
  if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return Response.json({ error: "Identificador inválido" }, { status: 400 });
  const db = await getDbReady();
  const [reel] = await db.update(videoReels).set({ active: false }).where(eq(videoReels.id, id)).returning();
  if (!reel) return Response.json({ error: "Reel no encontrado" }, { status: 404 });
  await db.insert(auditLog).values({ actorEmail: user.email, action: "reel.removed", entityType: "video_reel", entityId: String(id), detail: reel.url });
  return Response.json({ ok: true });
}
