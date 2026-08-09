import { desc } from "drizzle-orm";
import { getDbReady } from "../../../db";
import { adCampaigns } from "../../../db/schema";
import { canManageAds, getEditorialUser } from "../../lib/editorial-auth";

export async function GET() {
  const user = await getEditorialUser();
  if (!user || !canManageAds(user.role)) return Response.json({ error: "Acceso no autorizado" }, { status: 403 });
  return Response.json({ campaigns: await (await getDbReady()).select().from(adCampaigns).orderBy(desc(adCampaigns.createdAt)).limit(100) });
}

export async function POST(request: Request) {
  try {
    const user = await getEditorialUser();
    if (!user || !canManageAds(user.role)) return Response.json({ error: "Acceso no autorizado" }, { status: 403 });
    const body = (await request.json()) as Record<string, string>;
    if (!body.clientName?.trim() || !body.contactEmail?.includes("@") || !body.startsAt || !body.endsAt) return Response.json({ error: "Completa los datos obligatorios" }, { status: 400 });
    const [campaign] = await (await getDbReady()).insert(adCampaigns).values({ clientName: body.clientName.trim(), contactEmail: body.contactEmail.trim().toLowerCase(), placementCode: body.placementCode || "homepage-top", destinationUrl: body.destinationUrl?.trim() || null, startsAt: body.startsAt, endsAt: body.endsAt, status: "proposal" }).returning();
    return Response.json({ campaign }, { status: 201 });
  } catch { return Response.json({ error: "No se pudo crear la campaña" }, { status: 500 }); }
}
