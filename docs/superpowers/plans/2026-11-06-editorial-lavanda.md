# Editorial lavanda — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Ejecución continua autorizada por solicitud y confirmación del usuario; seguir TDD y revisión final, sin PR.

**Goal:** Adaptar composición visual del ZIP al frontend actual preservando APIs, seis obras y arte propio.
**Architecture:** Reutilizar JSX, tokens y CSS modular existentes; lógica HTTP/navegación y servidor intactos. Cambiar presentación y orden de módulos sin nueva tecnología.
**Tech Stack:** React19/Vite8, JSX/CSS, Vitest/Testing Library, Chromium/Playwright existente.
**Spec:** ../specs/2026-11-06-editorial-lavanda-design.md

## Global Constraints
Sin deps nuevas, código/imágenes del ZIP, Backend/Database/Docker, main/push/PR. Arte original intacto; rutas/API/q/format/historial/estados conservados. Datos sintéticos, sin rating/capítulos/actualizaciones inventadas. Verificación320/390/768/1440, teclado/contraste/reduced-motion.

## Review Focus
- API vacía/error/lenta: no featured ni géneros de respaldo.
- Metadatos largos/vacíos: wrap y omitir etiquetas vacías, sin falsear obra.
- Foco/búsqueda única: cambios visuales no duplican inputs ni pierden fragmento/retorno.
- Móvil320/zoom: acciones accesibles y scroll de géneros contenido, sin documento ancho.
- Portadas repetidas: IDs SVG únicos, seis originales intactas, no imágenes externas.

### Task1: Continuidad y base
Files: esta spec/plan y ledger ignorado. Interfaces: consume2142e26; produce rama feat/ui-editorial-lavanda en worktree propio.
- [ ] Verificar árbol limpio y bundle integración; crear rama/worktree desde2142e26.
- [ ] Instalar locks sin cambios y ejecutar baseline Backend45/Frontend58; esperado0fallos.
- [ ] Registrar comparación/autorización y commit docs de alcance.

### Task2: Composición editorial y acciones reales
Files: HomePage.jsx, Hero.jsx, CatalogApp.jsx; pruebas HomePage.test.jsx y nueva EditorialPresentation.test.jsx.
Interfaces: consume api.list/items, deriveHomeSections existente, WorkCard/WorkCover/SearchForm/workHref/exploreHref. Produce región Historias destacadas con items en ordenAPI; paneles3/2 como atajos; hero géneros limpios; CTA catálogo.
- [ ] Escribir tests: región destacadas contiene6enlaces ordenados, géneroantesdestacadas, atajos3/2, Hero géneros reales/no vacíos y enlace Descubrir, CTAenlaces existentes, error/vacío sin featured inventado.
- [ ] Ejecutar Vitest y observar fallo por ausencia de región/metadatos/CTA.
- [ ] Implementar reuso de componentes; Hero aria-labelDescubrir evita duplicar Verfichade; atajos aria-labelAbrirficha distingue tarjetas.
- [ ] Ejecutar suite Frontend completa; esperado58anteriores másregresiones,0fallos. Ajustar solo aserciones de presentación intencional del Home.
- [ ] Commit feat(frontend): compose lavender editorial discovery sections.

### Task3: Sistema visual responsive
Files: tokens.css,catalog.css,HomePage.css,catalog-responsive.css,components.jsx(logo usa token), smokes existentes y nuevo editorial-smoke.py si necesario.
Interfaces: consume clases/semántica Task2; produce mismo contenido responsive lavanda sin modificar arte/API.
- [ ] Añadir comprobaciones Chromium de paleta/orden/6cards/CTA/tamaños/scroll/contraste en4anchos; observar baseline azul no cumple nuevo tema.
- [ ] Implementar tema semántico/header/Hero/cards/géneros/paneles/CTA y estilos coherentes paraExplorar/Detalle/estados; media queries existentes únicamente.
- [ ] Ejecutar Frontend y Backend, ambos builds y smokes; expected0errores/overflow, contraste controles4.5, foco/bordes3.
- [ ] Commit feat(frontend): apply cinematic lavender visual system.

### Task4: Verificación y entrega
Files: docs35/reporte/capturas, bitácora00/especificación31/guía32/Estado/Alineación/índice.
Interfaces: consume ramas/componentes Tasks1–3; produce evidencia fresca, commits/bundle y capturas reales.
- [ ] Suites finales Backend/Frontend/guardas/console,2builds y smokesdev/preview; documentar Docker NO EJECUTADO por alcance.
- [ ] Cotejar hashes Backend/Database/Docker/arte/contratos/deps; auditar secretos/enlaces y revisión final independiente.
- [ ] Registrar límites Figma/Windows/otrosnavegadores y decisiones visuales para aprobación; commit docs.
- [ ] Bundle nuevo, verify/clonación/fsck/comparación real; conservarprevios. Sin push/PR; entrega capturas/commit/rama y detenerse.
