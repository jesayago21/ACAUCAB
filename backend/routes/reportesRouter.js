const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

// Reporte 1: Puntos canjeados
// Este reporte genera un PDF con los puntos canjeados por los usuarios
router.get('/reporte-puntos', (req, res) => {
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_puntos.js');
    // Ejecuta el script y espera a que termine
    exec(`node "${scriptPath}" `, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send('Error generando el reporte de puntos');
        }
        // Busca el archivo PDF generado más reciente
        const fs = require('fs');
        const outputDir = path.resolve(__dirname, '../../ReportesPdf/puntos_canjeados');
        const files = fs.readdirSync(outputDir)
            .filter(f => f.endsWith('.html'))
            .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
        if (files.length === 0) return res.status(404).send('No se encontró el reporte');
        const filePath = path.join(outputDir, files[0]);
        res.download(filePath, 'reporte_puntos_canjeados.html');
    });
});

// Reporte 1 con fechas desde el front
/**
 * router.get('/reporte-evento', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_ventas_entradas.js');
    let args = '';
    if (fechaInicio && fechaFin) {
        args = ` --fechas ${fechaInicio} ${fechaFin}`; // o agrega --pdf si quieres PDF
    }
    exec(`node "${scriptPath}"${args}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send('Error generando el reporte');
        }
        const fs = require('fs');
        const outputDir = path.resolve(__dirname, '../../ReportesPdf/ingresos_eventos/venta_evento_entrada');
        const files = fs.readdirSync(outputDir)
            .filter(f => f.endsWith('.html'))
            .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
        if (files.length === 0) return res.status(404).send('No se encontró el reporte');
        const filePath = path.join(outputDir, files[0]);
        res.download(filePath, 'reporte_evento.html');
    });
});
*/

// Reporte 2: Venta de entradas y de productos de eventos
// Este reporte genera un PDF con las ventas de entradas y productos de eventos
router.get('/reporte-evento', (req, res) => {
    // Puedes recibir fechas por query si quieres
    // const { fechaInicio, fechaFin } = req.query;
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_ventas_entradas.js');
    // Ejecuta el script y espera a que termine
    exec(`node "${scriptPath}" `, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send('Error generando el reporte');
        }
        // Busca el archivo generado (ajusta la ruta si es necesario)
        const fs = require('fs');
        const outputDir = path.resolve(__dirname, '../../ReportesPdf/ingresos_eventos/venta_evento_entrada');
        const files = fs.readdirSync(outputDir)
            .filter(f => f.endsWith('.html'))
            .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
        if (files.length === 0) return res.status(404).send('No se encontró el reporte');
        const filePath = path.join(outputDir, files[0]);
        res.download(filePath, 'reporte_evento.html');
    });
});
// Reporte 2 con fechas desde el front
/**
 * router.get('/reporte-evento', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_ventas_entradas.js');
    let args = '';
    if (fechaInicio && fechaFin) {
        args = ` --fechas ${fechaInicio} ${fechaFin}`; // o agrega --pdf si quieres PDF
    }
    exec(`node "${scriptPath}"${args}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send('Error generando el reporte');
        }
        const fs = require('fs');
        const outputDir = path.resolve(__dirname, '../../ReportesPdf/ingresos_eventos/venta_evento_entrada');
        const files = fs.readdirSync(outputDir)
            .filter(f => f.endsWith('.html'))
            .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
        if (files.length === 0) return res.status(404).send('No se encontró el reporte');
        const filePath = path.join(outputDir, files[0]);
        res.download(filePath, 'reporte_evento.html');
    });
});
 */


// Reporte 3: Analisis de amargor
router.get('/reporte-ibu', (req, res) => {
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_ibu.js');
    // Ejecuta el script y espera a que termine
    exec(`node "${scriptPath}" `, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send('Error generando el reporte de IBU');
        }
        // Busca el archivo PDF generado más reciente
        const fs = require('fs');
        const outputDir = path.resolve(__dirname, '../../ReportesPdf/analisis_ibu');
        const files = fs.readdirSync(outputDir)
            .filter(f => f.endsWith('.html'))
            .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
        if (files.length === 0) return res.status(404).send('No se encontró el reporte');
        const filePath = path.join(outputDir, files[0]);
        res.download(filePath, 'reporte_analisis_ibu.html');
    });
});

module.exports = router;