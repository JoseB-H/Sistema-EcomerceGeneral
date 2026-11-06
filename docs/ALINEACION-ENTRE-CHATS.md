# Alineación entre Servicios Cloud, Codex y Obsidian

**Proyecto compartido:** [Sistema-EcomerceGeneral](https://github.com/JoseB-H/Sistema-EcomerceGeneral)

## Objetivo
Establecer un único contexto técnico y documental para trabajar en **chats separados** sin que cada espacio invente requisitos diferentes. La coordinación entre chats se produce leyendo y actualizando **este repositorio**; las conversaciones de ChatGPT no se sincronizan entre sí en tiempo real.

## Responsabilidades por entorno

| Entorno | Trabajo |
| --- | --- |
| Chat «Servicios Cloud» | Arquitectura cloud, teoría y requisitos académicos del curso |
| Codex | Construcción del sistema, pruebas, configuración de contenedores y refactorizaciones |
| Chat con Vaultcraft | Documentación en Obsidian, notas, manuales, diagramas y registros de decisiones |
| GitHub | Historial y archivos compartidos entre todos los entornos |

## Acuerdos confirmados
- Proyecto académico de Servicios Cloud y sistema de e-commerce general.
- Tres carpetas de servicio: `Frontend/`, `Backend/`, `Database/`.
- Tecnologías base: React + Vite, Node.js + Express, PostgreSQL.
- Contenerización con Docker y orquestación local con Docker Compose.
- Tráfico de aplicación desde Frontend a Backend; conexión a PostgreSQL solo desde Backend.
- Documentación del código junto a las modificaciones que la afecten.
- Mantener en Obsidian los apuntes del curso S04–S11, separados de los detalles de implementación.
- Priorizar herramientas gratuitas, evitar exponer secretos o datos reales.

## Decisiones pendientes
- Funciones, pantallas, roles y reglas de negocio específicas del e-commerce.
- Endpoints y estructura SQL concretos.
- Diseño visual y estrategia de pruebas.
- Despliegue remoto: **no decidido**. Compose local es la referencia inicial.
- Sincronización de la bóveda local mediante Obsidian Git: **pendiente de configurar en el equipo**.

## Cómo compartir el contexto entre chats
Al empezar un nuevo chat o tarea de Codex, señalar este repositorio y pedir: «Revisa `AGENTS.md`, `docs/ALINEACION-ENTRE-CHATS.md` y `docs/ESTADO-DEL-PROYECTO.md` antes de proponer cambios».

Cuando haya un acuerdo relevante en el chat de Servicios Cloud, registrarlo aquí; cuando Codex entregue un módulo, actualizar Estado del proyecto y documentación técnica. Esto mantiene el contexto disponible para todos, incluso si no pueden leer literalmente el otro chat.

## Nota de publicación
El repositorio es público. Las diapositivas de clase y la bóveda completa **no deben subirse automáticamente**: revisar derechos de publicación y datos privados antes de incluirlas.

## S01 — autorización técnica recibida (2026-11-04)

El usuario autorizó ejecutar las seis tareas del plan integrado en `b32ee01`, en `feat/s01-infraestructura-docker`. Se adoptan pantalla de diagnóstico React/Vite servida con Nginx, proxy `/api`, Express con contrato 200/503 y consulta SQL real, dos redes y PostgreSQL con volumen persistente sin puerto publicado. Se mantienen las precauciones de D:/Docker Desktop y de propiedad de recursos de prueba. No implica aprobar módulos de negocio, fechas, aceptación final ni cierre del sprint.

## Modalidad local temporal y HU-001/HU-002 — 2026-11-04

El usuario autorizó pausar Docker para el desarrollo actual y crear `feat/local-dev-catalogo` desde `feat/s01-infraestructura-docker`, sin alterar main ni PR #3. La ejecución local será Vite localhost:5173 → Express localhost:3000. PostgreSQL se conserva; su ausencia no se simula como éxito. Se autoriza un prototipo de exploración/ficha con datos sintéticos identificados, búsqueda y estados, aislado de persistencia futura. Se elige adapter de demostración en Backend y se conserva el arranque S01. Esto refina solo HU-001/HU-002 para este prototipo, sin asignar automáticamente otro sprint, aprobar comercio ni resolver licencias de obras reales. Diseño y plan en docs/superpowers con prefijo 2026-11-04-local-dev-catalogo.

## Rediseño visual azul nocturno autorizado — 2026-11-04

El usuario solicita preparar, implementar y publicar una interfaz oscura editorial, con paleta azul explícita, sobre rama derivada de feat/local-dev-catalogo. Rama elegida feat/ui-azul-nocturno. Se cambia la preferencia verde/clara provisional; se conservan HU-001/HU-002, datos ficticios, API, navegación y ejecución nativa. No se autoriza comercio ni se modifica Docker, main o PR #3. Olympus no fue accesible por proxy403: se usa la organización descrita, sin copiar material ni afirmar inspección visual. Diseño/plan 2026-11-04-ui-azul-nocturno documentan decisiones del implementador para revisión.

## Frontend V2 — plan aprobado y autorización limitada (2026-11-05)

El usuario aprueba los cinco incrementos y las decisiones provisionales del [plan Frontend V2](superpowers/plans/2026-11-05-frontend-v2-editorial.md), pero autoriza ejecutar **solo Incremento1: continuidad y rama**, con commit local. `feat/frontend-v2-editorial` nace de `127aa8a`; se analizó main `ae3f8e8` frente al ancestro `b32ee01` y solo añade bitácora/31. Se incorporan estas notas sin fusión completa ni sustitución del estado técnico de UI.

Se conserva código, catálogo/API, rutas, ilustraciones, accesibilidad, Backend/Database/Docker y sus evidencias. La recuperación Windows usa nueva carpeta y respaldo adicional sin alterar originales; no se accede a ese equipo desde cloud. La rama no se publica ni se abre PR. Figma continúa pendiente; aprobar el plan no acredita mockups finales ni autoriza Incremento2. El siguiente paso es revisión del usuario y autorización expresa.

## Frontend V2 — autorización exclusiva del Incremento2 (2026-11-05)

El usuario acepta `daf3c85` y autoriza solo el sistema visual: tokens de paleta/estados, tipografía, espacios, dimensiones, radios, sombras/interacción y responsive. Se mantiene `feat/frontend-v2-editorial`, sin push/PR, y se detiene antes del Incremento3. Rutas/lógica/API, Backend/Database/Docker, dependencias y seis SVG originales no cambian; Figma no se considera aprobado. Antes de editar se verificó un bundle cloud de `daf3c85` mediante clonación/restauración real íntegra, sin acceder a respaldos Windows.

Decisión técnica: las condiciones de media queries CSS no aceptan variables; los umbrales existentes se centralizan en `catalog-responsive.css` y sus valores de diseño en `tokens.css`, sin dependencias de compilación nuevas. No se crea una nueva ruta para la guía visual.

## Frontend V2 — autorización exclusiva del Incremento3 (2026-11-06 UTC)

El usuario acepta `fba88e3` y autoriza únicamente separar Inicio (`/`) y Explorar (`/explorar`), reutilizando navegación nativa, API y sistema visual. Las URL anteriores `/?q=…` o `/?format=…` seguirán mostrando el catálogo; los nuevos enlaces y regresos usarán `/explorar`. Los géneros se consultarán mediante la búsqueda existente, sin ampliar contratos. La composición editorial seguirá el orden recibido, sin popularidad, fechas ni personalización. Se conservan las seis ilustraciones originales. No se modifican Backend/Database/Docker, no hay push/PR/fusiones y no se autoriza Incremento4. Figma continúa pendiente. Se conserva el bundle Inc2 verificado y se generará otro al terminar.

Resultado Inc3:45 Backend/45 Frontend, ambos builds y Chromium dev/preview aprobados. Inicio/Explorar y compatibilidad implementados; [reporte](FRONTEND-V2-INCREMENTO-3-PRUEBAS.md) registra capturas, límites, commit de entrega y respaldo. Inc4 no iniciado; rama local sin publicación. La revisión técnica y las pruebas no reemplazan la aceptación del usuario.
