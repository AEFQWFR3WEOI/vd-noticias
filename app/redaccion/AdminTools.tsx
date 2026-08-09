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
    setMessage(response.ok ? `${result.member?.email} ya tiene acceso interno` : result.error ?? "No se pudo guardar");
    if (response.ok) { form.reset(); await loadMembers(); }
  }

  async function revoke(email: string) {
    const response = await fetch(`/api/team?email=${encodeURIComponent(email)}`, { method: "DELETE" });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? `Acceso revocado para ${email}` : result.error ?? "No se pudo revocar");
    if (response.ok) await loadMembers();
  }

  return <div className="team-manager"><form className="mini-admin-form" onSubmit={submit}><label>Nombre<input name="displayName" placeholder="Nombre del periodista" /></label><label>Correo<input name="email" type="email" required placeholder="periodista@medio.com" /></label><label>Rol<select name="role" defaultValue="journalist"><option value="journalist">Periodista</option><option value="editor">Editor</option><option value="commercial">Comercial</option><option value="administrator">Administrador</option></select></label><button>Autorizar acceso</button>{message && <p>{message}</p>}</form><div className="team-access-list"><header><b>Personas autorizadas</b><span>{members.filter((member) => member.active).length} activas</span></header>{members.filter((member) => member.active).map((member) => <article key={member.id}><div><b>{member.displayName}</b><small>{member.email}</small></div><span>{member.role}</span>{member.email === currentUserEmail ? <em>Tu cuenta</em> : <button type="button" onClick={() => void revoke(member.email)}>Revocar</button>}</article>)}</div></div>;
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
