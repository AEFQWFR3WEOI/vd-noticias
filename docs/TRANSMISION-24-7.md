# Operación del canal VD Noticias 24/7

## Arquitectura recomendada

```text
Estudio / OBS principal ─┐
                        ├─> Cloudflare Stream (Live Input estable) ─> reproductor VD Noticias
Codificador de respaldo ┘                         │
                                                  ├─> YouTube / Facebook (simulcast opcional)
Servidor de continuidad ─> noticias grabadas ────┘
```

El sitio web no codifica ni distribuye el video por sí solo. Su función es mostrar
la señal, consultar su estado y cambiar entre las fuentes configuradas. Cloudflare
Stream recibe RTMPS o SRT, genera varias calidades y distribuye la señal a los
visitantes. OBS, un codificador físico o un servidor de playout produce el canal.

## Qué se configura en la sala de redacción

En **Emisión y programación → Centro de control de transmisión**:

1. **Reproductor principal:** URL pública del Live Input principal.
2. **Reproductor de respaldo:** URL pública de un segundo Live Input o señal alternativa.
3. **Continuidad:** video directo o segundo canal que repite la programación cuando no hay directo.
4. **Fuente activa:** automático, principal, respaldo, continuidad o mantenimiento.
5. **Programa en directo:** controla la etiqueta editorial `EN VIVO`.

En modo automático el periódico consulta cada 30 segundos el endpoint público de
estado de Cloudflare. Si la entrada principal está inactiva, usa la entrada de
respaldo y, si tampoco está disponible, reproduce la continuidad.

## Puesta en marcha en Cloudflare Stream

1. Crear dos Live Inputs: `VD PRINCIPAL` y `VD RESPALDO`.
2. Copiar únicamente la URL **Embed** que contiene el Live Input ID en la sala de redacción.
3. Configurar la URL RTMPS/SRT y el Stream Key principal solamente en OBS.
4. Configurar el segundo Stream Key solamente en el codificador de respaldo.
5. Activar la reconexión automática en OBS.
6. Enviar el servidor de continuidad al Live Input principal durante las horas sin producción.
7. Si se requiere, agregar salidas de simulcast para YouTube, Facebook u otras redes.

## Continuidad real durante las 24 horas

Para que el canal nunca se quede sin contenido se necesita un equipo o servidor de
playout permanentemente encendido. Puede usar OBS/VLC para comenzar o una solución
de automatización televisiva al crecer. Debe cargar la parrilla diaria, cortinillas,
publicidad y un bucle de emergencia. El sitio incluye una continuidad web adicional,
pero esa capa no reemplaza el playout de origen.

## Plan mínimo de resiliencia

- Dos conexiones a Internet de proveedores distintos.
- Dos codificadores o dos máquinas: principal y respaldo.
- UPS para router, switch, audio, cámara y codificadores.
- Reconexión automática y supervisión permanente de imagen y audio.
- Video de emergencia almacenado en la Biblioteca multimedia.
- Prueba semanal del cambio principal → respaldo → continuidad.
- No mantener grabaciones 24/7 si no son necesarias; grabar solamente programas que se archivarán.

## Seguridad

Las claves RTMPS/SRT y los tokens de Cloudflare son secretos. Nunca deben guardarse
en el navegador, la base de datos del periódico, archivos `.env` versionados ni
GitHub. El panel de VD Noticias almacena solo las URL públicas de reproducción.

## Lista de verificación antes de publicar

- [ ] Live Input principal creado y probado.
- [ ] Live Input de respaldo creado y probado.
- [ ] Continuidad cargada y con audio normalizado.
- [ ] Cambio automático probado desconectando el principal.
- [ ] OBS configurado para reconectarse.
- [ ] Monitoreo en teléfono y computadora durante al menos dos horas.
- [ ] Restricción por dominio activada cuando el dominio definitivo esté conectado.
- [ ] Claves entregadas solo al personal técnico autorizado.
