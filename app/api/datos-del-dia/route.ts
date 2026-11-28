import { getDailyData } from "../../lib/daily-data";

// Clima y tasas para la barra superior (caché de 10 minutos).
export async function GET() {
  const data = await getDailyData();
  const complete = Boolean(data.weather && data.rates);
  return Response.json(data, { headers: { "cache-control": complete ? "public, max-age=600, s-maxage=600" : "no-store" } });
}
