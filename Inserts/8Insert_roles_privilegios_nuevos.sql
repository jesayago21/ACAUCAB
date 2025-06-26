-- =====================================================
-- ASIGNACIÓN DE PRIVILEGIOS A ROLES - SISTEMA ACAUCAB  
-- =====================================================
-- Basado en permisos atómicos básicos por tabla

-- =====================================================
-- ROL: ADMINISTRADOR (Todos los privilegios)
-- =====================================================

-- Privilegios de gestión de productos y recetas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear receta', 'consultar receta', 'modificar receta', 'eliminar receta',
    'crear tipo cerveza', 'consultar tipo cerveza', 'modificar tipo cerveza', 'eliminar tipo cerveza',
    'crear caracteristica', 'consultar caracteristica', 'modificar caracteristica', 'eliminar caracteristica',
    'crear ingrediente', 'consultar ingrediente', 'modificar ingrediente', 'eliminar ingrediente',
    'crear cerveza', 'consultar cerveza', 'modificar cerveza', 'eliminar cerveza',
    'crear presentacion', 'consultar presentacion', 'modificar presentacion', 'eliminar presentacion'
);

-- Privilegios de gestión de personas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear cliente', 'consultar cliente', 'modificar cliente', 'eliminar cliente',
    'crear empleado', 'consultar empleado', 'modificar empleado', 'eliminar empleado',
    'crear miembro', 'consultar miembro', 'modificar miembro', 'eliminar miembro'
);

-- Privilegios de gestión de usuarios y seguridad
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear usuario', 'consultar usuario', 'modificar usuario', 'eliminar usuario',
    'crear rol', 'consultar rol', 'modificar rol', 'eliminar rol',
    'crear privilegio', 'consultar privilegio', 'modificar privilegio', 'eliminar privilegio'
);

-- Privilegios de gestión de ventas y compras
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear compra', 'consultar compra', 'modificar compra', 'eliminar compra',
    'crear venta tienda fisica', 'consultar venta tienda fisica', 'modificar venta tienda fisica', 'eliminar venta tienda fisica',
    'crear venta online', 'consultar venta online', 'modificar venta online', 'eliminar venta online',
    'crear venta evento', 'consultar venta evento', 'modificar venta evento', 'eliminar venta evento'
);

-- Privilegios de gestión de inventario
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear inventario', 'consultar inventario', 'modificar inventario', 'eliminar inventario',
    'crear almacen', 'consultar almacen', 'modificar almacen', 'eliminar almacen',
    'crear reposicion', 'consultar reposicion', 'modificar reposicion', 'eliminar reposicion'
);

-- Privilegios de gestión de eventos y ofertas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear evento', 'consultar evento', 'modificar evento', 'eliminar evento',
    'crear pago', 'consultar pago', 'modificar pago', 'eliminar pago',
    'crear oferta', 'consultar oferta', 'modificar oferta', 'eliminar oferta'
);

-- =====================================================
-- ROL: SUPERVISOR (Privilegios de supervisión)
-- =====================================================

-- Privilegios de consulta y modificación de productos
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar receta', 'modificar receta',
    'consultar tipo cerveza', 'modificar tipo cerveza',
    'consultar caracteristica', 'modificar caracteristica',
    'consultar ingrediente', 'modificar ingrediente',
    'consultar cerveza', 'modificar cerveza',
    'consultar presentacion', 'modificar presentacion'
);

-- Privilegios de gestión de clientes
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear cliente', 'consultar cliente', 'modificar cliente',
    'consultar empleado', 'consultar miembro'
);

-- Privilegios de gestión de ventas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear venta tienda fisica', 'consultar venta tienda fisica', 'modificar venta tienda fisica',
    'crear venta online', 'consultar venta online', 'modificar venta online',
    'crear venta evento', 'consultar venta evento', 'modificar venta evento'
);

-- Privilegios de gestión de inventario y reposiciones
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar inventario', 'modificar inventario',
    'consultar almacen', 'modificar almacen',
    'crear reposicion', 'consultar reposicion', 'modificar reposicion'
);

-- Privilegios de gestión de compras y pagos
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear compra', 'consultar compra', 'modificar compra',
    'crear pago', 'consultar pago', 'modificar pago'
);

-- Privilegios de gestión de eventos y ofertas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar evento', 'modificar evento',
    'crear oferta', 'consultar oferta', 'modificar oferta'
);

-- =====================================================
-- ROL: VENDEDOR (Privilegios básicos de venta)
-- =====================================================

-- Privilegios de consulta de productos
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar receta', 'consultar tipo cerveza', 'consultar caracteristica',
    'consultar ingrediente', 'consultar cerveza', 'consultar presentacion'
);

-- Privilegios de gestión básica de clientes
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear cliente', 'consultar cliente', 'modificar cliente'
);

-- Privilegios de ventas básicas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear venta tienda fisica', 'consultar venta tienda fisica',
    'crear venta evento', 'consultar venta evento'
);

-- Privilegios de consulta de inventario
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar inventario', 'consultar almacen'
);

-- Privilegios de gestión de pagos
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear pago', 'consultar pago'
);

-- Privilegios de consulta de ofertas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar oferta', 'consultar evento'
);

-- =====================================================
-- ROL: CLIENTE ADMIN (Privilegios limitados de consulta)
-- =====================================================

-- Privilegios básicos de consulta
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 4, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar cerveza', 'consultar presentacion', 'consultar tipo cerveza',
    'consultar caracteristica', 'consultar oferta', 'consultar evento'
);

-- Privilegios de gestión de su propio perfil
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 4, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar cliente', 'modificar cliente'
);

-- Privilegios de consulta de sus propias ventas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 4, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar venta online', 'consultar pago'
);

-- Comentario informativo sobre la lógica de permisos especiales:
-- Los permisos especiales se derivan automáticamente en el backend basándose en combinaciones de permisos atómicos:
-- 
-- - 'ver dashboard admin': Se otorga si tiene 'consultar usuario' O 'consultar rol'
-- - 'gestionar estados reposicion': Se otorga si tiene 'consultar reposicion' Y 'modificar reposicion'  
-- - 'gestionar estados compra': Se otorga si tiene 'consultar compra' Y 'modificar compra'
-- - 'gestionar estados venta online': Se otorga si tiene 'consultar venta online' Y 'modificar venta online'
-- - 'gestionar roles privilegios': Se otorga si tiene 'consultar rol' Y 'modificar rol' Y 'consultar privilegio'
-- - 'ver reportes ventas': Se otorga si tiene cualquier 'consultar venta...'
-- - 'ver reportes inventario': Se otorga si tiene 'consultar inventario' O 'consultar almacen' 

-- ==============================================================================
-- SINCRONIZACIÓN DE SECUENCIAS PARA EVITAR ERRORES DE LLAVE DUPLICADA
-- ==============================================================================
-- Nota: Esto es necesario si los datos iniciales (roles, privilegios) se
-- insertaron con IDs manuales, lo que desincroniza los contadores automáticos.
SELECT setval('rol_clave_seq', (SELECT MAX(clave) FROM rol), true);
SELECT setval('privilegio_clave_seq', (SELECT MAX(clave) FROM privilegio), true);

-- =============================================
-- INSERTS PARA ROL Y PRIVILEGIOS DE REPOSICIÓN
-- =============================================

-- 1. Insertar el nuevo rol de "Jefe de Pasillo"
-- Este rol es crucial para la gestión de reposiciones en tiendas físicas.
INSERT INTO rol (nombre)
SELECT 'Jefe de Pasillo'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre = 'Jefe de Pasillo');

-- 2. Insertar los privilegios para el módulo de Reposición
-- Estos privilegios permitirán un control de acceso granular desde el frontend.
INSERT INTO privilegio (nombre, descripcion)
SELECT 'consultar reposicion', 'Permite ver la lista de órdenes de reposición y sus detalles.'
WHERE NOT EXISTS (SELECT 1 FROM privilegio WHERE nombre = 'consultar reposicion');

INSERT INTO privilegio (nombre, descripcion)
SELECT 'modificar reposicion', 'Permite cambiar el estado de una orden de reposición (ej. de "procesando" a "listo para entrega").'
WHERE NOT EXISTS (SELECT 1 FROM privilegio WHERE nombre = 'modificar reposicion');

INSERT INTO privilegio (nombre, descripcion)
SELECT 'crear reposicion', 'Permite generar manualmente una nueva orden de reposición.'
WHERE NOT EXISTS (SELECT 1 FROM privilegio WHERE nombre = 'crear reposicion');

-- NOTA: La asignación de estos privilegios a los roles se gestiona
-- desde el panel de administración del frontend y ya no se incluye en este script. 