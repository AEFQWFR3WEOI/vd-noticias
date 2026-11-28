// Datos del día para la barra superior: clima en Santo Domingo y tasas.
// Fuentes gratuitas (con atribución en el pie): Open-Meteo y ExchangeRate-API.
// Cloudflare guarda la respuesta en caché para no consultar en cada visita.

export type DailyData = {
  weather: { temp: number; max: number; min: number; label: string; icon: string } | null;
  rates: { usd: number; eur: number; updated: string } | null;
};

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=18.4861&longitude=-69.9312&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FSanto_Domingo&forecast_days=1";
const RATES_URL = "https://open.er-api.com/v6/latest/USD";

function describeWeather(code: number, isDay: boolean) {
  if (code === 0) return { label: "Despejado", icon: isDay ? "☀️" : "🌙" };
  if (code <= 2) return { label: "Parcialmente nublado", icon: isDay ? "⛅" : "☁️" };
  if (code === 3) return { label: "Nublado", icon: "☁️" };
  if (code === 45 || code === 48) return { label: "Neblina", icon: "🌫️" };
  if (code >= 51 && code <= 67) return { label: "Lluvia", icon: "🌧️" };
  if (code >= 80 && code <= 82) return { label: "Aguaceros", icon: "🌦️" };
  if (code >= 95) return { label: "Tormenta", icon: "⛈️" };
  return { label: "Variable", icon: "🌤️" };
}

async function cachedJson<T>(url: string, ttlSeconds: number): Promise<T | null> {
  try {
    const response = await fetch(url, {
      // Caché en el borde de Cloudflare.
      cf: { cacheTtl: ttlSeconds, cacheEverything: true },
      signal: AbortSignal.timeout(2500),
    } as RequestInit);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getDailyData(): Promise<DailyData> {
  const [weatherJson, ratesJson] = await Promise.all([
    cachedJson<{ current?: { temperature_2m: number; weather_code: number; is_day: number }; daily?: { temperature_2m_max: number[]; temperature_2m_min: number[] } }>(WEATHER_URL, 1200),
    cachedJson<{ result?: string; rates?: Record<string, number>; time_last_update_utc?: string }>(RATES_URL, 3600),
  ]);

  let weather: DailyData["weather"] = null;
  if (weatherJson?.current) {
    const { label, icon } = describeWeather(weatherJson.current.weather_code, weatherJson.current.is_day === 1);
    weather = {
      temp: Math.round(weatherJson.current.temperature_2m),
      max: Math.round(weatherJson.daily?.temperature_2m_max?.[0] ?? weatherJson.current.temperature_2m),
      min: Math.round(weatherJson.daily?.temperature_2m_min?.[0] ?? weatherJson.current.temperature_2m),
      label,
      icon,
    };
  }

  let rates: DailyData["rates"] = null;
  const dop = ratesJson?.rates?.DOP;
  const eur = ratesJson?.rates?.EUR;
  if (ratesJson?.result === "success" && dop && eur) {
    rates = { usd: dop, eur: dop / eur, updated: ratesJson.time_last_update_utc ?? "" };
  }
  return { weather, rates };
}
