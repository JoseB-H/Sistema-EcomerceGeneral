# Frontend V2 — Incremento4: Arte, detalle y móvil

**Fecha:** 2026-11-06 UTC. **Rama:** `feat/frontend-v2-editorial`. **Base aceptada técnicamente:** `ddf908e`. Implementado para revisión local; sin push, PR, merge o Incremento5. Figma continúa pendiente.

**Commit de entrega:** `feat(frontend): refine V2 original covers detail and mobile layouts`. El hash se entrega tras crear el commit y queda en el manifiesto externo del bundle. Puede localizarse sin referencia circular con `git log -1 --format="%H %s" --grep="refine V2 original covers"`.

## Cambios y decisiones

- Ficha editorial: portada y metadatos en dos columnas sobre superficie del tema; en móvil el título/formato preceden a la portada. Formato usa `dl`, géneros son lista con encabezado y la sinopsis respeta párrafos. No se agregan atributos ausentes ni acciones de lectura/seguimiento/compra.
- Los seis SVG originales conservan motivos y paletas. Se añaden constelación, pliegues/trayectorias, sendero/nervaduras, apoyos de puente, reloj/haces de estación y detalles de velas/aves, respectivamente. El sombreado empieza más abajo para mostrar la escena. Esta autorización sustituye la antigua intención de rehacer portadas narrativas por un refinamiento acotado; una dirección artística completamente nueva queda pendiente de aprobación.
- Estrellas idénticas agrupadas en dos paths por instancia, sin diez nodos de círculo repetidos. Los seis SVG pasan de241 a208 nodos descendientes (−13,7%), incluso con detalles nuevos. El fuente artwork.jsx pasa de9035 a10473bytes por el detalle y la protección de fallback; no se afirma una reducción del peso del archivo. El chunk completo de catálogo crece de27,38 a29,85kB (gzip8,20→8,92kB), incluyendo ficha/avisos/arte. No hay bitmaps, descargas de imágenes, fuentes externas, filtros costosos o librerías nuevas.
- Títulos y textos indivisibles se ajustan sin desbordar. La repetición **decorativa** del título en portada se limita a tres líneas; el título accesible exterior, sinopsis y etiquetas permanecen completos. Proporción3:4 conservada.
- Sinopsis vacía/espacios → «Sinopsis no disponible en esta demostración»; géneros vacíos → «Géneros no especificados». Se omiten géneros vacíos y se deduplican etiquetas/categorías tras recortar espacios. Un título compuesto solo de espacios recibe «Título no disponible», sin alterar los datos API. No se inventan otros registros.
- Las respuestas estructuralmente incompletas siguen siendo error del **cliente real**: item null, título vacío, formato/sinopsis ausentes o géneros inválidos no producen una ficha de respaldo. No cambia el contrato ni su validación.
- Carga/error de ficha conservan h1, status/alert, regreso filtrado y reintento.404 de obra explica la ausencia y mantiene los filtros de regreso.
- Hero móvil reduce padding/márgenes de la escala existente; navegación principal visible y formulario conservados. Footer garantiza ancho mínimo44px para Inicio. No nuevo menú oculto ni nuevas rutas.

Se aplican los tokens/componentes existentes, sin duplicar un sistema visual ni crear componentes adicionales. `titleLabel` comparte el aviso neutral entre Hero, tarjetas, portada y ficha. Los SVG siguen decorativos (`aria-hidden`, `focusable=false`); título/formato/ficción están disponibles fuera de la ilustración, evitando un alt redundante.

## Pruebas reales

| Verificación | Resultado |
| --- | --- |
| Baseline antes de modificar | 45 Backend +45 Frontend, sin fallos/omitidas |
| Backend `npm --prefix Backend test` | 45/45; implementación y pruebas sin cambios |
| Frontend `npm --prefix Frontend test` | 58/58:45 previas conservadas +13 nuevas |
| Build normal | Salida0, pantalla S01 conservada; huellas idénticas a referencia Inc2 |
| Build local/prototype | Salida0, V2 compilada; último dist usado en preview |
| Chromium dev5173 y compilado/preview5174 | Smoke existente y nuevo aprobados |
| Responsive320/390/768/1440 | Inicio/Explorar/ficha sin desbordes; portadas3:4 y controles principales≥44px |
| Navegación e historial | Inicio→Explorar→Ficha→Volver, atrás/adelante, q/format, categorías existentes y URL antigua aprobados |
| Recarga SPA | URLs directas Inicio/Explorar/ficha/estado/404 y consultas antiguas aprobadas en dev y preview |
| Resize/rotación simulada | 390×844→844×390→320×800→768×1024→1440×1000 conserva búsqueda/formato y retorno |
| Fixtures controlados | Título/sinopsis/géneros largos, palabras indivisibles, vacíos válidos, duplicados y respuesta inválida controlados |
| Accesibilidad acotada | Teclado/salto/foco, nombres de controles, semántica de ficha y título antes de portada móvil verificados |
| Movimiento reducido | Transición0s, animación none, transform none, scroll auto |
| Errores JavaScript/recursos externos | Sin pageerror ni solicitudes externas en los recorridos |
| PostgreSQL | Salud503 real sin configuración; no se simula disponibilidad |
| Revisión independiente | Sin Critical/Important;24 comprobaciones alrededor de breakpoints en dev/preview correctas; celda documental antigua de aceptación Inc3 reconciliada |

Los fixtures HTTP se interceptan **solo en contextos de prueba** y pasan por `createCatalogApi`; no se reemplazan las llamadas productivas ni se alteran los seis registros del Backend. El fixture extenso incluye markup literal que React presenta como texto; nunca se inserta HTML. Ocultar el SVG mantiene título y navegación visibles.

Casos nuevos:12 pruebas de ficha/contrato/arte y1 de categorías sin nombres vacíos. Se conservan los45 casos existentes. La suite Backend acredita sus dependencias simuladas y runtime nativo según sus pruebas; no una nueva conexión PostgreSQL real.

## Fallos reproducidos y correcciones

1. **Título muy abajo en móvil:** captura previa a390px: h1 a857px, portada a282,78px. Después: h1 a328,17px y portada a442,44px. Es una medición de esa vista/viewport, no garantía de posición fija para cualquier título.
2. **Palabras indivisibles:** fixture a320px produjo scrollWidth5136px. Se corrigió el ajuste de línea de título/cuerpo/tarjetas/Hero/géneros y se repitieron fixtures a cuatro tamaños. No se aplicó ocultamiento horizontal para encubrirlo.
3. **Enlaces por género extensos:** el primer smoke nuevo detectó texto anónimo flex desbordando Inicio. Se añadió ajuste de línea/límite de ancho al enlace existente; el recorrido completo pasó después.
4. **Campos vacíos y estructura:** cinco casos nuevos fallaron antes de la implementación; avisos neutrales, semántica y h1 de estado pasaron después. Dos regresiones adicionales de título/categorías vacíos también registraron RED→GREEN.
5. **Fallback gráfico con ID heredado:** `constructor` era un ID válido para el cliente, pero accedía a una propiedad heredada del mapa y lanzaba TypeError. La regresión falló antes; `Object.hasOwn` conserva el fallback decorativo seguro. No se añade una obra ni se modifica la API.

Contrastes de muestras conservadas: texto19,02; secundario7,76; botón4,94; campo18,18; borde4,00; foco8,51. Objetivo WCAG AA con comprobaciones limitadas, sin auditoría integral/certificación.

## Comparativas antes/después

| Vista | Antes: ddf908e | Después: Incremento4 |
| --- | --- | --- |
| Ficha escritorio1440px | [Antes](assets/frontend-v2-inc4/antes/ficha-desktop.png) | [Después](assets/frontend-v2-inc4/despues/ficha-desktop.png) |
| Ficha móvil390px | [Antes](assets/frontend-v2-inc4/antes/ficha-mobile.png) | [Después](assets/frontend-v2-inc4/despues/ficha-mobile.png) |
| Inicio móvil390px | [Antes](assets/frontend-v2-inc4/antes/inicio-mobile.png) | [Después](assets/frontend-v2-inc4/despues/inicio-mobile.png) |
| Explorar filtrado móvil390px | [Antes](assets/frontend-v2-inc4/antes/filtros-mobile.png) | [Después](assets/frontend-v2-inc4/despues/filtros-mobile.png) |
| Navegación móvil | [Antes](assets/frontend-v2-inc4/antes/navegacion-mobile.png) | [Después](assets/frontend-v2-inc4/despues/navegacion-mobile.png) |
| Seis ilustraciones | [Antes](assets/frontend-v2-inc4/antes/seis-ilustraciones.png) | [Después](assets/frontend-v2-inc4/despues/seis-ilustraciones.png) |

La navegación superior conserva su organización visual: las capturas pueden ser iguales porque ya cabía y era accesible. Se mejoró el área de Inicio en el footer y se comprobó resize/filtros. El formulario filtrado conserva disposición/controles; su portada refleja el refinamiento del arte. La mejora artística es deliberadamente gradual sobre las escenas existentes.

Capturas adicionales de fixtures: [ficha extensa320px](assets/frontend-v2-inc4/despues/ficha-fixture-extensa-320.png), [parcial válida](assets/frontend-v2-inc4/despues/ficha-fixture-parcial.png), [respuesta inválida](assets/frontend-v2-inc4/despues/ficha-respuesta-invalida.png), [no encontrada](assets/frontend-v2-inc4/despues/ficha-no-encontrada.png). No representan títulos añadidos al catálogo.

Mediciones: [antes](assets/frontend-v2-inc4/antes/mediciones.json), [después dev](assets/frontend-v2-inc4/despues/mediciones.json), [después compilado](assets/frontend-v2-inc4/mediciones-preview.json), regresiones catálogo [dev](assets/frontend-v2-inc4/regresion-catalogo-dev.json)/[preview](assets/frontend-v2-inc4/regresion-catalogo-preview.json).

## Archivos creados y modificados

Nuevos: `Frontend/test/WorkDetailPage.test.jsx`, `Frontend/test/browser/detail-mobile-smoke.py`, este reporte y `docs/assets/frontend-v2-inc4/` con comparativas/mediciones.

Modificados Frontend: `src/catalog/WorkDetailPage.jsx`, `components.jsx`, `artwork.jsx`, `Hero.jsx`, `HomePage.css`, `catalog.css`, `catalog-responsive.css`, `home-sections.js`; `test/home-sections.test.js` añade una prueba. No se modifican el cliente API, rutas, hook de recursos, tokens, dependencias/lockfiles ni los otros tests existentes.

Documentación: bitácora00, especificación31, guía32, estado, alineación, índice, diseño Frontend04, trazabilidad28, guía local, README y plan V2. Backend, Database, Docker y sus pruebas intactos.

## Reproducción

Desde una copia limpia de esta rama, con las dependencias existentes de Node24:

```powershell
npm --prefix Backend test
npm --prefix Frontend test
npm --prefix Frontend run build
npm --prefix Frontend run build:local
# Terminal propia1:
npm --prefix Backend run dev
# Terminal propia2:
npm --prefix Frontend run dev
```

Para verificar el build compilado, mantener Backend activo y ejecutar en otra terminal:

```powershell
Push-Location -LiteralPath Frontend -ErrorAction Stop
npm exec vite -- preview --host localhost --port 5174 --strictPort
# Después de detener ese preview con Ctrl+C:
Pop-Location
```

No abrir el dist como archivo. Ambos builds sobrescriben dist; el último debe ser build:local para V2. En el laboratorio Linux, con Python/Playwright/Chromium existentes:

```bash
python3 Frontend/test/browser/dark-catalog-smoke.py --output .local/inc4-catalog-dev
python3 Frontend/test/browser/detail-mobile-smoke.py --output .local/inc4-detail-dev
python3 Frontend/test/browser/dark-catalog-smoke.py --base-url http://localhost:5174 --output .local/inc4-catalog-preview
python3 Frontend/test/browser/detail-mobile-smoke.py --base-url http://localhost:5174 --output .local/inc4-detail-preview
```

`--phase antes --capture-only` captura la base sin afirmar que pasó las verificaciones nuevas; se usó antes de editar producto, no sobre una reconstrucción posterior. El nuevo script admite `--chromium-path`. Playwright es herramienta opcional del laboratorio, no una dependencia instalada en el proyecto. Windows puede usar `npm.cmd`/`python` si corresponde; no se ejecutaron estos comandos allí. [Guía local](LOCAL-DEV-CATALOGO.md) y [recuperación segura](RECUPERACION-GIT-WINDOWS.md).

## Respaldo, límites y siguiente paso

La rama sigue únicamente local/cloud. Bundle Inc3 preservado y comprobado antes de editar: SHA256 `fda2038ed424a6f76f1b4bdaab1867326d871975ccbb9bc7d4af60b23098ec0a`, commitddf908e recuperado. Tras crear el commit Inc4 se genera otro bundle en una carpeta nueva bajo `/workspace/YitVerse-Resguardos`, con verify/clon real/fsck/comparación de archivos y manifiesto externo que registra commit/SHA256/tamaño/ruta. Resultado exacto en la entrega; no se accede ni modifica D: o respaldos Windows.

No ejecutado: Windows, dispositivos físicos/rotación real, Safari/Firefox, lectores de pantalla, auditoría WCAG integral, PostgreSQL nativo/persistencia, Docker/Nginx de producción o Figma. Preview comprueba el build local y su fallback/proxy; Docker conserva el build S01 y no se presenta como despliegue V2. Persiste el antecedente menor de codificación porcentual inválida de API que puede devolver503 saneado; no se toca Backend para resolverlo en esta tarea.

Incremento5 queda preparado con código, pruebas, guía y evidencias para una revisión global posterior. **Detenerse aquí:** el usuario debe revisar Incremento4 y autorizar de nuevo Incremento5/publicación/PR; no se ejecutan por inferencia.
