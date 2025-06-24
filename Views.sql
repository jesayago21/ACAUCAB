CREATE VIEW vista_recetas_tipo_cerveza AS
SELECT
    r.nombre AS "Nombre de la Receta",
    ir.numero_paso AS "Paso N°",
    i.descripcion AS "Instrucción del Paso",
    COALESCE(ing.nombre, 'N/A - Proceso') AS "Ingrediente Utilizado",
    ir.cantidad,
    ir.unidad_medida
FROM
    ing_rec AS ir
JOIN
    receta AS r ON ir.fk_receta = r.clave
JOIN
    instruccion AS i ON ir.fk_instruccion = i.clave
LEFT JOIN -- Usamos LEFT JOIN para incluir los pasos de proceso sin ingrediente (como maduración)
    ingrediente AS ing ON ir.fk_ingrediente = ing.clave
ORDER BY
    ir.numero_paso, ir.clave;


CREATE VIEW vista_horario_empleado AS
SELECT
    CONCAT(e.primer_nombre, ' ', e.primer_apellido) AS "Nombre del Empleado",
    c.clave AS "ID del Contrato",
    h.dia AS "Días del Horario",
    -- Usamos TO_CHAR para formatear la hora a un formato más legible
    TO_CHAR(h.fecha_hora_inicio, 'HH12:MI AM') AS "Hora de Inicio",
    TO_CHAR(h.fecha_hora_fin, 'HH12:MI AM') AS "Hora de Fin",
    CASE
        WHEN ch.horario_activo THEN 'Sí'
        ELSE 'No'
    END AS "Horario Activo en Contrato"
FROM
    con_hor AS ch
JOIN
    contrato AS c ON ch.fk_contrato = c.clave
JOIN
    empleado AS e ON c.fk_empleado = e.ci
JOIN
    horario AS h ON ch.fk_horario = h.clave
ORDER BY
    "Nombre del Empleado";

-- Vista para verificar la relación entre eventos y miembros (muchos a muchos)
CREATE VIEW v_eventos_miembros AS
SELECT 
    e.nombre AS nombre_evento,
    e.fecha_inicio,
    e.fecha_fin,
    m.razon_social AS nombre_miembro,
    em.descripcion_participacion
FROM evento e
JOIN eve_mie em ON e.clave = em.fk_evento
JOIN miembro m ON m.rif = em.fk_miembro;

-- Vista para verificar la relación entre características y tipos de cerveza (muchos a muchos)
CREATE VIEW v_caracteristicas_tipo_cerveza AS
SELECT 
    tc.nombre AS tipo_cerveza,
    c.nombre AS caracteristica,
    ct.valor,
    ct.rango_menor,
    ct.rango_mayor,
    ct.descripcion
FROM tipo_cerveza tc
JOIN car_tip ct ON tc.clave = ct.fk_tipo_cerveza
JOIN caracteristica c ON c.clave = ct.fk_caracteristica;

-- Vista para verificar la relación entre roles y privilegios (muchos a muchos)
CREATE VIEW v_roles_privilegios AS
SELECT 
    r.nombre AS rol,
    p.nombre AS privilegio,
    p.descripcion AS descripcion_privilegio,
    rp.fecha AS fecha_asignacion
FROM rol r
JOIN rol_pri rp ON r.clave = rp.fk_rol
JOIN privilegio p ON p.clave = rp.fk_privilegio;

-- Vista para verificar la relación entre empleados y beneficios (muchos a muchos)
CREATE VIEW v_empleados_beneficios AS
SELECT 
    e.primer_nombre || ' ' || e.primer_apellido AS nombre_empleado,
    e.ci,
    tb.nombre AS tipo_beneficio,
    eb.monto
FROM empleado e
JOIN emp_ben eb ON e.ci = eb.fk_empleado
JOIN tipo_beneficio tb ON tb.clave = eb.fk_tipo_beneficio;

-- Vista para verificar la relación entre invitados y eventos (muchos a muchos)
CREATE VIEW v_invitados_eventos AS
SELECT 
    i.primer_nombre || ' ' || i.primer_apellido AS nombre_invitado,
    ti.nombre AS tipo_invitado,
    e.nombre AS nombre_evento,
    ie.fecha_hora_entrada,
    ie.fecha_hora_salida
FROM invitado i
JOIN inv_eve ie ON i.ci = ie.fk_invitado
JOIN evento e ON e.clave = ie.fk_evento
JOIN tipo_invitado ti ON ti.clave = i.fk_tipo_invitado;

-- Vista para verificar la relación entre contratos y horarios (muchos a muchos)
CREATE VIEW v_contratos_horarios AS
SELECT 
    e.primer_nombre || ' ' || e.primer_apellido AS nombre_empleado,
    c.fecha_inicio AS inicio_contrato,
    c.fecha_fin AS fin_contrato,
    h.dia,
    h.fecha_hora_inicio,
    h.fecha_hora_fin,
    ch.horario_activo
FROM contrato c
JOIN con_hor ch ON c.clave = ch.fk_contrato
JOIN horario h ON h.clave = ch.fk_horario
JOIN empleado e ON e.ci = c.fk_empleado;

-- Vista para verificar las características de las cervezas
CREATE VIEW v_caracteristicas_cerveza AS
SELECT 
    c.nombre AS cerveza,
    c.grado_alcohol,
    car.nombre AS caracteristica,
    cc.valor,
    cc.descripcion,
    m.razon_social AS miembro_productor
FROM cerveza c
JOIN car_cer cc ON c.clave = cc.fk_cerveza
JOIN caracteristica car ON car.clave = cc.fk_caracteristica
JOIN miembro m ON m.rif = c.fk_miembro;

-- Vista para verificar el inventario completo
CREATE VIEW v_inventario_completo AS
SELECT 
    c.nombre AS cerveza,
    p.nombre AS presentacion,
    p.cantidad_unidades AS unidades_por_presentacion,
    a.cantidad_unidades AS cantidad_en_almacen,
    m.razon_social AS productor
FROM almacen a
JOIN presentacion p ON p.clave = a.fk_presentacion
JOIN cerveza c ON c.clave = p.fk_cerveza
JOIN miembro m ON m.rif = c.fk_miembro;

-- Vista para verificar las ventas online con sus detalles
CREATE VIEW v_ventas_online_detalladas AS
SELECT 
    vo.fecha,
    vo.monto_total,
    c.nombre AS cerveza,
    p.nombre AS presentacion,
    dvo.cantidad,
    dvo.precio_unitario,
    u.username AS comprador,
    vo.direccion_envio
FROM venta_online vo
JOIN detalle_venta_online dvo ON vo.clave = dvo.fk_venta_online
JOIN almacen a ON a.clave = dvo.fk_almacen
JOIN presentacion p ON p.clave = a.fk_presentacion
JOIN cerveza c ON c.clave = p.fk_cerveza
JOIN usuario u ON u.clave = vo.fk_usuario;

-- Vista para verificar los pagos y métodos de pago
CREATE VIEW v_pagos_detallados AS
SELECT 
    p.fecha_pago,
    p.monto_total,
    mp.tipo AS tipo_pago,
    mp.moneda,
    tc.monto_equivalencia AS tasa_cambio,
    CASE 
        WHEN p.fk_venta_tienda_fisica IS NOT NULL THEN 'Venta Física'
        WHEN p.fk_venta_online IS NOT NULL THEN 'Venta Online'
        WHEN p.fk_venta_evento IS NOT NULL THEN 'Venta Evento'
        WHEN p.fk_venta_entrada IS NOT NULL THEN 'Venta Entrada'
        WHEN p.fk_cuota IS NOT NULL THEN 'Cuota'
    END AS tipo_transaccion
FROM pago p
JOIN metodo_de_pago mp ON mp.clave = p.fk_metodo_de_pago
JOIN tasa_cambio tc ON tc.clave = p.fk_tasa_cambio;

CREATE VIEW v_historial_pagos AS
SELECT
    h.clave AS "ID Historial",
    h.fecha AS "Fecha del Evento",
    e.estado AS "Estado Asignado",
    -- Usamos CASE para identificar a qué entidad pertenece el registro del historial.
    CASE
        WHEN h.fk_compra IS NOT NULL THEN 'Orden de Compra'
        WHEN h.fk_reposicion IS NOT NULL THEN 'Orden de Reposición'
        WHEN h.fk_cuota IS NOT NULL THEN 'Cuota de Afiliación'
        WHEN h.fk_venta_online IS NOT NULL THEN 'Venta Online'
        ELSE 'Desconocido'
    END AS "Tipo de Entidad",
    -- Usamos COALESCE para mostrar el ID de la entidad afectada.
    COALESCE(h.fk_compra, h.fk_reposicion, h.fk_cuota, h.fk_venta_online) AS "ID de la Entidad"
FROM
    historico AS h
JOIN
    estatus AS e ON h.fk_estatus = e.clave
ORDER BY
    "Tipo de Entidad", "ID de la Entidad", h.fecha;


-- Vistas de los reportes
------------------------------------------------------------------------
-- Reporte 1: Puntos canjeados
CREATE OR REPLACE VIEW vw_puntos_canjeados_detalle AS
SELECT
  c.rif,
  COALESCE(c.razon_social, c.primer_nombre || ' ' || c.primer_apellido) AS cliente,
  c.tipo AS tipo_cliente,
  COUNT(p.clave) AS cantidad_pagos_puntos,
  SUM(p.monto_total) AS total_puntos_canjeados,
  SUM(p.monto_total * tc.monto_equivalencia) AS total_bolivares,
  MIN(p.fecha_pago) AS primera_fecha_pago,
  MAX(p.fecha_pago) AS ultima_fecha_pago
FROM pago p
JOIN metodo_de_pago md ON md.clave = p.fk_metodo_de_pago
JOIN tasa_cambio tc ON tc.clave = p.fk_tasa_cambio
JOIN venta_online v ON v.clave = p.fk_venta_online
JOIN usuario u ON u.clave = v.fk_usuario
JOIN cliente c ON c.clave = u.fk_cliente
WHERE
  md.tipo = 'Puntos'
  AND tc.moneda = 'PUNTOS'
  AND c.tipo IN ('natural', 'juridico')
GROUP BY c.rif, c.razon_social, c.primer_nombre, c.primer_apellido, c.tipo
HAVING SUM(p.monto_total) > 0;

CREATE OR REPLACE VIEW vw_puntos_canjeados_resumen AS
SELECT
  COUNT(DISTINCT c.rif) AS total_clientes_afiliados,
  COUNT(p.clave) AS total_pagos_puntos,
  SUM(
    CASE 
      WHEN md.tipo = 'Puntos' THEN p.monto_total
      ELSE 0
    END
  ) AS total_puntos_canjeados,
  SUM(
    CASE 
      WHEN md.tipo = 'Puntos' THEN p.monto_total * tc.monto_equivalencia
      ELSE 0
    END
  ) AS total_bolivares,
  MIN(p.fecha_pago) AS primera_fecha_pago,
  MAX(p.fecha_pago) AS ultima_fecha_pago
FROM pago p
JOIN metodo_de_pago md ON md.clave = p.fk_metodo_de_pago
JOIN tasa_cambio tc ON tc.clave = p.fk_tasa_cambio
JOIN venta_online v ON v.clave = p.fk_venta_online
JOIN usuario u ON u.clave = v.fk_usuario
JOIN cliente c ON c.clave = u.fk_cliente
WHERE
  md.tipo = 'Puntos'
  AND tc.moneda = 'PUNTOS'
  AND tc.fecha_inicio <= p.fecha_pago 
  AND (tc.fecha_fin IS NULL OR tc.fecha_fin >= p.fecha_pago)
  AND c.tipo IN ('natural', 'juridico');

  CREATE OR REPLACE VIEW vw_puntos_canjeados_por_tipo AS
SELECT
  c.tipo AS tipo_cliente,
  COUNT(DISTINCT c.rif) AS cantidad_clientes,
  SUM(
    CASE 
      WHEN md.tipo = 'Puntos' THEN p.monto_total
      ELSE 0
    END
  ) AS total_puntos_canjeados,
  SUM(
    CASE 
      WHEN md.tipo = 'Puntos' THEN p.monto_total * tc.monto_equivalencia
      ELSE 0
    END
  ) AS total_bolivares
FROM pago p
JOIN metodo_de_pago md ON md.clave = p.fk_metodo_de_pago
JOIN tasa_cambio tc ON tc.clave = p.fk_tasa_cambio
JOIN venta_online v ON v.clave = p.fk_venta_online
JOIN usuario u ON u.clave = v.fk_usuario
JOIN cliente c ON c.clave = u.fk_cliente
WHERE
  md.tipo = 'Puntos'
  AND tc.moneda = 'PUNTOS'
  AND tc.fecha_inicio <= p.fecha_pago 
  AND (tc.fecha_fin IS NULL OR tc.fecha_fin >= p.fecha_pago)
  AND c.tipo IN ('natural', 'juridico')
GROUP BY c.tipo;

-- Reporte 2: Ventas de eventos
CREATE OR REPLACE VIEW vw_venta_evento_entrada AS
SELECT
  e.clave AS id_evento,
  e.nombre AS nombre_evento,
  e.fecha_inicio,
  e.precio_entrada,
  COALESCE((
    SELECT SUM(ve.monto_total)
    FROM venta_entrada ve
    WHERE ve.fk_evento = e.clave
  ), 0) AS total_ingresos_entradas,
  COALESCE((
    SELECT SUM(ve.monto_total)
    FROM venta_evento ve
    WHERE ve.fk_evento = e.clave
  ), 0) AS total_ingresos_productos,
  COALESCE((
    SELECT COUNT(*)
    FROM venta_entrada ve
    WHERE ve.fk_evento = e.clave
  ), 0) AS cantidad_entradas_vendidas,
  COALESCE((
    SELECT COUNT(*)
    FROM venta_evento ve
    WHERE ve.fk_evento = e.clave
  ), 0) AS cantidad_ventas_productos
FROM evento e;
-- Reporte 3: Analisis IBU
CREATE OR REPLACE VIEW vw_analisis_ibu AS
SELECT 
    m.denominacion_comercial AS productor,
    c.nombre AS cerveza,
    tc.nombre AS tipo_cerveza,
    c.grado_alcohol,
    m.razon_social,
    m.direccion_fiscal,
    cc.valor AS ibu
FROM cerveza c
JOIN miembro m ON c.fk_miembro = m.rif
JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
LEFT JOIN car_cer cc ON cc.fk_cerveza = c.clave
LEFT JOIN caracteristica ca ON cc.fk_caracteristica = ca.clave
WHERE tc.clave IN (26, 39)  -- American Pale Ale (26) y American Amber Ale (39)
    AND (ca.nombre = 'Amargor (IBU)' OR ca.nombre IS NULL)
ORDER BY m.denominacion_comercial, tc.nombre, cc.valor DESC;

-- Reporte 4: Tiempo de entrega
CREATE OR REPLACE VIEW vw_tiempo_entrega_resumen AS
WITH tiempos_entrega AS (
    SELECT 
      vo.clave AS id_venta,
      vo.fecha AS fecha_venta,
      EXTRACT(DOW FROM vo.fecha) AS dia_semana,
      TO_CHAR(vo.fecha, 'Day') AS nombre_dia,
      -- Tiempo desde "listo para entrega" hasta "entregado"
      CASE 
        WHEN h_listo.fecha IS NOT NULL AND h_entregado.fecha IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (h_entregado.fecha - h_listo.fecha)) / 3600
        ELSE NULL
      END AS tiempo_entrega_horas,
      -- Tiempo desde "procesando" hasta "listo para entrega"
      CASE 
        WHEN h_procesando.fecha IS NOT NULL AND h_listo.fecha IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (h_listo.fecha - h_procesando.fecha)) / 3600
        ELSE NULL
      END AS tiempo_preparacion_horas,
      -- Tiempo total desde "procesando" hasta "entregado"
      CASE 
        WHEN h_procesando.fecha IS NOT NULL AND h_entregado.fecha IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (h_entregado.fecha - h_procesando.fecha)) / 3600
        ELSE NULL
      END AS tiempo_total_horas,
      vo.monto_total,
      u.username AS cliente
    FROM venta_online vo
    LEFT JOIN usuario u ON u.clave = vo.fk_usuario
    LEFT JOIN historico h_listo ON h_listo.fk_venta_online = vo.clave AND h_listo.fk_estatus = 8
    LEFT JOIN historico h_entregado ON h_entregado.fk_venta_online = vo.clave AND h_entregado.fk_estatus = 9
    LEFT JOIN historico h_procesando ON h_procesando.fk_venta_online = vo.clave AND h_procesando.fk_estatus = 7
    WHERE h_listo.fecha IS NOT NULL
)
SELECT 
  dia_semana,
  nombre_dia,
  COUNT(*) AS total_pedidos,
  COUNT(CASE WHEN tiempo_entrega_horas IS NOT NULL THEN 1 END) AS pedidos_entregados,
  ROUND(AVG(tiempo_entrega_horas)::numeric, 2) AS tiempo_entrega_promedio_horas,
  ROUND(AVG(tiempo_preparacion_horas)::numeric, 2) AS tiempo_preparacion_promedio_horas,
  ROUND(AVG(tiempo_total_horas)::numeric, 2) AS tiempo_total_promedio_horas,
  ROUND(MIN(tiempo_entrega_horas)::numeric, 2) AS tiempo_entrega_minimo_horas,
  ROUND(MAX(tiempo_entrega_horas)::numeric, 2) AS tiempo_entrega_maximo_horas,
  ROUND(SUM(monto_total)::numeric, 2) AS total_ventas_dia,
  MIN(fecha_venta) AS fecha_venta_min,
  MAX(fecha_venta) AS fecha_venta_max
FROM tiempos_entrega
GROUP BY dia_semana, nombre_dia
ORDER BY dia_semana;