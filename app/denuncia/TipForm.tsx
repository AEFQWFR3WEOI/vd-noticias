"use client";

import { FormEvent, useState } from "react";
import { PROVINCES } from "../lib/provinces";

export default function TipForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("sending"); setMessage("");
    try {
      const response = await fetch("/api/denuncias", { method: "POST", body: new FormData(form) });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp.");
      setState("done"); form.reset(); setFileNames([]);
    } catch (error) {
      setState("error"); setMessage(error instanceof Error ? error.message : "No se pudo enviar.");
    }
  }

  if (state === "done") {
    return <div className="tip-done" role="status"><b>¡Gracias! Recibimos tu denuncia.</b><p>Nuestro equipo la va a revisar. Si dejaste tu teléfono, te contactaremos si necesitamos más detalles.</p><button type="button" onClick={() => setState("idle")}>Enviar otra</button></div>;
  }

  return (
    <form className="tip-form" onSubmit={submit}>
      <label className="tip-full">¿Qué pasó? *<textarea name="description" required minLength={15} maxLength={4000} rows={5} placeholder="Cuéntanos lo que viste: qué pasó, cuándo y quiénes estaban involucrados." /></label>
      <label>Provincia<select name="province" defaultValue=""><option value="">Selecciona</option>{PROVINCES.map((province) => <option key={province.slug} value={province.slug}>{province.name}</option>)}</select></label>
      <label>Lugar exacto<input name="place" maxLength={160} placeholder="Sector, calle o referencia" /></label>
      <label className="tip-full tip-files">
        <span>Fotos o videos (hasta 4 archivos)</span>
        <input name="files" type="file" accept="image/*,video/*" multiple onChange={(event) => setFileNames([...(event.target.files ?? [])].map((file) => file.name))} />
        <small>{fileNames.length ? fileNames.join(" · ") : "Toca aquí para adjuntar desde tu galería. Para videos largos, usa WhatsApp."}</small>
      </label>
      <label>Tu nombre (opcional)<input name="name" maxLength={100} autoComplete="name" /></label>
      <label>Tu teléfono o WhatsApp (opcional)<input name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder="Para contactarte si hace falta" /></label>
      <label className="tip-check tip-full"><input type="checkbox" name="allowCredit" /> Pueden mencionar mi nombre si publican la información</label>
      <input className="tip-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Enviando…" : "Enviar denuncia"}</button>
      {message && <p className="tip-error" role="alert">{message}</p>}
      <p className="tip-note tip-full">Tu identidad es confidencial: no publicamos tu nombre ni tu teléfono sin tu permiso.</p>
    </form>
  );
}
