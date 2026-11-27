import type { Metadata } from "next";
import { PageFooter, PageHeader } from "../components/PageChrome";
import { WHATSAPP_DISPLAY, whatsappLink } from "../lib/site-config";
import TipForm from "./TipForm";

export const metadata: Metadata = {
  title: "Envía tu denuncia",
  description: "¿Viste algo que debe saberse? Envía tu denuncia con fotos o videos a VD Noticias por WhatsApp o desde este formulario.",
  alternates: { canonical: "/denuncia" },
};

export default function TipPage() {
  return (
    <main className="public-site">
      <PageHeader />
      <section className="tip-hero">
        <div className="container tip-hero-inner">
          <div>
            <span>VD NOTICIAS · DENUNCIAS</span>
            <h1>¿Viste algo que debe saberse?</h1>
            <p>Envíanos tu denuncia con fotos o videos. Nuestro equipo la verifica antes de publicarla y tu identidad se mantiene en reserva.</p>
          </div>
          <a className="tip-whatsapp" href={whatsappLink("Hola VD Noticias, quiero enviar una denuncia: ")} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" /></svg>
            <span><b>Enviar por WhatsApp</b><small>{WHATSAPP_DISPLAY}</small></span>
          </a>
        </div>
      </section>
      <div className="container tip-body">
        <h2>O llena este formulario</h2>
        <TipForm />
      </div>
      <PageFooter />
    </main>
  );
}
