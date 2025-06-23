// Se conecta a tu pool de PostgreSQL existente
const pool = require('../../../backend/config/db');

/**
 * Función principal que ejecuta las consultas y estructura los datos para el reporte de tiempo de entrega.
 */
async function run() {
  try {
    // --- PARÁMETROS DEL REPORTE ---
    // Estas fechas pueden ser sobrescritas por el script generador.
    const fechaInicio = '2025-06-01';
    const fechaFin = '2025-07-01';

    console.log('🔄 Ejecutando consulta de tiempo de entrega de pedidos online...');

    // --- CONSULTA PARA CALCULAR TIEMPO DE ENTREGA ---
    const queryTiempoEntrega = `
      WITH tiempos_entrega AS (
        SELECT 
          vo.clave AS id_venta,
          vo.fecha AS fecha_venta,
          EXTRACT(DOW FROM vo.fecha) AS dia_semana,
          TO_CHAR(vo.fecha, 'Day') AS nombre_dia,
          -- Tiempo desde "listo para entrega" hasta "entregado"
          CASE 
            WHEN h_listo.fecha IS NOT NULL AND h_entregado.fecha IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (h_entregado.fecha - h_listo.fecha)) / 3600 -- en horas
            ELSE NULL
          END AS tiempo_entrega_horas,
          -- Tiempo desde "procesando" hasta "listo para entrega"
          CASE 
            WHEN h_procesando.fecha IS NOT NULL AND h_listo.fecha IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (h_listo.fecha - h_procesando.fecha)) / 3600 -- en horas
            ELSE NULL
          END AS tiempo_preparacion_horas,
          -- Tiempo total desde "procesando" hasta "entregado"
          CASE 
            WHEN h_procesando.fecha IS NOT NULL AND h_entregado.fecha IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (h_entregado.fecha - h_procesando.fecha)) / 3600 -- en horas
            ELSE NULL
          END AS tiempo_total_horas,
          vo.monto_total,
          u.username AS cliente
        FROM venta_online vo
        LEFT JOIN usuario u ON u.clave = vo.fk_usuario
        -- Estado "listo para entrega" (estatus 8)
        LEFT JOIN historico h_listo ON h_listo.fk_venta_online = vo.clave 
          AND h_listo.fk_estatus = 8
        -- Estado "entregado" (estatus 9)
        LEFT JOIN historico h_entregado ON h_entregado.fk_venta_online = vo.clave 
          AND h_entregado.fk_estatus = 9
        -- Estado "procesando" (estatus 7)
        LEFT JOIN historico h_procesando ON h_procesando.fk_venta_online = vo.clave 
          AND h_procesando.fk_estatus = 7
        WHERE vo.fecha BETWEEN $1 AND $2
          AND h_listo.fecha IS NOT NULL -- Solo pedidos que llegaron a "listo para entrega"
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
        ROUND(SUM(monto_total)::numeric, 2) AS total_ventas_dia
      FROM tiempos_entrega
      GROUP BY dia_semana, nombre_dia
      ORDER BY dia_semana;
    `;

    const tiempoEntregaResult = await pool.query(queryTiempoEntrega, [fechaInicio, fechaFin]);
    console.log(`✅ Consulta completada. Se encontraron datos para ${tiempoEntregaResult.rows.length} días de la semana.`);

    // --- CONSULTA PARA DETALLE DE PEDIDOS ---
    const queryDetallePedidos = `
      WITH tiempos_entrega AS (
        SELECT 
          vo.clave AS id_venta,
          vo.fecha AS fecha_venta,
          EXTRACT(DOW FROM vo.fecha) AS dia_semana,
          TO_CHAR(vo.fecha, 'Day') AS nombre_dia,
          TO_CHAR(vo.fecha, 'DD/MM/YYYY') AS fecha_formateada,
          -- Tiempo desde "listo para entrega" hasta "entregado"
          CASE 
            WHEN h_listo.fecha IS NOT NULL AND h_entregado.fecha IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (h_entregado.fecha - h_listo.fecha)) / 3600 -- en horas
            ELSE NULL
          END AS tiempo_entrega_horas,
          -- Tiempo desde "procesando" hasta "listo para entrega"
          CASE 
            WHEN h_procesando.fecha IS NOT NULL AND h_listo.fecha IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (h_listo.fecha - h_procesando.fecha)) / 3600 -- en horas
            ELSE NULL
          END AS tiempo_preparacion_horas,
          -- Tiempo total desde "procesando" hasta "entregado"
          CASE 
            WHEN h_procesando.fecha IS NOT NULL AND h_entregado.fecha IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (h_entregado.fecha - h_procesando.fecha)) / 3600 -- en horas
            ELSE NULL
          END AS tiempo_total_horas,
          vo.monto_total,
          u.username AS cliente,
          h_listo.fecha AS fecha_listo,
          h_entregado.fecha AS fecha_entregado,
          h_procesando.fecha AS fecha_procesando
        FROM venta_online vo
        LEFT JOIN usuario u ON u.clave = vo.fk_usuario
        -- Estado "listo para entrega" (estatus 8)
        LEFT JOIN historico h_listo ON h_listo.fk_venta_online = vo.clave 
          AND h_listo.fk_estatus = 8
        -- Estado "entregado" (estatus 9)
        LEFT JOIN historico h_entregado ON h_entregado.fk_venta_online = vo.clave 
          AND h_entregado.fk_estatus = 9
        -- Estado "procesando" (estatus 7)
        LEFT JOIN historico h_procesando ON h_procesando.fk_venta_online = vo.clave 
          AND h_procesando.fk_estatus = 7
        WHERE vo.fecha BETWEEN $1 AND $2
          AND h_listo.fecha IS NOT NULL -- Solo pedidos que llegaron a "listo para entrega"
        ORDER BY vo.fecha DESC, vo.clave DESC
        LIMIT 50 -- Limitar a los últimos 50 pedidos para el detalle
      )
      SELECT * FROM tiempos_entrega;
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