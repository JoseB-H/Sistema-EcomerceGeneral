# Instrucciones compartidas para Codex

## Contexto y autoridad
Trabajamos en `JoseB-H/Sistema-EcomerceGeneral`, proyecto académico de **Servicios Cloud**. Este repositorio será el puente entre Codex, el chat «Servicios Cloud» y la documentación Obsidian/Vaultcraft. Leer también `docs/ALINEACION-ENTRE-CHATS.md` y `docs/ESTADO-DEL-PROYECTO.md`.

## Alcance aprobado
- Tres servicios en tres carpetas principales: `Frontend/` (React + Vite), `Backend/` (Node.js + Express) y `Database/` (PostgreSQL).
- Integración y ejecución local con **Docker Compose**.
- Comunicación: navegador → Frontend → Backend → Database. Solo Backend accede directamente a Database.
- Los datos de PostgreSQL deben persistir al reiniciar contenedores.
- Priorizar tecnologías y herramientas gratuitas. No incorporar servicios de pago obligatorios.
- La visión de YitVerse ya está definida en `docs/20-VISION-FUNCIONAL-YITVERSE.md`: manga/manhwa, biblioteca del lector, seguimiento, XP, niveles, YitCoins, artículos físicos y accesorios. **Las reglas detalladas y el MVP aún requieren refinamiento**. No inventar funcionalidades, permisos, medios de pago ni políticas comerciales. No importar requisitos de proyectos ajenos.

## Normas de implementación
1. El usuario desarrollará el sistema con **Codex**, de forma incremental. No asumir que un prototipo anterior está desplegado o probado en este repositorio.
2. Antes de modificar un archivo existente, inspeccionar su contenido e historial; evitar sobrescrituras y cambios destructivos.
3. No publicar secretos, contraseñas, datos personales, archivos `.env`, dumps, dependencias `node_modules` ni carpetas de compilación.
4. Cargar credenciales mediante variables de entorno; incluir únicamente un `.env.example` seguro.
5. Evitar exponer PostgreSQL públicamente. Cuando se configure Compose, añadir healthchecks y dependencias adecuadas cuando corresponda.
6. Mantener componentes separados con responsabilidades claras. Agregar pruebas y comandos reproducibles según avance el sistema.
7. Cambios en endpoints, modelos, esquema SQL, puertos o flujo Docker deben reflejarse **en la misma entrega** en las notas de `docs/`. Actualizar `docs/ESTADO-DEL-PROYECTO.md` con lo terminado, lo pendiente y cómo verificarlo.
8. No alterar apuntes de curso, PDFs ni configuración de la bóveda de Obsidian salvo petición explícita.
9. Proponer PRs o commits descriptivos con resumen de cambios, pruebas ejecutadas y limitaciones conocidas.

## Coordinación
- **Codex:** implementación de Frontend, Backend, Database y Docker.
- **Chat «Servicios Cloud»:** criterios de la asignatura y decisiones de arquitectura.
- **Vaultcraft/Obsidian:** documentación técnica, aprendizaje y navegación de apuntes.
- **GitHub:** fuente compartida; no hay sincronización automática de las conversaciones de ChatGPT.

Ante decisiones técnicas nuevas o un conflicto entre chat y código, registrar una decisión pendiente en `docs/ALINEACION-ENTRE-CHATS.md` antes de cambiar supuestos esenciales.


## Lectura obligatoria de Obsidian y Scrum (actualizado 2026-11-03)
**Codex no puede asumir acceso a la bóveda local de Obsidian.** La documentación compartida reside en GitHub bajo `docs/`; debe leer estos archivos antes de planificar y antes de codificar:
- `docs/00-INDICE-DOCUMENTAL.md`
- `docs/16-MARCO-SCRUM.md`
- `docs/18-PUENTE-CODEX-OBSIDIAN.md`
- `docs/ESTADO-DEL-PROYECTO.md`
- El RF/HU y la solicitud en `docs/solicitudes/` asociados al Issue elegido.

No desarrollar una historia únicamente porque existe una nota: comprobar su estado y aprobación en Product Backlog/Sprint Backlog. Las notas nuevas se refinan antes de asignarse a un sprint. Una nota nueva **no crea un sprint nuevo automáticamente**.

Al modificar Frontend, Backend, Database, Docker o API, actualizar la documentación correspondiente en el mismo cambio y registrar pruebas/commit. En caso de conflicto entre notas antiguas y documentos vigentes, detener la decisión afectada y solicitar resolución, sin sobrescribir la bóveda académica.

La sincronización Obsidian ↔ GitHub depende de Git configurado en la computadora del usuario; no afirmar que está activada hasta verificarlo.


## Especificaciones RF y RNF — lectura obligatoria (2026-11-03)
Antes de diseñar o cambiar módulos, consultar:
1. `docs/02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md` — 28 RF, estatus, prioridades propuestas y criterios de aceptación iniciales.
2. `docs/27-REQUISITOS-NO-FUNCIONALES.md` — 30 RNF, verificación prevista y parámetros aún por aprobar.
3. `docs/28-MATRIZ-TRAZABILIDAD.md` — relación RF ↔ HU ↔ RNF.
4. `docs/24-PRODUCT-BACKLOG-SCRUM.md` — historias de usuario candidatas, sin sprint asignado.
5. `docs/25-DECISIONES-PENDIENTES.md` — decisiones que bloquean el refinamiento.

**No implementar por el mero hecho de aparecer en la documentación**. Seleccionar historias en Sprint Planning con sus decisiones cerradas, criterios aprobados y RNF aplicables. Requerimientos marcados como propuesta, bloqueado o futuro **no autorizan código**. No usar material editorial sin derechos; no asignar cantidades de XP/YitCoins sin aprobación.

Con cada implementación, actualizar RF/HU/RNF aplicables, evidencias y estado del proyecto. La bóveda Obsidian local sigue sin sincronización verificada; GitHub es la copia común para Codex.
