const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

// Reporte 1: Puntos canjeados
// Este reporte genera un PDF con los puntos canjeados por los usuarios
router.get('/reporte-puntos', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_puntos.js');
    
    let args = '';
    if (fechaInicio && fechaFin) {
        args = ` --fechas ${fechaInicio} ${fechaFin}`;
    }
    
    exec(`node "${scriptPath}"${args}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error generando reporte:', error);
            return res.status(500).send('Error generando el reporte de puntos');
        }
        // Buscar la línea ARCHIVO_REPORTE: ... en el stdout
        const match = stdout.match(/ARCHIVO_REPORTE:\s*(.*\.html)/);
        let filePath;
        if (match && match[1]) {
            filePath = match[1].trim();
        } else {
            // Fallback: buscar el más reciente si no se encuentra la línea
            const fs = require('fs');
            const outputDir = path.resolve(__dirname, '../../reportes/ReportesPdf/puntos_canjeados');
            const files = fs.readdirSync(outputDir)
                .filter(f => f.endsWith('.html'))
                .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
            if (files.length === 0) return res.status(404).send('No se encontró el reporte');
            filePath = path.join(outputDir, files[0]);
        }
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
    const { fechaInicio, fechaFin } = req.query;
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_ventas_entradas.js');
    
    let args = '';
    if (fechaInicio && fechaFin) {
        args = ` --fechas ${fechaInicio} ${fechaFin}`;
    }
    
    exec(`node "${scriptPath}"${args}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error generando reporte:', error);
            return res.status(500).send('Error generando el reporte');
        }
        // Buscar la línea ARCHIVO_REPORTE: ... en el stdout
        const match = stdout.match(/ARCHIVO_REPORTE:\s*(.*\.html)/);
        let filePath;
        if (match && match[1]) {
            filePath = match[1].trim();
        } else {
            // Fallback: buscar el más reciente si no se encuentra la línea
            const fs = require('fs');
            const outputDir = path.resolve(__dirname, '../../reportes/ReportesPdf/ingresos_eventos');
            const files = fs.readdirSync(outputDir)
                .filter(f => f.endsWith('.html'))
                .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
            if (files.length === 0) return res.status(404).send('No se encontró el reporte');
            filePath = path.join(outputDir, files[0]);
        }
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
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send('Error generando el reporte de IBU');
        }
        // Buscar la línea ARCHIVO_REPORTE: ... en el stdout
        const match = stdout.match(/ARCHIVO_REPORTE:\s*(.*\.html)/);
        let filePath;
        if (match && match[1]) {
            filePath = match[1].trim();
        } else {
            // Fallback: buscar el más reciente si no se encuentra la línea
            const fs = require('fs');
            const outputDir = path.resolve(__dirname, '../../reportes/ReportesPdf/analisis_ibu');
            const files = fs.readdirSync(outputDir)
                .filter(f => f.endsWith('.html'))
                .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
            if (files.length === 0) return res.status(404).send('No se encontró el reporte');
            filePath = path.join(outputDir, files[0]);
        }
        res.download(filePath, 'reporte_analisis_ibu.html');
    });
});

// Reporte 4: Reporte comparativa cervezas
router.get('/reporte-comparativa-cerveza', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_comparativa_cerveza.js');
    
    let args = '';
    if (fechaInicio && fechaFin) {
        args = ` ${fechaInicio} ${fechaFin}`;
    }
    
    exec(`node "${scriptPath}"${args}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error generando reporte:', error);
            return res.status(500).send('Error generando el reporte de comparativa de cerveza');
        }
        // Buscar la línea ARCHIVO_REPORTE: ... en el stdout
        const match = stdout.match(/ARCHIVO_REPORTE:\s*(.*\.html)/);
        let filePath;
        if (match && match[1]) {
            filePath = match[1].trim();
        } else {
            // Fallback: buscar el más reciente si no se encuentra la línea
            const fs = require('fs');
            const outputDir = path.resolve(__dirname, '../../reportes/ReportesPdf/comparativa_ingresos');
            const files = fs.readdirSync(outputDir)
                .filter(f => f.endsWith('.html'))
                .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
            if (files.length === 0) return res.status(404).send('No se encontró el reporte');
            filePath = path.join(outputDir, files[0]);
        }
        res.download(filePath, 'reporte_comparativa_ingresos_cerveza.html');
    });
});

// Reporte 5: Reporte tiempo de entrega
router.get('/reporte-tiempo-entrega', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_tiempo_entrega.js');
    
    let args = '';
    if (fechaInicio && fechaFin) {
        args = ` --fechas ${fechaInicio} ${fechaFin}`;
    }
    
    exec(`node "${scriptPath}"${args}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error generando reporte:', error);
            return res.status(500).send('Error generando el reporte de tiempo de entrega');
        }
        const match = stdout.match(/ARCHIVO_REPORTE:\\s*(.*\\.html)/);
        let filePath;
        if (match && match[1]) {
            filePath = match[1].trim();
        } else {
            const fs = require('fs');
            const outputDir = path.resolve(__dirname, '../../reportes/ReportesPdf/tiempo_entrega');
            if (fs.existsSync(outputDir)) {
                const files = fs.readdirSync(outputDir)
                    .filter(f => f.endsWith('.html'))
                    .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
                if (files.length > 0) filePath = path.join(outputDir, files[0]);
            }
        }

        if (filePath) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('No se encontró el reporte generado.');
        }
    });
});

// Reporte 6: Reporte de tendencia de ventas
router.get('/reporte-tendencia-ventas', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_tendencia_ventas.js');
    
    let args = '';
    if (fechaInicio && fechaFin) {
        args = ` ${fechaInicio} ${fechaFin}`;
    }
    
    exec(`node "${scriptPath}"${args}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error generando reporte de tendencia de ventas:', stderr);
            return res.status(500).send('Error generando el reporte de tendencia de ventas');
        }

        const match = stdout.match(/ARCHIVO_REPORTE:\\s*(.*\\.html)/);
        let filePath;
        if (match && match[1]) {
            filePath = match[1].trim();
        } else {
            const fs = require('fs');
            const outputDir = path.resolve(__dirname, '../../reportes/ReportesPdf/tendencia_ventas');
            if (fs.existsSync(outputDir)) {
                const files = fs.readdirSync(outputDir)
                    .filter(f => f.endsWith('.html'))
                    .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
                if (files.length > 0) filePath = path.join(outputDir, files[0]);
            }
        }
        
        if (filePath) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('No se encontró el reporte generado.');
        }
    });
});

// Reporte 7: Productos con mejor rendimiento
router.get('/reporte-mejores-productos', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    const scriptPath = path.resolve(__dirname, '../../reportes/generar_reporte_mejores_productos.js');
    
    let args = '';
    if (fechaInicio && fechaFin) {
        args = ` ${fechaInicio} ${fechaFin}`;
    }
    
    exec(`node "${scriptPath}"${args}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error generando reporte de mejores productos:', stderr);
            return res.status(500).send('Error generando el reporte de mejores productos.');
        }

        const match = stdout.match(/ARCHIVO_REPORTE:\\s*(.*\\.html)/);
        let filePath;
        if (match && match[1]) {
            filePath = match[1].trim();
        } else {
            const fs = require('fs');
            const outputDir = path.resolve(__dirname, '../../reportes/ReportesPdf/mejores_productos');
             if (fs.existsSync(outputDir)) {
                const files = fs.readdirSync(outputDir)
                    .filter(f => f.endsWith('.html'))
                    .sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
                if (files.length > 0) filePath = path.join(outputDir, files[0]);
            }
        }

        if (filePath) {
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error("Error enviando el archivo de reporte:", err);
                    if (!res.headersSent) {
                        res.status(500).send("Error al leer el archivo de reporte.");
                    }
                }
            });
        } else {
            res.status(404).send("No se pudo generar o encontrar el archivo del reporte.");
        }
    });
});

module.exports = router;