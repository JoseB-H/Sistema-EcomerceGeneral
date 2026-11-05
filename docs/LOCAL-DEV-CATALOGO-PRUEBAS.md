# Evidencia — prototipo local HU-001/HU-002

**Fecha:** 2026-11-04 (cliente; ejecución UTC hasta 2026-11-05). **Base preservada:** S01 `e672e2e541e90a41319a320eb20d9ea1cd48e1ca`. **Rama:** `feat/local-dev-catalogo`. Revisión y aceptación del usuario pendientes. [Guía Windows](LOCAL-DEV-CATALOGO.md).

## Entorno y método

Linux cloud aislado con Node.js 24.22.1/npm y Chromium del entorno. Express real en `127.0.0.1:3000`, Vite real en `localhost:5173`, sin credenciales PG configuradas. No se ejecutaron comandos Docker ni se usaron sus contenedores para servir este prototipo. No se instalaron nuevas dependencias del proyecto: se mantienen los lockfiles y versiones de S01.

Se aplicaron las skills Superpowers de planificación, ejecución, TDD, depuración sistemática y verificación, más revisión independiente de rama. TDD: pruebas Backend de catálogo fallaron por adapter ausente antes de implementarlo; las del cliente/componentes Frontend fallaron por módulos ausentes antes de escribirlos; después se ejecutaron suites completas. Los tests originales de S01 permanecen incluidos.

Las suites HTTP necesitan sockets loopback: en este entorno se ejecutaron fuera del sandbox restrictivo. No se tomó como evidencia un resumen del runner aislado que no ejecutaba los casos internos.

## Resultados observados

| Verificación | Comando o método | Resultado |
| --- | --- | --- |
| Backend | `npm --prefix Backend test` | **45/45**, 0 fallos, 0 omitidas: 26 originales + 19 de catálogo/configuración/runtime nativo |
| Frontend | `npm --prefix Frontend test` | **31/31**, 0 fallos: 11 originales + 20 de cliente/catálogo/ficha y foco |
| Build prototipo | `npm --prefix Frontend run build:local` | Aprobado; catálogo cargado condicionalmente |
| Build técnico conservado | `npm --prefix Frontend run build` | Aprobado; mantiene la pantalla S01 |
| Express directo | GET `127.0.0.1:3000/api/works` | 200, seis fichas, `source: {kind: synthetic, persisted: false}` |
| Proxy Vite | GET `localhost:5173/api/works?q=ÓRBITA&format=manhwa` | 200, únicamente `orbita-de-papel` |
| Detalle / desconocido | GET `/api/works/archivo-aurora`, `/api/works/no-existe` | 200 / 404 respectivamente |
| Salud sin PostgreSQL | GET `/api/health`, directo y por proxy | **503 degradado**, DB indisponible; no se simula éxito |
| Navegador real | Chromium, 1440×1000 y 390×844 | Catálogo, filtro, ficha, volver, estados, teclado y móvil aprobados; cero errores JavaScript |

Los tests de Backend incluyen entradas desconocidas/repetidas/no escalares, límites de consulta, acentos y mayúsculas, repositorio con copias defensivas, ID inválido/no encontrado, fallos del proveedor sin detalles internos, configuración PG ausente/parcial/completa y proceso real con puerto liberado al cerrar. En Windows el test de proceso no exige semántica POSIX de SIGTERM: comprueba la liberación del puerto; Ctrl+C real en Windows sigue sin verificar.

Los tests de Frontend verifican query/format y señal de cancelación, datos que realmente declaran procedencia sintética, JSON/HTML inválido, red y 503, estados de carga/vacío/error, reintento, URL directa y desconocida, búsqueda nueva que cancela la anterior, desmontaje y tiempo máximo de espera. No se introdujo una copia local de datos para ocultar un fallo de API.

Chromium verificó seis tarjetas y aviso visible; salto por teclado al contenido; búsqueda `ÓRBITA` + manhwa; ficha y vuelta con filtros conservados; historial atrás del navegador; vacío y limpiar; obra/página inexistentes. Se interrumpió de forma controlada la petición del catálogo en el navegador, se retiró la interrupción y Reintentar recuperó las seis tarjetas. `/estado` mostró el error esperado de DB. Catálogo/ficha móviles no presentaron desbordamiento horizontal. Capturas locales de la sesión se guardaron en `/tmp/yitverse-catalog-desktop.png`, `/tmp/yitverse-work-detail.png`, `/tmp/yitverse-catalog-mobile.png` y `/tmp/yitverse-detail-mobile.png`; no son requisitos del repositorio ni evidencia de ejecución Windows.

## Problemas resueltos y decisiones

- Vite rechaza el modo `local` por estar reservado a `.env.local`. Se conservó el script público `build:local` usando internamente `--mode prototype`; ambos builds se verificaron después.
- Las flechas de texto no se veían de forma consistente en Chromium. Se sustituyeron por SVG propios reutilizables, sin añadir paquetes ni imágenes externas.
- Windows no ofrece la misma semántica que POSIX al enviar SIGTERM desde `child.kill`; el test exige liberación del puerto en todos los sistemas y salida ordenada por señal solo en POSIX.
- La autorización explícita del usuario para implementar este prototipo permitió ejecutar el plan sin otra aprobación intermedia. La apariencia verde/editorial es provisional y puede refinarse tras revisión.
- Se reutilizó el checkout cloud aislado con árbol limpio. No se creó otro worktree ni se accedió al disco Windows. Los helpers ejecutables de las skills cloud no estaban disponibles como archivos; se mantuvo un registro manual de tareas/decisiones y se verificó con comandos reales.

## Límites y entrega

Windows/PowerShell, instalación PostgreSQL nativa, SQL del catálogo, persistencia de fichas, benchmarks/carga y una auditoría WCAG completa: **NO EJECUTADOS** en esta entrega. Las comprobaciones de teclado/responsividad son acotadas; no acreditan toda la norma. Tampoco se volvieron a ejecutar los once casos Docker T01: su evidencia histórica continúa en el [reporte S01](sprints/S01-REPORTE-PRUEBAS.md).

No se implementa lectura, autenticación, XP, monedas ni comercio. No hay contenidos editoriales externos ni datos personales. La aceptación de HU-001/HU-002 queda limitada al prototipo sintético y pendiente del usuario; no se declara terminado un sprint ni todo RF-02 de disponibilidad comercial. No se fusiona con `main` ni se modifica el PR #3.

## Revisión independiente de rama

Se revisó el diff completo `e672e2e…8a28b73` frente al diseño y plan. No se encontraron hallazgos críticos; el revisor señaló dos menores. La pérdida de foco al enviar una búsqueda se elevó a importante por afectar cada flujo de teclado: una regresión la reprodujo y se corrigió controlando el borrador sin desmontar el formulario (`63dd783`), con 31/31 pruebas Frontend verdes. La codificación porcentual inválida en un ID (por ejemplo `/api/works/%E0%A4%A`) continúa respondiendo con 503 saneado en lugar de 400: pendiente menor, sin exposición de detalles ni impacto sobre enlaces generados por la UI.

El revisor no pudo volver a ejecutar HTTP por restricciones de sockets de su sandbox. No certificó Windows, PostgreSQL vivo, Docker, estado remoto/PR ni los documentos finales en redacción. Se aceptan como límites: el autor verifica HTTP/Chromium y rama remota por separado; Windows y PostgreSQL nativo permanecen no ejecutados; Docker/PR #3 están fuera de esta operación. La comprobación acotada de teclado/móvil no se interpreta como auditoría WCAG. No hubo segunda ronda de revisión; la corrección se verificó mediante regresión y suite completa.

Verificación final de integridad: `git diff --check` limpio; Dockerfiles, Compose, Database, scripts S01, servidor/configuración/SQL S01 y ambos lockfiles sin cambios frente a `e672e2e`. Los enlaces rotos preexistentes a un contrato API aún no publicado se sustituyeron por la documentación real de Backend. GitHub confirmó `main` en `b32ee01` y rama S01 en `e672e2e` antes de publicar únicamente la rama local. No se invocó ninguna operación sobre el PR #3.

Incidencia observada al cerrar la sesión final: el supervisor `node --watch` de Node 24.22.1 terminó con una aserción interna `FSEventWrap` durante `FSWatcher.close`; 3000 y 5173 quedaron libres. No se reprodujo con un programa mínimo bajo watch, por lo que no se atribuye una causa definitiva ni se afirma resuelto el observador. Se verificó la alternativa sin watch (`node --env-file-if-exists=.env src/dev-server.js` desde Backend): catálogo200, salud503, Ctrl+C salida0 y puerto liberado. La guía contiene ese comando; no requiere cambiar código ni instalar otra versión. Windows pendiente.
