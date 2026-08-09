import { PageFooter, PageHeader } from "../components/PageChrome";
import AdLeadForm from "./AdLeadForm";

export const metadata = { title: "Publicidad" };

const formats = [
  ["Impacto principal", "970 × 90", "Encima de la cabecera y visible al entrar al portal."],
  ["Portada premium", "728 × 90", "Entre los bloques de mayor lectura de la portada."],
  ["Robapágina", "300 × 600", "Ubicación lateral de alta permanencia visual."],
  ["Dentro de noticia", "728 × 90", "Integrado estratégicamente en artículos y reportajes."],
  ["Video patrocinado", "16:9", "Contenido audiovisual con presencia de marca."],
  ["Especial de marca", "A medida", "Landing, reportaje patrocinado y distribución multicanal."],
];

export default function AdvertisingPage() {
  return <main><PageHeader /><section className="commercial-hero"><div className="container"><span>VD MEDIA</span><h1>Tu marca, frente a una audiencia que quiere estar informada</h1><p>Campañas digitales, contenido patrocinado, video y presencia estratégica en VD Noticias y Visión Dominicana TV.</p><a href="#propuesta">Solicitar propuesta →</a></div></section><section className="container commercial-page"><header><span>INVENTARIO PUBLICITARIO</span><h2>Formatos diseñados para generar visibilidad</h2><p>Cada posición puede segmentarse por sección, periodo y objetivo de campaña.</p></header><div className="format-grid">{formats.map(([name, size, copy], index) => <article key={name}><b>0{index + 1}</b><span>{size}</span><h3>{name}</h3><p>{copy}</p></article>)}</div><section className="commercial-benefits"><div><span>UNA PROPUESTA 360</span><h2>Más que colocar un banner</h2></div><ul><li>Portada y secciones temáticas</li><li>Reportajes y contenido patrocinado identificado</li><li>Video, entrevistas y transmisiones</li><li>Distribución en redes sociales y canales de VD</li><li>Reporte de impresiones, clics y rendimiento</li><li>Paquetes para empresas, instituciones y eventos</li></ul></section><section className="proposal-section" id="propuesta"><div><span>HABLEMOS</span><h2>Solicita una propuesta comercial</h2><p>Cuéntanos el objetivo y prepararemos una combinación de formatos ajustada a tu público.</p></div><AdLeadForm /></section></section><PageFooter /></main>;
}
