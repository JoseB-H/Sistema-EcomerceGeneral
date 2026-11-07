# Desarrollo local temporal — catálogo y detalle

**Ampliación autorizada 2026-11-06:** la rama nueva `feat/lector-capitulos-local` añade capítulos/lector y CLI privado desde lavanda `af2a6e5`, conservando este modo de ejecución y los seis registros. [Guía36: Windows, importación, almacenamiento, recuperación y límites](36-LECTOR-CAPITULOS-LOCALES.md). Docker y PostgreSQL no cambian; `/api/health` sigue informando 503 sin base nativa configurada. Las restricciones anteriores contra lectura describen el alcance histórico del catálogo; únicamente el lector local ahora autorizado las amplía, sin progreso ni oferta real.

**Modalidad autorizada:** HU-001/HU-002 en `feat/local-dev-catalogo`, desde `feat/s01-infraestructura-docker` (`e672e2e`). Docker está pausado para este incremento; se conserva el laboratorio S01 y no se modifica ni fusiona `main` o el PR #3. [Diseño](superpowers/specs/2026-11-04-local-dev-catalogo-design.md), [plan](superpowers/plans/2026-11-04-local-dev-catalogo.md) y [pruebas](LOCAL-DEV-CATALOGO-PRUEBAS.md).

En `feat/frontend-v2-editorial`, Incrementos1–4 aceptados técnicamente e **Incremento5 verificado para revisión de integración**. La rama ya está publicada en GitHub, inicialmente7caff17; el cierre se publica en la misma rama. Incluye Inicio/Explorar/ficha, arte propio, API y estados. [Entrega33, pruebas y capturas](33-ENTREGA-FRONTEND-V2.md). Docker/PG S01 se revalidaron aisladamente, sin cambiar el modo nativo ni convertir el catálogo en persistente.

## Requisitos y copia de trabajo segura

Git y Node.js **24 LTS** con npm. Dependencias gratuitas, sin servicios externos obligatorios. No instalar Docker ni PostgreSQL para probar el catálogo sintético; PostgreSQL sigue previsto para persistencia.

Antes de clonar o ejecutar en Windows, leer [recuperación segura de Git](RECUPERACION-GIT-WINDOWS.md): conservar la carpeta de desarrollo original y el respaldo existente, verificar los cambios locales en otro destino nuevo y clonar en una ruta que no exista. No reparar objetos ni sobrescribir carpetas. La copia de seguridad Windows permanece sin verificación desde cloud.

Ruta nueva propuesta: `D:\Proyectos\YitVerse\YitVerse-Frontend-V2-Limpio`, solo si está libre. No usar `D:\Proyectos\YitVerse\YitVerse-Desarrollo` para ejecutar estos comandos. La guía de recuperación contiene la clonación y controles de integridad de `feat/frontend-v2-editorial`, ya publicada; no fusionar main para obtenerla.

El laboratorio cloud está en `/workspace/YitVerse-Frontend-V2-Revision` y no accede a D: ni a la carpeta de respaldo del equipo. El almacenamiento npm puede seguir usando C: (`npm config get cache`); comprobar espacio antes de instalar. No mover/borrar datos Docker o WSL para este desarrollo.

Después de clonar y verificar **la copia nueva**, comprobar `git status --short --branch` antes de cualquier actualización. Si hay cambios propios, conservarlos y detener el cambio de rama; no usar limpieza ni reset para saltar ese control. main y PR #3 no se modifican.

## Arranque en dos terminales PowerShell

Terminal 1, Express:

```powershell
Set-Location -LiteralPath 'D:\Proyectos\YitVerse\YitVerse-Frontend-V2-Limpio' -ErrorAction Stop
npm --prefix Backend ci
npm --prefix Backend run dev
```

Terminal 2, Vite:

```powershell
Set-Location -LiteralPath 'D:\Proyectos\YitVerse\YitVerse-Frontend-V2-Limpio' -ErrorAction Stop
npm --prefix Frontend ci
npm --prefix Frontend run dev
```

Abrir **http://localhost:5173**. Express escucha exclusivamente en `127.0.0.1:3000`; Vite usa `localhost:5173`, puerto estricto, y redirige `/api` a Express. No hace falta CORS ni exponer la base al navegador. Si un puerto está ocupado, identificar su propietario antes de actuar; no detener procesos ajenos. Para detener este desarrollo, pulsar Ctrl+C en cada una de sus terminales.

En Linux cloud se observó una vez un fallo interno de Node 24.22.1 al cerrar `--watch` (`FSEventWrap`, puerto liberado); no se reprodujo con un programa mínimo. Si el observador causa problemas, ejecutar el mismo servidor **sin recarga automática**, desde la raíz, después de detener su instancia anterior:

```powershell
Push-Location Backend
try { node --env-file-if-exists=.env src/dev-server.js } finally { Pop-Location }
```

Este comando alternativo se verificó en Linux con catálogo 200, salud 503 y cierre Ctrl+C con salida 0. Será necesario reiniciarlo manualmente tras cambiar código Backend; Windows sigue pendiente de verificación.

No es necesario crear un `.env`. El aviso de Node de que no encontró `.env` es esperado si no se creó el archivo opcional. El script nativo lee únicamente `Backend/.env` y las variables heredadas del proceso; **no lee el `.env` Docker de la raíz**. No copiar ese archivo a Backend.

Rutas actuales de la rama V2 publicada:

| Ruta | Resultado |
| --- | --- |
| `/` | Inicio editorial con Hero, secciones no personalizadas, géneros y búsqueda hacia Explorar |
| `/explorar` | Seis obras ficticias; búsqueda por título, sinopsis o género y filtro manga/manhwa |
| `/explorar?q=aurora&format=manga` | Catálogo filtrado compartible y restaurado al recargar |
| `/?q=aurora&format=manga` | URL antigua compatible; los nuevos enlaces de catálogo usan `/explorar` |
| `/obras/archivo-aurora` | Ficha sintética; la vuelta conserva los filtros cuando se llega desde Explorar |
| `/estado` | Diagnóstico técnico S01; sin PostgreSQL muestra indisponibilidad |
| Ruta u obra desconocida | Estado no encontrado y enlace al catálogo |

## PostgreSQL y límites reales

| Función | Sin PostgreSQL local | Dependencia pendiente |
| --- | --- | --- |
| Explorar, buscar, filtrar y consultar ficha | Disponible con datos sintéticos señalados en UI y API | Ninguna para esta demo |
| `GET /api/health` | **503**, `status: degraded`, `database: unavailable` | Configuración completa y PostgreSQL real accesible; ejecuta SQL real |
| Guardar o administrar obras, cambios y otras entidades | No implementado; la demo es solo lectura | Modelo, migraciones y adapter PostgreSQL futuros, con autorización |
| Diagnóstico sano de PostgreSQL | Nunca se simula | Instalación y credenciales reales; no forma parte de esta entrega |

Las seis fichas y sus ilustraciones geométricas son material ficticio creado para demostración, sin portadas, capítulos o traducciones de terceros. No representan un inventario editorial/comercial. No hay precio, stock, puntuaciones, autenticación, biblioteca personal, XP, YitCoins, compras, pagos ni canjes.

Los datos viven en `Backend/src/catalog/demo-data.js`, detrás de `demo-repository.js` y una inyección opcional en `createApp`; Frontend consulta la API y no tiene una segunda copia de respaldo. No se escriben archivos ni datos en PostgreSQL. Conectar PostgreSQL después **no convierte el catálogo en persistente**: la fuente sigue siendo `synthetic`, `persisted: false` hasta implementar otro adapter autorizado.

Cuando se autorice instalar/configurar PostgreSQL, `Backend/.env.example` describe las variables opcionales. Si no existe `Backend/.env`, se podrá copiar esa plantilla allí y completar `PGDATABASE`, `PGUSER` y `PGPASSWORD` conjuntamente, además de host/puerto si cambian. La configuración parcial se rechaza; las contraseñas no se muestran. El host predeterminado es `127.0.0.1`. No incluir credenciales en comandos compartidos, Git, capturas ni Frontend. No se ha probado en esta entrega una instalación PostgreSQL nativa. Variables PG heredadas de otra sesión también cuentan como configuración: revisar su procedencia si el arranque informa una variable faltante.

## Verificación y compilación

Con las dependencias instaladas:

```powershell
npm --prefix Backend test
npm --prefix Frontend test
npm --prefix Frontend run build:local
```

`build:local` genera el prototipo en `Frontend/dist`; usa internamente el modo Vite `prototype` porque `local` es un nombre reservado. Un build estático necesita un servidor con fallback de rutas a `index.html` y proxy `/api`; para desarrollar utilizar `npm run dev`. Preview se verificó también con proxy/fallback existentes:

```powershell
npm --prefix Frontend run build:local
Push-Location -LiteralPath Frontend -ErrorAction Stop
npm exec vite -- preview --host localhost --port 5174 --strictPort
# Al detener preview con Ctrl+C:
Pop-Location
```

Mantener Express activo en la otra terminal y abrir http://localhost:5174. Probar recarga directa en `/explorar?q=Aurora&format=manga`, `/obras/archivo-aurora` y `/estado`. Preview sirve para revisión local, no acredita despliegue de producción. Docker sigue construyendo la pantalla S01 y no fue modificado.

El comando histórico `npm --prefix Frontend run build` conserva la pantalla técnica S01 y también se verificó. Ambos builds escriben en el mismo `dist`, que está ignorado: el último reemplaza al anterior. No hay que ejecutar scripts de integración/persistencia Docker para validar esta modalidad. No se modificaron Dockerfiles, Compose ni sus guardas de propiedad.

Comprobación manual sin base de datos, con ambos servidores activos:

```powershell
Invoke-RestMethod 'http://localhost:5173/api/works'
Invoke-RestMethod 'http://localhost:5173/api/works?q=%C3%93RBITA&format=manhwa'
Invoke-RestMethod 'http://localhost:5173/api/works/archivo-aurora'
# Esta petición debe informar HTTP 503 mientras no exista PostgreSQL configurado:
Invoke-WebRequest 'http://localhost:5173/api/health'
```

En PowerShell, `Invoke-WebRequest` lanza un error ante 503: es el resultado esperado de este diagnóstico, no un arranque fallido de Express. Probar también apagar **su propia terminal** de Backend: el catálogo informa error; al iniciarlo de nuevo, Reintentar recupera la consulta. Las pruebas automatizadas cubren las esperas, cancelaciones, respuestas inválidas y reintento.

Ante `ENOENT`/script no encontrado comprobar carpeta y versión de Node. Si PowerShell bloquea `npm.ps1` por su política de ejecución, usar `npm.cmd` en lugar de `npm` en los mismos comandos; no hace falta cambiar la política del equipo. Ante conexión rechazada iniciar Backend y comprobar su salida. Ante estado vacío limpiar la búsqueda. No resolver problemas desactivando TLS, publicando credenciales, ejecutando Docker ni borrando datos.
