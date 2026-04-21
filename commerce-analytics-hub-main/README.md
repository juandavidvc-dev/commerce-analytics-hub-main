# Commerce Analytics Hub

## Overview

Commerce Analytics Hub es una plataforma centralizada para el análisis de datos de comercio electrónico. Este proyecto proporciona herramientas y visualizaciones para analizar tendencias de ventas, comportamiento de clientes y métricas clave de rendimiento.

## Stack Tecnológico

- **Base de Datos**: PostgreSQL 15
- **Orquestación**: Docker & Docker Compose
- **Sistema Operativo**: Windows

## Estructura del Proyecto

```
commerce-analytics-hub/
|-- docker-compose.yml    # Configuración de servicios Docker
|-- .env                  # Variables de entorno
|-- README.md            # Documentación del proyecto
```

## Configuración Inicial

### Prerrequisitos

- Docker Desktop instalado
- Docker Compose
- Al menos 4GB de RAM disponibles

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd commerce-analytics-hub
```

2. Configurar las variables de entorno (opcional, usa valores por defecto):
```bash
cp .env.example .env
# Editar .env según sea necesario
```

3. Iniciar los servicios:
```bash
docker-compose up -d
```

## Variables de Entorno

El proyecto utiliza las siguientes variables de entorno configuradas en `.env`:

- `POSTGRES_USER`: Usuario de PostgreSQL (default: admin)
- `POSTGRES_PASSWORD`: Contraseña de PostgreSQL (default: admin)
- `POSTGRES_DB`: Nombre de la base de datos (default: commerce_db)
- `POSTGRES_PORT`: Puerto de PostgreSQL (default: 5432)

## Configuración de Base de Datos

### Esquemas de Datos

El proyecto utiliza una arquitectura de datos con tres esquemas principales para organizar el flujo de información:

- **raw**: Datos crudos sin procesar (ingesta inicial)
- **clean**: Datos limpios y validados
- **gold**: Datos procesados listos para análisis y reportes

### Creación de Esquemas

Para crear los esquemas necesarios, ejecuta los siguientes comandos SQL:

```sql
-- Crear esquema para datos crudos
CREATE SCHEMA raw;

-- Crear esquema para datos limpios
CREATE SCHEMA clean;

-- Crear esquema para datos procesados
CREATE SCHEMA gold;
```

O ejecuta todos los comandos a la vez:

```sql
CREATE SCHEMA raw;
CREATE SCHEMA clean;
CREATE SCHEMA gold;
```

### Verificación de Esquemas

Para verificar que los esquemas se crearon correctamente:

```sql
-- Listar todos los esquemas
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
ORDER BY schema_name;
```

### Conexión con DBeaver

1. **Configurar conexión**:
   - Host: `localhost`
   - Port: `5432`
   - Database: `commerce_db`
   - User: `admin`
   - Password: `admin`

2. **Ejecutar comandos SQL**:
   - Abre el editor SQL
   - Pega los comandos CREATE SCHEMA
   - Ejecuta con F5 o el botón "Execute"

3. **Verificar creación**:
   - Expande el nodo "Schemas" en el navegador de bases de datos
   - Deberías ver `raw`, `clean` y `gold` junto con `public`

## Servicios

### Base de Datos PostgreSQL

- **Contenedor**: `commerce_db`
- **Imagen**: `postgres:15`
- **Puerto**: `5432:5432`
- **Persistencia**: Volumen `postgres_data`

## Uso

### Conexión a la Base de Datos

Para conectar a la base de datos PostgreSQL:

```bash
# Usando psql
psql -h localhost -p 5432 -U admin -d commerce_db

# O usando cualquier cliente SQL con:
# Host: localhost
# Port: 5432
# User: admin
# Password: admin
# Database: commerce_db
```

### Comandos Docker Útiles

```bash
# Ver estado de los contenedores
docker-compose ps

# Ver logs de la base de datos
docker-compose logs db

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart
```

## Desarrollo

### Flujo de Trabajo

1. **Configuración del entorno**: Asegurar Docker esté corriendo
2. **Base de datos**: Iniciar PostgreSQL con `docker-compose up -d`
3. **Desarrollo**: Conectar herramientas de análisis a la base de datos

### Buenas Prácticas

- Mantener las credenciales seguras en producción
- Realizar backups periódicos de la base de datos
- Documentar nuevos esquemas de base de datos
- Versionar los cambios en la configuración

## Contribución

1. Fork del repositorio
2. Crear rama de características: `git checkout -b feature/nueva-funcionalidad`
3. Commit de cambios: `git commit -am 'Agrega nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## Licencia

Este proyecto está bajo licencia MIT. Ver archivo LICENSE para más detalles.

## Soporte

Para reportar issues o solicitar ayuda:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

---

**Nota**: Este README se irá actualizando a medida que el proyecto evolucione con nuevas funcionalidades y componentes.