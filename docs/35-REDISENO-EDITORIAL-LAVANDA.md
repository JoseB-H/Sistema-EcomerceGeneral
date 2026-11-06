---
tags: [yitverse, frontend, lavanda, referencia, revision-visual]
estado: implementado-verificado-pendiente-de-aprobacion-visual
actualizado: 2026-11-06
zona: America/Bogota
---
# YitVerse — rediseño editorial lavanda

**Rama local:** `feat/ui-editorial-lavanda`, desde `integration/frontend-v2-main`/`2142e26`. **Commit funcional final:** `47e8ae33f540bd3b1315c6ee773aa62ee4a6b7c7`. La entrega requiere revisión estética del usuario; no hay push, PR, merge de main ni aceptación Figma por inferencia. La [nota34](34-REVISION-COORDINADA-INTEGRACION.md) conserva la integración anterior.

## Solicitud y referencia

El usuario pidió adaptar el frontend a una referencia editorial oscura violeta/lavanda. Tras recibir `Practicas-main.zip`, confirmó usarlo **solo como referencia visual**, preservando las seis obras, ilustraciones, API y PostgreSQL del proyecto existente. El archivo se inspeccionó estáticamente; sus instrucciones/documentos pertenecen a otro prototipo y no sustituyen esta autorización.

Se adapta su composición, jerarquía, franja de géneros, portadas verticales y llamada final; no se importan imágenes PNG, páginas/capítulos, registros, SQLite, lector, biblioteca, valoraciones ni dependencias de ese archivo. Las seis escenas SVG y el panorama original existente se conservan byte a byte.

## Antes y después

| Elemento | Base2142e26 | Implementado para revisión |
| --- | --- | --- |
| Tema | Negro/azul/cian | Fondo ciruela oscuro, acciones violeta y detalles/foco lavanda; tokens semánticos y aliases compatibles |
| Hero | Copy/portada vertical sobre escena azul | Panorama original de lado a lado, degradados, título/sinopsis/formato/géneros reales y enlaces a ficha/Explorar |
| Géneros | Bloque al final | Barra compacta inmediatamente después del Hero, desde géneros recibidos y búsqueda q existente |
| Obras | Hero más grupos3/2 con portadas grandes | Seis tarjetas juntas en orden API; grupos3/2 conservados como atajos editoriales sin repetir portadas |
| Móvil | Hero con portada repetida debajo | Panorama y acciones conservados; se omite solo esa duplicación decorativa, con seis portadas visibles en Destacadas |
| Footer | Identidad y navegación | CTA real «Descubrir el catálogo» y footer existente coherente con el tema |

Los grupos complementarios siguen el orden ya aprobado: tres obras después del destacado y las restantes en Selección de demostración. No implican historia personal, novedades o rankings. La tira de géneros permite desplazamiento horizontal **dentro del componente**, accesible mediante foco, sin desbordar el documento. Desktop6 columnas, tablet3, móvil2; portadas3:4 sin recorte nuevo.

## Comportamiento conservado

React/Vite y Express/API originales; fuente sintética real de Backend, seis obras de solo lectura y sin respaldo estático en Frontend. Se conservan `/`, `/explorar`, `/obras/:id`, `/estado`,404, URL antiguas con q/format, historial, recarga directa, retorno filtrado, búsqueda/acentos, formato, fragmento/foco, cancelación, timeout y reintento. Sin botones de leer, guardar, cuentas o acciones no implementadas.

Backend, Database, Compose, Dockerfiles, Nginx, manifiestos/lockfiles, scripts, navegación/cliente HTTP y `artwork.jsx` son idénticos a2142e26. No se agregan dependencias ni se sustituye la arquitectura: `npm ci` instala los locks existentes en este worktree cloud. Docker conserva el diagnóstico S01; este rediseño se sirve con Vite nativo o build local/preview, sin desplegar V2 en Docker.

## Verificación real de esta entrega

[Evidencia y manifiesto de capturas](assets/editorial-lavanda/verificacion.json).

| Comprobación | Resultado |
| --- | --- |
| Backend |45/45 |
| Frontend |68/68:58 anteriores y10 nuevas |
| Guardas helper, sin recursos Docker reales |15/15 |
| Regresiones del observador de consola |6/6 |
| **Total ejecutado** |**134/134, cero fallos u omitidos en estas suites** |
| Integración Docker/persistencia |**NO EJECUTADAS:10+1 casos**, por alcance exclusivamente Frontend; evidencia anterior no se presenta como nueva |
| Builds normal S01/local V2 |Ambos salida0 |
| Chromium |6 smokes: editorial, catálogo/navegación y ficha/móvil, en dev y preview compilado |
| Anchuras |320,390,768,1440; sin overflow del documento |
| Consola |Cero pageerror/errores/avisos inesperados; HTTP negativos por ámbito y favicon404 separado |
| Accesibilidad acotada |Teclado, salto al contenido, foco/fragmento, tamaños táctiles, contraste de muestras y reduced-motion comprobados |

La suite TDD nueva reprodujo ocho fallos por ausencia de destacadas/géneros/CTA; un caso de vacío ya estaba protegido. Después pasaron las nueve regresiones y la suite completa67. El smoke visual primero falló por el fondo azul anterior. Una comprobación posterior reprodujo el Hero móvil con portada duplicada visible; se compactó por CSS y se revalidó, manteniendo el panorama y seis portadas visibles. El smoke antiguo de proporciones ahora comprueba las portadas visibles, porque esa duplicación del Hero ya no participa en móvil; la nueva prueba comprueba explícitamente ambos estados.

La revisión independiente detectó una discrepancia entre «Descubrir la obra» y su nombre accesible. Se trató como corrección relevante para activación por voz/Label in Name: una regresión nueva falló primero y pasó con «Descubrir la obra: título», seguida de68Frontend, suite completa134, ambos builds y seis smokes. No cambia texto visible, rutas o imágenes.

Los smokes recorren Inicio→Explorar→Ficha→Volver, búsqueda/filtros/acentos/géneros, atrás/adelante, URL/restauración, estados/error/vacío/reintento/404/503 y fixtures extensos/vacíos/inválidos. Los fixtures son solo de prueba y no reemplazan llamadas reales de la aplicación. Los servidores propios se detuvieron al terminar; Docker, instalaciones y respaldos Windows no se tocaron.

## Capturas reales para aprobación estética

Son capturas nuevas de Chromium **Linux/cloud**, de la compilación V2 con API Express real; no mockups ni evidencia de Windows. Los SHA256 están en el manifiesto. Las comparaciones anteriores corresponden a capturas históricas de Inc5 sobre el código funcional conservado hasta2142e26.

| Vista |1440px |768px |390px |320px |
| --- | --- | --- | --- | --- |
| Inicio |[Ver](assets/editorial-lavanda/inicio-1440.png) |[Ver](assets/editorial-lavanda/inicio-768.png) |[Ver](assets/editorial-lavanda/inicio-390.png) |[Ver](assets/editorial-lavanda/inicio-320.png) |
| Explorar |[Ver](assets/editorial-lavanda/explorar-1440.png) |[Ver](assets/editorial-lavanda/explorar-768.png) |[Ver](assets/editorial-lavanda/explorar-390.png) |[Ver](assets/editorial-lavanda/explorar-320.png) |
| Detalle |[Ver](assets/editorial-lavanda/detalle-1440.png) |[Ver](assets/editorial-lavanda/detalle-768.png) |[Ver](assets/editorial-lavanda/detalle-390.png) |[Ver](assets/editorial-lavanda/detalle-320.png) |

[Búsqueda/filtros1440](assets/editorial-lavanda/filtros-1440.png) · [Búsqueda/filtros390](assets/editorial-lavanda/filtros-390.png).

Comparación de Inicio: [antes histórico](assets/frontend-v2-inc5/inicio-escritorio.png) → [después real](assets/editorial-lavanda/inicio-1440.png). Explorar: [antes histórico](assets/frontend-v2-inc5/explorar-escritorio.png) → [después real](assets/editorial-lavanda/explorar-1440.png). Detalle móvil: [antes histórico](assets/frontend-v2-inc4/despues/ficha-mobile.png) → [después real](assets/editorial-lavanda/detalle-390.png).

## Archivos y continuidad

Cambios funcionales acotados a `Frontend/src/catalog/`: HomePage/Hero/CatalogApp, tokens y CSS base/Home/responsive, color del logo mediante token en components. Pruebas: nueva EditorialPresentation, actualización de dos nombres accesibles de atajos en HomePage, nuevo smoke editorial y ajuste de portadas visibles en smoke de ficha. Sin cambios al cliente HTTP, rutas o datos. Spec/plan describen decisiones; esta nota/evidencia/capturas, bitácora00, especificación31, guía32, estado, alineación, índice y README mantienen continuidad.

Commits previos al cierre documental: `65410d7` alcance/plan, `46a53ea` composición con TDD, `03d95db` tema y responsive, `47e8ae3` corrección accesible verificada. El cierre y bundle posteriores se identifican por historial y manifiesto externo para evitar autorreferencia circular. Tras el commit de cierre se genera un bundle completo en destino cloud nuevo, con verify, restauración real, fsck y comparación de archivos/historial; los respaldos anteriores se conservan.

**Retomar sin repetir:** leer esta nota, estado y bitácora, comprobar rama/HEAD/status y commits existentes; continuar solo desde tareas pendientes. La petición del usuario de continuar sin decir «sigue» conserva autorización dentro de este alcance. Un límite de créditos puede detener la sesión y no existe capacidad aquí de programar su reactivación automática tras cinco horas.

**Pendientes:** aprobación visual humana, Figma, Windows/Docker Desktop/D:, PostgreSQL nativo del usuario, dispositivos físicos/otros navegadores/lectores de pantalla/WCAG integral y zoom de navegador200%. Catálogo sin persistencia; favicon404 conocido y respuesta503 saneada ante porcentaje inválido en API de detalle son antecedentes, no funciones nuevas. La validación operativa Windows sigue como limitación aceptada previamente.

**Parada:** entregar capturas y rama local para revisión visual. No abrir/publicar/fusionar PR ni añadir funcionalidades hasta nueva instrucción; esta entrega no cierra Issue #1 ni Sprint1.
