# Recuperación segura de Git en Windows

**Estado:** instrucciones para revisión/ejecución manual del usuario. No se ejecutaron en Windows desde cloud y no certifican ningún respaldo local. Incremento1 de `feat/frontend-v2-editorial`, 2026-11-05.

## Rutas protegidas y diagnóstico

Conservar el contenido de `D:\Proyectos\YitVerse\YitVerse-Desarrollo` y del respaldo existente `%USERPROFILE%\YitVerse-Respaldo-Seguro`. No ejecutar Git, instalar dependencias, modificar archivos ni iniciar el proyecto en esas carpetas durante la recuperación. No borrar/reparar `.git`, packs u objetos, ni usar reset forzado, limpieza global o push forzado. La copia original se usa únicamente como fuente de lectura para un respaldo nuevo.

El registro del usuario incluye `pack ... is far too short to be a packfile`, `bad tree object HEAD` y un intento Robocopy fallido por acceso denegado. Que las ramas estén disponibles en GitHub **no garantiza** que los cambios sin commit estén respaldados. Los incidentes históricos se conservan en la [bitácora](00-BITACORA-DE-CONTINUIDAD.md).

## 1. Preservar cambios locales en otro destino nuevo

Si no existe un respaldo verificado, crear una copia adicional **fuera del repositorio y sin reutilizar el respaldo existente**. PowerShell, sin necesitar Git funcional en el origen:

```powershell
$origenYit = 'D:\Proyectos\YitVerse\YitVerse-Desarrollo'
$destinoYit = Join-Path $env:USERPROFILE ('YitVerse-Respaldo-Nuevo-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
if (-not (Test-Path -LiteralPath $origenYit -PathType Container)) { throw 'No existe el origen; detener y revisar la ruta.' }
if (Test-Path -LiteralPath $destinoYit) { throw 'El destino ya existe; no reutilizarlo.' }
New-Item -ItemType Directory -Path $destinoYit -ErrorAction Stop | Out-Null
robocopy $origenYit $destinoYit /E /XJ /XD .git node_modules dist build .next /R:1 /W:1
$codigoCopiaYit = $LASTEXITCODE
if ($codigoCopiaYit -ge 8) { throw "Robocopy falló con código $codigoCopiaYit. Conservar ambos directorios y revisar el resumen." }
Get-ChildItem -LiteralPath $destinoYit -Force
```

Robocopy0–7 no indica por sí solo que se verificó todo el respaldo: revisar el resumen, los archivos esperados y cualquier discrepancia. Comparar los archivos importantes, incluyendo nuevos/no versionados, antes de trasladarlos al clon limpio. Para comparar un archivo concreto que exista en ambos lados:

```powershell
# Cambiar por el archivo que se necesite comprobar; no mostrar contenidos secretos.
$relativoYit = 'Frontend\src\catalog\CatalogApp.jsx'
Get-FileHash -LiteralPath (Join-Path $origenYit $relativoYit) -Algorithm SHA256
Get-FileHash -LiteralPath (Join-Path $destinoYit $relativoYit) -Algorithm SHA256
```

La coincidencia de un archivo no certifica todos los demás. El respaldo puede contener `.env` y otros datos privados: mantenerlo privado, fuera del clon/Git, y no publicar su contenido. No se usan opciones Robocopy de espejo, borrado ni movimiento. Ante permisos insuficientes, detenerse y elegir un destino nuevo permitido; no cambiar permisos de forma masiva ni sobrescribir otro respaldo.

## 2. Clonar la base funcional en una carpeta nueva

No ejecutar esta secuencia dentro de la carpeta dañada o del respaldo. La ruta propuesta es `D:\Proyectos\YitVerse\YitVerse-Frontend-V2-Limpio`; si ya existe, conservarla y escoger otro nombre nuevo. Git y Node24/npm son requisitos para ejecutar después el prototipo.

La rama `feat/frontend-v2-editorial` del Incremento1 es **local en cloud y no se ha publicado**. El comando siguiente clona `feat/ui-azul-nocturno`, que sí está en GitHub; no afirmar que esto obtiene un commit V2 todavía no publicado.

```powershell
Set-Location -LiteralPath $env:USERPROFILE -ErrorAction Stop
$clonYit = 'D:\Proyectos\YitVerse\YitVerse-Frontend-V2-Limpio'
if (Test-Path -LiteralPath $clonYit) { throw 'La ruta ya existe. Conservarla y elegir otra carpeta nueva.' }
git clone --branch feat/ui-azul-nocturno https://github.com/JoseB-H/Sistema-EcomerceGeneral.git $clonYit
if ($LASTEXITCODE -ne 0) { throw 'Falló la clonación. No ejecutar el proyecto; conservar el diagnóstico.' }
Set-Location -LiteralPath $clonYit -ErrorAction Stop
git fsck --full
if ($LASTEXITCODE -ne 0) { throw 'Hay errores de integridad. Detenerse sin reparar o borrar objetos.' }
git status --short --branch
git branch -a
git rev-parse HEAD
```

En la revisión del 2026-11-05, la base azul era `127aa8a7c8c5b4d29bd590f37c615de51730fa9e`. Si el remoto avanzó, inspeccionar los commits nuevos; no regresar la copia a la fuerza. La nueva clonación no recupera automáticamente cambios sin commit de Windows ni prueba sincronización Obsidian.

## 3. Comparar antes de recuperar archivos

Solo después de comprobar respaldo e integridad del clon, comparar manualmente los cambios locales con la nueva copia. No copiar `.git`, `node_modules`, `dist`, configuraciones privadas ni un árbol completo encima del clon. No trasladar `.env` o credenciales a Git. No reemplazar archivos de manera automática por tener una fecha más reciente.

Esta entrega cloud no autoriza ni realiza una restauración automática de archivos del usuario. Conservar los originales y respaldos incluso si la comparación parece correcta. La recuperación y la ejecución Windows siguen **pendientes de verificación del usuario**.

## 4. Qué ejecutar y qué esperar

Para ejecutar la base azul en el clon nuevo, seguir [desarrollo local](LOCAL-DEV-CATALOGO.md). No ejecutar Docker. La ruta `/` sigue siendo catálogo/hero, `/obras/:id` detalle y `/estado` diagnóstico; `/explorar` separado todavía no existe. Sin PostgreSQL configurado, la API de catálogo devuelve datos ficticios y la salud503 sigue indicando la indisponibilidad real de DB.

La publicación de la rama V2 y un eventual cambio a ella requieren la siguiente aprobación del usuario. No intentar descargarla ni abrir PR mientras no se haya publicado expresamente.
