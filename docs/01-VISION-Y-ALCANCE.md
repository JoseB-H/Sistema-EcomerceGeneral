# Visión y alcance — Sistema-EcomerceGeneral / YitVerse

**Actualizado:** 2026-11-03  
**Estado:** visión funcional inicial declarada por el usuario; reglas detalladas, MVP y operación real pendientes de aprobación.  
**Nombre de la plataforma:** YitVerse, **propuesta provisional** (repositorio sigue siendo Sistema-EcomerceGeneral).

## Propósito

Construir como proyecto de **Servicios Cloud** una aplicación web de lectura y comercio electrónico centrada inicialmente en **mangas, manhwas y lecturas relacionadas con anime**, con expansión futura a otros tipos de lectura. Permitirá mostrar obras, llevar una biblioteca personal y vender ediciones físicas coleccionables y accesorios únicos de la tienda.

La diferenciación propuesta por el usuario es que **lecturas válidas proporcionen XP**, la XP eleve el nivel de la cuenta y determinados hitos otorguen **YitCoins**, canjeables por productos elegibles. «Cada diez niveles» fue presentado **como ejemplo** y requiere especificación.

## Funcionalidades solicitadas como visión
- Explorar y consultar obras/editoriales por formatos, inicialmente manga y manhwa.
- Registrarse para conservar favoritos, historial, seguimiento y progreso de lectura.
- Leer digitalmente contenidos **solamente cuando existan derechos de acceso y distribución**.
- Acumular XP por lectura válida, alcanzar niveles y recibir YitCoins en hitos.
- Usar YitCoins para canjear mercancía exclusiva y ediciones físicas elegibles.
- Comercializar productos físicos de interés para coleccionistas.
- Ampliar categorías y experiencias en futuras versiones.

Las funcionalidades anteriores son **intención de producto**, no historias suficientemente refinadas ni funciones implementadas. Los detalles se encuentran en [Visión funcional v0.1](20-VISION-FUNCIONAL-YITVERSE.md).

## Arquitectura técnica ya acordada
- `Frontend/`: React + Vite.
- `Backend/`: Node.js + Express.
- `Database/`: PostgreSQL.
- Docker Compose para conectar los tres contenedores.
- Base de datos persistente y accesible desde el Backend, no desde navegador.
- Herramientas gratuitas; no introducir servicios pagos obligatorios.

## Límites aún pendientes de definir
- El catálogo puede mostrar metadatos; lectura de capítulos dentro de la aplicación requiere licencia/permiso.
- Mecanismos de compra real, envío, pagos, inventario, devoluciones y obligaciones fiscales requieren reglas.
- Umbrales XP, equilibrio de niveles, valor de YitCoins y política de canjes están sin determinar.
- Autenticación, datos personales y roles operativos se deben especificar.
- Despliegue cloud real, escala y fecha de evaluación académica aún se deben confirmar.
- La primera versión debe ser un MVP alcanzable, no todos los módulos en un único sprint.

## Objetivo de éxito técnico
Demostrar tres servicios ejecutados con Docker Compose y datos persistentes, conectados con una funcionalidad de negocio **aprobada**. Documentar criterios de aceptación y pruebas verificables.

## Gestión de implementación
- [Backlog Scrum](24-PRODUCT-BACKLOG-SCRUM.md)
- [Reglas XP/YitCoins](22-REGLAS-XP-YITCOINS.md)
- [UX](21-EXPERIENCIA-USUARIO.md)
- [Decisiones por cerrar](25-DECISIONES-PENDIENTES.md)

**Codex no debe implementar todas las intenciones sin requisitos aprobados y sin Sprint Backlog definido.**
