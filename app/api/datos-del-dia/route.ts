import { dailyDataErrors, getDailyData } from "../../lib/daily-data";

export async function GET() {
  dailyDataErrors.length = 0;
  const data = await getDailyData();
  return Response.json({ ...data, errors: [...dailyDataErrors] }, { headers: { "cache-control": "no-store" } });
}
