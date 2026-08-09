import { eq } from "drizzle-orm";
import { getDbReady } from "../../../db";
import { editorialUsers } from "../../../db/schema";
import { getEditorialUser, type EditorialRole } from "../../lib/editorial-auth";

export async function GET() {
  const user = await getEditorialUser();
  if (!user || user.role !== "administrator") return Response.json({ error: "Acceso no autorizado" }, { status: 403 });
  return Response.json({ users: await (await getDbReady()).select().from(editorialUsers), currentUserEmail: user.email });
}

export async function POST(request: Request) {
  try {
    const user = await getEditorialUser();
    if (!user || user.role !== "administrator") return Response.json({ error: "Solo el administrador puede gestionar el equipo" }, { status: 403 });
    const body = (await request.json()) as { email?: string; displayName?: string; role?: EditorialRole };
    const email = body.email?.trim().toLowerCase() ?? "";
    const role = body.role ?? "journalist";
    if (!email.includes("@") || !["administrator", "editor", "journalist", "commercial"].includes(role)) return Response.json({ error: "Datos inválidos" }, { status: 400 });
    const db = await getDbReady();
    const existing = await db.select().from(editorialUsers).where(eq(editorialUsers.email, email)).limit(1);
    const [member] = existing[0]
      ? await db.update(editorialUsers).set({ displayName: body.displayName?.trim() || existing[0].displayName, role, active: true }).where(eq(editorialUsers.email, email)).returning()
      : await db.insert(editorialUsers).values({ email, displayName: body.displayName?.trim() || email.split("@")[0], role }).returning();
    return Response.json({ member }, { status: 201 });
  } catch { return Response.json({ error: "No se pudo guardar el miembro" }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const user = await getEditorialUser();
    if (!user || user.role !== "administrator") return Response.json({ error: "Solo el administrador puede gestionar el equipo" }, { status: 403 });
    const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase() ?? "";
    if (!email.includes("@")) return Response.json({ error: "Correo inválido" }, { status: 400 });
    if (email === user.email.trim().toLowerCase()) return Response.json({ error: "No puedes revocar tu propio acceso" }, { status: 400 });
    const [member] = await (await getDbReady()).update(editorialUsers).set({ active: false }).where(eq(editorialUsers.email, email)).returning();
    if (!member) return Response.json({ error: "Miembro no encontrado" }, { status: 404 });
    return Response.json({ member });
  } catch {
    return Response.json({ error: "No se pudo revocar el acceso" }, { status: 500 });
  }
}
