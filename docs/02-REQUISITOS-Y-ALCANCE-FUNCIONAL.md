# Requisitos funcionales — levantamiento inicial YitVerse

**Versión:** 0.1 — 2026-11-03  
**Estado:** intenciones confirmadas de alto nivel; reglas, casos alternos y aceptación **en refinamiento**. No tratar esta matriz como autorización de desarrollo.

## Requisitos de intención confirmada
| ID | Intención funcional expresada | Criterio todavía por definir |
|---|---|---|
| RF-01 | Mostrar un catálogo de obras manga/manhwa y categorías asociadas | Filtros, fuentes, derechos, metadatos |
| RF-02 | Ofrecer cuenta registrada para experiencia, biblioteca personal y progreso | Forma de registro, privacidad, sesiones |
| RF-03 | Permitir marcar obras favoritas | Duplicados, comportamiento y visibilidad |
| RF-04 | Conservar historial y seguimiento de lectura | Granularidad, categorías, retención |
| RF-05 | Registrar el avance de lectura del usuario | Lectura integrada vs externa autorizada |
| RF-06 | Otorgar XP por lectura válida | Definición de evento, abuso y cantidad |
| RF-07 | Mostrar nivel alcanzado | Curva y umbrales |
| RF-08 | Asignar YitCoins en hitos de nivel | Frecuencia, cantidad, control de una concesión |
| RF-09 | Mostrar saldo y canjear YitCoins por mercancía exclusiva o físico elegible | Economía, transacciones, stock y entregas |
| RF-10 | Ofrecer ediciones físicas y accesorios especiales para coleccionistas | Precios, presentación, logística |
| RF-11 | Ampliar más adelante el catálogo a otras lecturas | Taxonomía extensible |

**No confirmado:** roles administrativos, carrito, pasarelas de pago, cuentas de vendedor, valor monetario de YitCoins, monedas canjeables por efectivo, políticas de envío o lectura de obras sin autorización.

## Reglas y restricciones esenciales
1. Mostrar capítulos completos solo si la plataforma tiene derecho legítimo de ofrecerlos.
2. XP y YitCoins deben acreditarse desde Backend con registro verificable, nunca confiando en cálculos del navegador.
3. El mismo evento y el mismo hito de recompensa no deben premiarse varias veces.
4. Los canjes deben verificar saldo y elegibilidad antes del débito y cuidar concurrencia.
5. No almacenar datos personales adicionales sin finalidad definida.
6. Las funcionalidades comerciales operativas requieren condiciones y políticas aprobadas.

## No funcionales técnicos propuestos
- Arranque local reproducible con Compose.
- Integridad y persistencia en PostgreSQL.
- Separación de cliente, API y base de datos.
- Seguridad de credenciales y validación en Backend.
- Diseño accesible, sencillo y adecuado a lectura prolongada.
- Pruebas de integración y documentación sincronizada con GitHub.

## Trazabilidad
- [Épicas e historias de usuario](24-PRODUCT-BACKLOG-SCRUM.md)
- [Visión del producto](20-VISION-FUNCIONAL-YITVERSE.md)
- [Reglas de progreso](22-REGLAS-XP-YITCOINS.md)
- [Modelo conceptual](23-MODELO-CONCEPTUAL.md)
- [Decisiones pendientes](25-DECISIONES-PENDIENTES.md)

## Plantilla de refinamiento
- ID RF / HU:
- Objetivo y actor:
- Precondición y regla:
- Flujo principal y excepciones:
- Datos requeridos:
- Reglas de seguridad/permiso:
- Aceptación dada/cuando/entonces:
- Prioridad, dependencias y estimación:
- Aprobación y sprint asignado:
- Commit/PR y evidencia de prueba:

No programar una historia solo porque aparece en esta lista. Es necesario refinarla y seleccionarla mediante Scrum.
