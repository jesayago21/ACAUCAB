/**
 * Controlador para operaciones específicas del ecommerce
 * Maneja ventas online, productos del almacén central y funcionalidades específicas de la tienda online
 */

const db = require('../config/db');

/**
 * Obtener productos disponibles para venta online desde el almacén central
 */
const obtenerProductosEcommerce = async (req, res) => {
    try {
        const {
            busqueda = '',
            tipo_cerveza = '',
            solo_con_oferta = false,
            limite = 20,
            offset = 0
        } = req.query;

        // Para ecommerce, no usamos tienda_id (null) para que use el almacén central
        const query = `
            SELECT * FROM obtener_productos_disponibles_ecommerce(
                $1::TEXT, -- busqueda
                $2::TEXT, -- tipo_cerveza
                $3::BOOLEAN, -- solo_con_oferta
                $4::INT, -- limite
                $5::INT -- offset
            )
        `;

        const result = await db.query(query, [
            busqueda || null,
            tipo_cerveza || null,
            solo_con_oferta,
            parseInt(limite),
            parseInt(offset)
        ]);

        res.json({
            success: true,
            productos: result.rows,
            total: result.rows.length
        });
    } catch (error) {
        console.error('Error obteniendo productos para ecommerce:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

/**
 * Obtener métodos de pago válidos para ecommerce (solo tarjetas y puntos)
 */
const obtenerMetodosPagoEcommerce = async (req, res) => {
    try {
        const { cliente_id } = req.params;

        if (!cliente_id) {
            return res.status(400).json({
                success: false,
                message: 'ID de cliente requerido'
            });
        }

        // Solo obtener tarjetas (crédito) y puntos para ecommerce
        const query = `
            SELECT 
                mp.clave as id,
                mp.tipo,
                mp.moneda,
                mp.banco,
                mp.numero_tarjeta,
                mp.fecha_vencimiento,
                mp.metodo_preferido
            FROM metodo_de_pago mp
            WHERE mp.fk_cliente = $1 
              AND mp.tipo IN ('Tarjeta de credito', 'Puntos')
              AND mp.metodo_preferido = true
            ORDER BY mp.tipo, mp.clave DESC
        `;

        const result = await db.query(query, [cliente_id]);

        res.json({
            success: true,
            metodos_pago: result.rows
        });
    } catch (error) {
        console.error('Error obteniendo métodos de pago para ecommerce:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

/**
 * Validar stock disponible en almacén central para venta online
 */
const validarStockEcommerce = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({
                success: false,
                message: 'Lista de items requerida'
            });
        }

        const query = `
            SELECT * FROM validar_stock_online($1::JSON)
        `;

        const result = await db.query(query, [JSON.stringify(items)]);

        const stockInsuficiente = result.rows.filter(row => !row.stock_suficiente);

        res.json({
            success: true,
            validacion: result.rows,
            stock_suficiente: stockInsuficiente.length === 0,
            productos_sin_stock: stockInsuficiente
        });
    } catch (error) {
        console.error('Error validando stock para ecommerce:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

/**
 * Crear venta online completa
 */
const crearVentaOnline = async (req, res) => {
    try {
        const {
            usuario_id,
            items,
            metodos_pago,
            direccion_envio,
            lugar_id
        } = req.body;

        // Validar datos requeridos
        if (!usuario_id || !items || !metodos_pago || !direccion_envio) {
            return res.status(400).json({
                success: false,
                message: 'Datos incompletos para crear la venta'
            });
        }

        // Validar que solo se usen métodos de pago permitidos para ecommerce
        const metodosPermitidos = ['Tarjeta de credito', 'Puntos'];
        const metodosInvalidos = metodos_pago.filter(mp => 
            !metodosPermitidos.includes(mp.tipo)
        );

        if (metodosInvalidos.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Para ecommerce solo se permiten tarjetas de crédito y puntos',
                metodos_invalidos: metodosInvalidos
            });
        }

        const query = `
            SELECT * FROM procesar_venta_online_completa(
                $1::INT, -- usuario_id
                $2::JSON, -- items
                $3::JSON, -- pagos
                $4::VARCHAR -- direccion_envio
            )
        `;

        const result = await db.query(query, [
            usuario_id,
            JSON.stringify(items),
            JSON.stringify(metodos_pago),
            direccion_envio
        ]);

        if (result.rows.length > 0) {
            const venta = result.rows[0];
            
            res.json({
                success: true,
                message: 'Venta online creada exitosamente',
                venta_id: venta.venta_id,
                resumen: {
                    subtotal: venta.monto_subtotal,
                    descuentos: venta.monto_descuentos,
                    envio: venta.costo_envio,
                    total: venta.monto_total,
                    estado: venta.estado
                }
            });
        } else {
            throw new Error('No se pudo crear la venta');
        }
    } catch (error) {
        console.error('Error creando venta online:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error interno del servidor'
        });
    }
};

/**
 * Obtener ofertas activas para ecommerce
 */
const obtenerOfertasActivas = async (req, res) => {
    try {
        const query = `SELECT * FROM obtener_ofertas_activas()`;
        const result = await db.query(query);

        res.json({
            success: true,
            ofertas: result.rows
        });
    } catch (error) {
        console.error('Error obteniendo ofertas activas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

/**
 * Calcular costo de envío
 */
const calcularCostoEnvio = async (req, res) => {
    try {
        const { lugar_id, monto_total } = req.body;

        if (!lugar_id || !monto_total) {
            return res.status(400).json({
                success: false,
                message: 'lugar_id y monto_total son requeridos'
            });
        }

        const query = `SELECT calcular_costo_envio($1::INT, $2::DECIMAL) as costo_envio`;
        const result = await db.query(query, [lugar_id, monto_total]);

        res.json({
            success: true,
            costo_envio: result.rows[0].costo_envio
        });
    } catch (error) {
        console.error('Error calculando costo de envío:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

/**
 * Obtener tracking de pedido
 */
const obtenerTrackingPedido = async (req, res) => {
    try {
        const { venta_id } = req.params;

        if (!venta_id) {
            return res.status(400).json({
                success: false,
                message: 'ID de venta requerido'
            });
        }

        const query = `SELECT * FROM obtener_tracking_envio($1::INT)`;
        const result = await db.query(query, [venta_id]);

        res.json({
            success: true,
            tracking: result.rows
        });
    } catch (error) {
        console.error('Error obteniendo tracking:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

/**
 * Actualizar estado de envío
 */
const actualizarEstadoEnvio = async (req, res) => {
    try {
        const { venta_id } = req.params;
        const { nuevo_estado, comentario } = req.body;

        if (!venta_id || !nuevo_estado) {
            return res.status(400).json({
                success: false,
                message: 'venta_id y nuevo_estado son requeridos'
            });
        }

        const query = `
            SELECT actualizar_estado_envio($1::INT, $2::VARCHAR, $3::TEXT) as actualizado
        `;
        
        const result = await db.query(query, [venta_id, nuevo_estado, comentario || null]);

        if (result.rows[0].actualizado) {
            res.json({
                success: true,
                message: 'Estado de envío actualizado exitosamente'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el estado'
            });
        }
    } catch (error) {
        console.error('Error actualizando estado de envío:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error interno del servidor'
        });
    }
};

/**
 * Obtener venta online completa con detalles
 */
const obtenerVentaOnlineCompleta = async (req, res) => {
    try {
        const { venta_id } = req.params;

        if (!venta_id) {
            return res.status(400).json({
                success: false,
                message: 'ID de venta requerido'
            });
        }

        const query = `SELECT obtener_venta_online_completa($1::INT) as venta_completa`;
        const result = await db.query(query, [venta_id]);

        if (result.rows.length > 0) {
            res.json({
                success: true,
                venta: result.rows[0].venta_completa
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }
    } catch (error) {
        console.error('Error obteniendo venta online completa:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    obtenerProductosEcommerce,
    obtenerMetodosPagoEcommerce,
    validarStockEcommerce,
    crearVentaOnline,
    obtenerOfertasActivas,
    calcularCostoEnvio,
    obtenerTrackingPedido,
    actualizarEstadoEnvio,
    obtenerVentaOnlineCompleta
}; 