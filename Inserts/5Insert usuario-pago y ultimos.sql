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
(1, '2025-06-17', 250.50, 'Avenida Libertador, Edificio Sol, Apto 5A', 1, 1, 1),
(2, '2025-06-17', 120.00, 'Calle Real de Sabana Grande, Quinta La Pradera', 2, 1, 2),
(3, '2025-06-18', 300.75, 'Plaza Venezuela, Residencias Estudiantes, Piso 10', 3, 1, 3),
(4, '2025-06-18', 80.25, 'Urbanización El Cafetal, Callejon Miranda, Casa 12', 4, 1, 4),
(5, '2025-06-19', 450.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local B', 5, 1, 5),
(6, '2025-06-19', 180.90, 'El Paraíso, Calle Principal, Edificio Estrella', 6, 1, 6),
(7, '2025-06-20', 95.00, 'La Candelaria, Esquina El Horno, Apartamento 3', 7, 1, 7),
(8, '2025-06-20', 350.40, 'Chacao, Avenida Principal, Centro Comercial', 8, 1, 8),
(9, '2025-06-21', 500.00, 'Altamira, Calle Sur, Residencia El Ávila, PH', 9, 1, 9),
(10, '2025-06-21', 65.70, 'San Bernardino, Av. La Estrella, Quinta Azul', 10, 1, 10);

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

