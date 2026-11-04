# Visión, alcance y objetivos

**Proyecto:** Sistema-EcomerceGeneral | **Curso:** Servicios Cloud | **Estado:** elaboración documental.

## Problema y visión
Se diseñará una aplicación web de comercio electrónico general como ejercicio de integración de servicios y contenedores. La visión es demostrar una arquitectura separada en **Frontend, Backend y Database**, integrados y ejecutables mediante Docker Compose, con trazabilidad entre requisitos, diseño, código y pruebas.

El nombre «e-commerce» no autoriza a inventar flujos de cobro, entregas, usuarios o inventario. La operación del negocio aún está pendiente de definición.

## Objetivos técnicos confirmados
- Separar interfaz, lógica de servidor y base de datos.
- Contenerizar cada servicio y orquestarlos con Docker Compose.
- Permitir comunicación navegador → Frontend/API → Backend → PostgreSQL sin acceso directo del navegador a la base de datos.
- Persistir datos en PostgreSQL.
- Conservar documentación técnica sincronizable con GitHub/Obsidian.
- Usar herramientas gratuitas para el desarrollo local y evitar servicios de pago obligatorios.

## Límite del sistema

**Dentro del alcance técnico inicial:** aplicación web, API y almacenamiento relacional; integración entre servicios; demostración local reproducible; documentación y pruebas.

**Fuera de alcance por ahora:** despliegue de producción real; pasarela de pagos; facturación legal; integración de mensajería externa; proveedores cloud pagos; cuentas comerciales; políticas comerciales; roles; módulos concretos. Pueden incorporarse si el usuario los aprueba.

## Actores por confirmar
No se conocen todavía los actores de negocio. Las categorías «visitante», «cliente», «administrador», «vendedor» u otras serán **hipótesis de entrevista**, no roles implementables hasta confirmar.

## Indicadores de éxito propuestos
- Los tres contenedores pueden arrancar desde un mismo archivo Compose en un equipo limpio.
- La interfaz puede solicitar una respuesta verificable al backend.
- El backend puede guardar y recuperar datos de prueba desde PostgreSQL con persistencia.
- Las verificaciones de salud y las pruebas mínimas quedan registradas.
- Un tercero puede reproducir el laboratorio siguiendo el README.
- Cada cambio de diseño tiene su requisito, decisión y evidencia.

Los umbrales de rendimiento, disponibilidad, usuarios concurrentes y fechas de entrega **no están fijados**.

## Restricciones y supuestos
- El repositorio de GitHub es público al momento de redactar; no publicar datos ni materiales académicos con restricciones.
- React/Vite, Node/Express, PostgreSQL y Compose son la línea tecnológica confirmada, no una lista de versiones cerradas.
- Trabajo dividido: Codex desarrolla; chat Servicios Cloud define contexto académico; Obsidian/Vaultcraft organiza conocimiento; GitHub versiona.

## Requisitos de aprobación antes del MVP
1. Confirmar objetivo de negocio y quién utilizará el sistema.
2. Priorizar funcionalidades para la primera demostración.
3. Aprobar reglas de negocio, datos necesarios y actores.
4. Aprobar criterios medibles de aceptación.
5. Definir si la evaluación exige ejecución local, cloud o ambas.

Continuar en [Requisitos](02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md) y [Fases](08-FASES-DE-DESARROLLO.md).
