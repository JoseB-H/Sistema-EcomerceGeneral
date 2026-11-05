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
| T01-10 | APROBADO en Linux cloud | Clon limpio de GitHub 4b716c3: instalación, build y todas las suites con proyecto/puerto/identidad nuevos. Windows no probado. |
| T01-11 | APROBADO técnicamente | Alcance inspeccionado por autor y revisor independiente; hallazgos corregidos y probados. Aceptación humana pendiente. |

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

## Reproducción desde GitHub

Se publicó la rama y se clonó `feat/s01-infraestructura-docker` en `/tmp/yitverse-s01-clean-review`, revisión `4b716c3eb75c1154f6a07ef7bf62c3bfbdee67bf`. Se creó una nueva contraseña sintética local, proyecto `yitverse-s01-clean`, puerto 8081 y registro de propiedad propio; no se copiaron .env, identidades, node_modules ni dist. Se reutilizó caché válida de Docker/npm, no los archivos de dependencias del checkout original.

En ese clon se ejecutaron `npm ci` de ambos proyectos, Backend 26/26, Frontend 11/11 y build, helper 8/8, prepare/config/up con tres servicios saludables, integración 10/10 y persistencia 1/1 (dos ciclos). `git status --short` quedó vacío. El volumen y redes de ese laboratorio son distintos de los del checkout principal. Esto acredita reproducibilidad en Linux cloud, sin afirmar verificación Windows ni una máquina sin caché de imágenes.

## Archivos del incremento

- Creado: `.env.example`.
- Modificado: `.gitignore`.
- Creado: `Backend/.dockerignore`.
- Creado: `Backend/Dockerfile`.
- Creado: `Backend/package-lock.json`.
- Creado: `Backend/package.json`.
- Creado: `Backend/src/app.js`.
- Creado: `Backend/src/config.js`.
- Creado: `Backend/src/database.js`.
- Creado: `Backend/src/server.js`.
- Creado: `Backend/test/config.test.js`.
- Creado: `Backend/test/database.test.js`.
- Creado: `Backend/test/health.test.js`.
- Creado: `Database/.dockerignore`.
- Creado: `Database/Dockerfile`.
- Creado: `Frontend/.dockerignore`.
- Creado: `Frontend/Dockerfile`.
- Creado: `Frontend/index.html`.
- Creado: `Frontend/nginx.conf`.
- Creado: `Frontend/package-lock.json`.
- Creado: `Frontend/package.json`.
- Creado: `Frontend/src/App.css`.
- Creado: `Frontend/src/App.jsx`.
- Creado: `Frontend/src/health-client.js`.
- Creado: `Frontend/src/main.jsx`.
- Creado: `Frontend/test/App.test.jsx`.
- Creado: `Frontend/test/health-client.test.js`.
- Creado: `Frontend/test/setup.js`.
- Creado: `Frontend/vite.config.js`.
- Creado: `Frontend/vitest.config.js`.
- Modificado: `README.md`.
- Creado: `docker-compose.yml`.
- Modificado: `docs/00-INDICE-DOCUMENTAL.md`.
- Modificado: `docs/03-ARQUITECTURA-Y-CONTENEDORES.md`.
- Modificado: `docs/04-DISENO-FRONTEND.md`.
- Modificado: `docs/05-DISENO-BACKEND.md`.
- Modificado: `docs/06-DISENO-DATABASE.md`.
- Modificado: `docs/28-MATRIZ-TRAZABILIDAD.md`.
- Modificado: `docs/ALINEACION-ENTRE-CHATS.md`.
- Modificado: `docs/ESTADO-DEL-PROYECTO.md`.
- Modificado: `docs/sprints/S01-PLANIFICACION-TECNICA.md`.
- Creado: `docs/sprints/S01-REPORTE-PRUEBAS.md`.
- Creado: `scripts/compose-helper.mjs`.
- Creado: `scripts/compose-helper.test.mjs`.
- Creado: `scripts/integration.test.mjs`.
- Creado: `scripts/persistence.test.mjs`.

## Revisión independiente y correcciones finales

Un revisor independiente examinó toda la rama inicial b32ee01..4b716c3, sin mutar Docker. No encontró problemas críticos. Señaló interrupciones que podían dejar locks/esquemas sin información de recuperación y que `config` sin argumentos silenciosos podía imprimir configuración. El segundo hallazgo se trató como importante por su efecto sobre credenciales, aunque el revisor lo había clasificado menor.

Se escribieron primero regresiones: SIGINT/SIGTERM omitían cleanup, no existían journal/recuperación verificable y faltaba la validación CLI silenciosa. Se corrigió en una sola ronda: cancelación controlada con AbortSignal y restauración protegida, journal persistente previo a alterar servicios/SQL, lock con PID/host/propietario y comando explícito recover-lock que rechaza procesos vivos/identidad distinta. SIGKILL conserva el lock para recuperación posterior; nunca se promete ejecutar finally ante una señal no capturable. También se corrigió una fuga de lock detectada por esas pruebas: la identidad ahora se valida antes de crear el archivo de exclusión.

VERDE final: Backend 26/26, Frontend 11/11 y build, helper 15/15, integración 10/10 y persistencia 1/1 (dos ciclos), cero omitidas. SIGTERM real contra un proceso propio con Database detenida ejecutó finally: Database restaurada, HTTP 200, journal vacío y bloqueo liberado. SIGINT/SIGTERM/SIGKILL y recuperación de proceso muerto se verificaron además en fixtures de procesos aislados sin mutar Docker. No hubo segunda revisión independiente del parche; sus regresiones y la suite completa las verificó el autor.

No se borraron volúmenes ni datos ajenos. La restauración del clon de prueba se hace con su propio S01_COMPOSE_PROJECT: un intento con el proyecto predeterminado fue rechazado por identidad distinta antes de modificar nada, y se repitió con el nombre correcto.

### Revalidación del parche final desde el clon limpio

Tras fast-forward desde GitHub a `97a5ee0`, el clon independiente volvió a pasar helper 15/15, integración 10/10 y persistencia 1/1 (dos ciclos), con su propio proyecto/volumen. No cambió ninguna dependencia ni código de aplicación frente a la instalación limpia anterior. El checkout quedó limpio. La CLI real `node scripts/compose-helper.mjs -- config` se verificó con exit 1 y stdout vacío: exige -q/--quiet.

## Decisiones y límites de la ejecución

- Se mantuvo el checkout cloud ya aislado, sin worktree adicional, según el plan aprobado; no aporta aislamiento adicional dentro de esta tarea.
- Los scripts auxiliares de las skills cloud no pudieron leerse como recursos ejecutables. Se extrajeron briefs y mantuvo ledger local con los mismos comandos, resultados y commits; el registro fue manual, con riesgo de error de transcripción mitigado por salidas verificadas.
- BusyBox usa wget -Y off únicamente para loopback; conserva proxy/CA externos. Depende de la opción soportada en la imagen Nginx fijada, comprobada en ejecución.
- La reasignación real de IP no fue reproducida: Docker reutilizó IPs. DNS dinámico sigue configurado; queda ese escenario experimental pendiente.
- El revisor dejó el clon limpio al ejecutor; se comprobó íntegramente y se revalidó el parche final, sin una brecha pendiente de reproducción Linux.
- Windows, backup/restore y despliegue público quedan fuera de la evidencia de S01; pueden tener particularidades que requieren validación posterior.
- No se ejecutó una auditoría de vulnerabilidades de dependencias. Se verificaron lockfiles/TLS; no se afirma ausencia de vulnerabilidades upstream.
- El revisor no ejecutó mutaciones operativas para no interferir. El autor reprodujo interrupciones y verificó las correcciones mediante TDD y suite completa; no hubo segunda revisión independiente del parche.

No quedaron hallazgos menores diferidos: la exposición de config se reclasificó importante y se corrigió. El incremento está disponible para revisión; el sprint no se declara aceptado ni cerrado.
