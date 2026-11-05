# Diseño del Frontend — React + Vite

**Estado:** pantalla técnica S01 aprobada, implementada y probada; módulos de negocio pendientes de aprobación.

## Responsabilidad del componente
Presentar información y permitir interacciones con el usuario a través de una API HTTP. No contiene lógica de integridad del servidor ni credenciales privadas.

## Organización de código propuesta (Codex debe validarla)
- `Frontend/src/app/`: configuración del arranque, navegación y proveedores globales.
- `Frontend/src/pages/`: vistas correspondientes a funcionalidades **aprobadas**.
- `Frontend/src/components/`: componentes reutilizables.
- `Frontend/src/features/`: agrupación opcional por caso de uso.
- `Frontend/src/services/`: cliente HTTP y acceso a API.
- `Frontend/src/styles/`: tokens y estilos.
- `Frontend/src/tests/`: pruebas de componentes e interacción.

No generar todas estas carpetas si no existe una necesidad real; mantener diseño KISS.

## Reglas de interfaz
- Diseño adaptable a escritorio y móvil según las necesidades aprobadas.
- Estados explícitos: carga, datos vacíos, error y confirmación.
- Validar entradas para experiencia de usuario; repetir validación crítica en servidor.
- Navegación clara y accesibilidad básica: etiquetas, foco, teclado y contraste.
- Manejo consistente de errores HTTP.
- No colocar secretos en variables expuestas al cliente.
- Evitar dependencias innecesarias hasta justificar su uso.

## Entregables de diseño antes de codificar una vista
| Artefacto | Contenido mínimo |
| --- | --- |
| Mapa de navegación | Pantallas aprobadas, rutas y transiciones |
| Boceto o wireframe | Estructura, contenido y acciones |
| Contrato API | Datos necesarios y manejo de errores |
| Estados de UI | Carga, error, vacío, éxito |
| Criterios de aceptación | Resultado que debe demostrar la vista |
| Pruebas | Acciones y casos negativos |

## Flujo propuesto
```mermaid
flowchart LR
    R[Requisito aprobado] --> W[Wireframe]
    W --> C[Contrato API]
    C --> I[Implementación React]
    I --> P[Prueba UI]
    P --> E[Evidencia y documentación]
```

## Por definir con usuario
Identidad visual, pantalla inicial, lista de rutas, formularios, controles de accesibilidad prioritarios, autenticación y estados de sesión, necesidades de catálogo o compra y contenido legal. Ninguno se encuentra aprobado.

Véase [Contratos API](07-CONTRATOS-API-Y-FLUJOS.md) y [Requisitos](02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md).

## S01 — pantalla técnica implementada

`Frontend/src/App.jsx` presenta únicamente diagnóstico, sin módulos comerciales. El cliente usa `/api/health` relativo, no-store, valida HTTP 200 y JSON sano. Carga, éxito y error accesibles con status/alert; reintento deshabilitado durante carga. Cancelación al desmontar, límite de 4000 ms e ignorar respuestas obsoletas evitan éxitos tardíos. `npm --prefix Frontend test`: 11/11; `npm --prefix Frontend run build` aprobado. No se ha validado aún en contenedores/navegador real.

### Docker S01

Build multi-stage Vite y Nginx oficial fijado; sin node_modules de desarrollo en runtime. `/api/` mantiene la ruta y no entra al fallback SPA. Healthcheck wget usa `-Y off` solo para loopback, porque BusyBox heredaba el proxy HTTP cloud y devolvía 403 sin alcanzar Nginx; el proxy externo y CA siguen activos.

### Verificación de integración S01

El navegador Chromium real carga los assets construidos y muestra salud con respuesta de Backend/PostgreSQL. Las pruebas de integración verifican `/api/unknown` como 404 JSON, no HTML SPA, y proxy 502/504 cuando Backend está detenido. El estado de UI se actualiza al reintentar; no se usa polling ni salud simulada.

## Prototipo local HU-001/HU-002

En `npm run dev` o `npm run build:local` se muestra catálogo sintético en `/`, ficha en `/obras/:id` y diagnóstico S01 en `/estado`. Componentes WorkCard/WorkCover, SearchForm y mensajes de estado son reutilizables; useResource limita esperas a 4000 ms y cancela/ignora respuestas obsoletas. La búsqueda y el formato se reflejan en la URL y se conservan al volver del detalle, con enlaces nativos y soporte de navegación atrás. API relativa vía proxy Vite; ningún dato de catálogo se importa del Backend ni se duplica en React.

Las composiciones gráficas CSS/SVG son marcadores propios de demostración, no portadas reales. Fuente sintética y ausencia de persistencia se declaran en catálogo y ficha. Sin enlaces a autenticación, lector, tienda o gamificación. Diseño móvil/escritorio y salto de teclado al contenido verificados en Chromium; 30 pruebas Frontend aprobadas. La compilación predeterminada sigue mostrando S01; build:local usa internamente modo prototype porque Vite reserva el nombre local para archivos .env.local.
