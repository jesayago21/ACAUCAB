// Se conecta a tu pool de PostgreSQL existente
const pool = require('../../../backend/config/db');

/**
 * Función principal que ejecuta las consultas y estructura los datos para el reporte de ingresos.
 */

/**
 * Prueba para pasar la fecha desde el front
 * async function run(fechaInicio, fechaFin) {
      try {
        // Si no se pasan fechas, usa valores por defecto
        fechaInicio = fechaInicio || '2025-06-01';
        fechaFin = fechaFin || '2025-07-01'; 
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

    console.log('🔄 Ejecutando consulta de ingresos por evento...');

    // --- CONSULTA CORREGIDA PARA MOSTRAR EVENTOS CON VENTAS EN EL RANGO ---
    const queryDetalle = `
      SELECT *
      FROM vw_venta_evento_entrada
      WHERE 
        (fecha_inicio BETWEEN $1 AND $2)
        AND (
          total_ingresos_entradas > 0
          OR total_ingresos_productos > 0
        )
      ORDER BY fecha_inicio DESC
    `;

    const detalleResult = await pool.query(queryDetalle, [fechaInicio, fechaFin]);
    console.log(`✅ Consulta completada. Se encontraron ${detalleResult.rows.length} eventos.`);

    // Procesar los datos de cada evento para añadir totales y formatear
    const detalle = detalleResult.rows.map(row => ({
      ...row,
      fecha_evento: new Date(row.fecha_inicio).toLocaleDateString('es-ES'),
      total_ingresos_entradas: parseFloat(row.total_ingresos_entradas || 0),
      total_ingresos_productos: parseFloat(row.total_ingresos_productos || 0),
      total_ingresos_evento: parseFloat(row.total_ingresos_entradas || 0) + parseFloat(row.total_ingresos_productos || 0),
      cantidad_entradas_vendidas: parseInt(row.cantidad_entradas_vendidas || 0),
      cantidad_ventas_productos: parseInt(row.cantidad_ventas_productos || 0),
      precio_entrada_formatted: row.precio_entrada ? `Bs. ${row.precio_entrada}` : 'Gratis'
    }));

    // Calcular el resumen general a partir de los detalles
    const resumen = detalle.reduce((acc, evento) => {
      acc.gran_total_entradas += evento.total_ingresos_entradas;
      acc.gran_total_productos += evento.total_ingresos_productos;
      acc.gran_total_general += evento.total_ingresos_evento;
      acc.total_entradas_vendidas += evento.cantidad_entradas_vendidas;
      acc.total_ventas_productos += evento.cantidad_ventas_productos;
      return acc;
    }, {
      gran_total_entradas: 0,
      gran_total_productos: 0,
      gran_total_general: 0,
      total_entradas_vendidas: 0,
      total_ventas_productos: 0,
      numero_eventos: detalle.length
    });

    return {
      detalle,
      resumen,
      fechaInicio: new Date(fechaInicio).toLocaleDateString('es-ES'),
      fechaFin: new Date(fechaFin).toLocaleDateString('es-ES'),
      fechaGeneracion: new Date().toLocaleDateString('es-ES'),
      horaGeneracion: new Date().toLocaleTimeString('es-ES')
    };

  } catch (error) {
    console.error('❌ Error ejecutando la consulta para el reporte de ingresos:', error);
    throw error;
  }
}

// Exportamos 'run' para que el script generador pueda llamarlo.
module.exports = { run };
