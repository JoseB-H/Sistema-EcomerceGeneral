# YitVerse azul nocturno — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar catálogo/ficha/estados con identidad azul oscura sin cambiar datos, API o comportamiento.

**Architecture:** Conservar el contenedor React y su navegación nativa. Cambiar solo presentación y enlaces de acceso, con arte SVG propio y CSS acotado al modo catálogo; conservar por completo Backend y build S01.

**Tech Stack:** React/Vite existentes, CSS, SVG propio, Vitest/Testing Library y Chromium disponibles. Sin instalaciones ni paquetes nuevos.

**Spec:** `docs/superpowers/specs/2026-11-04-ui-azul-nocturno-design.md`.

## Global Constraints

Base `feat/local-dev-catalogo` `4794803`; trabajar solo en `feat/ui-azul-nocturno`. No main/PR #3/Docker. No tocar API, cliente/hooks, datos, configuración o dependencias. Solo seis obras ficticias; sin estadísticas, módulos nuevos ni contenidos externos. Olympus bloqueado403: inspirarse en la descripción del usuario y documentar el límite. El usuario autoriza preparar e implementar, sin otro gate intermedio; apariencia final sujeta a revisión.

## Estructura exacta

- Crear `Frontend/src/catalog/artwork.jsx`: `NightArtwork()` y `CoverArtwork({id})`, arte decorativo original con gradientes únicos por instancia.
- Modificar `CatalogApp.jsx`: header/búsqueda por enlace, logo propio, footer y wrapper local de salud.
- Modificar `CatalogPage.jsx`: composición hero y CTA, conservar filtros/estado/handlers.
- Modificar `WorkDetailPage.jsx`: presentación y regreso, sin modificar datos ni carga.
- Modificar `components.jsx`: portada SVG, marca/iconos decorativos/estados; firmas de formularios y acciones intactas.
- Reemplazar `catalog.css`: tokens, composición, tarjetas3:4, responsive, salud local y reduced-motion.
- Ampliar `Frontend/test/CatalogApp.test.jsx`: accesos header/hero/footer conservan el único buscador y las rutas.
- Actualizar documentación Frontend, UX, estado, backlog/trazabilidad/RNF y guía local; crear `docs/UI-AZUL-NOCTURNO.md` con pruebas/limitaciones y enlaces de revisión.

## Tarea 1 — UI editorial azul completa

**Interfaces:** consumir `work{id,title,format,genres,synopsis}`, `SearchForm({query,format,onChange,onSearch})`, estados/hook actuales. Producir los mismos enlaces y nombres accesibles de catálogo/ficha, más accesos reales a búsqueda y footer. Arte solo decorativo.

- [ ] Verificar base limpia: `npm --prefix Backend test` y `npm --prefix Frontend test`; esperado45/45 y31/31.
- [ ] TDD: añadir tests de header hacia `#catalog-query` en catálogo (un único searchbox), header hacia `/#catalog-query` en ficha, hero hacia el único campo y footer con `/` y `/estado`. Conservar todas las pruebas originales.
- [ ] Ejecutar Frontend; esperado RED por enlaces todavía ausentes.
- [ ] Implementar componentes/arte/CSS conforme al diseño. No cambiar lógica de búsqueda/API; mantener mensajes y etiquetas. Gradientes con `useId`; portadas3:4; colores y movimiento reducido del diseño.
- [ ] Ejecutar Frontend; esperado todos verdes. Arrancar exclusivamente servidores nativos propios (Backend sin watch para evitar incidencia previa del observador) y Vite; verificar visualmente catálogo/ficha/estados y todos los viewport indicados, corrigiendo presentación si procede. Esperado sin desbordamiento, foco estable y contraste comprobado.
- [ ] Actualizar Frontend/UX con decisión y evidencia. Commit `feat(ui): introduce YitVerse electric blue editorial design`.

## Tarea 2 — Verificación y publicación

**Interfaces:** consumir UI completa; producir reporte reproducible, revisión y rama remota independiente de S01.

- [ ] Ejecutar Backend y Frontend completos; esperado45 Backend y todos Frontend verdes, sin omitidos. Builds técnico y local secuenciales; esperado salida0.
- [ ] Chromium real: buscar ÓRBITA/formato, ficha directa, atrás/vuelta filtrada, vacío/limpiar, fallo de red/reintento,404, salud503; header/hero/teclado, móvil/tablet/escritorio,3000/5173 nativos. No usar suites Docker.
- [ ] Revisar rama completa con un revisor fresco de solo lectura, sin Docker ni nuevas funcionalidades; corregir importantes con regresión RED→GREEN y suite completa en una pasada.
- [ ] Registrar comandos, tamaños, contraste/reduced-motion, procedencia propia del arte, Olympus403, límites Windows/PG/WCAG y estado pendiente de aceptación. Comprobar que Backend/Database/Docker/lockfiles/cliente/hooks y ramas base permanecen iguales.
- [ ] Commit `docs(ui): record dark redesign verification and review`; publicar solo la rama actual. Detener solo procesos propios, sin fusionar ni tocar PR #3.

## Review Focus

1. Acceso Buscar desde ficha y catálogo sin segundo buscador ni pérdida de query: tests unitarios y teclado Chromium.
2. CSS local de `/estado` frente a reglas globales S01: revisar y comprobar ambos builds/página real.
3. SVG múltiples e IDs únicos, portada3:4, títulos largos: Chromium/inspección y pantallas estrechas.
4. Focus-visible/contraste/tamaño de controles y reduced-motion: estilos computados y teclado, sin asumir que un screenshot verifica todo.
5. Preservación de API/URL/abortos/reintento y seis registros: suites existentes, HTTP/navegador y diff protegido.
