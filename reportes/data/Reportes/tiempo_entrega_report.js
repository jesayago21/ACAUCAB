// Se conecta a tu pool de PostgreSQL existente
const pool = require('../../../backend/config/db');

/**
 * Función principal que ejecuta las consultas y estructura los datos para el reporte de tiempo de entrega.
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

    console.log('🔄 Ejecutando consulta de tiempo de entrega de pedidos online...');

    // --- CONSULTA PARA CALCULAR TIEMPO DE ENTREGA ---
    const queryTiempoEntrega = `
      SELECT * 
      FROM fn_tiempo_entrega_resumen($1, $2)
      `;

    const tiempoEntregaResult = await pool.query(queryTiempoEntrega, [fechaInicio, fechaFin]);
    console.log(`✅ Consulta completada. Se encontraron datos para ${tiempoEntregaResult.rows.length} días de la semana.`);

    // --- CONSULTA PARA DETALLE DE PEDIDOS ---
    const queryDetallePedidos = `
      SELECT *
      FROM vw_tiempos_entrega_detalle
      WHERE fecha_venta BETWEEN $1 AND $2
`;

    const detallePedidosResult = await pool.query(queryDetallePedidos, [fechaInicio, fechaFin]);

    // Procesar los datos del resumen por día
    const resumenPorDia = tiempoEntregaResult.rows.map(row => ({
      ...row,
      nombre_dia: row.nombre_dia.trim(), // Limpiar espacios
      tiempo_entrega_promedio_horas: parseFloat(row.tiempo_entrega_promedio_horas || 0),
      tiempo_preparacion_promedio_horas: parseFloat(row.tiempo_preparacion_promedio_horas || 0),
      tiempo_total_promedio_horas: parseFloat(row.tiempo_total_promedio_horas || 0),
      tiempo_entrega_minimo_horas: parseFloat(row.tiempo_entrega_minimo_horas || 0),
      tiempo_entrega_maximo_horas: parseFloat(row.tiempo_entrega_maximo_horas || 0),
      total_ventas_dia: parseFloat(row.total_ventas_dia || 0),
      total_pedidos: parseInt(row.total_pedidos || 0),
      pedidos_entregados: parseInt(row.pedidos_entregados || 0)
    }));

    // Procesar los datos del detalle de pedidos
    const detallePedidos = detallePedidosResult.rows.map(row => ({
      ...row,
      nombre_dia: row.nombre_dia.trim(),
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

    return {
      resumenPorDia,
      detallePedidos,
      resumen,
      fechaInicio: new Date(fechaInicio).toLocaleDateString('es-ES'),
      fechaFin: new Date(fechaFin).toLocaleDateString('es-ES'),
      fechaGeneracion: new Date().toLocaleDateString('es-ES'),
      horaGeneracion: new Date().toLocaleTimeString('es-ES')
    };

  } catch (error) {
    console.error('❌ Error ejecutando la consulta para el reporte de tiempo de entrega:', error);
    throw error;
  }
}

// Exportamos 'run' para que el script generador pueda llamarlo.
module.exports = { run }; 