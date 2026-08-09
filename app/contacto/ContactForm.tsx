"use client";

import { FormEvent, useState } from "react";

export default function ContactForm({ initialTopic = "editorial" }: { initialTopic?: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json() as { id?: number; error?: string };
    setMessage(response.ok ? `Mensaje recibido. Referencia VD-${result.id}.` : result.error || "No se pudo enviar.");
    if (response.ok) form.reset();
    setBusy(false);
  }
  return <form className="public-contact-form" onSubmit={submit}><label>Nombre<input name="name" required minLength={2} autoComplete="name" /></label><label>Correo<input name="email" type="email" required autoComplete="email" /></label><label>Motivo<select name="topic" defaultValue={initialTopic}><option value="editorial">Información editorial</option><option value="correccion">Corrección</option><option value="derecho-replica">Derecho a réplica</option><option value="denuncia">Denuncia ciudadana</option><option value="alianza">Alianza institucional</option></select></label><label className="contact-form-full">Mensaje<textarea name="message" required minLength={20} maxLength={5000} rows={7} placeholder="Incluye enlaces, fechas y documentos que ayuden a verificar tu solicitud." /></label><label className="contact-honeypot" aria-hidden="true">Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label><div className="contact-form-full"><button disabled={busy}>{busy ? "Enviando…" : "Enviar a VD Noticias"}</button><small>Usaremos tus datos únicamente para responder y verificar esta solicitud. No envíes contraseñas ni información bancaria.</small>{message && <p aria-live="polite">{message}</p>}</div></form>;
}

