# Instrucciones compartidas para Codex

## Contexto y autoridad
Trabajamos en `JoseB-H/Sistema-EcomerceGeneral`, proyecto académico de **Servicios Cloud**. Este repositorio será el puente entre Codex, el chat «Servicios Cloud» y la documentación Obsidian/Vaultcraft. Leer también `docs/ALINEACION-ENTRE-CHATS.md` y `docs/ESTADO-DEL-PROYECTO.md`.

## Alcance aprobado
- Tres servicios en tres carpetas principales: `Frontend/` (React + Vite), `Backend/` (Node.js + Express) y `Database/` (PostgreSQL).
- Integración y ejecución local con **Docker Compose**.
- Comunicación: navegador → Frontend → Backend → Database. Solo Backend accede directamente a Database.
- Los datos de PostgreSQL deben persistir al reiniciar contenedores.
- Priorizar tecnologías y herramientas gratuitas. No incorporar servicios de pago obligatorios.
- El nombre del repositorio sugiere e-commerce general, pero **los módulos de negocio aún no están definidos**; no inventar funcionalidades, permisos, medios de pago ni políticas comerciales. No importar requisitos de proyectos ajenos.

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
