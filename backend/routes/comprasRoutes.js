const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/comprasController');

// =============================================
// RUTAS PARA GESTIÓN DE COMPRAS
// =============================================
router.get('/', comprasController.getOrdenesCompra);
router.get('/estadisticas', comprasController.getEstadisticasCompras);
router.get('/miembros-proveedores', comprasController.getMiembrosProveedores);
router.get('/estados', comprasController.getEstadosCompra);
router.get('/productos', comprasController.getProductosParaCompra);
router.get('/:id', comprasController.getDetalleOrdenCompra);
router.get('/:id/historial', comprasController.getHistorialEstados);
router.post('/', comprasController.createOrdenCompra);
router.put('/:id/estado', comprasController.cambiarEstadoOrdenCompra);

module.exports = router; 