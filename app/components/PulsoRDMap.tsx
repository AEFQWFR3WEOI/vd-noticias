"use client";

import { useMemo, useState } from "react";
import mapData from "../lib/dr-map.json";

export type PulsoStory = { slug: string; title: string; section: string };
export type PulsoData = Record<string, PulsoStory[]>;

type Props = { data: PulsoData };

const provinces = mapData.provinces as { slug: string; name: string; d: string; cx: number; cy: number }[];

// Color según la cantidad de noticias: de gris claro a rojo VD.
function heatColor(count: number, max: number) {
  if (!count) return "#e7ecf5";
  const t = Math.min(1, count / Math.max(max, 1));
  const stops = [
    [255, 214, 214],
    [246, 120, 120],
    [239, 16, 27],
    [168, 0, 12],
  ];
  const scaled = t * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const [r, g, b] = stops[i].map((value, k) => Math.round(value + (stops[i + 1][k] - value) * f));
  return `rgb(${r}, ${g}, ${b})`;
}

export default function PulsoRDMap({ data }: Props) {
  const ranked = useMemo(
    () => provinces
      .map((province) => ({ ...province, count: data[province.slug]?.length ?? 0 }))
      .sort((a, b) => b.count - a.count),
    [data],
  );
  const max = ranked[0]?.count ?? 0;
  const total = ranked.reduce((sum, province) => sum + province.count, 0);
  const active = ranked.filter((province) => province.count > 0).length;

  const [selected, setSelected] = useState<string>(ranked[0]?.count ? ranked[0].slug : "distrito-nacional");
  const [hovered, setHovered] = useState<string | null>(null);

  const current = provinces.find((province) => province.slug === selected) ?? provinces[0];
  const stories = data[current.slug] ?? [];
  const hoverInfo = hovered ? ranked.find((province) => province.slug === hovered) : null;

  return (
    <section className="pulso-rd" aria-labelledby="pulso-rd-title">
      <div className="pulso-head">
        <div>
          <span className="pulso-kicker"><i /> EN TIEMPO REAL</span>
          <h2 id="pulso-rd-title">Pulso RD</h2>
          <p>Lo que está pasando en cada provincia. Toca el mapa y descubre las noticias de tu pueblo.</p>
        </div>
        <dl className="pulso-stats">
          <div><dt>Noticias ubicadas</dt><dd>{total}</dd></div>
          <div><dt>Provincias activas</dt><dd>{active}<small>/32</small></dd></div>
        </dl>
      </div>

      <div className="pulso-body">
        <div className="pulso-map-wrap">
          <svg
            className="pulso-map"
            viewBox={`0 0 ${mapData.width} ${mapData.height}`}
            role="img"
            aria-label="Mapa de República Dominicana por provincias"
          >
            {ranked.slice().reverse().map((province) => (
              <path
                key={province.slug}
                d={province.d}
                fill={heatColor(province.count, max)}
                className={`pulso-province${province.slug === selected ? " is-selected" : ""}`}
                onClick={() => setSelected(province.slug)}
                onMouseEnter={() => setHovered(province.slug)}
                onMouseLeave={() => setHovered(null)}
                tabIndex={0}
                role="button"
                aria-label={`${province.name}: ${province.count} ${province.count === 1 ? "noticia" : "noticias"}`}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(province.slug);
                  }
                }}
              />
            ))}
            {ranked.filter((province) => province.count > 0).map((province) => (
              <g key={`dot-${province.slug}`} className="pulso-dot" transform={`translate(${province.cx} ${province.cy})`} pointerEvents="none">
                <circle r={9 + Math.min(10, province.count * 2)} className="pulso-ring" />
                <circle r={13} className="pulso-badge" />
                <text dy="4.5" textAnchor="middle">{province.count}</text>
              </g>
            ))}
          </svg>
          <div className="pulso-tooltip" aria-hidden="true" data-visible={hoverInfo ? "true" : "false"}>
            {hoverInfo && <><b>{hoverInfo.name}</b><span>{hoverInfo.count ? `${hoverInfo.count} ${hoverInfo.count === 1 ? "noticia" : "noticias"}` : "Sin noticias recientes"}</span></>}
          </div>
          <div className="pulso-legend" aria-hidden="true">
            <span>Menos</span><i /><span>Más noticias</span>
          </div>
        </div>

        <aside className="pulso-panel" aria-live="polite">
          <label className="pulso-select">
            <span>Provincia</span>
            <select value={current.slug} onChange={(event) => setSelected(event.target.value)}>
              {provinces.slice().sort((a, b) => a.name.localeCompare(b.name, "es")).map((province) => (
                <option key={province.slug} value={province.slug}>
                  {province.name}{data[province.slug]?.length ? ` (${data[province.slug].length})` : ""}
                </option>
              ))}
            </select>
          </label>
          <h3>{current.name}</h3>
          {stories.length ? (
            <ol>
              {stories.slice(0, 5).map((story) => (
                <li key={story.slug}>
                  <span>{story.section}</span>
                  <a href={`/noticia/${story.slug}`}>{story.title}</a>
                </li>
              ))}
            </ol>
          ) : (
            <p className="pulso-empty">Todavía no hay noticias recientes de {current.name}. ¿Pasa algo en tu provincia? <a href="/contacto">Cuéntanos</a></p>
          )}
          {stories.length > 5 && <a className="pulso-more" href={`/buscar?q=${encodeURIComponent(current.name)}`}>Ver las {stories.length} noticias</a>}
          <div className="pulso-top">
            <b>Más activas</b>
            {ranked.filter((province) => province.count > 0).slice(0, 4).map((province) => (
              <button type="button" key={province.slug} onClick={() => setSelected(province.slug)} className={province.slug === selected ? "is-active" : ""}>
                {province.name} <em>{province.count}</em>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
