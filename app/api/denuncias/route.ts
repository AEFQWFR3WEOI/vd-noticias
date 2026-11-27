import { and, desc, eq, gte, count } from "drizzle-orm";
import { getDbReady } from "../../../db";
import { auditLog, citizenTips } from "../../../db/schema";
import { getEditorialUser } from "../../lib/editorial-auth";
import { clientIpFromRequest } from "../../lib/login-rate-limit";
import { isProvinceSlug } from "../../lib/provinces";

type Bucket = { put(key: string, value: ReadableStream | ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown> };

const MAX_FILES = 4;
const MAX_FILE_BYTES = 40 * 1024 * 1024;
const MAX_TOTAL_BYTES = 90 * 1024 * 1024;
const MAX_PER_HOUR = 5;

const clean = (value: FormDataEntryValue | null, max: number) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

// Recibe una denuncia pública (texto + fotos/videos opcionales).
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "No se pudo leer el formulario. Si los archivos son muy pesados, envíalos por WhatsApp." }, { status: 400 });
  }
  // Campo trampa para robots: las personas no lo ven.
  if (clean(form.get("website"), 10)) return Response.json({ ok: true });

  const description = String(form.get("description") ?? "").trim().slice(0, 4000);
  if (description.length < 15) return Response.json({ error: "Cuéntanos qué pasó (al menos una o dos oraciones)." }, { status: 400 });

  const files = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  if (files.length > MAX_FILES) return Response.json({ error: `Puedes adjuntar hasta ${MAX_FILES} archivos.` }, { status: 400 });
  let total = 0;
  for (const file of files) {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) return Response.json({ error: "Solo se aceptan fotos y videos." }, { status: 400 });
    if (file.size > MAX_FILE_BYTES) return Response.json({ error: "Cada archivo puede pesar hasta 40 MB. Para videos más largos usa WhatsApp." }, { status: 400 });
    total += file.size;
  }
  if (total > MAX_TOTAL_BYTES) return Response.json({ error: "Los archivos juntos superan 90 MB. Envía los videos por WhatsApp." }, { status: 400 });

  const ipAddress = clientIpFromRequest(request);
  const db = await getDbReady();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString().replace("T", " ").slice(0, 19);
  const [recent] = await db.select({ total: count() }).from(citizenTips).where(and(eq(citizenTips.ipAddress, ipAddress), gte(citizenTips.createdAt, hourAgo)));
  if ((recent?.total ?? 0) >= MAX_PER_HOUR) return Response.json({ error: "Ya recibimos varias denuncias desde tu conexión. Intenta más tarde o escríbenos por WhatsApp." }, { status: 429 });

  const { env } = await import("cloudflare:workers");
  const bucket = (env as unknown as { BUCKET?: Bucket }).BUCKET;
  const folder = `denuncias/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}`;
  const mediaKeys: { key: string; type: string; name: string }[] = [];
  if (files.length && !bucket) return Response.json({ error: "No se pudieron guardar los archivos. Envíalos por WhatsApp." }, { status: 503 });
  for (const [index, file] of files.entries()) {
    const safeName = file.name.normalize("NFD").replace(/[^\w.-]+/g, "-").slice(-60) || `archivo-${index + 1}`;
    const key = `${folder}/${index + 1}-${safeName}`;
    await bucket!.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    mediaKeys.push({ key, type: file.type, name: file.name.slice(0, 120) });
  }

  const province = clean(form.get("province"), 40);
  const [tip] = await db.insert(citizenTips).values({
    name: clean(form.get("name"), 100),
    phone: clean(form.get("phone"), 30),
    province: isProvinceSlug(province) ? province : "",
    place: clean(form.get("place"), 160),
    description,
    mediaKeys: JSON.stringify(mediaKeys),
    allowCredit: form.get("allowCredit") === "on",
    ipAddress,
  }).returning({ id: citizenTips.id });
  return Response.json({ ok: true, id: tip.id }, { status: 201 });
}

// Lista para la sala de redacción.
export async function GET() {
  const user = await getEditorialUser();
  if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 401 });
  const rows = await (await getDbReady()).select().from(citizenTips).orderBy(desc(citizenTips.createdAt), desc(citizenTips.id)).limit(100);
  return Response.json({ tips: rows.map(({ ipAddress: _ip, ...row }) => ({ ...row, media: JSON.parse(row.mediaKeys || "[]") })) });
}

// Cambiar el estado (en revisión, publicada, descartada).
export async function PATCH(request: Request) {
  const user = await getEditorialUser();
  if (!user) return Response.json({ error: "Acceso no autorizado" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { id?: number; status?: string };
  const status = body.status as "new" | "reviewing" | "published" | "discarded";
  if (!Number.isInteger(body.id) || !["new", "reviewing", "published", "discarded"].includes(status)) return Response.json({ error: "Datos inválidos" }, { status: 400 });
  const db = await getDbReady();
  await db.update(citizenTips).set({ status }).where(eq(citizenTips.id, body.id as number));
  await db.insert(auditLog).values({ actorEmail: user.email, action: "tip.status", entityType: "citizen_tip", entityId: String(body.id), detail: status });
  return Response.json({ ok: true });
}
