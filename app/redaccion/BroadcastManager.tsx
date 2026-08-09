"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from "react";

type Settings = {
  isLive: boolean;
  streamUrl: string;
  title: string;
  description: string;
  posterUrl: string;
};

type Program = {
  id: number;
  title: string;
  kind: "program" | "podcast";
  description: string;
  presenter: string;
  coverImageUrl: string;
  scheduleDay: string;
  scheduleTime: string;
};

const fallbackSettings: Settings = {
  isLive: false,
  streamUrl: "",
  title: "Visión Dominicana TV en vivo",
  description: "Noticias, entrevistas y cobertura especial desde República Dominicana.",
  posterUrl: "",
};

export default function BroadcastManager() {
  const [settings, setSettings] = useState<Settings>(fallbackSettings);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/broadcast");
    const result = await response.json() as { settings?: Settings | null; programs?: Program[]; error?: string };
    if (!response.ok) return setMessage(result.error ?? "No se pudo cargar la señal");
    setSettings(result.settings ?? fallbackSettings);
    setPrograms(result.programs ?? []);
  }

  useEffect(() => { void load(); }, []);

  async function saveLive(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/broadcast", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "update-live", ...values }) });
    const result = await response.json() as { settings?: Settings; error?: string };
    setMessage(response.ok ? "La señal en vivo fue actualizada" : result.error ?? "No se pudo guardar");
    if (result.settings) setSettings(result.settings);
    setBusy(false);
  }

  async function createProgram(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/broadcast", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "create-program", ...values }) });
    const result = await response.json() as { program?: Program; error?: string };
    setMessage(response.ok ? `${result.program?.title} fue agregado a la programación` : result.error ?? "No se pudo guardar");
    if (response.ok) { form.reset(); await load(); }
    setBusy(false);
  }

  async function removeProgram(id: number) {
    const response = await fetch(`/api/broadcast?id=${id}`, { method: "DELETE" });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? "Programa eliminado" : result.error ?? "No se pudo eliminar");
    if (response.ok) await load();
  }

  return (
    <div className="broadcast-manager">
      <form className="broadcast-live-form" onSubmit={saveLive} key={`${settings.streamUrl}-${settings.title}-${settings.isLive}`}>
        <div className="broadcast-admin-title"><span>SEÑAL PRINCIPAL</span><h3>Control de transmisión</h3><p>Activa la señal y pega un enlace de YouTube Live, Vimeo o video directo.</p></div>
        <label className="broadcast-live-toggle"><input type="checkbox" name="isLive" defaultChecked={settings.isLive} key={`live-${settings.isLive}`} /><span><b>Transmitiendo ahora</b><small>Mostrará la etiqueta EN VIVO en todo el periódico.</small></span></label>
        <label>Título de la transmisión<input name="title" required defaultValue={settings.title} /></label>
        <label>Descripción<textarea name="description" required rows={3} defaultValue={settings.description} /></label>
        <label>Enlace de transmisión<input name="streamUrl" type="url" defaultValue={settings.streamUrl} placeholder="https://youtube.com/watch?v=..." /></label>
        <label>Imagen de espera<input name="posterUrl" defaultValue={settings.posterUrl} placeholder="Enlace de la Biblioteca multimedia" /></label>
        <button disabled={busy}>Guardar señal</button>
      </form>

      <form className="broadcast-program-form" onSubmit={createProgram}>
        <div className="broadcast-admin-title"><span>NUEVO ESPACIO</span><h3>Agregar programa o pódcast</h3><p>El horario aparecerá automáticamente en la portada y en Programación.</p></div>
        <label>Nombre<input name="title" required placeholder="Nombre del espacio" /></label>
        <label>Formato<select name="kind"><option value="program">Programa</option><option value="podcast">Pódcast</option></select></label>
        <label className="wide">Descripción<textarea name="description" required rows={3} placeholder="¿De qué trata y por qué verlo?" /></label>
        <label>Presenta<input name="presenter" placeholder="Nombre del conductor o equipo" /></label>
        <label>Día o frecuencia<input name="scheduleDay" placeholder="Lunes a viernes" /></label>
        <label>Hora<input name="scheduleTime" type="time" /></label>
        <label>Orden<input name="position" type="number" min="0" defaultValue="0" /></label>
        <label className="wide">Portada del programa<input name="coverImageUrl" placeholder="Enlace copiado desde Multimedia" /></label>
        <label className="wide">Enlace del programa<input name="destinationUrl" type="url" placeholder="https://youtube.com/playlist?..." /></label>
        <button disabled={busy}>Agregar a programación</button>
      </form>

      {message && <p className="broadcast-admin-message" aria-live="polite">{message}</p>}
      <div className="broadcast-program-list">
        <header><b>Programación creada</b><span>{programs.length} espacios</span></header>
        {programs.length ? programs.map((program) => <article key={program.id}><div><span>{program.kind === "podcast" ? "PÓDCAST" : "PROGRAMA"}</span><b>{program.title}</b><small>{program.presenter || "Equipo VD"} · {program.scheduleDay}{program.scheduleTime ? `, ${program.scheduleTime}` : ""}</small></div><p>{program.description}</p><button type="button" onClick={() => void removeProgram(program.id)}>Eliminar</button></article>) : <p className="broadcast-empty">Todavía no has creado programas. La portada mostrará una presentación inicial hasta que agregues el primero.</p>}
      </div>
    </div>
  );
}
