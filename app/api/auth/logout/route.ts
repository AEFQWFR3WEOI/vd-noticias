import { getDbReady } from "../../../../db";
import { auditLog } from "../../../../db/schema";
import {
  clearSessionCookieHeader,
  hasSameOrigin,
  revokeEditorialSession,
  safeRelativeReturnPath,
  sessionTokenFromRequest,
} from "../../../session-auth";

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: "Solicitud no autorizada" }, { status: 403 });
  }

  const token = sessionTokenFromRequest(request);
  if (token) {
    const email = await revokeEditorialSession(token);
    if (email) {
      await (await getDbReady()).insert(auditLog).values({
        actorEmail: email,
        action: "auth.logout",
        entityType: "editorial_session",
        entityId: email,
        detail: "Sesión cerrada por el usuario",
      });
    }
  }

  let returnTo = "/login";
  try {
    const form = await request.formData();
    const requested = form.get("returnTo");
    if (typeof requested === "string" && requested !== "/") {
      returnTo = safeRelativeReturnPath(requested);
    }
  } catch {
    // Logout remains idempotent even when no form body is sent.
  }

  return new Response(null, {
    status: 303,
    headers: {
      location: returnTo,
      "cache-control": "no-store",
      "set-cookie": clearSessionCookieHeader(request),
    },
  });
}
