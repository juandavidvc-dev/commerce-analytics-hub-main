-- Crear esquemas para el pipeline de datos de Commerce Analytics Hub
-- Este script se ejecuta automáticamente al iniciar el contenedor PostgreSQL

-- Crear esquema raw si no existe (datos crudos sin procesar)
CREATE SCHEMA IF NOT EXISTS raw;

-- Crear esquema clean si no existe (datos limpios y validados)
CREATE SCHEMA IF NOT EXISTS clean;

-- Crear esquema gold si no existe (datos procesados para análisis)
CREATE SCHEMA IF NOT EXISTS gold;

-- Otorgar permisos adecuados
GRANT USAGE ON SCHEMA raw TO PUBLIC;
GRANT CREATE ON SCHEMA raw TO PUBLIC;
GRANT USAGE ON SCHEMA clean TO PUBLIC;
GRANT CREATE ON SCHEMA clean TO PUBLIC;
GRANT USAGE ON SCHEMA gold TO PUBLIC;
GRANT CREATE ON SCHEMA gold TO PUBLIC;

-- Comentarios para documentación
COMMENT ON SCHEMA raw IS 'Esquema para datos crudos sin procesar del dataset de Olist';
COMMENT ON SCHEMA clean IS 'Esquema para datos limpios y validados';
COMMENT ON SCHEMA gold IS 'Esquema para datos procesados listos para análisis y reportes';

-- Confirmar creación
SELECT schema_name, 
       obj_description(oid) as description
FROM information_schema.schemata 
LEFT JOIN pg_namespace ON nspname = schema_name
WHERE schema_name IN ('raw', 'clean', 'gold')
ORDER BY schema_name;
