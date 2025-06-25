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

-- =================================================================

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
(1,'ACAUCAB Sede Principal', 'Av. Principal, Edif. Cervecero, Piso 1', 123456789, 1354);
/*
(2,'ACAUCAB Valencia', 'C.C. Metrópolis, Nivel Sol, Local 10', 123456789, 653),
(3,'ACAUCAB Maracay', 'Av. Las Delicias, al lado de la redoma', 123456789, 479),
(4,'ACAUCAB Barquisimeto', 'C.C. Sambil, Feria de Comida', 123456789, 171),
(5,'ACAUCAB Lechería', 'Av. Américo Vespucio, Plaza Mayor', 123456789, 444),
(6,'ACAUCAB Puerto Ordaz', 'C.C. Orinokia, Nivel Oro', 123456789, 592),
(7,'ACAUCAB Mérida', 'Av. Los Próceres, frente al McDonalds', 123456789, 1412),
(8,'ACAUCAB San Cristóbal', 'Barrio Obrero, Carrera 21', 123456789, 1265),
(9,'ACAUCAB Maracaibo', 'Av. 5 de Julio, Edif. Zuliano', 123456789, 879),
(10,'ACAUCAB Maturín', 'C.C. Monagas Plaza, Local 30', 123456789, 1068);
*/
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
(5,'ventas', 'Departamento de ventas en tienda.', 1),
(6,'recursos humanos', 'Departamento de recursos humanos.', 1),
(7,'finanzas', 'Departamento de finanzas.', 1),
(8,'marketing', 'Departamento de marketing.', 1),
(9,'produccion', 'Departamento de producción.', 1),
(10,'logistica', 'Departamento de logística.', 1);

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

--Insertar privilegios

-- Tabla: receta
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(1, 'Crear receta', 'Permite registrar una nueva receta de cerveza.'),
(2, 'Consultar receta', 'Permite ver los detalles de las recetas existentes.'),
(3, 'Modificar receta', 'Permite editar la información de una receta existente.'),
(4, 'Eliminar receta', 'Permite eliminar una receta del sistema.');

-- Tabla: tipo_cerveza
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(5, 'Crear tipo_cerveza', 'Permite registrar un nuevo tipo o categoría de cerveza.'),
(6, 'Consultar tipo_cerveza', 'Permite ver la lista de tipos de cerveza.'),
(7, 'Modificar tipo_cerveza', 'Permite editar la información de un tipo de cerveza.'),
(8, 'Eliminar tipo_cerveza', 'Permite eliminar un tipo de cerveza del sistema.');

-- Tabla: caracteristica
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(9, 'Crear caracteristica', 'Permite añadir nuevas características para cervezas (ej. Amargor).'),
(10, 'Consultar caracteristica', 'Permite ver las características existentes.'),
(11, 'Modificar caracteristica', 'Permite editar una característica existente.'),
(12, 'Eliminar caracteristica', 'Permite eliminar una característica del sistema.');

-- Tabla: tipo_evento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(13, 'Crear tipo_evento', 'Permite crear un nuevo tipo de evento (ej. Cata, Festival).'),
(14, 'Consultar tipo_evento', 'Permite ver la lista de tipos de evento.'),
(15, 'Modificar tipo_evento', 'Permite editar un tipo de evento existente.'),
(16, 'Eliminar tipo_evento', 'Permite eliminar un tipo de evento del sistema.');

-- Tabla: ingrediente
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(17, 'Crear ingrediente', 'Permite registrar un nuevo ingrediente para recetas.'),
(18, 'Consultar ingrediente', 'Permite ver la lista de ingredientes disponibles.'),
(19, 'Modificar ingrediente', 'Permite editar un ingrediente existente.'),
(20, 'Eliminar ingrediente', 'Permite eliminar un ingrediente del sistema.');

-- Tabla: cargo
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(21, 'Crear cargo', 'Permite registrar un nuevo cargo para empleados.'),
(22, 'Consultar cargo', 'Permite ver la lista de cargos existentes.'),
(23, 'Modificar cargo', 'Permite editar la información de un cargo.'),
(24, 'Eliminar cargo', 'Permite eliminar un cargo del sistema.');

-- Tabla: rol
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(25, 'Crear rol', 'Permite crear un nuevo rol de usuario en el sistema.'),
(26, 'Consultar rol', 'Permite ver la lista de roles de usuario.'),
(27, 'Modificar rol', 'Permite editar el nombre de un rol.'),
(28, 'Eliminar rol', 'Permite eliminar un rol de usuario.');

-- Tabla: privilegio
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(29, 'Crear privilegio', 'Permite crear nuevos privilegios en el sistema.'),
(30, 'Consultar privilegio', 'Permite ver la lista de todos los privilegios.'),
(31, 'Modificar privilegio', 'Permite editar un privilegio existente.'),
(32, 'Eliminar privilegio', 'Permite eliminar un privilegio del sistema.');

-- Tabla: tipo_beneficio
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(33, 'Crear tipo_beneficio', 'Permite crear nuevos tipos de beneficios para empleados.'),
(34, 'Consultar tipo_beneficio', 'Permite ver los tipos de beneficios existentes.'),
(35, 'Modificar tipo_beneficio', 'Permite editar un tipo de beneficio.'),
(36, 'Eliminar tipo_beneficio', 'Permite eliminar un tipo de beneficio.');

-- Tabla: tipo_invitado
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(37, 'Crear tipo_invitado', 'Permite crear un nuevo tipo de invitado (ej. Ponente).'),
(38, 'Consultar tipo_invitado', 'Permite ver la lista de tipos de invitado.'),
(39, 'Modificar tipo_invitado', 'Permite editar un tipo de invitado existente.'),
(40, 'Eliminar tipo_invitado', 'Permite eliminar un tipo de invitado.');

-- Tabla: lugar
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(41, 'Crear lugar', 'Permite añadir nuevos lugares (estados, municipios, parroquias).'),
(42, 'Consultar lugar', 'Permite ver la estructura de lugares.'),
(43, 'Modificar lugar', 'Permite editar un lugar existente.'),
(44, 'Eliminar lugar', 'Permite eliminar un lugar del sistema.');

-- Tabla: estatus
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(45, 'Crear estatus', 'Permite definir nuevos estados para procesos (compra, venta, etc.).'),
(46, 'Consultar estatus', 'Permite ver los posibles estados del sistema.'),
(47, 'Modificar estatus', 'Permite editar un estado existente.'),
(48, 'Eliminar estatus', 'Permite eliminar un estado del sistema.');

-- Tabla: lugar_tienda
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(49, 'Crear lugar_tienda', 'Permite añadir ubicaciones en una tienda (pasillo, anaquel).'),
(50, 'Consultar lugar_tienda', 'Permite ver las ubicaciones de una tienda.'),
(51, 'Modificar lugar_tienda', 'Permite editar una ubicación de tienda.'),
(52, 'Eliminar lugar_tienda', 'Permite eliminar una ubicación de tienda.');

-- Tabla: tasa_cambio
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(53, 'Crear tasa_cambio', 'Permite registrar una nueva tasa de cambio monetaria.'),
(54, 'Consultar tasa_cambio', 'Permite ver el historial de tasas de cambio.'),
(55, 'Modificar tasa_cambio', 'Permite editar una tasa de cambio (ej. fecha fin).'),
(56, 'Eliminar tasa_cambio', 'Permite eliminar un registro de tasa de cambio.');

-- Tabla: cliente
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(57, 'Crear cliente', 'Permite registrar nuevos clientes (naturales o jurídicos).'),
(58, 'Consultar cliente', 'Permite ver la información de los clientes.'),
(59, 'Modificar cliente', 'Permite editar los datos de un cliente.'),
(60, 'Eliminar cliente', 'Permite eliminar un cliente del sistema.');

-- Tabla: empleado
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(61, 'Crear empleado', 'Permite registrar un nuevo empleado.'),
(62, 'Consultar empleado', 'Permite ver la información de los empleados.'),
(63, 'Modificar empleado', 'Permite editar los datos de un empleado.'),
(64, 'Eliminar empleado', 'Permite dar de baja a un empleado.');

-- Tabla: miembro
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(65, 'Crear miembro', 'Permite afiliar un nuevo miembro a la asociación.'),
(66, 'Consultar miembro', 'Permite ver la información de los miembros.'),
(67, 'Modificar miembro', 'Permite editar los datos de un miembro.'),
(68, 'Eliminar miembro', 'Permite desafiliar a un miembro.');

-- Tabla: usuario
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(69, 'Crear usuario', 'Permite crear una nueva cuenta de usuario.'),
(70, 'Consultar usuario', 'Permite ver la información de los usuarios.'),
(71, 'Modificar usuario', 'Permite editar los datos de un usuario (ej. cambiar rol).'),
(72, 'Eliminar usuario', 'Permite eliminar una cuenta de usuario.');

-- Tabla: metodo_de_pago
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(73, 'Crear metodo_de_pago', 'Permite registrar un método de pago para un usuario.'),
(74, 'Consultar metodo_de_pago', 'Permite ver los métodos de pago registrados.'),
(75, 'Modificar metodo_de_pago', 'Permite editar un método de pago existente.'),
(76, 'Eliminar metodo_de_pago', 'Permite eliminar un método de pago de un usuario.');

-- Tabla: horario
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(77, 'Crear horario', 'Permite definir nuevos bloques de horarios de trabajo.'),
(78, 'Consultar horario', 'Permite ver los horarios definidos.'),
(79, 'Modificar horario', 'Permite editar un horario existente.'),
(80, 'Eliminar horario', 'Permite eliminar un horario.');

-- Tabla: cerveza
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(81, 'Crear cerveza', 'Permite registrar una nueva cerveza producida por un miembro.'),
(82, 'Consultar cerveza', 'Permite ver el catálogo de cervezas.'),
(83, 'Modificar cerveza', 'Permite editar la información de una cerveza.'),
(84, 'Eliminar cerveza', 'Permite eliminar una cerveza del catálogo.');

-- Tabla: presentacion
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(85, 'Crear presentacion', 'Permite crear una nueva presentación para una cerveza (ej. botella).'),
(86, 'Consultar presentacion', 'Permite ver las presentaciones de cervezas.'),
(87, 'Modificar presentacion', 'Permite editar una presentación existente.'),
(88, 'Eliminar presentacion', 'Permite eliminar una presentación.');

-- Tabla: tienda_fisica
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(89, 'Crear tienda_fisica', 'Permite registrar una nueva tienda física.'),
(90, 'Consultar tienda_fisica', 'Permite ver la lista de tiendas físicas.'),
(91, 'Modificar tienda_fisica', 'Permite editar la información de una tienda.'),
(92, 'Eliminar tienda_fisica', 'Permite cerrar o eliminar una tienda.');

-- Tabla: departamento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(93, 'Crear departamento', 'Permite crear un nuevo departamento en una tienda física.'),
(94, 'Consultar departamento', 'Permite ver los departamentos de las tiendas.'),
(95, 'Modificar departamento', 'Permite editar la información de un departamento.'),
(96, 'Eliminar departamento', 'Permite eliminar un departamento.');

-- Tabla: tienda_online
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(97, 'Crear tienda_online', 'Permite registrar una nueva tienda online.'),
(98, 'Consultar tienda_online', 'Permite ver la lista de tiendas online.'),
(99, 'Modificar tienda_online', 'Permite editar la información de una tienda online.'),
(100, 'Eliminar tienda_online', 'Permite eliminar una tienda online.');

-- Tabla: evento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(101, 'Crear evento', 'Permite organizar y registrar un nuevo evento.'),
(102, 'Consultar evento', 'Permite ver la lista de eventos.'),
(103, 'Modificar evento', 'Permite editar la información de un evento.'),
(104, 'Eliminar evento', 'Permite cancelar o eliminar un evento.');

-- Tabla: invitado
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(105, 'Crear invitado', 'Permite registrar un invitado para un evento.'),
(106, 'Consultar invitado', 'Permite ver la lista de invitados.'),
(107, 'Modificar invitado', 'Permite editar la información de un invitado.'),
(108, 'Eliminar invitado', 'Permite eliminar un invitado.');

-- Tabla: almacen
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(109, 'Crear almacen', 'Permite añadir una nueva línea de producto al almacén central.'),
(110, 'Consultar almacen', 'Permite ver el stock en el almacén central.'),
(111, 'Modificar almacen', 'Permite actualizar la cantidad de un producto en el almacén.'),
(112, 'Eliminar almacen', 'Permite eliminar una línea de producto del almacén.');

-- Tabla: persona_contacto
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(113, 'Crear persona_contacto', 'Permite añadir una persona de contacto a un cliente o miembro.'),
(114, 'Consultar persona_contacto', 'Permite ver las personas de contacto.'),
(115, 'Modificar persona_contacto', 'Permite editar los datos de una persona de contacto.'),
(116, 'Eliminar persona_contacto', 'Permite eliminar una persona de contacto.');

-- Tabla: inventario_tienda
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(117, 'Crear inventario_tienda', 'Permite añadir un producto al inventario de una tienda.'),
(118, 'Consultar inventario_tienda', 'Permite ver el inventario de una tienda física.'),
(119, 'Modificar inventario_tienda', 'Permite actualizar el stock en tienda.'),
(120, 'Eliminar inventario_tienda', 'Permite retirar un producto del inventario de tienda.');

-- Tabla: inventario_evento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(121, 'Crear inventario_evento', 'Permite asignar stock de productos a un evento.'),
(122, 'Consultar inventario_evento', 'Permite ver el inventario de un evento.'),
(123, 'Modificar inventario_evento', 'Permite ajustar las cantidades de stock en un evento.'),
(124, 'Eliminar inventario_evento', 'Permite retirar un producto del inventario de un evento.');

-- Tabla: compra
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(125, 'Crear compra', 'Permite registrar una nueva compra a un miembro.'),
(126, 'Consultar compra', 'Permite ver el historial de compras.'),
(127, 'Modificar compra', 'Permite editar los detalles de una compra.'),
(128, 'Eliminar compra', 'Permite anular o eliminar una compra.');

-- Tabla: venta_tienda_fisica
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(129, 'Crear venta_tienda_fisica', 'Permite registrar una venta en tienda física.'),
(130, 'Consultar venta_tienda_fisica', 'Permite ver el historial de ventas en tiendas.'),
(131, 'Modificar venta_tienda_fisica', 'Permite editar una venta de tienda.'),
(132, 'Eliminar venta_tienda_fisica', 'Permite anular una venta de tienda.');

-- Tabla: venta_online
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(133, 'Crear venta_online', 'Permite procesar un nuevo pedido online.'),
(134, 'Consultar venta_online', 'Permite ver el historial de ventas online.'),
(135, 'Modificar venta_online', 'Permite editar un pedido online.'),
(136, 'Eliminar venta_online', 'Permite cancelar un pedido online.');

-- Tabla: venta_evento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(137, 'Crear venta_evento', 'Permite registrar una venta de productos en un evento.'),
(138, 'Consultar venta_evento', 'Permite ver el historial de ventas en eventos.'),
(139, 'Modificar venta_evento', 'Permite editar una venta de evento.'),
(140, 'Eliminar venta_evento', 'Permite anular una venta de evento.');

-- Tabla: venta_entrada
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(141, 'Crear venta_entrada', 'Permite registrar la venta de una entrada a un evento.'),
(142, 'Consultar venta_entrada', 'Permite ver el historial de venta de entradas.'),
(143, 'Modificar venta_entrada', 'Permite editar una venta de entrada.'),
(144, 'Eliminar venta_entrada', 'Permite anular una venta de entrada.');

-- Tabla: contrato
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(145, 'Crear contrato', 'Permite generar un nuevo contrato para un empleado.'),
(146, 'Consultar contrato', 'Permite ver los contratos de los empleados.'),
(147, 'Modificar contrato', 'Permite editar los términos de un contrato.'),
(148, 'Eliminar contrato', 'Permite finalizar o eliminar un contrato.');

-- Tabla: oferta
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(149, 'Crear oferta', 'Permite crear una nueva oferta para un producto.'),
(150, 'Consultar oferta', 'Permite ver las ofertas activas e inactivas.'),
(151, 'Modificar oferta', 'Permite editar una oferta existente.'),
(152, 'Eliminar oferta', 'Permite eliminar una oferta.');

-- Tabla: detalle_compra
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(153, 'Crear detalle_compra', 'Permite añadir un item a una orden de compra.'),
(154, 'Consultar detalle_compra', 'Permite ver los items de una orden de compra.'),
(155, 'Modificar detalle_compra', 'Permite cambiar un item en una compra.'),
(156, 'Eliminar detalle_compra', 'Permite quitar un item de una orden de compra.');

-- Tabla: detalle_venta_fisica
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(157, 'Crear detalle_venta_fisica', 'Permite añadir un producto a una venta física.'),
(158, 'Consultar detalle_venta_fisica', 'Permite ver los productos de una venta física.'),
(159, 'Modificar detalle_venta_fisica', 'Permite cambiar un producto en una venta.'),
(160, 'Eliminar detalle_venta_fisica', 'Permite quitar un producto de una venta.');

-- Tabla: detalle_venta_online
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(161, 'Crear detalle_venta_online', 'Permite añadir un producto a un pedido online.'),
(162, 'Consultar detalle_venta_online', 'Permite ver los productos de un pedido online.'),
(163, 'Modificar detalle_venta_online', 'Permite cambiar un producto en un pedido.'),
(164, 'Eliminar detalle_venta_online', 'Permite quitar un producto de un pedido.');

-- Tabla: detalle_venta_evento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(165, 'Crear detalle_venta_evento', 'Permite añadir un producto a una venta de evento.'),
(166, 'Consultar detalle_venta_evento', 'Permite ver los productos de una venta de evento.'),
(167, 'Modificar detalle_venta_evento', 'Permite cambiar un producto en una venta de evento.'),
(168, 'Eliminar detalle_venta_evento', 'Permite quitar un producto de una venta de evento.');

-- Tabla: cuota
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(169, 'Crear cuota', 'Permite generar una cuota para un miembro.'),
(170, 'Consultar cuota', 'Permite ver las cuotas de los miembros.'),
(171, 'Modificar cuota', 'Permite editar el monto o fecha de una cuota.'),
(172, 'Eliminar cuota', 'Permite anular o eliminar una cuota.');

-- Tabla: pago
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(173, 'Crear pago', 'Permite registrar un pago para una venta o cuota.'),
(174, 'Consultar pago', 'Permite ver el historial de pagos.'),
(175, 'Modificar pago', 'Permite editar un registro de pago.'),
(176, 'Eliminar pago', 'Permite anular un registro de pago.');

-- Tabla: asistencia
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(177, 'Crear asistencia', 'Permite registrar la asistencia de un cliente a un evento.'),
(178, 'Consultar asistencia', 'Permite ver los registros de asistencia a eventos.'),
(179, 'Modificar asistencia', 'Permite editar un registro de asistencia.'),
(180, 'Eliminar asistencia', 'Permite eliminar un registro de asistencia.');

-- Tabla: control_entrada
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(181, 'Crear control_entrada', 'Permite registrar la entrada/salida de un empleado.'),
(182, 'Consultar control_entrada', 'Permite ver los registros de asistencia de empleados.'),
(183, 'Modificar control_entrada', 'Permite corregir un registro de entrada/salida.'),
(184, 'Eliminar control_entrada', 'Permite eliminar un registro de asistencia de empleado.');

-- Tabla: vacacion
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(185, 'Crear vacacion', 'Permite registrar vacaciones para un empleado.'),
(186, 'Consultar vacacion', 'Permite ver las vacaciones de los empleados.'),
(187, 'Modificar vacacion', 'Permite editar un período de vacaciones.'),
(188, 'Eliminar vacacion', 'Permite anular un registro de vacaciones.');

-- Tabla: reposicion
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(189, 'Crear reposicion', 'Permite ejecutar una reposición de stock a una tienda.'),
(190, 'Consultar reposicion', 'Permite ver el historial de reposiciones.'),
(191, 'Modificar reposicion', 'Permite editar un registro de reposición.'),
(192, 'Eliminar reposicion', 'Permite anular una reposición.');

-- Tabla: eve_mie (Evento - Miembro)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(193, 'Crear eve_mie', 'Permite asignar la participación de un miembro a un evento.'),
(194, 'Consultar eve_mie', 'Permite ver los miembros participantes en un evento.'),
(195, 'Modificar eve_mie', 'Permite editar la descripción de participación de un miembro.'),
(196, 'Eliminar eve_mie', 'Permite revocar la participación de un miembro en un evento.');

-- Tabla: car_tip (Caracteristica - Tipo Cerveza)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(197, 'Crear car_tip', 'Permite asignar una característica a un tipo de cerveza.'),
(198, 'Consultar car_tip', 'Permite ver las características de los tipos de cerveza.'),
(199, 'Modificar car_tip', 'Permite editar los valores de una característica para un tipo.'),
(200, 'Eliminar car_tip', 'Permite quitar una característica de un tipo de cerveza.');

-- Tabla: instruccion
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(201, 'Crear instruccion', 'Permite registrar un nuevo paso o instrucción para recetas.'),
(202, 'Consultar instruccion', 'Permite ver la lista de instrucciones.'),
(203, 'Modificar instruccion', 'Permite editar una instrucción.'),
(204, 'Eliminar instruccion', 'Permite eliminar una instrucción.');

-- Tabla: ing_rec (Ingrediente - Receta)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(205, 'Crear ing_rec', 'Permite añadir un ingrediente o instrucción a una receta.'),
(206, 'Consultar ing_rec', 'Permite ver los pasos e ingredientes de una receta.'),
(207, 'Modificar ing_rec', 'Permite editar un paso o ingrediente en una receta.'),
(208, 'Eliminar ing_rec', 'Permite quitar un paso o ingrediente de una receta.');

-- Tabla: rol_pri (Rol - Privilegio)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(209, 'Crear rol_pri', 'Permite asignar un privilegio a un rol.'),
(210, 'Consultar rol_pri', 'Permite ver las asignaciones de privilegios a roles.'),
(211, 'Modificar rol_pri', 'Permite editar una asignación (ej. cambiar fecha).'),
(212, 'Eliminar rol_pri', 'Permite revocar un privilegio de un rol.');

-- Tabla: emp_ben (Empleado - Beneficio)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(213, 'Crear emp_ben', 'Permite asignar un beneficio a un empleado.'),
(214, 'Consultar emp_ben', 'Permite ver los beneficios asignados a los empleados.'),
(215, 'Modificar emp_ben', 'Permite editar un beneficio asignado (ej. monto).'),
(216, 'Eliminar emp_ben', 'Permite revocar un beneficio de un empleado.');

-- Tabla: inv_eve (Invitado - Evento)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(217, 'Crear inv_eve', 'Permite registrar la asistencia de un invitado a un evento.'),
(218, 'Consultar inv_eve', 'Permite ver la asistencia de invitados a eventos.'),
(219, 'Modificar inv_eve', 'Permite editar los detalles de asistencia de un invitado.'),
(220, 'Eliminar inv_eve', 'Permite anular la asistencia de un invitado.');

-- Tabla: con_hor (Contrato - Horario)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(221, 'Crear con_hor', 'Permite asignar un horario a un contrato de empleado.'),
(222, 'Consultar con_hor', 'Permite ver los horarios asignados a contratos.'),
(223, 'Modificar con_hor', 'Permite cambiar el estado de un horario en un contrato.'),
(224, 'Eliminar con_hor', 'Permite quitar un horario de un contrato.');

-- Tabla: car_cer (Caracteristica - Cerveza)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(225, 'Crear car_cer', 'Permite asignar una característica a una cerveza específica.'),
(226, 'Consultar car_cer', 'Permite ver las características de cervezas individuales.'),
(227, 'Modificar car_cer', 'Permite editar el valor de una característica para una cerveza.'),
(228, 'Eliminar car_cer', 'Permite quitar una característica de una cerveza.');

-- Tabla: historico (Solo consulta)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(229, 'Crear historico', 'Permite crear una entrada en el historial (Uso restringido).'),
(230, 'Consultar historico', 'Permite ver el historial de cambios de estado de las operaciones.'),
(231, 'Modificar historico', 'Permite modificar una entrada del historial (Uso restringido).'),
(232, 'Eliminar historico', 'Permite eliminar una entrada del historial (Uso restringido).');
-- Nota: CRUD en 'historico' debe ser manejado por el sistema/triggers, no por usuarios finales.

-- Tabla: telefono
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(233, 'Crear telefono', 'Permite añadir un número de teléfono a una entidad.'),
(234, 'Consultar telefono', 'Permite ver los números de teléfono registrados.'),
(235, 'Modificar telefono', 'Permite editar un número de teléfono.'),
(236, 'Eliminar telefono', 'Permite eliminar un número de teléfono.');

-- Tabla: correo_electronico
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(237, 'Crear correo_electronico', 'Permite añadir un correo a una entidad.'),
(238, 'Consultar correo_electronico', 'Permite ver los correos registrados.'),
(239, 'Modificar correo_electronico', 'Permite editar un correo electrónico.'),
(240, 'Eliminar correo_electronico', 'Permite eliminar un correo electrónico.');

-- Insertar roles (10 ejemplos)
INSERT INTO rol (clave, nombre) VALUES
(1, 'Administrador'),      -- Control total del sistema
(2, 'Gerencia'),           -- Acceso a nivel directivo y de negocio
(3, 'Supervisión'),        -- Acceso para supervisar operaciones y personal
(4, 'Personal Operativo'), -- Acceso para Vendedores, Repartidores, etc.
(5, 'Acceso Básico Empleado'), -- Permisos mínimos (ver su propio perfil, etc.)
(6, 'Miembro'),            -- Acceso para productores afiliados
(7, 'Cliente');  


--Insertar privilegios por roles 
--------------------------------------------------------------------------------
-- Rol 1: Administrador (Control total del sistema)
-- Tiene todos los privilegios sin excepción.
--------------------------------------------------------------------------------
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio)
SELECT NOW(), 1, clave FROM privilegio;

--------------------------------------------------------------------------------
-- Rol 2: Gerencia (Acceso a nivel directivo y de negocio)
--------------------------------------------------------------------------------
-- GESTIÓN DE PERSONAL Y ESTRUCTURA ORGANIZACIONAL
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 2, 21), (NOW(), 2, 22), (NOW(), 2, 23), (NOW(), 2, 24), -- CRUD Cargo
(NOW(), 2, 33), (NOW(), 2, 34), (NOW(), 2, 35), (NOW(), 2, 36), -- CRUD Tipo Beneficio
(NOW(), 2, 61), (NOW(), 2, 62), (NOW(), 2, 63), (NOW(), 2, 64), -- CRUD Empleado
(NOW(), 2, 77), (NOW(), 2, 78), (NOW(), 2, 79), (NOW(), 2, 80), -- CRUD Horario
(NOW(), 2, 145), (NOW(), 2, 146), (NOW(), 2, 147), (NOW(), 2, 148), -- CRUD Contrato
(NOW(), 2, 185), (NOW(), 2, 186), (NOW(), 2, 187), (NOW(), 2, 188), -- CRUD Vacacion
(NOW(), 2, 213), (NOW(), 2, 214), (NOW(), 2, 215), (NOW(), 2, 216), -- Asignar/revocar Beneficio
(NOW(), 2, 221), (NOW(), 2, 222), (NOW(), 2, 223), (NOW(), 2, 224); -- Asignar/revocar Horario

-- GESTIÓN FINANCIERA Y DE VENTAS (CONTROL TOTAL)
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 2, 53), (NOW(), 2, 54), (NOW(), 2, 55), (NOW(), 2, 56),    -- CRUD Tasa Cambio
(NOW(), 2, 125), (NOW(), 2, 126), (NOW(), 2, 127), (NOW(), 2, 128),-- CRUD Compra (a miembros)
(NOW(), 2, 130), (NOW(), 2, 134), (NOW(), 2, 138), (NOW(), 2, 142),-- Consultar todas las ventas
(NOW(), 2, 149), (NOW(), 2, 150), (NOW(), 2, 151), (NOW(), 2, 152),-- CRUD Oferta
(NOW(), 2, 169), (NOW(), 2, 170), (NOW(), 2, 171), (NOW(), 2, 172),-- CRUD Cuota (de miembros)
(NOW(), 2, 174); -- Consultar Pagos

-- GESTIÓN DE TIENDAS, EVENTOS Y OPERACIONES
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 2, 89), (NOW(), 2, 90), (NOW(), 2, 91), (NOW(), 2, 92), -- CRUD Tienda Fisica
(NOW(), 2, 93), (NOW(), 2, 94), (NOW(), 2, 95), (NOW(), 2, 96), -- CRUD Departamento
(NOW(), 2, 97), (NOW(), 2, 98), (NOW(), 2, 99), (NOW(), 2, 100),-- CRUD Tienda Online
(NOW(), 2, 101), (NOW(), 2, 102), (NOW(), 2, 103), (NOW(), 2, 104), -- CRUD Evento
(NOW(), 2, 65), (NOW(), 2, 66), (NOW(), 2, 67), (NOW(), 2, 68);    -- CRUD Miembro (afiliar/desafiliar)

-- PERMISOS DE CONSULTA GENERAL
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 2, 2), (NOW(), 2, 6), (NOW(), 2, 10), (NOW(), 2, 14), (NOW(), 2, 18),
(NOW(), 2, 58), (NOW(), 2, 70), (NOW(), 2, 82), (NOW(), 2, 86), (NOW(), 2, 110),
(NOW(), 2, 118), (NOW(), 2, 230); -- Consultar casi todo

--------------------------------------------------------------------------------
-- Rol 3: Supervisión (Gestión de operaciones diarias)
--------------------------------------------------------------------------------
-- GESTIÓN DE INVENTARIO Y STOCK (SU TAREA PRINCIPAL)
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 3, 110), -- Consultar almacen
(NOW(), 3, 111), -- Modificar almacen
(NOW(), 3, 117), -- Crear inventario_tienda
(NOW(), 3, 118), -- Consultar inventario_tienda
(NOW(), 3, 119), -- Modificar inventario_tienda
(NOW(), 3, 189), -- Crear reposicion
(NOW(), 3, 190), -- Consultar reposicion
(NOW(), 3, 191); -- Modificar reposicion

-- SUPERVISIÓN DE PERSONAL Y HORARIOS
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 3, 62),  -- Consultar empleado (su equipo)
(NOW(), 3, 78),  -- Consultar horario
(NOW(), 3, 146), -- Consultar contrato (de su equipo)
(NOW(), 3, 182), -- Consultar control_entrada
(NOW(), 3, 183), -- Modificar control_entrada (corregir fichajes)
(NOW(), 3, 221), -- Asignar horario a contrato
(NOW(), 3, 222); -- Consultar asignación de horario

-- SUPERVISIÓN DE VENTAS
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 3, 130), -- Consultar venta_tienda_fisica
(NOW(), 3, 131), -- Modificar venta_tienda_fisica (para devoluciones/correcciones)
(NOW(), 3, 134), -- Consultar venta_online
(NOW(), 3, 138), -- Consultar venta_evento
(NOW(), 3, 174); -- Consultar pago

-- CONSULTAS GENERALES PARA SU TRABAJO
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 3, 58), -- Consultar cliente
(NOW(), 3, 82), -- Consultar cerveza
(NOW(), 3, 86); -- Consultar presentacion

--------------------------------------------------------------------------------
-- Rol 4: Personal Operativo (Vendedores, Repartidores, etc.)
--------------------------------------------------------------------------------
-- PERMISOS PARA VENDEDORES
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 4, 129), -- Crear venta_tienda_fisica
(NOW(), 4, 130), -- Consultar venta_tienda_fisica (sus ventas)
(NOW(), 4, 157), -- Crear detalle_venta_fisica
(NOW(), 4, 173), -- Crear pago
(NOW(), 4, 57),  -- Crear cliente
(NOW(), 4, 58),  -- Consultar cliente
(NOW(), 4, 118), -- Consultar inventario_tienda (ver stock)
(NOW(), 4, 150); -- Consultar oferta

-- PERMISOS PARA REPARTIDORES
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 4, 134), -- Consultar venta_online (para ver entregas)
(NOW(), 4, 135), -- Modificar venta_online (actualizar estado)
(NOW(), 4, 190); -- Consultar reposicion (para saber qué mover)

-- PERMISOS BÁSICOS DE EMPLEADO (heredados)
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 4, 62),  -- Consultar empleado (su perfil)
(NOW(), 4, 181); -- Crear control_entrada (fichar)

--------------------------------------------------------------------------------
-- Rol 5: Acceso Básico Empleado (Permisos mínimos de autoservicio)
--------------------------------------------------------------------------------
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 5, 62),  -- Consultar empleado (su propio perfil)
(NOW(), 5, 63),  -- Modificar empleado (su propio perfil)
(NOW(), 5, 146), -- Consultar contrato (el suyo)
(NOW(), 5, 181), -- Crear control_entrada (fichar)
(NOW(), 5, 186), -- Consultar vacacion (las suyas)
(NOW(), 5, 222), -- Consultar con_hor (su horario)
(NOW(), 5, 234), -- Consultar telefono (el suyo)
(NOW(), 5, 235); -- Modificar telefono (el suyo)

--------------------------------------------------------------------------------
-- Rol 6: Miembro (Productor de cerveza afiliado)
--------------------------------------------------------------------------------
-- GESTIÓN DE SU PERFIL
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 6, 66),  -- Consultar miembro (su perfil)
(NOW(), 6, 67),  -- Modificar miembro (su perfil)
(NOW(), 6, 113), (NOW(), 6, 114), (NOW(), 6, 115), (NOW(), 6, 116), -- CRUD Persona Contacto
(NOW(), 6, 233), (NOW(), 6, 234), (NOW(), 6, 235), (NOW(), 6, 236), -- CRUD Telefono
(NOW(), 6, 237), (NOW(), 6, 238), (NOW(), 6, 239), (NOW(), 6, 240); -- CRUD Correo

-- GESTIÓN DE SUS PRODUCTOS
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 6, 1), (NOW(), 6, 2), (NOW(), 6, 3), (NOW(), 6, 4),      -- CRUD Receta
(NOW(), 6, 81), (NOW(), 6, 82), (NOW(), 6, 83), (NOW(), 6, 84),  -- CRUD Cerveza
(NOW(), 6, 85), (NOW(), 6, 86), (NOW(), 6, 87), (NOW(), 6, 88);  -- CRUD Presentacion

-- CONSULTA DE FINANZAS Y PARTICIPACIÓN
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 6, 126), -- Consultar compra (compras que le hacen a él)
(NOW(), 6, 170), -- Consultar cuota (sus cuotas)
(NOW(), 6, 193), -- Crear eve_mie (participar en evento)
(NOW(), 6, 194), -- Consultar eve_mie
(NOW(), 6, 196); -- Eliminar eve_mie (cancelar participación)

--------------------------------------------------------------------------------
-- Rol 7: Cliente (Usuario final que compra)
--------------------------------------------------------------------------------
-- GESTIÓN DE SU CUENTA
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 7, 58),  -- Consultar cliente (su perfil)
(NOW(), 7, 59),  -- Modificar cliente (su perfil)
(NOW(), 7, 73), (NOW(), 7, 74), (NOW(), 7, 75), (NOW(), 7, 76), -- CRUD Metodo de pago
(NOW(), 7, 233), (NOW(), 7, 234), (NOW(), 7, 235), (NOW(), 7, 236), -- CRUD Telefono
(NOW(), 7, 237), (NOW(), 7, 238), (NOW(), 7, 239), (NOW(), 7, 240); -- CRUD Correo

-- INTERACCIÓN CON LA TIENDA
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 7, 82),  -- Consultar cerveza
(NOW(), 7, 86),  -- Consultar presentacion
(NOW(), 7, 102), -- Consultar evento
(NOW(), 7, 150), -- Consultar oferta
(NOW(), 7, 133), -- Crear venta_online
(NOW(), 7, 134), -- Consultar venta_online (sus compras)
(NOW(), 7, 141), -- Crear venta_entrada (comprar entrada)
(NOW(), 7, 142), -- Consultar venta_entrada (sus entradas)
(NOW(), 7, 177), -- Crear asistencia (al registrarse en un evento)
(NOW(), 7, 178); -- Consultar asistencia (la suya)


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

INSERT INTO lugar_tienda (clave, nombre, tipo, fk_lugar_tienda) VALUES
(1, 'Tienda ACAUCAB Sede Principal', 'zona', 1); -- Clave: 1 (se autoapunta para la jerarquía)

-- Paso 2: Crear las Zonas principales, que están contenidas en la "Tienda".
-- (fk_lugar_tienda = 1)
INSERT INTO lugar_tienda (clave, nombre, tipo, fk_lugar_tienda) VALUES
(2, 'Almacén Principal', 'zona', 1),             -- Clave: 2
(3, 'Piso de Ventas', 'zona', 1);               -- Clave: 3

-- Paso 3: Crear los Pasillos dentro del Almacén Principal.
-- (fk_lugar_tienda = 2)
INSERT INTO lugar_tienda (clave, nombre, tipo, fk_lugar_tienda) VALUES
(4, 'Pasillo de Recepción de Mercancía', 'pasillo', 2), -- Clave: 4
(5, 'Pasillo de Cajas Nacionales (Stock)', 'pasillo', 2),  -- Clave: 5
(6, 'Pasillo de Barriles (Stock)', 'pasillo', 2);         -- Clave: 6

-- Paso 4: Crear los Pasillos en el Piso de Ventas.
-- (fk_lugar_tienda = 3)
INSERT INTO lugar_tienda (clave, nombre, tipo, fk_lugar_tienda) VALUES
(7, 'Pasillo de Cervezas Claras (Lager/Pilsner)', 'pasillo', 3), -- Clave: 7
(8, 'Pasillo de Cervezas Oscuras (Stout/Porter)', 'pasillo', 3), -- Clave: 8
(9, 'Pasillo de Cervezas Especiales (IPA/APA)', 'pasillo', 3),   -- Clave: 9
(10, 'Pasillo de Ofertas - DiarioDeUnaCerveza', 'pasillo', 3);    -- Clave: 10

-- Paso 5: Crear los Anaqueles dentro de los pasillos del Piso de Ventas.
-- Estos son los lugares específicos donde se realiza la reposición.
INSERT INTO lugar_tienda (clave, nombre, tipo, fk_lugar_tienda) VALUES
-- Anaqueles para el pasillo de Cervezas Claras (fk_lugar_tienda = 7)
(11, 'Anaquel Superior - Pilsner', 'anaquel', 7),   -- Clave: 11
(12, 'Anaquel Inferior - Lager', 'anaquel', 7),     -- Clave: 12

-- Anaqueles para el pasillo de Cervezas Oscuras (fk_lugar_tienda = 8)
(13, 'Anaquel Izquierdo - Stouts', 'anaquel', 8),   -- Clave: 13
(14, 'Anaquel Derecho - Porters', 'anaquel', 8),    -- Clave: 14

-- Anaquel para el pasillo de Ofertas (fk_lugar_tienda = 10)
(15, 'Exhibidor Central de Ofertas', 'anaquel', 10); -- Clave: 15

--Insertar presentacion (10 ejemplos)
INSERT INTO presentacion (EAN_13, nombre, cantidad_unidades, precio, fk_cerveza) VALUES
(7501234567890, 'Botella 330ml', 1, 200.00, 1),
(7501234567891, 'Lata 355ml', 1, 160.00, 2),
(7501234567892, 'Pack 6 Botellas 330ml', 6, 1000.00, 3),
(7501234567893, 'Botella 500ml', 1, 250.00, 4),
(7501234567894, 'Lata 473ml', 1, 500.00, 5),
(7501234567895, 'Pack 12 Latas 355ml', 12, 1000.00, 6),
(7501234567896, 'Botella 1L', 1, 600.00, 7),
(7501234567897, 'Growler 2L', 1, 900.00, 8),
(7501234567898, 'Pack 4 Latas 473ml', 4, 800.00, 9),
(7501234567899, 'Botella 750ml', 1, 1000.00, 10);

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

INSERT INTO venta_evento (fecha, monto_total, fk_evento, fk_cliente) VALUES
('2025-06-01', 150.75, 1, 1),
('2025-06-02', 200.50, 2, 2),
('2025-06-03', 175.30, 3, 3),
('2025-06-04', 220.90, 4, 4),
('2025-06-05', 189.45, 5, 5),
('2025-06-06', 250.80, 6, 6),
('2025-06-07', 130.60, 7, 7),
('2025-06-08', 275.20, 8, 8),
('2025-06-09', 165.90, 9, 9),
('2025-06-10', 300.00, 10, 10);

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


INSERT INTO detalle_compra (fk_almacen, fk_compra, cantidad, precio_unitario) VALUES
(1, 1, 50, 1500),
(2, 2, 30, 2500),
(3, 3, 100, 800),
(4, 4, 20, 10000),
(5, 5, 45, 3000),
(6, 6, 70, 1200),
(7, 7, 25, 8000),
(8, 8, 60, 2000),
(9, 9, 15, 25000),
(10, 10, 80, 1000);

-- =================================================================
-- VENTAS DE EVENTOS ADICIONALES PARA EL REPORTE (JUNIO-JULIO 2025)
-- =================================================================

-- Insertar ventas de eventos adicionales en el período correcto (usando claves automáticas)
INSERT INTO venta_evento (fecha, monto_total, fk_evento, fk_cliente) VALUES
('2025-06-15', 180.25, 1, 1),
('2025-06-16', 220.75, 2, 2),
('2025-06-17', 195.50, 3, 3),
('2025-06-18', 280.00, 4, 4),
('2025-06-19', 165.80, 5, 5),
('2025-06-20', 310.45, 1, 6),
('2025-06-21', 140.30, 2, 7),
('2025-06-22', 290.90, 3, 8),
('2025-06-23', 175.60, 4, 9),
('2025-06-24', 320.75, 5, 10),
('2025-06-25', 185.40, 1, 1),
('2025-06-26', 240.20, 2, 2),
('2025-06-27', 155.90, 3, 3),
('2025-06-28', 295.30, 4, 4),
('2025-06-29', 170.85, 5, 5),
('2025-06-30', 330.50, 1, 6),
('2025-07-01', 160.75, 2, 7),
('2025-07-02', 285.20, 3, 8),
('2025-07-03', 190.45, 4, 9),
('2025-07-04', 315.80, 5, 10);

-- Insertar detalles de venta de eventos para los nuevos registros (usando las últimas claves generadas)
INSERT INTO detalle_venta_evento (cantidad, precio_unitario, fk_venta_evento, fk_inventario_evento) VALUES
(1, 18025, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-15'), 1),
(2, 11037, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-16'), 2),
(3, 6516, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-17'), 3),
(1, 28000, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-18'), 4),
(4, 4145, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-19'), 5),
(2, 15522, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-20'), 1),
(1, 14030, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-21'), 2),
(3, 9696, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-22'), 3),
(2, 8780, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-23'), 4),
(3, 10691, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-24'), 5),
(1, 18540, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-25'), 1),
(2, 12010, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-26'), 2),
(3, 5196, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-27'), 3),
(1, 29530, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-28'), 4),
(4, 4271, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-29'), 5),
(2, 16525, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-30'), 1),
(1, 16075, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-07-01'), 2),
(3, 9506, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-07-02'), 3),
(2, 9522, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-07-03'), 4),
(3, 10526, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-07-04'), 5);