# Estado del proyecto

**Fecha de arranque de coordinación:** 2026-11-03

## Estado verificado
- Repositorio `JoseB-H/Sistema-EcomerceGeneral` disponible en GitHub.
- Estructura objetivo de tres contenedores acordada.
- Este repositorio contiene inicialmente instrucciones y documentación compartida para que Codex inicie el desarrollo.

## Pendiente en Codex
- [ ] Crear estructura `Frontend/`, `Backend/`, `Database/`.
- [ ] Definir arquitectura y módulos del e-commerce con el usuario.
- [ ] Implementar Dockerfiles y `docker-compose.yml`.
- [ ] Definir esquema PostgreSQL, migraciones y persistencia.
- [ ] Implementar integración frontend ↔ API ↔ base de datos.
- [ ] Verificar el arranque real y documentar las pruebas.

## Pendiente en Obsidian
- [ ] Abrir una copia local de este repositorio como bóveda si es el destino elegido.
- [ ] Integrar sin sobrescribir los apuntes preexistentes S04–S11.
- [ ] Configurar Obsidian Git o una sincronización Git equivalente.
- [ ] Mantener notas técnicas y decisiones alineadas con lo realmente implementado.

## Registro de entregas
| Fecha | Responsable | Cambio | Prueba / evidencia |
| --- | --- | --- | --- |
| 2026-11-03 | Coordinación | Preparación del contexto para Codex y Obsidian | Archivos de coordinación en GitHub |

**Regla:** marcar tareas completadas solo después de verificarlas. No confundir planes o prototipos fuera del repositorio con código publicado en este repositorio.


## Requisitos RF/RNF — versión 2026-11-03
- [x] Documentados **28 RF** en `docs/02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md`.
- [x] Documentados **30 RNF** en `docs/27-REQUISITOS-NO-FUNCIONALES.md`.
- [x] Publicada matriz RF ↔ HU ↔ RNF en `docs/28-MATRIZ-TRAZABILIDAD.md`.
- [ ] Aceptación de los criterios definitivos y decisiones críticas por Product Owner.
- [ ] Asignación de historias refinadas a un sprint.
- [ ] Pruebas o implementación verificadas: **ninguna acreditada por esta documentación**.

Los módulos de YitVerse no están aprobados automáticamente para implementación. Los próximos acuerdos sobre legalidad del lector, XP, YitCoins, pedidos y MVP deben reflejarse primero en los RF/HU.


## Preparación del desarrollo — 2026-11-03
- [x] Plan técnico de arranque y Sprint 1 **propuesto** documentado en `docs/29-PLAN-INICIO-DESARROLLO.md`.
- [ ] Verificar instalación funcional de Git y Docker Compose en el entorno de Codex/Windows.
- [ ] Aprobar Sprint Goal, fechas y alcance de Sprint 1.
- [ ] Implementar y probar tres contenedores. **No hay implementación confirmada.**

## Sprint 1 — autorización de planificación (2026-11-03)
- [x] El usuario aprobó **iniciar la planificación** del Sprint 1 técnico sin desarrollar módulos comerciales.
- [x] Se publicó la [planificación S01](sprints/S01-PLANIFICACION-TECNICA.md).
- [x] Se publicó la [tarea T01 para Codex](codex/TAREA-T01-CONTENEDORES.md).
- [x] Se abrió [Issue #1](https://github.com/JoseB-H/Sistema-EcomerceGeneral/issues/1) para seguimiento.
- [ ] Determinar calendario, capacidad y compromiso formal del Sprint Backlog.
- [ ] Implementación de Frontend, Backend y Database realizada.
- [ ] Resultados reales de pruebas recibidos y validados.

**Estado actual:** preparación documental completada; código y pruebas siguen pendientes. No confundir la autorización de la planificación con la ejecución del sprint.

## Bóveda de documentación de YitVerse — preparación (2026-11-03)
- [x] Creado archivo de inicio `00 - YitVerse.md`.
- [x] Creado `.gitignore` para excluir configuración local, secretos y archivos académicos.
- [x] Publicada `docs/30-OBSIDIAN-GITHUB-SINCRONIZACION.md`.
- [ ] Instalar y verificar Git for Windows / Git Credential Manager localmente.
- [ ] Clonar repositorio en una carpeta exclusiva de Obsidian, separada de Codex.
- [ ] Abrir bóveda y habilitar Obsidian Git.
- [ ] Comprobar push y pull reales desde el equipo del usuario.

**Importante:** la configuración remota de GitHub no habilita automáticamente sincronización en Obsidian Desktop.
