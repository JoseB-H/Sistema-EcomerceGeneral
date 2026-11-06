# Sistema-EcomerceGeneral

Proyecto académico **Servicios Cloud**. Este repositorio es el punto de referencia compartido entre Codex (desarrollo), Obsidian/Vaultcraft (documentación) y el chat «Servicios Cloud» (decisiones del curso).

## Organización acordada

- `Frontend/`: React + Vite.
- `Backend/`: Node.js + Express.
- `Database/`: PostgreSQL.
- Docker Compose del Sprint 1 se conserva; su uso está temporalmente pausado para el prototipo local.

**Estado actual:** prototipo local HU-001/HU-002 con catálogo y detalle de seis obras ficticias, búsqueda y estados de interfaz. Express/Vite se ejecutan directamente; PostgreSQL aún no está instalado localmente y su diagnóstico indica indisponibilidad. Se conserva el incremento técnico S01; revisión/aceptación del PR #3 y del sprint pendiente. No hay transacciones comerciales.

El catálogo local incluye ahora el [rediseño azul nocturno](docs/UI-AZUL-NOCTURNO.md), con capturas y pruebas para revisión en `feat/ui-azul-nocturno`, derivada de la rama del prototipo.

El Incremento1 `daf3c85` fue aceptado y el Incremento2 actualiza exclusivamente el sistema visual en la rama **local** `feat/frontend-v2-editorial`. Sin publicación/PR ni nuevas rutas. [Guía visual V2](docs/32-GUIA-VISUAL-FRONTEND-V2.md) y [comparativas/pruebas](docs/FRONTEND-V2-INCREMENTO-2-PRUEBAS.md). Ver [bitácora](docs/00-BITACORA-DE-CONTINUIDAD.md), [V2](docs/31-YITVERSE-DISENO-VISUAL-V2.md) y [recuperación segura Git Windows](docs/RECUPERACION-GIT-WINDOWS.md).

## Antes de empezar

- [Instrucciones para Codex](AGENTS.md)
- [Acuerdos entre los chats y herramientas](docs/ALINEACION-ENTRE-CHATS.md)
- [Estado y tareas pendientes](docs/ESTADO-DEL-PROYECTO.md)

### Flujo de trabajo

1. Codex consulta `AGENTS.md` y los acuerdos; desarrolla y prueba el sistema.
2. Se documentan en el mismo commit los cambios relevantes en API, base de datos o Docker.
3. El chat de documentación y Obsidian estudia las modificaciones y actualiza sus notas.
4. El chat «Servicios Cloud» decide criterios académicos que se registran en `docs/ALINEACION-ENTRE-CHATS.md`.

> El repositorio es **público**. No subir secretos, `.env`, datos personales, bases de datos reales ni diapositivas de clase sin verificar permisos de publicación.

## Bóveda Obsidian del proyecto
Para consultar y mantener la documentación con Obsidian Desktop, abrir **una copia/clon separado** del repositorio como bóveda y comenzar en [00 - YitVerse.md](00%20-%20YitVerse.md).

Consultar la [guía de sincronización Obsidian ↔ GitHub ↔ Codex](docs/30-OBSIDIAN-GITHUB-SINCRONIZACION.md). La preparación del repositorio está publicada, pero **la sincronización local sigue pendiente** de configurarse y probarse en Windows.

Evitar abrir como bóveda la misma carpeta activa de desarrollo de Codex para que los commits automáticos no incluyan código a medio escribir.

## Ejecutar el prototipo local actual, sin Docker

Requisitos: Git y Node.js 24 LTS/npm. En PowerShell, **solo desde un clon nuevo verificado**, por ejemplo `D:\Proyectos\YitVerse\YitVerse-Frontend-V2-Limpio`, usar dos terminales. No ejecutar en el repositorio original afectado ni en el respaldo; seguir primero la guía de recuperación enlazada arriba. La base pública clonable es `feat/ui-azul-nocturno`; V2 sigue local.

```powershell
# Terminal 1
npm --prefix Backend ci
npm --prefix Backend run dev
```

```powershell
# Terminal 2
npm --prefix Frontend ci
npm --prefix Frontend run dev
```

Abrir **http://localhost:5173**; Vite redirige `/api` a Express en `127.0.0.1:3000`. No hace falta `.env` ni PostgreSQL para las fichas sintéticas. `/estado` y `/api/health` informan el fallo real de conexión (503). No existe persistencia del catálogo.

[Guía Windows completa, cambio de rama y límites PostgreSQL](docs/LOCAL-DEV-CATALOGO.md) · [Pruebas reales y limitaciones](docs/LOCAL-DEV-CATALOGO-PRUEBAS.md).

## Laboratorio S01 conservado — Docker pausado

Las instrucciones siguientes documentan el laboratorio previo y sus precauciones. Para el desarrollo actual utilizar únicamente la modalidad nativa anterior; no ejecutar estos comandos Docker ni sus suites de integración/persistencia. Su evidencia histórica continúa en el reporte S01.

Requisitos gratuitos: Git, Node.js 24 LTS/npm y motor Docker con Compose v2 y contenedores Linux. No hace falta instalar PostgreSQL en Windows. Revisar los términos de Docker Desktop para el uso propio; en Linux puede usarse Docker Engine.

Referencia histórica del laboratorio S01: no reutilizar su checkout Windows durante la recuperación; para el desarrollo actual usar una carpeta nueva verificada. La sesión cloud utiliza `/workspace` y no puede acceder al disco D: del usuario. Tener el repositorio en D: **no garantiza** que Docker Desktop/WSL guarde imágenes, caché y volúmenes allí: pueden seguir ocupando C:. Antes de pruebas grandes, revisar espacio y configurar la ubicación de datos desde los ajustes soportados de Docker Desktop para la versión/backend instalado. No mover manualmente imágenes, volúmenes ni discos virtuales WSL. No se ha acreditado aquí una instalación Windows ni una migración de almacenamiento.

PowerShell, desde la copia de desarrollo de esta rama:

```powershell
Set-Location -LiteralPath 'D:\Proyectos\YitVerse\YitVerse-Frontend-V2-Limpio' -ErrorAction Stop
# Solo si .env aún no existe:
if (-not (Test-Path '.env')) { Copy-Item '.env.example' '.env' }
# Editar .env y completar POSTGRES_PASSWORD con una contraseña local de laboratorio.
# No copiar ni publicar el archivo; no usar una contraseña personal real.
$env:S01_COMPOSE_PROJECT = 'yitverse-s01'
node scripts/compose-helper.mjs prepare
node scripts/compose-helper.mjs -- config -q
node scripts/compose-helper.mjs -- up --build -d --wait --wait-timeout 120
node scripts/compose-helper.mjs -- ps
```

Abrir en el navegador local el puerto elegido por `FRONTEND_PORT` (8080 por defecto). Únicamente el frontend se publica en loopback. Nginx sirve React y reenvía `/api/health` a Backend; solo Backend comparte red con PostgreSQL. Las credenciales nunca van al navegador. La ruta de salud devuelve 200/JSON sano tras SQL real o 503/JSON degradado cuando DB no responde. El botón Reintentar mide de nuevo; la UI no anuncia salud continua a partir de un resultado anterior.

En Bash: `cp -n .env.example .env`, completar la contraseña local y `export S01_COMPOSE_PROJECT=yitverse-s01`; después usar los mismos comandos Node. Para desarrollo opcional del host: `npm --prefix Backend ci`, `npm --prefix Frontend ci`; configurar variables PG de Backend hacia una DB de laboratorio permitida, y ejecutar los respectivos `npm run dev`. Compose es el flujo de aceptación y no publica DB ni Backend al host.

### Propiedad y seguridad de las pruebas

El helper valida el espacio de nombres `yitverse-s01`/`yitverse-s01-*`, daemon, ruta real del checkout, registro local y etiquetas de servicios/redes/volumen antes de operar. `.local/s01-test-environment.json` y `.local/compose.s01-tests.yml` identifican exclusivamente este laboratorio; no copiarlos a otra máquina/checkout ni compartirlos como configuración. Si el nombre ya pertenece a un entorno sin esa identidad, el helper aborta: no adopta ni borra recursos. Elegir otro nombre reservado para una prueba independiente, con un puerto disponible.

Todas las operaciones usan el mismo proyecto y archivos Compose. No añadir `-p`, `-f` o `--env-file` por fuera del helper. Las suites adquieren exclusión por daemon/proyecto y se ejecutan secuencialmente. Ante bloqueo o propiedad incierta, investigar; no borrar locks de otros procesos ni forzar limpieza.

Las suites registran antes de cada alteración los servicios a restaurar y esquemas sintéticos en `.local/s01-test-recovery.json`, ligado al propietario/daemon/checkout. SIGINT/SIGTERM solicitan cancelación controlada: se dejan terminar las operaciones Docker en curso, se restauran únicamente recursos verificados en `finally` y se libera el bloqueo. No se garantiza limpieza ante SIGKILL, caída del equipo o pérdida del daemon.

Si una terminación no recuperable deja un lock, conservar `.local` y verificar que el proceso acabó. `node scripts/compose-helper.mjs recover-lock` solo libera el bloqueo cuando su PID ya no existe en el mismo host y coinciden contexto, propietario y recursos. Rechaza procesos vivos o identidad incierta y no altera contenedores ni datos. Después, inspeccionar el journal, comprobar propiedad con el helper y arrancar únicamente los servicios allí registrados (`-- start database` o `-- start backend`). Cualquier limpieza SQL requiere comprobar que el esquema sintético indicado fue creado por esa prueba; no borrar un esquema de origen incierto ni volúmenes. El journal se conserva si la restauración/limpieza no se completa. No eliminar locks manualmente ni adoptar recursos para sortear el diagnóstico.

Parada/reinicio conservando el volumen:

```powershell
node scripts/compose-helper.mjs -- stop
node scripts/compose-helper.mjs -- up -d --wait --wait-timeout 120
```

No usar `down -v`, borrado de volúmenes ni `docker system prune`. El volumen conserva datos al recrear DB; **no es un backup**. Cambiar la contraseña del `.env` no modifica automáticamente la contraseña de una base ya inicializada: no borrar datos para resolver ese desajuste.

### Validación disponible

```powershell
npm --prefix Backend ci
npm --prefix Backend test
npm --prefix Frontend ci
npm --prefix Frontend test
npm --prefix Frontend run build
node --test scripts/compose-helper.test.mjs
node --test scripts/integration.test.mjs
```

Las dependencias están fijadas con lockfiles; los Dockerfiles usan imágenes oficiales por digest. No versionar `.env`, `.local`, node_modules ni dist. No imprimir `docker compose config` expandido: contiene contraseñas; usar `config -q`.

En cloud con proxy TLS, conservar proxy/CA del entorno. El override local ignorado `.local/compose.cloud.yml` puede añadir el secreto BuildKit `proxy_ca` a los builds frontend/backend y declarar `secrets.proxy_ca.file` como la ruta pública de la CA proporcionada por la plataforma. El helper lo incluye automáticamente; los Dockerfiles usan ese mount opcional con `NODE_EXTRA_CA_CERTS`, sin desactivar TLS ni persistir la CA en capas. Este archivo de sesión no debe copiarse a Windows.

Resultados reales y límites: [reporte S01](docs/sprints/S01-REPORTE-PRUEBAS.md). La disponibilidad de una página HTTP, las pruebas unitarias, un navegador real y la aceptación humana se registran por separado.

### Persistencia y reproducción independiente

Después de integración y sin ejecutarlas en paralelo:

```powershell
node --test scripts/persistence.test.mjs
```

La prueba hace dos ciclos de inserción sintética, recreación de Database y consulta con mismo volumen; limpia solo su esquema. Repetir desde un clon limpio de la rama del incremento, con `.env` nuevo, puerto diferente y `$env:S01_COMPOSE_PROJECT = 'yitverse-s01-clean'`. Ejecutar `prepare` y los mismos comandos de construcción/pruebas. No copiar `.local`, `.env`, dependencias ni outputs de otra copia. Ante colisión de nombre o propiedad incierta, abortar y elegir otro nombre permitido; no adoptar ni eliminar el entorno existente.
