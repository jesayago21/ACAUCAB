-- Corrección para el problema de cross join en obtener_clientes_nuevos_vs_recurrentes

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