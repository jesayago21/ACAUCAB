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