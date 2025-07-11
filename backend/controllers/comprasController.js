const pool = require('../config/db');

// =============================================
// CONTROLADOR DE COMPRAS
// =============================================

// 1. Obtener todas las órdenes de compra
const getOrdenesCompra = async (req, res) => {
  try {
    const { 
      estado_filtro, 
      miembro_id, 
      limite = 50, 
      offset = 0 
    } = req.query;

    const result = await pool.query(
      'SELECT * FROM obtener_ordenes_compra($1, $2, $3, $4)',
      [estado_filtro || null, miembro_id || null, parseInt(limite), parseInt(offset)]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener órdenes de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener órdenes de compra',
      error: error.message
    });
  }
};

// 2. Obtener detalles de una orden de compra específica
const getDetalleOrdenCompra = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM obtener_detalle_orden_compra($1)',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden de compra no encontrada'
      });
    }

    // Agrupar los resultados por compra y detalles
    const compra = {
      clave: result.rows[0].compra_clave,
      fecha: result.rows[0].compra_fecha,
      monto_total: result.rows[0].compra_monto_total,
      miembro: {
        rif: result.rows[0].miembro_rif,
        nombre: result.rows[0].miembro_nombre
      },
      estado_actual: result.rows[0].estado_actual,
      fecha_estado: result.rows[0].fecha_estado,
      detalles: result.rows.map(row => ({
        clave: row.detalle_clave,
        almacen_clave: row.almacen_clave,
        presentacion_nombre: row.presentacion_nombre,
        cerveza_nombre: row.cerveza_nombre,
        cantidad: row.cantidad,
        precio_unitario: row.precio_unitario
      })).filter(detalle => detalle.clave) // Filtrar detalles nulos
    };

    res.json({
      success: true,
      data: compra
    });
  } catch (error) {
    console.error('Error al obtener detalle de orden de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener detalle de orden de compra',
      error: error.message
    });
  }
};

// 3. Crear nueva orden de compra
const createOrdenCompra = async (req, res) => {
  try {
    const { 
      miembro_rif, 
      almacen_id, 
      cantidad, 
      precio_unitario 
    } = req.body;

    // Validaciones
    if (!miembro_rif || !almacen_id || !cantidad || !precio_unitario) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (cantidad <= 0 || precio_unitario <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad y precio unitario deben ser mayores a 0'
      });
    }

    const result = await pool.query(
      'SELECT crear_orden_compra($1, $2, $3, $4)',
      [miembro_rif, almacen_id, cantidad, precio_unitario]
    );

    res.status(201).json({
      success: true,
      message: 'Orden de compra creada exitosamente',
      data: { compra_id: result.rows[0].crear_orden_compra }
    });
  } catch (error) {
    console.error('Error al crear orden de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear orden de compra',
      error: error.message
    });
  }
};

// 4. Cambiar estado de orden de compra
const cambiarEstadoOrdenCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevo_estado } = req.body;

    if (!nuevo_estado) {
      return res.status(400).json({
        success: false,
        message: 'El nuevo estado es requerido'
      });
    }

    // Validar estados permitidos
    const estadosPermitidos = ['emitida', 'procesando', 'listo para entrega', 'entregado'];
    if (!estadosPermitidos.includes(nuevo_estado)) {
      return res.status(400).json({
        success: false,
        message: `Estado no válido. Estados permitidos: ${estadosPermitidos.join(', ')}`
      });
    }

    const result = await pool.query(
      'SELECT cambiar_estado_orden_compra($1, $2)',
      [id, nuevo_estado]
    );

    if (!result.rows[0].cambiar_estado_orden_compra) {
      return res.status(404).json({
        success: false,
        message: 'Orden de compra no encontrada'
      });
    }

    res.json({
      success: true,
      message: `Estado cambiado a '${nuevo_estado}' exitosamente`
    });
  } catch (error) {
    console.error('Error al cambiar estado de orden de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado de orden de compra',
      error: error.message
    });
  }
};

// 5. Obtener estadísticas de compras
const getEstadisticasCompras = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_estadisticas_compras()');

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de compras:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de compras',
      error: error.message
    });
  }
};

// 6. Obtener miembros proveedores
const getMiembrosProveedores = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_miembros_proveedores()');

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener miembros proveedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener miembros proveedores',
      error: error.message
    });
  }
};

// 7. Obtener estados disponibles para compras
const getEstadosCompra = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_estados_compra()');

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener estados de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estados de compra',
      error: error.message
    });
  }
};

// 8. Obtener productos disponibles para compra (almacén)
const getProductosParaCompra = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.clave as almacen_id,
        p.clave as presentacion_id,
        p.nombre as presentacion_nombre,
        p.precio,
        c.nombre as cerveza_nombre,
        tc.nombre as tipo_cerveza,
        a.cantidad_unidades as stock_actual,
        m.rif as miembro_rif,
        m.razon_social as miembro_nombre,
        CASE 
          WHEN a.cantidad_unidades <= 100 THEN 'Crítico'
          WHEN a.cantidad_unidades <= 500 THEN 'Bajo'
          WHEN a.cantidad_unidades <= 1000 THEN 'Normal'
          ELSE 'Alto'
        END as nivel_stock
      FROM almacen a
      JOIN presentacion p ON a.fk_presentacion = p.clave
      JOIN cerveza c ON p.fk_cerveza = c.clave
      JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
      JOIN miembro m ON c.fk_miembro = m.rif
      ORDER BY a.cantidad_unidades ASC, c.nombre, p.nombre
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener productos para compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos para compra',
      error: error.message
    });
  }
};

// 9. Obtener historial de estados de una orden de compra
const getHistorialEstados = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        h.fecha,
        e.estado,
        h.comentario,
        'compra' as tipo_entidad
      FROM historico h
      JOIN estatus e ON h.fk_estatus = e.clave
      WHERE h.fk_compra = $1
      ORDER BY h.fecha DESC
    `, [id]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener historial de estados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial de estados',
      error: error.message
    });
  }
};

module.exports = {
  getOrdenesCompra,
  getDetalleOrdenCompra,
  createOrdenCompra,
  cambiarEstadoOrdenCompra,
  getEstadisticasCompras,
  getMiembrosProveedores,
  getEstadosCompra,
  getProductosParaCompra,
  getHistorialEstados
}; 