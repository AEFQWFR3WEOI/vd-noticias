/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { PageFooter, PageHeader } from "../components/PageChrome";
import ReelsStrip from "../components/ReelsStrip";
import { getReels } from "../lib/reels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reels",
  description: "Las noticias en video vertical de Visión Dominicana TV: lo último de República Dominicana y el mundo en menos de un minuto.",
  alternates: { canonical: "/reels" },
};

export default async function ReelsPage() {
  const reels = await getReels(60);
  return (
    <main className="public-site">
      <PageHeader active="Reels" />
      <section className="reels-page-hero">
        <div className="container">
          <span><i aria-hidden="true" /> VD REELS</span>
          <h1>Las noticias en video</h1>
          <p>Lo último de República Dominicana y el mundo en menos de un minuto, en formato vertical.</p>
          <a className="vd-reels-ig" href="https://www.instagram.com/visiondominicanatv/" target="_blank" rel="noopener noreferrer">Síguenos en @visiondominicanatv</a>
        </div>
      </section>
      <div className="container reels-page-body">
        {reels.length
          ? <ReelsStrip reels={reels} variant="grid" />
          : <section className="empty-publication"><h2>Muy pronto</h2><p>Aquí aparecerán los reels de Visión Dominicana TV.</p><a href="/">Volver a la portada</a></section>}
      </div>
      <PageFooter />
    </main>
  );
}
