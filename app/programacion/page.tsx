import type { Metadata } from "next";
import BroadcastHub from "../components/BroadcastHub";
import { PageFooter, PageHeader } from "../components/PageChrome";
import { getBroadcastHub, getRecentVideos } from "../lib/public-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "En vivo, programación y pódcasts",
  description: "Señal en vivo, noticias en video, programas y pódcasts de Visión Dominicana TV y VD Noticias.",
};

export default async function ProgrammingPage() {
  const [data, videos] = await Promise.all([getBroadcastHub(), getRecentVideos(24)]);
  return (
    <main className="public-site programming-page">
      <PageHeader active="Programación" />
      <section className="programming-intro"><div className="container"><span>VISIÓN DOMINICANA TV</span><h1>En vivo y a tu ritmo</h1><p>Una sola pantalla para seguir la señal, descubrir nuestros programas y volver a ver las noticias en video.</p><nav><a href="#en-vivo">En vivo</a><a href="#videos">Videos</a><a href="#programas">Programas y pódcasts</a></nav></div></section>
      <BroadcastHub data={data} videos={videos} expanded />
      <PageFooter />
    </main>
  );
}
