"use client";

import { useEffect, useState } from "react";

export type MenuEntry = {
  title: string;
  href: string;
  links?: { label: string; href: string }[];
};

type Props = { entries: MenuEntry[] };

// Menú lateral de secciones: lista vertical con subsecciones desplegables (+).
export default function SectionsMenu({ entries }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="sections-menu">
      <button
        type="button"
        className="sections-menu-toggle"
        aria-expanded={open}
        aria-controls="sections-drawer"
        aria-label={open ? "Cerrar menú de secciones" : "Abrir menú de secciones"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={`hamburger${open ? " is-open" : ""}`} aria-hidden="true"><i /><i /><i /></span>
        <b>Menú</b>
      </button>

      <div className={`sections-backdrop${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <aside
        id="sections-drawer"
        className={`sections-drawer${open ? " is-open" : ""}`}
        aria-label="Secciones"
        aria-hidden={!open}
        inert={!open}
      >
        <header className="sections-drawer-head">
          <h2>Secciones</h2>
          <button type="button" className="sections-close" aria-label="Cerrar menú" onClick={() => setOpen(false)}>×</button>
        </header>
        <nav>
          <ul className="sections-list">
            {entries.map((entry) => {
              const isExpanded = expanded === entry.title;
              const panelId = `sub-${entry.title.replace(/\W+/g, "-").toLowerCase()}`;
              return (
                <li key={entry.title} className={isExpanded ? "is-expanded" : ""}>
                  <div className="sections-row">
                    <a href={entry.href} onClick={() => setOpen(false)}>{entry.title}</a>
                    {entry.links && entry.links.length > 0 && (
                      <button
                        type="button"
                        className="sections-plus"
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        aria-label={`${isExpanded ? "Ocultar" : "Ver"} subsecciones de ${entry.title}`}
                        onClick={() => setExpanded(isExpanded ? null : entry.title)}
                      >
                        <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
                      </button>
                    )}
                  </div>
                  {entry.links && isExpanded && (
                    <ul className="sections-sublist" id={panelId}>
                      {entry.links.map((link) => (
                        <li key={link.label}><a href={link.href} onClick={() => setOpen(false)}>{link.label}</a></li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <a className="sections-live" href="/programacion#en-vivo" onClick={() => setOpen(false)}><i /> Ver VD en vivo</a>
      </aside>
    </div>
  );
}
