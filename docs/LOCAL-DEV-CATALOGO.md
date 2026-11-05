# Desarrollo local temporal — catálogo y detalle

**Modalidad autorizada:** HU-001/HU-002 en `feat/local-dev-catalogo`, desde `feat/s01-infraestructura-docker` (`e672e2e`). Docker está pausado para este incremento; se conserva el laboratorio S01 y no se modifica ni fusiona `main` o el PR #3. [Diseño](superpowers/specs/2026-11-04-local-dev-catalogo-design.md), [plan](superpowers/plans/2026-11-04-local-dev-catalogo.md) y [pruebas](LOCAL-DEV-CATALOGO-PRUEBAS.md).

Esta rama añade el [rediseño azul nocturno](UI-AZUL-NOCTURNO.md). Los comandos de checkout siguientes apuntan a `feat/ui-azul-nocturno`, derivada de la rama de catálogo original; no la sustituyen ni modifican PR #3.

## Requisitos y copia de trabajo

Git y Node.js **24 LTS** con npm. Todas las dependencias utilizadas son gratuitas; no hay servicios externos obligatorios. No instalar Docker ni PostgreSQL para probar el catálogo sintético. PostgreSQL sigue siendo la tecnología prevista para persistencia.

La ubicación prevista en Windows es `D:\Proyectos\YitVerse\YitVerse-Desarrollo`. El código se verificó en Linux cloud; no se accedió a D: ni se ejecutó Windows. Mantener libre espacio en D: y en la ubicación de la caché de npm, que puede estar en C: (`npm config get cache`). No mover ni borrar recursos Docker/WSL para ejecutar este prototipo.

Para **un destino que todavía no existe**, PowerShell:

```powershell
git clone --branch feat/ui-azul-nocturno --single-branch https://github.com/JoseB-H/Sistema-EcomerceGeneral.git 'D:\Proyectos\YitVerse\YitVerse-Desarrollo'
Set-Location 'D:\Proyectos\YitVerse\YitVerse-Desarrollo'
node --version
npm --version
```

Para una copia existente, revisar primero `git status --short --branch`. Conservar cualquier cambio propio antes de cambiar de rama; no usar reset ni limpieza forzada. Con el árbol limpio:

```powershell
Set-Location 'D:\Proyectos\YitVerse\YitVerse-Desarrollo'
git fetch origin refs/heads/feat/ui-azul-nocturno:refs/remotes/origin/feat/ui-azul-nocturno
# Si la rama local aún no existe:
git switch --no-track --create feat/ui-azul-nocturno origin/feat/ui-azul-nocturno
# Si ya existe, usar en su lugar:
# git switch feat/ui-azul-nocturno
# git merge --ff-only origin/feat/ui-azul-nocturno
```

La creación local usa `--no-track` para funcionar también en clones previos de una sola rama; las actualizaciones se hacen con el fetch y merge explícitos anteriores. Estos comandos no requieren cambiar `main` ni la rama del PR #3.

## Arranque en dos terminales PowerShell

Terminal 1, Express:

```powershell
Set-Location 'D:\Proyectos\YitVerse\YitVerse-Desarrollo'
npm --prefix Backend ci
npm --prefix Backend run dev
```

Terminal 2, Vite:

```powershell
Set-Location 'D:\Proyectos\YitVerse\YitVerse-Desarrollo'
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

Rutas del navegador:

| Ruta | Resultado |
| --- | --- |
| `/` | Seis obras ficticias; búsqueda por título, sinopsis o género y filtro manga/manhwa |
| `/?q=aurora&format=manga` | Búsqueda compartible, sin distinguir mayúsculas ni acentos |
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

`build:local` genera el prototipo en `Frontend/dist`; usa internamente el modo Vite `prototype` porque `local` es un nombre reservado. Un build estático necesita un servidor con fallback de rutas a `index.html` y proxy `/api`; para esta entrega utilizar `npm run dev`.

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
