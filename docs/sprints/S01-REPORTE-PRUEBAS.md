# S01 — Evidencia de implementación

Fecha de inicio: 2026-11-04. Rama: `feat/s01-infraestructura-docker`; base: `b32ee01`. Entorno cloud Linux, sin acceso al disco D: de Windows. Este informe distingue implementación, pruebas y aceptación: no acredita aceptación del sprint.

## TDD por tarea

- Tarea 1: `npm --prefix Backend test`: ROJO (app ausente), VERDE 5/5, cero omitidas. Express 5.3.0 y Supertest 7.3.1; lockfile fijado.

## Casos T01

| Caso | Resultado observado | Evidencia |
|---|---|---|
| T01-01 | APROBADO | Config Compose validado por helper, sin volcar credenciales. |
| T01-02 | APROBADO | Build/up/ps: exactamente tres servicios saludables. |
| T01-03 | APROBADO | HTML/assets reales y Chromium desktop/móvil; solo diagnóstico. |
| T01-04 | APROBADO | Nginx → Backend: HTTP 200 y JSON exacto. |
| T01-05 | APROBADO | SELECT 1 AS ok real con PostgreSQL 17.11; comprobación cambia al caer DB. |
| T01-06 | APROBADO | DB detenida → 503; Backend detenido → 502/504; UI real muestra error y reintento recupera. |
| T01-07 | APROBADO | Modelo/redes inspeccionados: solo Frontend publica 127.0.0.1:8080; DB sin mapeo host. |
| T01-08 | APROBADO | Dos recreaciones de Database: ID distinto, mismo volumen, UUID retenido y esquema propio limpiado. |
| T01-09 | APROBADO | .env/.local/outputs ignorados; contraseña sintética ausente de archivos rastreados; diff sin secretos. |
| T01-10 | NO EJECUTADA todavía | Reproducción desde clon limpio pendiente antes de finalizar la entrega. |
| T01-11 | APROBADO (autor) | Diff dentro del alcance técnico, sin módulos comerciales; revisión independiente de rama pendiente. |

- Tarea 2: ROJO por config/database ausentes; VERDE `npm --prefix Backend test`, 26/26, sin omitidas. Validación de variables, SELECT 1 y saneamiento de errores; DB real pendiente.

- Tarea 3: ROJO por cliente/App ausentes; posteriormente dos fallos mostraron que diferir la petición a otra microtarea impedía observar el inicio/cancelación al desmontar. Se inició la función async dentro del efecto. VERDE 11/11 y build Vite 8.3.5 aprobado. No se simula salud productiva.

- Tarea 4: 8/8 tests de helper y 3/3 de estructura/runtime/salud. Config válido, build y up con tres servicios saludables. Primer runtime falló por package.json con permisos restrictivos: regresión ROJO→VERDE con COPY --chown=node:node. Segundo fallo: BusyBox enviaba loopback al proxy (403); regresión de salud ROJO→VERDE y wget -Y off en sonda local. Sin desactivar TLS ni cambiar red. Node contenedor 24.22.2, Nginx 1.30.6; digests en Dockerfiles/arquitectura.

Los tests node --test requieren la ruta de ejecución escalada del entorno: el sandbox normal reportó solo un archivo wrapper; se verificaron los nombres/conteos reales con ejecución escalada. No se usa ese wrapper como evidencia.

- Tarea 5: sonda HTTP inicialmente ausente (ROJO); `node --test scripts/integration.test.mjs`: 10/10 VERDE, cero omitidas. Casos: assets React, salud dependiente de SQL, 404 API, DB caída→503→200 sin recrear Backend, Backend detenido→502/504, cierre exit 0 <10 s, recreación Backend con Frontend conservado. IP Backend antes/después 172.18.0.2: Docker la reutilizó; no se afirma cambio de IP.

Chromium headless real: sano → DB detenida y reintento muestra error → DB recuperada y reintento vuelve a sano. Vista móvil 390×844 sin desbordamiento; desktop 1280×800. Capturas locales en /tmp/yitverse-health-desktop.png, /tmp/yitverse-health-error.png y /tmp/yitverse-health-mobile.png, sin credenciales. No se publicaron previews.

## Validación completa antes de la entrega

Instalación desde lockfiles con `npm --prefix Backend ci` y `npm --prefix Frontend ci`; Backend 26/26, Frontend 11/11, build Vite aprobado, helper 8/8, integración 10/10 y persistencia 1/1 (dos ciclos). Cero fallos u omitidos en la última ejecución completa. Las suites operativas se ejecutaron en comandos separados y secuenciales, conservando identidad, volumen y exclusión. El test de persistencia pasó sobre infraestructura existente; no se inventó una ejecución roja ni se borraron volúmenes para provocarla.

Comandos operativos: `node scripts/compose-helper.mjs prepare`, `node scripts/compose-helper.mjs -- config -q`, `node scripts/compose-helper.mjs -- up --build -d --wait --wait-timeout 120`, `node --test scripts/integration.test.mjs`, `node --test scripts/persistence.test.mjs`. Runtime: Linux x86_64, Docker 29.9.2, Compose 2.40.3, host Node 24.22.1, contenedor Node 24.22.2, PostgreSQL 17.11 y Nginx 1.30.6. Dependencias npm exactas en manifiestos/lockfiles.

## Límites y aceptación

- Windows y almacenamiento D: no probados desde cloud. El README describe la ruta D:\Proyectos\YitVerse\YitVerse-Desarrollo y la configuración soportada de almacenamiento Docker Desktop/WSL; el motor puede seguir utilizando C:.
- No se verificaron backup/restore, despliegue público/HTTPS, escalado ni funcionalidades comerciales.
- Docker reutilizó las IP de DB/Backend durante recreaciones. Se verificó recuperación con contenedores nuevos; no se afirma haber forzado reasignación de IP.
- Credenciales de laboratorio generadas solo en .env ignorado; no se usa autenticación trust en la red DB.
- No se modificó main, no se cerró el Issue #1 y la aceptación/review/retrospectiva del sprint siguen pendientes.
