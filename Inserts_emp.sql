-- =================================================================
-- TABLAS SIN DEPENDENCIAS EXTERNAS (O CON DEPENDENCIAS ASUMIDAS)
-- =================================================================

-- Tabla horario
-- Llenamos con diferentes tipos de jornadas laborales.
INSERT INTO horario (dia, fecha_hora_inicio, fecha_hora_fin) VALUES
('Lunes', '08:00:00', '17:00:00'),
('Martes', '08:00:00', '17:00:00'),
('Miercoles', '08:00:00', '17:00:00'),
('Jueves', '08:00:00', '17:00:00'),
('Viernes', '08:00:00', '17:00:00');

INSERT INTO horario (dia, fecha_hora_inicio, fecha_hora_fin) VALUES
('Lunes', '09:00:00', '18:00:00'),
('Martes', '09:00:00', '18:00:00'),
('Miercoles', '09:00:00', '18:00:00'),
('Jueves', '09:00:00', '18:00:00'),
('Viernes', '09:00:00', '18:00:00');

INSERT INTO horario (dia, fecha_hora_inicio, fecha_hora_fin) VALUES
('Lunes', '08:30:00', '16:30:00'),
('Martes', '08:30:00', '16:30:00'),
('Miercoles', '08:30:00', '16:30:00'),
('Jueves', '08:30:00', '16:30:00'),
('Viernes', '08:30:00', '16:30:00'),
('Sabado', '08:30:00', '16:30:00');

INSERT INTO horario (dia, fecha_hora_inicio, fecha_hora_fin) VALUES
('Sabado', '10:00:00', '19:00:00'),
('Domingo', '10:00:00', '19:00:00');

INSERT INTO horario (dia, fecha_hora_inicio, fecha_hora_fin) VALUES
('Lunes', '14:00:00', '22:00:00'),
('Martes', '14:00:00', '22:00:00'),
('Miercoles', '14:00:00', '22:00:00'),
('Jueves', '14:00:00', '22:00:00'),
('Viernes', '14:00:00', '22:00:00');

INSERT INTO horario (dia, fecha_hora_inicio, fecha_hora_fin) VALUES
('Lunes', '07:00:00', '15:00:00');


INSERT INTO horario (dia, fecha_hora_inicio, fecha_hora_fin) VALUES
('Lunes', '08:00:00', '12:00:00'),
('Martes', '08:00:00', '12:00:00'),
('Miercoles', '08:00:00', '12:00:00'),
('Jueves', '08:00:00', '12:00:00'),
('Viernes', '08:00:00', '12:00:00');

INSERT INTO horario (dia, fecha_hora_inicio, fecha_hora_fin) VALUES
('Lunes', '13:00:00', '17:00:00'),
('Martes', '13:00:00', '17:00:00'),
('Miercoles', '13:00:00', '17:00:00'),
('Jueves', '13:00:00', '17:00:00'),
('Viernes', '13:00:00', '17:00:00');

-- Tabla cargo
-- Llenamos con cargos relevantes para la empresa.
INSERT INTO cargo (nombre, descripcion) VALUES
('Gerente General', 'Responsable de la operación total de la tienda.'),
('Gerente de Promociones', 'Encargado de crear y gestionar el "DiarioDeUnaCerveza" y otras ofertas.'),
('Jefe de Compras', 'Responsable de aprobar y emitir órdenes de compra a proveedores.'),
('Jefe de Despacho', 'Coordina la preparación de pedidos para la entrega.'),
('Jefe de Entrega', 'Supervisa la logística de entrega de pedidos a clientes.'),
('Analista de Inventario', 'Controla el stock de productos y genera órdenes de reposición.'),
('Vendedor de Tienda', 'Atiende a los clientes en la tienda física y procesa ventas.'),
('Cajero', 'Responsable del manejo de pagos en la tienda física.'),
('Operador de Almacén', 'Organiza y mantiene el inventario en el almacén.'),
('Repartidor', 'Realiza la entrega de los pedidos a los clientes.');

-- Tabla tipo_beneficio
-- Llenamos con beneficios comunes para empleados.
INSERT INTO tipo_beneficio (nombre, descripcion) VALUES
('Seguro Médico (HCM)', 'Póliza de Hospitalización, Cirugía y Maternidad.'),
('Bono de Alimentación', 'Beneficio de alimentación mensual.'),
('Bono de Transporte', 'Ayuda económica para gastos de transporte.'),
('Plan de Jubilación', 'Aportes para un fondo de pensión privado.'),
('Descuento en Productos', 'Descuento especial en la compra de productos de la empresa.'),
('Bono de Productividad', 'Incentivo monetario por cumplimiento de metas.'),
('Días de Vacaciones Adicionales', 'Días libres pagados adicionales a los de ley.'),
('Fondo de Ahorro', 'Plan de ahorro con aportes de la empresa.'),
('Seguro de Vida', 'Póliza de seguro de vida para el empleado.'),
('Comisiones por Venta', 'Porcentaje de ganancia sobre las ventas realizadas.');

-- Tabla empleado
-- Creamos 10 empleados con datos variados.
INSERT INTO empleado (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, descripcion) VALUES
('Carlos', 'Alberto', 'González', 'Pérez', '1985-05-15', 'Empleado con amplia experiencia en ventas.'),
('Ana', 'María', 'Rodríguez', 'López', '1990-11-20', 'Especialista en logística y despacho.'),
('Luis', 'Miguel', 'Martínez', 'Sánchez', '1988-02-10', 'Encargado del departamento de compras.'),
('Laura', 'Valentina', 'García', 'Ramírez', '1995-07-30', 'Gerente de la sucursal principal.'),
('Javier', 'José', 'Hernández', 'Díaz', '1992-09-05', 'Conductor y repartidor principal.'),
('Sofía', 'Isabel', 'Torres', 'Moreno', '1998-04-12', 'Cajera con excelente atención al cliente.'),
('Diego', 'Andrés', 'Silva', 'Mendoza', '1983-12-01', 'Gerente de promociones y marketing.'),
('Camila', 'Fernanda', 'Rojas', 'Castillo', '1996-06-25', 'Vendedora de tienda y catadora experta.'),
('Ricardo', 'Antonio', 'Ortega', 'Vargas', '1980-03-18', 'Jefe de operaciones de almacén.'),
('Valeria', 'Alejandra', 'Jiménez', 'Reyes', '1993-10-08', 'Analista de inventario y sistemas.');

-- Tabla tienda_fisica
-- Se asume que existen lugares con clave del 1 al 10.
INSERT INTO tienda_fisica (nombre, direccion, rif_empresa, fk_lugar) VALUES
('ACAUCAB Sede Principal', 'Av. Principal, Edif. Cervecero, Piso 1, Caracas', 123456789, 1354),
('ACAUCAB Valencia', 'C.C. Metrópolis, Nivel Sol, Local 10, Valencia', 123456789, 653),
('ACAUCAB Maracay', 'Av. Las Delicias, al lado de la redoma, Maracay', 123456789, 479),
('ACAUCAB Barquisimeto', 'C.C. Sambil, Feria de Comida, Barquisimeto', 123456789, 171),
('ACAUCAB Lechería', 'Av. Américo Vespucio, Plaza Mayor, Lechería', 123456789, 444),
('ACAUCAB Puerto Ordaz', 'C.C. Orinokia, Nivel Oro, Puerto Ordaz', 123456789, 592),
('ACAUCAB Mérida', 'Av. Los Próceres, frente al McDonalds, Mérida', 123456789, 1412),
('ACAUCAB San Cristóbal', 'Barrio Obrero, Carrera 21, San Cristóbal', 123456789, 1265),
('ACAUCAB Maracaibo', 'Av. 5 de Julio, Edif. Zuliano, Maracaibo', 123456789, 879),
('ACAUCAB Maturín', 'C.C. Monagas Plaza, Local 30, Maturín', 123456789, 1068);

-- =================================================================
-- TABLAS CON DEPENDENCIAS DE PRIMER NIVEL
-- =================================================================

-- Tabla departamento
-- Asignamos los 4 tipos de departamentos a diferentes tiendas.
INSERT INTO departamento (nombre, descripcion, fk_tienda_fisica) VALUES
('ventas', 'Departamento de ventas en tienda y corporativas.', 1),
('despacho', 'Departamento de preparación de pedidos.', 1),
('entrega', 'Departamento de logística y reparto.', 1),
('compras', 'Departamento de adquisiciones y relación con proveedores.', 1),
('ventas', 'Departamento de ventas de la sucursal de Valencia.', 2),
('despacho', 'Departamento de preparación de pedidos en Valencia.', 2),
('ventas', 'Departamento de ventas de la sucursal de Maracay.', 3),
('entrega', 'Departamento de logística y reparto en Maracay.', 3),
('ventas', 'Departamento de ventas de la sucursal de Barquisimeto.', 4),
('compras', 'Departamento de compras regional Oeste.', 4);

-- Tabla emp_ben (Empleado - Beneficio)
-- Asignamos beneficios a varios empleados.
INSERT INTO emp_ben (monto, fk_empleado, fk_tipo_beneficio) VALUES
(50, 1, 2),  -- Carlos (1) recibe Bono de Alimentación (2)
(200, 1, 1), -- Carlos (1) recibe Seguro Médico (1)
(50, 2, 2),  -- Ana (2) recibe Bono de Alimentación (2)
(30, 2, 3),  -- Ana (2) recibe Bono de Transporte (3)
(50, 3, 2),  -- Luis (3) recibe Bono de Alimentación (2)
(100, 3, 8), -- Luis (3) recibe Fondo de Ahorro (8)
(5, 4, 5),   -- Laura (4) recibe Descuento en Productos (5)
(80, 7, 10), -- Diego (7) recibe Comisiones por Venta (10)
(50, 8, 2),  -- Camila (8) recibe Bono de Alimentación (2)
(5, 8, 5);   -- Camila (8) recibe Descuento en Productos (5)

-- Tabla telefono
-- Asignamos un teléfono a cada empleado.
INSERT INTO telefono (codigo, numero, fk_empleado) VALUES
(0414, 1234567, 1),
(0412, 2345678, 2),
(0416, 3456789, 3),
(0424, 4567890, 4),
(0414, 5678901, 5),
(0426, 6789012, 6),
(0412, 7890123, 7),
(0416, 8901234, 8),
(0424, 9012345, 9),
(0414, 9876543, 10);

-- Tabla contrato
-- Creamos un contrato para cada empleado, asignándoles cargo y departamento.
INSERT INTO contrato (fecha_inicio, fecha_fin, monto_salario, fk_empleado, fk_cargo, fk_departamento) VALUES
('2020-01-15', NULL, 2500, 4, 1, 1), -- Laura (4) es Gerente General (1) en Ventas (1) de la Sede Principal
('2021-03-01', NULL, 1800, 7, 2, 1), -- Diego (7) es Gerente Promociones (2) en Ventas (1) de la Sede Principal
('2019-06-20', NULL, 1900, 3, 3, 4), -- Luis (3) es Jefe de Compras (3) en Compras (4) de la Sede Principal
('2022-02-10', NULL, 1600, 2, 4, 2), -- Ana (2) es Jefe de Despacho (4) en Despacho (2) de la Sede Principal
('2022-05-01', NULL, 1500, 5, 5, 3), -- Javier (5) es Jefe de Entrega (5) en Entrega (3) de la Sede Principal
('2023-01-20', NULL, 1400, 10, 6, 4),-- Valeria (10) es Analista Inventario (6) en Compras (4) de la Sede Principal
('2023-08-01', NULL, 900, 8, 7, 5),  -- Camila (8) es Vendedora (7) en Ventas (5) de Valencia
('2023-09-15', NULL, 750, 6, 8, 5),  -- Sofía (6) es Cajera (8) en Ventas (5) de Valencia
('2018-11-05', '2022-11-04', 1000, 9, 9, 2), -- Ricardo (9) fue Operador Almacén (9) en Despacho (2) [Contrato finalizado]
('2023-10-01', NULL, 850, 1, 10, 3); -- Carlos (1) es Repartidor (10) en Entrega (3) de la Sede Principal

-- =================================================================
-- TABLAS CON DEPENDENCIAS DE SEGUNDO NIVEL
-- =================================================================

-- Contratos 1 (Laura), 2 (Diego), 4 (Ana): Horario L-V de 08:00 a 17:00 (Claves 1-5)
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(true, 1, 1), (true, 2, 1), (true, 3, 1), (true, 4, 1), (true, 5, 1), -- Laura
(true, 1, 2), (true, 2, 2), (true, 3, 2), (true, 4, 2), (true, 5, 2), -- Diego
(true, 1, 4), (true, 2, 4), (true, 3, 4), (true, 4, 4), (true, 5, 4); -- Ana

-- Contratos 3 (Luis), 6 (Valeria): Horario L-V de 09:00 a 18:00 (Claves 6-10)
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(true, 6, 3), (true, 7, 3), (true, 8, 3), (true, 9, 3), (true, 10, 3), -- Luis
(true, 6, 6), (true, 7, 6), (true, 8, 6), (true, 9, 6), (true, 10, 6); -- Valeria

-- Contratos 5 (Javier) y 7 (Camila): Horario L-S de 08:30 a 16:30 (Claves 11-16)
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(true, 11, 5), (true, 12, 5), (true, 13, 5), (true, 14, 5), (true, 15, 5), (true, 16, 5), -- Javier
(true, 11, 7), (true, 12, 7), (true, 13, 7), (true, 14, 7), (true, 15, 7), (true, 16, 7); -- Camila

-- Contrato 8 (Sofía): Horario de Fin de Semana (Claves 17-18)
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(true, 17, 8), (true, 18, 8); -- Sofía

-- Contrato 9 (Ricardo, INACTIVO): Se asigna su antiguo horario (L-V 8-5) pero como inactivo.
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(false, 1, 9), (false, 2, 9), (false, 3, 9), (false, 4, 9), (false, 5, 9); -- Ricardo

-- Contrato 10 (Carlos): Horario Nocturno L-V (Claves 19-23)
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(true, 19, 10), (true, 20, 10), (true, 21, 10), (true, 22, 10), (true, 23, 10); -- Carlos
-- Tabla vacacion
-- Registramos periodos de vacaciones para algunos contratos.
INSERT INTO vacacion (fecha_inicio, fecha_fin, fk_contrato) VALUES
('2023-12-20', '2024-01-10', 1), -- Laura (Contrato 1) tomó vacaciones en diciembre/enero
('2023-07-15', '2023-07-30', 2), -- Diego (Contrato 2) tomó vacaciones en julio
('2022-08-01', '2022-08-15', 3), -- Luis (Contrato 3) tomó vacaciones en agosto
('2021-09-01', '2021-09-15', 9), -- Ricardo (Contrato 9) tomó vacaciones antes de terminar contrato
('2024-02-05', '2024-02-19', 4), -- Ana (Contrato 4) tomó vacaciones en febrero
('2024-03-01', '2024-03-15', 5), -- Javier (Contrato 5) tomó vacaciones en marzo
('2023-11-10', '2023-11-20', 1), -- Laura (Contrato 1) tomó unos días adicionales
('2023-04-03', '2023-04-17', 7), -- Camila (Contrato 7) tomó vacaciones en abril
('2024-01-02', '2024-01-16', 6), -- Valeria (Contrato 6) tomó vacaciones en enero
('2023-12-18', '2023-12-26', 8); -- Sofía (Contrato 8) tomó vacaciones en diciembre