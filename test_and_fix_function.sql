-- =============================================
-- PRUEBA Y CORRECCIÓN: obtener_ventas_totales
-- =============================================

-- Esta función está reescrita para ser extremadamente explícita
-- con los tipos de datos y los nombres de las columnas para evitar
-- errores de "structure mismatch".

DROP FUNCTION IF EXISTS obtener_ventas_totales(DATE, DATE, VARCHAR);

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
    WITH ventas_consolidadas AS (
        -- Ventas online
        SELECT 
            'online'::VARCHAR(20) as tv,
            COUNT(vo.clave) as cv,
            SUM(vo.monto_total) as mt,
            AVG(vo.monto_total) as pv
        FROM venta_online vo
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        -- Ventas físicas
        SELECT 
            'fisica'::VARCHAR(20) as tv,
            COUNT(vf.clave) as cv,
            SUM(vf.total_venta) as mt,
            AVG(vf.total_venta) as pv
        FROM venta_tienda_fisica vf
        WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        -- Ventas en eventos
        SELECT 
            'evento'::VARCHAR(20) as tv,
            COUNT(ve.clave) as cv,
            SUM(ve.monto_total) as mt,
            AVG(ve.monto_total) as pv
        FROM venta_evento ve
        WHERE ve.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    )
    SELECT 
        vc.tv,
        COALESCE(vc.cv, 0)::BIGINT,
        COALESCE(vc.mt, 0)::DECIMAL(15,2),
        COALESCE(vc.pv, 0)::DECIMAL(10,2)
    FROM ventas_consolidadas vc;
END;
$$;

-- =============================================
-- PRUEBA Y CORRECCIÓN: calcular_ticket_promedio
-- =============================================
-- Se usan alias distintos (avg_ticket, avg_items) para evitar
-- el error de "column reference is ambiguous".

DROP FUNCTION IF EXISTS calcular_ticket_promedio(DATE, DATE);

CREATE OR REPLACE FUNCTION calcular_ticket_promedio(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    tipo_venta VARCHAR(20),
    ticket_promedio DECIMAL(10,2),
    cantidad_items_promedio DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH tickets_por_tipo AS (
        -- Tickets online
        SELECT 
            'online'::VARCHAR(20) as tipo_canal,
            AVG(vo.monto_total) as avg_ticket,
            AVG(COALESCE(items_por_venta.cantidad_items, 0)) as avg_items
        FROM venta_online vo
        LEFT JOIN (
            SELECT fk_venta_online, SUM(cantidad) as cantidad_items FROM detalle_venta_online GROUP BY fk_venta_online
        ) items_por_venta ON vo.clave = items_por_venta.fk_venta_online
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        -- Tickets físicos
        SELECT 
            'fisica'::VARCHAR(20) as tipo_canal,
            AVG(vf.total_venta) as avg_ticket,
            AVG(COALESCE(items_por_venta.cantidad_items, 0)) as avg_items
        FROM venta_tienda_fisica vf
        LEFT JOIN (
            SELECT fk_venta_tienda_fisica, SUM(cantidad) as cantidad_items FROM detalle_venta_fisica GROUP BY fk_venta_tienda_fisica
        ) items_por_venta ON vf.clave = items_por_venta.fk_venta_tienda_fisica
        WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        -- Tickets eventos
        SELECT 
            'evento'::VARCHAR(20) as tipo_canal,
            AVG(ve.monto_total) as avg_ticket,
            AVG(COALESCE(items_por_venta.cantidad_items, 0)) as avg_items
        FROM venta_evento ve
        LEFT JOIN (
            SELECT fk_venta_evento, SUM(cantidad) as cantidad_items FROM detalle_venta_evento GROUP BY fk_venta_evento
        ) items_por_venta ON ve.clave = items_por_venta.fk_venta_evento
        WHERE ve.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    )
    SELECT 
        tpt.tipo_canal,
        COALESCE(tpt.avg_ticket, 0)::DECIMAL(10,2),
        COALESCE(tpt.avg_items, 0)::DECIMAL(5,2)
    FROM tickets_por_tipo tpt;
END;
$$;

-- =============================================
-- CORRECCIÓN DEL RESTO DE FUNCIONES FALLIDAS
-- =============================================

-- 3. Corregir obtener_volumen_unidades_vendidas
DROP FUNCTION IF EXISTS obtener_volumen_unidades_vendidas(DATE, DATE);
CREATE OR REPLACE FUNCTION obtener_volumen_unidades_vendidas(p_fecha_inicio DATE, p_fecha_fin DATE)
RETURNS TABLE (
    tipo_venta VARCHAR(20),
    unidades_vendidas BIGINT,
    monto_total DECIMAL(15,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH volumen_por_tipo AS (
        SELECT 'online'::VARCHAR(20) as tipo, SUM(dvo.cantidad) as unidades, SUM(dvo.cantidad * dvo.precio_unitario) as monto
        FROM detalle_venta_online dvo JOIN venta_online vo ON dvo.fk_venta_online = vo.clave WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        UNION ALL
        SELECT 'fisica'::VARCHAR(20) as tipo, SUM(dvf.cantidad) as unidades, SUM(dvf.cantidad * dvf.precio_unitario) as monto
        FROM detalle_venta_fisica dvf JOIN venta_tienda_fisica vf ON dvf.fk_venta_tienda_fisica = vf.clave WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        UNION ALL
        SELECT 'evento'::VARCHAR(20) as tipo, SUM(dve.cantidad) as unidades, SUM(dve.cantidad * dve.precio_unitario) as monto
        FROM detalle_venta_evento dve JOIN venta_evento ve ON dve.fk_venta_evento = ve.clave WHERE ve.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    )
    SELECT 
        vpt.tipo,
        COALESCE(vpt.unidades, 0)::BIGINT,
        COALESCE(vpt.monto, 0)::DECIMAL(15,2)
    FROM volumen_por_tipo vpt;
END;
$$;

-- 4. Corregir obtener_clientes_nuevos_vs_recurrentes
DROP FUNCTION IF EXISTS obtener_clientes_nuevos_vs_recurrentes(DATE, DATE);
CREATE OR REPLACE FUNCTION obtener_clientes_nuevos_vs_recurrentes(p_fecha_inicio DATE, p_fecha_fin DATE)
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
        SELECT DISTINCT fk_cliente as cliente_id FROM venta_tienda_fisica WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin AND fk_cliente IS NOT NULL UNION
        SELECT DISTINCT c.clave as cliente_id FROM venta_online vo JOIN usuario u ON vo.fk_usuario = u.clave JOIN cliente c ON u.fk_cliente = c.clave WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin AND c.clave IS NOT NULL UNION
        SELECT DISTINCT fk_cliente as cliente_id FROM venta_evento WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin AND fk_cliente IS NOT NULL
    ),
    clientes_anteriores AS (
        SELECT DISTINCT fk_cliente as cliente_id FROM venta_tienda_fisica WHERE fecha < p_fecha_inicio AND fk_cliente IS NOT NULL UNION
        SELECT DISTINCT c.clave as cliente_id FROM venta_online vo JOIN usuario u ON vo.fk_usuario = u.clave JOIN cliente c ON u.fk_cliente = c.clave WHERE vo.fecha < p_fecha_inicio AND c.clave IS NOT NULL UNION
        SELECT DISTINCT fk_cliente as cliente_id FROM venta_evento WHERE fecha < p_fecha_inicio AND fk_cliente IS NOT NULL
    ),
    clasificacion AS (
        SELECT cp.cliente_id, CASE WHEN ca.cliente_id IS NULL THEN 'nuevo' ELSE 'recurrente' END as tipo
        FROM clientes_periodo cp LEFT JOIN clientes_anteriores ca ON cp.cliente_id = ca.cliente_id
    ),
    conteos AS (
        SELECT tipo, COUNT(*) as cantidad_clientes FROM clasificacion GROUP BY tipo
    ),
    total_clientes AS (
        SELECT SUM(cantidad_clientes) as total FROM conteos
    )
    SELECT
        c.tipo::VARCHAR(20),
        c.cantidad_clientes::INT,
        (CASE WHEN t.total = 0 THEN 0 ELSE ROUND((c.cantidad_clientes::DECIMAL / t.total * 100), 2) END)::DECIMAL(5,2)
    FROM conteos c, total_clientes t;
END;
$$;

-- 5. Corregir calcular_tasa_retencion_clientes
DROP FUNCTION IF EXISTS calcular_tasa_retencion_clientes(DATE, DATE);
CREATE OR REPLACE FUNCTION calcular_tasa_retencion_clientes(p_fecha_inicio DATE, p_fecha_fin DATE)
RETURNS TABLE (
    clientes_inicio_periodo INT,
    clientes_retenidos INT,
    tasa_retencion DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH clientes_inicio AS (
        SELECT DISTINCT fk_cliente as cliente_id FROM venta_tienda_fisica WHERE fecha < p_fecha_inicio AND fk_cliente IS NOT NULL UNION
        SELECT DISTINCT c.clave as cliente_id FROM venta_online vo JOIN usuario u ON vo.fk_usuario = u.clave JOIN cliente c ON u.fk_cliente = c.clave WHERE vo.fecha < p_fecha_inicio AND c.clave IS NOT NULL UNION
        SELECT DISTINCT fk_cliente as cliente_id FROM venta_evento WHERE fecha < p_fecha_inicio AND fk_cliente IS NOT NULL
    ),
    clientes_periodo AS (
        SELECT DISTINCT fk_cliente as cliente_id FROM venta_tienda_fisica WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin AND fk_cliente IS NOT NULL UNION
        SELECT DISTINCT c.clave as cliente_id FROM venta_online vo JOIN usuario u ON vo.fk_usuario = u.clave JOIN cliente c ON u.fk_cliente = c.clave WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin AND c.clave IS NOT NULL UNION
        SELECT DISTINCT fk_cliente as cliente_id FROM venta_evento WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin AND fk_cliente IS NOT NULL
    ),
    conteo_retenidos AS (
        SELECT COUNT(*) as cantidad
        FROM clientes_inicio ci
        WHERE EXISTS (SELECT 1 FROM clientes_periodo cp WHERE cp.cliente_id = ci.cliente_id)
    ),
    conteo_inicio AS (
        SELECT COUNT(*) as cantidad FROM clientes_inicio
    )
    SELECT
        COALESCE(ci.cantidad, 0)::INT,
        COALESCE(cr.cantidad, 0)::INT,
        (CASE WHEN COALESCE(ci.cantidad, 0) = 0 THEN 0 ELSE ROUND((COALESCE(cr.cantidad, 0)::DECIMAL / ci.cantidad * 100), 2) END)::DECIMAL(5,2)
    FROM conteo_inicio ci, conteo_retenidos cr;
END;
$$;

-- 6. Corregir calcular_rotacion_inventario
DROP FUNCTION IF EXISTS calcular_rotacion_inventario(DATE, DATE);
CREATE OR REPLACE FUNCTION calcular_rotacion_inventario(p_fecha_inicio DATE, p_fecha_fin DATE)
RETURNS TABLE (
    tipo_inventario VARCHAR(20),
    rotacion_inventario DECIMAL(10,2),
    valor_promedio_inventario DECIMAL(15,2),
    dias_inventario INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    dias_periodo INT;
BEGIN
    dias_periodo := p_fecha_fin - p_fecha_inicio + 1;
    IF dias_periodo <= 0 THEN dias_periodo := 1; END IF;

    RETURN QUERY
    WITH ventas_periodo AS (
        SELECT 'Almacén'::VARCHAR(20) as tipo, SUM(dvo.cantidad) as unidades_vendidas
        FROM detalle_venta_online dvo JOIN venta_online vo ON dvo.fk_venta_online = vo.clave WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        UNION ALL
        SELECT 'Tienda'::VARCHAR(20) as tipo, SUM(dvf.cantidad) as unidades_vendidas
        FROM detalle_venta_fisica dvf JOIN venta_tienda_fisica vf ON dvf.fk_venta_tienda_fisica = vf.clave WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ),
    inventario_promedio AS (
        SELECT 'Almacén'::VARCHAR(20) as tipo, AVG(a.cantidad_unidades) as stock_promedio, AVG(a.cantidad_unidades * p.precio) as valor_promedio
        FROM almacen a JOIN presentacion p ON a.fk_presentacion = p.clave
        GROUP BY tipo
        UNION ALL
        SELECT 'Tienda'::VARCHAR(20) as tipo, AVG(it.cantidad) as stock_promedio, AVG(it.cantidad * p.precio) as valor_promedio
        FROM inventario_tienda it JOIN presentacion p ON it.fk_presentacion = p.clave
        GROUP BY tipo
    )
    SELECT
        ip.tipo,
        COALESCE(CASE WHEN ip.stock_promedio > 0 THEN (vp.unidades_vendidas / ip.stock_promedio) ELSE 0 END, 0)::DECIMAL(10,2) as rotacion,
        COALESCE(ip.valor_promedio, 0)::DECIMAL(15,2) as valor_promedio,
        COALESCE(CASE WHEN vp.unidades_vendidas > 0 THEN (ip.stock_promedio / (vp.unidades_vendidas / dias_periodo)) ELSE 0 END, 0)::INT as dias
    FROM inventario_promedio ip
    LEFT JOIN ventas_periodo vp ON ip.tipo = vp.tipo;
END;
$$;

-- 7. Corregir obtener_tasa_ruptura_stock
DROP FUNCTION IF EXISTS obtener_tasa_ruptura_stock();
CREATE OR REPLACE FUNCTION obtener_tasa_ruptura_stock()
RETURNS TABLE (
    tipo_inventario VARCHAR(20),
    tasa_ruptura DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH stock_info AS (
        SELECT 'Almacén'::VARCHAR(20) as tipo, 
               SUM(CASE WHEN cantidad_unidades = 0 THEN 1 ELSE 0 END) as productos_sin_stock, 
               COUNT(*) as total_productos
        FROM almacen
        UNION ALL
        SELECT 'Tienda'::VARCHAR(20) as tipo, 
               SUM(CASE WHEN cantidad = 0 THEN 1 ELSE 0 END) as productos_sin_stock, 
               COUNT(*) as total_productos
        FROM inventario_tienda
    )
    SELECT 
        si.tipo,
        COALESCE(CASE WHEN si.total_productos > 0 THEN (si.productos_sin_stock::DECIMAL / si.total_productos * 100) ELSE 0 END, 0)::DECIMAL(5,2)
    FROM stock_info si;
END;
$$;

-- 8. Corregir obtener_ventas_por_empleado (schema incorrecto)
DROP FUNCTION IF EXISTS obtener_ventas_por_empleado(DATE, DATE);
CREATE OR REPLACE FUNCTION obtener_ventas_por_empleado(p_fecha_inicio DATE, p_fecha_fin DATE)
RETURNS TABLE (
    empleado_id VARCHAR(20),
    empleado_nombre TEXT,
    cargo VARCHAR(50),
    tienda VARCHAR(100),
    cantidad_ventas BIGINT,
    monto_total_ventas DECIMAL(15,2),
    ticket_promedio DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.ci::VARCHAR(20),
        (e.primer_nombre || ' ' || e.primer_apellido)::TEXT,
        c.nombre::VARCHAR(50),
        tf.nombre::VARCHAR(100),
        COUNT(vf.clave)::BIGINT,
        SUM(vf.total_venta)::DECIMAL(15,2),
        AVG(vf.total_venta)::DECIMAL(10,2)
    FROM venta_tienda_fisica vf
    JOIN tienda_fisica tf ON vf.fk_tienda_fisica = tf.clave
    JOIN departamento d ON d.fk_tienda_fisica = tf.clave
    JOIN contrato ct ON ct.fk_departamento = d.clave AND ct.fecha_fin IS NULL
    JOIN empleado e ON ct.fk_empleado = e.ci
    JOIN cargo c ON ct.fk_cargo = c.clave
    WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY e.ci, e.primer_nombre, e.primer_apellido, c.nombre, tf.nombre
    ORDER BY SUM(vf.total_venta) DESC;
END;
$$;

-- 9. Corregir reporte_ventas_por_canal (ambigüedad)
DROP FUNCTION IF EXISTS reporte_ventas_por_canal(DATE, DATE);
CREATE OR REPLACE FUNCTION reporte_ventas_por_canal(p_fecha_inicio DATE, p_fecha_fin DATE)
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
        SELECT 'Online' as canal, COUNT(vo.clave) as ventas, SUM(vo.monto_total) as monto FROM venta_online vo WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        UNION ALL
        SELECT 'Tienda Física' as canal, COUNT(vf.clave) as ventas, SUM(vf.total_venta) as monto FROM venta_tienda_fisica vf WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        UNION ALL
        SELECT 'Eventos' as canal, COUNT(ve.clave) as ventas, SUM(ve.monto_total) as monto FROM venta_evento ve WHERE ve.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ),
    total_general AS (
        SELECT SUM(vpc.monto) as total FROM ventas_por_canal vpc
    )
    SELECT 
        vpc.canal::VARCHAR(20),
        COALESCE(vpc.ventas, 0)::BIGINT,
        COALESCE(vpc.monto, 0)::DECIMAL(15,2),
        COALESCE(CASE WHEN tg.total > 0 THEN (vpc.monto / tg.total * 100) ELSE 0 END, 0)::DECIMAL(5,2)
    FROM ventas_por_canal vpc, total_general tg;
END;
$$;

-- Se eliminó la función 10 porque ya no estaba fallando en los logs.
DROP FUNCTION IF EXISTS reporte_tendencia_ventas(DATE, DATE);
CREATE OR REPLACE FUNCTION reporte_tendencia_ventas(p_fecha_inicio DATE, p_fecha_fin DATE)
RETURNS TABLE (
    fecha_venta DATE,
    total_ventas DECIMAL(15,2),
    cantidad_transacciones BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_diarias AS (
        SELECT fecha, SUM(monto_total) as monto_dia, COUNT(*) as transacciones_dia FROM venta_online WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin GROUP BY fecha
        UNION ALL
        SELECT fecha, SUM(total_venta) as monto_dia, COUNT(*) as transacciones_dia FROM venta_tienda_fisica WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin GROUP BY fecha
        UNION ALL
        SELECT fecha, SUM(monto_total) as monto_dia, COUNT(*) as transacciones_dia FROM venta_evento WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin GROUP BY fecha
    )
    SELECT 
        vd.fecha,
        SUM(vd.monto_dia)::DECIMAL(15,2),
        SUM(vd.transacciones_dia)::BIGINT
    FROM ventas_diarias vd
    GROUP BY vd.fecha
    ORDER BY vd.fecha;
END;
$$; 