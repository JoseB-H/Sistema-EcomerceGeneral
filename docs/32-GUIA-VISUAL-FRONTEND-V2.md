# Guía visual Frontend V2 — Incrementos2 y3

**Actualización:** 2026-11-06 UTC. **Rama local:** `feat/frontend-v2-editorial`. Sistema visual Inc2 aceptado en `fba88e3`; Inicio/Explorar Inc3 implementados para revisión. Sin push/PR ni Incremento4. Figma pendiente. [Pruebas Inc2](FRONTEND-V2-INCREMENTO-2-PRUEBAS.md) · [Pruebas Inc3](FRONTEND-V2-INCREMENTO-3-PRUEBAS.md).

## Organización y alcance

El contenedor existente importa, en orden:

1. `Frontend/src/catalog/tokens.css`: valores de tema, tipografía, espacios, dimensiones, radios, sombras y movimiento.
2. `Frontend/src/catalog/catalog.css`: estilos de los componentes existentes y preferencias de accesibilidad.
3. `Frontend/src/catalog/HomePage.css`: composición editorial, secciones y descubrimiento por género; reutiliza tokens.
4. `Frontend/src/catalog/catalog-responsive.css`: todos los umbrales de viewport y adaptaciones estructurales, incluidos Inicio y Explorar.

Los tokens se declaran en `body.catalog-mode` y `.catalog-shell`: el body necesita su propio acceso a los valores porque no hereda de un descendiente. No se introduce tema en `:root`, `body` global ni `App.css`. Las reglas de componentes quedan dentro de `.catalog-shell`. El build técnico S01 conserva su contenido exacto.

Rutas actuales: `/` Inicio editorial; `/explorar` catálogo completo; `/obras/:id`, `/estado` y404 conservados. `/?q=…` o `/?format=…` mantienen catálogo compatible. No hay ruta para esta guía ni nuevo router/dependencias. API, seis registros y SVG originales intactos. Detalles del comportamiento en el reporte Inc3.

## Paleta y semántica

| Token | Valor | Uso |
| --- | --- | --- |
| `--background` | `#07090F` | Fondo negro profundo |
| `--surface` | `#101522` | Formularios, estados y diagnóstico |
| `--surface-raised` | `#151D2C` | Superficie elevada disponible para el sistema |
| `--surface-input` | `#0B101B` | Campos y diagnóstico interior |
| `--blue` / `--blue-hover` | `#2563EB` / `#1D4ED8` | Acción principal y hover |
| `--detail` / `--cyan` | `#60A5FA` / `#38BDF8` | Enlaces, acentos y foco |
| `--violet` | `#8B5CF6` | Acento secundario del sistema; no añadir decoración indiscriminada |
| `--ink` | `#F8FAFC` | Texto principal |
| `--muted` / `--ink-soft` | `#94A3B8` / `#B8C6DB` | Metadatos y texto secundario |
| `--line` | `#26364F` | Borde decorativo/estructural |
| `--control-line` | `#64748B` | Límite visible de campos/controles |
| `--info-surface` / `--info-text` | `#121E34` / `#AFCFFF` | Selección e información |
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
| Hero | `--type-hero` | Fluido; 40–64px en escritorio, ajuste móvil32–45,6px |
| Detalle | `--type-detail` | Fluido36–60px; ajuste móvil40px |

Interlineados: cuerpo1,7, lectura1,85, titulares1,1 y controles/texto compacto1,4. El mínimo12px de información es una decisión de legibilidad de este diseño, **no una regla de tamaño mínimo de WCAG**. El microtexto de `WorkCover` tiene tokens de arte propios: es decorativo y el contenedor mantiene `aria-hidden`; título/formato/géneros y enlace accesibles siguen fuera de la ilustración.

## Espaciado, medidas y profundidad

- Escala compartida:4/8/12/16/20/24/32/40/48/64px (`--space-*`), más2px para detalles finos. No duplicar medidas corrientes como literales en componentes nuevos.
- Controles: mínimo44px (`--control-min`), campos/botones48px (`--control-size`). Campos con padding vertical8px; el espacio interior se comprueba frente a la línea tipográfica real. Selector de formato200px donde comparte fila; se apila en móvil.
- Portadas3:4 (`--cover-ratio`); límite de lectura y anchura de ficha expresados por tokens de layout. Los SVG y textos no se reconstruyen.
- Radios: controles8px, tarjetas12px, superficies14px, hero16px; píldoras con radio completo.
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
| ≤359px | Una tarjeta; portada con ancho máximo |

Los cuatro umbrales conservados son1199/800/599/359px. Con `prefers-reduced-motion: reduce`: ninguna transición/animación, sin elevación hover ni desplazamiento suave. Los estilos de preferencia siguen en el CSS base, separados de las condiciones de viewport.

## Reutilización de componentes y estados

`WorkCard`, `WorkCover`, `SearchForm` y estados se reutilizan en Inicio y Explorar. `Hero` se extrae como componente: datos reales del primer registro, portada SVG original, fondo NightArtwork y enlaces reales a ficha/Explorar. Antes de cargar o ante error/vacío muestra una invitación genérica, sin obra inventada. El foco del fragmento se comparte dentro de SearchForm. Botones: normal azul, hover más oscuro, foco cian, activo sin sombra y deshabilitado cuando ya lo requiere el diagnóstico. Selección de formato conserva borde y superficie informativa visibles.

Carga conserva `role=status`; error conserva `role=alert` y Reintentar; vacío mantiene Limpiar búsqueda;404 mantiene el regreso. `/estado` usa la misma superficie y semántica local. Se agregan únicamente Inicio y Explorar; no lectura, seguimiento, historial personal o comercio.

Contraste/teclado/movimiento reducido se miden en Chromium; objetivo WCAG AA, sin declarar una auditoría integral ni certificación. Windows y lectores de pantalla no se verificaron en esta entrega.

## Composición editorial del Incremento3

Inicio presenta Hero, un único SearchForm, Continuar explorando no personalizado, Selección de demostración y géneros existentes. La portada destacada conserva3:4; su texto sigue decorativo y el título/formato reales se exponen fuera del SVG. Las filas editoriales usan tres columnas en escritorio/tablet, dos en móvil y una a320px; conservan la misma escala de tokens. A768px se apilan encabezados de sección; en móvil Hero y portada se apilan y los accesos a géneros ocupan todo el ancho.

Explorar mantiene la retícula6/3/2/1, encabezado propio, formulario, recuento real y estados. Navegación siempre visible Inicio/Explorar/Estado; `aria-current` solo señala la ruta correspondiente. Se añade ancho mínimo44px al enlace Inicio y se conserva foco cian. Footer enlaza las mismas rutas. Las acciones no disponibles no aparecen.
