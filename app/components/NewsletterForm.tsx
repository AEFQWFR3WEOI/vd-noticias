"use client";

import { FormEvent, useState } from "react";

export default function NewsletterForm() {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const email = new FormData(form).get("email");
    const response = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
    setMessage(response.ok ? "¡Listo! Ya formas parte del Resumen VD." : "Revisa el correo e inténtalo nuevamente."); if (response.ok) form.reset();
  }
  return <div className="newsletter-form-wrap"><form onSubmit={submit}><label className="sr-only" htmlFor="newsletter-email">Correo electrónico</label><input id="newsletter-email" name="email" type="email" placeholder="Tu correo electrónico" required autoComplete="email" /><button type="submit">Suscribirme</button></form><small>Al suscribirte aceptas nuestra <a href="/terminos">política de privacidad</a>.</small>{message && <p aria-live="polite">{message}</p>}</div>;
}
