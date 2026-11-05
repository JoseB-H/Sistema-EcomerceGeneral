# Diseño de Database — PostgreSQL

**Estado:** motor y persistencia confirmados; entidades del negocio pendientes de aprobación.

## Reglas del componente
- PostgreSQL es la fuente principal de datos transaccionales.
- El servicio Backend es el único cliente de la BD dentro de la aplicación.
- Los datos persistirán en un volumen Docker nombrado.
- El esquema debe evolucionar mediante migraciones versionadas y reversibles cuando sea viable.
- No incluir datos personales ni credenciales reales en repositorio.
- Usar integridad relacional y normalización adecuada; como punto de partida, 3FN cuando corresponda.

## Proceso de diseño
```mermaid
flowchart LR
    R[Requisitos aprobados] --> E[Entidades y atributos]
    E --> L[Relaciones y cardinalidad]
    L --> N[Normalización]
    N --> M[Migración versionada]
    M --> T[Pruebas de integridad]
```

## Artefactos por crear cuando se defina el negocio
1. **Diccionario de datos**: tabla, columna, tipo, nulabilidad, significado, restricción.
2. **Modelo entidad-relación**: entidades reales, cardinalidades y reglas.
3. **Modelo lógico**: PK, FK, índices justificados, restricciones y unicidad.
4. **Migraciones**: cambios del esquema registrados en Git, con secuencia reproducible.
5. **Datos de prueba**: sintéticos y mínimos, nunca privados.
6. **Plan de respaldo/restauración**: instrucciones y prueba de recuperación.

## Criterios para cada tabla
- ¿Qué requisito la justifica?
- ¿Cuál es su clave primaria?
- ¿Qué relaciones y restricciones existen?
- ¿Qué operaciones deben ser atómicas?
- ¿Qué dato no debe duplicarse?
- ¿Cómo se consultará y qué índices hacen falta según evidencia?

## Convenciones propuestas
- Nombres consistentes en minúsculas y `snake_case`.
- Claves foráneas explícitas.
- Marcas temporales sólo donde tengan significado funcional o de auditoría.
- Índices basados en consultas previstas, sin crear indiscriminadamente.
- No hacer borrado físico irreversible si una regla de conservación aprobada lo impide.
- No inventar tablas de usuarios, productos, pedidos o pagos sin requisitos.

## Persistencia no equivale a backup
Un volumen conserva datos al recrear el contenedor, pero no reemplaza un respaldo. Deben definirse procedimiento de copia, ubicación segura, retención y prueba de restauración.

## Pendientes
Entidades, campos, reglas de integridad, políticas de retención, transacciones e identificadores. Definirlas junto a [Requisitos](02-REQUISITOS-Y-ALCANCE-FUNCIONAL.md) antes de generar SQL.

## S01 — comprobación técnica

Backend usa `pg` y `SELECT 1 AS ok`; no crea tablas del dominio. La configuración usa PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE inyectadas por Compose. Las pruebas unitarias cubren error y resultado inesperado; persistencia y reconexión real siguen pendientes de la pila Docker.

### Docker S01

Imagen oficial PostgreSQL 17 fijada por digest; volumen nombrado por proyecto y montado en `/var/lib/postgresql/data`. Únicamente red `data` interna, sin puerto al host; autenticación por contraseña y pg_isready como sonda local. No existe SQL de inicialización comercial. El helper verifica propietario de volumen y montaje antes de operar.
