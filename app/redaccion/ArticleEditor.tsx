"use client";

import { FormEvent, useState } from "react";
import { evaluateEditorialQuality, wordCount } from "../lib/editorial-quality";
import { uploadMediaFile } from "./media-upload";

export type EditableArticle = {
  id: number;
  title: string;
  summary: string;
  body: string;
  categorySlug: string;
  heroImageUrl: string | null;
  isBreaking: boolean;
  status: string;
};

type Props = { canPublish: boolean; article?: EditableArticle };

const categories = [
  ["nacionales", "Nacionales"], ["politica", "Política"], ["economia", "Economía"], ["mundo", "Mundo"],
  ["deportes", "Deportes"], ["revista", "Revista"], ["entretenimiento", "Entretenimiento"], ["tecnologia", "Tecnología"],
  ["salud", "Salud"], ["educacion", "Educación"], ["turismo", "Turismo"], ["cultura", "Cultura"],
  ["opinion", "Opinión"], ["planeta", "Planeta"], ["videos", "Videos"],
];

export default function ArticleEditor({ canPublish, article }: Props) {
  const sourceBlock = article?.body.split(/\n+/).find((line) => line.startsWith("Fuente consultada:"));
  const [initialSourceName = "", initialSourceUrl = ""] = sourceBlock?.replace("Fuente consultada:", "").split("|").map((value) => value.trim()) || [];
  const initialBody = article?.body.split(/\n+/).filter((line) => !line.startsWith("Fuente consultada:")).join("\n\n") || "";
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [findings, setFindings] = useState(() => evaluateEditorialQuality(article || {}));
  const [words, setWords] = useState(wordCount(initialBody));

  function inspect(form: HTMLFormElement) {
    const values = new FormData(form);
    const body = String(values.get("body") || "");
    const sourceName = String(values.get("sourceName") || "").trim();
    const sourceUrl = String(values.get("sourceUrl") || "").trim();
    const completeBody = sourceName ? `${body}\nFuente consultada: ${sourceName}${sourceUrl ? ` | ${sourceUrl}` : ""}` : body;
    setWords(wordCount(body));
    setFindings(evaluateEditorialQuality({
      title: String(values.get("title") || ""), summary: String(values.get("summary") || ""), body: completeBody,
      categorySlug: String(values.get("categorySlug") || ""),
      heroImageUrl: String(values.get("mediaUrl") || "") || ((values.get("hero") as File | null)?.size ? "upload-pending" : ""),
    }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status = (submitter?.value ?? "draft") as "draft" | "review" | "published";
    setBusy(true); setMessage("");
    const form = event.currentTarget;
    const values = new FormData(form);
    let heroImageUrl = String(values.get("mediaUrl") ?? "").trim();
    const file = values.get("hero") as File | null;
    if (file?.size) {
      try {
        const asset = await uploadMediaFile(file, String(values.get("imageAlt") ?? ""), (progress) => setMessage(`Subiendo multimedia… ${progress}%`));
        heroImageUrl = asset.url;
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se pudo subir el archivo multimedia"); setBusy(false); return;
      }
    }
    const endpoint = article ? `/api/articles/${article.id}` : "/api/articles";
    const response = await fetch(endpoint, { method: article ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: values.get("title"), summary: values.get("summary"), body: values.get("body"), categorySlug: values.get("categorySlug"), heroImageUrl, sourceName: values.get("sourceName"), sourceUrl: values.get("sourceUrl"), isBreaking: values.get("isBreaking") === "on", status }) });
    const result = await response.json() as { article?: { id: number }; error?: string };
    setMessage(response.ok ? `Noticia ${article ? "actualizada" : "guardada"} correctamente · #${result.article?.id}` : result.error ?? "No se pudo guardar");
    if (response.ok && !article) form.reset();
    setBusy(false);
  }

  return <form className="editor-form" onSubmit={save} onInput={(event) => inspect(event.currentTarget)}>
    <div className="editor-top"><label>Titular<input name="title" required defaultValue={article?.title} placeholder="Escribe un titular claro y verificable" /></label><label>Sección<select name="categorySlug" defaultValue={article?.categorySlug || "nacionales"}>{categories.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div>
    <label>Descripción SEO y de portada<textarea name="summary" rows={2} maxLength={170} required defaultValue={article?.summary} placeholder="Resume qué pasó, dónde y por qué importa (80–170 caracteres)" /></label>
    <label>Contenido de la noticia<textarea className="body-editor" name="body" rows={14} required defaultValue={initialBody} placeholder="Redacta el cuerpo completo de la noticia…" /><small>{words} palabras · mínimo editorial: 150</small></label>
    <div className="editor-source"><label>Fuente principal<input name="sourceName" defaultValue={initialSourceName} placeholder="Institución, documento o persona" /></label><label>Enlace de la fuente<input name="sourceUrl" type="url" defaultValue={initialSourceUrl} placeholder="https://" /></label></div>
    <div className="editor-media"><label>Multimedia principal<input type="file" name="hero" accept="image/*,video/*,audio/*" /><small>Imagen, video o audio · máximo 100 MB</small></label><label>Descripción del archivo<input name="imageAlt" placeholder="Describe con precisión la imagen, el video o el audio" /></label><label className="media-url-field">O usar un enlace de la Biblioteca multimedia<input name="mediaUrl" type="url" defaultValue={article?.heroImageUrl || ""} placeholder="Pega aquí el enlace que copiaste de Multimedia" /><small>Los videos publicados aparecen automáticamente en VD Play y enlazan al artículo.</small></label><label className="checkbox-label"><input type="checkbox" name="isBreaking" defaultChecked={article?.isBreaking} /> Marcar como última hora</label></div>
    <aside className={`quality-agent ${findings.some((finding) => finding.level === "error") ? "quality-agent--pending" : "quality-agent--ready"}`}><span>AGENTE DE CALIDAD EDITORIAL</span><h3>{findings.length ? `${findings.length} controles pendientes` : "Listo para revisión humana"}</h3>{findings.length ? <ul>{findings.map((finding) => <li className={finding.level} key={finding.code}>{finding.label}</li>)}</ul> : <p>El sistema no detecta bloqueos técnicos. Un editor todavía debe verificar los hechos y aprobar la publicación.</p>}</aside>
    <div className="editor-actions"><button type="submit" value="draft" disabled={busy}>Guardar borrador</button><button type="submit" value="review" disabled={busy}>Enviar a revisión</button>{canPublish && <button className="publish" type="submit" value="published" disabled={busy}>{article?.status === "published" ? "Actualizar publicación" : "Publicar ahora"}</button>}</div>{message && <p className="editor-message">{message}</p>}
  </form>;
}
