import { getDbReady } from "../../../db";
import { newsletterSubscribers } from "../../../db/schema";

export async function POST(request: Request) {
  try {
    const { email = "" } = (await request.json()) as { email?: string };
    const value = email.trim().toLowerCase();
    if (!value.includes("@")) return Response.json({ error: "Correo inválido" }, { status: 400 });
    await (await getDbReady()).insert(newsletterSubscribers).values({ email: value }).onConflictDoUpdate({ target: newsletterSubscribers.email, set: { active: true } });
    return Response.json({ ok: true }, { status: 201 });
  } catch { return Response.json({ error: "No se pudo completar la suscripción" }, { status: 500 }); }
}
