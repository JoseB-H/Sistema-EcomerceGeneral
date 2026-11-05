# YitVerse — prototipo local de catálogo y detalle

La solicitud del usuario autoriza HU-001/HU-002 como prototipo con datos sintéticos, ejecución nativa Windows y PostgreSQL conservado como tecnología. Base: `feat/s01-infraestructura-docker` en `e672e2e`; nueva rama `feat/local-dev-catalogo`. No se modifica main ni el PR #3 y no se ejecuta Docker.

## Enfoque y alternativas

Se elige servir el catálogo desde Express mediante un repositorio de demostración inyectado, consumido por React mediante `/api`. Importar datos directamente en React simplificaría el arranque pero eludiría la arquitectura Frontend → Backend; por eso se descarta. PostgreSQL no se reemplaza ni se simula: sin credenciales el catálogo de solo lectura funciona, pero salud devuelve 503. Con PostgreSQL configurado, salud ejecuta el SQL real de S01; el catálogo sigue siendo sintético y sin persistencia hasta implementar un adaptador autorizado.

## Alcance observable

- Explorar seis obras completamente ficticias, buscar por título/sinopsis y filtrar Manga/Manhwa. Ficha con título, formato, géneros y sinopsis. Sin autores/editoriales reales, ratings, precios, disponibilidad comercial ni capítulos.
- Identificación visible de datos sintéticos en catálogo y ficha; gráficos abstractos propios hechos con CSS, sin imágenes externas ni portadas protegidas.
- Estados de carga, error con reintento, vacío y obra inexistente. Enlaces nativos a `/`, `/obras/:id` y `/estado`; funcionan navegación atrás, URL directa y teclado. Búsqueda/filtro se conservan en la URL y al volver del detalle.
- Diseño adaptable a móvil/escritorio: cabecera compacta, buscador etiquetado, tarjetas reutilizables, ficha legible y mensajes accesibles.
- Vite en `localhost:5173`, `strictPort`, proxy `/api` a `127.0.0.1:3000`. Backend nativo escucha solo en loopback; script Node portátil para Windows, sin sintaxis de variables Bash.

## Compatibilidad con S01

Se conserva `server.js`, la configuración estricta de S01, el endpoint de salud y sus pruebas. `createApp` acepta un repositorio opcional para montar el catálogo. El nuevo `dev-server.js` permite arrancar sin DB y usa el pool real solo cuando hay credenciales completas. No modifica ni consume el `.env` raíz de Compose: el opcional de desarrollo es `Backend/.env`.

El modo Vite `prototype`/servidor de desarrollo muestra el catálogo; `npm run build` conserva la pantalla S01 y `npm run build:local` genera el prototipo. Así los artefactos Docker existentes y su pantalla no se sustituyen por una UI que requiera un Backend distinto. Los archivos Docker y sus scripts se preservan; no se verifican mediante Docker en esta entrega.

## Contrato

`GET /api/works?q=<hasta 100 caracteres>&format=manga|manhwa`: HTTP 200 `{items:[{id,title,format,genres,synopsis}],source:{kind:"synthetic",persisted:false}}`. Parámetros inválidos/repetidos: 400 JSON; fallo del proveedor: 503 saneado. `GET /api/works/:id`: 200 `{item,source}`, 404 si no existe, 400 si el identificador es inválido. Solo lectura; no hay POST/PUT/DELETE ni escritura en disco/SQL.

El repositorio implementa `list({query,format})` y `findById(id)`, y declara `source`. Los datos viven únicamente en `Backend/src/catalog/demo-data.js`. Los adaptadores futuros mantendrán el contrato o documentarán su evolución; no se implementa ahora un repositorio PostgreSQL ni esquema comercial.

## Restricciones y aceptación

Autenticación, lectura digital, XP/YitCoins, compras, canjes y pagos fuera de alcance. La autorización actual limita el refinamiento anterior a un prototipo sintético: no afirma aceptación de todos los RF ni asigna un nuevo sprint. RNF aplicables: configuración/secretos, validación, derechos, usabilidad, adaptación, accesibilidad básica, mantenibilidad y pruebas.

La evidencia deberá incluir suites previas y nuevas, build S01 y local, peticiones a Express/Vite reales sin PostgreSQL (salud 503), navegador móvil/escritorio y ausencia de modificaciones Docker. Windows/D: no son accesibles desde cloud; se entregarán comandos PowerShell reproducibles y se distinguirá verificación Linux de verificación Windows.
