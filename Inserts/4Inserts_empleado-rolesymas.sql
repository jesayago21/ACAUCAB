-- =================================================================
-- TABLAS de EMPLEADOS, HORARIOS, CARGO, BENEFICIOS, NAN, departamento, tienda fisica, LUGAR TIENDA
-- =================================================================

-- Tabla horario
-- Llenamos con diferentes tipos de jornadas laborales.
INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(1, 'Lunes', '08:00:00', '17:00:00'),
(2, 'Martes', '08:00:00', '17:00:00'),
(3, 'Miercoles', '08:00:00', '17:00:00'),
(4, 'Jueves', '08:00:00', '17:00:00'),
(5, 'Viernes', '08:00:00', '17:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(6, 'Lunes', '09:00:00', '18:00:00'),
(7, 'Martes', '09:00:00', '18:00:00'),
(8, 'Miercoles', '09:00:00', '18:00:00'),
(9, 'Jueves', '09:00:00', '18:00:00'),
(10, 'Viernes', '09:00:00', '18:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(11, 'Lunes', '08:30:00', '16:30:00'),
(12, 'Martes', '08:30:00', '16:30:00'),
(13, 'Miercoles', '08:30:00', '16:30:00'),
(14, 'Jueves', '08:30:00', '16:30:00'),
(15, 'Viernes', '08:30:00', '16:30:00'),
(16, 'Sabado', '08:30:00', '16:30:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(17, 'Sabado', '10:00:00', '19:00:00'),
(18, 'Domingo', '10:00:00', '19:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(19, 'Lunes', '14:00:00', '22:00:00'),
(20, 'Martes', '14:00:00', '22:00:00'),
(21, 'Miercoles', '14:00:00', '22:00:00'),
(22, 'Jueves', '14:00:00', '22:00:00'),
(23, 'Viernes', '14:00:00', '22:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(24, 'Lunes', '07:00:00', '15:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(25, 'Lunes', '08:00:00', '12:00:00'),
(26, 'Martes', '08:00:00', '12:00:00'),
(27, 'Miercoles', '08:00:00', '12:00:00'),
(28, 'Jueves', '08:00:00', '12:00:00'),
(29, 'Viernes', '08:00:00', '12:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(30, 'Lunes', '13:00:00', '17:00:00'),
(31, 'Martes', '13:00:00', '17:00:00'),
(32, 'Miercoles', '13:00:00', '17:00:00'),
(33, 'Jueves', '13:00:00', '17:00:00'),
(34, 'Viernes', '13:00:00', '17:00:00');
-- Tabla cargo
-- Llenamos con cargos relevantes para la empresa.
INSERT INTO cargo (clave, nombre, descripcion) VALUES
(1,'Gerente General', 'Responsable de la operación total de la tienda.'),
(2,'Gerente de Promociones', 'Encargado de crear y gestionar el "DiarioDeUnaCerveza" y otras ofertas.'),
(3,'Jefe de Compras', 'Responsable de aprobar y emitir órdenes de compra a proveedores.'),
(4,'Jefe de Despacho', 'Coordina la preparación de pedidos para la entrega.'),
(5,'Jefe de Entrega', 'Supervisa la logística de entrega de pedidos a clientes.'),
(6,'Analista de Inventario', 'Controla el stock de productos y genera órdenes de reposición.'),
(7,'Vendedor de Tienda', 'Atiende a los clientes en la tienda física y procesa ventas.'),
(8,'Cajero', 'Responsable del manejo de pagos en la tienda física.'),
(9,'Operador de Almacén', 'Organiza y mantiene el inventario en el almacén.'),
(10,'Repartidor', 'Realiza la entrega de los pedidos a los clientes.');

-- Tabla tipo_beneficio
-- Llenamos con beneficios comunes para empleados.
INSERT INTO tipo_beneficio (clave, nombre, descripcion) VALUES
(1,'Seguro Médico (HCM)', 'Póliza de Hospitalización, Cirugía y Maternidad.'),
(2,'Bono de Alimentación', 'Beneficio de alimentación mensual.'),
(3,'Bono de Transporte', 'Ayuda económica para gastos de transporte.'),
(4,'Plan de Jubilación', 'Aportes para un fondo de pensión privado.'),
(5,'Descuento en Productos', 'Descuento especial en la compra de productos de la empresa.'),
(6,'Bono de Productividad', 'Incentivo monetario por cumplimiento de metas.'),
(7,'Días de Vacaciones Adicionales', 'Días libres pagados adicionales a los de ley.'),
(8,'Fondo de Ahorro', 'Plan de ahorro con aportes de la empresa.'),
(9,'Seguro de Vida', 'Póliza de seguro de vida para el empleado.'),
(10,'Comisiones por Venta', 'Porcentaje de ganancia sobre las ventas realizadas.');

-- Tabla empleado
-- Creamos 10 empleados con datos variados.
INSERT INTO empleado (ci, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, descripcion) VALUES
(123456789, 'Carlos', 'Alberto', 'González', 'Pérez', '1985-05-15', 'Empleado con amplia experiencia en ventas.'),
(987654321, 'Ana', 'María', 'Rodríguez', 'López', '1990-11-20', 'Especialista en logística y despacho.'),
(234567890, 'Luis', 'Miguel', 'Martínez', 'Sánchez', '1988-02-10', 'Encargado del departamento de compras.'),
(345678901, 'Laura', 'Valentina', 'García', 'Ramírez', '1995-07-30', 'Gerente de la sucursal principal.'),
(456789012, 'Javier', 'José', 'Hernández', 'Díaz', '1992-09-05', 'Conductor y repartidor principal.'),
(567890123, 'Sofía', 'Isabel', 'Torres', 'Moreno', '1998-04-12', 'Cajera con excelente atención al cliente.'),
(678901234, 'Diego', 'Andrés', 'Silva', 'Mendoza', '1983-12-01', 'Gerente de promociones y marketing.'),
(789012345, 'Camila', 'Fernanda', 'Rojas', 'Castillo', '1996-06-25', 'Vendedora de tienda y catadora experta.'),
(890123456, 'Ricardo', 'Antonio', 'Ortega', 'Vargas', '1980-03-18', 'Jefe de operaciones de almacén.'),
(901234567, 'Valeria', 'Alejandra', 'Jiménez', 'Reyes', '1993-10-08', 'Analista de inventario y sistemas.');

-- Tabla tienda_fisica
-- Se asume que existen lugares con clave del 1 al 10.
INSERT INTO tienda_fisica (clave, nombre, direccion, rif_empresa, fk_lugar) VALUES
(1,'ACAUCAB Sede Principal', 'Av. Principal, Edif. Cervecero, Piso 1', 123456789, 1354),
(2,'ACAUCAB Valencia', 'C.C. Metrópolis, Nivel Sol, Local 10', 123456789, 653),
(3,'ACAUCAB Maracay', 'Av. Las Delicias, al lado de la redoma', 123456789, 479),
(4,'ACAUCAB Barquisimeto', 'C.C. Sambil, Feria de Comida', 123456789, 171),
(5,'ACAUCAB Lechería', 'Av. Américo Vespucio, Plaza Mayor', 123456789, 444),
(6,'ACAUCAB Puerto Ordaz', 'C.C. Orinokia, Nivel Oro', 123456789, 592),
(7,'ACAUCAB Mérida', 'Av. Los Próceres, frente al McDonalds', 123456789, 1412),
(8,'ACAUCAB San Cristóbal', 'Barrio Obrero, Carrera 21', 123456789, 1265),
(9,'ACAUCAB Maracaibo', 'Av. 5 de Julio, Edif. Zuliano', 123456789, 879),
(10,'ACAUCAB Maturín', 'C.C. Monagas Plaza, Local 30', 123456789, 1068);

-- =================================================================
-- TABLAS CON DEPENDENCIAS DE PRIMER NIVEL
-- =================================================================

-- Tabla departamento
-- Asignamos los 4 tipos de departamentos a diferentes tiendas.
INSERT INTO departamento (clave, nombre, descripcion, fk_tienda_fisica) VALUES
(1,'ventas', 'Departamento de ventas en tienda y corporativas.', 1),
(2,'despacho', 'Departamento de preparación de pedidos.', 1),
(3,'entrega', 'Departamento de logística y reparto.', 1),
(4,'compras', 'Departamento de adquisiciones y relación con proveedores.', 1),
(5,'ventas', 'Departamento de ventas de la sucursal de Valencia.', 2),
(6,'despacho', 'Departamento de preparación de pedidos en Valencia.', 2),
(7,'ventas', 'Departamento de ventas de la sucursal de Maracay.', 3),
(8,'entrega', 'Departamento de logística y reparto en Maracay.', 3),
(9,'ventas', 'Departamento de ventas de la sucursal de Barquisimeto.', 4),
(10,'compras', 'Departamento de compras regional Oeste.', 4);

-- Tabla emp_ben (Empleado - Beneficio)
-- Asignamos beneficios a varios empleados.
INSERT INTO emp_ben (monto, fk_empleado, fk_tipo_beneficio) VALUES
(50, 123456789, 2),  -- Carlos (1) recibe Bono de Alimentación (2)
(200,987654321, 1), -- Carlos (1) recibe Seguro Médico (1)
(50, 234567890, 2),  -- Ana (2) recibe Bono de Alimentación (2)
(30, 345678901, 3),  -- Ana (2) recibe Bono de Transporte (3)
(50, 456789012, 2),  -- Luis (3) recibe Bono de Alimentación (2)
(100,567890123, 8), -- Luis (3) recibe Fondo de Ahorro (8)
(5, 678901234,5),   -- Laura (4) recibe Descuento en Productos (5)
(80, 789012345, 10), -- Diego (7) recibe Comisiones por Venta (10)
(50, 890123456, 2),  -- Camila (8) recibe Bono de Alimentación (2)
(5, 901234567,5);   -- Camila (8) recibe Descuento en Productos (5)


-- Insertar persona_contacto (10 ejemplos)
INSERT INTO persona_contacto (clave, primer_nombre, primer_apellido, fk_miembro, fk_cliente) VALUES
(1,'Juan','Pérez',234567890,NULL), -- Persona de contacto del miembro 1
(2,'Ana','Gómez',345678901,NULL), -- Persona de contacto del miembro 1
(3,'Luis','Martínez',456789012,NULL), -- Persona de contacto del miembro 2
(4,'María','López',567890123,NULL), -- Persona de contacto del miembro 2
(5,'Carlos','Hernández',678901234,NULL), -- Persona de contacto del miembro 3
(6,'Laura','Ramírez',NULL,21), -- Persona de contacto del cliente 21
(7,'Pedro','Torres',NULL,22), -- Persona de contacto del cliente 22
(8,'Sofía','Vásquez',NULL,22), -- Persona de contacto del cliente 22
(9,'Andrés','Morales',NULL,23), -- Persona de contacto del cliente 23
(10,'Isabel','Reyes',NULL,23); -- Persona de contacto del cliente 23

-- Tabla telefono
-- Asignamos un teléfono a cada empleado.
INSERT INTO telefono (codigo, numero, extension, fk_empleado, fk_cliente, fk_miembro, fk_persona_contacto) VALUES 
(0414, 1234567, 1, 123456789, NULL, NULL, NULL),
(0416, 2345678, 2, NULL, 2, NULL, NULL),
(0412, 3456789, 3, NULL, 3, NULL, NULL),
(0424, 4567890, 4, NULL, NULL, NULL, 4),
(0426, 5678901, 5, 456789012, NULL, NULL, NULL),
(0414, 6789012, 6, NULL, 6, NULL, NULL),
(0416, 7890123, 7, NULL, 7, NULL, NULL),
(0412, 8901234, 8, NULL, NULL, NULL, 8),
(0424, 9012345, 9, 901234567, NULL, NULL, NULL),
(0426, 1122334, 10, NULL, 10, NULL, NULL);

INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(1, 'Crear usuarios', 'Permite crear nuevos usuarios en el sistema'),
(2, 'Editar usuarios', 'Permite editar información de usuarios'),
(3, 'Eliminar usuarios', 'Permite eliminar usuarios del sistema'),
(4, 'Ver reportes', 'Permite visualizar reportes'),
(5, 'Configurar sistema', 'Permite modificar la configuración general'),
(6, 'Exportar datos', 'Permite exportar información a archivos'),
(7, 'Importar datos', 'Permite importar información desde archivos'),
(8, 'Cambiar contraseña', 'Permite cambiar la contraseña propia'),
(9, 'Ver historial', 'Permite ver el historial de compras o ventas'),
(10, 'Gestionar roles', 'Permite crear, editar o eliminar roles de usuario'),
(11, 'Consultar cervezas', 'Permite ver las cervezas disponibles'),
(12, 'Realizar ventas', 'Permite registrar ventas de cervezas'),
(13, 'Realizar compras', 'Permite registrar compras de cervezas'),
(14, 'Gestionar promociones', 'Permite crear y editar promociones de cervezas'),
(15, 'Gestionar proveedores', 'Permite añadir o modificar proveedores de cervezas'),
(16, 'Gestionar clientes', 'Permite añadir o modificar información de clientes'),
(17, 'Gestionar pedidos', 'Permite gestionar los pedidos encargados'),
(18, 'Consultar catálogo', 'Permite ver el catálogo de cervezas'),
(19, 'Ver inventario', 'Permite ver el inventario actual de cervezas'),
(20, 'Gestionar inventario', 'Permite modificar el inventario de cervezas'),
(21, 'Acceso a soporte', 'Permite acceder al sistema de soporte técnico'),
(22, 'Ver estadísticas', 'Permite ver estadísticas de ventas y usuarios');

-- Insertar roles (10 ejemplos)
INSERT INTO rol (clave, nombre) VALUES
(1,'Administrador'),
(2, 'Supervisor'),
(3, 'Soporte Técnico'),
(4,'Gerente'),
(5,'Analista'),
(6,'Cliente'),
(7,'Miembro'),
(8,'Empleado'),
(9,'Repartidor'),
(10,'Vendedor');


INSERT INTO rol_pri (clave, fecha, fk_rol, fk_privilegio) VALUES
(1, CURRENT_DATE, 1, 1), -- Administrador con privilegio de crear usuarios
(2, CURRENT_DATE, 1, 2), -- Administrador con privilegio de editar usuarios
(3, CURRENT_DATE, 1, 3), -- Administrador con privilegio de eliminar usuarios
(4, CURRENT_DATE, 1, 4), -- Administrador con privilegio de ver reportes
(5, CURRENT_DATE, 1, 5), -- Administrador con privilegio de configurar sistema
(6, CURRENT_DATE, 1, 6), -- Administrador con privilegio de exportar datos
(7, CURRENT_DATE, 1, 7), -- Administrador con privilegio de importar datos
(8, CURRENT_DATE, 1, 8), -- Administrador con privilegio de cambiar contraseña
(9, CURRENT_DATE, 1, 9), -- Administrador con privilegio de ver historial
(10, CURRENT_DATE, 1, 10); -- Administrador con privilegio de gestionar roles


INSERT INTO correo_electronico (clave, direccion_email, fk_cliente, fk_miembro, fk_persona_contacto) VALUES
(1, 'cliente1@gmail.com', 1, NULL, NULL),
(2, 'cliente2@hotmail.com', 2, NULL, NULL),
(3, 'cliente3@gmail.com', 3, NULL, NULL),
(4, 'miembro1@gmail.com', NULL, 456789012, NULL),
(5, 'miembro1@hotmail.com', NULL, 678901234, NULL),
(6, 'miembro2@gmail.com', NULL, 890123456, NULL),
(7, 'miembro3@gmail.com', NULL, 223344556, NULL),
(8, 'personacontacto1@gmail.com', NULL, NULL, 1),
(9, 'personacontacto2@gmail.com', NULL, NULL, 2),
(10, 'personacontacto3@gmail.com', NULL, NULL, 3);



-- Tabla contrato
-- Creamos un contrato para cada empleado, asignándoles cargo y departamento.
INSERT INTO contrato (clave, fecha_inicio, fecha_fin, monto_salario, fk_empleado, fk_cargo, fk_departamento) VALUES
(1,'2020-01-15', NULL, 2500, 123456789, 4, 1), -- Laura (4) es Gerente General (1) en Ventas (1) de la Sede Principal
(2,'2021-03-01', NULL, 1800, 987654321, 7, 1), -- Diego (7) es Gerente Promociones (2) en Ventas (1) de la Sede Principal
(3,'2019-06-20', NULL, 1900,  234567890, 3, 4), -- Luis (3) es Jefe de Compras (3) en Compras (4) de la Sede Principal
(4,'2022-02-10', NULL, 1600, 345678901, 2,  2), -- Ana (2) es Jefe de Despacho (4) en Despacho (2) de la Sede Principal
(5,'2022-05-01', NULL, 1500, 456789012, 5,  3), -- Javier (5) es Jefe de Entrega (5) en Entrega (3) de la Sede Principal
(6,'2023-01-20', NULL, 1400, 567890123, 10, 4),-- Valeria (10) es Analista Inventario (6) en Compras (4) de la Sede Principal
(7,'2023-08-01', NULL, 900, 678901234,8, 5),  -- Camila (8) es Vendedora (7) en Ventas (5) de Valencia
(8,'2023-09-15', NULL, 750, 789012345, 6, 5),  -- Sofía (6) es Cajera (8) en Ventas (5) de Valencia
(9,'2018-11-05', NULL, 1000,890123456,9, 2), -- Ricardo (9) fue Operador Almacén (9) en Despacho (2) [Contrato finalizado]
(10,'2023-10-01', NULL, 850, 901234567, 1, 3); -- Carlos (1) es Repartidor (10) en Entrega (3) de la Sede Principal

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

-- =================================================================
-- INSERCIÓN DE DATOS EN LA TABLA 'control_entrada'
-- Se simulan 10 fichajes de entrada y salida basados en los contratos
-- y horarios previamente definidos.
-- =================================================================

INSERT INTO control_entrada (fecha_hora_entrada, fecha_hora_salida, fk_contrato) VALUES
-- Registro 1: Laura (Contrato 1) - Llega un poco antes y se va a su hora en un día laboral normal.
-- Su horario es de 08:00 a 17:00.
('2024-05-20 07:57:10', '2024-05-20 17:02:30', 1),

-- Registro 2: Ana (Contrato 4) - Llega un poco tarde y se va 30 minutos después de su hora.
-- Su horario es de 08:00 a 17:00.
('2024-05-20 08:10:05', '2024-05-20 17:31:00', 4),

-- Registro 3: Luis (Contrato 3) - Un día normal. Llega puntual y se va puntual.
-- Su horario es de 09:00 a 18:00.
('2024-05-21 08:59:15', '2024-05-21 18:01:00', 3),

-- Registro 4: Sofía (Contrato 8) - Trabaja un fin de semana (su horario es de 10:00 a 19:00).
-- Es importante que el fichaje sea en Sábado o Domingo para ser coherente.
('2024-05-25 09:55:00', '2024-05-25 19:05:45', 8),

-- Registro 5: Carlos (Contrato 10) - Fichaje de su turno nocturno.
-- Entra a las 22:00 de un día y sale a las 06:00 del día siguiente.
-- Su horario es de 22:00 a 06:00.
('2024-05-22 21:58:30', '2024-05-23 06:03:10', 10),

-- Registro 6: Laura (Contrato 1) - Otro día, pero se retira más temprano por una cita médica.
('2024-05-23 08:01:20', '2024-05-23 14:30:00', 1),

-- Registro 7: Ricardo (Contrato 9) - Un registro histórico de antes que su contrato finalizara.
-- Su contrato terminó el 2022-11-04. Este fichaje es de Octubre 2022.
('2022-10-17 07:58:00', '2022-10-17 17:05:00', 9),

-- Registro 8: Javier (Contrato 5) - Olvidó marcar su salida.
-- El campo fecha_hora_salida quedará como NULL.
('2024-05-24 08:28:00', NULL, 5),

-- Registro 9: Camila (Contrato 7) - Se queda haciendo horas extras un viernes.
-- Su horario es hasta las 16:30.
('2024-05-24 08:35:10', '2024-05-24 19:15:22', 7),

-- Registro 10: Valeria (Contrato 6) - Un día estándar.
-- Su horario es de 09:00 a 18:00.
('2024-05-27 09:02:50', '2024-05-27 18:00:15', 6);

 --TAMBIEN LuGAR TIENDA AQUI
-- =================================================================
-- INSERCIÓN DE DATOS EN LA TABLA 'lugar_tienda'
-- Se crea una jerarquía: Zona -> Pasillo -> Anaquel.
-- NOTA: Se usa la estrategia del "nodo raíz" para cumplir con la restricción NOT NULL.
-- =================================================================

-- Paso 1: Crear el nodo raíz ficticio que se contiene a sí mismo.
-- Este registro representará a toda la tienda física.
INSERT INTO lugar_tienda (nombre, tipo) VALUES
('Tienda ACAUCAB Sede Principal', 'zona'); -- Clave: 1 (asumida, se autoapunta)

-- Paso 2: Crear las Zonas principales, que están contenidas en la "Tienda".
-- (fk_lugar_tienda = 1)
INSERT INTO lugar_tienda (nombre, tipo, fk_lugar_tienda) VALUES
('Almacén Principal', 'zona', 1),             -- Clave: 2
('Piso de Ventas', 'zona', 1);                 -- Clave: 3

-- Paso 3: Crear los Pasillos dentro del Almacén Principal.
-- (fk_lugar_tienda = 2)
INSERT INTO lugar_tienda (nombre, tipo, fk_lugar_tienda) VALUES
('Pasillo de Recepción de Mercancía', 'pasillo', 2), -- Clave: 4
('Pasillo de Cajas Nacionales (Stock)', 'pasillo', 2),  -- Clave: 5
('Pasillo de Barriles (Stock)', 'pasillo', 2);         -- Clave: 6

-- Paso 4: Crear los Pasillos en el Piso de Ventas.
-- (fk_lugar_tienda = 3)
INSERT INTO lugar_tienda (nombre, tipo, fk_lugar_tienda) VALUES
('Pasillo de Cervezas Claras (Lager/Pilsner)', 'pasillo', 3), -- Clave: 7
('Pasillo de Cervezas Oscuras (Stout/Porter)', 'pasillo', 3), -- Clave: 8
('Pasillo de Cervezas Especiales (IPA/APA)', 'pasillo', 3),   -- Clave: 9
('Pasillo de Ofertas - DiarioDeUnaCerveza', 'pasillo', 3);     -- Clave: 10

-- Paso 5: Crear los Anaqueles dentro de los pasillos del Piso de Ventas.
-- Estos son los lugares específicos donde se realiza la reposición.
INSERT INTO lugar_tienda (nombre, tipo, fk_lugar_tienda) VALUES
-- Anaqueles para el pasillo de Cervezas Claras (fk_lugar_tienda = 7)
('Anaquel Superior - Pilsner', 'anaquel', 7),   -- Clave: 11
('Anaquel Inferior - Lager', 'anaquel', 7),     -- Clave: 12

-- Anaqueles para el pasillo de Cervezas Oscuras (fk_lugar_tienda = 8)
('Anaquel Izquierdo - Stouts', 'anaquel', 8),   -- Clave: 13
('Anaquel Derecho - Porters', 'anaquel', 8),    -- Clave: 14

-- Anaquel para el pasillo de Ofertas (fk_lugar_tienda = 10)
('Exhibidor Central de Ofertas', 'anaquel', 10);-- Clave: 15

--Insertar presentacion (10 ejemplos)
INSERT INTO presentacion (EAN_13, nombre, cantidad_unidades, fk_cerveza) VALUES
(7501234567890, 'Botella 330ml', 24, 1),
(7501234567891, 'Lata 355ml', 12, 2),
(7501234567892, 'Pack 6 Botellas 330ml', 6, 3),
(7501234567893, 'Botella 500ml', 20, 4),
(7501234567894, 'Lata 473ml', 24, 5),
(7501234567895, 'Pack 12 Latas 355ml', 12, 6),
(7501234567896, 'Botella 1L', 8, 7),
(7501234567897, 'Growler 2L', 4, 8),
(7501234567898, 'Pack 4 Latas 473ml', 4, 9),
(7501234567899, 'Botella 750ml', 10, 10);

--Insertar almacen (10 ejemplos)
INSERT INTO almacen (fk_presentacion, cantidad_unidades) VALUES
(1, 15000),
(2, 12000),
(3, 30000),
(4, 18000),
(5, 19500),
(6, 16000),
(7, 24000),
(8, 15000),
(9, 20000),
(10, 23500);

--Insertar oferta (10 ejemplos)

INSERT INTO oferta (porcentaje_descuento, fecha_inicio, fecha_fin, fk_presentacion) VALUES
(10, '2025-07-01', '2025-08-01', 1),
(15, '2025-07-05', '2025-08-01', 2),
(20, '2025-07-10', '2025-08-02', 3),
(5,  '2025-07-12', '2025-08-03', 4),
(25, '2025-07-15', '2025-08-08', 5),
(30, '2025-07-20', '2025-08-08', 6),
(12, '2025-07-22', '2025-08-08', 7),
(18, '2025-07-25', '2025-08-09', 8),
(8,  '2025-07-28', '2025-08-09', 9),
(22, '2025-08-01', '2025-08-10', 10);

INSERT INTO inventario_evento (clave, fk_presentacion, fk_evento, cantidad_unidades) VALUES
(1, 1, 1, 24),  -- Evento 1 con Botella 330ml
(2, 2, 2, 12),  -- Evento 2 con Lata 355ml
(3, 3, 3, 6),   -- Evento 3 con Pack 6 Botellas 330ml
(4, 4, 4, 20),  -- Evento 4 con Botella 500ml
(5, 5, 5, 24),  -- Evento 5 con Lata 473ml
(6, 6, 6, 12),  -- Evento 6 con Pack 12 Latas 355ml
(7, 7, 7, 8),   -- Evento 7 con Botella 1L
(8, 8, 8, 4),   -- Evento 8 con Growler 2L
(9, 9, 9, 4),   -- Evento 9 con Pack 4 Latas 473ml
(10, 10, 10, 10); -- Evento 10 con Botella 750ml

INSERT INTO venta_evento (clave, fecha, monto_total, fk_evento, fk_cliente) VALUES
(1, '2025-06-01', 150.75, 1, 1),
(2, '2025-06-02', 200.50, 2, 2),
(3, '2025-06-03', 175.30, 3, 3),
(4, '2025-06-04', 220.90, 4, 4),
(5, '2025-06-05', 189.45, 5, 5),
(6, '2025-06-06', 250.80, 6, 6),
(7, '2025-06-07', 130.60, 7, 7),
(8, '2025-06-08', 275.20, 8, 8),
(9, '2025-06-09', 165.90, 9, 9),
(10, '2025-06-10', 300.00, 10, 10);

INSERT INTO detalle_venta_evento (cantidad, precio_unitario, fk_venta_evento, fk_inventario_evento) VALUES
(2, 25000, 1, 1),
(1, 50000, 2, 2),
(3, 10000, 3, 3),
(1, 15000, 4, 4),
(5, 5000, 5, 5),
(2, 20000, 6, 6),
(1, 30000, 7, 7),
(4, 7500, 8, 8),
(2, 40000, 9, 9),
(3, 12000, 10, 10);

INSERT INTO compra (fecha, monto_total, fk_miembro) VALUES
('2023-01-10', 150000, 123456789),
('2023-02-15', 220000, 234567890),
('2023-03-20', 85000, 345678901),
('2023-04-05', 300000, 456789012),
('2023-05-12', 175000, 567890123),
('2023-06-01', 95000, 678901234),
('2023-07-08', 250000, 789012345),
('2023-08-22', 120000, 890123456),
('2023-09-30', 400000, 901234567),
('2023-10-14', 180000, 112233445);