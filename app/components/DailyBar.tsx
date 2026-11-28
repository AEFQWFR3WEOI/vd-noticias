"use client";

import { useEffect, useState } from "react";
import type { DailyData } from "../lib/daily-data";

const money = (value: number) => value.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Clima y tasas en la barra superior. Se cargan aparte para no frenar la página.
export default function DailyBar() {
  const [data, setData] = useState<DailyData | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/api/datos-del-dia").then((response) => response.ok ? response.json() : null).then((json) => { if (alive && json) setData(json as DailyData); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  return <>
    {data?.weather
      ? <span className="vd-topbar-weather" title={`${data.weather.label} · Máx. ${data.weather.max}° · Mín. ${data.weather.min}°`}><i aria-hidden="true">{data.weather.icon}</i> Santo Domingo <b>{data.weather.temp}°C</b></span>
      : <span className="vd-topbar-place">Santo Domingo, República Dominicana</span>}
    {data?.rates && <span className="vd-topbar-rates" title="Tasa de referencia del mercado, actualizada a diario">
      <span>Dólar <b>RD${money(data.rates.usd)}</b></span>
      <span className="vd-topbar-eur">Euro <b>RD${money(data.rates.eur)}</b></span>
    </span>}
  </>;
}
