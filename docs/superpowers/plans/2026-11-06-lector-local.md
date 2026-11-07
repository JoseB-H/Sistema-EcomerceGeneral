# Plan — Capítulos autorizados y lector vertical local

**Implementación autorizada:** solicitud del usuario; alcance en [diseño](../specs/2026-11-06-lector-local-design.md). Ejecutar en esta sesión hasta la entrega, sin publicar ramas ni PR. No iniciar incrementos posteriores.

1. **Continuidad y aislamiento.** Verificar base `af2a6e5`, árbol limpio y bundle lavanda; crear worktree `feat/lector-capitulos-local`. Registrar diseño, límites y autorización. Preservar ramas originales.
2. **Importador mediante TDD.** Añadir pruebas rojas antes de código. Crear `Backend/src/reader/{validation,files,images,archive,store,importer}.js`, CLI `Backend/scripts/import-chapter.mjs`; fijar `sharp` y `yauzl` gratuitos y lockfile. Cubrir formato real, tamaño, nombres, ZIP, derechos, staging, duplicados y recuperación. No tocar originales ni ofrecer endpoint de escritura.
3. **API local mediante TDD.** Crear `repository.js`, `router.js`; inyección opcional en `app.js` y activación solo en `dev-server.js`. Probar capítulos ordenados, páginas, privacidad, 404/503, Host, ausencia de uploads y regresión de catálogo/health.
4. **Lector mediante TDD.** Cliente separado, `ChapterList.jsx`, `ReaderPage.jsx`, CSS modular. Integrar en ficha y enrutado existente sin nuevas dependencias. Probar navegación, filtros, acceso directo, lista vacía, carga, error, reintento y página fallida.
5. **Demostración y verificación.** Generador original fuera de Git; Chromium real en cuatro anchos, capturas listado/lector, consola, teclado, movimiento reducido. Ejecutar suites existentes/nuevas, helpers y ambos builds. No simular pruebas no disponibles.
6. **Entrega.** Actualizar guía local, RF/HU/RNF/trazabilidad pertinentes, índice, bitácora, estado y alineación Obsidian; revisión independiente, corregir hallazgos y verificar. Commits descriptivos locales, bundle nuevo verificado. Sin push, PR, fusión ni cambios en Docker/Database/Figma.

Commits previstos: `docs(reader): delimitar incremento de lectura autorizada local`; `feat(reader): importar capítulos privados con validación y recuperación`; `feat(reader): exponer lectura local y navegación vertical`; `docs(reader): registrar evidencias y operación segura`. Ajustar agrupación a cambios realmente verificados, sin commits rojos.
