# Especificación de Requisitos No Funcionales (RNF) — YitVerse

**Proyecto:** Sistema-EcomerceGeneral · **Versión:** 0.1 · **Fecha:** 2026-11-03  
**Estado:** restricciones técnicas confirmadas y propuestas medibles pendientes de aceptación. **Ningún RNF se declara probado.**

## 1. Objetivo y estado
Los RNF determinan **cómo** debe comportarse la solución y cuáles son sus condiciones de calidad, seguridad y operación. Los RF se definen en [Requisitos Funcionales](02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md).

Estados:
- **C:** condición técnica confirmada por el usuario (tres contenedores, tecnologías y uso de herramientas sin costo obligatorio).
- **P:** propuesta de calidad/seguridad por validar; no equivale a decisión aprobada.
- **D:** depende de decisión aún abierta (por ejemplo, despliegue, volumen de usuarios, datos o política legal).

**Medición:** una prueba escrita y repetible, su resultado y entorno serán obligatorios al marcar «Verificado». En rendimiento y capacidad **no se inventan milisegundos, porcentajes ni números de usuarios**: los umbrales finales son parámetros por aprobar después de medir la línea base.

## 2. Infraestructura y operación
| ID | Categoría | RNF — la solución deberá… | Estado | Verificación/aceptación propuesta |
|---|---|---|---|---|
| RNF-01 | Arquitectura | Mantener tres servicios separados: Frontend React/Vite, Backend Node/Express y Database PostgreSQL. | C | Ver estructura/Compose y demostrar responsabilidades por servicio. |
| RNF-02 | Contenedores | Poder construirse y arrancar con Docker Compose usando instrucciones reproducibles. | C | En un equipo limpio ejecutar build/up y confirmar salud de los tres servicios. |
| RNF-03 | Red | Mantener PostgreSQL accesible solo para Backend, sin exposición pública de su puerto. | C | Revisar Compose/red y confirmar que el navegador no conecta a BD. |
| RNF-04 | Persistencia | Conservar datos PostgreSQL tras reiniciar/recrear el contenedor sin borrar el volumen. | C | Escribir registro sintético, recrear servicio, consultar registro. |
| RNF-05 | Configuración | Separar configuración y credenciales por ambiente; publicar `.env.example` sin secretos. | P | Verificar ausencia de credenciales en Git y arranque con variables documentadas. |
| RNF-06 | Disponibilidad | Informar estado de salud de Backend/Database y gestionar dependencias al arrancar. | P | Ejecutar healthchecks, forzar dependencia temporalmente caída, observar diagnóstico. |
| RNF-07 | Portabilidad | Permitir reproducir el laboratorio en un entorno compatible con Docker y Git sin servicios pagos obligatorios. | C | Seguir README desde clon limpio, registrar SO/versiones y problemas encontrados. |
| RNF-08 | Recuperación | Documentar copia y restauración de datos; no confundir volumen con respaldo. | P | Realizar una restauración de datos sintéticos en entorno de prueba. |

## 3. Seguridad, privacidad y legalidad
| ID | Categoría | RNF — la solución deberá… | Estado | Verificación/aceptación propuesta |
|---|---|---|---|---|
| RNF-09 | Autenticación | Proteger recursos personales mediante mecanismo de sesión/autenticación definido, sin exponer contraseñas. | D | Pruebas de acceso no autenticado, inicio/cierre de sesión e intento de acceso indebido. |
| RNF-10 | Autorización | Impedir que una cuenta consulte/modifique biblioteca, historial, XP, YitCoins o pedidos ajenos. | P | Pruebas negativas usuario A intentando leer/escribir recursos de B. |
| RNF-11 | Validación | Validar entradas del servidor, usar SQL parametrizado y controlar errores sin revelar detalles internos. | P | Pruebas de campos incorrectos e intentos simples de inyección; verificar respuestas seguras. |
| RNF-12 | Secretos | No versionar `.env`, tokens, contraseñas, backups o datos privados en repositorio público. | P | Inspección del repositorio, gitignore y revisión automatizable de secretos. |
| RNF-13 | Privacidad | Recoger solo datos personales necesarios, con finalidad, acceso y retención documentados. | D | Matriz campo→finalidad y revisión de permisos; requisitos legales antes de operación real. |
| RNF-14 | Derechos de autor | Restringir la visualización de capítulos, portadas y traducciones de terceros a materiales con derechos acreditados. | D | Inventario de procedencia/licencia y prueba de bloqueo de contenido sin autorización. |
| RNF-15 | Transportes seguros | Utilizar HTTPS en despliegues externos que manejen cuentas o datos personales. | D | Prueba de acceso TLS y redirección/denegación de HTTP según despliegue aprobado. |
| RNF-16 | Auditoría | Dejar trazas de XP, hitos, YitCoins, canjes y reversos sin registrar datos sensibles innecesarios. | P | Inspección de movimientos y operaciones simuladas; cada una con motivo y referencia. |

## 4. Integridad de datos y economía de recompensas
| ID | Categoría | RNF — la solución deberá… | Estado | Verificación/aceptación propuesta |
|---|---|---|---|---|
| RNF-17 | Idempotencia | Impedir doble asignación de XP/YitCoins al reintentar eventos o hitos. | P | Enviar solicitudes duplicadas y concurrentes; comprobar un único movimiento elegible. |
| RNF-18 | Consistencia | Ejecutar canjes como operaciones atómicas de saldo, elegibilidad y disponibilidad. | P | Simular fallos y concurrencia; no aceptar saldo negativo ni doble gasto. |
| RNF-19 | Integridad relacional | Mantener claves/restricciones y migraciones versionadas en PostgreSQL; evitar duplicaciones semánticas. | P | Revisar modelo lógico, ejecutar migraciones y probar restricciones. |
| RNF-20 | Prevención de abuso | Restringir concesiones basadas solo en clic/recarga; usar validación de lectura acorde a reglas aprobadas. | D | Simular recarga, pestañas repetidas y eventos inválidos; comprobar que no conceden XP. |

## 5. Experiencia de usuario y rendimiento
| ID | Categoría | RNF — la solución deberá… | Estado | Verificación/aceptación propuesta |
|---|---|---|---|---|
| RNF-21 | Usabilidad | Proporcionar navegación comprensible y estados de carga, vacío, error y confirmación, sin saturar el lector. | P | Revisión de tareas (descubrir, favorito, continuar), test manual de estados. |
| RNF-22 | Adaptabilidad | Mantener vistas utilizables en móvil y escritorio, sin desbordes que impidan acciones críticas. | P | Comprobar anchuras acordadas con pruebas responsivas y capturas. |
| RNF-23 | Accesibilidad | Ofrecer controles con etiquetas, foco visible, navegación por teclado y alternativas a imágenes informativas. | P | Auditoría de teclado y accesibilidad; proponer WCAG 2.2 AA como objetivo a aprobar. |
| RNF-24 | Rendimiento | Medir tiempos de carga de catálogo, detalle, biblioteca y API en escenarios definidos antes de fijar umbrales. | D | Registrar p50/p95, volumen de datos, equipo y red; acordar umbrales antes de aceptación. |
| RNF-25 | Capacidad | Medir concurrencia y comportamiento con datos sintéticos para justificar dimensionamiento. | D | Prueba de carga reproducible con perfiles aprobados y evidencia de recursos. |

## 6. Mantenimiento, observabilidad y documentación
| ID | Categoría | RNF — la solución deberá… | Estado | Verificación/aceptación propuesta |
|---|---|---|---|---|
| RNF-26 | Mantenibilidad | Conservar separación entre rutas, reglas de negocio y persistencia dentro del único Backend. | P | Revisión de código, módulos cohesionados y ausencia de acceso SQL en Frontend. |
| RNF-27 | Pruebas | Incluir pruebas automatizadas o reproducibles para los flujos aprobados y casos negativos críticos. | P | Ejecución registrada y vinculada a RF/HU, no solo prueba manual verbal. |
| RNF-28 | Observabilidad | Registrar errores y eventos técnicos sin exponer secretos ni contenido privado de lectura innecesariamente. | P | Simular error controlado y localizar logs útiles sin datos confidenciales. |
| RNF-29 | Trazabilidad | Vincular cambios de código con RF/HU, PR/commit, evidencia y actualización de documentación. | P | Revisar entregas: vínculo requisito→cambio→prueba y acta de sprint. |
| RNF-30 | Costos y dependencias | Priorizar software y herramientas gratuitas para el laboratorio; no introducir APIs/servicios pagos obligatorios. | C | Lista de dependencias y requisitos de ejecución; revisar términos/licencias. |

## 7. Parámetros medibles aún por aprobar
| Métrica | Medición propuesta | Objetivo numérico |
|---|---|---|
| Tiempo de respuesta de API | percentil 95 con dataset y carga definidos | POR DEFINIR |
| Rendimiento del catálogo | tiempo hasta contenido utilizable, equipo y red definidos | POR DEFINIR |
| Concurrencia | usuarios simultáneos y operaciones por minuto | POR DEFINIR |
| Disponibilidad de despliegue remoto | ventana y método de medición | NO APLICA hasta aprobar despliegue |
| RPO/RTO | ensayo de copia y restauración | POR DEFINIR si se requiere continuidad |
| Accesibilidad | revisión manual y automatizada con referencia acordada | PROPUESTA WCAG 2.2 AA |
| Cobertura/pruebas | casos vinculados a RF priorizados | POR DEFINIR |

Un porcentaje arbitrario de cobertura o tiempo de respuesta no será un criterio de aceptación hasta disponer de una línea base y objetivos acordados con el equipo.

## 8. Prioridades de verificación por etapas (propuestas)
| Etapa | RNF a verificar primero |
|---|---|
| Integración base Docker | RNF-01 a RNF-07, RNF-30 |
| Identidad y biblioteca | RNF-09 a RNF-13, RNF-21 a RNF-23 |
| Gamificación y canjes | RNF-16 a RNF-20 |
| Calidad transversal | RNF-24 a RNF-29 |
| Operación real | RNF-08, RNF-13 a RNF-15, límites cuantificados |

## 9. Reglas de cierre y Scrum
- RNF **Propuesto/Dependiente** se convierte en **Aprobado** después de acordar criterio y contexto de prueba.
- Codex nunca lo marca «Cumplido» únicamente por incluir una librería o una configuración.
- Cada RF implementado debe considerar sus RNF asociados antes de pasar Definition of Done.
- Los umbrales y decisiones aprobadas deberán registrarse con fecha, Product Owner, sprint y PR.

**Relacionado:** [RF](02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md) · [Visión YitVerse](20-VISION-FUNCIONAL-YITVERSE.md) · [Reglas XP](22-REGLAS-XP-YITCOINS.md) · [Riesgos](26-RIESGOS-Y-CONTROLES.md) · [Matriz de trazabilidad](28-MATRIZ-TRAZABILIDAD.md).
