const db = require('../config/db');

/**
 * Obtener productos disponibles con filtros y paginación.
 */
const getAvailableProducts = async (req, res) => {
    const { tienda_id, busqueda, tipo, limite = 50, offset = 0, solo_ofertas = false } = req.query;
    
    try {
        console.log('🔍 Obteniendo productos con filtros:', {
            tienda_id: tienda_id || 'todas',
            busqueda: busqueda || 'sin filtro',
            tipo: tipo || 'todos',
            limite,
            offset,
            solo_ofertas
        });
        
        const { rows } = await db.query(
            'SELECT * FROM obtener_productos_disponibles($1, $2, $3, $4, $5, $6)',
            [
                tienda_id ? parseInt(tienda_id) : 1,  // Default a tienda 1
                busqueda || null, 
                tipo || null, 
                solo_ofertas === 'true', 
                parseInt(limite), 
                parseInt(offset)
            ]
        );
        
        console.log('📦 Productos encontrados:', rows.length);
        if (rows.length > 0) {
            console.log('📦 Primer producto de ejemplo:', rows[0]);
        }
        
        res.status(200).json({ success: true, productos: rows });
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

/**
 * Obtener métodos de pago favoritos de un cliente.
 */
const getClienteFavoritePaymentMethods = async (req, res) => {
    const { clienteId } = req.params;
    try {
        const { rows } = await db.query('SELECT * FROM obtener_metodos_pago_favoritos($1)', [clienteId]);
        res.status(200).json({ success: true, metodos: rows });
    } catch (error) {
        console.error('Error fetching favorite payment methods:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

/**
 * Crear una venta online.
 */
const createOnlineOrder = async (req, res) => {
    const { usuarioId, direccionEnvio, lugarId, items, metodosPago } = req.body;
    try {
        const result = await db.query(
            'SELECT crear_venta_online($1, $2, $3, $4::JSON, $5::JSON) as venta_id', [
            usuarioId, direccionEnvio, lugarId, JSON.stringify(items), JSON.stringify(metodosPago)
        ]);
        res.status(201).json({ success: true, message: 'Venta creada exitosamente.', venta_id: result.rows[0].venta_id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error al procesar la venta.', error: error.message });
    }
};

/**
 * Obtener todas las tiendas físicas.
 */
const getTiendasFisicas = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM obtener_tiendas_fisicas()');
        res.status(200).json({ success: true, tiendas: rows });
    } catch (error) {
        console.error('Error al obtener tiendas:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener la tasa de cambio actual para una moneda.
 */
const getTasaCambioActual = async (req, res) => {
    const { moneda } = req.query;
    try {
        const { rows } = await db.query('SELECT * FROM obtener_tasa_cambio($1)', [moneda]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontró tasa de cambio para la moneda especificada.' });
        }
        res.status(200).json({ success: true, tasa_cambio: rows[0] });
    } catch (error) {
        console.error('Error al obtener tasa de cambio:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

/**
 * Crear una venta en tienda física.
 */
const createVentaFisica = async (req, res) => {
    const { tienda_id, cliente_id, items, pagos } = req.body;
    try {
        const result = await db.query('SELECT crear_venta_fisica($1, $2, $3::JSON, $4::JSON) as venta_id', [
            tienda_id, cliente_id, JSON.stringify(items), JSON.stringify(pagos)
        ]);
        res.status(201).json({ success: true, message: 'Venta física creada exitosamente', venta_id: result.rows[0].venta_id });
    } catch (error) {
        console.error('Error al crear venta física:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener un producto por su código EAN-13 para el punto de venta.
 */
const getProductByEAN = async (req, res) => {
    const { ean } = req.params;  // EAN viene de los parámetros de la ruta
    const { tienda_id } = req.query;  // tienda_id viene como query parameter
    
    // Validar que el EAN sea válido
    if (!ean || ean.trim() === '') {
        return res.status(400).json({ success: false, message: 'EAN es requerido.' });
    }
    
    try {
        console.log('🔍 Buscando producto por EAN:', ean, 'en tienda:', tienda_id || 'todas');
        
        const { rows } = await db.query('SELECT obtener_producto_por_ean($1, $2) as producto', [
            parseInt(ean), 
            tienda_id ? parseInt(tienda_id) : 1  // Default a tienda 1 si no se especifica
        ]);
        
        console.log('📦 Resultado de búsqueda EAN:', rows);
        
        if (!rows[0] || !rows[0].producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado en esta tienda.' });
        }
        
        res.status(200).json({ success: true, producto: rows[0].producto });
    } catch (error) {
        console.error('Error al obtener producto por EAN:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener los datos completos de una venta por su ID.
 */
const getVentaCompleta = async (req, res) => {
    const { ventaId } = req.params;
    try {
        const result = await db.query('SELECT obtener_venta_completa($1) as venta_data', [ventaId]);
        if (!result.rows[0] || !result.rows[0].venta_data || !result.rows[0].venta_data.venta) {
            return res.status(404).json({ success: false, message: 'Venta no encontrada' });
        }
        res.status(200).json({ success: true, data: result.rows[0].venta_data });
    } catch (error) {
        console.error('Error al obtener datos completos de la venta:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener los datos completos de una venta ONLINE por su ID.
 */
const getVentaOnlineCompleta = async (req, res) => {
    const { ventaId } = req.params;
    try {
        const result = await db.query('SELECT obtener_venta_online_completa($1) as venta_data', [ventaId]);
        if (!result.rows[0] || !result.rows[0].venta_data || !result.rows[0].venta_data.venta) {
            return res.status(404).json({ success: false, message: 'Venta online no encontrada' });
        }
        res.status(200).json({ success: true, data: result.rows[0].venta_data });
    } catch (error) {
        console.error('Error al obtener datos completos de la venta online:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

module.exports = {
    getAvailableProducts,
    getClienteFavoritePaymentMethods,
    createOnlineOrder,
    getTiendasFisicas,
    getTasaCambioActual,
    createVentaFisica,
    getProductByEAN,
    getVentaCompleta,
    getVentaOnlineCompleta,
};