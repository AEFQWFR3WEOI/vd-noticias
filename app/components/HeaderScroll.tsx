"use client";

import { useEffect } from "react";

// Al bajar, la franja del logo se oculta y queda solo la barra de secciones;
// al subir, vuelve a aparecer. Así la noticia ocupa casi toda la pantalla.
export default function HeaderScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".vd-header");
    const masthead = header?.querySelector<HTMLElement>(".vd-header-main");
    if (!header || !masthead) return;

    const measure = () => root.style.setProperty("--masthead-h", `${masthead.offsetHeight}px`);
    measure();

    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (y > 220 && y > lastY + 4) root.classList.add("header-hidden");
      else if (y < lastY - 4 || y <= 220) root.classList.remove("header-hidden");
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      root.classList.remove("header-hidden");
    };
  }, []);
  return null;
}
