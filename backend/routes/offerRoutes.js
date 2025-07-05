const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// =============================================
// RUTAS PARA GESTIÓN DE OFERTAS
// =============================================
router.get('/activas', offerController.getOfertasActivas);
router.post('/', offerController.createOferta);
router.delete('/:id', offerController.deleteOferta);
router.get('/validar-periodo', offerController.validarPeriodoOferta);
router.get('/productos-elegibles', offerController.getProductosElegibles);
router.get('/estadisticas', offerController.getEstadisticasOfertas);
router.get('/historial/:presentacionId', offerController.getHistorialOfertas);

module.exports = router; 