---
tags: [yitverse, continuidad, historial, respaldo]
tipo: bitacora
actualizado: 2026-11-05
---
# Bitácora de continuidad — YitVerse

> [!important] Leer primero al reanudar cualquier chat
> **Estamos en el DISEÑO VISUAL V2 de YitVerse**, NO retomando la infraestructura desde cero. El sistema se implementará mediante Codex después de que se cierre el diseño que corresponda.

## Estado de los frentes

| Frente | Responsable / espacio | Estado comprobable | Retomar desde |
| --- | --- | --- | --- |
| Diseño visual YitVerse V2 | Chat de diseño + Figma | Archivo Figma creado, cinco vistas encargadas | [[31-YITVERSE-DISENO-VISUAL-V2]] |
| Visión y requisitos del producto | Documentación en GitHub/Obsidian | Visión, RF, RNF y trazabilidad documentados; decisiones de negocio aún pendientes | [[20-VISION-FUNCIONAL-YITVERSE]] |
| Arquitectura Docker | Codex | Sprint 1 técnico planificado; implementación no acreditada en esta bitácora | [[sprints/S01-PLANIFICACION-TECNICA]] |
| Obsidian y respaldo | GitHub + Obsidian Git local | Copia Markdown versionada en GitHub; sincronización del equipo aún no verificada | [[30-OBSIDIAN-GITHUB-SINCRONIZACION]] |

## Último acuerdo con el usuario
**Fecha: 2026-11-05.**

El usuario detectó que la conversación había regresado por error a la infraestructura y aclaró que el trabajo real estaba en el **diseño visual**. Se confirmó retomar la **segunda iteración V2** de YitVerse y el usuario indicó **«ok procede»**.

Después pidió explícitamente **registrar en Obsidian las tareas, cambios y punto exacto de avance**, para tener una referencia ante cortes de contexto o pérdida de continuidad.

## Qué ya se decidió para diseño
- Look editorial oscuro, **negro + azul eléctrico**.
- Hero impactante con narrativa visual.
- Portadas con mayor detalle y personalidad, no simples formas geométricas.
- Jerarquía clara: destacados, continuar explorando, nuevos títulos y categorías.
- Vistas objetivo: Home, Explorar, Detalle, Home móvil y mini guía de estilos.
- Figma es la herramienta de diseño; **Codex no debe crear el frontend final de estas vistas hasta que se indique**.

## Qué no debe hacerse al reanudar
- No confundir la planificación técnica de tres contenedores con el punto de avance visual.
- No asegurar que el usuario perdió sus conversaciones: el historial de chats y la copia GitHub son cosas diferentes.
- No afirmar que las pantallas están terminadas sin comprobar Figma.
- No convertir ideas visuales en requisitos comerciales aprobados sin validación.
- No afirmar sincronización local de Obsidian hasta probar pull y push en Windows.

## Mecanismo de respaldo desde ahora
1. Al cerrar cada bloque de trabajo, **actualizar esta nota** con fecha, decisión, enlace a Figma/PR/commit, tareas realizadas, tareas pendientes y próxima acción.
2. Guardar especificaciones más largas en documentos separados; enlazarlos aquí mediante [[wikilinks]].
3. GitHub conserva versiones de estos Markdown. Obsidian los muestra **cuando se abra/sincronice una copia del repositorio**.
4. Si otro chat no recuerda el trabajo previo, darle el enlace a esta bitácora en GitHub y pedir que la lea antes de trabajar.

## Registro de hitos
| Fecha | Área | Hecho | Evidencia / estado |
| --- | --- | --- | --- |
| 2026-11-03 | Documentación | Creados documentos de visión, requisitos, Scrum y coordinación | En el repositorio |
| 2026-11-05 | Conversación | Confirmado que la prioridad activa es **Diseño Visual V2** | Acuerdo del usuario |
| 2026-11-05 | Figma | Creado archivo editable «YitVerse — Dirección Visual V2 · Editorial Dark» | [Abrir Figma](https://www.figma.com/design/dCLgExm48T9Ui6sTcEIhwu) |
| 2026-11-05 | Respaldo | Iniciada esta bitácora y la especificación visual V2 en GitHub | Notas Markdown versionadas |

**Próxima acción:** terminar las cinco pantallas visuales editables, registrar el resultado aquí y presentar el enlace de Figma al usuario.
