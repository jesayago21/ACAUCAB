-- =============================================
-- CORRECCIÓN DE FUNCIONES DEL DASHBOARD
-- Problema: Ambigüedad en referencias de columnas
-- =============================================

-- 1. Corregir función reporte_ventas_por_canal
CREATE OR REPLACE FUNCTION reporte_ventas_por_canal(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    canal VARCHAR(20),
    cantidad_ventas BIGINT,
    monto_total DECIMAL(15,2),
    porcentaje_del_total DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_por_canal AS (
        SELECT 
            'Online' as canal,
            COUNT(*) as ventas,
            SUM(monto_total) as monto
        FROM venta_online
        WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        SELECT 
            'Tienda Física' as canal,
            COUNT(*) as ventas,
            SUM(total_venta) as monto
        FROM venta_tienda_fisica
        WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        SELECT 
            'Eventos' as canal,
            COUNT(*) as ventas,
            SUM(monto_total) as monto
        FROM venta_evento
        WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ),
    total AS (
        SELECT SUM(monto) as total_general FROM ventas_por_canal
    )
    SELECT 
        vpc.canal,
        vpc.ventas as cantidad_ventas,
        vpc.monto as monto_total,
        ROUND((vpc.monto / t.total_general * 100)::NUMERIC, 2) as porcentaje_del_total
    FROM ventas_por_canal vpc, total t
    ORDER BY vpc.monto DESC;
END;
$$;

-- 2. Corregir función obtener_clientes_nuevos_vs_recurrentes
CREATE OR REPLACE FUNCTION obtener_clientes_nuevos_vs_recurrentes(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    tipo_cliente VARCHAR(20),
    cantidad INT,
    porcentaje DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH clientes_periodo AS (
        SELECT DISTINCT fk_cliente as cliente_id
        FROM venta_tienda_fisica
        WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION
        
        SELECT DISTINCT c.clave as cliente_id
        FROM venta_online vo
        JOIN usuario u ON vo.fk_usuario = u.clave
        JOIN cliente c ON u.fk_cliente = c.clave
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION
        
        SELECT DISTINCT fk_cliente as cliente_id
        FROM venta_evento
        WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ),
    clientes_anteriores AS (
        SELECT DISTINCT fk_cliente as cliente_id
        FROM venta_tienda_fisica
        WHERE fecha < p_fecha_inicio
        
        UNION
        
        SELECT DISTINCT c.clave as cliente_id
        FROM venta_online vo
        JOIN usuario u ON vo.fk_usuario = u.clave
        JOIN cliente c ON u.fk_cliente = c.clave
        WHERE vo.fecha < p_fecha_inicio
        
        UNION
        
        SELECT DISTINCT fk_cliente as cliente_id
        FROM venta_evento
        WHERE fecha < p_fecha_inicio
    ),
    clasificacion AS (
        SELECT 
            cp.cliente_id,
            CASE 
                WHEN ca.cliente_id IS NULL THEN 'nuevo'
                ELSE 'recurrente'
            END as tipo
        FROM clientes_periodo cp
        LEFT JOIN clientes_anteriores ca ON cp.cliente_id = ca.cliente_id
    ),
    conteos AS (
        SELECT 
            tipo,
            COUNT(*) as cantidad_clientes
        FROM clasificacion
        GROUP BY tipo
    ),
    total AS (
        SELECT SUM(cantidad_clientes) as total_clientes FROM conteos
    )
    SELECT 
        c.tipo as tipo_cliente,
        c.cantidad_clientes::INT as cantidad,
        ROUND((c.cantidad_clientes::DECIMAL / t.total_clientes * 100), 2) as porcentaje
    FROM conteos c
    CROSS JOIN total t;
END;
$$;

-- =============================================
-- COMENTARIOS SOBRE LAS CORRECCIONES:
-- =============================================
-- 1. En reporte_ventas_por_canal:
--    - Cambié 'monto_total' a 'total_general' en el CTE 'total'
--    - Esto elimina la ambigüedad con 'monto_total' del SELECT final
--
-- 3. Corregir función obtener_ventas_por_estilo_cerveza
CREATE OR REPLACE FUNCTION obtener_ventas_por_estilo_cerveza(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    estilo_cerveza VARCHAR(50),
    cantidad_vendida BIGINT,
    monto_total DECIMAL(15,2),
    porcentaje_del_total DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_por_estilo AS (
        -- Ventas online
        SELECT 
            tc.nombre as estilo,
            dvo.cantidad,
            dvo.cantidad * dvo.precio_unitario as monto
        FROM detalle_venta_online dvo
        JOIN almacen a ON dvo.fk_almacen = a.clave
        JOIN presentacion p ON a.fk_presentacion = p.clave
        JOIN cerveza c ON p.fk_cerveza = c.clave
        JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
        JOIN venta_online vo ON dvo.fk_venta_online = vo.clave
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        -- Ventas físicas
        SELECT 
            tc.nombre as estilo,
            dvf.cantidad,
            dvf.cantidad * dvf.precio_unitario as monto
        FROM detalle_venta_fisica dvf
        JOIN inventario_tienda it ON dvf.fk_inventario_tienda = it.clave
        JOIN presentacion p ON it.fk_presentacion = p.clave
        JOIN cerveza c ON p.fk_cerveza = c.clave
        JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
        JOIN venta_tienda_fisica vf ON dvf.fk_venta_tienda_fisica = vf.clave
        WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        -- Ventas en eventos
        SELECT 
            tc.nombre as estilo,
            dve.cantidad,
            dve.cantidad * dve.precio_unitario as monto
        FROM detalle_venta_evento dve
        JOIN inventario_evento ie ON dve.fk_inventario_evento = ie.clave
        JOIN presentacion p ON ie.fk_presentacion = p.clave
        JOIN cerveza c ON p.fk_cerveza = c.clave
        JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
        JOIN venta_evento ve ON dve.fk_venta_evento = ve.clave
        WHERE ve.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ),
    totales AS (
        SELECT SUM(monto) as total_general_estilos
        FROM ventas_por_estilo
    )
    SELECT 
        estilo as estilo_cerveza,
        SUM(cantidad) as cantidad_vendida,
        SUM(monto) as monto_total,
        ROUND((SUM(monto) / totales.total_general_estilos * 100)::NUMERIC, 2) as porcentaje_del_total
    FROM ventas_por_estilo, totales
    GROUP BY estilo, totales.total_general_estilos
    ORDER BY monto_total DESC;
END;
$$;

-- =============================================
-- COMENTARIOS SOBRE LAS CORRECCIONES:
-- =============================================
-- 1. En reporte_ventas_por_canal:
--    - Cambié 'monto_total' a 'total_general' en el CTE 'total'
--    - Esto elimina la ambigüedad con 'monto_total' del SELECT final
--
-- 2. En obtener_clientes_nuevos_vs_recurrentes:
--    - Cambié 'total' a 'total_clientes' en el CTE 'total'
--    - Esto elimina posibles ambigüedades con variables del contexto
--
-- 3. En obtener_ventas_por_estilo_cerveza:
--    - Cambié 'monto_total_general' a 'total_general_estilos'
--    - Esto elimina ambigüedades con variables de contexto
--
-- Estas correcciones resuelven los errores de "column reference ambiguous"
-- ============================================= 