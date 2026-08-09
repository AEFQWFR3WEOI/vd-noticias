"use client";

import { FormEvent, useState } from "react";

export default function AdLeadForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending"); setErrorMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/advertiser-leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
    const result = await response.json() as { error?: string };
    setState(response.ok ? "success" : "error");
    if (!response.ok) setErrorMessage(result.error ?? "No pudimos enviar la solicitud.");
    if (response.ok) formElement.reset();
  }
  return <form className="ad-lead-form" onSubmit={submit}><div><label>Empresa o institución<input name="company" required /></label><label>Persona de contacto<input name="contactName" required /></label></div><div><label>Correo electrónico<input name="email" type="email" required /></label><label>Teléfono / WhatsApp<input name="phone" /></label></div><label>Objetivo de la campaña<textarea name="objective" rows={4} placeholder="Cuéntanos qué deseas promocionar y a qué público quieres llegar" /></label><label>Inversión estimada<select name="budget" defaultValue=""><option value="" disabled>Seleccionar rango</option><option>RD$25,000 – RD$50,000</option><option>RD$50,000 – RD$100,000</option><option>Más de RD$100,000</option><option>Necesito una propuesta</option></select></label><button disabled={state === "sending"}>{state === "sending" ? "Enviando…" : "Solicitar propuesta"}</button>{state === "success" && <p className="form-success">Recibimos tu solicitud. El equipo comercial se pondrá en contacto.</p>}{state === "error" && <p className="form-error">{errorMessage}</p>}</form>;
}
