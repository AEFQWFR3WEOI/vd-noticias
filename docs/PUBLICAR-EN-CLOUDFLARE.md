# Publicar VD Noticias en Cloudflare (con dominio propio)

No hace falta contratar hosting. Cloudflare aloja el sitio (Workers), la base de
datos (D1 `site-creator-d1`) y las fotos y videos (R2 `site-creator-r2`). Todo
eso ya existe en la cuenta y el Worker `vd-noticias` está conectado a este
repositorio de GitHub.

## Cómo se publica

Cada vez que se une un cambio a la rama `main` en GitHub, Cloudflare construye
y publica el sitio solo (Workers Builds). No hay que correr comandos.

Al arrancar, el sitio crea por su cuenta las tablas o los datos iniciales que
falten (secciones, espacios publicitarios, canal en vivo, tabla de intentos de
acceso). Nunca borra ni reemplaza lo que ya existe.

## Variables en el panel de Cloudflare

En **Workers & Pages → vd-noticias → Settings → Variables and Secrets**:

| Nombre | Tipo | Valor |
|---|---|---|
| `EDITORIAL_OWNER_EMAIL` | Text | correo del administrador principal |
| `EDITORIAL_OWNER_PASSWORD` | Secret | solo para el primer acceso (12+ caracteres) |
| `NEXT_PUBLIC_SITE_URL` | Text | `https://tu-dominio` cuando lo conectes |

`wrangler.jsonc` tiene `keep_vars: true`, así que publicar no borra estas
variables.

Primer acceso del administrador: entra a `/login` con ese correo y esa clave.
Después, borra el secreto `EDITORIAL_OWNER_PASSWORD` (la clave ya queda guardada
cifrada en la base de datos). Los periodistas se crean en **Sala de redacción →
Equipo**.

## Conectar el dominio

1. Compra el dominio:
   - **.com**: en Cloudflare, *Domain Registration → Register Domains*
     (unos 10 US$ al año). Queda conectado automáticamente.
   - **.com.do**: en <https://nic.do>. Luego, en Cloudflare, *Add a domain*, y en
     NIC.do cambia los *nameservers* por los dos que te da Cloudflare (puede
     tardar unas horas).
2. En **Workers & Pages → vd-noticias → Domains → Add custom domain**, escribe
   el dominio (por ejemplo `vdnoticias.com`). Repite con `www.vdnoticias.com`.
3. Cambia `NEXT_PUBLIC_SITE_URL` a `https://tu-dominio` (ver tabla) y vuelve a
   publicar desde **Deployments**. Así el mapa del sitio, el RSS y Google News
   usan el dominio correcto.

## Seguridad incluida

- Contraseñas guardadas con `scrypt`; sesiones revocables en cookie `httpOnly`.
- Bloqueo de fuerza bruta: 5 intentos fallidos por correo, o 20 por IP, bloquean
  el acceso durante 15 minutos.
- Registro de auditoría de inicios de sesión y acciones editoriales.

## Copia de seguridad (opcional, desde la computadora)

```powershell
npx wrangler login
npx wrangler d1 export site-creator-d1 --remote --output respaldo.sql
```
