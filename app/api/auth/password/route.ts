import { and, eq, ne } from "drizzle-orm";
import { getDbReady } from "../../../../db";
import { auditLog, editorialSessions, editorialUsers } from "../../../../db/schema";
import { getEditorialUser } from "../../../lib/editorial-auth";
import {
  hashPassword,
  hashSessionToken,
  validatePassword,
  verifyPassword,
} from "../../../lib/password-security";
import {
  clientIpFromRequest,
  isLoginBlocked,
  recordLoginFailure,
  tooManyAttemptsResponse,
} from "../../../lib/login-rate-limit";
import { hasSameOrigin, sessionTokenFromRequest } from "../../../session-auth";

type PasswordBody = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

// Cada miembro del equipo cambia su propia contraseña. Se exige la contraseña
// actual y se cierran las sesiones abiertas en otros dispositivos.
export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: "Solicitud no autorizada" }, { status: 403 });
  }

  const user = await getEditorialUser();
  if (!user) {
    return Response.json({ error: "Inicia sesión de nuevo" }, { status: 401 });
  }
  if (!user.passwordHash) {
    return Response.json(
      { error: "Esta cuenta no usa contraseña (modo local)" },
      { status: 400 },
    );
  }

  let body: PasswordBody;
  try {
    body = (await request.json()) as PasswordBody;
  } catch {
    return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";

  const ipAddress = clientIpFromRequest(request);
  if (await isLoginBlocked(user.email, ipAddress)) {
    return tooManyAttemptsResponse();
  }

  if (!currentPassword || !(await verifyPassword(currentPassword, user.passwordHash))) {
    await recordLoginFailure(user.email, ipAddress);
    return Response.json({ error: "La contraseña actual no es correcta" }, { status: 400 });
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return Response.json({ error: passwordError }, { status: 400 });
  }
  if (newPassword !== (body.confirmPassword ?? "")) {
    return Response.json({ error: "Las contraseñas nuevas no coinciden" }, { status: 400 });
  }
  if (newPassword === currentPassword) {
    return Response.json(
      { error: "La contraseña nueva debe ser distinta de la actual" },
      { status: 400 },
    );
  }

  const db = await getDbReady();
  await db
    .update(editorialUsers)
    .set({ passwordHash: await hashPassword(newPassword) })
    .where(eq(editorialUsers.id, user.id));

  // Mantiene abierta esta sesión y cierra las demás.
  const token = sessionTokenFromRequest(request);
  await db
    .delete(editorialSessions)
    .where(
      token
        ? and(
            eq(editorialSessions.userId, user.id),
            ne(editorialSessions.tokenHash, hashSessionToken(token)),
          )
        : eq(editorialSessions.userId, user.id),
    );

  await db.insert(auditLog).values({
    actorEmail: user.email,
    action: "auth.password_changed",
    entityType: "editorial_user",
    entityId: String(user.id),
    detail: "El usuario cambió su contraseña",
  });

  return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
