-- Corrección específica para la función obtener_ventas_totales
-- Problema: ambigüedad con monto_total

CREATE OR REPLACE FUNCTION obtener_ventas_totales(
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_tipo_tienda VARCHAR(20) DEFAULT NULL
)
RETURNS TABLE (
    tipo_venta VARCHAR(20),
    cantidad_ventas BIGINT,
    monto_total DECIMAL(15,2),
    promedio_venta DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_unificadas AS (
        SELECT 
            'online'::VARCHAR(20) as tipo,
            vo.monto_total as monto,
            vo.fecha
        FROM venta_online vo
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        SELECT 
            'fisica'::VARCHAR(20) as tipo,
            vf.total_venta as monto,
            vf.fecha
        FROM venta_tienda_fisica vf
        WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        SELECT 
            'evento'::VARCHAR(20) as tipo,
            ve.monto_total as monto,
            ve.fecha
        FROM venta_evento ve
        WHERE ve.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    )
    SELECT 
        vu.tipo as tipo_venta,
        COUNT(*) as cantidad_ventas,
        SUM(vu.monto) as monto_total,
        AVG(vu.monto) as promedio_venta
    FROM ventas_unificadas vu
    WHERE p_tipo_tienda IS NULL OR vu.tipo = p_tipo_tienda
    GROUP BY vu.tipo
    
    UNION ALL
    
    SELECT 
        'total'::VARCHAR(20) as tipo_venta,
        COUNT(*) as cantidad_ventas,
        SUM(vu.monto) as monto_total,
        AVG(vu.monto) as promedio_venta
    FROM ventas_unificadas vu
    WHERE p_tipo_tienda IS NULL OR vu.tipo = p_tipo_tienda;
END;
$$; 