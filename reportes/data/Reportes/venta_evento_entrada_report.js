// Se conecta a tu pool de PostgreSQL existente
const pool = require('../../../backend/config/db');

/**
 * Función principal que ejecuta las consultas y estructura los datos para el reporte de ingresos.
 * @param {string} fechaIni - Fecha de inicio en formato YYYY-MM-DD
 * @param {string} fechaFinal - Fecha de fin en formato YYYY-MM-DD
 */
async function run(fechaIni, fechaFinal) {
  try {
    // Validar y procesar las fechas
    let fechaInicio = fechaIni;
    let fechaFin = fechaFinal;
    let usandoFechasPorDefecto = false;

    console.log('📋 Parámetros recibidos en reporte de eventos:');
    console.log(`   • fechaIni: ${fechaIni || 'NO PROPORCIONADA'}`);
    console.log(`   • fechaFinal: ${fechaFinal || 'NO PROPORCIONADA'}`);

    // Si no se pasan fechas, usar valores por defecto (últimos 30 días)
    if (!fechaInicio || !fechaFin) {
      usandoFechasPorDefecto = true;
      const hoy = new Date();
      fechaFin = hoy.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const inicio = new Date(fechaFin);
      inicio.setDate(inicio.getDate() - 30);
      fechaInicio = inicio.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      
      console.log('⚠️  Usando fechas por defecto (últimos 30 días)');
      console.log(`   • fechaInicio por defecto: ${fechaInicio}`);
      console.log(`   • fechaFin por defecto: ${fechaFin}`);
    }

    // Validar formato de fechas
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
      throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    // Validar que fecha inicio no sea mayor que fecha fin
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      throw new Error('La fecha de inicio no puede ser mayor que la fecha de fin');
    }

    console.log('🔄 Ejecutando consulta de ingresos por evento...');
    console.log(`📅 Período: ${fechaInicio} a ${fechaFin}`);
    if (usandoFechasPorDefecto) {
      console.log('📅 Usando período por defecto (últimos 30 días)');
    } else {
      console.log('📅 Usando fechas proporcionadas como parámetros');
    }

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

    // Calcular rankings y análisis de tendencias
    const top_eventos = [...detalle]
      .sort((a, b) => b.total_ingresos_evento - a.total_ingresos_evento)
      .slice(0, 5);

    const top_productos = [...detalle]
      .sort((a, b) => b.total_ingresos_productos - a.total_ingresos_productos)
      .slice(0, 5);

    // Análisis de tendencias
    const analisis_tendencias = {
      tipo_dominante: resumen.gran_total_entradas > resumen.gran_total_productos ? 'Entradas' : 'Productos',
      promedio_entradas_evento: resumen.numero_eventos > 0 ? Math.round(resumen.total_entradas_vendidas / resumen.numero_eventos) : 0,
      promedio_productos_evento: resumen.numero_eventos > 0 ? Math.round(resumen.total_ventas_productos / resumen.numero_eventos) : 0,
      participacion_entradas: resumen.gran_total_general > 0 ? Math.round((resumen.gran_total_entradas / resumen.gran_total_general) * 100) : 0
    };

    console.log('📊 Datos procesados correctamente');
    console.log(`   • Total eventos: ${resumen.numero_eventos}`);
    console.log(`   • Total ingresos: Bs. ${resumen.gran_total_general}`);

    return {
      detalle,
      resumen,
      top_eventos,
      top_productos,
      analisis_tendencias,
      fechaInicio: new Date(fechaInicio).toLocaleDateString('es-ES'),
      fechaFin: new Date(fechaFin).toLocaleDateString('es-ES'),
      fechaGeneracion: new Date().toLocaleDateString('es-ES'),
      horaGeneracion: new Date().toLocaleTimeString('es-ES'),
      parametros: {
        fechaInicioOriginal: fechaInicio,
        fechaFinOriginal: fechaFin,
        usandoFechasPorDefecto: usandoFechasPorDefecto
      }
    };

  } catch (error) {
    console.error('❌ Error ejecutando la consulta para el reporte de ingresos:', error);
    throw new Error(`Error en reporte de ventas de eventos: ${error.message}`);
  }
}

// Exportamos 'run' para que el script generador pueda llamarlo.
module.exports = { run };
