# Lector vertical e importación local de capítulos — Incremento 1

Fecha: 2026-11-06 America/Bogota; ejecución cloud durante 2026-11-07 UTC. Rama **`feat/lector-capitulos-local`**, creada desde lavanda `af2a6e50a20df6beeffdf7038a1759a7923d1a0e`. Solo entrega local para revisión; **sin push, PR ni merge**. Diseño lavanda y Figma siguen pendientes de aprobación estética. No se accedió a discos ni respaldos Windows.

## Alcance implementado

Lista numérica de capítulos en la ficha, lectura desde el primero disponible, ruta `/obras/:id/capitulos/:numero`, selector, anterior/siguiente, límites primero/último, imágenes verticales sin recorte y reintento de página. Se preservan seis obras/SVG, Inicio, Explorar, búsqueda, formato, filtros en URL, historial, `/estado`, 404 y catálogo desde API real.

CLI administrado para imágenes JPG/JPEG, PNG, WebP, directorios o ZIP/CBZ; no HTTP de escritura, descargas, scraping ni APIs editoriales. Material propio/autorizado con declaración, fuente y comprobante privado obligatorio. El código verifica presencia, integridad y formato del comprobante como archivo; **no determina jurídicamente su validez**. El administrador debe comprobar derechos y alcance de publicación antes de importar. Un texto inventado no acredita derechos de terceros.

No hay progreso personal, cuentas, biblioteca, favoritos, XP, monedas, compras, nuevos títulos ni publicación de contenido real. Este incremento no acepta el Sprint 1 ni cierra Issue #1.

## Arquitectura y archivos

```text
Backend/src/reader/
  validation.js    números, límites y esquema de manifiestos
  files.js         rutas locales, enlaces, lecturas acotadas y hashes
  images.js        firma + decodificación real y normalización PNG
  archive.js       ZIP/CBZ sin extracción de rutas al disco
  store.js         propiedad, bloqueo, integridad y publicación atómica
  importer.js      importación, status y recuperación
  repository.js    consultas de capítulos y páginas privadas
  router.js        API de solo lectura local
Backend/scripts/import-chapter.mjs
Backend/scripts/generate-reader-demo.mjs
Frontend/src/reader/{reader-client.js,ChapterList.jsx,ReaderPage.jsx,reader.css}
```

Inyección opcional en `app.js`, activación exclusivamente en `dev-server.js`. `server.js`, Database, Dockerfiles y Compose no cambian. Las dependencias de Backend ahora incluyen `sharp@0.35.5` (Apache-2.0) y `yauzl@3.4.0` (MIT), fijadas en lockfile; sin nuevos paquetes Frontend ni servicios pagos. Un futuro build Docker instalará estas dependencias de Backend, pero **no habilitará** el lector: Docker sigue con el arranque S01. Su build operativo no se probó en esta entrega.

```text
YITVERSE_CONTENT_ROOT/                # fuera de cualquier checkout Git
  .yitverse-reader-store.json         # identidad del almacén
  .import.lock                       # solo mientras opera el administrador
  .staging/<uuid>/                    # transacciones no publicadas
  chapters/<obra>/<numero>/
    transaction.json
    authorization.bin                # copia privada, nunca servida
    manifest.json                    # procedencia, prueba y hashes privados
    READY
    0001.png, 0002.png, ...           # nombres generados, nunca rutas del ZIP
```

No existe un índice mutable: los capítulos son directorios inmutables, ordenados por número. No se cambia un capítulo importado ni se sobrescribe un destino existente, aunque esté vacío. El almacén no se adopta sobre una carpeta ajena con datos; requiere carpeta nueva/vacía o marcador propio válido. `.gitignore` es una defensa adicional, no el mecanismo principal de privacidad. Los originales y comprobantes de entrada también deben mantenerse fuera de Git.

## API de desarrollo

| Método y ruta | Resultado |
| --- | --- |
| `GET /api/works/:id/chapters` | Obra, lista numérica, fuente `local-manifest` y `configured` |
| `GET /api/works/:id/chapters/:numero` | Capítulo, dimensiones/índices de páginas, vecinos reales y lista para selector |
| `GET /api/works/:id/chapters/:numero/pages/:indice` | PNG validado, sin exponer rutas locales |

GET/HEAD únicamente; otros métodos reciben 405. Sin CORS abierto. Host local permitido (`localhost`, `127.0.0.1`, `[::1]`, puerto opcional); medida contra DNS rebinding, **no autenticación**. No abrir este backend al exterior ni añadir túneles o publicaciones de puerto. El contenido disponible se puede leer por cualquier proceso/usuario con acceso al servidor local; no es un sistema de licencias/DRM ni administración multiusuario.

Las respuestas, incluidos errores y HEAD, usan `Cache-Control: no-store`, `nosniff`, y política de recurso same-origin. La API nunca devuelve comprobantes, descripción de fuente, nombres de origen, rutas absolutas ni identificadores privados. No se usa `express.static` sobre el almacén. Sin variable de contenido: lista vacía honesta; carpeta inválida/corrupta: 503 `reader_unavailable`, conservando catálogo. Capítulo/página inexistente: 404. El contrato `synthetic/persisted:false` del catálogo permanece separado e intacto.

## Validación y límites

| Elemento | Límite/restricción |
| --- | --- |
| Número de capítulo | 0 a 999999.999; hasta tres decimales; `01.0` equivale a `1` y se rechaza como duplicado |
| Nombres de origen | Solo base numérica de 1–6 dígitos: `001.png`, `2.jpg`, `10.webp`; colisiones `1`/`01` rechazadas |
| Entrada por imagen | 20 MiB, JPG/JPEG/PNG/WebP con extensión, firma y decodificador coincidentes |
| Dimensiones | Hasta 40 millones de píxeles, ancho ≤16000 y alto ≤40000; sin animaciones/múltiples imágenes |
| Capítulo | Hasta 200 páginas y 200 MiB de entrada expandida |
| ZIP/CBZ | Hasta 100 MiB de archivo, 250 entradas incluyendo carpetas, ratio de expansión ≤100 |
| Salida normalizada | Hasta 512 MiB por capítulo, procesamiento secuencial, timeout de decodificación de 15 s por imagen |
| Comprobante/manifiesto | 2 MiB/256 KiB respectivamente |

ZIP acepta stored/deflate sin cifrar, cabeceras coherentes, CRC y tamaños verificados. Rechaza traversal, rutas absolutas/drive/backslash, enlaces/archivos especiales, entradas extrañas, duplicados numéricos, compresión no soportada y expansión excesiva. No pretende aceptar todas las extensiones de ZIP: ZIP64/cabeceras o nombres ambiguos pueden rechazarse conservadoramente. Preparar una **copia** de las imágenes con nombres numéricos; no renombrar ni modificar los originales. No se permiten URL de entrada ni rutas de red/UNC.

Las imágenes se decodifican y reexportan como PNG sin metadatos, nunca como SVG/HTML suministrado. Los límites reducen la exposición y el consumo; no constituyen un sandbox contra vulnerabilidades futuras del decodificador. CLI local de confianza, no servicio de archivos no confiables a escala. El pico de RAM depende de píxeles/decodificador: no cargar capítulos simultáneamente ni asumir operación con RAM mínima.

## Importación segura y recuperación

1. Verificar obra existente, número, declaración y comprobante antes de importar.
2. Abrir el almacén propio y adquirir bloqueo exclusivo con token/host/PID/identidad.
3. Crear transacción UUID en `.staging`, copiar comprobante y generar PNG con nombres propios. No tocar los originales.
4. Validar manifiesto, hashes, derechos y páginas; escribir READY.
5. Renombrar el directorio completo dentro del mismo volumen a un destino ausente. Sin copia alternativa ante EXDEV. Solo entonces aparece en la API.

Las excepciones ordinarias liberan el bloqueo propio y conservan staging. Un corte abrupto puede dejar bloqueo y staging. No se limpia por antigüedad ni se borra contenido automáticamente.

```powershell
# Desde Backend; sustituir rutas y UUID/token con los obtenidos localmente.
npm.cmd run reader:import -- status --root 'D:\YitVerse-Privado\lector'
npm.cmd run reader:import -- unlock --root 'D:\YitVerse-Privado\lector' --token '<token-exacto>'
npm.cmd run reader:import -- recover --root 'D:\YitVerse-Privado\lector' --transaction '<uuid>' --action finish
# Solo si se decide descartar ESA transacción propia; no elimina capítulos publicados:
npm.cmd run reader:import -- recover --root 'D:\YitVerse-Privado\lector' --transaction '<uuid>' --action discard
```

`unlock` exige token/almacén/host coincidentes y proceso local terminado; si el PID está vivo/reutilizado o el host difiere, se rechaza. Conserva archivo de bloqueo obsoleto y permite reintentar su archivado idéntico tras interrupción. `finish` revalida todos los bytes y rechaza duplicados. `discard` solo opera en staging con identidad propia verificable.

Un corte antes/durante `transaction.json` puede dejar staging **unverified**. `status` lo muestra sin ocultar transacciones sanas; no se termina ni borra automáticamente. Conservar carpeta, hacer copia offline y revisar manualmente antes de cualquier eliminación; los originales permiten una nueva importación. Un bloqueo con metadatos truncados tampoco se fuerza a desbloquear. Restaurar una copia coherente o reimportar los originales en un almacén nuevo preservando el anterior para diagnóstico. No garantiza durabilidad frente a fallo de alimentación/disco; rename cubre visibilidad atómica local y cortes de proceso, no reemplaza backups.

Se rechazan enlaces simbólicos/junctions, se comprueban ancestros y archivos regulares con lectura acotada y `O_NOFOLLOW` donde existe. Esto no protege contra un administrador malicioso que modifique el filesystem simultáneamente. Permisos POSIX privados se solicitan; en Windows **chmod no configura ACL**: restringir lectura/escritura al usuario administrador y al proceso local mediante permisos NTFS. Windows y sus interrupciones/antivirus no se han validado aquí.

## Ejecutar en Windows (instrucciones; no ejecutadas desde cloud)

Usar una clonación limpia en la nueva rama. Conservar `D:\Proyectos\YitVerse\YitVerse-Desarrollo`, `C:\Users\Yitetsu\YitVerse-Respaldo-Seguro`, `D:\node_modules` e instalaciones anteriores. No sobrescribir respaldos ni usar reset/clean/force push.

En una terminal PowerShell:

```powershell
Set-Location 'D:\Proyectos\YitVerse\YitVerse-V2-Prueba'
# Solo PATH de esta terminal y sus procesos; sin cambios permanentes.
$nodeDir = 'C:\Users\Yitetsu\Tools\node-v24.18.0-win-x64'
$env:Path = "$nodeDir;$env:Path"
& "$nodeDir\node.exe" --version
& "$nodeDir\npm.cmd" --version
& "$nodeDir\npm.cmd" ci --prefix .\Backend
& "$nodeDir\npm.cmd" ci --prefix .\Frontend
Set-Location .\Backend
# Elegir salida NUEVA. No repetir sobre la misma carpeta ni el mismo número importado.
npm.cmd run reader:demo -- --output 'D:\YitVerse-Privado\demo-original-01' --root 'D:\YitVerse-Privado\lector'
$env:YITVERSE_CONTENT_ROOT = 'D:\YitVerse-Privado\lector'
npm.cmd run dev
```

En otra terminal, aplicar el mismo PATH temporal, entrar en `Frontend` y ejecutar `npm.cmd run dev`. Abrir `http://localhost:5173/obras/orbita-de-papel`, o directamente `/obras/orbita-de-papel/capitulos/1`. No hace falta copiar `.env` de Docker ni instalar PostgreSQL para este modo. Si una descarga está prohibida por la red, registrar el error y detener esa instalación; no cambiar TLS, credenciales o permisos para eludirlo.

Importación real administrada (solo material cuya autorización se comprobó):

```powershell
npm.cmd run reader:import -- import --root 'D:\YitVerse-Privado\lector' --work orbita-de-papel --number 3 --title 'Capítulo autorizado' --input 'D:\YitVerse-Privado\entradas\capitulo-3.cbz' --rights authorized --source 'Referencia privada del titular y permiso' --authorization 'D:\YitVerse-Privado\permisos\comprobante.txt'
```

`--rights own` declara autoría propia; `authorized` declara permiso expreso. Los argumentos pueden contener referencias privadas: ejecutar en una terminal propia y no compartir historial/capturas. Mantener también fuente/comprobante originales fuera de Git. El CLI no imprime argumentos, rutas o stacks en errores; solo validaciones controladas.

Sin PostgreSQL configurado, `/api/health` continúa devolviendo **503**; catálogo sintético y lector local pueden funcionar. No hay disponibilidad de PostgreSQL simulada. Tras reiniciar Backend con el mismo root se leen los mismos manifiestos. `npm run build` conserva pantalla técnica S01; `npm run build:local` incluye catálogo/lector. Para preview local: `npm exec vite -- preview --host localhost --port 4173 --strictPort`; su fallback SPA y proxy se verifican sin cambiar Nginx/Docker. No se afirma despliegue externo del lector.

## Copias y migración futura

Detener importaciones y Backend propio, comprobar ausencia de bloqueo/transacciones pendientes y copiar **todo** el almacén, incluidos marcador, manifiestos, PNG y comprobantes. Respaldar por separado los originales. Usar destino privado nuevo, acceso restringido/cifrado, nunca Git ni carpetas públicas; comprobar hashes/lectura tras restaurar en una carpeta externa nueva. No combinar almacenes con distintos storeId ni modificar manifiestos a mano. Probar restauración antes de retirar una copia anterior. La política de retención/consentimiento de documentos legales reales requiere definición antes de uso operativo.

PostgreSQL sigue siendo la tecnología prevista: futura migración de obras/capítulos/páginas/procedencia, restricción única `(work_id, chapter_number)`, orden decimal exacto y publicación transaccional. Planear almacenamiento privado de imágenes/comprobantes y políticas de acceso, migrar con verificación de hashes y copia completa reversible. No se implementa esquema ni se afirma PostgreSQL nativo operativo.

## Evidencias de esta entrega

Pruebas y revisión final se registran en la bitácora/estado y en `docs/assets/lector-local/verificacion.json`. Las capturas contienen exclusivamente la demostración original, nunca comprobantes ni rutas privadas. Se prueban tres capítulos `1,2,10` de Órbita de papel, tres páginas cada uno; los saltos son deliberados para probar números y **no** anuncian capítulos de una serie comercial.

| Capturas reales | Escritorio | Tablet | Móvil | Mínimo |
| --- | --- | --- | --- | --- |
| Ficha y capítulos | [1440](assets/lector-local/capitulos-1440.png) | [768](assets/lector-local/capitulos-768.png) | [390](assets/lector-local/capitulos-390.png) | [320](assets/lector-local/capitulos-320.png) |
| Lector vertical | [1440](assets/lector-local/lector-1440.png) | [768](assets/lector-local/lector-768.png) | [390](assets/lector-local/lector-390.png) | [320](assets/lector-local/lector-320.png) |

Pendiente: revisión humana, Windows/ACL/NTFS, PostgreSQL nativo, Docker operativo, Firefox/WebKit, dispositivos físicos y auditoría integral WCAG/lector de pantalla. Los alt de página identifican secuencia/obra; **no sustituyen una transcripción del contenido visual**, pendiente antes de afirmar lectura accesible integral. No se iniciará otro incremento ni se publicará esta rama sin autorización.
