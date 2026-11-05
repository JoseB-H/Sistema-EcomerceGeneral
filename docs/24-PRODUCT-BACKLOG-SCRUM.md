# Product Backlog inicial — YitVerse

**Versión:** 0.1 — 2026-11-03  
**Estado:** backlog candidato sin nuevo sprint asignado. El usuario autorizó el prototipo local sintético de HU-001/HU-002; implementado en rama para revisión, aceptación pendiente. Las demás historias mantienen su estado.

## Regla Scrum
Las historias expresan intención y su prioridad es **propuesta**. Ninguna tarea pasa a un Sprint Backlog sin comprensión del alcance, aprobación de criterios de aceptación y confirmación de capacidad. Si el usuario agrega una nota, se registra/refina un Product Backlog Item; **no se crea un sprint por cada nota**.

## Épicas
| Épica | Resultado |
| --- | --- |
| E-01 Biblioteca editorial | Descubrimiento y detalle de obras |
| E-02 Identidad y biblioteca personal | Cuenta, favoritos e historial |
| E-03 Lector autorizado | Experiencia de lectura con derechos verificados |
| E-04 Progresión XP | Eventos válidos, niveles y avances |
| E-05 YitCoins | Acreditación, balance y movimientos |
| E-06 Tienda | Productos físicos y accesorios |
| E-07 Canjes | Redención y consistencia de saldo/stock |
| E-08 Arquitectura e integración | Frontend, Backend, Database en Compose |
| E-09 Gestión de catálogo | Administración y mantenimiento de datos |

## Historias candidatas
| ID | Historia de usuario | Épica | Prioridad orientativa | Estado |
| --- | --- | --- | --- | --- |
| HU-001 | Como visitante, quiero explorar títulos y formatos disponibles para descubrir lecturas | E-01 | Alta | Prototipo sintético implementado; revisión pendiente |
| HU-002 | Como visitante, quiero consultar una ficha de obra para conocerla antes de leer o comprar | E-01 | Alta | Prototipo sintético implementado; revisión pendiente |
| HU-003 | Como lector, quiero crear una cuenta para conservar mi experiencia y lecturas | E-02 | Alta | Borrador |
| HU-004 | Como lector, quiero marcar favoritos y retomarlos posteriormente | E-02 | Alta | Borrador |
| HU-005 | Como lector, quiero seguir obras y saber en qué capítulo me quedé | E-02 | Alta | Borrador |
| HU-006 | Como lector, quiero ver el historial de mi actividad de lectura | E-02 | Media | Borrador |
| HU-007 | Como lector autorizado, quiero abrir contenido legalmente disponible y registrar mi avance | E-03 | Dependiente de licencias | Bloqueada por decisión |
| HU-008 | Como lector, quiero ganar XP por una actividad elegible una sola vez | E-04 | Alta, después de HU-007 o alternativa aprobada | Borrador |
| HU-009 | Como lector, quiero conocer nivel actual y progreso restante | E-04 | Media | Borrador |
| HU-010 | Como lector, quiero recibir YitCoins al alcanzar hitos aprobados | E-05 | Media | Borrador |
| HU-011 | Como lector, quiero consultar mi saldo e historial de YitCoins | E-05 | Media | Borrador |
| HU-012 | Como visitante, quiero explorar ediciones físicas y accesorios únicos | E-06 | Alta | Borrador |
| HU-013 | Como lector, quiero canjear YitCoins por artículos elegibles | E-07 | Depende de reglas económicas y de pedido | Borrador |
| HU-014 | Como responsable autorizado, quiero mantener fichas y disponibilidad según reglas de negocio | E-09 | Pendiente | Borrador |
| HU-T01 | Como equipo, quiero iniciar los 3 contenedores con Compose para reproducir el sistema localmente | E-08 | Alta | Propuesta técnica |
| HU-T02 | Como equipo, quiero una prueba de comunicación frontend-backend-PostgreSQL para validar arquitectura | E-08 | Alta | Propuesta técnica |
| HU-T03 | Como equipo, quiero verificar persistencia, fallos y reinicios sin perder datos | E-08 | Alta | Propuesta técnica |

## Criterios de aceptación preliminares para refinamiento

### HU-001 — Explorar catálogo
- Dada una lista de **obras de prueba autorizadas**, cuando el visitante abre Explorar, puede ver título, tipo de obra y portada solo si existe derecho para utilizarla.
- Al no haber resultados, se muestra estado vacío.
- No supone que el visitante puede leer capítulos completos.

### HU-001/HU-002 — incremento local autorizado (2026-11-04)

El usuario autorizó explorar seis obras ficticias, buscar sin distinguir acentos/mayúsculas, filtrar manga/manhwa y abrir su ficha por URL directa. Cada ficha muestra título, formato, géneros y sinopsis ficticios, arte geométrico propio y vuelta al catálogo conservando filtros. Se incluyen carga, error/reintento, vacío, obra/página desconocida y adaptación móvil. La fuente declara `synthetic`, `persisted: false`; no hay lectura ni disponibilidad de compra.

Implementado en `feat/local-dev-catalogo`, desde S01 `e672e2e`; [diseño/alcance](superpowers/specs/2026-11-04-local-dev-catalogo-design.md), [ejecución Windows](LOCAL-DEV-CATALOGO.md) y [evidencia](LOCAL-DEV-CATALOGO-PRUEBAS.md). PostgreSQL permanece como tecnología futura de persistencia; no se simula salud ni se guarda información del catálogo. Docker pausado, S01/PR #3 conservados. La revisión del prototipo y su ejecución real en Windows quedan pendientes; esta autorización no crea ni cierra un sprint ni autoriza las demás historias.

### HU-004 — Favoritos
- Dado un usuario autenticado, cuando guarda una obra, esta aparece en su biblioteca.
- La misma obra no aparece duplicada en favoritos para la misma cuenta.
- Quitar favorito no borra historial ni XP.

### HU-005 — Seguimiento
- El usuario puede retomar desde el avance registrado.
- El historial diferencia capítulos empezados/completados según reglas por definir.
- El progreso no constituye prueba suficiente para ganar XP.

### HU-008 — XP
- Un evento no válido o duplicado no concede XP.
- Un evento válido concede XP una sola vez y queda vinculado al usuario y a la causa.
- La cantidad de XP aún no está definida.

### HU-010 — Hitos
- Se otorga una recompensa solo cuando el hito aprobado es alcanzado por primera vez.
- El mismo hito no puede abonarse dos veces, aunque se repita la solicitud.
- La periodicidad y el número de monedas todavía se deben definir.

### HU-013 — Canjes
- Sin saldo suficiente, el canje se rechaza sin modificar movimientos.
- Un canje exitoso comprueba saldo y artículo elegible en una operación consistente.
- Las devoluciones/cancelaciones requieren reglas aprobadas.

### HU-T01/02 — Tres contenedores
- Los servicios frontend, backend y database se construyen y arrancan con Docker Compose.
- PostgreSQL no se publica directamente al navegador.
- Se verifica la conexión de Backend a la base y una petición del Frontend a la API.
- El entorno no exige servicios de pago obligatorios.

## Orden tentativo por incrementos (NO sprints fechados)

1. **Descubrimiento y arquitectura:** cerrar derechos de contenido, MVP, actores, datos y Compose; documentar criterios.
2. **Catálogo de prueba y conexión:** integración técnica y fichas con datos de prueba autorizados.
3. **Cuenta y biblioteca personal:** persistencia de favoritos/seguimiento/historial.
4. **Lectura válida y XP:** solo si la forma autorizada de lectura está aprobada.
5. **Niveles, YitCoins y canjes simulados:** validar economía y fraude antes de canjes reales.
6. **Tienda y operaciones reales:** reglas de pedidos, entregas y obligaciones legales ya definidas.

Los incrementos **no son sprints automáticos**. Duración propuesta de sprint: dos semanas, aún pendiente de confirmación en [Scrum](16-MARCO-SCRUM.md).

## Decisiones de refinamiento
- ¿Qué usuario y flujo exacto demostrarán primero?
- ¿Qué obras de prueba pueden mostrarse y leerse legalmente?
- ¿Se permite únicamente lectura integrada o también seguimiento de una obra leída fuera de la plataforma?
- ¿Cuáles son las reglas de acreditación y canje?
- ¿Qué interfaces y datos se consideran imprescindibles para la primera demo?

Referencias: [visión](20-VISION-FUNCIONAL-YITVERSE.md), [gamificación](22-REGLAS-XP-YITCOINS.md), [decisiones](25-DECISIONES-PENDIENTES.md).


## Relación con la especificación RF/RNF (2026-11-03)
La visión se ha descompuesto en 28 RF y 30 RNF. Las prioridades de esta tabla son orientativas; algunas historias existentes deberán ampliarse, otras dividirse y otras crearse en refinamiento, **no automáticamente**.

- [Requisitos funcionales](02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md).
- [Requisitos no funcionales](27-REQUISITOS-NO-FUNCIONALES.md).
- [Matriz RF/HU/RNF](28-MATRIZ-TRAZABILIDAD.md).

Ejemplo: HU-008 se vincula con RF-14/15/19 y RNF-16/17/20, pero sigue sin entrar a un sprint hasta definir lectura válida y cantidad XP. HU-013 se vincula con RF-21/22/23 y RNF-17/18/19, bloqueada por economía del canje. No marcar ninguna historia como implementada por actualizar estos documentos.

## S01 — trabajo técnico candidato (2026-11-03)
El usuario autorizó iniciar la **planificación** del primer sprint. HU-T01, HU-T02 y HU-T03 son los ítems técnicos propuestos. Se encuentran detallados en [planificación S01](sprints/S01-PLANIFICACION-TECNICA.md) y [tarea para Codex](codex/TAREA-T01-CONTENEDORES.md), con seguimiento en [Issue #1](https://github.com/JoseB-H/Sistema-EcomerceGeneral/issues/1).

**No se ha aprobado un calendario ni cerrado el compromiso del Sprint Backlog.** Las historias de negocio HU-001 a HU-014 continúan fuera de este sprint hasta su refinamiento.

## Refinamiento visual de HU-001/HU-002 — 2026-11-04

El usuario autorizó reemplazar el verde provisional por una interfaz editorial azul oscura, sobre el mismo prototipo sintético. Implementado en `feat/ui-azul-nocturno` para revisión: [capturas, pruebas y límites](UI-AZUL-NOCTURNO.md). No amplía RF comerciales, modifica los seis registros ni crea un nuevo sprint. Criterios funcionales y aceptación del usuario siguen vigentes; revisión estética pendiente.
