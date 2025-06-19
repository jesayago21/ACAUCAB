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

module.exports = router;