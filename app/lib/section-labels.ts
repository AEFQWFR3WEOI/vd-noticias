// Nombres de sección tal como se muestran al lector (con tildes y mayúscula inicial).
export const SECTION_LABELS: Record<string, string> = {
  nacionales: "Nacionales", politica: "Política", economia: "Economía", mundo: "Mundo", deportes: "Deportes",
  entretenimiento: "Entretenimiento", revista: "Revista", tecnologia: "Tecnología", salud: "Salud", educacion: "Educación",
  turismo: "Turismo", cultura: "Cultura", opinion: "Opinión", planeta: "Planeta", videos: "Videos",
};

export function sectionLabel(value?: string | null) {
  if (!value) return "";
  const key = value.trim().toLowerCase();
  if (SECTION_LABELS[key]) return SECTION_LABELS[key];
  const lower = value.trim().toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
