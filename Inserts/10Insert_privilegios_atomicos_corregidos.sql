-- =====================================================
-- PRIVILEGIOS ATÓMICOS CORREGIDOS - SISTEMA ACAUCAB
-- =====================================================
-- Privilegios básicos por tabla sin guiones bajos entre verbo y tabla
-- Claves continuando desde 241 (después de los privilegios existentes)

-- =====================================================
-- PRIVILEGIOS BÁSICOS POR TABLA PRINCIPAL
-- =====================================================

-- RECETA
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(241, 'crear receta', 'Permite crear nuevas recetas de cerveza'),
(242, 'consultar receta', 'Permite consultar recetas existentes'),
(243, 'modificar receta', 'Permite modificar recetas existentes'),
(244, 'eliminar receta', 'Permite eliminar recetas');

-- TIPO_CERVEZA
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(245, 'crear tipo cerveza', 'Permite crear nuevos tipos de cerveza'),
(246, 'consultar tipo cerveza', 'Permite consultar tipos de cerveza'),
(247, 'modificar tipo cerveza', 'Permite modificar tipos de cerveza'),
(248, 'eliminar tipo cerveza', 'Permite eliminar tipos de cerveza');

-- CARACTERISTICA
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(249, 'crear caracteristica', 'Permite crear nuevas características'),
(250, 'consultar caracteristica', 'Permite consultar características'),
(251, 'modificar caracteristica', 'Permite modificar características'),
(252, 'eliminar caracteristica', 'Permite eliminar características');

-- INGREDIENTE
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(253, 'crear ingrediente', 'Permite crear nuevos ingredientes'),
(254, 'consultar ingrediente', 'Permite consultar ingredientes'),
(255, 'modificar ingrediente', 'Permite modificar ingredientes'),
(256, 'eliminar ingrediente', 'Permite eliminar ingredientes');

-- CERVEZA
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(257, 'crear cerveza', 'Permite crear nuevas cervezas'),
(258, 'consultar cerveza', 'Permite consultar cervezas'),
(259, 'modificar cerveza', 'Permite modificar cervezas'),
(260, 'eliminar cerveza', 'Permite eliminar cervezas');

-- PRESENTACION
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(261, 'crear presentacion', 'Permite crear nuevas presentaciones'),
(262, 'consultar presentacion', 'Permite consultar presentaciones'),
(263, 'modificar presentacion', 'Permite modificar presentaciones'),
(264, 'eliminar presentacion', 'Permite eliminar presentaciones');

-- CLIENTE
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(265, 'crear cliente', 'Permite crear nuevos clientes'),
(266, 'consultar cliente', 'Permite consultar clientes'),
(267, 'modificar cliente', 'Permite modificar clientes'),
(268, 'eliminar cliente', 'Permite eliminar clientes');

-- EMPLEADO
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(269, 'crear empleado', 'Permite crear nuevos empleados'),
(270, 'consultar empleado', 'Permite consultar empleados'),
(271, 'modificar empleado', 'Permite modificar empleados'),
(272, 'eliminar empleado', 'Permite eliminar empleados');

-- MIEMBRO
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(273, 'crear miembro', 'Permite crear nuevos miembros'),
(274, 'consultar miembro', 'Permite consultar miembros'),
(275, 'modificar miembro', 'Permite modificar miembros'),
(276, 'eliminar miembro', 'Permite eliminar miembros');

-- USUARIO
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(277, 'crear usuario', 'Permite crear nuevos usuarios'),
(278, 'consultar usuario', 'Permite consultar usuarios'),
(279, 'modificar usuario', 'Permite modificar usuarios'),
(280, 'eliminar usuario', 'Permite eliminar usuarios');

-- ROL
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(281, 'crear rol', 'Permite crear nuevos roles de usuario'),
(282, 'consultar rol', 'Permite consultar roles existentes'),
(283, 'modificar rol', 'Permite modificar roles'),
(284, 'eliminar rol', 'Permite eliminar roles');

-- PRIVILEGIO
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(285, 'crear privilegio', 'Permite crear nuevos privilegios'),
(286, 'consultar privilegio', 'Permite consultar privilegios'),
(287, 'modificar privilegio', 'Permite modificar privilegios'),
(288, 'eliminar privilegio', 'Permite eliminar privilegios');

-- COMPRA
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(289, 'crear compra', 'Permite crear nuevas compras'),
(290, 'consultar compra', 'Permite consultar compras'),
(291, 'modificar compra', 'Permite modificar compras'),
(292, 'eliminar compra', 'Permite eliminar compras');

-- VENTA_TIENDA_FISICA
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(293, 'crear venta tienda fisica', 'Permite crear ventas en tienda física'),
(294, 'consultar venta tienda fisica', 'Permite consultar ventas en tienda física'),
(295, 'modificar venta tienda fisica', 'Permite modificar ventas en tienda física'),
(296, 'eliminar venta tienda fisica', 'Permite eliminar ventas en tienda física');

-- VENTA_ONLINE
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(297, 'crear venta online', 'Permite crear ventas online'),
(298, 'consultar venta online', 'Permite consultar ventas online'),
(299, 'modificar venta online', 'Permite modificar ventas online'),
(300, 'eliminar venta online', 'Permite eliminar ventas online');

-- VENTA_EVENTO
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(301, 'crear venta evento', 'Permite crear ventas en eventos'),
(302, 'consultar venta evento', 'Permite consultar ventas en eventos'),
(303, 'modificar venta evento', 'Permite modificar ventas en eventos'),
(304, 'eliminar venta evento', 'Permite eliminar ventas en eventos');

-- INVENTARIO
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(305, 'crear inventario', 'Permite crear registros de inventario'),
(306, 'consultar inventario', 'Permite consultar inventario'),
(307, 'modificar inventario', 'Permite modificar inventario'),
(308, 'eliminar inventario', 'Permite eliminar registros de inventario');

-- ALMACEN
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(309, 'crear almacen', 'Permite crear registros de almacén'),
(310, 'consultar almacen', 'Permite consultar almacén'),
(311, 'modificar almacen', 'Permite modificar almacén'),
(312, 'eliminar almacen', 'Permite eliminar registros de almacén');

-- REPOSICION
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(313, 'crear reposicion', 'Permite crear reposiciones'),
(314, 'consultar reposicion', 'Permite consultar reposiciones'),
(315, 'modificar reposicion', 'Permite modificar reposiciones'),
(316, 'eliminar reposicion', 'Permite eliminar reposiciones');

-- EVENTO
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(317, 'crear evento', 'Permite crear nuevos eventos'),
(318, 'consultar evento', 'Permite consultar eventos'),
(319, 'modificar evento', 'Permite modificar eventos'),
(320, 'eliminar evento', 'Permite eliminar eventos');

-- PAGO
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(321, 'crear pago', 'Permite crear nuevos pagos'),
(322, 'consultar pago', 'Permite consultar pagos'),
(323, 'modificar pago', 'Permite modificar pagos'),
(324, 'eliminar pago', 'Permite eliminar pagos');

-- OFERTA
INSERT INTO privilegio (clave, nombre, descripcion) VALUES 
(325, 'crear oferta', 'Permite crear nuevas ofertas'),
(326, 'consultar oferta', 'Permite consultar ofertas'),
(327, 'modificar oferta', 'Permite modificar ofertas'),
(328, 'eliminar oferta', 'Permite eliminar ofertas');

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