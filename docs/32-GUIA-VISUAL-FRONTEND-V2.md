# Guía visual Frontend V2 — sistema editorial lavanda

**Ampliación2026-11-07UTC:** `feat/lector-capitulos-local` desde lavanda `af2a6e5` añade lista y lector. `Frontend/src/reader/reader.css` se carga después de estilos de catálogo; reutiliza tokens existentes y sus breakpoints, con adaptación propia a599px y movimiento reducido. Sin cambios en SVG/tokens/infraestructura, ni aprobación estética implícita. [Guía y capturas36](36-LECTOR-CAPITULOS-LOCALES.md).

La nueva ruta nativa `/obras/:id/capitulos/:numero` mantiene enlaces/filtros y return a ficha. Navegación duplicada al principio/final, selector etiquetado, límites textuales en lugar de enlaces inactivos, imágenes con dimensiones intrínsecas y reintento accesible. Se omite CTA de descubrimiento en lectura; se conservan header/footer. Las seis obras son ficticias y solo aparecen capítulos reales del almacén local; no hay progreso personal. Contraste/teclado/foco y cuatro viewports verificados en Chromium, sin afirmar auditoría integral WCAG o transcripciones de imágenes.

**Actualización:** 2026-11-06, America/Bogota. Rama local `feat/ui-editorial-lavanda`, desde2142e26; código47e8ae3. Dirección violeta/lavanda del ZIP confirmada, con arte/API propios conservados. [Entrega visual35](35-REDISENO-EDITORIAL-LAVANDA.md). Se mantienen como históricos los cinco incrementos originales y la integración34; sin push/PR y pendiente aprobación estética/Figma.

## Organización y alcance

El contenedor existente importa, en orden:

1. `Frontend/src/catalog/tokens.css`: valores de tema, tipografía, espacios, dimensiones, radios, sombras y movimiento.
2. `Frontend/src/catalog/catalog.css`: estilos de los componentes existentes y preferencias de accesibilidad.
3. `Frontend/src/catalog/HomePage.css`: composición editorial, secciones y descubrimiento por género; reutiliza tokens.
4. `Frontend/src/catalog/catalog-responsive.css`: todos los umbrales de viewport y adaptaciones estructurales, incluidos Inicio y Explorar.

Los tokens se declaran en `body.catalog-mode` y `.catalog-shell`: el body necesita su propio acceso a los valores porque no hereda de un descendiente. No se introduce tema en `:root`, `body` global ni `App.css`. Las reglas de componentes quedan dentro de `.catalog-shell`. El build técnico S01 conserva su contenido exacto.

Rutas actuales: `/` Inicio editorial; `/explorar` catálogo completo; `/obras/:id`, `/estado` y404 conservados. `/?q=…` o `/?format=…` mantienen catálogo compatible. No hay ruta para esta guía ni nuevo router/dependencias. API y seis registros intactos; SVG originales refinados como base en Inc4. El reporte Inc3 conserva el comportamiento de rutas y el reporte Inc4 sus ajustes de presentación.

## Paleta y semántica

| Token | Valor | Uso |
| --- | --- | --- |
| `--background` | `#101017` | Fondo negro profundo |
| `--surface` | `#191923` | Formularios, estados y diagnóstico |
| `--surface-raised` | `#20202C` | Superficie elevada disponible para el sistema |
| `--surface-input` | `#12121B` | Campos y diagnóstico interior |
| `--accent-solid` / `--accent-hover` (aliases `--blue` / `--blue-hover`) | `#7545D0` / `#6438B7` | Acción principal y hover |
| `--detail` / `--cyan` | `#C0A4FF` / `#D5C2FF` | Enlaces, acentos y foco |
| `--violet` | `#9B73F9` | Acento secundario del sistema; no añadir decoración indiscriminada |
| `--ink` | `#F4F3F8` | Texto principal |
| `--muted` / `--ink-soft` | `#B0AABE` / `#D0CBDD` | Metadatos y texto secundario |
| `--line` | `#383242` | Borde decorativo/estructural |
| `--control-line` | `#81778F` | Límite visible de campos/controles |
| `--info-surface` / `--info-text` | `#282036` / `#DDCEFC` | Selección e información |
| `--error` / `--error-surface` | `#FDA4AF` / `#2B1823` | Error, sin depender solo del color |
| `--success` | `#86EFAC` | Salud positiva ya contemplada por la UI técnica; no simula DB disponible |
| `--disabled-surface` / `--disabled-text` | `#334463` / `#CBD5E1` | Comprobación técnica en curso |
| `--focus` | Alias de `--cyan` | Foco por teclado |

No usar `--line` como único contorno de un campo: la distinción con `--control-line` conserva contraste. Colores de las ilustraciones originales no se reescriben al cambiar el tema. Los gradientes y sombras usan tokens y `color-mix`, sin imágenes o fuentes remotas.

## Tipografía

Familia: Segoe UI → system-ui → fuentes de sistema alternativas, sin descargar tipografías ni añadir licencias/servicios externos. Pesos500/600/700/800 y tamaños fluidos para titulares.

| Rol | Token | Referencia con raíz16px |
| --- | --- | --- |
| Metadatos/notas | `--type-caption` | 12px |
| Etiquetas/acciones auxiliares | `--type-label` | 13px |
| Navegación/botones/campos desktop | `--type-ui` | 14px |
| Descripción breve | `--type-copy` | 15px |
| Cuerpo/sinopsis/campos móviles | `--type-body` | 16px |
| Subtítulo | `--type-subheading` | 20px |
| Sección | `--type-section` | 24–28px |
| Hero | `--type-hero` | Fluido; 40–57,6px en escritorio, ajuste móvil32–45,6px |
| Detalle | `--type-detail` | Fluido36–60px; ajuste móvil40px |

Interlineados: cuerpo1,7, lectura1,85, titulares1,1 y controles/texto compacto1,4. El mínimo12px de información es una decisión de legibilidad de este diseño, **no una regla de tamaño mínimo de WCAG**. El microtexto de `WorkCover` tiene tokens de arte propios: es decorativo y el contenedor mantiene `aria-hidden`; título/formato/géneros y enlace accesibles siguen fuera de la ilustración.

## Espaciado, medidas y profundidad

- Escala compartida:4/8/12/16/20/24/32/40/48/64px (`--space-*`), más2px para detalles finos. No duplicar medidas corrientes como literales en componentes nuevos.
- Controles: mínimo44px (`--control-min`), campos/botones48px (`--control-size`). Campos con padding vertical8px; el espacio interior se comprueba frente a la línea tipográfica real. Selector de formato200px donde comparte fila; se apila en móvil.
- Portadas3:4 (`--cover-ratio`); límite de lectura y anchura de ficha expresados por tokens de layout. Los SVG conservan sus escenas/paletas. Solo el título decorativo repetido dentro de portada se limita a tres líneas; el título accesible externo conserva todo el contenido.
- Radios: controles8px, tarjetas10px, superficies14px, hero12px; píldoras con radio completo.
- Borde normal1px, acento3px. Foco2px y separación4px; también se aplica a los destinos de navegación con `tabIndex`.
- Sombras: tokens distintos para tarjeta, acción principal, hover y portada grande. Hover de portada con desplazamiento máximo3px; sin animación continua.

## Responsive y preferencias

Las variables CSS no son válidas como condiciones de media queries. Por eso los umbrales se definen **una sola vez** en `catalog-responsive.css`; allí se ajustan tokens y estructura, sin añadir preprocesador ni dependencia.

| Anchura | Composición vigente |
| --- | --- |
| ≥1200px | Seis tarjetas, cabecera completa |
| 801–1199px | Tres tarjetas, menos elementos auxiliares |
| 600–800px | Tres tarjetas, búsqueda en dos columnas y botón en fila propia |
| 360–599px | Dos tarjetas, formulario apilado, navegación móvil visible |
| ≤359px | Dos tarjetas; títulos ajustados y portada3:4 con ancho máximo |

Los cuatro umbrales conservados son1199/800/599/359px. Con `prefers-reduced-motion: reduce`: ninguna transición/animación, sin elevación hover ni desplazamiento suave. Los estilos de preferencia siguen en el CSS base, separados de las condiciones de viewport.

## Reutilización de componentes y estados

`WorkCard`, `WorkCover`, `SearchForm` y estados se reutilizan en Inicio y Explorar. `Hero` se extrae como componente: datos reales del primer registro, portada SVG original, fondo NightArtwork y enlaces reales a ficha/Explorar. Antes de cargar o ante error/vacío muestra una invitación genérica, sin obra inventada. El foco del fragmento se comparte dentro de SearchForm. Botones: normal violeta, hover más oscuro, foco lavanda, activo sin sombra y deshabilitado cuando ya lo requiere el diagnóstico. Selección de formato conserva borde y superficie informativa visibles.

Carga conserva `role=status`; error conserva `role=alert` y Reintentar; vacío mantiene Limpiar búsqueda;404 mantiene el regreso. `/estado` usa la misma superficie y semántica local. En el Incremento3 se agregaron únicamente Inicio y Explorar; el lector local fue autorizado posteriormente y se documenta en guía36. Seguimiento, historial personal y comercio siguen pendientes.

Contraste/teclado/movimiento reducido se miden en Chromium; objetivo WCAG AA, sin declarar una auditoría integral ni certificación. Windows y lectores de pantalla no se verificaron en esta entrega.

## Composición editorial del Incremento3 — registro histórico

Inicio presenta Hero, un único SearchForm, Continuar explorando no personalizado, Selección de demostración y géneros existentes. La portada destacada conserva3:4; su texto sigue decorativo y el título/formato reales se exponen fuera del SVG. Las filas editoriales usan tres columnas en escritorio/tablet, dos en móvil y una a320px; conservan la misma escala de tokens. A768px se apilan encabezados de sección; en móvil Hero y portada se apilan y los accesos a géneros ocupan todo el ancho.

Explorar mantiene la retícula6/3/2/1, encabezado propio, formulario, recuento real y estados. Navegación siempre visible Inicio/Explorar/Estado; `aria-current` solo señala la ruta correspondiente. Se añade ancho mínimo44px al enlace Inicio y se conserva foco cian. Footer enlaza las mismas rutas. Las acciones no disponibles no aparecen.

## Ficha, arte y móvil — Incremento4, registro histórico

Se reutilizan tokens/radios/superficies existentes; no nueva paleta o breakpoint. La ficha usa grid con áreas `art heading / art copy` y marco con degradado del tema; en≤599px cambia a `heading / art / copy`. La portada móvil se limita al token de ancho de ficha y mantiene3:4. El título aparece antes que el arte; formato es `dl`, géneros lista semántica y sinopsis conserva párrafos. Los textos indivisibles usan `overflow-wrap:anywhere` en título, cuerpo, tarjetas, Hero y enlaces por género; no se oculta el texto esencial para evitar desbordes.

El Hero móvil reduce padding/márgenes con la escala compartida, sin suprimir la sinopsis ni acciones disponibles. La navegación principal sigue visible, sin menú oculto nuevo. Footer suma ancho mínimo44px al enlace Inicio; campos48px y formato completo conservados. Rotación simulada y resize preservan valores/filtros.

Carga/error de ficha tienen h1 «Ficha de obra», status/alert y regreso filtrado; el error conserva reintento y explica alternativas.404 de obra explica que la obra no se encuentra en la colección y conserva la búsqueda. Vacíos válidos usan avisos neutrales; no sustituyen una respuesta API inválida por una obra de respaldo.

Las portadas y SVG siguen decorativos (`aria-hidden`, `focusable=false`); título, formato y aviso ficticio están accesibles fuera del arte. No se añade un alt redundante al SVG. Quitar su visibilidad no elimina información ni navegación. Se conserva `useId` por instancia para gradientes únicos y se protege el fallback gráfico frente a propiedades heredadas de JavaScript. No significa que exista una portada persistida en la API.

## Verificación integral — Incremento5, registro histórico

El sistema visual permanece igual al Incremento4. Smokes completos repetidos en dev y preview compilado a320/390/768/1440, sin overflow/excepciones/avisos inesperados. Consola separa404/503 y fallos de red intencionales de errores de aplicación. Teclado/foco/semántica/contrastes de muestras/reduced-motion y resize se comprueban; no conformidad WCAG integral ni otros navegadores acreditados. [Galería definitiva y métricas](33-ENTREGA-FRONTEND-V2.md). Las imágenes idénticas a capturas anteriores se reutilizan tras comprobar SHA256 de una ejecución nueva.

## Composición lavanda vigente

Hero → barra de géneros → búsqueda/formato existentes → seis destacadas → paneles compactos de atajos → CTA final. Los géneros son enlaces q reales, con scroll local y foco; no datos ni filtros inventados. Las portadas mantienen sus paletas originales y3:4. Seis columnasdesktop,tres tablet,dos móvil; Hero móvil sin su portada duplicada decorativa, con panorama y datos/acciones conservados. Footer/Explorar/Detalle/estados comparten tokens; no nuevos motores/librerías ni funciones de negocio.134pruebas/2builds/6smokes y capturas en35; objetivoAA, sin certificarWCAGintegral/zoom200%/Windows.
