import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VD Noticias | Visión Dominicana TV",
    short_name: "VD Noticias",
    description: "Noticias verificadas de República Dominicana y el mundo.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#020b2d",
    lang: "es-DO",
    icons: [{ src: "/vd-noticias-logo.png", sizes: "512x512", type: "image/png" }],
  };
}

