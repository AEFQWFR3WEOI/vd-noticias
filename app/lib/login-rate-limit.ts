import { and, count, eq, gte, lt } from "drizzle-orm";
import { getDbReady } from "../../db";
import { loginAttempts } from "../../db/schema";

// Ventana y límites para bloquear ataques de fuerza bruta.
export const LOGIN_WINDOW_MINUTES = 15;
export const MAX_FAILURES_PER_EMAIL = 5;
export const MAX_FAILURES_PER_IP = 20;

export function clientIpFromRequest(request: Request) {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "";
  return ip.trim().slice(0, 64) || "desconocida";
}

function windowStart() {
  return new Date(Date.now() - LOGIN_WINDOW_MINUTES * 60 * 1000).toISOString();
}

/** Devuelve true si este correo o esta IP ya superaron el límite de intentos. */
export async function isLoginBlocked(email: string, ipAddress: string) {
  const db = await getDbReady();
  const since = windowStart();
  const [[byEmail], [byIp]] = await Promise.all([
    db
      .select({ total: count() })
      .from(loginAttempts)
      .where(and(eq(loginAttempts.email, email), gte(loginAttempts.createdAt, since))),
    db
      .select({ total: count() })
      .from(loginAttempts)
      .where(and(eq(loginAttempts.ipAddress, ipAddress), gte(loginAttempts.createdAt, since))),
  ]);
  return (
    (byEmail?.total ?? 0) >= MAX_FAILURES_PER_EMAIL ||
    (byIp?.total ?? 0) >= MAX_FAILURES_PER_IP
  );
}

export async function recordLoginFailure(email: string, ipAddress: string) {
  const db = await getDbReady();
  await db.insert(loginAttempts).values({
    email: email.slice(0, 254),
    ipAddress,
    createdAt: new Date().toISOString(),
  });
  // Limpieza de intentos viejos para que la tabla no crezca sin control.
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await db.delete(loginAttempts).where(lt(loginAttempts.createdAt, dayAgo));
}

export async function clearLoginFailures(email: string) {
  const db = await getDbReady();
  await db.delete(loginAttempts).where(eq(loginAttempts.email, email));
}

export function tooManyAttemptsResponse() {
  return Response.json(
    {
      error: `Demasiados intentos fallidos. Espera ${LOGIN_WINDOW_MINUTES} minutos e inténtalo de nuevo.`,
    },
    {
      status: 429,
      headers: {
        "retry-after": String(LOGIN_WINDOW_MINUTES * 60),
        "cache-control": "no-store",
      },
    },
  );
}
