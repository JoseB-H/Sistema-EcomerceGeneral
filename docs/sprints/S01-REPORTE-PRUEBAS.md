# S01 — Evidencia de implementación

Fecha de inicio: 2026-11-04. Rama: `feat/s01-infraestructura-docker`; base: `b32ee01`. Entorno cloud Linux, sin acceso al disco D: de Windows. Este informe distingue implementación, pruebas y aceptación: no acredita aceptación del sprint.

## TDD por tarea

- Tarea 1: `npm --prefix Backend test`: ROJO (app ausente), VERDE 5/5, cero omitidas. Express 5.3.0 y Supertest 7.3.1; lockfile fijado.

## Casos T01

T01-01 a T01-11: NO EJECUTADOS todavía; se completarán tras construir la pila.

- Tarea 2: ROJO por config/database ausentes; VERDE `npm --prefix Backend test`, 26/26, sin omitidas. Validación de variables, SELECT 1 y saneamiento de errores; DB real pendiente.

- Tarea 3: ROJO por cliente/App ausentes; posteriormente dos fallos mostraron que diferir la petición a otra microtarea impedía observar el inicio/cancelación al desmontar. Se inició la función async dentro del efecto. VERDE 11/11 y build Vite 8.3.5 aprobado. No se simula salud productiva.

- Tarea 4: 8/8 tests de helper y 3/3 de estructura/runtime/salud. Config válido, build y up con tres servicios saludables. Primer runtime falló por package.json con permisos restrictivos: regresión ROJO→VERDE con COPY --chown=node:node. Segundo fallo: BusyBox enviaba loopback al proxy (403); regresión de salud ROJO→VERDE y wget -Y off en sonda local. Sin desactivar TLS ni cambiar red. Node contenedor 24.22.2, Nginx 1.30.6; digests en Dockerfiles/arquitectura.

Los tests node --test requieren la ruta de ejecución escalada del entorno: el sandbox normal reportó solo un archivo wrapper; se verificaron los nombres/conteos reales con ejecución escalada. No se usa ese wrapper como evidencia.
