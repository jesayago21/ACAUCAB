/** Inserts de usuarios de prueba para testing del sistema de login */



-- Asignar privilegios a roles
-- Administrador tiene todos los privilegios
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(CURRENT_DATE, 1, 1), -- ver_reportes
(CURRENT_DATE, 1, 2), -- gestionar_usuarios
(CURRENT_DATE, 1, 3), -- gestionar_inventario
(CURRENT_DATE, 1, 4), -- configurar_sistema
(CURRENT_DATE, 1, 5), -- procesar_ventas
(CURRENT_DATE, 1, 6); -- gestionar_clientes

-- Vendedor solo puede procesar ventas y ver algunos reportes
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(CURRENT_DATE, 2, 1), -- ver_reportes
(CURRENT_DATE, 2, 5), -- procesar_ventas
(CURRENT_DATE, 2, 6); -- gestionar_clientes

-- Supervisor puede todo excepto configurar sistema
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(CURRENT_DATE, 3, 1), -- ver_reportes
(CURRENT_DATE, 3, 2), -- gestionar_usuarios
(CURRENT_DATE, 3, 3), -- gestionar_inventario
(CURRENT_DATE, 3, 5), -- procesar_ventas
(CURRENT_DATE, 3, 6); -- gestionar_clientes

-- Cliente Admin solo puede ver reportes básicos
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(CURRENT_DATE, 4, 1); -- ver_reportes

-- Insertar empleados de prueba
INSERT INTO empleado (ci, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, descripcion) VALUES
(12345678, 'Juan', 'Carlos', 'Pérez', 'González', '1985-03-15', 'Administrador del sistema'),
(87654321, 'María', 'Elena', 'Rodríguez', 'López', '1990-07-22', 'Vendedora principal'),
(11223344, 'Pedro', 'Antonio', 'Martínez', 'Silva', '1988-11-10', 'Supervisor de tienda');

-- Insertar cliente de prueba (tipo natural)
INSERT INTO cliente (rif, puntos_acumulados, tipo, ci, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_habitacion, fk_direccion_habitacion) VALUES
(123456789, 150, 'natural', 55667788, 'Ana', 'Sofía', 'García', 'Mendoza', 'Av. Principal #123', 1);

-- Insertar usuarios de prueba
-- Usuario administrador (empleado)
INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
('admin', 'admin123', 1, 12345678, NULL, NULL);

-- Usuario vendedor (empleado)
INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
('vendedor', 'vend123', 2, 87654321, NULL, NULL);

-- Usuario supervisor (empleado)
INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
('supervisor', 'super123', 3, 11223344, NULL, NULL);

-- Usuario cliente
INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
('cliente', 'cliente123', 4, NULL, NULL, 1);

-- Insertar contratos para los empleados (necesario para obtener cargo y departamento)
INSERT INTO contrato (fecha_inicio, fecha_fin, monto_salario, fk_empleado, fk_cargo, fk_departamento) VALUES
(CURRENT_DATE - INTERVAL '1 year', NULL, 50000, 12345678, 1, 1), -- admin
(CURRENT_DATE - INTERVAL '6 months', NULL, 35000, 87654321, 2, 2), -- vendedor
(CURRENT_DATE - INTERVAL '8 months', NULL, 45000, 11223344, 3, 2); -- supervisor

/** 
CREDENCIALES DE PRUEBA:

1. Administrador:
   - Usuario: admin
   - Contraseña: admin123
   - Permisos: Todos

2. Vendedor:
   - Usuario: vendedor
   - Contraseña: vend123
   - Permisos: Ver reportes, procesar ventas, gestionar clientes

3. Supervisor:
   - Usuario: supervisor
   - Contraseña: super123
   - Permisos: Todos excepto configurar sistema

4. Cliente:
   - Usuario: cliente
   - Contraseña: cliente123
   - Permisos: Solo ver reportes básicos
*/ 