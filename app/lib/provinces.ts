// Provincias de República Dominicana y palabras clave para ubicar noticias.
// Se evitan palabras comunes (p. ej. «Esperanza», «Guerra», «Mao») que darían falsos positivos.
// Se usan en el mapa «Pulso RD» y en el editor de artículos.

export type Province = { slug: string; name: string; keywords: string[] };

export const PROVINCES: Province[] = [
  { slug: "azua", name: "Azua", keywords: ["Azua", "Padre Las Casas", "Las Charcas"] },
  { slug: "baoruco", name: "Baoruco", keywords: ["Baoruco", "Bahoruco", "Neiba"] },
  { slug: "barahona", name: "Barahona", keywords: ["Barahona"] },
  { slug: "dajabon", name: "Dajabón", keywords: ["Dajabón", "Loma de Cabrera"] },
  { slug: "distrito-nacional", name: "Distrito Nacional", keywords: ["Distrito Nacional", "Ciudad Colonial", "Zona Colonial", "Gascue", "Piantini", "Naco", "Palacio Nacional", "Malecón de Santo Domingo", "Congreso Nacional", "Santo Domingo"] },
  { slug: "duarte", name: "Duarte", keywords: ["San Francisco de Macorís", "provincia Duarte", "Arenoso"] },
  { slug: "el-seibo", name: "El Seibo", keywords: ["El Seibo", "Seibo", "Miches"] },
  { slug: "elias-pina", name: "Elías Piña", keywords: ["Elías Piña", "Comendador"] },
  { slug: "espaillat", name: "Espaillat", keywords: ["Espaillat", "Moca", "Gaspar Hernández"] },
  { slug: "hato-mayor", name: "Hato Mayor", keywords: ["Hato Mayor", "Sabana de la Mar"] },
  { slug: "hermanas-mirabal", name: "Hermanas Mirabal", keywords: ["Hermanas Mirabal", "Salcedo", "Tenares"] },
  { slug: "independencia", name: "Independencia", keywords: ["provincia Independencia", "Jimaní", "Duvergé"] },
  { slug: "la-altagracia", name: "La Altagracia", keywords: ["La Altagracia", "Higüey", "Punta Cana", "Bávaro", "Bayahíbe", "Cap Cana"] },
  { slug: "la-romana", name: "La Romana", keywords: ["La Romana", "Casa de Campo", "Isla Saona"] },
  { slug: "la-vega", name: "La Vega", keywords: ["La Vega", "Jarabacoa", "Constanza"] },
  { slug: "maria-trinidad-sanchez", name: "María Trinidad Sánchez", keywords: ["María Trinidad Sánchez", "Nagua"] },
  { slug: "monsenor-nouel", name: "Monseñor Nouel", keywords: ["Monseñor Nouel", "Bonao"] },
  { slug: "monte-cristi", name: "Monte Cristi", keywords: ["Monte Cristi", "Montecristi"] },
  { slug: "monte-plata", name: "Monte Plata", keywords: ["Monte Plata", "Bayaguana", "Yamasá"] },
  { slug: "pedernales", name: "Pedernales", keywords: ["Pedernales", "Bahía de las Águilas", "Cabo Rojo"] },
  { slug: "peravia", name: "Peravia", keywords: ["Peravia", "Baní"] },
  { slug: "puerto-plata", name: "Puerto Plata", keywords: ["Puerto Plata", "Sosúa", "Cabarete"] },
  { slug: "samana", name: "Samaná", keywords: ["Samaná", "Las Terrenas", "Las Galeras"] },
  { slug: "san-cristobal", name: "San Cristóbal", keywords: ["San Cristóbal", "Haina", "Villa Altagracia"] },
  { slug: "san-jose-de-ocoa", name: "San José de Ocoa", keywords: ["San José de Ocoa", "Ocoa"] },
  { slug: "san-juan", name: "San Juan", keywords: ["San Juan de la Maguana", "provincia San Juan", "Las Matas de Farfán"] },
  { slug: "san-pedro-de-macoris", name: "San Pedro de Macorís", keywords: ["San Pedro de Macorís", "Juan Dolio"] },
  { slug: "sanchez-ramirez", name: "Sánchez Ramírez", keywords: ["Sánchez Ramírez", "Cotuí", "Pueblo Viejo", "Fantino"] },
  { slug: "santiago", name: "Santiago", keywords: ["Santiago de los Caballeros", "Santiago", "Tamboril"] },
  { slug: "santiago-rodriguez", name: "Santiago Rodríguez", keywords: ["Santiago Rodríguez", "San Ignacio de Sabaneta"] },
  { slug: "santo-domingo", name: "Santo Domingo", keywords: ["Santo Domingo Este", "Santo Domingo Norte", "Santo Domingo Oeste", "Boca Chica", "Los Alcarrizos", "Pedro Brand", "provincia Santo Domingo"] },
  { slug: "valverde", name: "Valverde", keywords: ["Valverde", "provincia Valverde"] },
];

export const PROVINCE_BY_SLUG = new Map(PROVINCES.map((province) => [province.slug, province]));

export function isProvinceSlug(value: unknown): value is string {
  return typeof value === "string" && PROVINCE_BY_SLUG.has(value);
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Las frases largas van primero y se "consumen", para que «Santo Domingo
// Este» no cuente también como «Santo Domingo» ni «Santiago Rodríguez» como
// «Santiago».
const MATCHERS = PROVINCES.flatMap((province) =>
  province.keywords.map((keyword) => ({
    slug: province.slug,
    length: keyword.length,
    pattern: new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalize(keyword))}(?=[^a-z0-9]|$)`, "g"),
  })),
).sort((a, b) => b.length - a.length);

function scoreText(text: string, weight: number, scores: Map<string, number>) {
  let remaining = normalize(text);
  for (const matcher of MATCHERS) {
    remaining = remaining.replace(matcher.pattern, (match, prefix: string) => {
      scores.set(matcher.slug, (scores.get(matcher.slug) ?? 0) + weight);
      return prefix + " ".repeat(match.length - prefix.length);
    });
  }
}

/** Detecta la provincia principal de una noticia a partir de su texto. */
export function detectProvince(article: { title?: string | null; summary?: string | null; body?: string | null }) {
  const scores = new Map<string, number>();
  scoreText(article.title ?? "", 4, scores);
  scoreText(article.summary ?? "", 2, scores);
  scoreText((article.body ?? "").slice(0, 4000), 1, scores);
  let best: string | null = null;
  let bestScore = 1;
  for (const [slug, score] of scores) {
    if (score > bestScore) {
      best = slug;
      bestScore = score;
    }
  }
  return best;
}
