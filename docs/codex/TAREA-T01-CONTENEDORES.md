# T01 — Crear e integrar los tres contenedores Docker

**Proyecto:** YitVerse / Sistema-EcomerceGeneral  
**Tipo:** historia técnica · **Épica:** E-08 Arquitectura e integración  
**HU vinculadas:** HU-T01, HU-T02 y HU-T03  
**Sprint objetivo:** S01 (planificación aprobada; fechas y compromiso pendientes)  
**Estado:** especificación lista para revisión en Sprint Planning; sin código implementado.

## Objetivo para Codex

Preparar una base técnica ejecutable compuesta exactamente por **tres servicios**: `frontend` (React + Vite), `backend` (Node.js + Express) y `database` (PostgreSQL). Integrarlos con Docker Compose y validar de extremo a extremo una petición HTTP que depende de la BD. El único interfaz visible es una pantalla de diagnóstico técnico, **sin diseño de módulos comerciales**.

## Contexto obligatorio

Leer antes de modificar código:
- [AGENTS.md](../../AGENTS.md)
- [Visión de producto](../20-VISION-FUNCIONAL-YITVERSE.md)
- [Arquitectura de contenedores](../03-ARQUITECTURA-Y-CONTENEDORES.md)
- [RF](../02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md), [RNF](../27-REQUISITOS-NO-FUNCIONALES.md)
- [Product Backlog](../24-PRODUCT-BACKLOG-SCRUM.md)
- [Sprint S01](../sprints/S01-PLANIFICACION-TECNICA.md)

## Diseño técnico de referencia — escoger soluciones simples

### Estructura mínima esperada

```text
Sistema-EcomerceGeneral/
├── Frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── (base React + Vite)
├── Backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── (base Node.js + Express)
├── Database/
│   ├── Dockerfile
│   └── (solo archivos de configuración/diagnóstico necesarios)
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── docs/
```

Codex puede adicionar `scripts/` para pruebas, pero no una cuarta aplicación ni carpetas de módulos comerciales prematuros.

### Servicios y comunicación
- **Frontend:** React/Vite; en ejecución de contenedor puede compilarse y servirse con un servidor estático como Nginx. Recomendado `/api` como proxy hacia el servicio `backend` para evitar CORS/URL interna incorrecta en navegador. El navegador **no** puede resolver nombres Compose como `backend` directamente; el proxy sí puede hacerlo desde su contenedor.
- **Backend:** Node/Express. Exponer un recurso técnico `GET /api/health` con respuesta controlada y comprobación real `SELECT 1` usando PostgreSQL. No incluir secretos, cadenas de conexión ni datos privados en respuesta. No añadir endpoints de catálogo/login/tienda.
- **Database:** PostgreSQL con volumen persistente. `database` solo en red de datos privada; ningún mapeo `ports` al host. No crear tablas del dominio sin RF aprobados.
- **Redes:** `frontend` y `backend` en red de aplicación; `backend` y `database` en red privada de datos. `frontend` no comparte red de DB.
- **Seguridad:** versiones base fijadas/documentadas, imagen oficial, sin secretos en Git; usuario/contraseña de ejemplo en `.env.example` deben identificarse como valores de prueba y sustituirse localmente.
- **Puertos:** configurar puerto HTTP del frontend para el host mediante `.env`, documentar predeterminado de laboratorio sujeto a disponibilidad. No publicar DB; Backend preferiblemente accesible solo por proxy.

### Contrato técnico de salud propuesto
**Ruta:** `GET /api/health` — únicamente diagnóstico, no un endpoint de negocio.

Caso saludable, HTTP `200`:
```json
{"status":"ok","database":"ok"}
```

Caso BD no disponible, HTTP `503` (o política de error documentada):
```json
{"status":"degraded","database":"unavailable"}
```

No devolver SQL, contraseñas, nombres de tablas ni credenciales. Si se adopta contrato diferente, documentar la decisión y ajustar las pruebas antes de ejecutarlas. El endpoint debe usar conexión real a BD y no una respuesta constante.

### Estrategia de persistencia
El endpoint de salud (`SELECT 1`) **no basta** para probar persistencia. Crear una operación de prueba sintética (por ejemplo en un script de prueba ejecutado dentro de `database`) que inserte un dato distinguible, recrear el contenedor conservando volumen, volver a consultar y finalmente limpiar el dato de prueba. Esto **no** crea entidades funcionales de manga/tienda ni requiere endpoint CRUD.

## Pasos de ejecución solicitados a Codex

1. Inspeccionar repositorio y publicar una lista breve de archivos por crear/modificar y estrategia de prueba; no asumir que existe código.
2. Implementar estructura base de los 3 servicios con lockfiles y Dockerfiles reproducibles.
3. Crear Compose con variables de entorno, volumen persistente y dos redes, y configurar `depends_on`/healthchecks adecuadamente.
4. Crear página básica de estado en frontend que invoque `/api/health` y muestre saludable/error de conexión; no simular valores.
5. Implementar backend de diagnóstico y conexión segura de PostgreSQL, con manejo de errores.
6. Añadir prueba(s) de funcionamiento repetibles, prueba negativa de BD caída y persistencia.
7. Documentar comandos de inicio/parada, configuración, límites y evidencia observada.
8. Crear PR con resumen, resultados de cada criterio y pendientes. No declarar «Terminado» sin aceptación.

## Matriz de pruebas y criterios de aceptación

| ID | Escenario / preparación | Resultado esperado | Evidencia |
|---|---|---|---|
| T01-01 | `docker compose config` | Validación de sintaxis sin error | Salida de consola |
| T01-02 | `docker compose up --build -d` y `docker compose ps` | Tres servicios levantados y estado informado | Salida de consola |
| T01-03 | Abrir URL del frontend configurada | Página disponible; no pantalla de e-commerce | Captura / test HTTP |
| T01-04 | Consultar `/api/health` desde el frontend/proxy | HTTP 200 y respuesta real del Backend | JSON / test HTTP |
| T01-05 | Verificar conexión DB mediante Backend | `database: ok` únicamente si query `SELECT 1` se ejecuta | Prueba de integración |
| T01-06 | Indisponibilidad temporal de DB | Frontend comunica fallo y API informa no saludable; no inventar éxito | HTTP y log sin secretos |
| T01-07 | Revisar publicación de puertos Compose | No figura mapeo de `database` al host | Archivo Compose / config |
| T01-08 | Insertar dato sintético, recrear solo DB sin borrar volumen y consultar | Dato permanece | Script + salida |
| T01-09 | `git status` y revisión de archivos | No se rastrea `.env`, claves ni archivos generados sensibles | Diff |
| T01-10 | Ejecutar pruebas documentadas desde clon limpio | Instrucciones suficientes; resultados y límites registrados | README / reporte |
| T01-11 | Inspeccionar diff | Sin tablas ni UI de comercio, YitCoins, usuarios o contenido protegido | Revisión PR |

Las pruebas no ejecutadas deben marcarse expresamente «NO EJECUTADA» con razón. **No ejecutar comandos destructivos** como `docker compose down -v` durante la prueba de persistencia.

## Evidencia requerida en el Pull Request

```text
Objetivo y HU: HU-T01 / HU-T02 / HU-T03
Archivos creados/modificados:
Decisiones técnicas:
Comandos ejecutados:
T01-01...T01-11: APROBADO / FALLÓ / NO EJECUTADO
Resultados relevantes (sin secretos):
Limitaciones y pendientes:
Documentos actualizados:
```

## Criterios de seguridad
- Nunca subir `.env` real ni secretos.
- No abrir acceso público a PostgreSQL.
- No copiar portadas, capítulos o traducciones de terceros.
- No crear usuarios reales ni procesar pedidos/pagos.
- Evitar dependencias o servicios con costo obligatorio.

## Cierre

Cuando los criterios técnicos estén demostrados y revisados, registrar resultados de **Sprint Review** y una **retrospectiva real**. Si alguna decisión impide continuar (Docker no disponible, puerto ocupado, cambio de red), documentar bloqueo y propuesta sin inventar evidencia.

**No implementar módulos comerciales hasta tener historias de negocio refinadas, aceptadas y asignadas a otro Sprint Backlog.**
