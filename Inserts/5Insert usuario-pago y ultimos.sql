INSERT INTO usuario (clave, username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
(1, 'admin', 'admin', 4, 678901234, NULL, NULL),
(2, 'supervisor', 'supervisor123', 2, 234567890, NULL, NULL),
(3, 'soporte', 'soporte123', 5, 567890123, NULL, NULL),
(4, 'gerente', 'gerente123', 4, 345678901, NULL, NULL),
(5, 'analista', 'analista123', 5, 901234567, NULL, NULL),
(6, 'cliente1', 'cliente123', 6, NULL, NULL, 1),
(7, 'miembro1', 'miembro123', 7, NULL, 234567890, NULL),
(8, 'empleado1', 'empleado123', 5, 123456789, NULL, NULL),
(9, 'repartidor1', 'repartidor123', 5, 456789012, NULL, NULL),
(10, 'vendedor1', 'vendedor123', 5, 789012345, NULL, NULL),
(12, 'cliente2', 'cliente2', 6, NULL, NULL, 2),
(13, 'cliente3', 'cliente3', 6, NULL, NULL, 3),
(14, 'cliente4', 'cliente4', 6, NULL, NULL, 4),
(15, 'cliente5', 'cliente5', 6, NULL, NULL, 5),
(16, 'cliente6', 'cliente6', 6, NULL, NULL, 6),
(17, 'cliente7', 'cliente7', 6, NULL, NULL, 7),
(18, 'cliente8', 'cliente8', 6, NULL, NULL, 8),
(19, 'cliente9', 'cliente9', 6, NULL, NULL, 9),
(20, 'cliente10', 'cliente10', 6, NULL, NULL, 10),
(21, 'cliente11', 'cliente11', 6, NULL, NULL, 11),
(22, 'cliente12', 'cliente12', 6, NULL, NULL, 12),
(23, 'cliente13', 'cliente13', 6, NULL, NULL, 13),
(24, 'cliente14', 'cliente14', 6, NULL, NULL, 14),
(25, 'cliente15', 'cliente15', 6, NULL, NULL, 15),
(26, 'cliente16', 'cliente16', 6, NULL, NULL, 16),
(27, 'cliente17', 'cliente17', 6, NULL, NULL, 17),
(28, 'cliente18', 'cliente18', 6, NULL, NULL, 18),
(29, 'cliente19', 'cliente19', 6, NULL, NULL, 19),
(30, 'cliente20', 'cliente20', 6, NULL, NULL, 20),
(31, 'cliente21', 'cliente21', 6, NULL, NULL, 21),
(32, 'cliente22', 'cliente22', 6, NULL, NULL, 22),
(33, 'cliente23', 'cliente23', 6, NULL, NULL, 23),
(34, 'cliente24', 'cliente24', 6, NULL, NULL, 24),
(35, 'cliente25', 'cliente25', 6, NULL, NULL, 25),
(36, 'cliente26', 'cliente26', 6, NULL, NULL, 26),
(37, 'cliente27', 'cliente27', 6, NULL, NULL, 27),
(38, 'cliente28', 'cliente28', 6, NULL, NULL, 28),
(39, 'cliente29', 'cliente29', 6, NULL, NULL, 29),
(40, 'cliente30', 'cliente30', 6, NULL, NULL, 30),
(41, 'cliente31', 'cliente31', 6, NULL, NULL, 31),
(42, 'cliente32', 'cliente32', 6, NULL, NULL, 32),
(43, 'cliente33', 'cliente33', 6, NULL, NULL, 33),
(44, 'cliente34', 'cliente34', 6, NULL, NULL, 34),
(45, 'cliente35', 'cliente35', 6, NULL, NULL, 35),
(46, 'cliente36', 'cliente36', 6, NULL, NULL, 36),
(47, 'cliente37', 'cliente37', 6, NULL, NULL, 37),
(48, 'cliente38', 'cliente38', 6, NULL, NULL, 38),
(49, 'cliente39', 'cliente39', 6, NULL, NULL, 39),
(50, 'cliente40', 'cliente40', 6, NULL, NULL, 40);

INSERT INTO venta_entrada (fecha, monto_total, fk_evento, fk_cliente, fk_usuario) VALUES
('2025-06-17', 50.00, 1, 1, NULL),
('2025-06-18', 75.50, 2, NULL, 1),
('2025-06-19', 120.00, 3, 2, NULL),
('2025-06-20', 30.00, 4, NULL, 2),
('2025-06-21', 90.75, 5, 3, NULL),
('2025-06-22', 60.00, 1, NULL, 3),
('2025-06-23', 150.25, 2, 4, NULL),
('2025-06-24', 45.00, 3, NULL, 4),
('2025-06-25', 80.00, 4, 5, NULL),
('2025-06-26', 100.00, 5, NULL, 5);

INSERT INTO venta_tienda_fisica (clave, fecha, total_venta, fk_tienda_fisica, fk_cliente) VALUES
(1, '2025-06-17', 150.75, 1, 1),
(2, '2025-06-17', 230.00, 2, 2),
(3, '2025-06-18', 85.50, 3, 3),
(4, '2025-06-18', 310.20, 1, 4),
(5, '2025-06-19', 190.00, 2, 5),
(6, '2025-06-19', 65.40, 3, 1),
(7, '2025-06-20', 450.00, 1, 2),
(8, '2025-06-20', 120.00, 2, 3),
(9, '2025-06-21', 75.80, 3, 4),
(10, '2025-06-21', 200.00, 1, 5);

INSERT INTO tienda_online (clave, nombre, url_web) VALUES
(1,'Cervezas Venezuela Online', 'https://www.cervezasvenezuela.com');

-- PRIMERA PARTE: Insertar solo las ventas online (sin detalles)
INSERT INTO venta_online (clave, fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario) VALUES
(1, '2025-06-17', 250.50, 'Avenida Libertador, Edificio Sol, Apto 5A', 1013, 1, 12),
(2, '2025-06-17', 120.00, 'Calle Real de Sabana Grande, Quinta La Pradera', 1297, 1, 12),
(3, '2025-06-18', 300.75, 'Plaza Venezuela, Residencias Estudiantes, Piso 10', 470, 1, 13),
(4, '2025-06-18', 80.25, 'Urbanización El Cafetal, Callejon Miranda, Casa 12', 1004, 1, 13),
(5, '2025-06-19', 450.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local B', 548, 1, 14),
(6, '2025-06-19', 180.90, 'El Paraíso, Calle Principal, Edificio Estrella', 715, 1, 14),
(7, '2025-06-20', 95.00, 'La Candelaria, Esquina El Horno, Apartamento 3', 649, 1, 15),
(8, '2025-06-20', 350.40, 'Chacao, Avenida Principal, Centro Comercial', 1004, 1, 15),
(9, '2025-06-21', 500.00, 'Altamira, Calle Sur, Residencia El Ávila, PH', 548, 1, 16),
(10, '2025-06-21', 65.70, 'San Bernardino, Av. La Estrella, Quinta Azul', 649, 1, 16),
(11, '2025-06-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5A', 706, 1, 17),
(12, '2025-06-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5A', 706, 1, 17),
(13, '2025-06-21', 58.00, 'Calle Real de Sabana Grande, Quinta La Pradera', 706, 1, 18),
(14, '2025-06-21', 40.00, 'Calle Real de Sabana Grande, Quinta La Pradera', 706, 1, 18),
(15, '2025-06-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 4-i', 714, 1, 19),
(16, '2025-06-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 4-i', 714, 1, 19),
(17, '2025-06-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 12', 204, 1, 20),
(18, '2025-06-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 12', 204, 1, 20),
(19, '2025-06-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local B', 209, 1, 21),
(20, '2025-06-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local B', 209, 1, 21),
(21, '2025-07-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5B', 706, 1, 22),
(22, '2025-07-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5B', 706, 1, 22),
(23, '2025-07-21', 58.00, 'Calle Real de Sabana Grande, Quinta Simja', 706, 1, 23),
(24, '2025-07-21', 40.00, 'Calle Real de Sabana Grande, Quinta Simja', 706, 1, 23),
(25, '2025-07-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 1, Apto 4-i', 714, 1, 24),
(26, '2025-07-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 1, Apto 4-i', 714, 1, 24),
(27, '2025-07-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 11', 204, 1, 25),
(28, '2025-07-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 11', 204, 1, 25),
(29, '2025-07-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local A', 209, 1, 26),
(30, '2025-07-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local A', 209, 1, 26),
(31, '2025-07-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5C', 706, 1, 27),
(32, '2025-07-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5C', 706, 1, 27),
(33, '2025-08-21', 58.00, 'Calle Real de Sabana Grande, Quinta Yaheli', 706, 1, 28),
(34, '2025-08-21', 40.00, 'Calle Real de Sabana Grande, Quinta Yaheli', 706, 1, 28),
(35, '2025-08-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 5-i', 714, 1, 29),
(36, '2025-08-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 5-i', 714, 1, 29),
(37, '2025-08-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 10', 204, 1, 30),
(38, '2025-08-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 10', 204, 1, 30),
(39, '2025-08-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local C', 209, 1, 31),
(40, '2025-08-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local C', 209, 1, 31),
(41, '2025-08-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5D', 706, 1, 32),
(42, '2025-08-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5D', 706, 1, 32),
(43, '2025-08-21', 58.00, 'Calle Real de Sabana Grande, Quinta Josefina', 706, 1, 33),
(44, '2025-08-21', 40.00, 'Calle Real de Sabana Grande, Quinta Josefina', 706, 1, 33),
(45, '2025-09-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 6-i', 714, 1, 34),
(46, '2025-09-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 6-i', 714, 1, 34),
(47, '2025-09-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 9', 204, 1, 35),
(48, '2025-09-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 9', 204, 1, 35),
(49, '2025-09-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local D', 209, 1, 36),
(50, '2025-09-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local D', 209, 1, 36),
(51, '2025-09-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5E', 706, 1, 37),
(52, '2025-09-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5E', 706, 1, 37),
(53, '2025-09-21', 58.00, 'Calle Real de Sabana Grande, Quinta Horacio', 706, 1, 38),
(54, '2025-09-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 7-i', 714, 1, 39),
(55, '2025-09-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 7-i', 714, 1, 39),
(56, '2025-09-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 8', 204, 1, 40),
(57, '2025-09-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 8', 204, 1, 40),
(58, '2025-09-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local E', 209, 1, 41),
(59, '2025-09-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local E', 209, 1, 41),
(60, '2025-09-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5F', 706, 1, 42),
(61, '2025-09-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5F', 706, 1, 42),
(62, '2025-09-21', 58.00, 'Calle Real de Sabana Grande, Quinta Isabel', 706, 1, 43),
(63, '2025-09-21', 40.00, 'Calle Real de Sabana Grande, Quinta Isabel', 706, 1, 43),
(64, '2025-09-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 8-i', 714, 1, 44),
(65, '2025-09-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 8-i', 714, 1, 44),
(66, '2025-09-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 7', 204, 1, 45),
(67, '2025-09-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 7', 204, 1, 45),
(68, '2025-09-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local F', 209, 1, 46),
(69, '2025-09-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local F', 209, 1, 46),
(70, '2025-09-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5G', 706, 1, 47);

INSERT INTO inventario_tienda (clave, fk_lugar_tienda, fk_presentacion, fk_tienda_fisica, cantidad) VALUES
(1, 1, 1, 1, 150),
(2, 2, 2, 1, 200),
(3, 3, 3, 2, 80),
(4, 4, 4, 2, 120),
(5, 5, 5, 1, 250),
(6, 6, 1, 3, 90),
(7, 7, 2, 4, 180),
(8, 8, 3, 1, 70),
(9, 9, 4, 1, 300),
(10, 10, 5, 1, 110);

-- Insertar detalles de venta física usando las claves reales generadas
-- Primera venta física (clave 1)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 1, 15075, 1, 1;

-- Segunda venta física (clave 2)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 2, 11500, 2, 3;

-- Tercera venta física (clave 3)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 3, 2850, 3, 5;

-- Cuarta venta física (clave 4)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 1, 31020, 4, 2;

-- Quinta venta física (clave 5)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 2, 9500, 5, 4;

-- Sexta venta física (clave 6)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 1, 6540, 6, 6;

-- Séptima venta física (clave 7)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 3, 15000, 7, 7;

-- Octava venta física (clave 8)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 1, 12000, 8, 9;

-- Novena venta física (clave 9)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 2, 3790, 9, 8;

-- Décima venta física (clave 10)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 1, 20000, 10, 10;

INSERT INTO reposicion (fk_almacen, fk_inventario_tienda, fk_usuario, cantidad, fecha) VALUES
(1, 1, 1, 50, '2025-06-10'),
(2, 3, 2, 30, '2025-06-11'),
(3, 5, 3, 100, '2025-06-12'),
(1, 2, 1, 75, '2025-06-13'),
(2, 4, 4, 40, '2025-06-14'),
(3, 6, 5, 60, '2025-06-15'),
(1, 7, 1, 25, '2025-06-16'),
(2, 9, 2, 90, '2025-06-17'),
(3, 8, 3, 35, '2025-06-17'),
(1, 10, 4, 55, '2025-06-17');

INSERT INTO tasa_cambio (moneda, monto_equivalencia, fecha_inicio, fecha_fin) VALUES
('VES', 1.00, '2024-01-01', '2024-01-31'),
('USD', 36.50, '2024-01-01', '2024-01-31'),
('EUR', 39.20, '2024-01-01', '2024-01-31'),
('USD', 37.00, '2024-02-01', '2024-02-29'),
('EUR', 40.50, '2024-02-01', '2024-02-29'),
('USD', 38.10, '2024-03-01', '2024-03-31'),
('EUR', 41.80, '2024-03-01', '2024-03-31'),
('USD', 38.90, '2024-04-01', '2025-06-16'),
('EUR', 42.50, '2024-04-01', '2025-06-16'), 
('USD', 39.50, '2025-06-17', NULL); 
-- Insertar tasa de cambio para puntos (ejemplo: 1 punto = 10 Bs)
INSERT INTO tasa_cambio (moneda, monto_equivalencia, fecha_inicio) 
VALUES ('PUNTOS', 10.00, CURRENT_DATE)
ON CONFLICT DO NOTHING;

INSERT INTO metodo_de_pago (moneda, metodo_preferido, fk_cliente, valor, numero_cheque, fecha_vencimiento, banco, numero_tarjeta, tipo) VALUES
('VES', FALSE, NULL, 50000, NULL, NULL, NULL, NULL, 'Efectivo'), -- Efectivo, no preferido, sin usuario
('USD', TRUE, 1, NULL, NULL, '2027-12-31', 'Banco Mercantil', 4111222233334444, 'Tarjeta de credito'), -- Tarjeta de crédito preferida para el usuario 1
('VES', FALSE, NULL, NULL, 10001, NULL, 'Banco de Venezuela', NULL, 'Cheque'), -- Cheque, no preferido, sin usuario
('EUR', FALSE, NULL, NULL, NULL, '2026-08-30', 'BBVA Banco Provincial', 4555666677778888, 'Tarjeta de debito'), -- Tarjeta de débito, no preferida, **sin usuario** para cumplir la restricción
('VES', FALSE, NULL, NULL, NULL, NULL, NULL, NULL, 'Puntos'), -- Puntos, no preferido, sin usuario
('USD', TRUE, 3, NULL, NULL, '2028-04-15', 'Banco Exterior', 4999000011112222, 'Tarjeta de credito'), -- Tarjeta de crédito preferida para el usuario 3
('VES', FALSE, NULL, 10000, NULL, NULL, NULL, NULL, 'Efectivo'), -- Otro efectivo, no preferido, sin usuario
('VES', FALSE, NULL, NULL, 10002, NULL, 'Banco Nacional de Crédito', NULL, 'Cheque'), -- Otro cheque, no preferido, sin usuario
('USD', FALSE, NULL, NULL, NULL, '2026-11-20', 'Banesco', 5111222233334444, 'Tarjeta de debito'), -- Tarjeta de débito, no preferida, **sin usuario**
('EUR', TRUE, 5, NULL, NULL, '2029-01-01', 'BOD', 5222333344445555, 'Tarjeta de credito'); -- Tarjeta de crédito preferida para el usuario 5
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
--Insertar ordenes de compra 
--Ventas online 
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 1, 1, 10, 5;

-- Segunda venta online (clave 2) 
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 2, 2, 12, 4;

-- Tercera venta online (clave 3)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 3, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 3, 1, 7, 4;

-- Cuarta venta online (clave 4)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 4, 5, 10, 4;

-- Quinta venta online (clave 5)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 5, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 5, 6, 2, 18;

-- Sexta venta online (clave 6)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 6, 2, 10, 4;

-- Séptima venta online (clave 7)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 7, 1, 14, 5;

-- Octava venta online (clave 8)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 8, 3, 10, 5;

-- Novena venta online (clave 9)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 9, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 9, 4, 10, 5;

-- Décima venta online (clave 10)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 10, 1, 10, 5;

-- Venta 11 (clave 11)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 11, 1, 10, 5;

-- Venta 12 (clave 12)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 12, 2, 12, 4;

-- Venta 13 (clave 13)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 13, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 13, 1, 7, 4;

-- Venta 14 (clave 14)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 14, 5, 10, 4;

-- Venta 15 (clave 15)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 15, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 15, 6, 2, 18;

-- Venta 16 (clave 16)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 16, 2, 10, 4;

-- Venta 17 (clave 17)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 17, 1, 14, 5;

-- Venta 18 (clave 18)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 18, 3, 10, 5;

-- Venta 19 (clave 19)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 19, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 19, 4, 10, 5;

-- Venta 20 (clave 20)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 20, 1, 10, 5;

-- Venta 21 (clave 21)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 21, 1, 10, 5;

-- Venta 22 (clave 22)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 22, 2, 12, 4;

-- Venta 23 (clave 23)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 23, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 23, 1, 7, 4;

-- Venta 24 (clave 24)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 24, 5, 10, 4;

-- Venta 25 (clave 25)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 25, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 25, 6, 2, 18;

-- Venta 26 (clave 26)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 26, 2, 10, 4;

-- Venta 27 (clave 27)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 27, 1, 14, 5;

-- Venta 28 (clave 28)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 28, 3, 10, 5;

-- Venta 29 (clave 29)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 29, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 29, 4, 10, 5;

-- Venta 30 (clave 30)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 30, 1, 10, 5;

-- Venta 31 (clave 31)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 31, 1, 10, 5;

-- Venta 32 (clave 32)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 32, 2, 12, 4;

-- Venta 33 (clave 33)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 33, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 33, 1, 7, 4;

-- Venta 34 (clave 34)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 34, 5, 10, 4;

-- Venta 35 (clave 35)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 35, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 35, 6, 2, 18;

-- Venta 36 (clave 36)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 36, 2, 10, 4;

-- Venta 37 (clave 37)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 37, 1, 14, 5;

-- Venta 38 (clave 38)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 38, 3, 10, 5;

-- Venta 39 (clave 39)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 39, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 39, 4, 10, 5;

-- Venta 40 (clave 40)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 40, 1, 10, 5;

-- Venta 41 (clave 41)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 41, 1, 10, 5;

-- Venta 42 (clave 42)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 42, 2, 12, 4;

-- Venta 43 (clave 43)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 43, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 43, 1, 7, 4;

-- Venta 44 (clave 44)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 44, 5, 10, 4;

-- Venta 45 (clave 45)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 45, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 45, 6, 2, 18;

-- Venta 46 (clave 46)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 46, 2, 10, 4;

-- Venta 47 (clave 47)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 47, 1, 14, 5;

-- Venta 48 (clave 48)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 48, 3, 10, 5;

-- Venta 49 (clave 49)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 49, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 49, 4, 10, 5;

-- Venta 50 (clave 50)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 50, 1, 10, 5;

-- Venta 51 (clave 51)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 51, 1, 10, 5;

-- Venta 52 (clave 52)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 52, 2, 12, 4;

-- Venta 53 (clave 53)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 53, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 53, 1, 7, 4;

-- Venta 54 (clave 54)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 54, 5, 10, 4;

-- Venta 55 (clave 55)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 55, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 55, 6, 2, 18;

-- Venta 56 (clave 56)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 56, 2, 10, 4;

-- Venta 57 (clave 57)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 57, 1, 14, 5;

-- Venta 58 (clave 58)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 58, 3, 10, 5;

-- Venta 59 (clave 59)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 59, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 59, 4, 10, 5;

-- Venta 60 (clave 60)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 60, 1, 10, 5;

-- Venta 61 (clave 61)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 61, 1, 10, 5;

-- Venta 62 (clave 62)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 62, 2, 12, 4;

-- Venta 63 (clave 63)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 63, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 63, 1, 7, 4;

-- Venta 64 (clave 64)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 64, 5, 10, 4;

-- Venta 65 (clave 65)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 65, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 65, 6, 2, 18;

-- Venta 66 (clave 66)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 66, 2, 10, 4;

-- Venta 67 (clave 67)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 67, 1, 14, 5;

-- Venta 68 (clave 68)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 68, 3, 10, 5;

-- Venta 69 (clave 69)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 69, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 69, 4, 10, 5;

-- Venta 70 (clave 70)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 70, 1, 10, 5;

-- SINCRONIZAR SECUENCIAS DESPUÉS DE INSERTAR DATOS CON CLAVES EXPLÍCITAS
-- Esto evita errores de clave duplicada en futuros inserts automáticos

-- Sincronizar secuencia de venta_online
SELECT setval('venta_online_clave_seq', (SELECT MAX(clave) FROM venta_online));

-- Sincronizar secuencia de venta_tienda_fisica
SELECT setval('venta_tienda_fisica_clave_seq', (SELECT MAX(clave) FROM venta_tienda_fisica));

-- Sincronizar secuencia de usuario
SELECT setval('usuario_clave_seq', (SELECT MAX(clave) FROM usuario));

-- Sincronizar secuencia de detalle_venta_online
SELECT setval('detalle_venta_online_clave_seq', (SELECT MAX(clave) FROM detalle_venta_online));

-- Sincronizar secuencia de detalle_venta_fisica
SELECT setval('detalle_venta_fisica_clave_seq', (SELECT MAX(clave) FROM detalle_venta_fisica));

-- =================================================================
-- VENTAS DE ENTRADAS ADICIONALES PARA EL REPORTE (JUNIO-JULIO 2025)
-- =================================================================

-- Insertar ventas de entradas adicionales en el período correcto
INSERT INTO venta_entrada (fecha, monto_total, fk_evento, fk_cliente, fk_usuario) VALUES
('2025-06-15', 45.00, 1, 1, NULL),
('2025-06-16', 60.00, 2, NULL, 1),
('2025-06-17', 85.50, 3, 2, NULL),
('2025-06-18', 35.00, 4, NULL, 2),
('2025-06-19', 70.25, 5, 3, NULL),
('2025-06-20', 55.00, 1, NULL, 3),
('2025-06-21', 95.75, 2, 4, NULL),
('2025-06-22', 40.00, 3, NULL, 4),
('2025-06-23', 65.50, 4, 5, NULL),
('2025-06-24', 80.00, 5, NULL, 5),
('2025-06-25', 50.00, 1, 1, NULL),
('2025-06-26', 75.25, 2, NULL, 1),
('2025-06-27', 90.00, 3, 2, NULL),
('2025-06-28', 30.00, 4, NULL, 2),
('2025-06-29', 65.75, 5, 3, NULL),
('2025-06-30', 55.50, 1, NULL, 3),
('2025-07-01', 85.00, 2, 4, NULL),
('2025-07-02', 45.25, 3, NULL, 4),
('2025-07-03', 70.00, 4, 5, NULL),
('2025-07-04', 95.50, 5, NULL, 5);