const pool = require('../config/db');

// =============================================
// CONTROLADOR DE EVENTOS
// =============================================

// 1. GESTIÓN DE TIPOS DE EVENTOS
// ---------------------------------------------

// Obtener todos los tipos de eventos
const getTiposEvento = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_tipos_evento()');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener tipos de evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tipos de evento',
      error: error.message
    });
  }
};

// Crear nuevo tipo de evento
const createTipoEvento = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del tipo de evento es requerido'
      });
    }

    const result = await pool.query(
      'SELECT * FROM crear_tipo_evento($1, $2)',
      [nombre, descripcion || null]
    );

    res.status(201).json({
      success: true,
      message: 'Tipo de evento creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear tipo de evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear tipo de evento',
      error: error.message
    });
  }
};

// Actualizar tipo de evento
const updateTipoEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del tipo de evento es requerido'
      });
    }

    const result = await pool.query(
      'SELECT * FROM actualizar_tipo_evento($1, $2, $3)',
      [id, nombre, descripcion || null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de evento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Tipo de evento actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar tipo de evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar tipo de evento',
      error: error.message
    });
  }
};

// Eliminar tipo de evento
const deleteTipoEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT eliminar_tipo_evento($1)',
      [id]
    );

    if (!result.rows[0].eliminar_tipo_evento) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de evento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Tipo de evento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar tipo de evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tipo de evento',
      error: error.message
    });
  }
};

// 2. GESTIÓN DE EVENTOS PRINCIPALES
// ---------------------------------------------

// Obtener todos los eventos con filtros
const getEventos = async (req, res) => {
  try {
    const { 
      fecha_inicio, 
      fecha_fin, 
      lugar_id, 
      tipo 
    } = req.query;

    const result = await pool.query(
      'SELECT * FROM obtener_todos_eventos($1, $2, $3, $4)',
      [
        fecha_inicio || null,
        fecha_fin || null,
        lugar_id || null,
        tipo || null
      ]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos',
      error: error.message
    });
  }
};

// Obtener evento por ID
const getEventoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM obtener_evento_por_id($1)',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener evento',
      error: error.message
    });
  }
};

// Crear nuevo evento
const createEvento = async (req, res) => {
  try {
    const {
      nombre,
      fecha_inicio,
      fecha_fin,
      direccion,
      precio_entrada,
      fk_evento,
      fk_lugar,
      fk_tipo_evento
    } = req.body;

    // Validaciones
    if (!nombre || !fecha_inicio || !fecha_fin || !direccion || !fk_lugar || !fk_tipo_evento) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    // Validar fechas
    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin'
      });
    }

    const result = await pool.query(
      'SELECT crear_evento($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        nombre,
        fecha_inicio,
        fecha_fin,
        direccion,
        precio_entrada || null,
        fk_evento || null,
        fk_lugar,
        fk_tipo_evento
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: { id: result.rows[0].crear_evento }
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear evento',
      error: error.message
    });
  }
};

// Actualizar evento
const updateEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      fecha_inicio,
      fecha_fin,
      direccion,
      precio_entrada,
      fk_evento,
      fk_lugar,
      fk_tipo_evento
    } = req.body;

    // Validaciones
    if (!nombre || !fecha_inicio || !fecha_fin || !direccion || !fk_lugar || !fk_tipo_evento) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    const result = await pool.query(
      'SELECT actualizar_evento($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        id,
        nombre,
        fecha_inicio,
        fecha_fin,
        direccion,
        precio_entrada || null,
        fk_evento || null,
        fk_lugar,
        fk_tipo_evento
      ]
    );

    if (!result.rows[0].actualizar_evento) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Evento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar evento',
      error: error.message
    });
  }
};

// Eliminar evento
const deleteEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT eliminar_evento($1)',
      [id]
    );

    if (!result.rows[0].eliminar_evento) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar evento',
      error: error.message
    });
  }
};

// Obtener eventos activos
const getEventosActivos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_eventos_activos()');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener eventos activos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos activos',
      error: error.message
    });
  }
};

// Obtener eventos próximos
const getEventosProximos = async (req, res) => {
  try {
    const { dias = 30 } = req.query;

    const result = await pool.query(
      'SELECT * FROM obtener_eventos_proximos($1)',
      [parseInt(dias)]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos próximos',
      error: error.message
    });
  }
};

// 3. GESTIÓN DE SUB-EVENTOS
// ---------------------------------------------

// Obtener sub-eventos de un evento
const getSubeventos = async (req, res) => {
  try {
    const { eventoId } = req.params;

    const result = await pool.query(
      'SELECT * FROM obtener_subeventos_por_evento($1)',
      [eventoId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener sub-eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener sub-eventos',
      error: error.message
    });
  }
};

// Crear sub-evento
const createSubevento = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const {
      nombre,
      fecha_inicio,
      fecha_fin,
      direccion,
      precio_entrada,
      fk_lugar,
      fk_tipo_evento
    } = req.body;

    const result = await pool.query(
      'SELECT crear_subevento($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        eventoId,
        nombre,
        fecha_inicio,
        fecha_fin,
        direccion,
        precio_entrada || null,
        fk_lugar,
        fk_tipo_evento
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Sub-evento creado exitosamente',
      data: { id: result.rows[0].crear_subevento }
    });
  } catch (error) {
    console.error('Error al crear sub-evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear sub-evento',
      error: error.message
    });
  }
};

// Actualizar sub-evento
const updateSubevento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      fecha_inicio,
      fecha_fin,
      direccion,
      precio_entrada,
      fk_lugar,
      fk_tipo_evento
    } = req.body;

    const result = await pool.query(
      'SELECT actualizar_subevento($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        id,
        nombre,
        fecha_inicio,
        fecha_fin,
        direccion,
        precio_entrada || null,
        fk_lugar,
        fk_tipo_evento
      ]
    );

    if (!result.rows[0].actualizar_subevento) {
      return res.status(404).json({
        success: false,
        message: 'Sub-evento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Sub-evento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar sub-evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar sub-evento',
      error: error.message
    });
  }
};

// Eliminar sub-evento
const deleteSubevento = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT eliminar_subevento($1)',
      [id]
    );

    if (!result.rows[0].eliminar_subevento) {
      return res.status(404).json({
        success: false,
        message: 'Sub-evento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Sub-evento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar sub-evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar sub-evento',
      error: error.message
    });
  }
};

// 4. GESTIÓN DE INVENTARIO DE EVENTOS
// ---------------------------------------------

// Obtener inventario de un evento
const getInventarioEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;

    const result = await pool.query(
      'SELECT * FROM obtener_inventario_evento($1)',
      [eventoId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener inventario del evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener inventario del evento',
      error: error.message
    });
  }
};

// Actualizar inventario de evento
const updateInventarioEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { presentacion_id, cantidad } = req.body;

    if (!presentacion_id || cantidad === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere presentacion_id y cantidad'
      });
    }

    const result = await pool.query(
      'SELECT actualizar_inventario_evento($1, $2, $3)',
      [eventoId, presentacion_id, cantidad]
    );

    res.json({
      success: true,
      message: 'Inventario actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar inventario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar inventario',
      error: error.message
    });
  }
};

// Transferir inventario a evento
const transferirInventarioEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { almacen_id, cantidad } = req.body;

    if (!almacen_id || !cantidad) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere almacen_id y cantidad'
      });
    }

    const result = await pool.query(
      'SELECT transferir_inventario_a_evento($1, $2, $3)',
      [almacen_id, eventoId, cantidad]
    );

    res.json({
      success: true,
      message: 'Inventario transferido exitosamente'
    });
  } catch (error) {
    console.error('Error al transferir inventario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al transferir inventario',
      error: error.message
    });
  }
};

// 5. GESTIÓN DE ASISTENCIA Y PARTICIPANTES
// ---------------------------------------------

// Registrar asistencia
const registrarAsistencia = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { cliente_id } = req.body;

    if (!cliente_id) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere cliente_id'
      });
    }

    const result = await pool.query(
      'SELECT registrar_asistencia_evento($1, $2)',
      [eventoId, cliente_id]
    );

    res.status(201).json({
      success: true,
      message: 'Asistencia registrada exitosamente',
      data: { asistencia_id: result.rows[0].registrar_asistencia_evento }
    });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar asistencia',
      error: error.message
    });
  }
};

// Obtener lista de asistentes para un evento
const getAsistentes = async (req, res) => {
  try {
    const { eventoId } = req.params;

    const result = await pool.query(
      'SELECT * FROM obtener_asistentes_evento($1::INT)',
      [eventoId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener asistentes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener asistentes',
      error: error.message
    });
  }
};

// Vender entrada
const venderEntrada = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { cliente_id, pagos } = req.body;

    if (!cliente_id || !pagos || !Array.isArray(pagos)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere cliente_id y array de pagos'
      });
    }

    const result = await pool.query(
      'SELECT vender_entrada_evento($1, $2, $3)',
      [eventoId, cliente_id, JSON.stringify(pagos)]
    );

    res.status(201).json({
      success: true,
      message: 'Entrada vendida exitosamente',
      data: { venta_id: result.rows[0].vender_entrada_evento }
    });
  } catch (error) {
    console.error('Error al vender entrada:', error);
    res.status(500).json({
      success: false,
      message: 'Error al vender entrada',
      error: error.message
    });
  }
};

// Obtener invitados
const getInvitados = async (req, res) => {
  try {
    const { eventoId } = req.params;

    const result = await pool.query(
      'SELECT * FROM obtener_invitados_evento($1)',
      [eventoId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener invitados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener invitados',
      error: error.message
    });
  }
};

// Agregar invitado
const agregarInvitado = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const {
      ci,
      rif,
      primer_nombre,
      primer_apellido,
      tipo_invitado_id
    } = req.body;

    if (!ci || !rif || !primer_nombre || !primer_apellido || !tipo_invitado_id) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    const result = await pool.query(
      'SELECT agregar_invitado_evento($1, $2, $3, $4, $5, $6)',
      [eventoId, ci, rif, primer_nombre, primer_apellido, tipo_invitado_id]
    );

    res.status(201).json({
      success: true,
      message: 'Invitado agregado exitosamente',
      data: { invitado_id: result.rows[0].agregar_invitado_evento }
    });
  } catch (error) {
    console.error('Error al agregar invitado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar invitado',
      error: error.message
    });
  }
};

// 7. ESTADÍSTICAS Y REPORTES DE EVENTOS
// ---------------------------------------------

// Obtener estadísticas de ventas de entradas por evento
const getEstadisticasEntradas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const result = await pool.query(
      'SELECT * FROM obtener_estadisticas_venta_evento($1::DATE, $2::DATE)',
      [fecha_inicio || null, fecha_fin || null]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de entradas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de entradas',
      error: error.message
    });
  }
};

const getVentasByEvento = async (req, res) => {
  const { eventoId } = req.params;

  try {
    const query = 'SELECT * FROM obtener_ventas_por_evento($1)';
    const { rows } = await pool.query(query, [eventoId]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error(`Error al obtener ventas del evento ${eventoId}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las ventas del evento.',
      error: error.message
    });
  }
};


// =============================================
// 8. NUEVOS ENDPOINTS PARA INVITADOS
// =============================================

// Obtener tipos de invitado
const getTiposInvitado = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obtener_tipos_invitado()');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener tipos de invitado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tipos de invitado',
      error: error.message
    });
  }
};

// Registrar entrada de invitado
const registrarEntradaInvitado = async (req, res) => {
  try {
    const { eventoId, invitadoId } = req.params;

    const result = await pool.query(
      'SELECT registrar_entrada_invitado($1, $2)',
      [eventoId, invitadoId]
    );

    res.json({
      success: true,
      message: 'Entrada de invitado registrada exitosamente'
    });
  } catch (error) {
    console.error('Error al registrar entrada de invitado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar entrada de invitado',
      error: error.message
    });
  }
};

// Registrar salida de invitado
const registrarSalidaInvitado = async (req, res) => {
  try {
    const { eventoId, invitadoId } = req.params;

    const result = await pool.query(
      'SELECT registrar_salida_invitado($1, $2)',
      [eventoId, invitadoId]
    );

    res.json({
      success: true,
      message: 'Salida de invitado registrada exitosamente'
    });
  } catch (error) {
    console.error('Error al registrar salida de invitado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar salida de invitado',
      error: error.message
    });
  }
};

// Obtener estadísticas de invitados por evento
const getEstadisticasInvitados = async (req, res) => {
  try {
    const { eventoId } = req.params;

    const result = await pool.query(
      'SELECT * FROM obtener_estadisticas_invitados_evento($1)',
      [eventoId]
    );

    res.json({
      success: true,
      data: result.rows[0] || {
        total_invitados: 0,
        presentes: 0,
        pendientes: 0,
        salieron: 0,
        por_tipo: []
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de invitados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de invitados',
      error: error.message
    });
  }
};

// =============================================
// 9. NUEVOS ENDPOINTS PARA INVENTARIO DE EVENTOS
// =============================================

// Obtener estadísticas de inventario de evento
const getEstadisticasInventarioEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;

    const result = await pool.query(
      'SELECT * FROM obtener_estadisticas_inventario_evento($1)',
      [eventoId]
    );

    res.json({
      success: true,
      data: result.rows[0] || {
        total_productos: 0,
        stock_critico: 0,
        stock_bajo: 0,
        stock_normal: 0,
        stock_alto: 0,
        valor_total_inventario: 0
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de inventario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de inventario',
      error: error.message
    });
  }
};

// Obtener productos disponibles en almacén para transferencia
const getAlmacenDisponible = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM obtener_almacen_disponible_para_transferencia()'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener almacén disponible:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener almacén disponible',
      error: error.message
    });
  }
};

module.exports = {
  // Tipos de evento
  getTiposEvento,
  createTipoEvento,
  updateTipoEvento,
  deleteTipoEvento,
  
  // Eventos principales
  getEventos,
  getEventoById,
  createEvento,
  updateEvento,
  deleteEvento,
  getEventosActivos,
  getEventosProximos,
  
  // Sub-eventos
  getSubeventos,
  createSubevento,
  updateSubevento,
  deleteSubevento,
  
  // Inventario
  getInventarioEvento,
  updateInventarioEvento,
  transferirInventarioEvento,
  getEstadisticasInventarioEvento,
  getAlmacenDisponible,
  
  // Asistencia y participantes
  registrarAsistencia,
  getAsistentes,
  venderEntrada,
  getInvitados,
  agregarInvitado,
  getTiposInvitado,
  registrarEntradaInvitado,
  registrarSalidaInvitado,
  getEstadisticasInvitados,

  // Estadísticas
  getEstadisticasEntradas,
  getVentasByEvento
}; 