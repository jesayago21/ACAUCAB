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
('admin','admin123',1,1,NULL,NULL),  -- Administrador
('supervisor','supervisor123',2,2,NULL,NULL),  -- Supervisor
('soporte','soporte123',3,3,NULL,NULL),  -- Soporte Técnico
('gerente','gerente123',4,4,NULL,NULL),  -- Gerente
('analista','analista123',5,5,NULL,NULL),  -- Analista
('cliente1','cliente123',6,NULL,NULL,1),  -- Cliente
('miembro1','miembro123',7,NULL,1,NULL),  -- Miembro
('empleado1','empleado123',8,6,NULL,NULL),  -- Empleado
('repartidor1','repartidor123',9,7,NULL,NULL),  -- Repartidor
('vendedor1','vendedor123',10,8,NULL,NULL);  -- Vendedor