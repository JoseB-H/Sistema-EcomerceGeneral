# Índice documental — Sistema-EcomerceGeneral

> Estado: diseño del producto en refinamiento, incremento técnico S01 y prototipo sintético HU-001/HU-002 implementados en ramas para revisión. Última revisión: 2026-11-06.

## Continuidad Frontend V2 — integración coordinada

- [Integración34 — empezar aquí al retomar](34-REVISION-COORDINADA-INTEGRACION.md): S01 integrado en main/b8daf70; rama separada de catálogo + V2, sin nuevo PR todavía.
- [Bitácora vigente y autorización limitada](00-BITACORA-DE-CONTINUIDAD.md).
- [Especificación visual V2](31-YITVERSE-DISENO-VISUAL-V2.md): plan aprobado; Figma pendiente.
- [Plan histórico de cinco incrementos](superpowers/plans/2026-11-05-frontend-v2-editorial.md): los cinco entregados y aceptados técnicamente; detener nuevas funciones/PR/merge V2 a main.
- [Entrega integral33 — evidencia histórica de ad8a8b2](33-ENTREGA-FRONTEND-V2.md).
- [Guía visual Frontend V2](32-GUIA-VISUAL-FRONTEND-V2.md).
- [Pruebas y comparativas del Incremento2](FRONTEND-V2-INCREMENTO-2-PRUEBAS.md).
- [Inicio/Explorar: pruebas y capturas del Incremento3](FRONTEND-V2-INCREMENTO-3-PRUEBAS.md).
- [Arte/ficha/móvil: comparativas y pruebas del Incremento4](FRONTEND-V2-INCREMENTO-4-PRUEBAS.md).
- [Recuperación Git Windows](RECUPERACION-GIT-WINDOWS.md): conservar original/respaldo y usar destinos nuevos.

La rama original `feat/frontend-v2-editorial` permanece en `ad8a8b2`. PR #3 ya está fusionado mediante `b8daf70`; la rama nueva `integration/frontend-v2-main` preserva ambas historias para revisar catálogo + V2. Publicarla no autoriza abrir su PR ni fusionarla a main. Figma y Windows/Obsidian pendientes.

## Documentación actualmente publicada
- [Marco Scrum](16-MARCO-SCRUM.md): sprints, backlog y eventos.
- [Puente Codex ↔ Obsidian](18-PUENTE-CODEX-OBSIDIAN.md): contexto compartido y sincronización.
- [Plantilla de solicitud](solicitudes/PLANTILLA-SOLICITUD.md): registrar mejoras sin crear sprints innecesarios.

## Centro Obsidian
- [Inicio de la bóveda (YitVerse)](../00%20-%20YitVerse.md)
- [Guía Obsidian ↔ GitHub ↔ Codex](30-OBSIDIAN-GITHUB-SINCRONIZACION.md) — instalación y verificación, sin subir la bóveda académica.

## Documentos publicados y vigentes
1. [Visión y alcance de YitVerse](01-VISION-Y-ALCANCE.md)
2. [28 requisitos funcionales (RF)](02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md)
3. [30 requisitos no funcionales (RNF)](27-REQUISITOS-NO-FUNCIONALES.md)
4. [Matriz de trazabilidad RF/HU/RNF](28-MATRIZ-TRAZABILIDAD.md)
5. [Arquitectura de los tres contenedores](03-ARQUITECTURA-Y-CONTENEDORES.md)
6. [Diseño de Frontend](04-DISENO-FRONTEND.md)
7. [Diseño de Backend](05-DISENO-BACKEND.md)
8. [Diseño de Database](06-DISENO-DATABASE.md)
9. [Scrum y cambios](16-MARCO-SCRUM.md)
10. [Puente Obsidian y Codex](18-PUENTE-CODEX-OBSIDIAN.md)
11. [Visión funcional detallada](20-VISION-FUNCIONAL-YITVERSE.md)
12. [Experiencia de usuario](21-EXPERIENCIA-USUARIO.md)
13. [XP, niveles y YitCoins](22-REGLAS-XP-YITCOINS.md)
14. [Modelo conceptual del dominio](23-MODELO-CONCEPTUAL.md)
15. [Product Backlog Scrum](24-PRODUCT-BACKLOG-SCRUM.md)
16. [Decisiones pendientes](25-DECISIONES-PENDIENTES.md)
17. [Riesgos y controles](26-RIESGOS-Y-CONTROLES.md)
18. [Plantilla de solicitud](solicitudes/PLANTILLA-SOLICITUD.md)

- [Plan de inicio del desarrollo y Sprint 1 propuesto](29-PLAN-INICIO-DESARROLLO.md): requisitos de equipo, primera integración y criterios de aceptación.

## Modalidad local actual — Docker pausado

- [Rediseño azul nocturno: capturas y pruebas](UI-AZUL-NOCTURNO.md).

- [Guía Windows del catálogo/detalle](LOCAL-DEV-CATALOGO.md).
- [Resultados de pruebas nativas](LOCAL-DEV-CATALOGO-PRUEBAS.md).
- [Diseño autorizado acotado](superpowers/specs/2026-11-04-local-dev-catalogo-design.md).
- [Plan de implementación local](superpowers/plans/2026-11-04-local-dev-catalogo.md).

## Documentos previstos pero aún no publicados
Contratos y operación de módulos futuros requieren refinamiento. Consultar las guías anteriores y las notas de Frontend/Backend para los endpoints y comandos ya implementados.


## Sprint 1 técnico — planificación autorizada
- [Planificación S01](sprints/S01-PLANIFICACION-TECNICA.md): objetivo, alcance, aceptación y pendientes de calendario.
- [Tarea T01 para Codex](codex/TAREA-T01-CONTENEDORES.md): especificación ejecutable, pruebas y entregables.
- [GitHub Issue #1](https://github.com/JoseB-H/Sistema-EcomerceGeneral/issues/1): seguimiento compartido del desarrollo.

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

> Algunos archivos enumerados como plan futuro aún deben redactarse y publicarse. Verifica enlaces antes de asumir que existen.

## Evidencia de desarrollo S01

- [Plan técnico aprobado](superpowers/plans/2026-11-03-sprint-1-infraestructura.md).
- [Reporte de pruebas y limitaciones S01](sprints/S01-REPORTE-PRUEBAS.md).
