// Se conecta a tu pool de PostgreSQL existente
const pool = require('../../../backend/config/db');

/**
 * Función principal que ejecuta las consultas y estructura los datos para el reporte de ingresos.
 */
async function run() {
  try {
    // --- PARÁMETROS DEL REPORTE ---
    // Estas fechas pueden ser sobrescritas por el script generador.
    const fechaInicio = '2025-06-01';
    const fechaFin = '2025-07-01';

    console.log('🔄 Ejecutando consulta de ingresos por evento...');

    // --- ¡IMPORTANTE! ADAPTA ESTA CONSULTA A TU ESQUEMA DE BASE DE DATOS ---
    // Suposiciones del esquema:
    // - Tabla 'evento': Contiene información de los eventos (clave, nombre, fecha_evento).
    // - Tabla 'entrada': Registra cada entrada vendida (fk_evento, precio).
    // - Tabla 'venta_fisica': Registra ventas en un evento (fk_evento).
    // - Tabla 'detalle_venta_fisica': Detalle de productos vendidos (fk_venta_fisica, fk_producto, cantidad, precio).
    // - Tabla 'producto': Contiene los detalles de los productos (clave, nombre).
    const queryDetalle = `
      SELECT
        e.clave AS id_evento,
        e.nombre AS nombre_evento,
        e.fecha_inicio,

        -- Ingresos por entradas
        COALESCE((
            SELECT SUM(ve.monto_total)
            FROM venta_entrada ve
            WHERE ve.fk_evento = e.clave
        ), 0) AS total_ingresos_entradas,

        -- Ingresos por cervezas (inventario_evento y presentacion)
        COALESCE((
            SELECT SUM(ie.cantidad_unidades * p.precio)
            FROM inventario_evento ie
            JOIN presentacion p ON p.clave = ie.fk_presentacion
            WHERE ie.fk_evento = e.clave
          ), 0) AS total_ingresos_productos

      FROM evento e
      WHERE e.fecha_inicio BETWEEN $1 AND $2
      GROUP BY e.clave, e.nombre, e.fecha_inicio
      ORDER BY e.fecha_inicio DESC;
    `;

    const detalleResult = await pool.query(queryDetalle, [fechaInicio, fechaFin]);
    console.log(`✅ Consulta completada. Se encontraron ${detalleResult.rows.length} eventos.`);

    // Procesar los datos de cada evento para añadir totales y formatear
    const detalle = detalleResult.rows.map(row => ({
      ...row,
      fecha_evento: new Date(row.fecha_inicio).toLocaleDateString('es-ES'),
      total_ingresos_entradas: parseFloat(row.total_ingresos_entradas),
      total_ingresos_productos: parseFloat(row.total_ingresos_productos),
      total_ingresos_evento: parseFloat(row.total_ingresos_entradas) + parseFloat(row.total_ingresos_productos)
    }));

    // Calcular el resumen general a partir de los detalles (más eficiente que otra query)
    const resumen = detalle.reduce((acc, evento) => {
      acc.gran_total_entradas += evento.total_ingresos_entradas;
      acc.gran_total_productos += evento.total_ingresos_productos;
      acc.gran_total_general += evento.total_ingresos_evento;
      return acc;
    }, {
      gran_total_entradas: 0,
      gran_total_productos: 0,
      gran_total_general: 0,
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
