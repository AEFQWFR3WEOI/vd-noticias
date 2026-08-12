"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from "react";

type Settings = {
  enabled: boolean;
  alwaysOn: boolean;
  isLive: boolean;
  sourceMode: "automatic" | "primary" | "backup" | "continuity" | "maintenance";
  provider: "cloudflare" | "youtube" | "vimeo" | "direct";
  primaryUrl: string;
  backupUrl: string;
  continuityUrl: string;
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
  enabled: true,
  alwaysOn: true,
  isLive: false,
  sourceMode: "automatic",
  provider: "cloudflare",
  primaryUrl: "",
  backupUrl: "",
  continuityUrl: "",
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
      <form className="broadcast-live-form" onSubmit={saveLive} key={`${settings.primaryUrl}-${settings.backupUrl}-${settings.continuityUrl}-${settings.title}-${settings.sourceMode}-${settings.isLive}`}>
        <div className="broadcast-admin-title"><span>CANAL VD 24/7</span><h3>Centro de control de transmisión</h3><p>Cambia entre la señal principal, el respaldo y la continuidad sin modificar el periódico. Recomendado: Cloudflare Stream con un Live Input estable.</p></div>
        <div className="broadcast-control-state">
          <label className="broadcast-live-toggle"><input type="checkbox" name="enabled" defaultChecked={settings.enabled} /><span><b>Canal visible</b><small>Permite reproducir la señal en el periódico.</small></span></label>
          <label className="broadcast-live-toggle"><input type="checkbox" name="alwaysOn" defaultChecked={settings.alwaysOn} /><span><b>Operación 24/7</b><small>Usará continuidad cuando no haya un programa en directo.</small></span></label>
          <label className="broadcast-live-toggle"><input type="checkbox" name="isLive" defaultChecked={settings.isLive} /><span><b>Programa en directo</b><small>Mostrará la etiqueta EN VIVO en todo el periódico.</small></span></label>
        </div>
        <label>Fuente activa<select name="sourceMode" defaultValue={settings.sourceMode}><option value="automatic">Automático: principal → respaldo → continuidad</option><option value="primary">Forzar señal principal</option><option value="backup">Forzar señal de respaldo</option><option value="continuity">Forzar continuidad</option><option value="maintenance">Modo mantenimiento</option></select></label>
        <label>Proveedor principal<select name="provider" defaultValue={settings.provider}><option value="cloudflare">Cloudflare Stream (recomendado)</option><option value="youtube">YouTube Live</option><option value="vimeo">Vimeo</option><option value="direct">Video directo</option></select></label>
        <label>Título de la transmisión<input name="title" required defaultValue={settings.title} /></label>
        <label>Descripción<textarea name="description" required rows={3} defaultValue={settings.description} /></label>
        <label>1. Reproductor principal<input name="primaryUrl" defaultValue={settings.primaryUrl} placeholder="https://customer-....cloudflarestream.com/INPUT_ID/iframe" /><small>Es el enlace público del reproductor, nunca la clave RTMPS/SRT.</small></label>
        <label>2. Reproductor de respaldo<input name="backupUrl" defaultValue={settings.backupUrl} placeholder="Segundo Live Input o señal alternativa" /><small>Utilízalo si falla el estudio, el codificador o la conexión principal.</small></label>
        <label>3. Video o señal de continuidad<input name="continuityUrl" defaultValue={settings.continuityUrl} placeholder="Enlace de Multimedia o segundo canal 24/7" /><small>Se repite automáticamente para que la pantalla nunca quede vacía.</small></label>
        <label>Imagen de espera<input name="posterUrl" defaultValue={settings.posterUrl} placeholder="Enlace de la Biblioteca multimedia" /></label>
        <aside className="broadcast-security-note"><b>Seguridad</b><p>La clave de emisión se configura solamente en OBS o en el servidor de continuidad. No la pegues aquí ni la subas a GitHub.</p></aside>
        <button disabled={busy}>Guardar y cambiar el canal</button>
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
