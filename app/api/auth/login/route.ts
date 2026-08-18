import { and, eq, isNotNull } from "drizzle-orm";
import { getDbReady } from "../../../../db";
import { auditLog, editorialUsers } from "../../../../db/schema";
import {
  hashPassword,
  safeEqualText,
  validatePassword,
  verifyPassword,
} from "../../../lib/password-security";
import {
  createEditorialSession,
  hasSameOrigin,
  safeRelativeReturnPath,
  sessionCookieHeader,
} from "../../../session-auth";

type LoginBody = {
  email?: string;
  password?: string;
  returnTo?: string;
};

async function ownerCredentials() {
  const { env } = await import("cloudflare:workers");
  const variables = env as unknown as {
    EDITORIAL_OWNER_EMAIL?: string;
    EDITORIAL_OWNER_PASSWORD?: string;
  };
  return {
    email: String(variables.EDITORIAL_OWNER_EMAIL ?? "").trim().toLowerCase(),
    password: String(variables.EDITORIAL_OWNER_PASSWORD ?? ""),
  };
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: "Solicitud no autorizada" }, { status: 403 });
  }

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!email.includes("@") || !password || password.length > 128) {
    return Response.json(
      { error: "Correo o contraseña incorrectos" },
      { status: 401 },
    );
  }

  const db = await getDbReady();
  let [user] = await db
    .select()
    .from(editorialUsers)
    .where(eq(editorialUsers.email, email))
    .limit(1);

  // One-time owner bootstrap. The secret exists only in the environment and
  // is converted to a scrypt hash before anything is stored in D1.
  if (!user?.passwordHash) {
    const owner = await ownerCredentials();
    const [credentialedAdmin] = await db
      .select({ id: editorialUsers.id })
      .from(editorialUsers)
      .where(
        and(
          eq(editorialUsers.role, "administrator"),
          isNotNull(editorialUsers.passwordHash),
        ),
      )
      .limit(1);
    const ownerPasswordIsValid =
      owner.password.length > 0 && safeEqualText(password, owner.password);

    if (
      !credentialedAdmin &&
      email === owner.email &&
      ownerPasswordIsValid
    ) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        return Response.json(
          { error: `Configuración del propietario inválida: ${passwordError}` },
          { status: 500 },
        );
      }
      const passwordHash = await hashPassword(password);
      const [bootstrapped] = user
        ? await db
            .update(editorialUsers)
            .set({
              passwordHash,
              role: "administrator",
              active: true,
              displayName: user.displayName || "Administrador VD Noticias",
            })
            .where(eq(editorialUsers.id, user.id))
            .returning()
        : await db
            .insert(editorialUsers)
            .values({
              email,
              displayName: "Administrador VD Noticias",
              role: "administrator",
              passwordHash,
            })
            .returning();
      if (!bootstrapped) {
        return Response.json(
          { error: "No se pudo crear el administrador inicial" },
          { status: 500 },
        );
      }
      user = bootstrapped;
      await db.insert(auditLog).values({
        actorEmail: email,
        action: "auth.bootstrap_owner",
        entityType: "editorial_user",
        entityId: String(bootstrapped.id),
        detail: "Administrador inicial creado con credenciales independientes",
      });
    }
  }

  if (
    !user ||
    !user.active ||
    !user.passwordHash ||
    !(await verifyPassword(password, user.passwordHash))
  ) {
    return Response.json(
      { error: "Correo o contraseña incorrectos" },
      { status: 401 },
    );
  }

  const token = await createEditorialSession(user.id);
  await db.insert(auditLog).values({
    actorEmail: user.email,
    action: "auth.login",
    entityType: "editorial_session",
    entityId: String(user.id),
    detail: "Inicio de sesión correcto",
  });

  return Response.json(
    { ok: true, returnTo: safeRelativeReturnPath(body.returnTo) },
    {
      headers: {
        "cache-control": "no-store",
        "set-cookie": sessionCookieHeader(token, request),
      },
    },
  );
}
