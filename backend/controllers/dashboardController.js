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

    // Calcular fechas para el período anterior
    const fechaInicioActual = new Date(fecha_inicio);
    const fechaFinActual = new Date(fecha_fin);
    const dias_periodo = Math.round((fechaFinActual - fechaInicioActual) / (1000 * 60 * 60 * 24)) + 1;
    
    const fechaInicioAnterior = new Date(fechaInicioActual);
    fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - dias_periodo);
    
    const fechaFinAnterior = new Date(fechaFinActual);
    fechaFinAnterior.setDate(fechaFinAnterior.getDate() - dias_periodo);

    const fecha_inicio_actual = fechaInicioActual.toISOString().split('T')[0];
    const fecha_fin_actual = fechaFinActual.toISOString().split('T')[0];
    const fecha_inicio_anterior = fechaInicioAnterior.toISOString().split('T')[0];
    const fecha_fin_anterior = fechaFinAnterior.toISOString().split('T')[0];

    console.log('Dashboard completo - Fechas calculadas:', {
      diasPeriodo: dias_periodo,
      fechaInicioAnterior: fecha_inicio_anterior,
      fechaFinAnterior: fecha_fin_anterior
    });

    const data = {};
    const errors = [];

    const executeQuery = async (name, query, params, isSingleResult = false) => {
        try {
            console.log(`Ejecutando ${name}...`);
            const result = await pool.query(query, params);
            data[name] = isSingleResult ? (result.rows[0] || {}) : result.rows;
            console.log(`✅ ${name} completado.`);
        } catch (error) {
            console.error(`❌ Error en ${name}:`, error.message);
            errors.push({ function: name, error: error.message });
            data[name] = isSingleResult ? {} : [];
        }
    };

    try {
        await executeQuery('ventas_totales', 'SELECT * FROM obtener_ventas_totales($1, $2)', [fecha_inicio, fecha_fin]);
        await executeQuery('crecimiento_ventas', 'SELECT * FROM obtener_crecimiento_ventas($1, $2, $3, $4)', [fecha_inicio_actual, fecha_fin_actual, fecha_inicio_anterior, fecha_fin_anterior], true);
        await executeQuery('ticket_promedio', 'SELECT * FROM calcular_ticket_promedio($1, $2)', [fecha_inicio, fecha_fin]);
        await executeQuery('ventas_por_estilo', 'SELECT * FROM obtener_ventas_por_estilo_cerveza($1, $2)', [fecha_inicio, fecha_fin]);
        await executeQuery('volumen_unidades', 'SELECT * FROM obtener_volumen_unidades_vendidas($1, $2)', [fecha_inicio, fecha_fin]);
        await executeQuery('clientes_nuevos_vs_recurrentes', 'SELECT * FROM obtener_clientes_nuevos_vs_recurrentes($1, $2)', [fecha_inicio, fecha_fin]);
        await executeQuery('tasa_retencion', 'SELECT * FROM calcular_tasa_retencion_clientes($1, $2)', [fecha_inicio, fecha_fin], true);
        await executeQuery('rotacion_inventario', 'SELECT * FROM calcular_rotacion_inventario($1, $2)', [fecha_inicio, fecha_fin]);
        await executeQuery('tasa_ruptura_stock', 'SELECT * FROM obtener_tasa_ruptura_stock()', []);
        await executeQuery('ventas_por_empleado', 'SELECT * FROM obtener_ventas_por_empleado($1, $2)', [fecha_inicio, fecha_fin]);
        await executeQuery('ventas_por_canal', 'SELECT * FROM reporte_ventas_por_canal($1, $2)', [fecha_inicio, fecha_fin]);
        await executeQuery('tendencia_ventas', 'SELECT * FROM reporte_tendencia_ventas($1, $2)', [fecha_inicio, fecha_fin]);
        await executeQuery('mejores_productos', 'SELECT * FROM obtener_mejores_productos($1, $2)', [fecha_inicio, fecha_fin]);
        await executeQuery('inventario_actual', 'SELECT * FROM reporte_inventario_actual()', []);

        if (errors.length > 0) {
            console.warn('El dashboard se generó con algunos errores:', errors);
        }

        const dashboardData = {
            periodo: {
                fecha_inicio,
                fecha_fin,
                dias_periodo
            },
            indicadores_ventas: {
                ventas_totales: data.ventas_totales,
                crecimiento_ventas: data.crecimiento_ventas,
                ticket_promedio: data.ticket_promedio,
                ventas_por_estilo: data.ventas_por_estilo,
                volumen_unidades: data.volumen_unidades,
                ventas_por_canal: data.ventas_por_canal,
                tendencia_ventas: data.tendencia_ventas,
                mejores_productos: data.mejores_productos
            },
            indicadores_clientes: {
                clientes_nuevos_vs_recurrentes: data.clientes_nuevos_vs_recurrentes,
                tasa_retencion: data.tasa_retencion,
            },
            indicadores_inventario: {
                rotacion_inventario: data.rotacion_inventario,
                tasa_ruptura_stock: data.tasa_ruptura_stock,
                inventario_actual: data.inventario_actual
            },
            indicadores_operaciones: {
                ventas_por_empleado: data.ventas_por_empleado,
            },
        };

        res.json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error('Error al obtener dashboard completo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener dashboard completo',
            error: error.message
        });
    }
  } catch (error) {
    console.error('Error al obtener dashboard completo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener dashboard completo',
      error: error.message
    });
  }
};

// =============================================
// 4. NUEVO ENDPOINT PARA ESTADÍSTICAS DE ALMACÉN
// =============================================

// Obtener estadísticas del almacén central
const getEstadisticasAlmacen = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_estadisticas_almacen()');

    res.json({
      success: true,
      data: result.rows[0] || {
        total_productos: 0,
        stock_critico: 0,
        stock_bajo: 0,
        stock_normal: 0,
        stock_alto: 0,
        valor_total_inventario: 0,
        productos_sin_stock: 0
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del almacén:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del almacén',
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
  getEstadisticasAlmacen,
  
  // Reportes adicionales
  getVentasPorCanal,
  getInventarioActual,
  getTendenciaVentas,
  
  // Dashboard consolidado
  getDashboardCompleto
}; 