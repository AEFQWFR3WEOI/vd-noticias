"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from "react";

type TeamMember = { id: number; email: string; displayName: string; role: string; active: boolean };

export function TeamManager() {
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  async function loadMembers() {
    const response = await fetch("/api/team");
    const result = await response.json() as { users?: TeamMember[]; currentUserEmail?: string; error?: string };
    if (!response.ok) {
      setMessage(result.error ?? "No se pudo cargar el equipo");
      return;
    }
    setMembers(result.users ?? []);
    setCurrentUserEmail(result.currentUserEmail ?? "");
  }

  useEffect(() => { void loadMembers(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const values = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/team", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json() as { member?: { email: string }; error?: string };
    setMessage(response.ok ? `${result.member?.email} ya puede iniciar sesión. Pídele que cambie la contraseña en «Mi cuenta» al entrar.` : result.error ?? "No se pudo guardar");
    if (response.ok) { form.reset(); await loadMembers(); }
  }

  async function revoke(email: string) {
    const response = await fetch(`/api/team?email=${encodeURIComponent(email)}`, { method: "DELETE" });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? `Acceso revocado para ${email}` : result.error ?? "No se pudo revocar");
    if (response.ok) await loadMembers();
  }

  return <div className="team-manager"><form className="mini-admin-form" onSubmit={submit}><label>Nombre<input name="displayName" placeholder="Nombre del periodista" /></label><label>Correo<input name="email" type="email" required placeholder="periodista@medio.com" /></label><label>Contraseña inicial<input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" placeholder="Mínimo 12 caracteres" /></label><label>Rol<select name="role" defaultValue="journalist"><option value="journalist">Periodista</option><option value="editor">Editor</option><option value="commercial">Comercial</option><option value="administrator">Administrador</option></select></label><button>Crear acceso</button>{message && <p>{message}</p>}</form><div className="team-access-list"><header><b>Personas autorizadas</b><span>{members.filter((member) => member.active).length} activas</span></header>{members.filter((member) => member.active).map((member) => <article key={member.id}><div><b>{member.displayName}</b><small>{member.email}</small></div><span>{member.role}</span>{member.email === currentUserEmail ? <em>Tu cuenta</em> : <button type="button" onClick={() => void revoke(member.email)}>Revocar</button>}</article>)}</div></div>;
}

export function CampaignManager() {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const values = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/campaigns", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json() as { campaign?: { id: number }; error?: string };
    setMessage(response.ok ? `Propuesta publicitaria #${result.campaign?.id} registrada` : result.error ?? "No se pudo guardar"); if (response.ok) form.reset();
  }
  return <form className="mini-admin-form campaign-form" onSubmit={submit}><label>Cliente<input name="clientName" required /></label><label>Correo<input name="contactEmail" type="email" required /></label><label>Posición<select name="placementCode"><option value="homepage-top">Impacto principal 970 × 90</option><option value="homepage-middle">Portada premium 728 × 90</option><option value="article-inline">Dentro de noticia 728 × 90</option><option value="sidebar-300x600">Robapágina 300 × 600</option><option value="branded-content">Especial de marca</option></select></label><label>Enlace de destino<input name="destinationUrl" type="url" placeholder="https://" /></label><label>Inicio<input name="startsAt" type="date" required /></label><label>Fin<input name="endsAt" type="date" required /></label><button>Crear propuesta</button>{message && <p>{message}</p>}</form>;
}

export function PasswordChanger() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    if (values.newPassword !== values.confirmPassword) {
      setMessage("Las contraseñas nuevas no coinciden");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/auth/password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json() as { ok?: boolean; error?: string };
      setMessage(response.ok ? "Contraseña actualizada. Se cerraron tus sesiones en otros dispositivos." : result.error ?? "No se pudo cambiar la contraseña");
      if (response.ok) form.reset();
    } catch {
      setMessage("No se pudo conectar. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="mini-admin-form" onSubmit={submit}><label>Contraseña actual<input name="currentPassword" type="password" required maxLength={128} autoComplete="current-password" /></label><label>Contraseña nueva<input name="newPassword" type="password" required minLength={12} maxLength={128} autoComplete="new-password" placeholder="Mínimo 12 caracteres" /></label><label>Repite la contraseña nueva<input name="confirmPassword" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></label><button disabled={busy}>{busy ? "Guardando…" : "Cambiar contraseña"}</button>{message && <p>{message}</p>}</form>;
}

type ReelRow = { id: number; url: string; title: string; category: string; coverUrl: string; createdAt: string };
const REEL_CATEGORIES = ["Nacionales", "Internacionales", "Política", "Economía", "Deportes", "Entretenimiento", "Clima", "Sucesos", "Salud", "Tecnología"];

export function ReelsManager() {
  const [reels, setReels] = useState<ReelRow[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/reels");
    const result = await response.json() as { reels?: ReelRow[] };
    setReels(result.reels ?? []);
  }
  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true); setMessage("");
    let coverUrl = "";
    const file = values.get("cover") as File | null;
    if (file?.size) {
      try {
        const { uploadMediaFile } = await import("./media-upload");
        const asset = await uploadMediaFile(file, String(values.get("title") ?? ""), (progress) => setMessage(`Subiendo portada… ${progress}%`));
        coverUrl = asset.url;
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se pudo subir la portada"); setBusy(false); return;
      }
    }
    const response = await fetch("/api/reels", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: values.get("url"), title: values.get("title"), category: values.get("category"), coverUrl }) });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? "Video agregado. Ya aparece en la portada y en Videos." : result.error ?? "No se pudo agregar");
    if (response.ok) { form.reset(); await load(); }
    setBusy(false);
  }

  async function remove(id: number) {
    const response = await fetch(`/api/reels?id=${id}`, { method: "DELETE" });
    setMessage(response.ok ? "Video quitado del periódico." : "No se pudo quitar");
    if (response.ok) await load();
  }

  return <div className="reels-manager">
    <form className="mini-admin-form" onSubmit={submit}>
      <label>Enlace del reel de Instagram<input name="url" type="url" required placeholder="https://www.instagram.com/reel/…" /></label>
      <label>Titular (opcional)<input name="title" maxLength={200} placeholder="Ej.: Accidente de tránsito en la Jacobo Majluta" /></label>
      <label>Categoría<select name="category" defaultValue="Nacionales">{REEL_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label>Portada (opcional, recomendada)<input name="cover" type="file" accept="image/*" /></label>
      <button disabled={busy}>{busy ? "Guardando…" : "Agregar video"}</button>
      {message && <p>{message}</p>}
    </form>
    <div className="team-access-list">
      <header><b>Videos publicados</b><span>{reels.length}</span></header>
      {reels.map((reel) => <article key={reel.id}><div><b>{reel.title || "Sin titular"}</b><small>{reel.category} · <a href={reel.url} target="_blank" rel="noreferrer">Ver en Instagram</a></small></div><button type="button" onClick={() => void remove(reel.id)}>Quitar</button></article>)}
    </div>
  </div>;
}
