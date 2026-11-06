---
tags: [yitverse, diseno, figma, v2, interfaz]
tipo: especificacion-visual
estado: inicio-explorar-inc3-local-en-revision
actualizado: 2026-11-06
---
# YitVerse — Dirección visual V2

> [!info] Punto de continuidad
> El usuario aceptó Incremento2 `fba88e3` y autorizó **exclusivamente Incremento3: Inicio y Explorar** en `feat/frontend-v2-editorial`. Separación implementada y verificada localmente; sin publicación. Incremento4 requiere nueva aprobación. Infraestructura y Figma mantienen su estado anterior.

## Identidad visual de la iteración

- **Marca/proyecto:** YitVerse — plataforma de exploración y lectura de manga/manhwa, biblioteca personal y tienda de coleccionables, con XP y YitCoins contemplados en la visión.
- **Referencia de estilo:** experiencia editorial contemporánea, de alto impacto, inspirada en el tipo de jerarquía visual y tratamiento de contenido que el usuario describió como «Olympus»; no reproducir imágenes, marca ni elementos protegidos de sitios ajenos.
- **Paleta de dirección:** negro profundo, azul eléctrico, superficies oscuras y texto de alto contraste.
- **Jerarquía:** un Hero protagonista, títulos fuertes, espacio negativo, tarjetas editoriales y portadas narrativas detalladas.
- **Portadas:** buscar ilustración con personalidad y narrativa visual; evitar miniaturas meramente geométricas. Las imágenes de prueba deben ser originales o autorizadas.
- **Gamificación:** parte de la visión futura; XP/YitCoins no se implementan ni se presentan como funciones disponibles en este plan.
- **Dispositivos:** composición desktop y adaptación móvil desde el diseño.
- **Alcance de ejecución actual:** Inicio editorial y Explorar dedicado, con tokens/componentes de Incremento2. API, Backend, Database, Docker y seis SVG originales sin cambios. No autoriza Incremento4 ni módulos comerciales.

## Vistas incluidas en el encargo V2

| Vista | Qué debe comunicar | Estado |
| --- | --- | --- |
| 01. Inicio / Home | Hero editorial, continuar explorando no personalizado, Selección de demostración y categorías existentes | Implementado en `/` con API real; revisión del Incremento3 pendiente |
| 02. Explorar catálogo | Búsqueda, filtros discretos, retícula de portadas y resultados | Implementado en `/explorar`; filtros y URLs antiguas conservados |
| 03. Detalle de obra | Portada principal, sinopsis, etiquetas y regreso; sin Leer/Seguir en este plan | Tema actual actualizado; evolución narrativa de Incremento4 pendiente |
| 04. Home móvil | Navegación compacta, hero adaptado y tarjetas legibles | Inicio/Explorar verificados en390/320px; sin navegación comercial ficticia |
| 05. Guía visual | Colores, tipografías, botones, tarjetas, espacios y estados | Guía Markdown/tokens implementados en Incremento2; Figma pendiente |

### Referencia central de Figma
- **Archivo Figma creado:** [YitVerse — Dirección Visual V2 · Editorial Dark](https://www.figma.com/design/dCLgExm48T9Ui6sTcEIhwu)
- **Fecha:** 2026-11-05.
- **Nivel de evidencia:** el archivo existe; no considerar una pantalla terminada hasta verificar su contenido real en Figma. El estado debe actualizarse tras la construcción y revisión.

## Tratamiento de contenido
La V2 puede utilizar títulos, frases y portadas **ficticias** para ilustrar la interfaz. No confundir datos de prueba con catálogo comercial real, licencias o permisos de lectura. No asignar XP, YitCoins o precios como reglas aprobadas.

## Acuerdo vigente y siguiente paso
1. Revisar el resultado del Incremento3, desde `fba88e3`, y sus capturas/commit/bundle locales.
2. Esperar autorización expresa del usuario antes del Incremento4. No se inicia por haber aprobado el plan general.
3. Usar la especificación Markdown provisional y el [plan aprobado](superpowers/plans/2026-11-05-frontend-v2-editorial.md) como base de los incrementos autorizados. La antigua secuencia que pedía cerrar primero cinco vistas Figma queda como antecedente; no implica que se hayan creado o aprobado.
4. Mantener Figma como referencia pendiente y aceptación visual del usuario separada de pruebas técnicas. No cambiar fuente de catálogo ni activar lector/seguimiento/XP/tienda por figurar en una vista.

## Decisiones del plan aprobado y estado de implementación

- Inicio en `/` y Explorar en `/explorar` implementados en Incremento3. Los enlaces antiguos `/?q=…`/`/?format=…` siguen abriendo catálogo; los enlaces nuevos y retornos de ficha usan `/explorar` con sus filtros. Detalle, estado y404 conservados.
- Selección de demostración sin cronología inventada; continuar explorando no personalizado, ambos implementados. Se respeta el orden recibido: primer registro al Hero, tres siguientes a Continuar y restantes a Selección; se omiten secciones sin registros. Categorías únicas desde `genres` mediante búsquedas `q`, sin filtro exacto nuevo ni endpoint nuevo. No hay ranking ni curación comercial afirmada.
- Negro/azul y tokens tipográficos/espaciado implementados en Incremento2, como sistema visual del prototipo; no diseño Figma terminado. Las seis ilustraciones originales se conservan. El arte más narrativo del Incremento4 todavía no se realiza.
- Sin botones Leer/Seguir ni módulos comerciales hasta aprobación funcional y técnica correspondiente.

## Registro del Incremento1 — 2026-11-05

**Rama:** `feat/frontend-v2-editorial`, local, sin publicación/PR. **Archivos:** bitácora, especificación31, estado, alineación, índice, README, guía local, recuperación Git y plan aprobado. **Terminado:** incorporación/reconciliación documental y delimitación de ejecución; ningún cambio visual o de rutas. **Pruebas:** 45/45 Backend y 35/35 Frontend aprobadas, ambos builds salida0; integridad/diff documental/enlaces correctos. Sin nuevas pruebas Windows/Docker/Chromium en este incremento documental. **Pendiente:** Windows/respaldo local y revisión del usuario. **Siguiente tarea:** autorizar Incremento2 tras esta revisión.

## Enlaces
- [[00-BITACORA-DE-CONTINUIDAD|Bitácora de continuidad]]
- [[21-EXPERIENCIA-USUARIO|Experiencia de usuario v0.1]]
- [[20-VISION-FUNCIONAL-YITVERSE|Visión funcional]]
- [[24-PRODUCT-BACKLOG-SCRUM|Product Backlog]]

## Registro del Incremento2 — 2026-11-05

**Rama:** `feat/frontend-v2-editorial`, base `daf3c85`, local/sin push ni PR. **Archivos:** CSS tokens/base/responsive, imports, smoke, guía32/reporte/capturas y documentos de continuidad/técnicos. **Implementado:** sistema visual central negro/azul, jerarquía/legibilidad, medidas/radios/sombras, foco y adaptaciones en las vistas existentes. **Pruebas:** 45 Backend/35 Frontend, ambos builds, identidad de S01 por huellas, Chromium en1440/768/390/320 y comparativas reales aprobados. **Conservado:** SVG, rutas, API, lógica y servicios. **Pendiente:** revisión humana, Figma/Windows y auditoría AA completa. **Siguiente tarea:** revisión del Incremento2 y autorización del Incremento3.

[Guía visual implementada](32-GUIA-VISUAL-FRONTEND-V2.md) · [Pruebas y comparativas](FRONTEND-V2-INCREMENTO-2-PRUEBAS.md).

## Frontend V2 — Incremento3, 2026-11-06 UTC

**Rama/base:** `feat/frontend-v2-editorial` desde `fba88e3`, aceptado por el usuario. **Terminado:** Inicio `/` y Explorar `/explorar` separados con API existente; Hero, Continuar explorando no personalizado, Selección de demostración y géneros reales. Rutas antiguas con q/format compatibles; ficha/estado/404, retorno filtrado e historial conservados. Seis SVG originales y Backend/Database/Docker/dependencias sin cambios.

**Archivos:** HomePage/Hero/HomePage.css, home-sections/catalog-navigation; CatalogApp/CatalogPage/WorkDetailPage/components y CSS base/responsive; tres suites nuevas, CatalogApp tests y smoke; continuidad00/31/32/estado/alineación, guía local/diseño04/trazabilidad28/índice/README/plan, reporte y capturas. Lista completa en [reporte](FRONTEND-V2-INCREMENTO-3-PRUEBAS.md).

**Pruebas:**45 Backend y45 Frontend (35 anteriores +10), ambos builds, smoke Chromium dev y build local/preview1440/768/390/320 aprobados; sin overflow ni errores JS. Recarga SPA directa, historial, búsqueda/acentos/formato/géneros, teclado/foco, reduced-motion y estados/reintento verificados. Salud503 real sin PostgreSQL. Revisión independiente sin Critical/Important; jerarquía h3 de tarjetas en Inicio corregida con regresión. Capturas/mediciones en el reporte.

**Commit:** `feat(frontend): add V2 home and dedicated explore view` (hash de entrega en el cierre/manifiesto externo; identificable con `git log -1 --format="%H %s"`). **Respaldo:** Inc2 verificado/conservado; nuevo bundle tras commit con verificación y clon restaurado registrados externamente. **Límites:** Windows/PG nativo/Docker/producción/lector de pantalla/WCAG integral/Figma no acreditados. Rama aún local, sin push/PR/fusión. **Siguiente tarea:** revisión del Incremento3; no iniciar Incremento4 sin nueva aprobación.
