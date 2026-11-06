# YitVerse — adaptación editorial lavanda

## Intención y autorización
Solicitud del usuario «Rediseño visual del Frontend según referencia», seguida de ZIP Practicas-main.zip y confirmación «sí» para usarlo solo como referencia visual sobre el YitVerse existente. Se autoriza implementar por incrementos y entregar capturas para revisión estética antes de PR. Esta nota concreta ese alcance; no acredita mockups Figma ni aprobación estética del resultado.

## Comparación y enfoque
Base integration/frontend-v2-main/2142e26: Hero dividido con portada vertical, paleta azul/cian, géneros abajo, 3+2 tarjetas complementarias y footer simple. ZIP: ciruela/lavanda, Hero escénico ancho, tira de géneros, seis portadas y paneles editoriales compactos/CTA. Se adapta la composición con componentes existentes. Un cambio solo de color no cumpliría la jerarquía solicitada; sustituir el proyecto por el ZIP perdería API/arquitectura y añadiría módulos no autorizados. El usuario confirmó adaptar, preservando seis obras/ilustraciones/API/PostgreSQL.

## Diseño concreto del implementador
- Tema: fondo #101017; superficies #191923/#20202c; texto #f4f3f8; secundario #b0aabe; detalle #c0a4ff y foco #d5c2ff. Botón violeta profundo #7545d0 para contraste AA con blanco; aliases de tokens existentes evitan tocar componentes técnicos S01.
- Header: marca propia, Inicio/Explorar/Estado y acceso accesible al único formulario de búsqueda. Franja de demostración compacta. Sin biblioteca/cuentas ni botones inactivos.
- Hero: escena panorámica NightArtwork original existente, atmósfera violeta con CSS y degradado oscuro, título/sinopsis/formato/géneros reales de primera obra API; portada SVG original y enlaces reales a ficha/Explorar. Sin carrusel, ratings, capítulos ni fechas. Arte fuente y paletas de las seis portadas intactos.
- Orden Inicio: Hero → barra de géneros → búsqueda/filtro existentes → Historias destacadas con todos los registros recibidos (seis en catálogo actual) → dos paneles compactos Continuar explorando/Selección de demostración → CTA final hacia Explorar. Los paneles reutilizan grupos existentes de 3/2 como atajos textuales, sin duplicar portadas ni afirmar personalización.
- Destacadas: orden API, sin ranking. Géneros: únicos/no vacíos de API, enlazan a q de búsqueda actual; no se inventa filtro exacto. Secciones sin registros se omiten, fallos/vacíos no muestran contenido ficticio de respaldo.
- Cards verticales3:4 conservan WorkCover/CoverArtwork; mismo detalle y datos. Explorar y Detalle comparten el nuevo tema, tipografía, bordes, espaciado y acciones.
- Desktop6 columnas; tablet3; móvil2, con objetivos táctiles≥44px, wrap y sin overflow. Géneros en fila desplazable localmente mediante teclado en móvil; no desbordamiento del documento. Breakpoints existentes1199/800/599/359 centralizados. Foco visible, contraste y reduced-motion.

## Límites vinculantes
React/Vite/Express/API y contratos conservados. No dependencias nuevas, importaciones de imágenes/código/SQLite del ZIP, cambios Backend/Database/Docker, contenidos nuevos, lector, biblioteca, favoritos persistentes, cuentas, compras, XP o monedas. Mantener /,/explorar,/obras/:id,/estado,404,URL antiguas q/format, replaceState, historial, cancelación, timeout/reintento, datos sintéticos y SVG originales. Windows/backups intocables, no main/merges/push/PR durante esta entrega. Capturas finales reales de Chromium Linux/cloud, sin atribuir Windows.

## Aceptación
Suites existentes Backend/Frontend/guardas/helperconsola, regresiones nuevas TDD para metadatos del Hero, seis destacadas, orden de géneros, enlaces reales y fallback. Ambos builds. Smokes existentes dev y preview a320/390/768/1440, consola, filtros/retorno/historial/recargas/estados, fixtures y reduced-motion; añadir comprobaciones de nueva composición. Capturas Inicio/Explorar/Detalle y comparación histórica identificada. No ejecutar pruebas Docker en este rediseño. Documentar resultados efectivos, commits y bundle recuperable; detenerse para aprobación visual.
