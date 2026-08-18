import { and, eq, lt } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDbReady } from "../db";
import { editorialSessions, editorialUsers } from "../db/schema";
import {
  createOpaqueSessionToken,
  hashSessionToken,
} from "./lib/password-security";

export type SessionUser = {
  displayName: string;
  email: string;
  fullName: string | null;
};

export const SESSION_COOKIE_NAME = "vd_editorial_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const LOCAL_EDITORIAL_EMAIL = "local@vdnoticias.local";

function isLocalDevelopmentRequest(
  requestHeaders: Awaited<ReturnType<typeof headers>>,
) {
  if (process.env.NODE_ENV === "production") return false;
  const hostname = (requestHeaders.get("host") ?? "")
    .split(":")[0]
    .trim()
    .toLowerCase();
  return ["localhost", "127.0.0.1", "0.0.0.0", "terminal.local"].includes(
    hostname,
  );
}

export function isLocalEditorialIdentity(email: string) {
  return email.trim().toLowerCase() === LOCAL_EDITORIAL_EMAIL;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const requestHeaders = await headers();
  if (isLocalDevelopmentRequest(requestHeaders)) {
    return {
      displayName: "Administrador local",
      email: LOCAL_EDITORIAL_EMAIL,
      fullName: "Administrador local",
    };
  }

  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const db = await getDbReady();
  const now = new Date().toISOString();
  const [session] = await db
    .select()
    .from(editorialSessions)
    .where(eq(editorialSessions.tokenHash, hashSessionToken(token)))
    .limit(1);

  if (!session || session.expiresAt <= now) {
    if (session) {
      await db
        .delete(editorialSessions)
        .where(eq(editorialSessions.id, session.id));
    }
    return null;
  }

  const [user] = await db
    .select()
    .from(editorialUsers)
    .where(
      and(
        eq(editorialUsers.id, session.userId),
        eq(editorialUsers.active, true),
      ),
    )
    .limit(1);

  if (!user) return null;
  return {
    displayName: user.displayName,
    email: user.email,
    fullName: user.displayName,
  };
}

export async function requireSessionUser(returnTo: string) {
  const user = await getSessionUser();
  if (user) return user;
  redirect(sessionSignInPath(returnTo));
}

export function sessionSignInPath(returnTo: string) {
  return `/login?returnTo=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`;
}

export function safeRelativeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/redaccion";
  }

  try {
    const url = new URL(value, "https://app.local");
    if (url.origin !== "https://app.local") return "/redaccion";
    if (url.pathname === "/login" || url.pathname.startsWith("/api/auth/")) {
      return "/redaccion";
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/redaccion";
  }
}

export async function createEditorialSession(userId: number) {
  const db = await getDbReady();
  const token = createOpaqueSessionToken();
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + SESSION_TTL_SECONDS * 1000,
  ).toISOString();

  await db
    .delete(editorialSessions)
    .where(lt(editorialSessions.expiresAt, now.toISOString()));
  await db.insert(editorialSessions).values({
    userId,
    tokenHash: hashSessionToken(token),
    expiresAt,
  });
  return token;
}

export async function revokeEditorialSession(token: string) {
  const db = await getDbReady();
  const tokenHash = hashSessionToken(token);
  const [session] = await db
    .select()
    .from(editorialSessions)
    .where(eq(editorialSessions.tokenHash, tokenHash))
    .limit(1);
  if (!session) return null;

  const [user] = await db
    .select({ email: editorialUsers.email })
    .from(editorialUsers)
    .where(eq(editorialUsers.id, session.userId))
    .limit(1);
  await db
    .delete(editorialSessions)
    .where(eq(editorialSessions.tokenHash, tokenHash));
  return user?.email ?? null;
}

export function sessionCookieHeader(token: string, request: Request) {
  const secure =
    process.env.NODE_ENV === "production" ||
    new URL(request.url).protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";
  return [
    `${SESSION_COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_SECONDS}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearSessionCookieHeader(request: Request) {
  const secure =
    process.env.NODE_ENV === "production" ||
    new URL(request.url).protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";
  return [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function sessionTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (name === SESSION_COOKIE_NAME) return valueParts.join("=");
  }
  return null;
}

export function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
