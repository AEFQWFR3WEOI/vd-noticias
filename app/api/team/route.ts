import { eq } from "drizzle-orm";
import { getDbReady } from "../../../db";
import {
  auditLog,
  editorialSessions,
  editorialUsers,
} from "../../../db/schema";
import { getEditorialUser, type EditorialRole } from "../../lib/editorial-auth";
import { hashPassword, validatePassword } from "../../lib/password-security";

export async function GET() {
  const user = await getEditorialUser();
  if (!user || user.role !== "administrator") return Response.json({ error: "Acceso no autorizado" }, { status: 403 });
  return Response.json({
    users: await (await getDbReady())
      .select({
        id: editorialUsers.id,
        email: editorialUsers.email,
        displayName: editorialUsers.displayName,
        role: editorialUsers.role,
        active: editorialUsers.active,
        createdAt: editorialUsers.createdAt,
      })
      .from(editorialUsers),
    currentUserEmail: user.email,
  });
}

export async function POST(request: Request) {
  try {
    const user = await getEditorialUser();
    if (!user || user.role !== "administrator") return Response.json({ error: "Solo el administrador puede gestionar el equipo" }, { status: 403 });
    const body = (await request.json()) as { email?: string; displayName?: string; role?: EditorialRole; password?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    const role = body.role ?? "journalist";
    const password = body.password ?? "";
    const passwordError = validatePassword(password);
    if (!email.includes("@") || !["administrator", "editor", "journalist", "commercial"].includes(role)) return Response.json({ error: "Datos inválidos" }, { status: 400 });
    if (passwordError) return Response.json({ error: passwordError }, { status: 400 });
    const db = await getDbReady();
    const existing = await db.select().from(editorialUsers).where(eq(editorialUsers.email, email)).limit(1);
    const passwordHash = await hashPassword(password);
    const [member] = existing[0]
      ? await db.update(editorialUsers).set({ displayName: body.displayName?.trim() || existing[0].displayName, role, passwordHash, active: true }).where(eq(editorialUsers.email, email)).returning()
      : await db.insert(editorialUsers).values({ email, displayName: body.displayName?.trim() || email.split("@")[0], role, passwordHash }).returning();
    if (existing[0]) await db.delete(editorialSessions).where(eq(editorialSessions.userId, member.id));
    await db.insert(auditLog).values({ actorEmail: user.email, action: existing[0] ? "team.credentials_updated" : "team.created", entityType: "editorial_user", entityId: String(member.id), detail: `${email}:${role}` });
    return Response.json({ member: { id: member.id, email: member.email, displayName: member.displayName, role: member.role, active: member.active } }, { status: 201 });
  } catch { return Response.json({ error: "No se pudo guardar el miembro" }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const user = await getEditorialUser();
    if (!user || user.role !== "administrator") return Response.json({ error: "Solo el administrador puede gestionar el equipo" }, { status: 403 });
    const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase() ?? "";
    if (!email.includes("@")) return Response.json({ error: "Correo inválido" }, { status: 400 });
    if (email === user.email.trim().toLowerCase()) return Response.json({ error: "No puedes revocar tu propio acceso" }, { status: 400 });
    const db = await getDbReady();
    const [member] = await db.update(editorialUsers).set({ active: false }).where(eq(editorialUsers.email, email)).returning();
    if (!member) return Response.json({ error: "Miembro no encontrado" }, { status: 404 });
    await db.delete(editorialSessions).where(eq(editorialSessions.userId, member.id));
    await db.insert(auditLog).values({ actorEmail: user.email, action: "team.revoked", entityType: "editorial_user", entityId: String(member.id), detail: email });
    return Response.json({ member: { id: member.id, email: member.email, active: member.active } });
  } catch {
    return Response.json({ error: "No se pudo revocar el acceso" }, { status: 500 });
  }
}
