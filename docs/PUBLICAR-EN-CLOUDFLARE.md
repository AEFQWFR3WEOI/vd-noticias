# Publicar VD Noticias en Cloudflare (con dominio propio)

No hace falta contratar hosting. Cloudflare aloja el sitio (Workers), la base de
datos (D1) y las fotos y videos (R2). El plan gratis de Workers sirve para
empezar; si el tráfico crece, el plan Workers Paid cuesta 5 US$ al mes.

Todo se hace una sola vez desde la carpeta del proyecto en la computadora
(Windows: PowerShell, dentro de `vd-noticias`).

## 1. Preparar

```powershell
git pull
npm install
npx wrangler login
```

`wrangler login` abre el navegador para que autorices tu cuenta de Cloudflare.

## 2. Crear la base de datos y el almacenamiento

```powershell
npx wrangler d1 create vd-noticias-db
npx wrangler r2 bucket create vd-noticias-media
```

El primer comando muestra un `database_id` (algo como
`a1b2c3d4-...`). Abre `wrangler.jsonc` y reemplaza
`00000000-0000-0000-0000-000000000000` por ese valor.

En el mismo archivo cambia `EDITORIAL_OWNER_EMAIL` por el correo del
administrador principal.

## 3. Crear las tablas

```powershell
npm run db:migrate:remote
```

Esto crea las tablas: artículos, secciones, usuarios, sesiones, intentos de
acceso, historial, multimedia, canal en vivo, programación, publicidad,
anunciantes, boletín, contacto y auditoría. También carga las 15 secciones y
los 5 espacios publicitarios.

## 4. Clave del administrador (secreta)

```powershell
npx wrangler secret put EDITORIAL_OWNER_PASSWORD
```

Escribe una contraseña de al menos 12 caracteres. Nunca se guarda en GitHub.

## 5. Publicar

```powershell
npm run deploy
```

Al terminar, el sitio queda en `https://vd-noticias.<tu-cuenta>.workers.dev`.

1. Entra a `/login` con el correo y la contraseña del paso 4.
2. Después del primer acceso, borra el secreto (la clave ya queda guardada
   cifrada en la base de datos):

   ```powershell
   npx wrangler secret delete EDITORIAL_OWNER_PASSWORD
   ```

3. Crea a los periodistas y editores en **Sala de redacción → Equipo**.

## 6. Conectar el dominio

1. Compra el dominio:
   - **.com**: en Cloudflare, *Domain Registration → Register Domains*
     (unos 10 US$ al año); queda conectado automáticamente.
   - **.com.do**: en <https://nic.do>. Luego, en Cloudflare, *Add a domain*, y en
     NIC.do cambia los *nameservers* por los dos que te da Cloudflare (puede
     tardar unas horas).
2. En Cloudflare: *Workers & Pages → vd-noticias → Settings → Domains & Routes →
   Add → Custom domain* y escribe el dominio (por ejemplo `vdnoticias.com`).
   Repite con `www.vdnoticias.com` si lo quieres también.
3. En `wrangler.jsonc` cambia `NEXT_PUBLIC_SITE_URL` por
   `https://tu-dominio` y vuelve a publicar con `npm run deploy`. Así el mapa
   del sitio, el RSS y Google News usan el dominio correcto.

## Seguridad incluida

- Contraseñas guardadas con `scrypt`; sesiones revocables en cookie `httpOnly`.
- Bloqueo de fuerza bruta: 5 intentos fallidos por correo, o 20 por IP, bloquean
  el acceso durante 15 minutos.
- Registro de auditoría de inicios de sesión y acciones editoriales.

## Trabajo diario después de publicar

- Cambios en el código: `git pull` y `npm run deploy`.
- Si alguna mejora trae una migración nueva en `drizzle/`: primero
  `npm run db:migrate:remote` y después `npm run deploy`.
- Copia de seguridad de la base:
  `npx wrangler d1 export vd-noticias-db --remote --output respaldo.sql`
