-- Insertar privilegios (10 ejemplos)
INSERT INTO privilegio (nombre, descripcion) VALUES
--1
('Crear usuarios', 'Permite crear nuevos usuarios en el sistema'),
--2
('Editar usuarios', 'Permite editar información de usuarios'),
--3
('Eliminar usuarios', 'Permite eliminar usuarios del sistema'),
--4
('Ver reportes', 'Permite visualizar reportes'),
--5
('Configurar sistema', 'Permite modificar la configuración general'),
--6
('Exportar datos', 'Permite exportar información a archivos'),
--7
('Importar datos', 'Permite importar información desde archivos'),
--8
('Cambiar contraseña', 'Permite cambiar la contraseña propia '),
--9
('Ver historial', 'Permite ver el historial de compras o ventas'),
--10
('Gestionar roles', 'Permite crear, editar o eliminar roles de usuario'),
--11
('Consultar cervezas', 'Permite ver las cervezas disponibles'),
--12
('Realizar ventas', 'Permite registrar ventas de cervezas'),
--13
('Realizar compras', 'Permite registrar compras de cervezas'),
--14
('Gestionar promociones', 'Permite crear y editar promociones de cervezas'),
--15
('Gestionar proveedores', 'Permite añadir o modificar proveedores de cervezas'),
--16
('Gestionar clientes', 'Permite añadir o modificar información de clientes'),
--17
('Gestionar pedidos', 'Permite ges('Consultar catalogo', 'Permite ver el catalogo de cervezas'),
ermite ver el catalogo de cervezas')
--19
('Ver inventario', 'Permite ver el inventario actual de cervezas'),
--20
('Gestionar inventario', 'Permite modificar el inventario de cervezas'),
--21
('Acceso a soporte', 'Permite acceder al sistema de soporte técnico'),
--22
('Ver estadísticas', 'Permite ver estadísticas de ventas y usuarios');

-- Insertar roles (10 ejemplos)
INSERT INTO rol (nombre) VALUES
('Administrador'),
('Supervisor'),
('Soporte Técnico'),
('Gerente'),
('Analista'),
('Cliente'),
('Miembro'),
('Empleado'),
('Repartidor'),
('Vendedor');

-- Insertar rol_privilegio (10 ejemplos)
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(CURRENT_DATE, 1,1),  -- Administrador con privilegio de crear usuarios
(CURRENT_DATE, 1,2),  -- Administrador con privilegio de editar usuarios
(CURRENT_DATE, 1,3),  -- Administrador con privilegio de eliminar usuarios
(CURRENT_DATE, 1,4),  -- Administrador con privilegio de ver reportes
(CURRENT_DATE, 1,5),  -- Administrador con privilegio de configurar sistema
(CURRENT_DATE, 1,6),  -- Administrador con privilegio de exportar datos
(CURRENT_DATE, 1,7),  -- Administrador con privilegio de importar datos
(CURRENT_DATE, 1,8),  -- Administrador con privilegio de cambiar contraseña
(CURRENT_DATE, 1,9),  -- Administrador con privilegio de ver historial
(CURRENT_DATE, 1,10), -- Administrador con privilegio de gestionar roles
(CURRENT_DATE, 1,12), -- Administrador con privilegio de consultar cervezas
(CURRENT_DATE, 1,13), -- Administrador con privilegio de realizar ventas
(CURRENT_DATE, 1,14),  -- Administrador con privilegio de realizar compras
(CURRENT_DATE, 1,15), -- Administrador con privilegio de gestionar promociones
(CURRENT_DATE, 1,16), -- Administrador con privilegio de gestionar proveedores
(CURRENT_DATE, 1,17), -- Administrador con privilegio de gestionar clientes
(CURRENT_DATE, 1,20), -- Administrador con privilegio de gestionar inventario
(CURRENT_DATE, 1,22), -- Administrador con privilegio de ver estadísticas
(CURRENT_DATE, 2,4), -- Supervisor con privilegio de ver reportes
(CURRENT_DATE, 2,6), -- Supervisor con privilegio de exportar datos
(CURRENT_DATE, 2,7), -- Supervisor con privilegio de importar datos
(CURRENT_DATE, 2,9), -- Supervisor con privilegio de ver historial 
(CURRENT_DATE, 2,11), -- Supervisor con privilegio de consultar cervezas
(CURRENT_DATE, 2,12), -- Supervisor con privilegio de realizar ventas
(CURRENT_DATE, 2,13), -- Supervisor con privilegio de realizar compras
(CURRENT_DATE, 2,14), -- Supervisor con privilegio de gestionar promociones
(CURRENT_DATE, 2,15), -- Supervisor con privilegio de gestionar proveedores
(CURRENT_DATE, 2,16), -- Supervisor con privilegio de gestionar clientes
(CURRENT_DATE, 2,17), -- Supervisor con privilegio de gestionar pedidos
(CURRENT_DATE, 2,20), -- Supervisor con privilegio de gestionar inventario
(CURRENT_DATE, 2,22), -- Supervisor con privilegio de ver estadísticas
(CURRENT_DATE, 3,5), -- Soporte Técnico con privilegio de configurar sistema
(CURRENT_DATE, 3,10), -- Soporte Técnico con privilegio de gestionar roles
(CURRENT_DATE, 3,16), -- Soporte Técnico con privilegio de gestionar clientes
(CURRENT_DATE, 3,21), -- Administrador con privilegio de acceso a soporte
(CURRENT_DATE, 4,4), -- Gerente con privilegio de ver reportes
(CURRENT_DATE, 4,6), -- Gerente con privilegio de exportar datos
(CURRENT_DATE, 4,7), -- Gerente con privilegio de importar datos
(CURRENT_DATE, 4,9), -- Gerente con privilegio de ver historial
(CURRENT_DATE, 4,11), -- Gerente con privilegio de consultar cervezas
(CURRENT_DATE, 4,12), -- Gerente con privilegio de realizar ventas
(CURRENT_DATE, 4,13), -- Gerente con privilegio de realizar compras
(CURRENT_DATE, 4,14), -- Gerente con privilegio de gestionar promociones
(CURRENT_DATE, 4,15), -- Gerente con privilegio de gestionar proveedores
(CURRENT_DATE, 4,16), -- Gerente con privilegio de gestionar clientes
(CURRENT_DATE, 4,17), -- Gerente con privilegio de gestionar pedidos
(CURRENT_DATE, 4,20), -- Gerente con privilegio de gestionar inventario
(CURRENT_DATE, 4,22), -- Gerente con privilegio de ver estadísticas
(CURRENT_DATE, 5,4), -- Analista con privilegio de ver reportes
(CURRENT_DATE, 5,9), -- Analista con privilegio de ver historial
(CURRENT_DATE, 5,22), -- Analista con privilegio de ver estadísticas
(CURRENT_DATE, 6,8), -- Cliente con privilegio de cambiar contraseña
(CURRENT_DATE, 6,11), -- Cliente con privilegio de consultar cervezas
(CURRENT_DATE, 6,12), -- Cliente con privilegio de realizar ventas
(CURRENT_DATE, 6,13), -- Cliente con privilegio de realizar compras
(CURRENT_DATE, 6,16), -- Cliente con privilegio de gestionar clientes
(CURRENT_DATE, 6,17), -- Cliente con privilegio de gestionar pedidos
(CURRENT_DATE, 6,18), -- Cliente con privilegio de consultar catalogo
(CURRENT_DATE, 6,21), -- Cliente con privilegio de acceso a soporte
(CURRENT_DATE, 7,8), -- Miembro con privilegio de cambiar contraseña
(CURRENT_DATE, 7,11), -- Miembro con privilegio de consultar cervezas
(CURRENT_DATE, 7,12), -- Miembro con privilegio de realizar ventas
(CURRENT_DATE, 7,13), -- Miembro con privilegio de realizar compras
(CURRENT_DATE, 7,15), -- Miembro con privilegio de gestionar proveedores
(CURRENT_DATE, 7,21), -- Miembro con privilegio de acceso a soporte
(CURRENT_DATE, 8,8), -- Empleado con privilegio de cambiar contraseña
(CURRENT_DATE, 8,11), -- Empleado con privilegio de consultar cervezas
(CURRENT_DATE, 8,12), -- Empleado con privilegio de realizar ventas
(CURRENT_DATE, 8,13), -- Empleado con privilegio de realizar compras
(CURRENT_DATE, 8,14), -- Empleado con privilegio de gestionar promociones
(CURRENT_DATE, 8,17), -- Empleado con privilegio de gestionar pedidos
(CURRENT_DATE, 8,20), -- Empleado con privilegio de gestionar inventario
(CURRENT_DATE, 8,21), -- Empleado con privilegio de acceso a soporte
(CURRENT_DATE, 9,8), -- Repartidor con privilegio de cambiar contraseña
(CURRENT_DATE, 9, 9), -- Repartidor con privilegio de ver historial
(CURRENT_DATE, 9, 17), -- Repartidor con privilegio de gestionar pedidos
(CURRENT_DATE, 9,21), -- Repartidor con privilegio de acceso a soporte
(CURRENT_DATE, 10,8), -- Vendedor con privilegio de cambiar contraseña
(CURRENT_DATE, 10,9), -- Vendedor con privilegio de ver historial
(CURRENT_DATE, 10,11), -- Vendedor con privilegio de consultar cervezas
(CURRENT_DATE, 10,12), -- Vendedor con privilegio de realizar ventas
(CURRENT_DATE, 10,13), -- Vendedor con privilegio de realizar compras
(CURRENT_DATE, 10,14), -- Vendedor con privilegio de gestionar promociones
(CURRENT_DATE, 10,19), -- Vendedor con privilegio de ver inventario
(CURRENT_DATE, 10,20), -- Vendedor con privilegio de gestionar inventario
(CURRENT_DATE, 10,21), -- Vendedor con privilegio de acceso a soporte
(CURRENT_DATE, 10,22);


-- Insertar usuario (10 ejemplos)
INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
('admin','admin123',4,678901234,NULL,NULL),  -- Administrador
('supervisor','supervisor123',2,234567890,NULL,NULL),  -- Supervisor
('soporte','soporte123',10,567890123,NULL,NULL),  -- Soporte Técnico
('gerente','gerente123',4,345678901,NULL,NULL),  -- Gerente
('analista','analista123',5,901234567,NULL,NULL),  -- Analista
('cliente1','cliente123',6,NULL,NULL,1),  -- Cliente
('miembro1','miembro123',7,NULL,1,NULL),  -- Miembro
('empleado1','empleado123',8,123456789,NULL,NULL),  -- Empleado
('repartidor1','repartidor123',9,456789012,NULL,NULL),  -- Repartidor
('vendedor1','vendedor123',10,789012345,NULL,NULL);  -- Vendedor

-- Insertar telefono (10 ejemplos)
INSERT INTO telefono (codigo, numero, extension, fk_empleado, fk_cliente, fk_miembro, fk_persona_contacto) VALUES
('0414','7069811',NULL,NULL,1,NULL,NULL), -- Telefono del cliente 1
('0416','1234567',NULL,NULL,1,NULL,NULL), -- Telefono del cliente 1
('0416','2345678',NULL,NULL,3,NULL,NULL), -- Telefono del cliente 2
('0424','4567890',NULL,NULL,5,NULL,NULL), -- Telefono del cliente 5
('0414','5678901',NULL,NULL,NULL,1,NULL), -- Telefono del miembro 1
('0416','6789012',NULL,NULL,NULL,2,NULL), -- Telefono del miembro 2
('0416','6789122',NULL,NULL,NULL,2,NULL), -- Telefono del miembro 2
('0424','7890123',NULL,123456789,NULL,NULL), -- Telefono del empleado 123456789
('0424','8901234',NULL,987654321,NULL,NULL); -- Telefono del empleado 987654321
('0414','9012345',NULL,NULL,NULL,NULL,1); --Telefono del contacto 1

-- Insertar correo (10 ejemplos)
INSERT INTO correo_electronico (direccion_email, fk_cliente,fk_miembro,fk_persona_contacto) VALUES
('cliente1@gmail.com',1,NULL,NULL), -- Correo del cliente 1
('cliente2@hotmail.com',2,NULL,NULL), -- Correo del cliente 2
('cliente3@gmail.com',3,NULL,NULL), -- Correo del cliente 3
('miembro1@gmail.com',NULL,1,NULL), -- Correo del miembro 1
('miembro1@hotmail.com',NULL,1,NULL), -- Correo del miembro 1
('miembro2@gmail.com',NULL,2,NULL), -- Correo del miembro 2
('miembro3@gmail.com',NULL,3,NULL), -- Correo del miembro 3
('personacontacto1@gmail.com',NULL,NULL,1), -- Correo de la persona de contacto 1
('personacontacto2@gmail.com',NULL,NULL,2), -- Correo de la persona de contacto 2
('personacontacto3@gmail.com',NULL,NULL,3); -- Correo de la persona de contacto 3

-- Insertar persona_contacto (10 ejemplos)
INSERT INTO persona_contacto (primer_nombre, primer_apellido, fk_miembro, fk_cliente) VALUES
('Juan','Pérez',1,NULL), -- Persona de contacto del miembro 1
('Ana','Gómez',1,NULL), -- Persona de contacto del miembro 1
('Luis','Martínez'2,NULL), -- Persona de contacto del miembro 2
('María','López',2,NULL), -- Persona de contacto del miembro 2
('Carlos','Hernández',3,NULL), -- Persona de contacto del miembro 3
('Laura','Ramírez',NULL,21), -- Persona de contacto del cliente 21
('Pedro','Torres',NULL,22), -- Persona de contacto del cliente 22
('Sofía','Vásquez',NULL,22), -- Persona de contacto del cliente 22
('Andrés','Morales',NULL,23), -- Persona de contacto del cliente 23
('Isabel','Reyes',NULL,23); -- Persona de contacto del cliente 23