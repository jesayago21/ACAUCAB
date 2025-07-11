const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

/**
 * @swagger
 * /api/shop/products:
 *   get:
 *     summary: Obtener presentaciones de cerveza disponibles en inventario
 *     description: Retorna todas las presentaciones de cerveza disponibles en las tiendas físicas, incluyendo información de ofertas activas
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: tienda_id
 *         schema:
 *           type: integer
 *         description: ID de la tienda física para filtrar productos (opcional)
 *     responses:
 *       200:
 *         description: Lista de productos disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PresentacionCerveza'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/products', shopController.getAvailableProducts);

/**
 * @swagger
 * /api/shop/products/ean/{ean}:
 *   get:
 *     summary: Buscar producto por código EAN
 *     description: Busca un producto específico por su código de barras EAN-13
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: ean
 *         required: true
 *         schema:
 *           type: string
 *         description: Código EAN-13 del producto
 *       - in: query
 *         name: tienda_id
 *         schema:
 *           type: integer
 *         description: ID de la tienda física para filtrar productos (opcional)
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 producto:
 *                   $ref: '#/components/schemas/PresentacionCerveza'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/products/ean/:ean', shopController.getProductByEAN);

/**
 * @swagger
 * /api/shop/offers:
 *   get:
 *     summary: Obtener productos con ofertas activas
 *     description: Retorna solo las presentaciones de cerveza que tienen ofertas activas vigentes
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: tienda_id
 *         schema:
 *           type: integer
 *         description: ID de la tienda física para filtrar productos (opcional)
 *     responses:
 *       200:
 *         description: Lista de productos con ofertas activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PresentacionCerveza'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/offers', shopController.getProductsWithOffers);

/**
 * @swagger
 * /api/shop/tiendas:
 *   get:
 *     summary: Obtener lista de tiendas físicas
 *     description: Retorna todas las tiendas físicas disponibles
 *     tags: [Tiendas]
 *     responses:
 *       200:
 *         description: Lista de tiendas físicas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clave:
 *                     type: integer
 *                     description: ID único de la tienda
 *                   nombre:
 *                     type: string
 *                     description: Nombre de la tienda
 *                   direccion:
 *                     type: string
 *                     description: Dirección de la tienda
 *                   rif_empresa:
 *                     type: integer
 *                     description: RIF de la empresa
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tiendas', shopController.getTiendasFisicas);

/**
 * @swagger
 * /api/shop/payment-methods/{userId}:
 *   get:
 *     summary: Obtener métodos de pago de un usuario
 *     description: Retorna las tarjetas de crédito registradas de un usuario para compras online
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario
 *     responses:
 *       200:
 *         description: Lista de métodos de pago del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MetodoPago'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/payment-methods/:userId', shopController.getUserPaymentMethods);

/**
 * @swagger
 * /api/shop/cliente/{clienteId}/metodos-favoritos:
 *   get:
 *     summary: Obtener métodos de pago favoritos del cliente
 *     description: Retorna las tarjetas guardadas como favoritas del cliente para agilizar el proceso de pago
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Métodos de pago favoritos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 metodos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       banco:
 *                         type: string
 *                       numero_tarjeta:
 *                         type: string
 *                         description: Número de tarjeta parcialmente oculto
 *                       fecha_vencimiento:
 *                         type: string
 *                         format: date
 *                       tipo:
 *                         type: string
 *                         enum: [credito, debito]
 *                       moneda:
 *                         type: string
 *       500:
 *         description: Error interno del servidor
 */
router.get('/cliente/:clienteId/metodos-favoritos', shopController.getClienteFavoritePaymentMethods);

/**
 * @swagger
 * /api/shop/order:
 *   post:
 *     summary: Crear una nueva venta online
 *     description: Procesa una nueva orden de compra online llamando al stored procedure correspondiente
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearOrden'
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Venta creada exitosamente."
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al procesar la venta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/order', shopController.createOnlineOrder);

/**
 * @swagger
 * /api/shop/tasa-cambio-puntos:
 *   get:
 *     summary: Obtener la tasa de cambio actual de PUNTOS
 *     description: Retorna la tasa de cambio de puntos vigente (conversión directa puntos → Bs)
 *     tags: [Tasas de Cambio]
 *     responses:
 *       200:
 *         description: Tasa de cambio de puntos actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 tasa:
 *                   type: object
 *                   properties:
 *                     clave:
 *                       type: integer
 *                     moneda:
 *                       type: string
 *                       enum: [PUNTOS]
 *                     monto_equivalencia:
 *                       type: number
 *                     fecha_inicio:
 *                       type: string
 *                       format: date
 *                     fecha_fin:
 *                       type: string
 *                       format: date
 *       404:
 *         description: No se encontró tasa de cambio de puntos vigente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/tasa-cambio-puntos', shopController.getTasaCambioPuntos);

/**
 * @swagger
 * /api/shop/tasas-cambio:
 *   get:
 *     summary: Obtener todas las tasas de cambio vigentes
 *     description: Retorna todas las tasas de cambio vigentes organizadas por moneda
 *     tags: [Tasas de Cambio]
 *     responses:
 *       200:
 *         description: Tasas de cambio obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 tasas:
 *                   type: object
 *                   description: Tasas organizadas por moneda
 *                 tasas_array:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clave:
 *                         type: integer
 *                       moneda:
 *                         type: string
 *                       monto_equivalencia:
 *                         type: number
 *                       fecha_inicio:
 *                         type: string
 *                         format: date
 *                       fecha_fin:
 *                         type: string
 *                         format: date
 *       500:
 *         description: Error interno del servidor
 */
router.get('/tasas-cambio', shopController.getAllTasasCambio);

/**
 * @swagger
 * /api/shop/tasa-cambio-actual:
 *   get:
 *     summary: Obtener la tasa de cambio actual del USD
 *     description: Retorna la tasa de cambio USD vigente para calcular el valor de puntos
 *     tags: [Tasas de Cambio]
 *     responses:
 *       200:
 *         description: Tasa de cambio actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 tasa:
 *                   type: object
 *                   properties:
 *                     clave:
 *                       type: integer
 *                     moneda:
 *                       type: string
 *                       enum: [USD, EUR, COP, PEN, BOB]
 *                     monto_equivalencia:
 *                       type: number
 *                     fecha_inicio:
 *                       type: string
 *                       format: date
 *                     fecha_fin:
 *                       type: string
 *                       format: date
 *       404:
 *         description: No se encontró tasa de cambio vigente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/tasa-cambio-actual', shopController.getTasaCambioActual);

/**
 * @swagger
 * /api/shop/venta-fisica:
 *   post:
 *     summary: Crear una nueva venta en tienda física
 *     description: Procesa una venta directa en tienda física con actualización de inventario y métodos de pago
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente_id
 *               - items
 *               - metodos_pago
 *               - total_venta
 *             properties:
 *               cliente_id:
 *                 type: integer
 *                 description: ID del cliente
 *               tienda_id:
 *                 type: integer
 *                 default: 1
 *                 description: ID de la tienda física
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio_unitario:
 *                       type: number
 *               metodos_pago:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tipo:
 *                       type: string
 *                       enum: [Efectivo, Cheque, Tarjeta de credito, Tarjeta de debito, Puntos]
 *                     monto:
 *                       type: number
 *                     detalles:
 *                       type: object
 *               total_venta:
 *                 type: number
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 venta_id:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error al procesar la venta
 */
router.post('/venta-fisica', shopController.createVentaFisica);

/**
 * @swagger
 * /api/shop/ventas-tienda:
 *   get:
 *     summary: Obtener el listado de ventas de una tienda física
 *     description: Retorna todas las ventas realizadas en una tienda física específica.
 *     tags: [Ventas]
 *     parameters:
 *       - in: query
 *         name: tienda_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tienda física para filtrar las ventas.
 *     responses:
 *       200:
 *         description: Lista de ventas de la tienda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VentaTiendaFisica'
 *       404:
 *         description: No se encontraron ventas para la tienda especificada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/ventas-tienda', shopController.getVentasTienda);

/**
 * @swagger
 * /api/shop/venta-completa/{ventaId}:
 *   get:
 *     summary: Obtener datos completos de una venta
 *     description: Obtiene todos los datos de una venta incluyendo detalle, pagos y cliente
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: ventaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta a consultar
 *     responses:
 *       200:
 *         description: Datos completos de la venta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 venta:
 *                   type: object
 *                   properties:
 *                     clave: 
 *                       type: integer
 *                     fecha:
 *                       type: string
 *                     total_venta:
 *                       type: number
 *                     fk_tienda_fisica:
 *                       type: integer
 *                     fk_cliente:
 *                       type: integer
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     clave:
 *                       type: integer
 *                     rif:
 *                       type: integer
 *                     tipo:
 *                       type: string
 *                     primer_nombre:
 *                       type: string
 *                     primer_apellido:
 *                       type: string
 *                     razon_social:
 *                       type: string
 *                 detalle:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clave:
 *                         type: integer
 *                       cantidad:
 *                         type: integer
 *                       precio_unitario:
 *                         type: number
 *                       producto:
 *                         type: object
 *                 pagos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clave:
 *                         type: integer
 *                       fecha_pago:
 *                         type: string
 *                       monto_total:
 *                         type: number
 *                       metodo_pago:
 *                         type: object
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/venta-completa/:ventaId', async (req, res) => {
    try {
        const { ventaId } = req.params;
        const pool = req.app.get('db');

        // Obtener datos de la venta
        const ventaQuery = `
            SELECT v.*, tf.nombre as tienda_nombre
            FROM venta_tienda_fisica v
            LEFT JOIN tienda_fisica tf ON v.fk_tienda_fisica = tf.clave
            WHERE v.clave = $1
        `;
        const ventaResult = await pool.query(ventaQuery, [ventaId]);

        if (ventaResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Venta no encontrada' 
            });
        }

        const venta = ventaResult.rows[0];

        // Obtener datos del cliente
        const clienteQuery = `
            SELECT c.*, 
                   -- Datos de persona natural
                   c.ci, c.primer_nombre, c.segundo_nombre, c.primer_apellido, c.segundo_apellido,
                   -- Datos de persona jurídica
                   c.razon_social, c.denominacion_comercial, c.capital_disponible
            FROM cliente c
            WHERE c.clave = $1
        `;
        const clienteResult = await pool.query(clienteQuery, [venta.fk_cliente]);
        const cliente = clienteResult.rows[0] || null;

        // Obtener detalle de la venta
        const detalleQuery = `
            SELECT dv.*, 
                   p.nombre as producto_nombre,
                   p.ean_13,
                   c.nombre as cerveza_nombre,
                   c.grado_alcohol,
                   tc.nombre as tipo_cerveza
            FROM detalle_venta_fisica dv
            JOIN inventario_tienda it ON dv.fk_inventario_tienda = it.clave
            JOIN presentacion p ON it.fk_presentacion = p.clave
            JOIN cerveza c ON p.fk_cerveza = c.clave
            JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
            WHERE dv.fk_venta_tienda_fisica = $1
        `;
        const detalleResult = await pool.query(detalleQuery, [ventaId]);

        // Obtener pagos de la venta
        const pagosQuery = `
            SELECT p.*, 
                   mp.tipo as tipo_metodo_pago,
                   mp.moneda,
                   mp.numero_tarjeta,
                   mp.banco,
                   tc.monto_equivalencia
            FROM pago p
            JOIN metodo_de_pago mp ON p.fk_metodo_de_pago = mp.clave
            LEFT JOIN tasa_cambio tc ON p.fk_tasa_cambio = tc.clave
            WHERE p.fk_venta_tienda_fisica = $1
            ORDER BY p.fecha_pago
        `;
        const pagosResult = await pool.query(pagosQuery, [ventaId]);

        // Construir respuesta
        const response = {
            success: true,
            data: {
                venta: {
                    ...venta,
                    tienda_nombre: venta.tienda_nombre
                },
                cliente: cliente,
                detalle: detalleResult.rows.map(item => ({
                    clave: item.clave,
                    cantidad: item.cantidad,
                    precio_unitario: parseFloat(item.precio_unitario),
                    subtotal: item.cantidad * parseFloat(item.precio_unitario),
                    producto: {
                        nombre: item.producto_nombre,
                        ean_13: item.ean_13,
                        cerveza: item.cerveza_nombre,
                        grado_alcohol: item.grado_alcohol,
                        tipo: item.tipo_cerveza
                    }
                })),
                pagos: pagosResult.rows.map(pago => ({
                    clave: pago.clave,
                    fecha_pago: pago.fecha_pago,
                    monto_total: parseFloat(pago.monto_total),
                    metodo_pago: {
                        tipo: pago.tipo_metodo_pago,
                        moneda: pago.moneda,
                        numero_tarjeta: pago.numero_tarjeta ? `****${pago.numero_tarjeta.toString().slice(-4)}` : null,
                        banco: pago.banco
                    },
                    tasa_cambio: pago.monto_equivalencia ? parseFloat(pago.monto_equivalencia) : null
                })),
                resumen: {
                    total_productos: detalleResult.rows.reduce((sum, item) => sum + item.cantidad, 0),
                    total_items: detalleResult.rows.length,
                    total_venta: parseFloat(venta.total_venta),
                    total_pagado: pagosResult.rows.reduce((sum, pago) => sum + parseFloat(pago.monto_total), 0),
                    puntos_otorgados: detalleResult.rows.reduce((sum, item) => sum + item.cantidad, 0) // 1 punto por producto
                }
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Error obteniendo datos completos de venta:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener datos de la venta' 
        });
    }
});

module.exports = router;