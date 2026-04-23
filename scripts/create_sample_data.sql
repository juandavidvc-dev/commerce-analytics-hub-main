-- Crear datos de ejemplo realistas para el dataset Olist
-- Esto permite continuar con el desarrollo mientras se obtiene el dataset real

-- Insertar datos en raw.customers
INSERT INTO raw.customers (customer_id, customer_unique_id, customer_zip_code_prefix, customer_city, customer_state) VALUES
('c12345', 'u67890', 12345, 'São Paulo', 'SP'),
('c23456', 'u78901', 23456, 'Rio de Janeiro', 'RJ'),
('c34567', 'u89012', 34567, 'Belo Horizonte', 'MG'),
('c45678', 'u90123', 45678, 'Brasília', 'DF'),
('c56789', 'u01234', 56789, 'Salvador', 'BA'),
('c67890', 'u12345', 67890, 'Fortaleza', 'CE'),
('c78901', 'u23456', 78901, 'Curitiba', 'PR'),
('c89012', 'u34567', 89012, 'Porto Alegre', 'RS'),
('c90123', 'u45678', 90123, 'Recife', 'PE'),
('c01234', 'u56789', 1234, 'Manaus', 'AM');

-- Insertar datos en raw.products
INSERT INTO raw.products (product_id, product_category_name, product_name_lenght, product_description_lenght, product_photos_qty, product_weight_g, product_length_cm, product_height_cm, product_width_cm) VALUES
('p1001', 'eletronicos', 25, 150, 3, 500, 20, 10, 5),
('p1002', 'moveis_decoracao', 30, 200, 5, 2000, 80, 60, 40),
('p1003', 'beleza_saude', 20, 100, 2, 200, 15, 8, 8),
('p1004', 'esporte_lazer', 28, 180, 4, 800, 30, 20, 15),
('p1005', 'informatica_acessorios', 35, 220, 6, 300, 25, 15, 10),
('p1006', 'cama_mesa_banho', 22, 120, 3, 1500, 200, 150, 50),
('p1007', 'ferramentas_jardim', 26, 160, 4, 1200, 40, 25, 20),
('p1008', 'brinquedos', 24, 140, 3, 600, 25, 20, 15),
('p1009', 'malas_acessorios', 21, 110, 2, 900, 55, 35, 25),
('p1010', 'alimentos_bebidas', 18, 90, 1, 300, 20, 15, 10);

-- Insertar datos en raw.orders
INSERT INTO raw.orders (order_id, customer_id, order_status, order_purchase_timestamp, order_approved_at, order_delivered_carrier_date, order_delivered_customer_date, order_estimated_delivery_date) VALUES
('o0001', 'c12345', 'delivered', '2023-01-15 10:30:00', '2023-01-15 11:45:00', '2023-01-16 14:20:00', '2023-01-18 16:30:00', '2023-01-20 00:00:00'),
('o0002', 'c23456', 'delivered', '2023-01-16 14:20:00', '2023-01-16 15:30:00', '2023-01-17 10:15:00', '2023-01-19 09:45:00', '2023-01-21 00:00:00'),
('o0003', 'c34567', 'shipped', '2023-01-17 09:15:00', '2023-01-17 10:20:00', '2023-01-18 11:30:00', NULL, '2023-01-25 00:00:00'),
('o0004', 'c45678', 'canceled', '2023-01-18 16:45:00', '2023-01-18 17:50:00', NULL, NULL, '2023-01-26 00:00:00'),
('o0005', 'c56789', 'delivered', '2023-01-19 11:30:00', '2023-01-19 12:45:00', '2023-01-20 15:20:00', '2023-01-22 14:10:00', '2023-01-24 00:00:00'),
('o0006', 'c67890', 'delivered', '2023-01-20 13:20:00', '2023-01-20 14:30:00', '2023-01-21 09:45:00', '2023-01-23 11:20:00', '2023-01-25 00:00:00'),
('o0007', 'c78901', 'processing', '2023-01-21 15:10:00', '2023-01-21 16:20:00', NULL, NULL, '2023-01-29 00:00:00'),
('o0008', 'c89012', 'delivered', '2023-01-22 10:45:00', '2023-01-22 11:50:00', '2023-01-23 13:15:00', '2023-01-25 10:30:00', '2023-01-27 00:00:00'),
('o0009', 'c90123', 'delivered', '2023-01-23 14:30:00', '2023-01-23 15:40:00', '2023-01-24 10:20:00', '2023-01-26 12:45:00', '2023-01-28 00:00:00'),
('o0010', 'c01234', 'shipped', '2023-01-24 09:20:00', '2023-01-24 10:25:00', '2023-01-25 14:30:00', NULL, '2023-02-01 00:00:00');

-- Insertar datos en raw.order_items
INSERT INTO raw.order_items (order_id, order_item_id, product_id, seller_id, shipping_limit_date, price, freight_value) VALUES
('o0001', 1, 'p1001', 's001', '2023-01-25 00:00:00', 299.90, 15.50),
('o0001', 2, 'p1003', 's002', '2023-01-25 00:00:00', 89.90, 8.20),
('o0002', 1, 'p1002', 's001', '2023-01-26 00:00:00', 599.90, 45.80),
('o0003', 1, 'p1004', 's003', '2023-01-27 00:00:00', 199.90, 18.50),
('o0004', 1, 'p1005', 's002', '2023-01-28 00:00:00', 149.90, 12.30),
('o0005', 1, 'p1006', 's001', '2023-01-29 00:00:00', 399.90, 35.60),
('o0005', 2, 'p1007', 's003', '2023-01-29 00:00:00', 129.90, 22.40),
('o0006', 1, 'p1008', 's002', '2023-01-30 00:00:00', 79.90, 10.50),
('o0007', 1, 'p1009', 's001', '2023-01-31 00:00:00', 189.90, 20.80),
('o0008', 1, 'p1010', 's003', '2023-02-01 00:00:00', 49.90, 6.70);

-- Insertar datos en raw.order_payments
INSERT INTO raw.order_payments (order_id, payment_sequential, payment_type, payment_installments, payment_value) VALUES
('o0001', 1, 'credit_card', 3, 389.80),
('o0002', 1, 'credit_card', 6, 645.70),
('o0003', 1, 'boleto', 1, 218.40),
('o0004', 1, 'credit_card', 2, 162.20),
('o0005', 1, 'credit_card', 4, 557.80),
('o0005', 2, 'voucher', 1, 0.00),
('o0006', 1, 'debit_card', 1, 410.40),
('o0007', 1, 'credit_card', 5, 210.70),
('o0008', 1, 'boleto', 1, 90.60),
('o0009', 1, 'credit_card', 2, 86.60),
('o0010', 1, 'credit_card', 3, 56.60);
