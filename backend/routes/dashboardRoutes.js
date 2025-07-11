const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// =============================================
// RUTAS PARA INDICADORES DE VENTAS
// =============================================
router.get('/ventas/totales', dashboardController.getVentasTotales);
router.get('/ventas/crecimiento', dashboardController.getCrecimientoVentas);
router.get('/ventas/ticket-promedio', dashboardController.getTicketPromedio);
router.get('/ventas/volumen-unidades', dashboardController.getVolumenUnidadesVendidas);
router.get('/ventas/por-estilo', dashboardController.getVentasPorEstiloCerveza);
router.get('/ventas/por-canal', dashboardController.getVentasPorCanal);
router.get('/ventas/tendencia', dashboardController.getTendenciaVentas);
router.get('/ventas/por-empleado', dashboardController.getVentasPorEmpleado);

// =============================================
// RUTAS PARA INDICADORES DE CLIENTES
// =============================================
router.get('/clientes/nuevos-vs-recurrentes', dashboardController.getClientesNuevosVsRecurrentes);
router.get('/clientes/tasa-retencion', dashboardController.getTasaRetencionClientes);

// =============================================
// RUTAS PARA INDICADORES DE INVENTARIO
// =============================================
router.get('/inventario/rotacion', dashboardController.getRotacionInventario);
router.get('/inventario/ruptura-stock', dashboardController.getTasaRupturaStock);
router.get('/inventario/actual', dashboardController.getInventarioActual);

// =============================================
// RUTAS PARA ESTADÍSTICAS DE ALMACÉN
// =============================================
router.get('/almacen/estadisticas', dashboardController.getEstadisticasAlmacen);

// =============================================
// RUTA PARA DASHBOARD COMPLETO
// =============================================
router.get('/completo', dashboardController.getDashboardCompleto);

module.exports = router; 