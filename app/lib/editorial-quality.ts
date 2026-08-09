export type EditorialDraft = {
  title?: string | null;
  summary?: string | null;
  body?: string | null;
  categorySlug?: string | null;
  heroImageUrl?: string | null;
};

export type QualityFinding = {
  code: string;
  label: string;
  level: "error" | "warning";
};

export function wordCount(value = "") {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export function evaluateEditorialQuality(draft: EditorialDraft): QualityFinding[] {
  const title = draft.title?.trim() ?? "";
  const summary = draft.summary?.trim() ?? "";
  const body = draft.body?.trim() ?? "";
  const isOpinion = draft.categorySlug === "opinion";
  const findings: QualityFinding[] = [];

  if (title.length < 25) findings.push({ code: "short-title", label: "El titular necesita más contexto.", level: "error" });
  if (title.length > 120) findings.push({ code: "long-title", label: "El titular supera 120 caracteres; conviene hacerlo más directo.", level: "warning" });
  if (summary.length < 80) findings.push({ code: "short-summary", label: "La descripción debe explicar el hecho en al menos 80 caracteres.", level: "error" });
  if (summary.length > 170) findings.push({ code: "long-summary", label: "La descripción debe mantenerse por debajo de 170 caracteres para buscadores.", level: "error" });
  if (wordCount(body) < 150) findings.push({ code: "thin-body", label: "El artículo necesita al menos 150 palabras verificadas.", level: "error" });
  if (!draft.heroImageUrl) findings.push({ code: "missing-media", label: "Falta la multimedia principal.", level: "warning" });
  if (!isOpinion && !/^Fuente consultada:/m.test(body)) findings.push({ code: "missing-source", label: "Incluye al menos una fuente identificada y su enlace.", level: "error" });
  if (/\b(según fuentes|trascendió|se dice)\b/i.test(body) && !/Fuente consultada:/m.test(body)) {
    findings.push({ code: "vague-attribution", label: "Hay una atribución imprecisa que debe documentarse.", level: "error" });
  }
  return findings;
}

export function isIndexableArticle(draft: EditorialDraft) {
  return !evaluateEditorialQuality(draft).some((finding) => finding.level === "error");
}

