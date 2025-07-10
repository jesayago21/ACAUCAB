const fs = require('fs');
const path = require('path');
const jsreport = require('jsreport')();
const pool = require('../backend/config/db');

// Usar rutas absolutas
const baseDir = path.resolve(__dirname);
const outputDir = path.join(baseDir, 'ReportesPdf', 'inventario_actual');
const templatePath = path.join(baseDir, 'data', 'Reportes', 'inventario_actual_template.html');

async function run() {
    try {
        // Crear el directorio si no existe
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log('Directorio creado:', outputDir);
        }

        const query = `
            SELECT 
                i.cerveza_nombre,
                i.presentacion_nombre,
                i.tipo_cerveza,
                i.stock_actual,
                i.valor_inventario,
                i.estado_stock,
                i.tipo_inventario,
                i.presentacion_id
            FROM reporte_inventario_actual() i
            ORDER BY i.valor_inventario DESC;
        `;
        
        const queryResult = await pool.query(query);
        const inventario = queryResult.rows;

        const resumen = {
            total_productos: inventario.length,
            valor_total: inventario.reduce((acc, item) => acc + parseFloat(item.valor_inventario), 0).toFixed(2),
            productos_stock_bajo: inventario.filter(item => item.estado_stock === 'Stock Bajo' || item.estado_stock === 'Sin Stock').length,
            productos_stock_normal: inventario.filter(item => item.estado_stock === 'Stock Normal').length,
            productos_stock_alto: inventario.filter(item => item.estado_stock === 'Stock Alto').length
        };

        const data = {
            fechaGeneracion: new Date().toLocaleDateString('es-ES'),
            horaGeneracion: new Date().toLocaleTimeString('es-ES'),
            inventario: inventario.map(item => ({
                ...item,
                valor_inventario: parseFloat(item.valor_inventario).toFixed(2)
            })),
            resumen
        };

        await jsreport.init();
        const reportResult = await jsreport.render({
            template: {
                content: fs.readFileSync(templatePath, 'utf8'),
                engine: 'handlebars',
                recipe: 'html',
                helpers: `
                    function eq(a, b) { 
                        return a === b;
                    }
                `
            },
            data: data
        });

        const fileName = `reporte_inventario_actual_${new Date().toISOString().split('T')[0]}.html`;
        const outputPath = path.join(outputDir, fileName);
        
        // Escribir el archivo con codificación utf8
        fs.writeFileSync(outputPath, reportResult.content, 'utf8');
        console.log('Archivo creado:', outputPath);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error generando el reporte de inventario:', error);
        process.exit(1);
    } finally {
        if (jsreport.close) await jsreport.close();
    }
}

run(); 