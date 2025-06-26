const express = require('express');
const router = express.Router();
const reposicionController = require('../controllers/reposicionController');

// Middleware para verificar autenticación (asumiendo que existe)
// const authMiddleware = require('../middleware/auth');

// Obtener todas las reposiciones con detalles
router.get('/', reposicionController.getAllReposiciones);

// Obtener reposiciones por tienda específica
router.get('/tienda/:tiendaId', reposicionController.getReposicionesByTienda);

// Obtener una reposición específica por ID
router.get('/:id', reposicionController.getReposicionById);

// Actualizar estado de reposición
router.put('/:id/estado', reposicionController.updateEstadoReposicion);

// Crear reposición manual
router.post('/manual', reposicionController.createReposicionManual);

// Obtener jefes de pasillo por tienda
router.get('/tienda/:tiendaId/jefes-pasillo', reposicionController.getJefesPasilloPorTienda);

// Obtener estadísticas de reposiciones
router.get('/estadisticas/resumen', reposicionController.getEstadisticasReposiciones);

// Obtener estados disponibles para reposiciones
router.get('/estados/disponibles', reposicionController.getEstadosReposicion);

module.exports = router; 