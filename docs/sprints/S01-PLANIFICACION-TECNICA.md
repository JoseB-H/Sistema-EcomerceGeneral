# Sprint 1 — Planificación técnica (YitVerse)

**Identificador:** S01  
**Proyecto:** Sistema-EcomerceGeneral · Servicios Cloud  
**Fecha de preparación:** 2026-11-03  
**Estado:** planificación solicitada y autorizada por el usuario. La ejecución, fechas, capacidad y compromiso del Sprint Backlog aún no se han confirmado.  
**Sprint Goal propuesto:** demostrar el arranque reproducible de **tres contenedores independientes** (Frontend React/Vite, Backend Node/Express y Database PostgreSQL) y su comunicación segura mediante Docker Compose, sin funcionalidad comercial.

## 1. Alcance del sprint

El Sprint 1 es una **prueba vertical de arquitectura técnica**, no un MVP de comercio electrónico. Entregará un frontend mínimo que consume un endpoint de salud del backend y un backend capaz de comprobar conexión a PostgreSQL. La base persistirá mediante un volumen Docker.

### Historias técnicas candidatas

| Historia | Resultado esperado | Estado |
|---|---|---|
| HU-T01 | Construcción y arranque de tres servicios en Docker Compose | Selección propuesta para S01 |
| HU-T02 | Verificación navegador/frontend → API/backend → PostgreSQL | Selección propuesta para S01 |
| HU-T03 | Prueba de persistencia al recrear contenedor de base sin eliminar volumen | Selección propuesta para S01 |

**Vinculación RNF:** RNF-01, RNF-02, RNF-03, RNF-04, RNF-05, RNF-06, RNF-07, RNF-11, RNF-12, RNF-27, RNF-28, RNF-29 y RNF-30 (según aplique). Requisitos de negocio: **ninguno para implementar en S01**.

## 2. Actividades en orden

1. Revisar `AGENTS.md`, RF/RNF, arquitectura y la tarea Codex `docs/codex/TAREA-T01-CONTENEDORES.md`.
2. Comprobar herramientas y puertos en el entorno donde se ejecutarán los contenedores.
3. Proponer plan corto de archivos y configuración antes de programar.
4. Construir los contenedores Frontend, Backend y Database, más Compose y configuración de entorno de ejemplo.
5. Configurar acceso HTTP seguro para el laboratorio y redes internas sin publicar el puerto de PostgreSQL.
6. Integrar la página de estado con una petición real a la API.
7. Integrar el endpoint técnico de salud con verificación real a PostgreSQL.
8. Automatizar o documentar pruebas de arranque, conectividad, errores y persistencia.
9. Registrar evidencia observada, decisiones técnicas y comandos en README y documentos del sprint.
10. Entregar cambios a revisión en PR antes de fusionarlos en `main`.

## 3. Criterios de aceptación acordados para la tarea de planificación

| ID | Criterio verificable | Evidencia requerida |
|---|---|---|
| CA-01 | Los tres servicios tienen sus propios directorios y Dockerfiles; Compose los construye/arranca. | `docker compose config`, `docker compose up --build -d` y `docker compose ps`. |
| CA-02 | Existe una página de prueba del frontend que muestra una respuesta de API **real**, no estática. | Captura o prueba automatizada con respuesta del backend. |
| CA-03 | El endpoint `GET /api/health` indica salud del proceso **y** conectividad real a PostgreSQL, sin credenciales en la respuesta. | HTTP 200 con DB sana; HTTP 503 u otro error explícito cuando no lo esté. |
| CA-04 | PostgreSQL solo acepta conexiones en la red privada Compose; no tiene mapeo de puerto al host. | Revisión de `docker compose config` y puertos publicados. |
| CA-05 | Se conserva un dato sintético tras recrear el contenedor de BD sin borrar el volumen. | Secuencia de inserción, recreación y consulta reproducida. |
| CA-06 | Las credenciales se toman de variables de entorno; `.env` real no se versiona. | `.env.example`, `.gitignore`, inspección Git. |
| CA-07 | La app muestra errores de API de manera clara y no declara disponibilidad falsa. | Prueba negativa desconectando el backend o simulando caída. |
| CA-08 | Documentación y scripts de prueba permiten repetir los resultados, diferenciando aprobado/fallido/no ejecutado. | README, registro de comandos/salidas y PR. |
| CA-09 | No se agregan pantallas, tablas o endpoints de negocio fuera del alcance técnico. | Inspección de diff y estructura. |

**No declarar aprobado ningún criterio sin evidencia de ejecución.** Si Codex no dispone de Docker, debe entregar los artefactos y marcar las pruebas operacionales «No ejecutadas», no fingir resultados.

## 4. Definition of Done de S01 (a revisar en Planning)

- Código versionado y estructura con separación clara de responsabilidades.
- Pruebas de CA-01 a CA-09 ejecutadas, registradas y sin errores críticos abiertos, o declaradas no ejecutadas con razón.
- La integración real se demuestra en el ambiente acordado; lo meramente sintáctico no cuenta como demostración integral.
- Sin secretos ni credenciales personales en el repositorio público.
- `README.md`, documentación de arquitectura y `docs/ESTADO-DEL-PROYECTO.md` reflejan lo ejecutado.
- PR revisado y resultado de Sprint Review registrado sin inventar reuniones.

## 5. Fuera del sprint

Registro/login, catálogo manga/manhwa, portada o capítulos, favoritos, historial, XP, niveles, YitCoins, billetera, carrito, pedidos, canjes, pagos, stock e integración cloud de producción. No crear esquemas de datos de negocio. Se permite una prueba SQL **temporal y sintética** para comprobar persistencia.

## 6. Riesgos de Sprint

| Riesgo | Control |
|---|---|
| Puerto del equipo ocupado | Elegir puertos configurables por `.env.example`; documentar la elección. |
| El backend inicia antes que la BD | Healthcheck y reintento/espera de disponibilidad. |
| La UI parece conectada pero usa datos ficticios | Probar HTTP real desde navegador o script. |
| Publicación de PostgreSQL | Solo red Compose privada para DB, sin `ports`. |
| Datos perdidos en `down -v` | Advertir que ese comando destruye el volumen y omitirlo de pruebas de persistencia. |
| Contenedores funcionan pero no en otra máquina | Documentar versiones base, configuración y comandos reproducibles. |
| Repositorio público | Datos sintéticos, sin claves reales ni materiales con derechos restringidos. |

## 7. Organización Scrum

- **Product Owner:** aprobación del foco técnico expresada por el usuario; confirmar persona responsable de aceptación final.
- **Developers:** usuario + Codex como herramienta de asistencia, sin asignación automática.
- **Scrum Master:** por confirmar.
- **Duración del sprint:** sugerencia de 2 semanas, **no aprobada**.
- **Inicio y fin:** pendientes.
- **Estimación, capacidad, PR y evidencias:** pendientes.
- **Sprint Review/Retrospective:** pendientes, registrar después de realizados.

## 8. Estado

- [x] Objetivo técnico y solicitud de planificación aceptados por el usuario.
- [x] Alcance de la primera tarea descrito.
- [ ] Fechas, capacidad y Sprint Backlog comprometidos.
- [ ] Implementación iniciada en Codex.
- [ ] Pruebas operativas ejecutadas.
- [ ] Review y retrospectiva realizados.

**Siguiente:** [Tarea T01 para Codex](../codex/TAREA-T01-CONTENEDORES.md) y [Plan inicial](../29-PLAN-INICIO-DESARROLLO.md).
