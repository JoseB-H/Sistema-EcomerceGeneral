# Marco Scrum — Sistema-EcomerceGeneral

**Estado:** marco de coordinación documental adoptado. La duración y fechas de sprint no están confirmadas.

## Producto y roles
- **Product Owner (a confirmar):** persona que prioriza Product Backlog y aclara el valor de cada solicitud. El usuario conserva la decisión final de alcance.
- **Scrum Master (a asignar):** facilita la aplicación de Scrum y la eliminación de impedimentos.
- **Developers:** quienes construyen y validan el incremento, con Codex como herramienta de desarrollo; Codex no sustituye la responsabilidad humana de aceptación.
- **Vaultcraft/Chat documental:** mantiene requisitos, decisiones, actas de revisión y retrospectivas, sin atribuir aprobaciones inexistentes.

## Artefactos
- **Product Backlog:** Issues de GitHub y notas de solicitud sincronizadas desde Obsidian; cada ítem tiene prioridad, aceptación, estado y responsable de decisión.
- **Sprint Backlog:** selección de ítems para un Sprint Goal y un período fijo.
- **Increment:** código integrado, revisado y probado con documentación actualizada.
- **Product Goal:** demostrar un sistema web de tres contenedores con funcionalidades que el usuario apruebe.

## Eventos
1. Sprint Planning: objetivo, capacidad, ítems y criterios de aceptación.
2. Daily Scrum: identificar progreso e impedimentos (registro breve; no fingir reuniones).
3. Sprint Review: demostrar incremento funcional, incorporar observaciones y actualizar Product Backlog.
4. Sprint Retrospective: definir una mejora concreta de proceso, responsable y seguimiento.
5. Backlog Refinement: aclarar nuevas notas y priorizar antes de planificar.

## Regla fundamental: nota nueva no crea un sprint nuevo
Una nota de Obsidian que se sincroniza con GitHub es una **solicitud candidata al Product Backlog**. Puede convertirse automáticamente en Issue mediante GitHub Actions si se configura la automatización, pero NO crea por sí sola un sprint, ni asigna fecha o autoriza código. El Product Owner prioriza; la planificación selecciona ítems para un sprint de período fijo.

**Cadencia propuesta:** dos semanas, aún sin aprobación. Las fechas no deben inferirse.

## Estados mínimos
Borrador → Backlog → Refinamiento → Listo → En sprint → En desarrollo → En revisión → Verificado → Terminado. Se permite Bloqueado y Descartado con razón.

## Definition of Ready — propuesta
- HU/RF entendible; valor para un actor aprobado.
- Criterios de aceptación y dependencias definidas.
- Estimación revisada por Developers.
- Aprobación del Product Owner para entrar al Sprint Backlog.

## Definition of Done — propuesta
- Código y documentación del mismo incremento comprometidos en Git.
- Pruebas pertinentes ejecutadas y evidencia consignada.
- Seguridad básica y revisión de cambios completadas.
- Requisito trazado hasta PR/commit.
- Resultado demostrable en Sprint Review.

## Plantilla de sprint
```md
Sprint: S-XXX
Inicio: POR_DEFINIR
Fin: POR_DEFINIR
Objetivo:
Ítems seleccionados:
Criterios de cierre:
Riesgos y bloqueos:
Revisión: resultado observado, decisiones
Retrospectiva: mejora, responsable, verificación
```

## Versionado de decisiones
Todos los acuerdos que cambien arquitectura, esquema, API o UI se trasladan a `docs/` antes de considerarse instrucciones vigentes para Codex. Véase [Puente Codex/Obsidian](18-PUENTE-CODEX-OBSIDIAN.md).
