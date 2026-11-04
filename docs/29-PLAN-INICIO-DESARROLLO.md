# Plan de arranque de desarrollo — YitVerse

**Fecha:** 2026-11-03  
**Estado:** propuesta para planificación Scrum; no constituye autorización de implementación ni Sprint Backlog comprometido.  
**Fuente de verdad:** `AGENTS.md`, `docs/02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md`, `docs/27-REQUISITOS-NO-FUNCIONALES.md`, `docs/28-MATRIZ-TRAZABILIDAD.md`.

## 1. Situación verificada al elaborar este plan

El repositorio tiene documentación de producto y arquitectura, pero aún **no tiene código** de `Frontend/`, `Backend/`, `Database/` ni `docker-compose.yml`.

Ya existe visión de YitVerse: manga/manhwa, biblioteca personal, XP/niveles, YitCoins y tienda de ediciones físicas/accesorios. Las reglas de lectura licenciada, acumulación de XP, economía, comercio y el MVP están **pendientes de validación**.

## 2. Preparación del equipo (Windows)

- [ ] Tener acceso al repositorio en Codex.
- [ ] Verificar Git: `git --version`.
- [ ] Tener motor Docker y Compose funcionando (en Windows, Docker Desktop con backend WSL2 es una opción; comprobar términos de licencia según uso). Ejecutar `docker version` y `docker compose version`.
- [ ] Tener editor de código (opcional si Codex opera sobre el repositorio).
- [ ] Confirmar que los puertos a utilizar estén libres; **no fijarlos sin verificar**.
- [ ] Mantener secretos solo en archivos `.env` locales (no se versionan) y proveer `.env.example` sintético.
- [ ] Decidir cómo se revisarán PR/commits.
- [ ] Mantener notas de Obsidian privadas hasta confirmar configuración de Git y permisos de publicación. La conexión Obsidian Git **no se ha verificado**.

No es obligatorio instalar Node/PostgreSQL en el host si todas las aplicaciones se ejecutan en contenedores.

## 3. Sprint 1 propuesto — Integración técnica de los tres servicios

**Sprint Goal propuesto:** demostrar que la aplicación puede iniciarse en Docker Compose y que la interfaz alcanza al Backend y este verifica PostgreSQL, con documentación y pruebas reproducibles.

**Duración y fechas:** por confirmar en Sprint Planning.  
**Historias técnicas candidatas:** HU-T01, HU-T02 y, según capacidad, HU-T03 en `docs/24-PRODUCT-BACKLOG-SCRUM.md`.

### Alcance técnico propuesto
1. Crear `Frontend/` usando React + Vite como base mínima sin catálogo comercial.
2. Crear `Backend/` con Node + Express y endpoint técnico `GET /api/health` (contrato de ejemplo a validar).
3. Crear `Database/` preparado para PostgreSQL, con configuración/volume persistente; **sin inventar tablas de comercio**.
4. Crear Dockerfiles, `docker-compose.yml`, `.dockerignore`, `.gitignore` y `.env.example` sin contraseñas reales.
5. Configurar redes para que PostgreSQL no tenga puerto público, y Frontend pueda llegar a la API.
6. Comprobar que Backend conecta a BD por la red Docker; una consulta `SELECT 1` es suficiente para la prueba inicial.
7. Construir una página mínima que indique estado de integración, sin inventar módulos finales.
8. Documentar comandos de desarrollo/arranque, problemas observados y resultados de pruebas.
9. Crear una verificación automatizada o repetible para el flujo de salud; registrar evidencia en PR.

### Criterios de aceptación propuestos
- [ ] `docker compose up --build` crea/inicia los 3 servicios en un entorno verificado.
- [ ] La página inicial muestra una respuesta verificable del Backend.
- [ ] Backend demuestra conectividad con PostgreSQL; no se entrega una conexión directa desde navegador.
- [ ] PostgreSQL mantiene datos sintéticos tras recrear su contenedor conservando volumen.
- [ ] El repositorio no contiene credenciales reales.
- [ ] README explica inicio/parada, configuración y pruebas sin servicios pagos obligatorios.
- [ ] Se registran pruebas observadas, no se afirma éxito sin ejecutarlas.
- [ ] La documentación y las historias correspondientes reflejan el trabajo realizado.

### Fuera de este primer incremento
Lectura de obras, login real, catálogo real, recomendaciones, pagos, control de mercancía, XP, YitCoins, canjes y despliegue cloud. Esos elementos requieren decisiones y estimación. No copiar capítulos o portadas de terceros sin autorización.

## 4. Refinamiento del MVP funcional antes de Sprint 2

### Decisiones de producto imprescindibles
- [ ] **Catálogo:** obras de prueba autorizadas y metadatos públicos permitidos.
- [ ] **Lectura:** lector integrado con contenido licenciado, contenido propio, o enlaces oficiales a un proveedor (esto afecta XP).
- [ ] **Cuenta:** identificador y forma de registro, privacidad, recuperación y autorización.
- [ ] **Biblioteca:** qué significan favoritos, siguiendo, progreso e historial; qué se considera «leído».
- [ ] **Gamificación:** evento válido, cantidad XP, límites, curva de nivel e hitos de YitCoins.
- [ ] **Canjes:** tipo de artículo elegible, reglas de stock, crédito y cancelaciones.
- [ ] **Comercio:** primera versión demostrativa con pedidos simulados o venta real; alcance geográfico y operaciones.
- [ ] **Curso:** requisitos docentes de nube pública, objetivos de evaluación y fecha.
- [ ] **Scrum:** responsable de aprobación, capacidad, fechas y duración del sprint.

### MVP recomendado para discutir (no aprobado)
Primero catálogo de obras ficticias/licenciadas, fichas, cuenta y biblioteca personal. Después lector autorizado y reglas XP, niveles, YitCoins; finalmente canjes y pedidos físicos. Si el objetivo docente es infraestructura cloud, adaptar el orden sin asumir pagos.

## 5. Protocolos para Codex
1. Revisar `AGENTS.md`, `docs/00-INDICE-DOCUMENTAL.md`, `docs/16-MARCO-SCRUM.md` y este plan.
2. Revisar HU-T01/HU-T02/HU-T03 y RNF-01 a RNF-07/RNF-30.
3. Presentar plan de archivos y pruebas antes de modificar código.
4. Confirmar con Product Owner el Sprint Goal, duración y alcance.
5. Implementar solo historias seleccionadas.
6. Presentar cada PR con cambios técnicos, comandos ejecutados, capturas/salidas de prueba y documentación actualizada.
7. Marcar un elemento **Verificado** solo tras prueba documentada; no confundir entregado con funcionando.

## 6. Secuencia documental por sprint

```mermaid
flowchart LR
  A[Solicitud/idea] --> B[Product Backlog]
  B --> C[Refinamiento y aceptación]
  C --> D[Sprint Planning]
  D --> E[Codex implementa]
  E --> F[Pruebas y PR]
  F --> G[Sprint Review]
  G --> H[Documentación GitHub/Obsidian]
```

**Regla:** ninguna nota de Obsidian crea un sprint automáticamente. El backlog recibe la solicitud; la selección de historias se decide en Sprint Planning.

## 7. Estado de preparación
- **Listo para planificar Sprint 1 técnico:** repositorio y documentación arquitectónica.
- **Pendiente para ejecutar en equipo local:** comprobar Docker/Git y configurar conexión Codex.
- **Pendiente para implementación de negocio:** decidir licencias, MVP, identidad, XP, YitCoins, canjes, pedidos y aceptación.

## Vinculación formal de la primera tarea (2026-11-03)
La **planificación** de S01 fue solicitada y aprobada por el usuario. [Planificación S01](sprints/S01-PLANIFICACION-TECNICA.md), [especificación T01](codex/TAREA-T01-CONTENEDORES.md) e [Issue #1](https://github.com/JoseB-H/Sistema-EcomerceGeneral/issues/1) contienen alcance, criterios y pruebas. Todavía no se han definido fechas ni demostrado código funcional.
