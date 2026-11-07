# Especificación de Requisitos Funcionales (RF) — YitVerse

**Proyecto:** Sistema-EcomerceGeneral · **Curso:** Servicios Cloud  
**Versión:** 0.2 · **Fecha:** 2026-11-03 · **Estado:** línea base documental para refinamiento Scrum.  
**Alcance:** manga, manhwa y lecturas afines inicialmente; accesorios y ediciones físicas; biblioteca de usuario y recompensas por lectura.

> El usuario autorizó el **prototipo local sintético HU-001/HU-002**, implementado en rama para revisión. Su alcance acotado se registra al final; no acredita el catálogo comercial completo. Las demás reglas concretas y criterios no aprobados siguen pendientes. El incremento técnico S01 conserva su evidencia y aceptación pendiente.

## 1. Convenciones para leer los RF
- **VC:** visión confirmada por el usuario, aún no refinada ni autorizada para implementar.
- **PR:** propuesta funcional recomendada, requiere aprobación antes de implementarla.
- **BL:** bloqueado por una decisión o requisito externo (por ejemplo, licencias).
- **FU:** idea futura, fuera del primer MVP mientras no se acuerde.
- **Prioridad A/M/B:** alta/media/baja **propuesta**, no compromiso de sprint.
- **Responsable de aprobación:** Product Owner, por definir formalmente con el usuario.
- Cada requisito terminado se vinculará a **HU → diseño UX / API / DB → prueba → commit/PR**.

## 2. Actores y permisos preliminares
| Actor | Alcance | Estado |
|---|---|---|
| Visitante | Explorar obras y productos visibles | PR; acceso público por confirmar |
| Lector registrado | Cuenta, favoritos, historial, seguimiento, XP, niveles y YitCoins | VC |
| Comprador | Adquirir artículos físicos o canjear créditos según reglas | VC como intención, flujo pendiente |
| Gestor de catálogo / administrador | Mantener contenidos, productos y canjes | PR; identidad/permisos pendientes |

Las funcionalidades de una misma cuenta que también compra no justifican crear un rol separado sin necesidad aprobada.

## 3. Matriz de requisitos funcionales

### 3.1 Catálogo editorial y descubrimiento
| ID | Requisito funcional — el sistema deberá… | Estado | Prio. | HU |
|---|---|---|---|---|
| RF-01 | Presentar un catálogo de obras de manga, manhwa y formatos afines con metadatos autorizados. | VC | A | HU-001 |
| RF-02 | Permitir consultar la ficha individual de una obra, sus formatos y su disponibilidad de lectura/compra. | VC | A | HU-002 |
| RF-03 | Permitir explorar por tipo o categoría y buscar títulos según filtros acordados. | PR | M | HU-001 |
| RF-04 | Distinguir **obra editorial**, **capítulo**, **edición digital/física** y **producto/SKU**. | PR | A | HU-002, HU-012 |
| RF-05 | Permitir incorporar más categorías de lectura sin rehacer el catálogo desde cero. | FU | B | Por definir |

### 3.2 Identidad y biblioteca personal
| ID | Requisito funcional — el sistema deberá… | Estado | Prio. | HU |
|---|---|---|---|---|
| RF-06 | Permitir el registro de usuario para conservar su actividad y recompensas. | VC | A | HU-003 |
| RF-07 | Permitir iniciar/cerrar una sesión y acceder únicamente a información propia. | PR | A | HU-003 |
| RF-08 | Agregar, consultar y retirar obras de **Favoritos**, sin duplicarlas por usuario. | VC | A | HU-004 |
| RF-09 | Permitir **seguir** obras para recuperarlas y reconocer la última posición de lectura. | VC | A | HU-005 |
| RF-10 | Mostrar el historial personal de lecturas, diferenciado de Favoritos y Seguimiento. | VC | M | HU-006 |

### 3.3 Lector y progreso
| ID | Requisito funcional — el sistema deberá… | Estado | Prio. | HU |
|---|---|---|---|---|
| RF-11 | Habilitar lectura digital dentro de la plataforma **solo sobre contenidos con permiso/licencia verificable**. | Parcial local autorizado; oferta real BL | A | HU-007 |
| RF-12 | Guardar y recuperar avance de lectura por usuario y contenido, según granularidad aprobada. | VC | A | HU-005, HU-007 |
| RF-13 | Permitir continuar una lectura previamente iniciada cuando el acceso siga autorizado. | VC | M | HU-005 |
| RF-14 | Registrar eventos de actividad de lectura que puedan validarse, sin equiparar «abrir» con «leer». | PR | A | HU-008 |

### 3.4 XP, niveles y YitCoins
| ID | Requisito funcional — el sistema deberá… | Estado | Prio. | HU |
|---|---|---|---|---|
| RF-15 | Otorgar XP solo por una actividad de lectura considerada válida conforme a reglas acordadas. | VC, reglas BL | A | HU-008 |
| RF-16 | Calcular y mostrar nivel actual, XP total y avance restante hacia el siguiente nivel. | VC, fórmula pendiente | M | HU-009 |
| RF-17 | Acreditar YitCoins cuando el lector alcanza por primera vez un hito de nivel definido. | VC, hitos BL | M | HU-010 |
| RF-18 | Mostrar saldo de YitCoins y un historial comprensible de abonos, débitos y reversos. | PR | M | HU-011 |
| RF-19 | Impedir otorgar dos veces XP o YitCoins por el mismo evento/hito y registrar su procedencia. | PR | A | HU-008, HU-010 |

### 3.5 Tienda física y canjes
| ID | Requisito funcional — el sistema deberá… | Estado | Prio. | HU |
|---|---|---|---|---|
| RF-20 | Presentar ediciones físicas coleccionables y accesorios exclusivos como productos de tienda. | VC | A | HU-012 |
| RF-21 | Distinguir precio monetario, elegibilidad de YitCoins y disponibilidad, según política aprobada. | PR | A | HU-012, HU-013 |
| RF-22 | Permitir iniciar un canje de YitCoins por productos elegibles, condicionado a saldo y reglas. | VC, reglas BL | M | HU-013 |
| RF-23 | Registrar el canje y su débito de forma consistente, rechazando saldo insuficiente o producto no elegible. | PR | A | HU-013 |
| RF-24 | Registrar solicitudes de compra de productos físicos y su estado cuando se apruebe el flujo comercial. | PR | M | Por refinar |
| RF-25 | Gestionar disponibilidad/stock físico evitando vender o canjear más unidades de las autorizadas. | PR | M | HU-014 |

### 3.6 Administración y expansión
| ID | Requisito funcional — el sistema deberá… | Estado | Prio. | HU |
|---|---|---|---|---|
| RF-26 | Ofrecer mantenimiento de fichas editoriales y productos a usuarios autorizados, con permisos aún por definir. | PR | M | HU-014 |
| RF-27 | Permitir parametrizar umbrales de XP, hitos y reglas de canje **sin alterar movimientos históricos**. | PR | M | HU-009, HU-010 |
| RF-28 | Permitir extender el catálogo a novelas, cómics y otras lecturas en futuras versiones. | FU | B | Por definir |

## 4. Criterios de aceptación iniciales por módulo

### RF-01 a RF-05 — catálogo
- **Dado** un catálogo de ejemplo con contenido propio o autorizado, **cuando** se consulta, **entonces** se muestran título, formato y metadatos disponibles; nunca se exige que un título tenga capítulos o productos físicos.
- Ante resultados vacíos o inexistentes, el sistema muestra un estado claro y no inventa información.
- Los filtros y el conjunto mínimo de campos requieren confirmación (DEC-02).

### RF-06 a RF-10 — usuarios y biblioteca
- Una cuenta autenticada consulta únicamente sus favoritos, progresos, recompensas e historial.
- Agregar un favorito ya registrado no crea un duplicado; quitarlo no borra el historial ni la XP.
- El seguimiento y la última lectura son independientes del atributo «favorito».
- Métodos de registro/recuperación y datos obligatorios requieren aprobación (DEC-17).

### RF-11 a RF-14 — lector
- **Incremento local autorizado 2026-11-06:** RF-11 implementado parcialmente para revisión: capítulos propios/expresamente autorizados, CLI privado, manifiestos externos a Git, lista numérica y lector vertical. [Alcance y evidencias](36-LECTOR-CAPITULOS-LOCALES.md). La declaración/comprobante se valida técnicamente; el administrador debe comprobar el derecho real antes de importar. RF-12/13/14, progreso, cuentas, XP y distribución pública siguen pendientes; no se declara HU-007 completa ni se asigna un sprint automáticamente.
- El contenido **no autorizado** no puede abrirse como lectura íntegra desde la plataforma.
- Reabrir una lectura autorizada recupera el progreso guardado sin confundirlo con XP ganada.
- Se debe definir si el avance es por capítulo, página o ambos (DEC-19) y cómo tratar lectura externa (DEC-01).

### RF-15 a RF-19 — experiencia y recompensas
- Un evento de lectura válido acredita XP **una vez**; repetir la misma solicitud no genera otro abono.
- Un evento inválido no acredita XP ni niveles.
- Un hito de nivel no se recompensa más de una vez por usuario, incluso con solicitudes simultáneas.
- XP, umbrales, hitos y cantidades **no tienen valores aprobados** (DEC-09 a DEC-12). «Cada 10 niveles» es solo ejemplo.

### RF-20 a RF-25 — tienda
- El producto diferencia si se compra con dinero, se canjea por YitCoins o admite ambos según reglas aprobadas.
- Con saldo insuficiente, artículo no elegible o sin disponibilidad, el canje se rechaza **sin débito**.
- Si hay dos solicitudes de canje concurrentes, una operación que excedería saldo o stock no puede confirmarse.
- Precios, monedas monetarias, pedidos, entregas y devoluciones siguen sin definición (DEC-04 a DEC-15).

### RF-26 a RF-28 — gestión y futuro
- Un usuario sin permiso no puede alterar fichas, reglas XP ni disponibilidad.
- Las modificaciones de reglas deben tener versión y no reconstruir arbitrariamente movimientos existentes.
- La expansión de géneros no entra al MVP sin nuevo Product Backlog Item aprobado.

## 5. Reglas de negocio transversales propuestas
- **RB-01:** una misma obra puede tener capítulos y varias ediciones; un accesorio puede no corresponder a ninguna obra.
- **RB-02:** el progreso de lectura **no demuestra por sí solo** derecho a recibir XP.
- **RB-03:** XP y YitCoins se asignan desde Backend, nunca mediante valores confiados del navegador.
- **RB-04:** una recompensa de hito puede otorgarse una sola vez por cuenta y hito.
- **RB-05:** el saldo YitCoins debe ser explicable por movimientos auditables.
- **RB-06:** la operación de canje requiere consistencia entre saldo, elegibilidad y stock.
- **RB-07:** la publicación de capítulos, traducciones y materiales de terceros requiere derechos.
- **RB-08:** una intención funcional no es equivalente a historia refinada, sprint comprometido ni código terminado.

Son controles de diseño a validar; las políticas definitivas se registrarán en `docs/22-REGLAS-XP-YITCOINS.md`.

## 6. Exclusiones explícitas de esta versión
**No se han aprobado:** pasarela de pago, compra directa de YitCoins, intercambio o conversión a efectivo, envío real de mercancía, facturación electrónica, marketplace multivendedor, chat, recomendaciones por IA, publicidad, contenido de lectura sin licencia, roles administrativos definitivos o métricas concretas de XP.

## 7. Dependencias y decisiones que bloquean refinamiento
| Decisión | Requisitos afectados | Motivo |
|---|---|---|
| DEC-01 a DEC-03 | RF-01/02/11/12/14/15 | Derechos y modalidad de lectura |
| DEC-09 a DEC-12 | RF-15 a RF-19/27 | XP, niveles, hitos y emisión |
| DEC-13 a DEC-15 | RF-21 a RF-25 | Economía de canjes y reversión |
| DEC-16 a DEC-20 | RF-06 a RF-14 | Identidad, lectura y privacidad |
| DEC-04 a DEC-08 | RF-20 a RF-26 | Operación comercial |
| DEC-22 a DEC-25 | Todos los RF del MVP | Plan académico, sprints y aceptación |

## 8. Control de cambios y trazabilidad Scrum
| Estado | Significado |
|---|---|
| Identificado | Se expresó como idea o necesidad |
| Refinando | Tiene dudas o criterios incompletos |
| Aprobado | Product Owner acepta regla y criterios |
| En sprint | Seleccionado en Sprint Planning |
| Implementado | Existe código y prueba asociada |
| Verificado | Evidencia de aceptación satisfactoria |

**Estado global al publicar:** RF documentados, sin sprints asignados ni pruebas de implementación. Ver [Product Backlog](24-PRODUCT-BACKLOG-SCRUM.md), [visión](20-VISION-FUNCIONAL-YITVERSE.md), [decisiones](25-DECISIONES-PENDIENTES.md), [RNF](27-REQUISITOS-NO-FUNCIONALES.md) y [matriz de trazabilidad](28-MATRIZ-TRAZABILIDAD.md).

## Evidencia acotada HU-001/HU-002 — modalidad local temporal

RF-01 y parte de RF-02/RF-03 se ejercitan mediante seis fichas sintéticas solo lectura y búsqueda/filtro. El usuario autorizó expresamente este prototipo; la aceptación queda pendiente. No se atribuye disponibilidad editorial/comercial, no se habilitan capítulos y no se implementan ediciones/SKU (RF-04). Fuente aislada de persistencia; PostgreSQL sigue previsto, sin instalación local acreditada. Ver [backlog actualizado](24-PRODUCT-BACKLOG-SCRUM.md) y [pruebas](LOCAL-DEV-CATALOGO-PRUEBAS.md). El alcance completo de cada RF mantiene las decisiones de refinamiento originales.
