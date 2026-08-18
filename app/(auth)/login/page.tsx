import { redirect } from "next/navigation";
import Link from "next/link";
import {
  getSessionUser,
  safeRelativeReturnPath,
} from "../../session-auth";
import LoginForm from "./LoginForm";
import styles from "./login.module.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Acceso a la sala de redacción",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo: requestedReturnTo } = await searchParams;
  const returnTo = safeRelativeReturnPath(requestedReturnTo);
  if (await getSessionUser()) redirect(returnTo);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link className={styles.brand} href="/" aria-label="Volver a VD Noticias">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vd-noticias-logo.png" alt="VD Noticias" />
        </Link>
        <div className={styles.heading}>
          <span>SALA DE REDACCIÓN</span>
          <h1>Acceso editorial</h1>
          <p>
            Inicia sesión con las credenciales asignadas por el administrador.
          </p>
        </div>
        <LoginForm returnTo={returnTo} />
        <Link className={styles.back} href="/">
          ← Volver al periódico
        </Link>
      </section>
    </main>
  );
}
