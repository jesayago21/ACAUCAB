const jsreport = require('jsreport')();
const { run } = require('./data/Reportes/comparativa_ingresos_cerveza_report.js');

async function generarReporte() {
    try {
        // Inicializar jsreport
        await jsreport.init();
        
        console.log('🔄 Generando reporte de comparativa de ingresos por tipo de cerveza...');
        
        // Obtener datos del reporte
        const data = await run();
        
        console.log('✅ Datos obtenidos correctamente');
        console.log(`📊 Total de ventas analizadas: ${data.resumen?.total_ventas || 0}`);
        console.log(`💰 Ingresos totales: $${data.resumen?.total_ingresos || '0.00'}`);
        console.log(`🍺 Participación Ale: ${data.resumen?.ale?.porcentaje || '0'}%`);
        console.log(`🍺 Participación Lager: ${data.resumen?.lager?.porcentaje || '0'}%`);
        
        // Generar el reporte HTML
        const result = await jsreport.render({
            template: {
                content: require('fs').readFileSync('./data/Reportes/comparativa_ingresos_cerveza_template.html', 'utf8'),
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
        
        // Crear directorio si no existe
        const fs = require('fs');
        const path = require('path');
        const outputDir = './ReportesPdf/comparativa_ingresos';
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Guardar el reporte HTML
        const outputPath = `${outputDir}/reporte_comparativa_ingresos_cerveza_${new Date().toISOString().split('T')[0]}.html`;
        fs.writeFileSync(outputPath, result.content);
        
        console.log('✅ Reporte HTML generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);
        console.log(`📅 Fecha de generación: ${data.fechaGeneracion}`);
        
        // Mostrar resumen
        if (data.resumen) {
            console.log('\n📈 RESUMEN DEL REPORTE:');
            console.log(`   • Total de ventas: ${data.resumen.total_ventas}`);
            console.log(`   • Ingresos totales: $${data.resumen.total_ingresos}`);
            console.log(`   • Participación Ale: ${data.resumen.ale.porcentaje}%`);
            console.log(`   • Participación Lager: ${data.resumen.lager.porcentaje}%`);
            console.log(`   • Categoría dominante: ${data.analisis_tendencias.categoria_dominante}`);
            console.log(`   • Diferencia porcentual: ${data.analisis_tendencias.diferencia_porcentual}%`);
        }
        
        if (data.top_cervezas && data.top_cervezas.length > 0) {
            console.log(`   • Top cerveza: ${data.top_cervezas[0].nombre} ($${data.top_cervezas[0].ingresos})`);
        }
        
    } catch (error) {
        console.error('❌ Error generando el reporte:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
    } finally {
        // Cerrar jsreport
        await jsreport.close();
    }
}

// Función para generar reporte en PDF
async function generarReportePDF() {
    try {
        await jsreport.init();
        
        console.log('🔄 Generando reporte PDF de comparativa de ingresos por tipo de cerveza...');
        
        const data = await run();
        
        const result = await jsreport.render({
            template: {
                content: require('fs').readFileSync('./data/Reportes/comparativa_ingresos_cerveza_template.html', 'utf8'),
                engine: 'handlebars',
                recipe: 'chrome-pdf',
                helpers: `
                    function eq(a, b) {
                        return a === b;
                    }
                `,
                chrome: {
                    format: 'A4',
                    marginTop: '1cm',
                    marginLeft: '1cm',
                    marginRight: '1cm',
                    marginBottom: '1cm',
                    printBackground: true
                }
            },
            data: data
        });
        
        // Crear directorio si no existe
        const fs = require('fs');
        const outputDir = './ReportesPdf/comparativa_ingresos';
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const outputPath = `${outputDir}/reporte_comparativa_ingresos_cerveza_${new Date().toISOString().split('T')[0]}.pdf`;
        fs.writeFileSync(outputPath, result.content);
        
        console.log('✅ Reporte PDF generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);
        
    } catch (error) {
        console.error('❌ Error generando el reporte PDF:', error.message);
    } finally {
        await jsreport.close();
    }
}

// Ejecutar según los argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length === 0) {
    // Generar reporte HTML por defecto
    generarReporte();
} else if (args[0] === '--pdf') {
    // Generar reporte en PDF
    generarReportePDF();
} else {
    console.log('📖 Uso del script:');
    console.log('   node generar_reporte_comparativa_cerveza.js                    # Reporte HTML');
    console.log('   node generar_reporte_comparativa_cerveza.js --pdf              # Reporte en PDF');
    console.log('');
    console.log('📊 Descripción:');
    console.log('   Comparativa de ingresos por tipo de cerveza (Ale vs Lager)');
    console.log('   por canal de venta (física y online) por período de tiempo');
}

module.exports = {
    generarReporte,
    generarReportePDF
}; 