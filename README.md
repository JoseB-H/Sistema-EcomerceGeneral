# Sistema-EcomerceGeneral

Proyecto académico **Servicios Cloud**. Este repositorio es el punto de referencia compartido entre Codex (desarrollo), Obsidian/Vaultcraft (documentación) y el chat «Servicios Cloud» (decisiones del curso).

## Organización acordada

- `Frontend/`: React + Vite.
- `Backend/`: Node.js + Express.
- `Database/`: PostgreSQL.
- Docker Compose conectará los tres servicios.

**Estado actual:** incremento técnico de S01 implementado y probado: pantalla de diagnóstico, API de salud y PostgreSQL. La revisión/aceptación del PR y del sprint sigue pendiente. No hay módulos comerciales.

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

## Ejecutar el laboratorio S01

Requisitos gratuitos: Git, Node.js 24 LTS/npm y motor Docker con Compose v2 y contenedores Linux. No hace falta instalar PostgreSQL en Windows. Revisar los términos de Docker Desktop para el uso propio; en Linux puede usarse Docker Engine.

Checkout Windows recomendado: `D:\Proyectos\YitVerse\YitVerse-Desarrollo`. La sesión cloud utiliza `/workspace` y no puede acceder al disco D: del usuario. Tener el repositorio en D: **no garantiza** que Docker Desktop/WSL guarde imágenes, caché y volúmenes allí: pueden seguir ocupando C:. Antes de pruebas grandes, revisar espacio y configurar la ubicación de datos desde los ajustes soportados de Docker Desktop para la versión/backend instalado. No mover manualmente imágenes, volúmenes ni discos virtuales WSL. No se ha acreditado aquí una instalación Windows ni una migración de almacenamiento.

PowerShell, desde la copia de desarrollo de esta rama:

```powershell
Set-Location 'D:\Proyectos\YitVerse\YitVerse-Desarrollo'
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
