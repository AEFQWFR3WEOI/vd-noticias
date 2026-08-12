import { eq } from "drizzle-orm";
import { getDbReady } from "../../../db";
import { broadcastChannels } from "../../../db/schema";
import { resolveChannelStatus } from "../../lib/live-channel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await (await getDbReady()).select().from(broadcastChannels).where(eq(broadcastChannels.id, 1)).limit(1);
    if (!rows[0]) return Response.json({ source: "offline", url: "", live: false, label: "FUERA DEL AIRE", checkedAt: new Date().toISOString() });
    const result = await resolveChannelStatus(rows[0]);
    return Response.json(result, { headers: { "cache-control": "public, max-age=10, stale-while-revalidate=20" } });
  } catch {
    return Response.json({ source: "offline", url: "", live: false, label: "FUERA DEL AIRE", checkedAt: new Date().toISOString() }, { status: 503 });
  }
}
