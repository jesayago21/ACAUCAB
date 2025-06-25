const pool = require('../../../backend/config/db');

// Con fechas que vienen del front
/**
 * async function run(fechaInicio, fechaFin) {
  try {
    // Si no se pasan fechas, usa valores por defecto
    fechaInicio = fechaInicio || '2025-06-17';
    fechaFin = fechaFin || '2025-06-21';

 */

async function run(fechaIni, fechaFinal) {
  try {
    // Si no se pasan fechas, usa valores por defecto
    let fechaInicio = fechaIni;
    let fechaFin = fechaFinal;

    if (!fechaInicio) {
      const hoy = new Date();
      fechaInicio = hoy.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    }
    if (!fechaFin) {
      const fin = new Date(fechaInicio);
      fin.setDate(fin.getDate() + 7);
      fechaFin = fin.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    }

    // Consulta principal - Detalle por cliente
    const queryDetalle = `
      SELECT *
      FROM vw_puntos_canjeados_detalle
      WHERE primera_fecha_pago >= $1 AND ultima_fecha_pago <= $2
      ORDER BY total_bolivares DESC
    `;

    // Consulta resumen total
    const queryResumen = `
      SELECT *
      FROM vw_puntos_canjeados_resumen
      WHERE primera_fecha_pago >= $1 AND ultima_fecha_pago <= $2
    `;

    // Consulta por tipo de cliente
    const queryPorTipo = `
      SELECT *
      FROM vw_puntos_canjeados_por_tipo
      WHERE tipo_cliente IS NOT NULL
        AND tipo_cliente IN ('natural', 'juridico')
        AND EXISTS (
          SELECT 1
          FROM vw_puntos_canjeados_detalle d
          WHERE d.tipo_cliente = vw_puntos_canjeados_por_tipo.tipo_cliente
            AND d.primera_fecha_pago >= $1
            AND d.ultima_fecha_pago <= $2
        )
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