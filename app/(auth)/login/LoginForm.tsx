"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, returnTo }),
      });
      const result = (await response.json()) as {
        error?: string;
        returnTo?: string;
      };
      if (!response.ok) {
        setMessage(result.error ?? "No se pudo iniciar sesión");
        return;
      }
      router.replace(result.returnTo ?? "/redaccion");
      router.refresh();
    } catch {
      setMessage("No se pudo conectar con el servidor");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label>
        Correo electrónico
        <input
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          autoFocus
          placeholder="periodista@vdnoticias.do"
        />
      </label>
      <label>
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={12}
          maxLength={128}
          required
          placeholder="Tu contraseña"
        />
      </label>
      {message && (
        <p className={styles.error} role="alert">
          {message}
        </p>
      )}
      <button disabled={submitting}>
        {submitting ? "Verificando…" : "Entrar a la redacción"}
      </button>
    </form>
  );
}
