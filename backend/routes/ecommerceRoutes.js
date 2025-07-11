/**
 * Rutas específicas para operaciones del ecommerce
 */

const express = require('express');
const router = express.Router();
const ecommerceController = require('../controllers/ecommerceController');

// Productos y catálogo
router.get('/productos', ecommerceController.obtenerProductosEcommerce);
router.get('/ofertas', ecommerceController.obtenerOfertasActivas);

// Métodos de pago para ecommerce
router.get('/metodos-pago/:cliente_id', ecommerceController.obtenerMetodosPagoEcommerce);

// Validaciones
router.post('/validar-stock', ecommerceController.validarStockEcommerce);
router.post('/calcular-envio', ecommerceController.calcularCostoEnvio);

// Ventas online
router.post('/crear-venta', ecommerceController.crearVentaOnline);
router.get('/ventas/:venta_id', ecommerceController.obtenerVentaOnlineCompleta);
router.get('/ventas', ecommerceController.obtenerTodasLasVentasOnline);

// Seguimiento de pedidos
router.get('/tracking/:venta_id', ecommerceController.obtenerTrackingPedido);
router.put('/tracking/:venta_id', ecommerceController.actualizarEstadoEnvio);

module.exports = router; 