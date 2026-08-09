import { asc, desc, eq } from "drizzle-orm";
import { getDbReady } from "../../../db";
import { broadcastPrograms, broadcastSettings } from "../../../db/schema";
import { canPublish, getEditorialUser } from "../../lib/editorial-auth";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function safeUrl(value: unknown) {
  const url = String(value ?? "").trim();
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : "";
  } catch {
    return url.startsWith("/api/media/") || url.startsWith("/") ? url : "";
  }
}

async function authorizedEditor() {
  const user = await getEditorialUser();
  return user && canPublish(user.role) ? user : null;
}

export async function GET() {
  const user = await authorizedEditor();
  if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 403 });
  const db = await getDbReady();
  const [settings, programs] = await Promise.all([
    db.select().from(broadcastSettings).where(eq(broadcastSettings.id, 1)).limit(1),
    db.select().from(broadcastPrograms).orderBy(asc(broadcastPrograms.position), desc(broadcastPrograms.createdAt)).limit(100),
  ]);
  return Response.json({ settings: settings[0] ?? null, programs });
}

export async function POST(request: Request) {
  try {
    const user = await authorizedEditor();
    if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 403 });
    const body = await request.json() as Record<string, unknown>;
    const db = await getDbReady();

    if (body.action === "update-live") {
      const title = String(body.title ?? "").trim();
      const description = String(body.description ?? "").trim();
      if (!title || !description) return Response.json({ error: "Completa el título y la descripción de la señal" }, { status: 400 });
      const streamUrl = safeUrl(body.streamUrl);
      if (String(body.streamUrl ?? "").trim() && !streamUrl) return Response.json({ error: "El enlace de transmisión no es válido" }, { status: 400 });
      const [settings] = await db.insert(broadcastSettings).values({
        id: 1,
        isLive: body.isLive === true || body.isLive === "on" || body.isLive === "true",
        streamUrl,
        title,
        description,
        posterUrl: safeUrl(body.posterUrl),
        updatedAt: new Date().toISOString(),
      }).onConflictDoUpdate({
        target: broadcastSettings.id,
        set: {
          isLive: body.isLive === true || body.isLive === "on" || body.isLive === "true",
          streamUrl,
          title,
          description,
          posterUrl: safeUrl(body.posterUrl),
          updatedAt: new Date().toISOString(),
        },
      }).returning();
      return Response.json({ settings });
    }

    if (body.action === "create-program") {
      const title = String(body.title ?? "").trim();
      const description = String(body.description ?? "").trim();
      const baseSlug = slugify(title);
      if (!title || !description || !baseSlug) return Response.json({ error: "Completa el nombre y la descripción del programa" }, { status: 400 });
      const slug = `${baseSlug}-${Date.now().toString(36)}`;
      const [program] = await db.insert(broadcastPrograms).values({
        title,
        slug,
        kind: body.kind === "podcast" ? "podcast" : "program",
        description,
        presenter: String(body.presenter ?? "").trim(),
        coverImageUrl: safeUrl(body.coverImageUrl),
        scheduleDay: String(body.scheduleDay ?? "Próximamente").trim() || "Próximamente",
        scheduleTime: String(body.scheduleTime ?? "").trim(),
        destinationUrl: safeUrl(body.destinationUrl),
        active: true,
        position: Number(body.position) || 0,
        updatedAt: new Date().toISOString(),
      }).returning();
      return Response.json({ program }, { status: 201 });
    }

    return Response.json({ error: "Acción no reconocida" }, { status: 400 });
  } catch {
    return Response.json({ error: "No se pudo guardar la programación" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await authorizedEditor();
    if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 403 });
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Programa inválido" }, { status: 400 });
    await (await getDbReady()).delete(broadcastPrograms).where(eq(broadcastPrograms.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "No se pudo eliminar el programa" }, { status: 500 });
  }
}
