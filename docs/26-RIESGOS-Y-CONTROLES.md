# Riesgos iniciales del producto — YitVerse

**Estado:** análisis preliminar, no dictamen jurídico, no evidencia de controles implementados.

| ID | Riesgo | Consecuencia | Prevención o decisión necesaria |
| --- | --- | --- | --- |
| R-01 | Incluir capítulos, traducciones, ilustraciones o portadas sin derechos adecuados | Reclamaciones y retirada de contenido | Obtener licencia/autorización verificable; para demo usar material propio, de prueba o con permisos |
| R-02 | Otorgar XP por clic, recarga o automatizaciones | Abuso e inflación de niveles | Validación Backend, idempotencia, límites |
| R-03 | Doble acreditación de YitCoins | Saldos incorrectos | Unicidad de hito, ledger y transacciones |
| R-04 | Doble canje concurrente | Pérdidas y stock negativo | Transacción atómica y verificación de saldo/stock |
| R-05 | Recompensas excesivamente valiosas | Costos de entrega insostenibles | Definir presupuesto, elegibilidad y equilibrio de economía |
| R-06 | Acumular datos innecesarios sobre hábitos de lectura | Pérdida de privacidad y confianza | Minimización, transparencia y controles de acceso |
| R-07 | Exponer archivos .env, contraseñas o datos reales en GitHub público | Vulneración de seguridad | Variables de entorno, .gitignore, revisión de commits |
| R-08 | Sobrecargar interfaz con banners, menús y gamificación | Lectura incómoda y abandono | UI minimalista y pruebas de usabilidad |
| R-09 | Dar por implementada una historia documentada | Planificación falsa | Estados distintos: idea, aprobado, implementado, verificado |
| R-10 | Publicar PDFs académicos en un repositorio público | Uso no autorizado | Mantener materiales de clase en bóveda privada/local |
| R-11 | Costos de envío, devolución, stock o servicios no previstos | Viabilidad comprometida | Validar operación comercial y costos antes de canjes reales |

## Salvaguardas para la primera demostración
- Ningún episodio, capítulo, portada o traducción de terceros sin licencia adecuada.
- YitCoins de prueba sin valor monetario real ni promesa de envío físico hasta aprobar la economía.
- No almacenar información de tarjetas ni integrar procesadores de pago sin necesidad aprobada.
- No usar telemetría intrusiva para demostrar lectura; preferir eventos mínimos y transparentes.
- No inventar estadísticas de usuarios, ventas o tasas de retención.
- Documentar limitaciones: una demo académica no equivale a producción.
- Revisar legislación aplicable a propiedad intelectual, protección al consumidor, datos personales y promociones antes de operar comercialmente.

## Dependencias
- [Visión funcional](20-VISION-FUNCIONAL-YITVERSE.md)
- [XP/YitCoins](22-REGLAS-XP-YITCOINS.md)
- [Decisiones abiertas](25-DECISIONES-PENDIENTES.md)
