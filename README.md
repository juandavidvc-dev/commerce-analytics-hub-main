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
|-- frontend/
|-- backend/
|   |-- customers.csv
|   |-- orders.csv
|   |-- order_items.csv
|   |-- order_payments.csv
|   |-- products.csv
|-- db/
|   |-- data/              # Datos de PostgreSQL
|-- docker-compose.yml
|-- README.md
```

## Dataset de Olist

El proyecto incluye el dataset público de comercio electrónico brasileño de Olist, que contiene más de 100,000 órdenes realizadas entre 2016 y 2018.

### Archivos del Dataset

- **orders.csv** (17.6 MB): Datos principales de órdenes
  - `order_id`: Identificador único de orden
  - `customer_id`: ID del cliente
  - `order_status`: Estado de la orden
  - `order_purchase_timestamp`: Fecha de compra
  - `order_approved_at`: Fecha de aprobación
  - `order_delivered_carrier_date`: Fecha de entrega al transportista
  - `order_delivered_customer_date`: Fecha de entrega al cliente
  - `order_estimated_delivery_date`: Fecha estimada de entrega

- **order_items.csv** (15.4 MB): Ítems individuales por orden
  - `order_id`: ID de la orden
  - `order_item_id`: Número de ítem en la orden
  - `product_id`: ID del producto
  - `seller_id`: ID del vendedor
  - `shipping_limit_date`: Límite de envío
  - `price`: Precio del ítem
  - `freight_value`: Costo de envío

- **order_payments.csv** (5.8 MB): Métodos y detalles de pago
  - `order_id`: ID de la orden
  - `payment_sequential`: Secuencia de pago
  - `payment_type`: Tipo de pago (credit_card, boleto, voucher, debit_card)
  - `payment_installments`: Cuotas
  - `payment_value`: Valor del pago

- **customers.csv** (9.0 MB): Información demográfica de clientes
  - `customer_id`: ID único del cliente por orden
  - `customer_unique_id`: ID único del cliente global
  - `customer_zip_code_prefix`: Código postal
  - `customer_city`: Ciudad
  - `customer_state`: Estado

- **products.csv** (2.4 MB): Catálogo de productos
  - `product_id`: ID del producto
  - `product_category_name`: Categoría del producto
  - `product_name_lenght`: Longitud del nombre
  - `product_description_lenght`: Longitud de la descripción
  - `product_photos_qty`: Cantidad de fotos
  - `product_weight_g`: Peso en gramos
  - `product_length_cm`: Largo en cm
  - `product_height_cm`: Altura en cm
  - `product_width_cm`: Ancho en cm

### Fuente de Datos

Los datos fueron descargados del repositorio público de GitHub:
- **Repositorio**: wheff70/OlistDataAnalysis
- **Fuente original**: Kaggle - Brazilian E-Commerce Public Dataset by Olist
- **Período**: 2016-2018
- **País**: Brasil
- **Registros**: ~100,000 órdenes

### Uso del Dataset

Para cargar los datos en PostgreSQL:

```sql
-- Crear tablas en esquema raw
CREATE TABLE raw.orders (
    order_id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255),
    order_status VARCHAR(50),
    order_purchase_timestamp TIMESTAMP,
    order_approved_at TIMESTAMP,
    order_delivered_carrier_date TIMESTAMP,
    order_delivered_customer_date TIMESTAMP,
    order_estimated_delivery_date TIMESTAMP
);

-- Repetir para las otras tablas (order_items, order_payments, customers, products)
```

### Análisis Posibles

- Análisis de tendencias de ventas temporales
- Segmentación de clientes
- Análisis de productos más vendidos
- Estudio de métodos de pago
- Análisis geográfico de ventas
- Predicción de entregas tardías
- Análisis de valor del cliente (LTV)

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