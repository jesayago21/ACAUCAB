INSERT INTO usuario (clave, username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
(1, 'admin', 'admin123', 4, 678901234, NULL, NULL),
(2, 'supervisor', 'supervisor123', 2, 234567890, NULL, NULL),
(3, 'soporte', 'soporte123', 10, 567890123, NULL, NULL),
(4, 'gerente', 'gerente123', 4, 345678901, NULL, NULL),
(5, 'analista', 'analista123', 5, 901234567, NULL, NULL),
(6, 'cliente1', 'cliente123', 6, NULL, NULL, 1),
(7, 'miembro1', 'miembro123', 7, NULL, 234567890, NULL),
(8, 'empleado1', 'empleado123', 8, 123456789, NULL, NULL),
(9, 'repartidor1', 'repartidor123', 9, 456789012, NULL, NULL),
(10, 'vendedor1', 'vendedor123', 10, 789012345, NULL, NULL);

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

INSERT INTO venta_tienda_fisica (fecha, total_venta, fk_tienda_fisica, fk_cliente) VALUES
('2025-06-17', 150.75, 1, 1),
('2025-06-17', 230.00, 2, 2),
('2025-06-18', 85.50, 3, 3),
('2025-06-18', 310.20, 1, 4),
('2025-06-19', 190.00, 2, 5),
('2025-06-19', 65.40, 3, 1),
('2025-06-20', 450.00, 1, 2),
('2025-06-20', 120.00, 2, 3),
('2025-06-21', 75.80, 3, 4),
('2025-06-21', 200.00, 1, 5);

INSERT INTO tienda_online (nombre, url_web) VALUES
('Cervezas Venezuela Online', 'https://www.cervezasvenezuela.com');

INSERT INTO venta_online (clave, fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario) VALUES
(1, '2025-06-17', 250.50, 'Avenida Libertador, Edificio Sol, Apto 5A', 1013, 1, 1),
(2, '2025-06-17', 120.00, 'Calle Real de Sabana Grande, Quinta La Pradera', 1297, 1, 2),
(3, '2025-06-18', 300.75, 'Plaza Venezuela, Residencias Estudiantes, Piso 10', 470, 1, 3),
(4, '2025-06-18', 80.25, 'Urbanización El Cafetal, Callejon Miranda, Casa 12', 1004, 1, 4),
(5, '2025-06-19', 450.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local B', 548, 1, 5),
(6, '2025-06-19', 180.90, 'El Paraíso, Calle Principal, Edificio Estrella', 715, 1, 6),
(7, '2025-06-20', 95.00, 'La Candelaria, Esquina El Horno, Apartamento 3', 649, 1, 7),
(8, '2025-06-20', 350.40, 'Chacao, Avenida Principal, Centro Comercial', 1004, 1, 8),
(9, '2025-06-21', 500.00, 'Altamira, Calle Sur, Residencia El Ávila, PH', 548, 1, 9),
(10, '2025-06-21', 65.70, 'San Bernardino, Av. La Estrella, Quinta Azul', 649, 1, 10);

INSERT INTO inventario_tienda (clave, fk_lugar_tienda, fk_presentacion, fk_tienda_fisica, cantidad) VALUES
(1, 1, 1, 1, 150),
(2, 2, 2, 1, 200),
(3, 3, 3, 2, 80),
(4, 4, 4, 2, 120),
(5, 5, 5, 3, 250),
(6, 6, 1, 3, 90),
(7, 7, 2, 4, 180),
(8, 8, 3, 4, 70),
(9, 9, 4, 5, 300),
(10, 10, 5, 5, 110);

INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario) VALUES
(1, 1, 2, 12000),
(2, 2, 1, 50000),
(3, 3, 3, 8000),
(4, 1, 4, 15000),
(5, 2, 2, 25000),
(6, 3, 1, 75000),
(7, 1, 5, 10000),
(8, 2, 2, 30000),
(9, 3, 1, 60000),
(10, 1, 3, 18000);

INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda) VALUES
(1, 15075, 1, 1),
(2, 11500, 2, 3),
(3, 2850, 3, 5),
(1, 31020, 4, 2),
(2, 9500, 5, 4),
(1, 6540, 6, 6),
(3, 15000, 7, 7),
(1, 12000, 8, 9),
(2, 3790, 9, 8),
(1, 20000, 10, 10);

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


INSERT INTO metodo_de_pago (moneda, metodo_preferido, fk_usuario, valor, numero_cheque, fecha_vencimiento, banco, numero_tarjeta, tipo) VALUES
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

--Insertar ordenes de compra 
--Ventas online 
INSERT INTO usuario (clave, username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
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




INSERT INTO venta_online (clave, fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario) VALUES
(11, '2025-06-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5A', 706, 1, 6),
(12, '2025-06-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5A', 706, 1, 6),
(13, '2025-06-21', 58.00, 'Calle Real de Sabana Grande, Quinta La Pradera', 706, 1, 12),
(14, '2025-06-21', 40.00, 'Calle Real de Sabana Grande, Quinta La Pradera', 706, 1, 12),
(15, '2025-06-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 4-i', 714, 1, 13),
(16, '2025-06-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 4-i', 714, 1, 13),
(17, '2025-06-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 12', 204, 1, 14),
(18, '2025-06-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 12', 204, 1, 14),
(19, '2025-06-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local B', 209, 1, 15),
(20, '2025-06-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local B', 209, 1, 15),
(21, '2025-07-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5B', 706, 1, 16),
(22, '2025-07-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5B', 706, 1, 16),
(23, '2025-07-21', 58.00, 'Calle Real de Sabana Grande, Quinta Simja', 706, 1, 17),
(24, '2025-07-21', 40.00, 'Calle Real de Sabana Grande, Quinta Simja', 706, 1, 17),
(25, '2025-07-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 1, Apto 4-i', 714, 1, 18),
(26, '2025-07-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 1, Apto 4-i', 714, 1, 18),
(27, '2025-07-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 11', 204, 1, 19),
(28, '2025-07-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 11', 204, 1, 19),
(29, '2025-07-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local A', 209, 1, 20),
(30, '2025-07-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local A', 209, 1, 20),
(31, '2025-07-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5C', 706, 1, 21),
(32, '2025-07-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5C', 706, 1, 21),
(33, '2025-08-21', 58.00, 'Calle Real de Sabana Grande, Quinta Yaheli', 706, 1, 22),
(34, '2025-08-21', 40.00, 'Calle Real de Sabana Grande, Quinta Yaheli', 706, 1, 22),
(35, '2025-08-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 5-i', 714, 1, 23),
(36, '2025-08-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 5-i', 714, 1, 23),
(37, '2025-08-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 10', 204, 1, 24),
(38, '2025-08-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 10', 204, 1, 24),
(39, '2025-08-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local C', 209, 1, 25),
(40, '2025-08-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local C', 209, 1, 25),
(41, '2025-08-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5D', 706, 1, 26),
(42, '2025-08-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5D', 706, 1, 26),
(43, '2025-08-21', 58.00, 'Calle Real de Sabana Grande, Quinta Josefina', 706, 1, 27),
(44, '2025-08-21', 40.00, 'Calle Real de Sabana Grande, Quinta Josefina', 706, 1, 27),
(45, '2025-09-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 6-i', 714, 1, 28),
(46, '2025-09-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 6-i', 714, 1, 28),
(47, '2025-09-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 9', 204, 1, 29),
(48, '2025-09-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 9', 204, 1, 29),
(49, '2025-09-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local D', 209, 1, 30),
(50, '2025-09-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local D', 209, 1, 30),
(51, '2025-09-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5E', 706, 1, 31),
(52, '2025-09-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5E', 706, 1, 31),
(53, '2025-09-21', 58.00, 'Calle Real de Sabana Grande, Quinta Horacio', 706, 1, 32),
(54, '2025-09-21', 40.00, 'Calle Real de Sabana Grande, Quinta Horacio', 706, 1, 32),
(55, '2025-09-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 7-i', 714, 1, 33),
(56, '2025-09-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 7-i', 714, 1, 33),
(57, '2025-10-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 8', 204, 1, 34),
(58, '2025-10-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 8', 204, 1, 34),
(59, '2025-10-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local E', 209, 1, 35),
(60, '2025-10-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local E', 209, 1, 35),
(61, '2025-10-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5F', 706, 1, 36),
(62, '2025-10-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5F', 706, 1, 36),
(63, '2025-10-21', 58.00, 'Calle Real de Sabana Grande, Quinta Rodriguez', 706, 1, 37),
(64, '2025-10-21', 40.00, 'Calle Real de Sabana Grande, Quinta Rodriguez', 706, 1, 37),
(65, '2025-10-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 8-i', 714, 1, 38),
(66, '2025-10-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 8-i', 714, 1, 38),
(67, '2025-10-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 7', 204, 1, 39),
(68, '2025-10-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 7', 204, 1, 39),
(69, '2025-11-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local F', 209, 1, 40),
(70, '2025-11-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local F', 209, 1, 40),
(71, '2025-11-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5G', 706, 1, 41),
(72, '2025-11-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5G', 706, 1, 41),
(73, '2025-11-21', 58.00, 'Calle Real de Sabana Grande, Quinta Hisens', 706, 1, 42),
(74, '2025-11-21', 40.00, 'Calle Real de Sabana Grande, Quinta Hisens', 706, 1, 42),
(75, '2025-11-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 9-i', 714, 1, 43),
(76, '2025-11-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 9-i', 714, 1, 43),
(77, '2025-11-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 6', 204, 1, 44),
(78, '2025-11-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 6', 204, 1, 44),
(79, '2025-11-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local G', 209, 1, 45),
(80, '2025-11-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local G', 209, 1, 45),
(81, '2025-12-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5H', 706, 1, 46),
(82, '2025-12-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5H', 706, 1, 46),
(83, '2025-12-21', 58.00, 'Calle Real de Sabana Grande, Quinta Club', 706, 1, 47),
(84, '2025-12-21', 40.00, 'Calle Real de Sabana Grande, Quinta Club', 706, 1, 47),
(85, '2025-12-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 1, Apto 5-i', 714, 1, 48),
(86, '2025-12-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 1, Apto 5-i', 714, 1, 48),
(87, '2025-12-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 5', 204, 1, 49),
(88, '2025-12-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 5', 204, 1, 49),
(89, '2025-12-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local H', 209, 1, 50),
(90, '2025-12-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local H', 209, 1, 50);
--Insertar 12etalles de ordenes de compra
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario) VALUES
(11, 1, 10, 5),--Orden 1, Venta 11
(12, 2, 12, 4),--Orden 2, Venta 12
(13, 3, 3, 10),--Orden 3 Venta 13
(13, 1, 7, 4),
(14, 5, 10, 4),--Orden 4, Venta 14
(15, 1, 8, 5),--Orden 5, Venta 15
(15, 6, 2, 18),
(16, 2, 10, 4),--Orden 6, Venta 16
(17, 1, 14, 5),--Orden 7, Venta 17
(18, 3, 10, 5),--Orden 8, Venta 18
(19, 8, 1, 10),--Orden 9, Venta 19
(19, 4, 10, 5),
(20, 1, 10, 5),--Orden 10, Venta 20
(21, 1, 10, 5),--Orden 11, Venta 21
(22, 2, 12, 4),--Orden 12, Venta 22
(23, 3, 3, 10),--Orden 13 Venta 23
(23, 1, 7, 4),
(24, 5, 10, 4),--Orden 14, Venta 24
(25, 1, 8, 5),--Orden 15, Venta 25
(25, 6, 2, 18),
(26, 2, 10, 4),--Orden 16, Venta 26
(27, 1, 14, 5),--Orden 17, Venta 27
(28, 3, 10, 5),--Orden 18, Venta 28
(29, 8, 1, 10),--Orden 19, Venta 29
(29, 4, 10, 5),
(30, 1, 10, 5),--Orden 20, Venta 30
(31, 1, 10, 5),--Orden 21, Venta 31
(32, 2, 12, 4),--Orden 22, Venta 32
(33, 3, 3, 10),--Orden 23 Venta 33
(33, 1, 7, 4),
(34, 5, 10, 4),--Orden 24, Venta 34
(35, 1, 8, 5),--Orden 25, Venta 35
(35, 6, 2, 18),
(36, 2, 10, 4),--Orden 26, Venta 36
(37, 1, 14, 5),--Orden 27, Venta 37
(38, 3, 10, 5),--Orden 28, Venta 38
(39, 8, 1, 10),--Orden 29, Venta 39
(39, 4, 10, 5),
(40, 1, 10, 5),--Orden 30, Venta 40
(41, 1, 10, 5),--Orden 31, Venta 41
(42, 2, 12, 4),--Orden 32, Venta 42
(43, 3, 3, 10),--Orden 33 Venta 43
(43, 1, 7, 4),
(44, 5, 10, 4),--Orden 34, Venta 44
(45, 1, 8, 5),--Orden 35, Venta 45
(45, 6, 2, 18),
(46, 2, 10, 4),--Orden 36, Venta 46
(47, 1, 14, 5),--Orden 37, Venta 47
(48, 3, 10, 5),--Orden 38, Venta 48
(49, 8, 1, 10),--Orden 39, Venta 49
(49, 4, 10, 5),
(50, 1, 10, 5),--Orden 40, Venta 50
(51, 1, 10, 5),--Orden 41, Venta 51
(52, 2, 12, 4),--Orden 42, Venta 52
(53, 3, 3, 10),--Orden 43 Venta 53
(53, 1, 7, 4),
(54, 5, 10, 4),--Orden 44, Venta 54
(55, 1, 8, 5),--Orden 45, Venta 55
(55, 6, 2, 18),
(56, 2, 10, 4),--Orden 46, Venta 56
(57, 1, 14, 5),--Orden 47, Venta 57
(58, 3, 10, 5),--Orden 48, Venta 58
(59, 8, 1, 10),--Orden 49, Venta 59
(59, 4, 10, 5),
(60, 1, 10, 5),--Orden 50, Venta 60
(61, 1, 10, 5),--Orden 51, Venta 61
(62, 2, 12, 4),--Orden 52, Venta 62
(63, 3, 3, 10),--Orden 53 Venta 63
(63, 1, 7, 4),
(64, 5, 10, 4),--Orden 54, Venta 64
(65, 1, 8, 5),--Orden 55, Venta 65
(65, 6, 2, 18),
(66, 2, 10, 4),--Orden 56, Venta 66
(67, 1, 14, 5),--Orden 57, Venta 67
(68, 3, 10, 5),--Orden 58, Venta 68
(69, 8, 1, 10),--Orden 59, Venta 69
(69, 4, 10, 5),
(70, 1, 10, 5),--Orden 60, Venta 70
(71, 1, 10, 5),--Orden 61, Venta 71
(72, 2, 12, 4),--Orden 62, Venta 72
(73, 3, 3, 10),--Orden 63 Venta 73
(73, 1, 7, 4),
(74, 5, 10, 4),--Orden 64, Venta 74
(75, 1, 8, 5),--Orden 65, Venta 75
(75, 6, 2, 18),
(76, 2, 10, 4),--Orden 66, Venta 76
(77, 1, 14, 5),--Orden 67, Venta 77
(78, 3, 10, 5),--Orden 68, Venta 78
(79, 8, 1, 10),--Orden 69, Venta 79
(79, 4, 10, 5),
(80, 1, 10, 5),--Orden 70, Venta 80
(81, 1, 10, 5),--Orden 71, Venta 81
(82, 2, 12, 4),--Orden 72, Venta 82
(83, 3, 3, 10),--Orden 73 Venta 83
(83, 1, 7, 4),
(84, 5, 10, 4),--Orden 74, Venta 84
(85, 1, 8, 5),--Orden 75, Venta 85
(85, 6, 2, 18),
(86, 2, 10, 4),--Orden 76, Venta 86
(87, 1, 14, 5),--Orden 77, Venta 87
(88, 3, 10, 5),--Orden 78, Venta 88
(89, 8, 1, 10),--Orden 79, Venta 89
(89, 4, 10, 5),
(90, 1, 10, 5);--Orden 80, Venta 90