const pool = require('../config/db');

// =============================================
// CONTROLADOR DE OFERTAS
// =============================================

// 1. Obtener ofertas activas
const getOfertasActivas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_ofertas_activas()');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener ofertas activas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ofertas activas',
      error: error.message
    });
  }
};

// 2. Crear nueva oferta
const createOferta = async (req, res) => {
  try {
    const { 
      presentacion_id, 
      porcentaje_descuento, 
      fecha_inicio, 
      fecha_fin 
    } = req.body;

    // Validaciones
    if (!presentacion_id || !porcentaje_descuento || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (porcentaje_descuento <= 0 || porcentaje_descuento >= 100) {
      return res.status(400).json({
        success: false,
        message: 'El porcentaje de descuento debe estar entre 1 y 99'
      });
    }

    if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin'
      });
    }

    const result = await pool.query(
      'SELECT crear_oferta($1, $2, $3, $4)',
      [presentacion_id, porcentaje_descuento, fecha_inicio, fecha_fin]
    );

    res.status(201).json({
      success: true,
      message: 'Oferta creada exitosamente',
      data: { oferta_id: result.rows[0].crear_oferta }
    });
  } catch (error) {
    console.error('Error al crear oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear oferta',
      error: error.message
    });
  }
};

// 3. Eliminar oferta
const deleteOferta = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT eliminar_oferta($1)',
      [id]
    );

    if (!result.rows[0].eliminar_oferta) {
      return res.status(404).json({
        success: false,
        message: 'Oferta no encontrada o no se puede eliminar'
      });
    }

    res.json({
      success: true,
      message: 'Oferta eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar oferta',
      error: error.message
    });
  }
};

// 4. Obtener historial de ofertas de una presentación
const getHistorialOfertas = async (req, res) => {
  try {
    const { presentacionId } = req.params;

    const result = await pool.query(
      'SELECT * FROM obtener_historial_ofertas($1)',
      [presentacionId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener historial de ofertas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial de ofertas',
      error: error.message
    });
  }
};

// 5. Validar si se puede crear una oferta para una presentación
const validarPeriodoOferta = async (req, res) => {
  try {
    const { presentacion_id, fecha_inicio } = req.query;

    if (!presentacion_id || !fecha_inicio) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere presentacion_id y fecha_inicio'
      });
    }

    const result = await pool.query(
      'SELECT validar_periodo_oferta_proc($1, $2)',
      [presentacion_id, fecha_inicio]
    );

    res.json({
      success: true,
      data: {
        puede_crear_oferta: result.rows[0].validar_periodo_oferta_proc,
        mensaje: result.rows[0].validar_periodo_oferta_proc 
          ? 'Se puede crear la oferta'
          : 'Debe esperar al menos 30 días después de la última oferta'
      }
    });
  } catch (error) {
    console.error('Error al validar período de oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar período de oferta',
      error: error.message
    });
  }
};

// 6. Obtener productos elegibles para ofertas
const getProductosElegibles = async (req, res) => {
  try {
    // Obtener productos que no tienen ofertas activas y que pueden tener ofertas
    const result = await pool.query(`
      SELECT DISTINCT 
        p.clave as presentacion_id,
        p.nombre as presentacion_nombre,
        p.precio,
        c.nombre as cerveza_nombre,
        tc.nombre as tipo_cerveza,
        m.razon_social as miembro,
        COALESCE(ultima_oferta.fecha_fin, '1900-01-01'::date) as ultima_oferta_fin,
        CASE 
          WHEN COALESCE(ultima_oferta.fecha_fin, '1900-01-01'::date) + INTERVAL '30 days' <= CURRENT_DATE 
          THEN true 
          ELSE false 
        END as puede_tener_oferta
      FROM presentacion p
      JOIN cerveza c ON p.fk_cerveza = c.clave
      JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
      JOIN miembro m ON c.fk_miembro = m.rif
      LEFT JOIN (
        SELECT 
          fk_presentacion,
          MAX(fecha_fin) as fecha_fin
        FROM oferta
        GROUP BY fk_presentacion
      ) ultima_oferta ON p.clave = ultima_oferta.fk_presentacion
      WHERE NOT EXISTS (
        SELECT 1 FROM oferta o 
        WHERE o.fk_presentacion = p.clave 
        AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin
      )
      ORDER BY c.nombre, p.nombre
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener productos elegibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos elegibles',
      error: error.message
    });
  }
};

// 7. Obtener estadísticas de ofertas
const getEstadisticasOfertas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const result = await pool.query(`
      WITH ofertas_periodo AS (
        SELECT 
          o.*,
          p.nombre as presentacion_nombre,
          p.precio as precio_original,
          ROUND(p.precio * (1 - o.porcentaje_descuento::DECIMAL / 100), 2) as precio_oferta
        FROM oferta o
        JOIN presentacion p ON o.fk_presentacion = p.clave
        WHERE ($1 IS NULL OR o.fecha_inicio >= $1::date)
          AND ($2 IS NULL OR o.fecha_fin <= $2::date)
      ),
      ventas_con_oferta AS (
        SELECT 
          op.clave as oferta_id,
          COUNT(DISTINCT COALESCE(dvo.clave, dvf.clave, dve.clave)) as total_ventas,
          SUM(
            COALESCE(dvo.cantidad * dvo.precio_unitario, 0) +
            COALESCE(dvf.cantidad * dvf.precio_unitario, 0) +
            COALESCE(dve.cantidad * dve.precio_unitario, 0)
          ) as ingresos_totales
        FROM ofertas_periodo op
        LEFT JOIN almacen a ON a.fk_presentacion = op.fk_presentacion
        LEFT JOIN detalle_venta_online dvo ON dvo.fk_almacen = a.clave
        LEFT JOIN venta_online vo ON dvo.fk_venta_online = vo.clave 
          AND vo.fecha BETWEEN op.fecha_inicio AND op.fecha_fin
        
        LEFT JOIN inventario_tienda it ON it.fk_presentacion = op.fk_presentacion
        LEFT JOIN detalle_venta_fisica dvf ON dvf.fk_inventario_tienda = it.clave
        LEFT JOIN venta_tienda_fisica vf ON dvf.fk_venta_tienda_fisica = vf.clave 
          AND vf.fecha BETWEEN op.fecha_inicio AND op.fecha_fin
        
        LEFT JOIN inventario_evento ie ON ie.fk_presentacion = op.fk_presentacion
        LEFT JOIN detalle_venta_evento dve ON dve.fk_inventario_evento = ie.clave
        LEFT JOIN venta_evento ve ON dve.fk_venta_evento = ve.clave 
          AND ve.fecha BETWEEN op.fecha_inicio AND op.fecha_fin
        
        GROUP BY op.clave
      )
      SELECT 
        COUNT(op.clave) as total_ofertas,
        COUNT(CASE WHEN CURRENT_DATE BETWEEN op.fecha_inicio AND op.fecha_fin THEN 1 END) as ofertas_activas,
        COUNT(CASE WHEN CURRENT_DATE > op.fecha_fin THEN 1 END) as ofertas_finalizadas,
        AVG(op.porcentaje_descuento) as descuento_promedio,
        SUM(COALESCE(vco.total_ventas, 0)) as ventas_totales_ofertas,
        SUM(COALESCE(vco.ingresos_totales, 0)) as ingresos_totales_ofertas
      FROM ofertas_periodo op
      LEFT JOIN ventas_con_oferta vco ON op.clave = vco.oferta_id
    `, [fecha_inicio || null, fecha_fin || null]);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de ofertas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de ofertas',
      error: error.message
    });
  }
};

module.exports = {
  getOfertasActivas,
  createOferta,
  deleteOferta,
  getHistorialOfertas,
  validarPeriodoOferta,
  getProductosElegibles,
  getEstadisticasOfertas
}; 