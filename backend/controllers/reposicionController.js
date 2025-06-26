const db = require('../config/db');

// Establecer el usuario actual en la sesión para los triggers
const setCurrentUser = async (userId) => {
    if (userId) {
        await db.query('SELECT establecer_usuario_actual($1)', [userId]);
    }
};

// Limpiar el usuario actual de la sesión
const clearCurrentUser = async () => {
    await db.query('SELECT limpiar_usuario_actual()');
};

// Obtener todas las reposiciones con detalles
const getAllReposiciones = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_reposiciones_con_detalles()');
        
        res.json({
            success: true,
            data: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Error al obtener reposiciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener reposiciones por tienda específica
const getReposicionesByTienda = async (req, res) => {
    try {
        const { tiendaId } = req.params;
        
        if (!tiendaId || isNaN(tiendaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tienda inválido'
            });
        }

        const result = await db.query('SELECT * FROM obtener_reposiciones_por_tienda($1)', [tiendaId]);
        
        res.json({
            success: true,
            data: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Error al obtener reposiciones por tienda:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener una reposición específica por ID
const getReposicionById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de reposición inválido'
            });
        }

        const result = await db.query('SELECT * FROM obtener_reposicion_por_id($1)', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reposición no encontrada'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al obtener reposición por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar estado de reposición
const updateEstadoReposicion = async (req, res) => {
    const { id } = req.params;
    const { estadoId, comentario } = req.body;
    const userId = req.user?.id || req.headers['x-user-id']; // Obtener desde middleware o header

    if (!userId) {
        // Este error ocurre si no se provee identificación del usuario.
        return res.status(401).json({ success: false, message: 'No autenticado. Usuario no identificado.' });
    }
    
    // El cliente de la base de datos para la transacción
    const client = await db.getClient();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        // Establecer el usuario actual para los triggers DENTRO de la transacción
        await client.query('SELECT establecer_usuario_actual($1)', [userId]);

        const result = await client.query(
            'SELECT actualizar_estado_reposicion($1, $2, $3)',
            [id, estadoId, comentario || null]
        );
        
        await client.query('COMMIT'); // Finalizar transacción

        res.json({
            success: true,
            message: 'Estado de reposición actualizado correctamente'
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Revertir en caso de error
        console.error('Error al actualizar estado de reposición:', error);
        
        // Si el error es una excepción de la base de datos (RAISE EXCEPTION)
        if (error.code === 'P0001') {
            return res.status(403).json({
                success: false,
                message: error.message // Enviar el mensaje del RAISE al frontend
            });
        }

        // Error genérico para otros casos
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar el estado.',
            error: error.message
        });
    } finally {
        // Limpiar el usuario y liberar el cliente de la pool
        try {
            await client.query('SELECT limpiar_usuario_actual()');
        } catch (cleanupError) {
            console.error('Error al limpiar usuario actual en la sesión de BD:', cleanupError);
        }
        client.release();
    }
};

// Crear reposición manual
const createReposicionManual = async (req, res) => {
    try {
        const { inventarioTiendaId, cantidad, comentario } = req.body;
        const userId = req.user?.id || req.headers['x-user-id']; // Obtener desde middleware o header

        if (!inventarioTiendaId || isNaN(inventarioTiendaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de inventario de tienda inválido'
            });
        }

        if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Cantidad inválida'
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Usuario no identificado'
            });
        }

        const result = await db.query(
            'SELECT crear_reposicion_manual($1, $2, $3, $4) as reposicion_id',
            [inventarioTiendaId, cantidad, userId, comentario || null]
        );

        const reposicionId = result.rows[0].reposicion_id;

        res.status(201).json({
            success: true,
            message: 'Reposición manual creada correctamente',
            data: { reposicionId }
        });
    } catch (error) {
        console.error('Error al crear reposición manual:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener jefes de pasillo por tienda
const getJefesPasilloPorTienda = async (req, res) => {
    try {
        const { tiendaId } = req.params;
        
        if (!tiendaId || isNaN(tiendaId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tienda inválido'
            });
        }

        const result = await db.query('SELECT * FROM obtener_jefes_pasillo_por_tienda($1)', [tiendaId]);
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener jefes de pasillo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener estadísticas de reposiciones
const getEstadisticasReposiciones = async (req, res) => {
    try {
        const { tiendaId } = req.query;
        
        const result = await db.query(
            'SELECT * FROM obtener_estadisticas_reposiciones($1)',
            [tiendaId || null]
        );
        
        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de reposiciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener estados disponibles para reposiciones
const getEstadosReposicion = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT clave, estado, aplicable_a FROM estatus WHERE aplicable_a = 'reposicion' ORDER BY clave"
        );
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener estados de reposición:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    getAllReposiciones,
    getReposicionesByTienda,
    getReposicionById,
    updateEstadoReposicion,
    createReposicionManual,
    getJefesPasilloPorTienda,
    getEstadisticasReposiciones,
    getEstadosReposicion
}; 