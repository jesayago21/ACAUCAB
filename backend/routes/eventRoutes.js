const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// =============================================
// RUTAS PARA TIPOS DE EVENTOS
// =============================================
router.get('/tipos', eventController.getTiposEvento);
router.post('/tipos', eventController.createTipoEvento);
router.put('/tipos/:id', eventController.updateTipoEvento);
router.delete('/tipos/:id', eventController.deleteTipoEvento);

// =============================================
// RUTAS PARA EVENTOS PRINCIPALES
// =============================================
router.get('/', eventController.getEventos);
router.get('/activos', eventController.getEventosActivos);
router.get('/proximos', eventController.getEventosProximos);
router.get('/:id', eventController.getEventoById);
router.post('/', eventController.createEvento);
router.put('/:id', eventController.updateEvento);
router.delete('/:id', eventController.deleteEvento);

// =============================================
// RUTAS PARA SUB-EVENTOS
// =============================================
router.get('/:eventoId/subeventos', eventController.getSubeventos);
router.post('/:eventoId/subeventos', eventController.createSubevento);
router.put('/subeventos/:id', eventController.updateSubevento);
router.delete('/subeventos/:id', eventController.deleteSubevento);

// =============================================
// RUTAS PARA INVENTARIO DE EVENTOS
// =============================================
router.get('/:eventoId/inventario', eventController.getInventarioEvento);
router.put('/:eventoId/inventario', eventController.updateInventarioEvento);
router.post('/:eventoId/inventario/transferir', eventController.transferirInventarioEvento);
router.post('/:eventoId/inventario/crear', eventController.crearInventarioEvento);
router.get('/:eventoId/inventario/estadisticas', eventController.getEstadisticasInventarioEvento);
router.get('/almacen-disponible', eventController.getAlmacenDisponible);
router.get('/presentaciones-disponibles', eventController.getPresentacionesDisponibles);

// =============================================
// RUTAS PARA ASISTENCIA Y PARTICIPANTES
// =============================================
router.post('/:eventoId/asistencia', eventController.registrarAsistencia);
router.get('/:eventoId/asistentes', eventController.getAsistentes);
router.post('/:eventoId/entradas', eventController.venderEntrada);

// =============================================
// RUTAS PARA GESTIÓN DE INVITADOS
// =============================================
router.get('/tipos-invitado', eventController.getTiposInvitado);
router.get('/:eventoId/invitados', eventController.getInvitados);
router.post('/:eventoId/invitados', eventController.agregarInvitado);
router.put('/:eventoId/invitados/:invitadoId/entrada', eventController.registrarEntradaInvitado);
router.put('/:eventoId/invitados/:invitadoId/salida', eventController.registrarSalidaInvitado);
router.get('/:eventoId/invitados/estadisticas', eventController.getEstadisticasInvitados);

// =============================================
// RUTAS PARA ESTADÍSTICAS Y REPORTES
// =============================================
router.get('/estadisticas/entradas', eventController.getEstadisticasEntradas);


// =============================================
// RUTAS PARA VENTAS EN EVENTOS
// =============================================
router.get('/:eventoId/ventas', eventController.getVentasByEvento);


module.exports = router; 