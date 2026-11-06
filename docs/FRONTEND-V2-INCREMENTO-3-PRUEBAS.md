# Frontend V2 — Incremento3: Inicio y Explorar

**Fecha:** 2026-11-06 UTC. **Rama:** `feat/frontend-v2-editorial`, base aceptada `fba88e3`. Implementación local para revisión; sin push, PR, fusión o Incremento4. Figma sigue pendiente.

**Commit de entrega:** `feat(frontend): add V2 home and dedicated explore view`. El hash exacto se obtiene después de crear el commit con `git log -1 --format="%H %s"`; se entrega junto al manifiesto externo del bundle para evitar una referencia circular al propio commit.

## Resultado implementado

- `/`: Hero basado en el primer registro recibido, portada original, acceso real a ficha/Explorar, buscador, Continuar explorando no personalizado, Selección de demostración y géneros de la API. Cada sección explica que los datos son ficticios. No hay novedades, popularidad, historial o progreso inventados.
- `/explorar`: catálogo completo con la misma API, búsqueda por título/sinopsis/género, formato, recuento, tarjetas, vacío/limpiar, carga/error/reintento, cancelación y timeout existentes.
- `/obras/:id`, `/estado` y404 conservados. Regreso de ficha hacia `/explorar` con `q`/`format`. Enlaces nativos conservan atrás/adelante; los filtros aplicados siguen usando `replaceState`, como antes, sin añadir entradas de historial por cada búsqueda.
- `/?q=…` o `/?format=…`, incluso vacíos, siguen mostrando catálogo. Las nuevas búsquedas usan `/explorar`; `/#catalog-query` enfoca el único buscador de Inicio, y desde ficha/estado/404 se enlaza a `/explorar#catalog-query`.
- Composición de Inicio: orden recibido, primer título en Hero, tres siguientes en Continuar y restantes en Selección; categorías únicas en orden de aparición. Secciones sin obras se omiten; no se rellenan datos ausentes. Los accesos por género son búsquedas `q`, no un filtro exacto nuevo. Ante error/vacío no aparece una obra destacada ficticia de respaldo.
- Tokens negro/azul, SearchForm, WorkCard/WorkCover, arte original y estados se reutilizan. Navegación Inicio/Explorar/Estado con `aria-current` preciso, foco visible y destinos reales. Tarjetas `h3` bajo secciones `h2` en Inicio; Explorar conserva tarjetas `h2`.

## Archivos

Nuevos módulos: `Frontend/src/catalog/HomePage.jsx`, `Hero.jsx`, `HomePage.css`, `home-sections.js` y `catalog-navigation.js`. Ajustados: `CatalogApp.jsx`, `CatalogPage.jsx`, `WorkDetailPage.jsx`, `components.jsx`, `catalog.css` y `catalog-responsive.css`.

Pruebas: nuevos `Frontend/test/HomePage.test.jsx`, `home-sections.test.js` y `catalog-navigation.test.js`; ampliados `CatalogApp.test.jsx` y `test/browser/dark-catalog-smoke.py`. Se conservan los35 casos anteriores: se cambian únicamente el destino de las pruebas del catálogo y las expectativas de rutas afectadas por la separación aprobada.

Documentación: bitácora00, especificación31, guía32, estado, alineación, guía local, diseño Frontend04, trazabilidad28, índice, README y plan V2. Capturas/mediciones en `docs/assets/frontend-v2-inc3/`.

Sin cambios en Backend, Database, Docker, contratos API, dependencias/lockfiles, seis registros, `artwork.jsx`, tokens Inc2 o pantalla técnica S01.

## Pruebas ejecutadas

| Verificación | Resultado real |
| --- | --- |
| Backend `npm --prefix Backend test` | 45/45, sin fallos ni omitidas |
| Frontend `npm --prefix Frontend test` | 45/45:35 anteriores +10 nuevas; sin fallos/omitidas |
| `npm --prefix Frontend run build` | Salida0; artefacto S01 idéntico por SHA256 a la referencia anterior a Inc2 |
| `npm --prefix Frontend run build:local` | Salida0, prototipo V2 compilado |
| Chromium + Vite dev5173 | Smoke completo aprobado |
| Chromium + preview5174 del build local | Smoke completo aprobado; proxy y recargas SPA reales |
| Inicio, Explorar y ficha a1440/768/390/320px | Sin desbordes; portadas3:4 y controles≥44px comprobados |
| Teclado | Salto al contenido, Hero→Explorar, buscador/foco/fragments y conservación de foco al filtrar aprobados |
| Inicio→Explorar→Ficha→Volver, atrás/adelante | Aprobados, incluidos q/format y URL compartida |
| Carga/error/vacío/reintento | Aprobados en ambas pantallas; fallos y vacío inyectados solo en el navegador de prueba |
| API nativa | Seis IDs originales, `source.kind=synthetic`, `persisted=false`, catálogo200; salud503 real sin PostgreSQL |
| JavaScript/recursos | Sin `pageerror` ni solicitudes externas en ambos recorridos |
| Movimiento reducido | Transición0s, animación none, transform none y scroll auto |
| Revisión independiente | Sin Critical/Important; observación h2/h3 corregida con regresión RED→GREEN.24 anchuras intermedias por pantalla, sin overflow/errores |

TDD: las tres suites nuevas fallaron inicialmente porque sus módulos aún no existían; tras implementar, pasaron. La suite existente detectó dos cabeceras expuestas como banner en JSDOM: se sustituyó el contenedor introductorio secundario por un `div`, conservando una sola cabecera global. La revisión detectó encabezados de tarjetas al nivel de sus secciones; una aserción h3 falló antes de corregir y pasó después.

Contrastes medidos en Chromium (muestras): texto/fondo19,02; secundario7,76; botón4,94; campo18,18; borde4,00; foco8,51. Objetivo WCAG AA, sin afirmar auditoría integral ni certificación. SVG con IDs únicos; sin imágenes de terceros. [Mediciones dev](assets/frontend-v2-inc3/mediciones.json) · [Mediciones compilado](assets/frontend-v2-inc3/mediciones-preview.json).

Recargas HTTP200 y montaje React comprobados en `/`, `/explorar`, catálogo filtrado, variantes antiguas q/formato/vacíos, ficha filtrada, ruta desconocida y `/estado`. La404 de interfaz usa fallback SPA HTTP200: no se afirma un404 HTTP del servidor estático.

## Capturas verificables

| Vista | Escritorio | Móvil |
| --- | --- | --- |
| Inicio | [1440px](assets/frontend-v2-inc3/inicio-1440.png) | [390px](assets/frontend-v2-inc3/inicio-390.png) · [320px](assets/frontend-v2-inc3/inicio-320.png) |
| Explorar | [1440px](assets/frontend-v2-inc3/catalogo-desktop.png) | [390px](assets/frontend-v2-inc3/catalogo-mobile.png) · [320px](assets/frontend-v2-inc3/catalogo-estrecho.png) |
| Filtros | [Búsqueda + formato](assets/frontend-v2-inc3/filtros-desktop.png) | [Navegación móvil](assets/frontend-v2-inc3/navegacion-mobile.png) |
| Ficha conservada | [1440px](assets/frontend-v2-inc3/ficha-1440.png) | [320px](assets/frontend-v2-inc3/ficha-320.png) |
| Estados Inicio | [Carga](assets/frontend-v2-inc3/inicio-cargando.png) · [Error](assets/frontend-v2-inc3/inicio-error.png) | [Vacío](assets/frontend-v2-inc3/inicio-vacio.png) |

También se guardan Inicio768px, Explorar768px, estados del catálogo,404 de obra y diagnóstico. Capturas históricas del Incremento2 permanecen intactas para comparación.

## Reproducción

Desde la raíz de una copia limpia recuperada de esta rama, con Node24 y dependencias instaladas:

```powershell
npm --prefix Backend test
npm --prefix Frontend test
npm --prefix Frontend run build
npm --prefix Frontend run build:local
# Terminal propia 1:
npm --prefix Backend run dev
# Terminal propia 2:
npm --prefix Frontend run dev
```

Abrir http://localhost:5173. El build normal y `build:local` sobrescriben el mismo dist; **el último debe ser build:local** para probar V2 compilado. Con Backend activo, en otra terminal:

```powershell
Push-Location -LiteralPath Frontend -ErrorAction Stop
npm exec vite -- preview --host localhost --port 5174 --strictPort
# Tras detener ese preview con Ctrl+C:
Pop-Location
```

Smoke opcional Python/Playwright y Chromium ya disponibles en el laboratorio (no dependencia obligatoria de la aplicación):

```bash
python3 Frontend/test/browser/dark-catalog-smoke.py --output .local/inc3-dev
python3 Frontend/test/browser/dark-catalog-smoke.py --base-url http://localhost:5174 --output .local/inc3-preview
```

En Windows, usar `python` si ese es el lanzador instalado y `--chromium-path` si hace falta; esta receta de navegador no se ha ejecutado allí. Usar exclusivamente un clon nuevo verificado, sin modificar el repositorio dañado ni respaldos existentes. La rama V2 sigue local y no se obtiene clonando origin todavía. [Arranque Windows](LOCAL-DEV-CATALOGO.md) · [Recuperación segura](RECUPERACION-GIT-WINDOWS.md).

## Respaldo, límites y parada

Bundle Inc2 conservado e inspeccionado antes de editar: `yitverse-inc2-fba88e3.bundle`, SHA256 `72c9a2b3fa1775ca4e2a008201f9d0ce08636a6ea7773d965a4f0e4c0c1d6e5b`. SHA/bundle verify/clon recuperado correctos. El bundle nuevo se genera **después del commit**, en una carpeta nueva bajo `/workspace/YitVerse-Resguardos`, con manifiesto externo que registra hash de commit, SHA256, tamaño, clon restaurado y resultados. La ruta exacta y verificación final se entregan en el cierre, sin modificar el respaldo Inc2 ni Windows.

No se ejecutó Docker: Nginx conserva su fallback `try_files` y proxy, inspeccionados sin cambios. El Dockerfile sigue usando build normal S01: **no despliega V2**. Preview acredita el artefacto compilado local; no equivale a prueba Nginx/producción. No se verificaron Windows, PostgreSQL nativo/persistencia, Safari/Firefox, lector de pantalla, auditoría WCAG completa o Figma. Continúa el antecedente menor de URL con codificación porcentual inválida en API, sin cambio de Backend autorizado.

Próximo paso: revisión y aceptación del Incremento3 por el usuario. Incremento4, publicación y PR quedan detenidos hasta nueva autorización.
