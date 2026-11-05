# YitVerse — identidad azul nocturna

Solicitud del usuario del 2026-11-04: preparar, implementar y publicar un rediseño visual sobre el catálogo local. Base `4794803`, rama `feat/ui-azul-nocturno`. La revisión/aceptación del resultado permanece pendiente; no implica aceptación del sprint ni cambios en PR #3.

## Intención y dirección

Una biblioteca editorial oscura, moderna e inmersiva que invite a descubrir historias, con identidad propia. La referencia Olympus devolvió `curl: (56) CONNECT tunnel failed, response 403` desde el proxy; no se afirma haber inspeccionado su interfaz. Se utiliza únicamente la organización descrita por el usuario: navegación, área destacada, exploración y jerarquía editorial. No se descarga ni copia código, textos, marcas o imágenes de terceros.

Alternativas consideradas: recolorear la UI actual es sencillo pero deja intacta su composición ligera; una pantalla con carrusel/animación dominante añade interacción y movimiento innecesarios. El implementador elige una composición editorial nocturna con hero ilustrado, tarjetas verticales y acciones existentes: ofrece el cambio visual solicitado sin cambiar el comportamiento del catálogo. La composición y el arte son decisiones de diseño revisables del implementador, no una aprobación visual adicional atribuida al usuario.

## Sistema visual

Tokens exactos solicitados: fondo `#0B1020`, superficie `#131D30`, azul `#2563EB`, cian `#38BDF8`, detalle `#60A5FA`, violeta `#8B5CF6`, texto `#F8FAFC`, secundario `#94A3B8`, bordes decorativos `#26364F`. Botones azules con texto claro; cian para texto/foco, nunca texto blanco pequeño sobre cian. Campos con contorno más claro que el borde decorativo para distinguirlos sobre superficie. Tipografía de sistema, jerarquía sans, sin recursos remotos.

- Header con símbolo vectorial YitVerse propio, navegación Explorar/Estado y acceso Buscar que lleva al único campo existente. En catálogo conserva query/format mediante fragmento; desde otras rutas apunta a `/#catalog-query`. Navegación móvil visible, sin menú ficticio.
- Hero con mensaje original sobre descubrir historias, CTA al buscador y paisaje nocturno vectorial propio. No se presenta ninguna obra como popular ni se inventan métricas.
- Catálogo con portadas 3:4, seis ilustraciones SVG originales diferenciadas por obra, título/formatos/géneros reales de la demo y enlaces existentes. Grid seis columnas en pantallas amplias, tres en tablet, dos en móvil y una en tamaños muy estrechos. Las seis obras y sus datos no cambian.
- Búsqueda única etiquetada, filtro visible y foco estable; conservar por completo handlers, URL y cancelación.
- Ficha con portada ampliada, sinopsis legible, géneros y regreso filtrado. Sin acciones de lectura, compra ni cuenta.
- Carga/error/vacío/404 con superficies oscuras, iconos decorativos y mensajes/acciones actuales. `/estado` también se tematiza dentro del contenedor local; el build técnico S01 mantiene sus estilos anteriores.
- Footer con identidad y enlaces reales al catálogo y estado.

## Calidad y límites

Enlaces/botones táctiles de al menos 44px cuando sean controles principales, foco cian visible, skiplink, etiquetas accesibles y avisos de procedencia intactos. SVG decorativos ocultos al lector y sin scripts ni referencias externas; IDs de gradientes únicos por instancia. Contraste de texto normal al menos 4.5:1 en las combinaciones verificadas, sin declarar certificación WCAG completa.

Transiciones discretas de color/sombra y movimiento mínimo de hover. Con `prefers-reduced-motion: reduce`, suprimir animaciones/transiciones y desplazamiento suave. No hay autoplay, parallax ni nuevas dependencias.

No tocar Backend, API, seis registros, hooks/cliente de datos, Vite/configuración, lockfiles, Database ni infraestructura Docker. Mantener `/`, `/obras/:id`, `/estado`, historial nativo, q/format, reintento y estados. PostgreSQL ausente continúa devolviendo 503; ninguna persistencia nueva. No se implementan módulos comerciales. Entorno cloud aislado, sin acceso al disco D: ni prueba Windows acreditada.

## Evidencia prevista

Suites Backend y Frontend completas; builds local y técnico. Chromium 1440×1000, 768×1024, 390×844 y 320px: catálogo/ficha, teclado, acceso a búsqueda, filtros, atrás/regreso, vacío/error/reintento/404, estado técnico oscuro, proporción de portadas, contraste y movimiento reducido. Revisión independiente final, documentación y rama publicada, sin fusión.
