import { getDbReady } from "../../../db";
import { contactMessages } from "../../../db/schema";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    if (body.website) return Response.json({ ok: true }, { status: 201 });
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const message = String(body.message || "").trim();
    const topic = ["editorial", "correccion", "denuncia", "derecho-replica", "alianza"].includes(body.topic) ? body.topic : "editorial";
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 20 || message.length > 5000) {
      return Response.json({ error: "Completa nombre, correo válido y un mensaje de 20 a 5,000 caracteres." }, { status: 400 });
    }
    const [entry] = await (await getDbReady()).insert(contactMessages).values({ name, email, topic, message }).returning({ id: contactMessages.id });
    return Response.json({ ok: true, id: entry.id }, { status: 201 });
  } catch {
    return Response.json({ error: "No pudimos recibir el mensaje. Inténtalo nuevamente." }, { status: 500 });
  }
}

