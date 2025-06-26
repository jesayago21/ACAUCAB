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
 *                 cliente:
 *                   type: object
 *                 detalle:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagos:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/venta-completa/:ventaId', shopController.getVentaCompleta);

/**
 * @swagger
 * /api/shop/venta-online-completa/{ventaId}:
 *   get:
 *     summary: Obtener datos completos de una venta online
 *     description: Obtiene todos los datos de una venta online incluyendo detalle, pagos y cliente
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: ventaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta online a consultar
 *     responses:
 *       200:
 *         description: Datos completos de la venta
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/venta-online-completa/:ventaId', shopController.getVentaOnlineCompleta);

module.exports = router;