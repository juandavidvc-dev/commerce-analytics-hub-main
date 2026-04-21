# Instrucciones para Importar Datos en DBeaver

## Pasos para Importar orders.csv a la tabla raw.orders

### 1. Conectar a la Base de Datos
- Host: localhost
- Port: 5432
- Database: commerce_db
- User: admin
- Password: admin

### 2. Crear la Tabla
Ejecuta el script `scripts/create_raw_orders.sql` o ejecuta manualmente:

```sql
CREATE SCHEMA IF NOT EXISTS raw;

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
```

### 3. Importar Datos desde CSV
1. **Botón derecho** en la tabla `raw.orders` 
2. Seleccionar **"Import Data"**
3. **Seleccionar archivo**: `db/data/orders.csv`
4. **Configurar importación**:
   - Format: CSV
   - Encoding: UTF-8
   - Delimiter: Coma (,)
   - Header: First row contains column names
5. **Mapear columnas**:
   - order_id -> order_id
   - customer_id -> customer_id
   - order_status -> order_status
   - order_purchase_timestamp -> order_purchase_timestamp
   - order_approved_at -> order_approved_at
   - order_delivered_carrier_date -> order_delivered_carrier_date
   - order_delivered_customer_date -> order_delivered_customer_date
   - order_estimated_delivery_date -> order_estimated_delivery_date
6. **Click en "Finish"**

### 4. Verificar Importación
```sql
-- Contar registros importados
SELECT COUNT(*) FROM raw.orders;

-- Ver primeros registros
SELECT * FROM raw.orders LIMIT 5;
```

## Archivos Disponibles
- `db/data/orders.csv` - Datos de órdenes (17.6 MB)
- `db/data/customers.csv` - Datos de clientes (9.0 MB)
- `db/data/order_items.csv` - Ítems por orden (15.4 MB)
- `db/data/order_payments.csv` - Pagos (5.8 MB)
- `db/data/products.csv` - Productos (2.4 MB)
