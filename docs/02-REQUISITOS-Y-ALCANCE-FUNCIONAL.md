# Levantamiento de requisitos y alcance funcional

**Objetivo:** evitar que Codex implemente módulos inventados antes de validar necesidades y reglas del negocio.

## Entrevista de descubrimiento — decisiones obligatorias

| ID | Pregunta | Estado |
| --- | --- | --- |
| D-01 | ¿Quién utiliza el e-commerce y qué puede hacer cada actor? | PENDIENTE |
| D-02 | ¿Qué se comercializa: productos físicos, digitales o servicios? | PENDIENTE |
| D-03 | ¿Qué operación debe demostrar el MVP de inicio a fin? | PENDIENTE |
| D-04 | ¿Habrá catálogo, inventario y variantes de producto? ¿Con qué reglas? | PENDIENTE |
| D-05 | ¿Habrá carrito y pedidos? ¿Qué estados y validaciones tendrán? | PENDIENTE |
| D-06 | ¿Existirán pagos en línea, pagos externos o simulación académica? | PENDIENTE |
| D-07 | ¿Se requiere autenticación, cuentas o roles? | PENDIENTE |
| D-08 | ¿Qué datos personales se guardarán y por cuánto tiempo? | PENDIENTE |
| D-09 | ¿Qué operaciones administrativas deben realizarse? | PENDIENTE |
| D-10 | ¿El profesor exige despliegue en nube pública, costos o demostración local? | PENDIENTE |
| D-11 | ¿Cuál es la fecha y el criterio de evaluación? | PENDIENTE |
| D-12 | ¿Qué alcance queda expresamente excluido para la primera entrega? | PENDIENTE |

Estas preguntas se convierten en decisiones documentadas antes de aceptar historias de usuario.

## Catálogo candidato — no son requisitos aprobados

| Posible módulo | Función por evaluar | Prioridad |
| --- | --- | --- |
| Catálogo | Mostrar información de productos o servicios | Sin definir |
| Gestión de datos | Alta, edición o baja lógica de registros | Sin definir |
| Carrito | Preparación de solicitudes de compra | Sin definir |
| Pedidos | Registro y seguimiento de transacciones | Sin definir |
| Identidad | Registro, sesión y autorización | Sin definir |
| Inventario | Disponibilidad y movimientos de stock | Sin definir |
| Pagos | Registro de modalidad o comprobación de pago | Sin definir |
| Administración | Gestión y monitoreo de operaciones | Sin definir |

Ninguna fila de esta tabla autoriza a Codex a crear una pantalla, entidad ni endpoint.

## Formato de requisito funcional (RF)
- **ID:** RF-XXX.
- **Nombre y propósito:** acción observable.
- **Actor:** aprobado por el usuario.
- **Disparador y precondiciones:** cómo comienza el flujo.
- **Flujo principal:** pasos verificables.
- **Flujos alternos y errores:** condiciones de negocio.
- **Datos tratados:** datos de entrada, salida y validaciones.
- **Prioridad y dependencia:** relación con otros requisitos.
- **Criterios de aceptación:** Given/When/Then o ejemplos probables.
- **Estado:** Borrador / En revisión / Aprobado / Implementado / Verificado.
- **Trazabilidad:** diseño, API, datos, pruebas y PR.

## Requisitos no funcionales técnicos (propuestas)
- RNF-T01: arranque reproducible con Docker Compose.
- RNF-T02: persistencia de PostgreSQL mediante volumen.
- RNF-T03: acceso a BD únicamente desde Backend.
- RNF-T04: documentación de variables de entorno y configuración.
- RNF-T05: captura de errores, registro técnico y endpoints de salud.
- RNF-T06: pruebas de integración para los flujos aprobados.
- RNF-T07: ausencia de secretos y datos reales en repositorio.
- RNF-T08: instrucciones para reconstruir el entorno local.

**Importante:** son objetivos técnicos propuestos; falta fijar criterios específicos de medición y aprobarlos. No asignar tiempos ni SLO arbitrarios.

## Gestión de cambios
Una nueva funcionalidad debe incorporarse al backlog con ID, definición, criterio de aceptación y aprobación. Luego Codex podrá diseñarla, implementarla y documentarla. Los cambios en reglas de negocio se reflejan en frontend, backend, base de datos y pruebas cuando afecten a esas capas.

Véase [Plantillas](13-PLANTILLAS-DE-TRABAJO.md) y [Backlog](14-BACKLOG-DE-DEFINICION.md).
