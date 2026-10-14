# VD Noticias | Visión Dominicana TV

Proyecto independiente del periódico digital VD Noticias. Incluye portada,
secciones, artículos, buscador, programación, canal en vivo 24/7, pódcasts,
sala de redacción, biblioteca multimedia, equipo, publicidad, boletín, base de
datos D1 y almacenamiento R2.

## Abrirlo en Windows

Requiere Node.js 22.13 o superior, Git y acceso al repositorio privado.

```powershell
git clone https://github.com/AEFQWFR3WEOI/vd-noticias.git
cd vd-noticias
npm install
npm run local
```

El periódico abre en <http://localhost:3000> y la sala de redacción en
<http://localhost:3000/redaccion>. También se puede iniciar con doble clic en
`INICIAR-VD-NOTICIAS.bat`. En local, D1 y R2 se simulan de forma persistente en
la carpeta ignorada `.wrangler/`.

## Canal en vivo 24/7

La sala de redacción incorpora un centro de control para la señal principal,
respaldo, continuidad, cambio automático y modo de mantenimiento. La guía de
instalación y operación está en
[`docs/TRANSMISION-24-7.md`](docs/TRANSMISION-24-7.md).

Las claves RTMPS/SRT y los tokens de proveedores nunca se guardan en GitHub. El
periódico almacena solamente enlaces públicos de reproducción.

## Trabajo diario

Antes de comenzar usa `git pull` y después `npm run local`. Cuando se publique
una mejora, cierra el servidor con `Ctrl+C`, ejecuta `git pull` y reinicia.

## Acceso independiente a la sala de redacción

En producción, la ruta `/redaccion` usa correo y contraseña propios. Las
contraseñas se guardan en D1 como hashes `scrypt`; las sesiones son tokens
opacos revocables guardados en D1 y enviados en una cookie `httpOnly`,
`SameSite=Lax` y `Secure`.

Para crear el primer administrador en una instalación nueva:

1. configura `EDITORIAL_OWNER_EMAIL` con su correo;
2. configura `EDITORIAL_OWNER_PASSWORD` como secreto con al menos 12 caracteres;
3. aplica las migraciones y despliega;
4. visita `/login` e inicia sesión con esos dos valores;
5. después del primer acceso correcto, elimina `EDITORIAL_OWNER_PASSWORD` del
   entorno y vuelve a desplegar. El hash ya permanece en D1.

Los demás periodistas se crean desde **Sala de redacción → Equipo**, asignando
correo, contraseña inicial y rol.

## Arquitectura

- Frontend: Next.js 16 + React 19 mediante Vinext.
- Backend: rutas de servidor en la misma aplicación.
- Datos: Cloudflare D1 con Drizzle ORM.
- Multimedia: Cloudflare R2.
- Desarrollo local: Vite + Miniflare.

## Comandos

- `npm run local`: inicia en Windows y abre el navegador.
- `npm run local:network`: permite verla desde otros equipos de la red.
- `npm run lint`: verifica la calidad del código.
- `npm run build`: construye y valida producción.
- `npm run db:generate`: genera migraciones de base de datos.

Los datos creados en producción viven en D1/R2 y no se versionan en GitHub. Para
trasladarlos se debe realizar una exportación separada.
