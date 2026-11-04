# Índice documental — Sistema-EcomerceGeneral

> Estado: **línea base de diseño propuesta**, no funcionalidad implementada. Última revisión: 2026-11-03.

## Para empezar
1. [Visión y alcance](01-VISION-Y-ALCANCE.md): propósito, límites y definiciones pendientes.
2. [Requisitos y preguntas de descubrimiento](02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md): qué debe aprobarse antes de programar.
3. [Arquitectura y contenedores](03-ARQUITECTURA-Y-CONTENEDORES.md): estructura y comunicación entre Frontend, Backend y Database.
4. [Diseño del Frontend](04-DISENO-FRONTEND.md): propuesta de capas y decisiones de interfaz.
5. [Diseño del Backend](05-DISENO-BACKEND.md): propuesta de API y responsabilidades.
6. [Diseño de Database](06-DISENO-DATABASE.md): esquema, migraciones y persistencia.
7. [Contratos API y flujos](07-CONTRATOS-API-Y-FLUJOS.md): cómo documentar comunicación entre componentes.
8. [Plan de implementación](08-FASES-DE-DESARROLLO.md): orden de trabajo, entradas, salidas y criterios de cierre.
9. [Calidad y pruebas](09-PLAN-DE-PRUEBAS.md): matriz de verificación.
10. [Seguridad y operación](10-SEGURIDAD-Y-OPERACION.md): controles, secretos y recuperación.
11. [Obsidian ↔ GitHub](11-SINCRONIZACION-OBSIDIAN-GITHUB.md): flujo de trabajo documental seguro.
12. [Decisiones técnicas y ADR](12-DECISIONES-TECNICAS.md): confirmadas, propuestas y pendientes.
13. [Plantillas de requisitos y entregas](13-PLANTILLAS-DE-TRABAJO.md): RF, HU, endpoint, PR y ADR.
14. [Backlog de decisiones](14-BACKLOG-DE-DEFINICION.md): preguntas para cerrar con el usuario.
15. [Guía para Codex](15-GUIA-DE-ENTREGAS-CODEX.md): órdenes de trabajo por fase.

## Regla de autoridad
- **Confirmado:** decisiones dichas por el usuario en el proyecto y recogidas en [alineación entre chats](ALINEACION-ENTRE-CHATS.md).
- **Propuesto:** alternativa técnica sujeta a revisión y aprobación antes de escribir código.
- **Pendiente:** dato o decisión aún no proporcionado; no rellenar con suposiciones.
- **Implementado:** solo si existe código en el repositorio, pruebas y evidencia.
- **Verificado:** implementación con resultados de prueba reproducibles.

## Navegación rápida
- Coordinación entre chats: [ALINEACION-ENTRE-CHATS](ALINEACION-ENTRE-CHATS.md).
- Situación real del repositorio: [ESTADO-DEL-PROYECTO](ESTADO-DEL-PROYECTO.md).
- Instrucciones globales a Codex: [AGENTS](../AGENTS.md).

### Cómo actualizar
1. Registrar la decisión y su responsable.
2. Modificar las especificaciones afectadas (requisitos, arquitectura, API, datos y UI).
3. Solicitar implementación a Codex.
4. Vincular pruebas y actualizar estado con el commit o PR.
5. Mantener un mismo lenguaje técnico en las notas de Obsidian y en GitHub.

**Nota:** el repositorio es público; no incluir diapositivas protegidas, contraseñas, capturas privadas, datos reales ni la bóveda académica completa sin autorización.
