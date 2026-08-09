import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDbReady } from "../../../../db";
import { articles } from "../../../../db/schema";
import { requireChatGPTUser } from "../../../chatgpt-auth";
import { canPublish, getEditorialUser } from "../../../lib/editorial-auth";
import ArticleEditor from "../../ArticleEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar noticia", robots: { index: false, follow: false } };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  await requireChatGPTUser(`/redaccion/editar/${rawId}`);
  const user = await getEditorialUser();
  const id = Number(rawId);
  if (!user || !Number.isInteger(id)) notFound();
  const [article] = await (await getDbReady()).select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!article) notFound();
  return <main className="newsroom-edit-page"><header><a href="/redaccion">← Volver a la sala</a><div><span>EDICIÓN CON HISTORIAL</span><h1>{article.title}</h1></div>{article.status === "published" && <a href={`/noticia/${article.slug}`} target="_blank">Ver publicada ↗</a>}</header><section className="editor-panel"><ArticleEditor canPublish={canPublish(user.role)} article={article} /></section></main>;
}
