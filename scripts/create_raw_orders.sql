-- Crear esquema raw si no existe
CREATE SCHEMA IF NOT EXISTS raw;

-- Crear tabla raw.orders
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

-- Comentarios para documentación
COMMENT ON TABLE raw.orders IS 'Tabla cruda de órdenes del dataset de Olist';
COMMENT ON COLUMN raw.orders.order_id IS 'Identificador único de la orden';
COMMENT ON COLUMN raw.orders.customer_id IS 'ID del cliente que realizó la orden';
COMMENT ON COLUMN raw.orders.order_status IS 'Estado actual de la orden (delivered, shipped, etc.)';
COMMENT ON COLUMN raw.orders.order_purchase_timestamp IS 'Fecha y hora de compra';
COMMENT ON COLUMN raw.orders.order_approved_at IS 'Fecha y hora de aprobación del pago';
COMMENT ON COLUMN raw.orders.order_delivered_carrier_date IS 'Fecha de entrega al transportista';
COMMENT ON COLUMN raw.orders.order_delivered_customer_date IS 'Fecha de entrega al cliente';
COMMENT ON COLUMN raw.orders.order_estimated_delivery_date IS 'Fecha estimada de entrega';
