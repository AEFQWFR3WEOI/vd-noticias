import type { Metadata } from "next";
import { PageFooter, PageHeader } from "../components/PageChrome";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: "Contacto y correcciones", description: "Contacta a la redacción de VD Noticias, solicita una corrección, ejerce el derecho a réplica o comparte una denuncia.", alternates: { canonical: "/contacto" } };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ asunto?: string }> }) {
  const { asunto = "editorial" } = await searchParams;
  return <main><PageHeader /><div className="container simple-page"><span>CONTACTO</span><h1>Hablemos con datos</h1><p>Este formulario llega al registro interno de la redacción. Para correcciones y réplicas, identifica la noticia y señala con precisión el dato que debemos revisar.</p><div className="contact-grid"><article><b>Redacción</b><p>Noticias, notas de prensa y solicitudes de cobertura.</p></article><article><b>Correcciones</b><p>Revisamos señalamientos documentados y dejamos constancia de los cambios materiales.</p></article><article><b>Derecho a réplica</b><p>Las personas o instituciones aludidas pueden enviar su posición y documentación.</p></article><article><b>Denuncia ciudadana</b><p>Comparte información de interés público. La recepción no garantiza publicación.</p></article></div><ContactForm initialTopic={asunto} /></div><PageFooter /></main>;
}
