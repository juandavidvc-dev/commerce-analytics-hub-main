-- Pipeline ETL: Raw → Clean → Gold
-- Transformación de datos del dataset Olist a esquema estrella

-- LIMPIEZA Y TRANSFORMACIÓN A CLEAN
-- =================================

-- Crear tablas clean con datos limpios
CREATE TABLE IF NOT EXISTS clean.customers AS
SELECT 
    customer_id,
    customer_unique_id,
    customer_zip_code_prefix,
    TRIM(customer_city) as customer_city,
    UPPER(TRIM(customer_state)) as customer_state
FROM raw.customers
WHERE customer_id IS NOT NULL AND customer_unique_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS clean.products AS
SELECT 
    product_id,
    COALESCE(TRIM(product_category_name), 'uncategorized') as product_category_name,
    product_name_lenght,
    product_description_lenght,
    product_photos_qty,
    product_weight_g,
    product_length_cm,
    product_height_cm,
    product_width_cm
FROM raw.products
WHERE product_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS clean.orders AS
SELECT 
    order_id,
    customer_id,
    LOWER(TRIM(order_status)) as order_status,
    order_purchase_timestamp,
    order_approved_at,
    order_delivered_carrier_date,
    order_delivered_customer_date,
    order_estimated_delivery_date,
    -- Validar fechas lógicas
    CASE 
        WHEN order_delivered_customer_date <= order_purchase_timestamp THEN NULL
        ELSE order_delivered_customer_date
    END as order_delivered_customer_date_validated
FROM raw.orders
WHERE order_id IS NOT NULL AND customer_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS clean.order_items AS
SELECT 
    order_id,
    order_item_id,
    product_id,
    seller_id,
    shipping_limit_date,
    price,
    freight_value,
    price + freight_value as total_item_value
FROM raw.order_items
WHERE order_id IS NOT NULL AND product_id IS NOT NULL AND price > 0;

CREATE TABLE IF NOT EXISTS clean.order_payments AS
SELECT 
    order_id,
    payment_sequential,
    LOWER(TRIM(payment_type)) as payment_type,
    COALESCE(payment_installments, 1) as payment_installments,
    payment_value
FROM raw.order_payments
WHERE order_id IS NOT NULL AND payment_value > 0;

-- ESQUEMA ESTRELLA EN GOLD
-- =========================

-- Dimensión de Fecha
CREATE TABLE IF NOT EXISTS gold.dim_date AS
WITH date_series AS (
    SELECT generate_series(
        DATE('2023-01-01'), 
        DATE('2023-12-31'), 
        INTERVAL '1 day'
    )::date as date
)
SELECT 
    EXTRACT(DAY FROM date)::int as date_id,
    date,
    EXTRACT(DAY FROM date)::int as day,
    EXTRACT(MONTH FROM date)::int as month,
    EXTRACT(YEAR FROM date)::int as year,
    EXTRACT(QUARTER FROM date)::int as quarter,
    EXTRACT(ISODOW FROM date)::int as day_of_week,
    TRIM(TO_CHAR(date, 'Day')) as day_name,
    TRIM(TO_CHAR(date, 'Month')) as month_name,
    CASE WHEN EXTRACT(ISODOW FROM date) IN (6, 7) THEN true ELSE false END as is_weekend
FROM date_series;

-- Dimensión de Cliente
CREATE TABLE IF NOT EXISTS gold.dim_customer AS
SELECT 
    customer_id,
    customer_unique_id,
    customer_city,
    customer_state,
    CASE 
        WHEN customer_state IN ('SP', 'RJ', 'MG', 'ES') THEN 'Sudeste'
        WHEN customer_state IN ('RS', 'SC', 'PR') THEN 'Sul'
        WHEN customer_state IN ('DF', 'GO', 'MT', 'MS') THEN 'Centro-Oeste'
        WHEN customer_state IN ('BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA') THEN 'Nordeste'
        WHEN customer_state IN ('AC', 'RO', 'AM', 'RR', 'PA', 'AP', 'TO') THEN 'Norte'
        ELSE 'Desconocido'
    END as customer_region
FROM clean.customers;

-- Dimensión de Producto
CREATE TABLE IF NOT EXISTS gold.dim_product AS
SELECT 
    product_id,
    COALESCE(product_category_name, 'uncategorized') as product_category,
    product_weight_g,
    product_length_cm,
    product_height_cm,
    product_width_cm,
    CASE 
        WHEN product_category_name IN ('eletronicos', 'informatica_acessorios', 'telefonia') THEN 'Eletrônicos'
        WHEN product_category_name IN ('moveis_decoracao', 'cama_mesa_banho', 'utilidades_domesticas') THEN 'Casa'
        WHEN product_category_name IN ('beleza_saude', 'perfumaria') THEN 'Beleza'
        WHEN product_category_name IN ('esporte_lazer', 'brinquedos') THEN 'Lazer'
        WHEN product_category_name IN ('ferramentas_jardim', 'construcao_ferramentas') THEN 'Construção'
        ELSE 'Outros'
    END as product_category_group
FROM clean.products;

-- Dimensión de Orden
CREATE TABLE IF NOT EXISTS gold.dim_order AS
SELECT 
    o.order_id,
    o.customer_id,
    o.order_status,
    o.purchase_date,
    o.approved_date,
    o.delivered_date,
    o.estimated_date,
    -- Flags importantes
    CASE WHEN o.order_status = 'delivered' THEN true ELSE false END as is_delivered,
    CASE WHEN o.order_status IN ('canceled', 'unavailable') THEN true ELSE false END as is_canceled,
    CASE 
        WHEN o.delivered_date IS NOT NULL AND o.estimated_date IS NOT NULL 
        AND o.delivered_date <= o.estimated_date THEN true 
        ELSE false 
    END as is_on_time
FROM (
    SELECT 
        order_id,
        customer_id,
        order_status,
        order_purchase_timestamp as purchase_date,
        order_approved_at as approved_date,
        order_delivered_customer_date_validated as delivered_date,
        order_estimated_delivery_date as estimated_date
    FROM clean.orders
) o;

-- Tabla de Hechos (Fact Sales) - Grano: 1 fila por item de orden
CREATE TABLE IF NOT EXISTS gold.fact_sales AS
WITH payment_allocation AS (
    -- Calcular prorrateo de pagos por item (Opción A del requerimiento)
    SELECT 
        oi.order_id,
        oi.order_item_id,
        oi.product_id,
        oi.price,
        oi.freight_value,
        op.total_payment_value,
        oi.price / oi.order_total_value as allocation_ratio,
        op.total_payment_value * (oi.price / oi.order_total_value) as payment_value_allocated
    FROM (
        SELECT 
            order_id,
            order_item_id,
            product_id,
            price,
            freight_value,
            SUM(price + freight_value) OVER (PARTITION BY order_id) as order_total_value
        FROM clean.order_items
    ) oi
    JOIN (
        SELECT 
            order_id,
            SUM(payment_value) as total_payment_value
        FROM clean.order_payments
        GROUP BY order_id
    ) op ON oi.order_id = op.order_id
)
SELECT 
    NEXTVAL('gold.fact_sales_id_seq') as id,
    oi.order_id,
    oi.order_item_id,
    o.customer_id,
    oi.product_id,
    EXTRACT(DAY FROM oi.order_purchase_timestamp)::int as date_id,
    p.product_category,
    c.customer_state,
    o.order_status,
    oi.order_purchase_timestamp as purchase_date,
    oi.order_approved_at as approved_date,
    oi.order_delivered_customer_date as delivered_date,
    oi.order_estimated_delivery_date as estimated_date,
    oi.price as item_price,
    oi.freight_value,
    pa.payment_value_allocated,
    o.is_delivered,
    o.is_canceled,
    o.is_on_time
FROM clean.order_items oi
JOIN clean.orders o ON oi.order_id = o.order_id
JOIN gold.dim_customer c ON o.customer_id = c.customer_id
JOIN gold.dim_product p ON oi.product_id = p.product_id
LEFT JOIN payment_allocation pa ON oi.order_id = pa.order_id AND oi.order_item_id = pa.order_item_id;

-- Crear secuencia para la tabla de hechos
CREATE SEQUENCE IF NOT EXISTS gold.fact_sales_id_seq;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_fact_sales_date_id ON gold.fact_sales(date_id);
CREATE INDEX IF NOT EXISTS idx_fact_sales_customer_id ON gold.fact_sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_fact_sales_product_id ON gold.fact_sales(product_id);
CREATE INDEX IF NOT EXISTS idx_fact_sales_order_status ON gold.fact_sales(order_status);
CREATE INDEX IF NOT EXISTS idx_fact_sales_purchase_date ON gold.fact_sales(purchase_date);

-- Crear índices en dimensiones
CREATE INDEX IF NOT EXISTS idx_dim_date_date ON gold.dim_date(date);
CREATE INDEX IF NOT EXISTS idx_dim_customer_state ON gold.dim_customer(customer_state);
CREATE INDEX IF NOT EXISTS idx_dim_product_category ON gold.dim_product(product_category);

COMMIT;
