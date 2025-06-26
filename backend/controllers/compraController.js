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

// Obtener todas las órdenes de compra con detalles
const getAllCompras = async (req, res) => {
    try {
        const { estado, miembro_id, limite = 50, offset = 0 } = req.query;
        
        const result = await db.query(
            'SELECT * FROM obtener_ordenes_compra($1, $2, $3, $4)',
            [estado || null, miembro_id || null, parseInt(limite), parseInt(offset)]
        );
        
        res.json({
            success: true,
            data: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Error al obtener órdenes de compra:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener órdenes de compra por proveedor específico
const getComprasByProveedor = async (req, res) => {
    try {
        const { proveedorId } = req.params;
        
        if (!proveedorId || isNaN(proveedorId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de proveedor inválido'
            });
        }

        const result = await db.query(
            'SELECT * FROM obtener_ordenes_compra(NULL, $1, 50, 0)',
            [proveedorId]
        );
        
        res.json({
            success: true,
            data: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Error al obtener órdenes por proveedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener una orden de compra específica por ID
const getCompraById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de orden de compra inválido'
            });
        }

        const result = await db.query('SELECT * FROM obtener_detalle_orden_compra($1)', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Orden de compra no encontrada'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al obtener orden de compra por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar estado de orden de compra
const updateEstadoCompra = async (req, res) => {
    const { id } = req.params;
    const { estadoId, comentario } = req.body;
    const userId = req.user?.id; // Asumimos que el middleware de auth añade el usuario a req

    if (!userId) {
        // Este error ocurre si el token no es válido o no se provee.
        return res.status(401).json({ success: false, message: 'No autenticado o token inválido.' });
    }
    
    // El cliente de la base de datos para la transacción
    const client = await db.getClient();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        // Establecer el usuario actual para los triggers DENTRO de la transacción
        await client.query('SELECT establecer_usuario_actual($1)', [userId]);

        const result = await client.query(
            'SELECT cambiar_estado_orden_compra($1, $2)',
            [id, estadoId]
        );
        
        await client.query('COMMIT'); // Finalizar transacción

        res.json({
            success: true,
            message: 'Estado de orden de compra actualizado correctamente'
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Revertir en caso de error
        console.error('Error al actualizar estado de orden de compra:', error);
        
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

// Crear orden de compra manual
const createCompraManual = async (req, res) => {
    try {
        const { miembro_rif, almacen_id, cantidad, precio_unitario, comentario } = req.body;
        const userId = req.user?.id;

        if (!miembro_rif || isNaN(miembro_rif)) {
            return res.status(400).json({
                success: false,
                message: 'RIF de miembro inválido'
            });
        }

        if (!almacen_id || isNaN(almacen_id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de almacén inválido'
            });
        }

        if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Cantidad inválida'
            });
        }

        if (!precio_unitario || isNaN(precio_unitario) || precio_unitario <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Precio unitario inválido'
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Usuario no identificado'
            });
        }

        const result = await db.query(
            'SELECT crear_orden_compra($1, $2, $3, $4) as compra_id',
            [miembro_rif, almacen_id, cantidad, precio_unitario]
        );

        const compraId = result.rows[0].compra_id;

        res.status(201).json({
            success: true,
            message: 'Orden de compra creada correctamente',
            data: { compraId }
        });
    } catch (error) {
        console.error('Error al crear orden de compra:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener proveedores disponibles
const getProveedoresPorCompra = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_miembros_proveedores()');
        
        res.json({
            success: true,
            data: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener estadísticas de compras
const getEstadisticasCompras = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_estadisticas_compras()');
        
        res.json({
            success: true,
            data: result.rows[0] || {
                total_ordenes: 0,
                ordenes_pendientes: 0,
                monto_total_mes: 0,
                productos_total: 0
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de compras:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener estados disponibles para compras
const getEstadosCompra = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_estados_compra()');
        
        res.json({
            success: true,
            data: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Error al obtener estados de compras:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    getAllCompras,
    getComprasByProveedor,
    getCompraById,
    updateEstadoCompra,
    createCompraManual,
    getProveedoresPorCompra,
    getEstadisticasCompras,
    getEstadosCompra
}; 