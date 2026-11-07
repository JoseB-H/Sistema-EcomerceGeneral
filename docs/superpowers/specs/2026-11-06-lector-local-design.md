# Capítulos autorizados y lector local — Incremento 1

Fecha de solicitud: 2026-11-06 (America/Bogota). Rama: `feat/lector-capitulos-local`, desde `feat/ui-editorial-lavanda` (`af2a6e5`).

## Autoridad y límites

La solicitud explícita del usuario autoriza este incremento de lectura y administración **local**, incluido Backend. Amplía las restricciones históricas que dejaban el lector pendiente, exclusivamente para material propio/autorizado. No aprueba publicación, PR, fusión, lectura de terceros, cuentas ni reglas comerciales. Se continúa la implementación sin otra aprobación intermedia, según la autorización de trabajo incremental vigente.

Se conservan React/Vite, Express, las seis obras, sus SVG originales, búsqueda, filtros, historial, rutas y diseño lavanda. Docker, PostgreSQL y Figma no cambian. No hay APIs externas, descarga de URL ni uploads HTTP.

## Diseño

- Almacén privado explícito (`YITVERSE_CONTENT_ROOT`), absoluto y fuera de **cualquier** checkout Git, del código y del directorio público del frontend. Sin variable: lista de capítulos vacía y honesta. Configuración inválida: error, nunca conexión o disponibilidad simulada.
- Manifiestos versionados y validados por capítulo; páginas normalizadas a PNG, hashes SHA-256 y comprobante privado. La API solo devuelve metadatos de lectura; no divulga origen, comprobante ni rutas del disco.
- CLI administrado: importar una imagen, directorio de imágenes o ZIP/CBZ. JPG/JPEG, PNG y WebP requieren coincidencia extensión/firma/decodificación real. Se rechazan animaciones y entradas no previstas. No se modifican originales.
- Nombres de página numéricos (`001.png`, `2.jpg`, `10.webp`), sin colisiones numéricas. Capítulos canónicos no negativos con hasta tres decimales; orden numérico y duplicados equivalentes rechazados.
- Límites explícitos de entrada, expansión, píxeles, páginas, salida y comprobantes. ZIP procesado sin extraer rutas al disco, con validación de cada entrada, CRC, cifrado, compresión, enlaces, tamaño y ratio.
- Marcador de propiedad del almacén, bloqueo exclusivo, staging en el mismo volumen y publicación por rename. Ningún capítulo previo se sobrescribe. Recuperación explícita de staging propio; desbloqueo solo con token y proceso local terminado. La administración local de confianza y las ACL de Windows siguen siendo responsabilidad operativa.
- API GET opcional solo en `dev-server.js`: capítulos, detalle de capítulo y página. Sin listado estático de carpetas; respuestas no-store/nosniff, Host local permitido, sin CORS abierto. S01 `server.js` conserva su comportamiento.
- Ruta nueva `/obras/:id/capitulos/:numero`, enlaces anterior/siguiente, selector numérico, retorno a ficha conservando filtros. Lista de capítulos en ficha, estados reales y reintento, imágenes responsive sin recorte. No se guarda historial personal ni progreso.
- Prueba reproducible con imágenes geométricas originales generadas por script, identificadas como demostración y guardadas fuera de Git. Los seis SVG del catálogo se conservan intactos.

## Aceptación y persistencia futura

Pruebas de importación, formatos, archivo hostil, orden, duplicados, privacidad, recuperación, rutas, navegación y fallos de imagen; regresión completa y ambos builds. Chromium en 320/390/768/1440 px con capturas reales de capítulos y lector. No se ejecuta Docker ni se declara PostgreSQL nativo disponible. Documentar copias offline coherentes del almacén y futura migración de metadatos a PostgreSQL con verificación de hashes y permisos, sin implementarla aquí.
