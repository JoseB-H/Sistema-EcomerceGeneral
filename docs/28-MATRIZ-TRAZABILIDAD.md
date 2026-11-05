# Matriz de trazabilidad RF ↔ HU ↔ RNF — YitVerse

**Versión:** 0.1 · **Fecha:** 2026-11-03  
**Estado:** prototipo sintético autorizado HU-001/HU-002 implementado para revisión; RF comerciales completos siguen en diseño. Evidencia técnica HU-T01/HU-T02/HU-T03 conservada en S01, con aceptación humana pendiente.

Esta tabla permite que Codex identifique requisitos funcionales afectados, historias del Product Backlog y propiedades de calidad obligatorias. Los estados y requisitos vigentes se consultan en [RF](02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md), [RNF](27-REQUISITOS-NO-FUNCIONALES.md) y [Backlog Scrum](24-PRODUCT-BACKLOG-SCRUM.md).

## 1. Correspondencias

| RF | Objetivo | HU (existente o pendiente) | RNF clave | Estado |
|---|---|---|---|---|
| RF-01 | Catálogo | HU-001 | RNF-14, RNF-21, RNF-24 | Prototipo sintético; revisión pendiente |
| RF-02 | Ficha de obra | HU-002 | RNF-14, RNF-21, RNF-24 | Prototipo de metadatos; sin lectura/compra |
| RF-03 | Búsqueda y categorías | HU-001 (ampliar) | RNF-21, RNF-24, RNF-25 | Búsqueda/filtro sintéticos; revisión pendiente |
| RF-04 | Obra, edición, capítulo y SKU separados | HU-002, HU-012 | RNF-19, RNF-26 | Propuesto |
| RF-05 | Extensión a nuevos formatos | Nueva HU | RNF-19, RNF-26 | Futuro |
| RF-06 | Registro de usuario | HU-003 | RNF-09, RNF-11, RNF-13 | Refinamiento |
| RF-07 | Sesión y aislamiento de cuenta | HU-003 (ampliar) | RNF-09, RNF-10, RNF-15 | Propuesto |
| RF-08 | Favoritos | HU-004 | RNF-10, RNF-19, RNF-21 | Refinamiento |
| RF-09 | Seguimiento | HU-005 | RNF-10, RNF-19, RNF-21 | Refinamiento |
| RF-10 | Historial de lectura | HU-006 | RNF-10, RNF-13, RNF-21 | Refinamiento |
| RF-11 | Lector autorizado | HU-007 | RNF-13, RNF-14, RNF-21 | Bloqueado derechos |
| RF-12 | Guardar progreso | HU-005, HU-007 | RNF-10, RNF-19 | Refinamiento |
| RF-13 | Continuar lectura | HU-005 | RNF-10, RNF-21 | Refinamiento |
| RF-14 | Registrar evento validable | HU-008 | RNF-16, RNF-20 | Propuesto |
| RF-15 | XP por lectura válida | HU-008 | RNF-16, RNF-17, RNF-20 | Bloqueado reglas |
| RF-16 | Nivel y progreso XP | HU-009 | RNF-17, RNF-19, RNF-21 | Bloqueado fórmula |
| RF-17 | Recompensa por hitos | HU-010 | RNF-16, RNF-17, RNF-18 | Bloqueado hitos |
| RF-18 | Saldo y movimientos | HU-011 | RNF-10, RNF-16, RNF-19 | Propuesto |
| RF-19 | Evitar duplicidad XP/monedas | HU-008, HU-010 | RNF-16, RNF-17 | Propuesto |
| RF-20 | Tienda física y accesorios | HU-012 | RNF-14, RNF-21, RNF-24 | Refinamiento |
| RF-21 | Precio, elegibilidad, disponibilidad | HU-012, HU-013 | RNF-18, RNF-19 | Propuesto |
| RF-22 | Iniciar canje | HU-013 | RNF-10, RNF-17, RNF-18 | Bloqueado reglas |
| RF-23 | Débito transaccional seguro | HU-013 | RNF-16, RNF-17, RNF-18 | Propuesto |
| RF-24 | Registrar pedido y estado | Nueva HU | RNF-10, RNF-18, RNF-19 | Pendiente operación |
| RF-25 | Control de stock | HU-014 (ampliar) | RNF-18, RNF-19 | Propuesto |
| RF-26 | Gestión autorizada de catálogo | HU-014 | RNF-09, RNF-10, RNF-16 | Propuesto |
| RF-27 | Configuración versionada de reglas | HU-009, HU-010 (ampliar) | RNF-16, RNF-17, RNF-19 | Propuesto |
| RF-28 | Futuras lecturas | Nueva HU | RNF-19, RNF-21, RNF-26 | Futuro |

## 2. RNF técnicos transversales a todo incremento
- **Docker y datos:** RNF-01 a RNF-08 y RNF-30.
- **Seguridad:** RNF-09 a RNF-16 para flujos que gestionen usuario, contenido o créditos.
- **Experiencia y capacidad:** RNF-21 a RNF-25.
- **Mantenimiento y pruebas:** RNF-26 a RNF-29.

## 3. Registro de pruebas (plantilla)
| ID prueba | RF/HU | RNF | Escenario | Resultado esperado | Resultado observado | Commit/PR | Estado |
|---|---|---|---|---|---|---|---|
| PENDIENTE | PENDIENTE | PENDIENTE | Definir en sprint | Definir | Sin ejecutar | Sin asignar | No verificado |

## 4. Aprobaciones y control Scrum
Para llevar un RF de «Refinamiento» a «En sprint» se requiere: criterio de aceptación acordado, decisión bloqueante resuelta, HU enlazada, capacidad conocida y selección en Sprint Planning. Para llevarlo a «Verificado» hace falta evidencia del comportamiento **y** de los RNF aplicables.

Una idea registrada en Obsidian entra al Product Backlog para revisión; **no genera un sprint automáticamente**. No cerrar una historia basándose solo en documentación.

## 5. Próximo refinamiento
Priorizar resolución de [DEC-01 — modalidad legal de lectura](25-DECISIONES-PENDIENTES.md), [DEC-09 a DEC-12 — XP y economía](25-DECISIONES-PENDIENTES.md), el alcance de pedidos y la selección del primer MVP.

## S01 — evidencia técnica del incremento

Los RF comerciales anteriores siguen sin implementar. HU-T01 → build/config/arranque/aislamiento (RNF-01/02/03/05/06/07/12/30); HU-T02 → API SQL real, UI, 503 y recuperación (RNF-06/11/27/28); HU-T03 → recreación y persistencia sintética, guardas de propiedad/limpieza (RNF-04/12/27/29). Pruebas y límites en [reporte S01](sprints/S01-REPORTE-PRUEBAS.md). La evidencia técnica no acredita aceptación humana ni requisitos comerciales.

## Prototipo local temporal HU-001/HU-002 — 2026-11-04

| Evidencia | RF/HU | RNF cubiertos de forma acotada | Resultado observado | Referencia de cambio |
| --- | --- | --- | --- | --- |
| API sintética y validaciones | RF-01/02/03, HU-001/002 | 11, 14, 26, 27, 28 | Lista/filtro/detalle/404 y errores saneados | `f4c21ca` |
| Runtime nativo, configuración y diagnóstico | HU-001/002; infraestructura | 01, 05, 06, 12, 30 | Catálogo 200 sin PG, salud 503; configuración parcial rechazada | `ba0308d` |
| React catálogo/ficha/estados | RF-01/02/03, HU-001/002 | 21, 22, 23, 26, 27 | Búsqueda, móvil, vacío/error/reintento, URL y retorno filtrados | `8a28b73` |
| Regresión de teclado | HU-001 | 23, 27 | Se conserva foco al enviar búsqueda/filtro, RED→GREEN | `63dd783` |

[Resultados completos](LOCAL-DEV-CATALOGO-PRUEBAS.md): 45 Backend y 31 Frontend; HTTP y Chromium nativos. No acredita persistencia de obras, rendimiento/capacidad, Windows ni aceptación humana. RNF Docker siguen en el reporte S01 sin ejecutarse en esta modalidad.
