-- =====================================================
-- PRIVILEGIOS ATÓMICOS CORREGIDOS - SISTEMA ACAUCAB
-- =====================================================
-- Privilegios básicos por tabla sin guiones bajos entre verbo y tabla

-- =====================================================
-- PRIVILEGIOS BÁSICOS POR TABLA PRINCIPAL
-- =====================================================

-- RECETA
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear receta', 'Permite crear nuevas recetas de cerveza'),
('consultar receta', 'Permite consultar recetas existentes'),
('modificar receta', 'Permite modificar recetas existentes'),
('eliminar receta', 'Permite eliminar recetas');

-- TIPO_CERVEZA
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear tipo cerveza', 'Permite crear nuevos tipos de cerveza'),
('consultar tipo cerveza', 'Permite consultar tipos de cerveza'),
('modificar tipo cerveza', 'Permite modificar tipos de cerveza'),
('eliminar tipo cerveza', 'Permite eliminar tipos de cerveza');

-- CARACTERISTICA
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear caracteristica', 'Permite crear nuevas características'),
('consultar caracteristica', 'Permite consultar características'),
('modificar caracteristica', 'Permite modificar características'),
('eliminar caracteristica', 'Permite eliminar características');

-- INGREDIENTE
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear ingrediente', 'Permite crear nuevos ingredientes'),
('consultar ingrediente', 'Permite consultar ingredientes'),
('modificar ingrediente', 'Permite modificar ingredientes'),
('eliminar ingrediente', 'Permite eliminar ingredientes');

-- CERVEZA
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear cerveza', 'Permite crear nuevas cervezas'),
('consultar cerveza', 'Permite consultar cervezas'),
('modificar cerveza', 'Permite modificar cervezas'),
('eliminar cerveza', 'Permite eliminar cervezas');

-- PRESENTACION
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear presentacion', 'Permite crear nuevas presentaciones'),
('consultar presentacion', 'Permite consultar presentaciones'),
('modificar presentacion', 'Permite modificar presentaciones'),
('eliminar presentacion', 'Permite eliminar presentaciones');

-- CLIENTE
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear cliente', 'Permite crear nuevos clientes'),
('consultar cliente', 'Permite consultar clientes'),
('modificar cliente', 'Permite modificar clientes'),
('eliminar cliente', 'Permite eliminar clientes');

-- EMPLEADO
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear empleado', 'Permite crear nuevos empleados'),
('consultar empleado', 'Permite consultar empleados'),
('modificar empleado', 'Permite modificar empleados'),
('eliminar empleado', 'Permite eliminar empleados');

-- MIEMBRO
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear miembro', 'Permite crear nuevos miembros'),
('consultar miembro', 'Permite consultar miembros'),
('modificar miembro', 'Permite modificar miembros'),
('eliminar miembro', 'Permite eliminar miembros');

-- USUARIO
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear usuario', 'Permite crear nuevos usuarios'),
('consultar usuario', 'Permite consultar usuarios'),
('modificar usuario', 'Permite modificar usuarios'),
('eliminar usuario', 'Permite eliminar usuarios');

-- ROL
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear rol', 'Permite crear nuevos roles de usuario'),
('consultar rol', 'Permite consultar roles existentes'),
('modificar rol', 'Permite modificar roles'),
('eliminar rol', 'Permite eliminar roles');

-- PRIVILEGIO
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear privilegio', 'Permite crear nuevos privilegios'),
('consultar privilegio', 'Permite consultar privilegios'),
('modificar privilegio', 'Permite modificar privilegios'),
('eliminar privilegio', 'Permite eliminar privilegios');

-- COMPRA
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear compra', 'Permite crear nuevas compras'),
('consultar compra', 'Permite consultar compras'),
('modificar compra', 'Permite modificar compras'),
('eliminar compra', 'Permite eliminar compras');

-- VENTA_TIENDA_FISICA
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear venta tienda fisica', 'Permite crear ventas en tienda física'),
('consultar venta tienda fisica', 'Permite consultar ventas en tienda física'),
('modificar venta tienda fisica', 'Permite modificar ventas en tienda física'),
('eliminar venta tienda fisica', 'Permite eliminar ventas en tienda física');

-- VENTA_ONLINE
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear venta online', 'Permite crear ventas online'),
('consultar venta online', 'Permite consultar ventas online'),
('modificar venta online', 'Permite modificar ventas online'),
('eliminar venta online', 'Permite eliminar ventas online');

-- VENTA_EVENTO
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear venta evento', 'Permite crear ventas en eventos'),
('consultar venta evento', 'Permite consultar ventas en eventos'),
('modificar venta evento', 'Permite modificar ventas en eventos'),
('eliminar venta evento', 'Permite eliminar ventas en eventos');

-- INVENTARIO
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear inventario', 'Permite crear registros de inventario'),
('consultar inventario', 'Permite consultar inventario'),
('modificar inventario', 'Permite modificar inventario'),
('eliminar inventario', 'Permite eliminar registros de inventario');

-- ALMACEN
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear almacen', 'Permite crear registros de almacén'),
('consultar almacen', 'Permite consultar almacén'),
('modificar almacen', 'Permite modificar almacén'),
('eliminar almacen', 'Permite eliminar registros de almacén');

-- REPOSICION
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear reposicion', 'Permite crear reposiciones'),
('consultar reposicion', 'Permite consultar reposiciones'),
('modificar reposicion', 'Permite modificar reposiciones'),
('eliminar reposicion', 'Permite eliminar reposiciones');

-- EVENTO
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear evento', 'Permite crear nuevos eventos'),
('consultar evento', 'Permite consultar eventos'),
('modificar evento', 'Permite modificar eventos'),
('eliminar evento', 'Permite eliminar eventos');

-- PAGO
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear pago', 'Permite crear nuevos pagos'),
('consultar pago', 'Permite consultar pagos'),
('modificar pago', 'Permite modificar pagos'),
('eliminar pago', 'Permite eliminar pagos');

-- OFERTA
INSERT INTO privilegio (nombre, descripcion) VALUES 
('crear oferta', 'Permite crear nuevas ofertas'),
('consultar oferta', 'Permite consultar ofertas'),
('modificar oferta', 'Permite modificar ofertas'),
('eliminar oferta', 'Permite eliminar ofertas');

-- Comentario informativo:
-- Total de privilegios: ~70 privilegios atómicos básicos
-- Los privilegios especiales se derivan automáticamente en el backend basándose en combinaciones de estos atómicos
-- Ejemplos de derivación:
-- - 'ver dashboard admin': Se otorga si tiene 'consultar usuario' O 'consultar rol'
-- - 'gestionar estados reposicion': Se otorga si tiene 'consultar reposicion' Y 'modificar reposicion'
-- - 'gestionar estados compra': Se otorga si tiene 'consultar compra' Y 'modificar compra'
-- - 'gestionar estados venta online': Se otorga si tiene 'consultar venta online' Y 'modificar venta online'
-- - 'gestionar roles privilegios': Se otorga si tiene 'consultar rol' Y 'modificar rol' Y 'consultar privilegio'
-- - 'ver reportes ventas': Se otorga si tiene cualquier 'consultar venta...'
-- - 'ver reportes inventario': Se otorga si tiene 'consultar inventario' O 'consultar almacen' 