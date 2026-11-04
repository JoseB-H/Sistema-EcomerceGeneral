# Sistema-EcomerceGeneral

Proyecto académico **Servicios Cloud**. Este repositorio es el punto de referencia compartido entre Codex (desarrollo), Obsidian/Vaultcraft (documentación) y el chat «Servicios Cloud» (decisiones del curso).

## Organización acordada

- `Frontend/`: React + Vite.
- `Backend/`: Node.js + Express.
- `Database/`: PostgreSQL.
- Docker Compose conectará los tres servicios.

**Estado actual:** la aplicación no está implementada en este repositorio. Las carpetas de código serán creadas desde Codex.

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
