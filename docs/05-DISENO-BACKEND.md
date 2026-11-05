# Diseño del Backend — Node.js + Express

**Estado:** API técnica S01 implementada y probada; sin endpoints de negocio definidos.

## Objetivo
Centralizar las reglas de negocio, validar operaciones, gestionar acceso a datos y publicar una API documentada para el frontend.

## Arquitectura interna propuesta: monolito modular
No crear microservicios adicionales: existe un solo contenedor Backend. Se recomienda separar responsabilidades dentro de la aplicación.

```mermaid
flowchart TB
    A[HTTP Router] --> C[Controller]
    C --> S[Service - casos de uso]
    S --> R[Repository - acceso a datos]
    R --> D[(PostgreSQL)]
```

## Organización de código candidata
- `Backend/src/app.`* : ensamblado del servidor y configuración.
- `Backend/src/routes/`: rutas HTTP.
- `Backend/src/controllers/`: traducción solicitud/respuesta.
- `Backend/src/services/`: lógica de casos de uso.
- `Backend/src/repositories/`: consultas a PostgreSQL.
- `Backend/src/middlewares/`: errores, validación y eventual autenticación.
- `Backend/tests/`: pruebas unitarias e integración.

Si el tamaño inicial es pequeño, Codex puede simplificar esta estructura sin mezclar responsabilidades. No crear módulos de negocio que aún no fueron aprobados.

## Reglas técnicas a decidir/implementar
1. Versionar la API cuando el contrato se consolide (propuesta: `/api/v1`).
2. Validar todas las entradas del lado servidor.
3. Usar consultas parametrizadas, nunca SQL concatenado con datos externos.
4. Definir esquema uniforme para errores y registrar mensajes de diagnóstico sin secretos.
5. Separar variables de entorno y validar configuración al arrancar.
6. Realizar operaciones relacionadas bajo transacciones cuando sean necesarias.
7. Implementar límites y autorización cuando se aprueben identidad y roles.
8. Proponer endpoint técnico de salud como parte del primer incremento; **no afirmar que existe**.

## Definición de terminado para un endpoint
- Existe requisito aprobado y contrato documentado.
- Entradas, salidas, códigos de estado y errores especificados.
- Validación y autorización aplicadas cuando proceda.
- Pruebas de éxito y error reproducibles.
- Se actualiza [Contratos API](07-CONTRATOS-API-Y-FLUJOS.md) y [Estado](ESTADO-DEL-PROYECTO.md).

## Pendientes
Modelo de autenticación, sesiones, roles, reglas del comercio, endpoints concretos, estructura de errores definitiva, estrategia de logging y límites de uso. No implementar esos elementos por conjetura.

## S01 — Backend técnico implementado en la rama de desarrollo

Autorización de implementación recibida el 2026-11-04. `Backend/src/app.js` exporta `createApp({checkDatabase, logger})`, sin abrir puertos ni crear conexiones globales. `GET /api/health` espera una comprobación por petición y responde 200 `{status: "ok", database: "ok"}` o 503 `{status: "degraded", database: "unavailable"}`. Ambas respuestas usan `Cache-Control: no-store`. Rutas desconocidas: 404 JSON; error inesperado: 500 JSON saneado. Los logs solo contienen eventos técnicos. No hay endpoints de negocio.

Tarea 1: `npm --prefix Backend test` ejecutó 5 pruebas aprobadas, después del fallo inicial por app ausente. Conexión PostgreSQL real y contenedores todavía pendientes. Esta sección sustituye únicamente el estado previo del endpoint técnico; el diseño comercial sigue pendiente.

### Tarea 2 — runtime y conexión

`src/config.js` valida PORT/PGPORT (1–65535), PGHOST y PGUSER/PGPASSWORD/PGDATABASE antes de escuchar; no altera la contraseña. `src/server.js` escucha en 0.0.0.0:3000, compone Express y pool, y cierra HTTP/pool ante SIGTERM/SIGINT con límite de 10 s. `src/database.js` ejecuta `SELECT 1 AS ok` por solicitud, comprueba el resultado y utiliza max=5, timeouts de conexión/consulta/statement=1500 ms e idle=10000 ms. Un error idle produce un evento saneado y no derriba el proceso. `npm --prefix Backend test`: 26/26 aprobadas; la reconexión contra PostgreSQL real se comprobará en Docker.

### Docker S01

Runtime no root (`node`), manifiestos y src de su propiedad; instalación `npm ci --omit=dev`. Solo escucha 3000 dentro de redes Compose, sin mapeo al host. La prueba real verifica que ese usuario lee package.json.

### Integración real S01

DB detenida: respuesta 503 exacta vía Nginx. Al iniciar DB, retorna 200 sin cambiar ID de Backend. SIGTERM cierra antes de 10 s con exit 0; la recuperación y recreación de Backend conservan el frontend activo. Las seis comprobaciones HTTP/operativas están automatizadas en `scripts/integration.test.mjs`.

## Catálogo sintético del prototipo local

HU-001/HU-002 autorizadas para demostración local. `createApp` acepta `catalogRepository` opcional: sin él conserva S01. `GET /api/works?q=&format=` lista/busca (q string, máx. 100 caracteres; formato manga/manhwa); `GET /api/works/:id` devuelve detalle o 404. Entrada inválida → 400; proveedor fallido → 503 saneado. Todas las respuestas usan no-store. `source={kind:synthetic,persisted:false}` identifica la procedencia. Los seis registros y sus sinopsis son ficticios, solo lectura y aislados en `src/catalog`; no hay SQL comercial ni persistencia. Suite Backend: 40/40 aprobada; salud DB permanece independiente.
