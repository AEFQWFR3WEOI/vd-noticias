# VD Noticias | Visión Dominicana TV

Proyecto original del periódico digital VD Noticias. Incluye la portada y las
secciones públicas, artículos, buscador, programación, señal en vivo, pódcasts,
sala de redacción, biblioteca multimedia, gestión de equipo, publicidad,
contactos, boletín, base de datos D1 y almacenamiento multimedia R2.

## Abrirlo en una PC con Windows

### Requisitos

- Node.js 22.13 o superior: <https://nodejs.org/>
- Git para Windows: <https://git-scm.com/download/win>
- Acceso al repositorio privado de GitHub.

### Primera instalación

Abre PowerShell y ejecuta:

```powershell
git clone https://github.com/AEFQWFR3WEOI/vd-noticias.git
cd vd-noticias
npm install
npm run local
```

El navegador se abre en <http://localhost:3000>. También puedes hacer doble clic
en `INICIAR-VD-NOTICIAS.bat`; la primera vez instalará las dependencias y luego
abrirá el periódico.

### Sala de redacción local

Entra en <http://localhost:3000/redaccion>. En modo local se crea de forma
automática un administrador aislado para que puedas publicar noticias, subir
imágenes, videos, audios y PDF, organizar programas y pódcasts, administrar el
equipo y gestionar campañas publicitarias. Este acceso automático solo funciona
durante el desarrollo local; no modifica la seguridad del sitio publicado.

La base de datos local y los archivos multimedia locales se guardan dentro de
la carpeta ignorada `.wrangler/`. Reiniciar el servidor no borra los datos.

## Trabajo diario

Antes de comenzar una sesión de cambios:

```powershell
git pull
npm run local
```

Después de que se publique una mejora en GitHub, cierra el servidor con
`Ctrl+C`, ejecuta `git pull` y vuelve a ejecutar `npm run local`.

## Arquitectura

- Frontend y rutas: Next.js 16 + React 19 mediante Vinext.
- Backend: rutas de servidor incluidas en la misma aplicación.
- Datos estructurados: Cloudflare D1 con Drizzle ORM.
- Imágenes, videos, audios y documentos: Cloudflare R2.
- Desarrollo local: Vite + simulación persistente de D1 y R2 con Miniflare.
- Producción recomendada: Cloudflare Workers/Sites o un servicio compatible con
  este runtime. No es un tema WordPress ni una aplicación PHP.

## Comandos

- `npm run local`: inicia en Windows y abre el navegador.
- `npm run local:network`: permite verla desde otros dispositivos de la red.
- `npm run dev`: inicia el servidor de desarrollo estándar.
- `npm run build`: construye y valida el artefacto de producción (requiere Bash).
- `npm test`: ejecuta la validación completa del proyecto.
- `npm run db:generate`: genera migraciones de base de datos cuando cambia el esquema.

## Datos de producción

El código y la edición inicial viajan en GitHub. Los registros y archivos que ya
se hayan creado en el sitio publicado viven en sus recursos D1/R2 y no se guardan
en el repositorio. Para trasladar esos datos a otro proveedor se realiza una
exportación separada antes de cambiar el dominio o el alojamiento.
