// Se conecta a tu pool de PostgreSQL existente
const pool = require('../../../backend/config/db');

/**
 * Función principal que ejecuta las consultas y estructura los datos para el reporte de tiempo de entrega.
 * @param {string} fechaIni - Fecha de inicio en formato YYYY-MM-DD
 * @param {string} fechaFinal - Fecha de fin en formato YYYY-MM-DD
 */
async function run(fechaIni, fechaFinal) {
  try {
    // Validar y procesar las fechas
    let fechaInicio = fechaIni;
    let fechaFin = fechaFinal;
    let usandoFechasPorDefecto = false;

    console.log('📋 Parámetros recibidos:');
    console.log(`   • fechaIni: ${fechaIni || 'NO PROPORCIONADA'}`);
    console.log(`   • fechaFinal: ${fechaFinal || 'NO PROPORCIONADA'}`);

    // Si no se pasan fechas, usar valores por defecto (últimos 7 días)
    if (!fechaInicio || !fechaFin) {
      usandoFechasPorDefecto = true;
      const hoy = new Date();
      fechaInicio = hoy.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const fin = new Date(fechaInicio);
      fin.setDate(fin.getDate() + 7);
      fechaFin = fin.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      
      console.log('⚠️  Usando fechas por defecto (últimos 7 días)');
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

    console.log('🔄 Ejecutando consulta optimizada de tiempo de entrega...');
    console.log(`📅 Período: ${fechaInicio} a ${fechaFin}`);
    if (usandoFechasPorDefecto) {
      console.log('📅 Usando período por defecto (últimos 7 días)');
    } else {
      console.log('📅 Usando fechas proporcionadas como parámetros');
    }

    // --- CONSULTA OPTIMIZADA (UNA SOLA CONSULTA) ---
    const queryOptimizada = `
      SELECT * 
      FROM vw_tiempo_entrega_optimizada
      WHERE fecha_venta BETWEEN $1 AND $2 OR fecha_venta IS NULL
      ORDER BY tipo_dato, dia_semana, fecha_venta DESC
    `;

    const result = await pool.query(queryOptimizada, [fechaInicio, fechaFin]);
    console.log(`✅ Consulta optimizada completada. Se encontraron ${result.rows.length} registros.`);

    // Separar datos de resumen y detalle
    const resumenPorDia = result.rows
      .filter(row => row.tipo_dato === 'resumen')
      .map(row => ({
        ...row,
        nombre_dia: row.nombre_dia ? row.nombre_dia.trim() : 'Desconocido',
        tiempo_entrega_promedio_horas: parseFloat(row.tiempo_entrega_promedio_horas || 0),
        tiempo_preparacion_promedio_horas: parseFloat(row.tiempo_preparacion_promedio_horas || 0),
        tiempo_total_promedio_horas: parseFloat(row.tiempo_total_promedio_horas || 0),
        tiempo_entrega_minimo_horas: parseFloat(row.tiempo_entrega_minimo_horas || 0),
        tiempo_entrega_maximo_horas: parseFloat(row.tiempo_entrega_maximo_horas || 0),
        total_ventas_dia: parseFloat(row.total_ventas_dia || 0),
        total_pedidos: parseInt(row.total_pedidos || 0),
        pedidos_entregados: parseInt(row.pedidos_entregados || 0)
      }));

    const detallePedidos = result.rows
      .filter(row => row.tipo_dato === 'detalle')
      .slice(0, 100) // Limitar a 100 pedidos para el reporte
      .map(row => ({
        ...row,
        nombre_dia: row.nombre_dia ? row.nombre_dia.trim() : 'Desconocido',
        tiempo_entrega_horas: parseFloat(row.tiempo_entrega_horas || 0),
        tiempo_preparacion_horas: parseFloat(row.tiempo_preparacion_horas || 0),
        tiempo_total_horas: parseFloat(row.tiempo_total_horas || 0),
        monto_total: parseFloat(row.monto_total || 0),
        fecha_listo: row.fecha_listo ? new Date(row.fecha_listo).toLocaleString('es-ES') : 'N/A',
        fecha_entregado: row.fecha_entregado ? new Date(row.fecha_entregado).toLocaleString('es-ES') : 'N/A',
        fecha_procesando: row.fecha_procesando ? new Date(row.fecha_procesando).toLocaleString('es-ES') : 'N/A'
      }));

    // Calcular estadísticas generales
    const estadisticasGenerales = resumenPorDia.reduce((acc, dia) => {
      acc.total_pedidos += dia.total_pedidos;
      acc.total_pedidos_entregados += dia.pedidos_entregados;
      acc.total_ventas += dia.total_ventas_dia;
      
      if (dia.tiempo_entrega_promedio_horas > 0) {
        acc.tiempos_entrega.push(dia.tiempo_entrega_promedio_horas);
      }
      if (dia.tiempo_preparacion_promedio_horas > 0) {
        acc.tiempos_preparacion.push(dia.tiempo_preparacion_promedio_horas);
      }
      if (dia.tiempo_total_promedio_horas > 0) {
        acc.tiempos_total.push(dia.tiempo_total_promedio_horas);
      }
      
      return acc;
    }, {
      total_pedidos: 0,
      total_pedidos_entregados: 0,
      total_ventas: 0,
      tiempos_entrega: [],
      tiempos_preparacion: [],
      tiempos_total: []
    });

    // Calcular promedios generales
    const promedioEntregaGeneral = estadisticasGenerales.tiempos_entrega.length > 0 
      ? estadisticasGenerales.tiempos_entrega.reduce((a, b) => a + b, 0) / estadisticasGenerales.tiempos_entrega.length 
      : 0;
    
    const promedioPreparacionGeneral = estadisticasGenerales.tiempos_preparacion.length > 0 
      ? estadisticasGenerales.tiempos_preparacion.reduce((a, b) => a + b, 0) / estadisticasGenerales.tiempos_preparacion.length 
      : 0;
    
    const promedioTotalGeneral = estadisticasGenerales.tiempos_total.length > 0 
      ? estadisticasGenerales.tiempos_total.reduce((a, b) => a + b, 0) / estadisticasGenerales.tiempos_total.length 
      : 0;

    const resumen = {
      total_pedidos: estadisticasGenerales.total_pedidos,
      total_pedidos_entregados: estadisticasGenerales.total_pedidos_entregados,
      total_ventas: estadisticasGenerales.total_ventas,
      promedio_entrega_general: Math.round(promedioEntregaGeneral * 100) / 100,
      promedio_preparacion_general: Math.round(promedioPreparacionGeneral * 100) / 100,
      promedio_total_general: Math.round(promedioTotalGeneral * 100) / 100,
      porcentaje_entregados: estadisticasGenerales.total_pedidos > 0 
        ? Math.round((estadisticasGenerales.total_pedidos_entregados / estadisticasGenerales.total_pedidos) * 100) 
        : 0
    };

    console.log('📊 Datos procesados correctamente');
    console.log(`   • Total pedidos: ${resumen.total_pedidos}`);
    console.log(`   • Pedidos entregados: ${resumen.total_pedidos_entregados}`);
    console.log(`   • Tiempo promedio de entrega: ${resumen.promedio_entrega_general}h`);

    // Obtener fecha y hora actual en formato legible
    const ahora = new Date();
    const fechaGeneracion = ahora.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const horaGeneracion = ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return {
      resumenPorDia,
      detallePedidos,
      resumen,
      fechaInicio: new Date(fechaInicio).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      fechaFin: new Date(fechaFin).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      fechaGeneracion: fechaGeneracion,
      horaGeneracion: horaGeneracion,
      parametros: {
        fechaInicioOriginal: fechaInicio,
        fechaFinOriginal: fechaFin,
        usandoFechasPorDefecto: usandoFechasPorDefecto
      }
    };

  } catch (error) {
    console.error('❌ Error ejecutando la consulta para el reporte de tiempo de entrega:', error);
    throw new Error(`Error en reporte de tiempo de entrega: ${error.message}`);
  }
}

// Exportamos 'run' para que el script generador pueda llamarlo.
module.exports = { run }; 