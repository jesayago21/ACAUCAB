const pool = require('../config/db');

// =============================================
// CONTROLADOR DE DASHBOARD
// =============================================

// 1. INDICADORES DE VENTAS
// ---------------------------------------------

// Obtener ventas totales por tipo de tienda
const getVentasTotales = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, tipo_tienda } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const result = await pool.query(
      'SELECT * FROM obtener_ventas_totales($1, $2, $3)',
      [fecha_inicio, fecha_fin, tipo_tienda || null]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener ventas totales:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas totales',
      error: error.message
    });
  }
};

// Obtener crecimiento de ventas
const getCrecimientoVentas = async (req, res) => {
  try {
    const { 
      fecha_inicio_actual, 
      fecha_fin_actual, 
      fecha_inicio_anterior, 
      fecha_fin_anterior 
    } = req.query;

    if (!fecha_inicio_actual || !fecha_fin_actual || !fecha_inicio_anterior || !fecha_fin_anterior) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren todas las fechas para comparar períodos'
      });
    }

    const result = await pool.query(
      'SELECT * FROM obtener_crecimiento_ventas($1, $2, $3, $4)',
      [fecha_inicio_actual, fecha_fin_actual, fecha_inicio_anterior, fecha_fin_anterior]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener crecimiento de ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener crecimiento de ventas',
      error: error.message
    });
  }
};

// Calcular ticket promedio
const getTicketPromedio = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const result = await pool.query(
      'SELECT * FROM calcular_ticket_promedio($1, $2)',
      [fecha_inicio, fecha_fin]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al calcular ticket promedio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al calcular ticket promedio',
      error: error.message
    });
  }
};

// Obtener volumen de unidades vendidas
const getVolumenUnidadesVendidas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const result = await pool.query(
      'SELECT * FROM obtener_volumen_unidades_vendidas($1, $2)',
      [fecha_inicio, fecha_fin]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener volumen de unidades vendidas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener volumen de unidades vendidas',
      error: error.message
    });
  }
};

// Obtener ventas por estilo de cerveza
const getVentasPorEstiloCerveza = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const result = await pool.query(
      'SELECT * FROM obtener_ventas_por_estilo_cerveza($1, $2)',
      [fecha_inicio, fecha_fin]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener ventas por estilo de cerveza:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas por estilo de cerveza',
      error: error.message
    });
  }
};

// 2. INDICADORES DE CLIENTES
// ---------------------------------------------

// Obtener clientes nuevos vs recurrentes
const getClientesNuevosVsRecurrentes = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const result = await pool.query(
      'SELECT * FROM obtener_clientes_nuevos_vs_recurrentes($1, $2)',
      [fecha_inicio, fecha_fin]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener clientes nuevos vs recurrentes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes nuevos vs recurrentes',
      error: error.message
    });
  }
};

// Calcular tasa de retención de clientes
const getTasaRetencionClientes = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const result = await pool.query(
      'SELECT * FROM calcular_tasa_retencion_clientes($1, $2)',
      [fecha_inicio, fecha_fin]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al calcular tasa de retención:', error);
    res.status(500).json({
      success: false,
      message: 'Error al calcular tasa de retención',
      error: error.message
    });
  }
};

// 3. INDICADORES DE INVENTARIO Y OPERACIONES
// ---------------------------------------------

// Calcular rotación de inventario
const getRotacionInventario = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const result = await pool.query(
      'SELECT * FROM calcular_rotacion_inventario($1, $2)',
      [fecha_inicio, fecha_fin]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al calcular rotación de inventario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al calcular rotación de inventario',
      error: error.message
    });
  }
};

// Obtener tasa de ruptura de stock
const getTasaRupturaStock = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_tasa_ruptura_stock()');

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener tasa de ruptura de stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tasa de ruptura de stock',
      error: error.message
    });
  }
};

// Obtener ventas por empleado
const getVentasPorEmpleado = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const result = await pool.query(
      'SELECT * FROM obtener_ventas_por_empleado($1, $2)',
      [fecha_inicio, fecha_fin]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener ventas por empleado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas por empleado',
      error: error.message
    });
  }
};

// 4. REPORTES ADICIONALES
// ---------------------------------------------

// Reporte de ventas por canal de distribución
const getVentasPorCanal = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const result = await pool.query(
      'SELECT * FROM reporte_ventas_por_canal($1, $2)',
      [fecha_inicio, fecha_fin]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener ventas por canal:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas por canal',
      error: error.message
    });
  }
};

// Reporte de inventario actual
const getInventarioActual = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reporte_inventario_actual()');

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener inventario actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener inventario actual',
      error: error.message
    });
  }
};

// Reporte de tendencia de ventas
const getTendenciaVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const result = await pool.query(
      'SELECT * FROM reporte_tendencia_ventas($1, $2)',
      [fecha_inicio, fecha_fin]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener tendencia de ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tendencia de ventas',
      error: error.message
    });
  }
};

// 5. DASHBOARD CONSOLIDADO
// ---------------------------------------------

// Obtener todos los indicadores del dashboard
const getDashboardCompleto = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    // Calcular fechas del período anterior para comparación
    const fechaInicio = new Date(fecha_inicio);
    const fechaFin = new Date(fecha_fin);
    const diasPeriodo = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
    
    const fechaInicioAnterior = new Date(fechaInicio);
    fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - diasPeriodo);
    
    const fechaFinAnterior = new Date(fechaInicio);
    fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1);

    // Ejecutar todas las consultas en paralelo
    const [
      ventasTotales,
      crecimientoVentas,
      ticketPromedio,
      volumenUnidades,
      ventasEstilo,
      clientesNuevos,
      tasaRetencion,
      rotacionInventario,
      rupturaStock,
      ventasEmpleado,
      ventasCanal,
      tendenciaVentas
    ] = await Promise.all([
      pool.query('SELECT * FROM obtener_ventas_totales($1, $2, $3)', [fecha_inicio, fecha_fin, null]),
      pool.query('SELECT * FROM obtener_crecimiento_ventas($1, $2, $3, $4)', [
        fecha_inicio, fecha_fin, 
        fechaInicioAnterior.toISOString().split('T')[0], 
        fechaFinAnterior.toISOString().split('T')[0]
      ]),
      pool.query('SELECT * FROM calcular_ticket_promedio($1, $2)', [fecha_inicio, fecha_fin]),
      pool.query('SELECT * FROM obtener_volumen_unidades_vendidas($1, $2)', [fecha_inicio, fecha_fin]),
      pool.query('SELECT * FROM obtener_ventas_por_estilo_cerveza($1, $2)', [fecha_inicio, fecha_fin]),
      pool.query('SELECT * FROM obtener_clientes_nuevos_vs_recurrentes($1, $2)', [fecha_inicio, fecha_fin]),
      pool.query('SELECT * FROM calcular_tasa_retencion_clientes($1, $2)', [fecha_inicio, fecha_fin]),
      pool.query('SELECT * FROM calcular_rotacion_inventario($1, $2)', [fecha_inicio, fecha_fin]),
      pool.query('SELECT * FROM obtener_tasa_ruptura_stock()'),
      pool.query('SELECT * FROM obtener_ventas_por_empleado($1, $2)', [fecha_inicio, fecha_fin]),
      pool.query('SELECT * FROM reporte_ventas_por_canal($1, $2)', [fecha_inicio, fecha_fin]),
      pool.query('SELECT * FROM reporte_tendencia_ventas($1, $2)', [fecha_inicio, fecha_fin])
    ]);

    res.json({
      success: true,
      data: {
        periodo: {
          fecha_inicio,
          fecha_fin,
          dias_periodo: diasPeriodo
        },
        indicadores_ventas: {
          ventas_totales: ventasTotales.rows,
          crecimiento_ventas: crecimientoVentas.rows[0],
          ticket_promedio: ticketPromedio.rows,
          volumen_unidades: volumenUnidades.rows,
          ventas_por_estilo: ventasEstilo.rows,
          ventas_por_canal: ventasCanal.rows,
          tendencia_ventas: tendenciaVentas.rows
        },
        indicadores_clientes: {
          clientes_nuevos_vs_recurrentes: clientesNuevos.rows,
          tasa_retencion: tasaRetencion.rows[0]
        },
        indicadores_inventario: {
          rotacion_inventario: rotacionInventario.rows,
          tasa_ruptura_stock: rupturaStock.rows
        },
        indicadores_operaciones: {
          ventas_por_empleado: ventasEmpleado.rows
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener dashboard completo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener dashboard completo',
      error: error.message
    });
  }
};

module.exports = {
  // Indicadores de ventas
  getVentasTotales,
  getCrecimientoVentas,
  getTicketPromedio,
  getVolumenUnidadesVendidas,
  getVentasPorEstiloCerveza,
  
  // Indicadores de clientes
  getClientesNuevosVsRecurrentes,
  getTasaRetencionClientes,
  
  // Indicadores de inventario y operaciones
  getRotacionInventario,
  getTasaRupturaStock,
  getVentasPorEmpleado,
  
  // Reportes adicionales
  getVentasPorCanal,
  getInventarioActual,
  getTendenciaVentas,
  
  // Dashboard consolidado
  getDashboardCompleto
}; 