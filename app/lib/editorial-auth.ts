import { and, eq } from "drizzle-orm";
import { getDbReady } from "../../db";
import { editorialUsers } from "../../db/schema";
import {
  getChatGPTUser,
  isLocalEditorialIdentity,
} from "../chatgpt-auth";

export type EditorialRole = "administrator" | "editor" | "journalist" | "commercial";

async function configuredOwnerEmail() {
  const { env } = await import("cloudflare:workers");
  return String((env as unknown as { EDITORIAL_OWNER_EMAIL?: string }).EDITORIAL_OWNER_EMAIL ?? "").trim().toLowerCase();
}

export async function getEditorialUser() {
  const identity = await getChatGPTUser();
  if (!identity) return null;

  const db = await getDbReady();
  const existing = await db
    .select()
    .from(editorialUsers)
    .where(and(eq(editorialUsers.email, identity.email), eq(editorialUsers.active, true)))
    .limit(1);

  if (existing[0]) return existing[0];

  // Local development gets an isolated administrator. This branch is never
  // active in a production build and keeps the hosted newsroom authorization
  // unchanged.
  if (
    process.env.NODE_ENV !== "production" &&
    isLocalEditorialIdentity(identity.email)
  ) {
    const created = await db
      .insert(editorialUsers)
      .values({
        email: identity.email,
        displayName: identity.displayName,
        role: "administrator",
      })
      .onConflictDoUpdate({
        target: editorialUsers.email,
        set: {
          displayName: identity.displayName,
          role: "administrator",
          active: true,
        },
      })
      .returning();
    return created[0] ?? null;
  }

  // Only the explicitly configured owner can bootstrap an empty newsroom.
  const anyUser = await db.select({ id: editorialUsers.id }).from(editorialUsers).limit(1);
  if (anyUser.length > 0) return null;

  const ownerEmail = await configuredOwnerEmail();
  if (!ownerEmail || identity.email.trim().toLowerCase() !== ownerEmail) return null;

  const created = await db
    .insert(editorialUsers)
    .values({
      email: identity.email,
      displayName: identity.displayName,
      role: "administrator",
    })
    .returning();
  return created[0] ?? null;
}

export function canPublish(role: EditorialRole) {
  return role === "administrator" || role === "editor";
}

export function canManageAds(role: EditorialRole) {
  return role === "administrator" || role === "commercial";
}
