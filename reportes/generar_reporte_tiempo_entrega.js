const fs = require('fs');
const path = require('path');
const jsreport = require('jsreport')();

// Usa rutas absolutas para todo
const outputDir = path.resolve(__dirname, 'ReportesPdf/tiempo_entrega');
const templatePath = path.resolve(__dirname, 'data/Reportes/tiempo_entrega_template.html');
const dataScriptPath = path.resolve(__dirname, 'data/Reportes/tiempo_entrega_report.js');
const { run } = require(dataScriptPath);

// Helper para formatear moneda
function formatCurrency(value) {
    const number = Number(value);
    return !isNaN(number) ? number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0.00';
}

async function generarReporte() {
    try {
        await jsreport.init();

        console.log('🔄 Generando reporte de Tiempo de Entrega de Pedidos Online...');

        const data = await run();

        console.log('✅ Datos obtenidos correctamente');
        console.log(`📊 Total Pedidos: ${data.resumen?.total_pedidos || 0}`);
        console.log(`🚚 Pedidos Entregados: ${data.resumen?.total_pedidos_entregados || 0}`);
        console.log(`⏱️ Tiempo Promedio de Entrega: ${data.resumen?.promedio_entrega_general || '0.0'}h`);

        const result = await jsreport.render({
            template: {
                content: fs.readFileSync(templatePath, 'utf8'),
                engine: 'handlebars',
                recipe: 'html',
                helpers: `
                    function formatCurrency(value) {
                        const number = Number(value);
                        return !isNaN(number) ? number.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") : '0.00';
                    }
                    function eq(a, b) { return a === b; }
                    function gte(a, b) { return a >= b; }
                `
            },
            data: data
        });

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const now = new Date();
        const fecha = now.toISOString().split('T')[0];
        const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const outputPath = path.join(outputDir, `reporte_tiempo_entrega_${fecha}_${hora}.html`);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

        console.log('✅ Reporte generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);
        console.log(`📅 Período: ${data.fechaInicio} - ${data.fechaFin}`);

        if (data.resumen) {
            console.log('\n📈 RESUMEN DEL REPORTE:');
            console.log(`   • Total Pedidos: ${data.resumen.total_pedidos}`);
            console.log(`   • Pedidos Entregados: ${data.resumen.total_pedidos_entregados}`);
            console.log(`   • Tasa de Entrega: ${data.resumen.porcentaje_entregados}%`);
            console.log(`   • Tiempo Promedio de Entrega: ${data.resumen.promedio_entrega_general}h`);
            console.log(`   • Tiempo Promedio de Preparación: ${data.resumen.promedio_preparacion_general}h`);
            console.log(`   • Tiempo Total Promedio: ${data.resumen.promedio_total_general}h`);
            console.log(`   • Total Ventas: Bs. ${formatCurrency(data.resumen.total_ventas)}`);
        }

    } catch (error) {
        console.error('❌ Error generando el reporte:', error.message, error.stack);
    } finally {
        await jsreport.close();
    }
}

// Función para generar reporte en PDF
async function generarReportePDF() {
    try {
        await jsreport.init();

        console.log('🔄 Generando reporte PDF de Tiempo de Entrega de Pedidos Online...');

        const data = await run();

        const result = await jsreport.render({
            template: {
                content: fs.readFileSync(templatePath, 'utf8'),
                engine: 'handlebars',
                recipe: 'chrome-pdf',
                helpers: `
                    function formatCurrency(value) {
                        const number = Number(value);
                        return !isNaN(number) ? number.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") : '0.00';
                    }
                    function eq(a, b) { return a === b; }
                    function gte(a, b) { return a >= b; }
                `,
                chrome: {
                    format: 'A4',
                    landscape: true,
                    marginTop: '1.5cm',
                    marginLeft: '1.5cm',
                    marginRight: '1.5cm',
                    marginBottom: '1.5cm'
                }
            },
            data: data
        });

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const now = new Date();
        const fecha = now.toISOString().split('T')[0];
        const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const outputPath = path.join(outputDir, `reporte_tiempo_entrega_${fecha}_${hora}.pdf`);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

        console.log('✅ Reporte PDF generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error generando el reporte PDF:', error.message, error.stack);
    } finally {
        await jsreport.close();
    }
}

// Ejecutar según los argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length === 0) {
    generarReporte();
} else if (args[0] === '--pdf') {
    generarReportePDF();
} else {
    console.log('📖 Uso del script:');
    console.log('   node generar_reporte_tiempo_entrega.js                    # Reporte HTML');
    console.log('   node generar_reporte_tiempo_entrega.js --pdf              # Reporte en PDF');
    console.log('');
    console.log('📊 Descripción:');
    console.log('   Análisis de tiempo de entrega de pedidos online.');
}

module.exports = {
    generarReporte,
    generarReportePDF
};