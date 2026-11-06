# Frontend V2 editorial — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task **respetando la autorización de ejecución por incremento del usuario**. Steps use checkbox (`- [ ]`) syntax for tracking.

**Estado:** PLAN APROBADO por el usuario el 2026-11-05, incluidas las decisiones provisionales. **Solo el Incremento1 tiene autorización de ejecución.** Incrementos2–5 esperan revisión y nueva aprobación. No hay mockups Figma aprobados ni diseño final acreditado. La rama y su commit permanecerán locales; push/PR expresamente prohibidos en esta entrega.

**Goal:** Evolucionar el frontend existente hacia Inicio, Explorar, Detalle y adaptación móvil V2, con una guía visual común, conservando catálogo/API y las garantías funcionales.

**Architecture:** Partir de la rama azul nocturna y reutilizar componentes, cliente HTTP, hook de recursos y navegación nativa. Separar Inicio de Explorar y centralizar tokens/presentación; datos de obras siempre desde Express. Backend, Database y Docker quedan fuera de los cambios.

**Tech Stack:** React 19/Vite 8 existentes, CSS, arte original, Vitest/Testing Library, pruebas Backend y Chromium/Playwright existentes. No se propone una librería de routing ni nuevas dependencias obligatorias.

**Spec:** Solicitud actual del usuario; `origin/main:docs/31-YITVERSE-DISENO-VISUAL-V2.md`, `origin/main:docs/00-BITACORA-DE-CONTINUIDAD.md`, `docs/21-EXPERIENCIA-USUARIO.md`, `docs/20-VISION-FUNCIONAL-YITVERSE.md`, RF/RNF vigentes y especificaciones del catálogo.

## Inspección verificada — 2026-11-05, America/Bogota

Clon nuevo: `/workspace/YitVerse-Frontend-V2-Revision`, obtenido de GitHub, sin copiar `.git`, `.env`, dependencias o archivos del checkout anterior. `git fsck --full` terminó sin errores. Inspección con HEAD separado en `127aa8a`, sin rama nueva de frontend, commits ni push. Las carpetas Windows indicadas por el usuario no se accedieron ni alteraron. Esto no certifica la copia de seguridad o los cambios sin commit de Windows.

| Rama | Commit observado | Contenido relevante |
| --- | --- | --- |
| `main` | `ae3f8e8` | Bitácora y especificación V2 recientes; todavía no incorpora el código de las ramas de desarrollo |
| `feat/s01-infraestructura-docker` | `e672e2e` | Infraestructura técnica existente, que se conserva |
| `feat/local-dev-catalogo` | `4794803` | Catálogo/ficha sintéticos, API y ejecución nativa |
| `feat/ui-azul-nocturno` | `127aa8a` | Base más completa de UI oscura, arte propio, accesibilidad y evidencia de pruebas |

Ancestro común de main/UI: `b32ee01`. Desde él, main añade únicamente `docs/00-BITACORA-DE-CONTINUIDAD.md` y `docs/31-YITVERSE-DISENO-VISUAL-V2.md`. No confundir la ausencia de código en main con pérdida del trabajo de las otras ramas. Sus notas de estado/backlog siguen describiendo un estado previo; no deben sobrescribir los registros de implementación de la rama UI.

Pruebas ejecutadas en este clon: `npm --prefix Backend test` **45/45**, `npm --prefix Frontend test` **35/35**, builds normal y `build:local` con salida0. Dependencias existentes instaladas mediante `npm ci` desde sus lockfiles, sin cambiar manifiestos/versiones. Chromium existente: 1440/768/390/320px, portadas3:4, búsqueda/filtro/ficha/historial, foco, estados/reintento, salud503 y movimiento reducido aprobados; cero errores JS/peticiones a terceros. Logs y capturas de inspección en `/tmp/yitverse-v2-inspeccion`, sin versionar. No se ejecutó Docker ni una instalación Windows/PostgreSQL nativa.

## Diagnóstico del frontend

- `/` reúne hero, búsqueda y catálogo; `/obras/:id` muestra detalle; `/estado` diagnostica salud; hay404. No existen Inicio y `/explorar` separados.
- Se consumen `/api/works` y `/api/works/:id`; `source` debe declarar `synthetic`/`persisted:false`. No hay copia de respaldo de obras en React. La API busca título/sinopsis/géneros con `q` y filtra formato con `format`.
- Hay seis obras ficticias y seis ilustraciones SVG propias diferenciadas, hero nocturno, tarjetas3:4, navegación nativa, foco/skiplink y responsive. El arte existe, pero su detalle narrativo puede evolucionar.
- Los estados de carga/error/vacío/404, timeout4000ms, cancelación, resultados obsoletos y reintento ya están resueltos. Se conservan.
- Faltan bloques de descubrimiento/categorías y la selección de novedades; no hay historia personal/progreso, seguimiento o lectura.
- `catalog.css` tiene nueve tokens de color; tipografía, espacios, radios y medidas siguen repartidos como valores literales. No hay guía unificada de componentes.
- El build normal conserva S01; `dev`/`build:local` activan el catálogo. No intercambiar esos modos por accidente.
- La guía local heredada todavía apunta a la carpeta Windows afectada por errores Git. No usar esos comandos allí: la guía V2 propondrá una ruta nueva, por ejemplo `D:\Proyectos\YitVerse\YitVerse-Frontend-V2-Limpio`, únicamente si el destino no existe. La carpeta original y `%USERPROFILE%\YitVerse-Respaldo-Seguro` permanecen protegidas; no se infiere que su respaldo esté verificado.

## Dirección solicitada y decisiones provisionales del plan aprobado

**Solicitado:** negro profundo/azul eléctrico, jerarquía editorial, portadas originales más narrativas, cinco vistas/artefactos objetivo, responsive, teclado, contraste, reutilización y datos ficticios señalados. La visión futura de biblioteca/lector/tienda no equivale a autorización para programarlos.

**Decisiones provisionales aprobadas como plan, sin implementar todavía los cambios visuales:**

1. Rama `feat/frontend-v2-editorial` desde `127aa8a`; incorporar las dos notas recientes de main, conservando todo el código/documentación de UI.
2. Inicio en `/`, catálogo en `/explorar`, detalle y estado en sus rutas actuales. Compatibilidad con `/?q=...&format=...` y `/#catalog-query` ya compartidos.
3. Fondo provisional `#07090F`, superficies `#101522`/`#151D2C`, azul `#2563EB` y acentos actuales; familias del sistema existentes. Escala de espacio4/8/12/16/24/32/48/64px, metadatos legibles de12px como referencia, botones44px mínimo y jerarquía tipográfica fluida. Son decisiones revisables de diseño, no valores ya aprobados de Figma.
4. Guía visual versionada en Markdown con tokens/componentes/capturas reales. No se añade una ruta de producto solo para mostrar una guía.
5. **“Continuar explorando”** será descubrimiento no personalizado, sin historial de lectura o progreso inventado. **“Nuevos títulos”** se presentará provisionalmente como **“Selección de demostración”**, sin afirmar fechas/altas. Si se requiere novedad cronológica real, hará falta otra decisión de datos/API; no se implementa aquí.
6. Categorías derivadas de `genres` de las respuestas reales, con enlaces a la búsqueda `q` existente. Son accesos a búsqueda, no un nuevo filtro exacto de género ni endpoint.
7. Ficha sin botones Leer/Seguir hasta contar con funcionalidad, derechos y persistencia aprobados. No hay botones falsos, XP, monedas, cuenta, compra o canje.

Los documentos de main proponen completar Figma antes de React. La instrucción actual permite proponer sobre Markdown provisional y exige aprobar este plan antes de implementar. Se registrará esa actualización de alcance sin marcar Figma ni ninguna pantalla como aprobados por inferencia.

## Archivos y responsabilidades previstos

Crear:

- `Frontend/src/catalog/tokens.css`: colores, familia/escala tipográfica, espacios, radios, sombras y movimiento, acotados a `.catalog-shell`.
- `Frontend/src/catalog/catalog-navigation.js`: `isCatalogLocation(pathname, search)`, `exploreHref({query,format})`, `workHref({id,query,format})`; helpers puros para rutas/compatibilidad, sin router nuevo.
- `Frontend/src/catalog/HomePage.jsx` y `HomePage.css`: Inicio consume la API y presenta hero, búsqueda y secciones de descubrimiento.
- `Frontend/src/catalog/Hero.jsx`: presentación reutilizable del destacado; recibe una obra obtenida de API y no contiene registros estáticos.
- `Frontend/src/catalog/home-sections.js`: `deriveHomeSections(works)` devuelve `{featured, discovery, selection, categories}` usando exclusivamente las obras recibidas. Selección editorial de demo, sin cronología/personalización y sin duplicar metadatos del Backend.
- `Frontend/src/catalog/assets/v2/archivo-aurora.svg`, `orbita-de-papel.svg`, `el-jardin-de-los-ecos.svg`, `ciudad-de-tinta.svg`, `despues-del-ultimo-tren.svg`, `la-ruta-del-viento.svg`: arte original más detallado, con correspondencia a los seis IDs existentes.
- `Frontend/src/catalog/assets/v2/README.md`: procedencia propia, finalidad ficticia y dimensiones del arte; sin recursos ajenos.
- `Frontend/test/catalog-navigation.test.js`, `home-sections.test.js`, `HomePage.test.jsx`: nuevos contratos/rutas/selección y estados.
- `docs/32-GUIA-VISUAL-FRONTEND-V2.md`: guía reutilizable de tokens y componentes, con estados y capturas.

Modificar de forma acotada: `CatalogApp.jsx` (composición/rutas/header/footer), `CatalogPage.jsx` (Explorar), `WorkDetailPage.jsx` (presentación/regreso), `components.jsx` (componentes existentes/foco), `artwork.jsx` (integración del arte), `catalog.css` (consumir tokens y estilo compartido), `Frontend/test/CatalogApp.test.jsx`, `Frontend/test/browser/dark-catalog-smoke.py`, guía local y documentos técnicos afectados. No sustituir cliente/hook de datos ni los seis registros.

En **cada incremento** se actualizan `docs/00-BITACORA-DE-CONTINUIDAD.md`, `docs/31-YITVERSE-DISENO-VISUAL-V2.md` y `docs/ESTADO-DEL-PROYECTO.md`: fecha, rama, archivos, resultado real, pruebas, problemas y siguiente tarea. Actualizar UX/Frontend/RNF/trazabilidad cuando el cambio lo requiera. No se inicia automáticamente otro sprint.

## Incremento1 — continuidad y base de rama

**Archivos:** dos notas nuevas desde main, estado/UX/alineación, índice, README, `docs/LOCAL-DEV-CATALOGO.md` y `docs/RECUPERACION-GIT-WINDOWS.md`; ningún cambio de runtime.

- [x] Después de la aprobación, volver a comprobar referencias, integridad y árbol limpio; conservar este plan documental.
- [x] Crear `feat/frontend-v2-editorial` desde la base azul verificada. Integrar de forma controlada los dos documentos nuevos de main en esta rama; validar que no se incorporen versiones antiguas de otros documentos ni cambien fuentes o infraestructura. main/PR#3 no se modifican ni fusionan como destino.
- [x] Registrar qué está implementado, qué es propuesta V2 y qué sigue sin aprobación visual. Mantener constancia de recuperación Windows pendiente, sin afirmar respaldo local verificado.
- [x] Corregir la guía de esta rama para señalar una ruta Windows nueva y separada, sin dar instrucciones de instalación/ejecución sobre el checkout dañado ni sobre el respaldo. Comprobar destino inexistente antes de clonar; no acceder a Windows desde cloud.
- [x] Comprobar diff esperado y suites de base45/35 verdes; si las referencias cambiaron respecto a esta inspección, revisar la diferencia antes de avanzar.
- [x] Commit propuesto: `docs(v2): reconcile continuity and frontend baseline`.

## Incremento2 — sistema visual y componentes

**Interfaces:** tokens locales consumidos por las clases existentes; APIs/props de datos intactas.

- [ ] Extraer tokens y aplicar negro/azul, jerarquía y medidas propuestas. Mantener WorkCard/WorkCover/SearchForm/estados; evitar reestructurar componentes por comodidad.
- [ ] Crear guía visual con paleta, tipografía, espacios, botones/campos, tarjetas, estados y regla de movimiento reducido. Es una especificación del prototipo, no prueba de aprobación Figma.
- [ ] Verificar estilos con Chromium/contraste/foco y capturas, más suite Frontend y ambos builds. No añadir tests que solo repitan literales CSS.
- [ ] Mantener `.catalog-shell` como límite; el build técnico S01 no recibe el tema V2.
- [ ] Actualizar los tres documentos obligatorios y guía visual. Commit: `refactor(frontend): centralize V2 visual tokens and components`.

## Incremento3 — Inicio y Explorar con datos existentes

**Interfaces:** `api.list({query,format,signal})`, hook y WorkCard actuales. Helpers de navegación y derivación descritos arriba; sin nuevos parámetros de API.

- [ ] TDD: tests nuevos deben fallar antes de crear helpers/pantalla. Probar `/` como Inicio, `/explorar` como catálogo y `/?q=...&format=...` como acceso compatible al catálogo anterior. Mantener rutas de detalle/estado/404 y fragmento de búsqueda.
- [ ] Inicio muestra datos de `api.list()` mediante `deriveHomeSections`: destacado, continuar explorando no personalizado, selección ficticia y categorías. Sin API válida: carga/error/reintento/vacío, sin catálogo estático alternativo.
- [ ] Un solo buscador real por pantalla, reutilizando SearchForm. En Inicio envía a `/explorar?q=...&format=...`; en Explorar actualiza la URL y mantiene foco/estado. Header y hero conservan acceso por teclado al campo, incluso tras montaje dinámico.
- [ ] Catálogo conserva acentos, filtro manga/manhwa, vacío/limpiar, abortos/timeout y respuesta tardía ignorada. Cambiar expectativas de rutas de tests solo por la separación aprobada; conservar todos sus casos funcionales.
- [ ] Las tarjetas conservan `/obras/:id` con q/format; Volver al catálogo lleva a `/explorar` con filtros. Atrás/adelante nativos siguen funcionando. Los enlaces antiguos de detalle siguen siendo válidos.
- [ ] Probar categorías desde géneros reales hacia `q`; validar que ninguna sección afirma fechas, rankings, historial o progreso. No añadir un parámetro `genre` que el Backend rechaza.
- [ ] Tests de `deriveHomeSections`: vacío, menos de seis resultados, categorías únicas y registros sin mutación; nunca fabricar obras faltantes.
- [ ] Verde: suites completas y navegador; acotar selectores del smoke a cada pantalla/sección, porque Inicio puede representar la misma obra en varias secciones. Actualizar tres documentos obligatorios. Commit: `feat(frontend): add V2 home and dedicated explore view`.

## Incremento4 — portadas narrativas, ficha y móvil

**Interfaces:** mismos IDs, WorkCover y metadatos del API; arte separado de los datos de catálogo.

- [ ] Crear las seis ilustraciones originales con escena/composición/detalle más narrativos, reutilizando la identidad existente. Conservar la proporción3:4 y avisos de ficción. No importar personajes, portadas o imágenes protegidas.
- [ ] Evolucionar hero y ficha, espacios/títulos/tags y navegación móvil real. Acciones de ficha limitadas a lo actualmente disponible; no simular lectura/seguimiento con botones inactivos.
- [ ] Probar carga y dimensiones del arte, textos largos, foco, targets44px y ausencia de desbordes en320/390/768/1440px. Si hay carga diferida, reservar dimensiones para evitar saltos; el fallo de una imagen no elimina título/enlace de la obra.
- [ ] Verificar texto/contraste, aviso ficticio, reduced-motion, regreso filtrado y que la fuente sigue siendo API. Añadir regresiones de comportamientos nuevos/fallos encontrados antes de corregirlos; comparar capturas para estilos.
- [ ] Actualizar tres documentos obligatorios y guía visual. Commit: `feat(frontend): refine V2 original covers detail and mobile layouts`.

## Incremento5 — entrega verificable

- [ ] Ejecutar todas las suites Backend/Frontend existentes y nuevas, builds normal/local y smoke Chromium actualizado. Cero fallos/omitidos inesperados; no fijar un total arbitrario de tests nuevos.
- [ ] Verificar Home → Explorar → Ficha → regreso; búsquedas directas/legacy/acentos/formato/categorías; atrás/adelante; carga/error/vacío/404/reintento; teclado/foco/reduced-motion y salud503 real sin PostgreSQL. No invocar Docker.
- [ ] Revisar toda la rama frente a su base y corregir problemas con regresiones. Comprobar que no cambia Backend, Database, Docker, credenciales o datos y que no se elimina ningún caso funcional de prueba.
- [ ] Documentar resultados reales, capturas de las cuatro vistas, tokens, comandos Windows y límites (Windows/PG/Figma no se acreditan por un navegador Linux). Actualizar los tres documentos obligatorios con próxima tarea y estado “en revisión”.
- [ ] Commit: `docs(frontend): record V2 verification and review delivery`. Publicar únicamente la rama de trabajo para revisión, con comparación respecto a la base azul; no fusionar main, modificar PR#3 ni declarar aceptado el sprint.

## Review Focus

1. URLs antiguas y nuevas, fragmento de búsqueda, montaje dinámico, retorno filtrado e historial. Cubrir con tests de rutas y Chromium.
2. Colecciones Home cuando API falla o devuelve pocos registros: nada de fallback, novedades o personalización inventados. Cubrir helpers y HomePage.
3. Categorías de datos reales sin romper el contrato `q`/`format`; probar navegación y estado vacío.
4. Arte original que no oculte información al fallar, títulos largos, foco/contraste/reduced-motion y compatibilidad de estilos S01; pruebas reales de navegador/builds.
5. Documentación reconciliada entre ramas y límites de aprobación/persistencia/Windows explícitos; inspección del diff y tres notas de continuidad por incremento.

## Punto de parada actual

El usuario aprobó el plan y autorizó **únicamente Incremento1**, completado documentalmente en esta entrega local. La rama `feat/frontend-v2-editorial` se creó desde `127aa8a`; solo se incorporan/reconcilian documentos y se entrega un commit local. **No se modifica código, no se publica ni abre PR y no se avanza al Incremento2 hasta una nueva aprobación del usuario.**
