-- INSERT de métodos de pago favoritos de ejemplo
-- Estos son para probar la funcionalidad de métodos favoritos en el frontend

-- Métodos favoritos para cliente ID 1 (José Francisco)
INSERT INTO metodo_de_pago (moneda, fk_cliente, metodo_preferido, numero_tarjeta, fecha_vencimiento, banco, tipo)
VALUES 
('VES', 1, TRUE, 4111111111111111, '2025-12-01', 'Banco de Venezuela', 'Tarjeta de credito'),
('VES', 1, TRUE, 5555555555554444, '2026-08-01', 'Banesco', 'Tarjeta de debito');

-- Métodos favoritos para cliente ID 2 (María Elena)
INSERT INTO metodo_de_pago (moneda, fk_cliente, metodo_preferido, numero_tarjeta, fecha_vencimiento, banco, tipo)
VALUES 
('VES', 2, TRUE, 4000000000000002, '2025-10-01', 'Mercantil', 'Tarjeta de credito');

-- Métodos favoritos para cliente ID 3 (Carlos Andrés)
INSERT INTO metodo_de_pago (moneda, fk_cliente, metodo_preferido, numero_tarjeta, fecha_vencimiento, banco, tipo)
VALUES 
('VES', 3, TRUE, 3782822463100005, '2027-03-01', 'Provincial', 'Tarjeta de credito'),
('VES', 3, TRUE, 6011000990139424, '2026-06-01', 'Bicentenario', 'Tarjeta de debito');

-- Métodos favoritos para cliente jurídico ID 4 (EMPRESA DEMO)
INSERT INTO metodo_de_pago (moneda, fk_cliente, metodo_preferido, numero_tarjeta, fecha_vencimiento, banco, tipo)
VALUES 
('VES', 4, TRUE, 4242424242424242, '2025-11-01', 'Banco Nacional de Crédito', 'Tarjeta de credito'); 