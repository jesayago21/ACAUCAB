const pool = require('../../../backend/config/db');

async function run() {
  try {
    // Parámetros del reporte (puedes modificar estas fechas)
    const fechaInicio = '2024-01-01';
    const fechaFin = '2024-12-31';

    // Consulta principal - Detalle por cliente
    const queryDetalle = `
      SELECT
        c.rif,
        COALESCE(c.razon_social, c.primer_nombre || ' ' || c.primer_apellido) AS cliente,
        c.tipo AS tipo_cliente,
        COUNT(p.clave) AS cantidad_pagos_puntos,
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
        AND p.fecha_pago BETWEEN $1 AND $2
        AND tc.fecha_inicio <= p.fecha_pago 
        AND (tc.fecha_fin IS NULL OR tc.fecha_fin >= p.fecha_pago)
        AND c.tipo IN ('natural', 'juridico')
      GROUP BY c.rif, c.razon_social, c.primer_nombre, c.primer_apellido, c.tipo
      HAVING SUM(
        CASE 
          WHEN md.tipo = 'Puntos' THEN p.monto_total
          ELSE 0
        END
      ) > 0
      ORDER BY total_bolivares DESC
    `;

    // Consulta resumen total
    const queryResumen = `
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
        AND p.fecha_pago BETWEEN $1 AND $2
        AND tc.fecha_inicio <= p.fecha_pago 
        AND (tc.fecha_fin IS NULL OR tc.fecha_fin >= p.fecha_pago)
        AND c.tipo IN ('natural', 'juridico')
    `;

    // Consulta por tipo de cliente
    const queryPorTipo = `
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
        AND p.fecha_pago BETWEEN $1 AND $2
        AND tc.fecha_inicio <= p.fecha_pago 
        AND (tc.fecha_fin IS NULL OR tc.fecha_fin >= p.fecha_pago)
        AND c.tipo IN ('natural', 'juridico')
      GROUP BY c.tipo
      ORDER BY total_bolivares DESC
    `;

    // Ejecutar consultas
    const detalleResult = await pool.query(queryDetalle, [fechaInicio, fechaFin]);
    const resumenResult = await pool.query(queryResumen, [fechaInicio, fechaFin]);
    const porTipoResult = await pool.query(queryPorTipo, [fechaInicio, fechaFin]);

    // Formatear datos para el reporte
    const detalle = detalleResult.rows.map(row => ({
      ...row,
      total_bolivares: parseFloat(row.total_bolivares || 0).toFixed(2),
      total_puntos_canjeados: parseInt(row.total_puntos_canjeados || 0),
      primera_fecha_pago: row.primera_fecha_pago ? new Date(row.primera_fecha_pago).toLocaleDateString('es-ES') : 'N/A',
      ultima_fecha_pago: row.ultima_fecha_pago ? new Date(row.ultima_fecha_pago).toLocaleDateString('es-ES') : 'N/A'
    }));

    const resumen = resumenResult.rows[0] ? {
      ...resumenResult.rows[0],
      total_bolivares: parseFloat(resumenResult.rows[0].total_bolivares || 0).toFixed(2),
      total_puntos_canjeados: parseInt(resumenResult.rows[0].total_puntos_canjeados || 0),
      primera_fecha_pago: resumenResult.rows[0].primera_fecha_pago ? new Date(resumenResult.rows[0].primera_fecha_pago).toLocaleDateString('es-ES') : 'N/A',
      ultima_fecha_pago: resumenResult.rows[0].ultima_fecha_pago ? new Date(resumenResult.rows[0].ultima_fecha_pago).toLocaleDateString('es-ES') : 'N/A'
    } : null;

    const porTipo = porTipoResult.rows.map(row => ({
      ...row,
      total_bolivares: parseFloat(row.total_bolivares || 0).toFixed(2),
      total_puntos_canjeados: parseInt(row.total_puntos_canjeados || 0),
      tipo_cliente_formatted: row.tipo_cliente === 'natural' ? 'cliente Natural' : 'cliente Jurídico'
    }));

    return {
      detalle,
      resumen,
      porTipo,
      fechaInicio: new Date(fechaInicio).toLocaleDateString('es-ES'),
      fechaFin: new Date(fechaFin).toLocaleDateString('es-ES'),
      fechaGeneracion: new Date().toLocaleDateString('es-ES'),
      horaGeneracion: new Date().toLocaleTimeString('es-ES')
    };

  } catch (error) {
    console.error('Error ejecutando consulta:', error);
    throw error;
  }
}

module.exports = { run };