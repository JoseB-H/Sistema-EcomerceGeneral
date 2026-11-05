# Catálogo local de YitVerse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ejecutar sin Docker un prototipo sintético HU-001/HU-002 con catálogo, búsqueda y detalle, sin afirmar conexión PostgreSQL inexistente.

**Architecture:** React/Vite consume Express mediante proxy del mismo origen. Un repositorio de demostración separado entrega datos sintéticos; una entrada nativa opcional mantiene la salud PostgreSQL real y conserva el runtime S01.

**Tech Stack:** Node 24, Express/pg, React/Vite y las herramientas de pruebas existentes; no se requieren nuevas dependencias.

**Spec:** [Diseño local](../specs/2026-11-04-local-dev-catalogo-design.md), RF-01/02/03, HU-001/002 y solicitud explícita del usuario.

## Global Constraints

- No ejecutar Docker ni modificar sus archivos, main o PR #3. Base `e672e2e`, rama `feat/local-dev-catalogo`.
- PostgreSQL sigue siendo la tecnología DB; salud 503 sin configuración/conexión real. Catálogo sintético solo lectura, sin persistencia.
- Puertos 5173 y 3000 en loopback; si están ocupados, no detener procesos ajenos ni elegir otro puerto silenciosamente.
- Datos/arte de demostración identificados; sin obras protegidas ni información comercial presentada como real.
- Sin autenticación, XP/YitCoins, lector, compras, pagos ni canjes. No hay asignación automática de sprint.

## Review Focus

1. Credenciales parcialmente configuradas: arranque falla con nombre de variable, sin exponer valores (tarea 2).
2. Búsquedas con acentos, filtros repetidos y entrada no escalar: búsqueda previsible y 400 controlado (tarea 1).
3. Respuesta HTML/JSON inválida o proveedor caído: UI muestra error/reintento sin inventar obras (tarea 3).
4. Cambio de búsqueda/desmontaje con una petición lenta: cancelar/ignorar respuestas obsoletas y permitir reintento (tarea 3).
5. URL directa de detalle desconocido y vuelta al catálogo filtrado: 404 claro y navegación/URL conservada (tareas 3/4).

---

### Task 1: Repositorio sintético y API de catálogo

**Files:** crear `Backend/src/catalog/demo-data.js`, `demo-repository.js`, `router.js` y `Backend/test/catalog.test.js`; modificar `Backend/src/app.js` y docs de API/alcance.

**Interfaces:** `createDemoCatalogRepository()` → `{source,list({query,format}),findById(id)}`; `createCatalogRouter(repository)` → Express.Router. `createApp({checkDatabase,logger,catalogRepository?})` conserva el comportamiento S01 sin repositorio.

- [ ] Escribir tests para listado/fuente sintética, búsqueda sin distinción de acentos, filtro, vacío, detalle, 404, validación de query/ID y error saneado del proveedor.
- [ ] Ejecutar `npm --prefix Backend test`; observar ROJO por repositorio/API ausentes.
- [ ] Implementar seis obras ficticias en un módulo y adapter solo lectura; router valida q (máximo 100), format e ID antes de consultar. SQL y guardado no forman parte de este adapter.
- [ ] Ejecutar suite completa Backend; actualizar docs y commit `feat(catalog): add isolated synthetic catalog API`.

### Task 2: Arranque nativo Windows sin DB obligatoria

**Files:** crear `Backend/src/local-config.js`, `dev-server.js`, `Backend/.env.example`, `Backend/test/local-config.test.js`, `Backend/test/local-runtime.test.js`; modificar script dev Backend y proxy/config Vite.

**Interfaces:** `readLocalConfig(env)` → `{port,database:null|DatabaseConfig}`. Sin PGUSER/PGPASSWORD/PGDATABASE devuelve database=null; configuración parcial falla; con todos usa `readConfig` y PGHOST predeterminado 127.0.0.1. Runtime usa repositorio sintético y check SQL real o 503 controlado.

- [ ] Escribir y ejecutar tests ROJOS para configuración ausente/parcial/completa, puerto inválido y proceso real que sirve catálogo pero health=503 sin credenciales.
- [ ] Implementar `npm run dev` con `node --watch --env-file-if-exists=.env src/dev-server.js`; leer solo Backend/.env opcional y escuchar 127.0.0.1. Cierre ordenado y logs sin credenciales. No modificar server.js de S01.
- [ ] Configurar Vite host localhost, port 5173 y strictPort; mantener proxy a 127.0.0.1:3000. Suite verde y commit `feat(dev): run native development without PostgreSQL credentials`.

### Task 3: Catálogo, ficha y componentes React

**Files:** crear `Frontend/src/catalog/{CatalogApp.jsx,CatalogPage.jsx,WorkDetailPage.jsx,components.jsx,catalog-client.js,use-resource.js,catalog.css}` y `Frontend/test/{catalog-client.test.js,CatalogApp.test.jsx}`. Modificar `src/main.jsx`, configuración Vite y script build:local; preservar App de diagnóstico.

**Interfaces:** `catalogApi.list({query,format,signal})` y `catalogApi.detail(id,{signal})` validan JSON. `useResource(load)` → `{status,data,retry}` con timeout/cancelación. Páginas consumen API inyectable; enlaces nativos conservan query/filtro. `CatalogApp` despacha `/`, `/obras/:id`, `/estado` y no-encontrado.

- [ ] Escribir tests ROJOS de fetch relativo/señal/JSON inválido/404 y de componentes: carga, fuente sintética, listado, buscar/filtrar, vacío, error/reintento, detalle/404, timeout y respuesta tardía ignorada.
- [ ] Implementar UI responsiva con tarjetas, campos etiquetados, mensajes accesibles y marcadores gráficos CSS propios. No añadir navegación a módulos fuera de alcance.
- [ ] Seleccionar catálogo durante `vite serve` o `--mode local`; build por defecto conserva S01. Ejecutar suite Frontend y ambos builds.
- [ ] Actualizar docs UX y commit `feat(frontend): explore synthetic works and view details`.

### Task 4: Verificación nativa, documentación y publicación

**Files:** crear `docs/LOCAL-DEV-CATALOGO.md` y `docs/LOCAL-DEV-CATALOGO-PRUEBAS.md`; modificar README, alineación, estado, backlog, RF/RNF/UX y trazabilidad aplicables.

- [ ] Ejecutar suites nativas completas; no invocar integración/persistencia Docker. Iniciar Express y Vite propios, comprobar catálogo/detalle/proxy y salud 503 con HTTP real.
- [ ] Verificar Chromium escritorio/móvil: buscar, ficha, volver, URL directa, obra desconocida, error/reintento y ausencia de desbordamiento. Detener únicamente procesos nativos iniciados por esta tarea cuando proceda.
- [ ] Revisar toda la rama con un revisor independiente; corregir hallazgos importantes mediante regresiones y una sola ronda de fixes, registrar decisiones/límites.
- [ ] Documentar comandos PowerShell exactos, datos sintéticos/funciones dependientes de DB, evidencia y límites Windows. Confirmar Dockerfiles/Compose y rama S01 intactos; no modificar el PR #3.
- [ ] Commit `docs(local): document native catalog workflow and verification`; publicar `feat/local-dev-catalogo` para revisión, sin fusionar.
