import { getDbReady } from "../../../db";
import { advertiserLeads } from "../../../db/schema";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    const company = body.company?.trim();
    const contactName = body.contactName?.trim();
    const email = body.email?.trim().toLowerCase();
    if (!company || !contactName || !email || !email.includes("@")) return Response.json({ error: "Datos incompletos" }, { status: 400 });
    const [lead] = await (await getDbReady()).insert(advertiserLeads).values({ company, contactName, email, phone: body.phone?.trim() ?? "", objective: body.objective?.trim() ?? "", budget: body.budget?.trim() ?? "" }).returning({ id: advertiserLeads.id });
    return Response.json({ ok: true, id: lead.id }, { status: 201 });
  } catch {
    return Response.json({ error: "No se pudo registrar la solicitud" }, { status: 500 });
  }
}
