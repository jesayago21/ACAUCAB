const jsreport = require('jsreport')();
const { run } = require('./data/Reportes/analisis_ibu_report.js');

async function generarReporte() {
    try {
        // Inicializar jsreport
        await jsreport.init();
        
        console.log('🔄 Generando reporte de análisis comparativo de IBU...');
        
        // Obtener datos del reporte
        const data = await run();
        
        console.log('✅ Datos obtenidos correctamente');
        console.log(`📊 Total de productores: ${data.resumen?.total_productores || 0}`);
        console.log(`🍺 Total de cervezas: ${data.resumen?.total_cervezas || 0}`);
        console.log(`📈 IBU promedio: ${data.resumen?.promedio_ibu || '0.0'}`);
        
        // Generar el reporte
        const result = await jsreport.render({
            template: {
                content: require('fs').readFileSync('./data/Reportes/analisis_ibu_template.html', 'utf8'),
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
        
        // Guardar el reporte
        const outputPath = `./ReportesPdf/analisis_ibu/reporte_analisis_ibu_${new Date().toISOString().split('T')[0]}.html`;
        require('fs').writeFileSync(outputPath, result.content);
        
        console.log('✅ Reporte generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);
        console.log(`📅 Fecha de generación: ${data.fechaGeneracion}`);
        
        // Mostrar resumen
        if (data.resumen) {
            console.log('\n📈 RESUMEN DEL REPORTE:');
            console.log(`   • Productores analizados: ${data.resumen.total_productores}`);
            console.log(`   • Total de cervezas: ${data.resumen.total_cervezas}`);
            console.log(`   • Cervezas con IBU: ${data.resumen.cervezas_con_ibu}`);
            console.log(`   • IBU promedio: ${data.resumen.promedio_ibu}`);
            console.log(`   • IBU máximo: ${data.resumen.max_ibu}`);
            console.log(`   • IBU mínimo: ${data.resumen.min_ibu}`);
        }
        
        if (data.productores && data.productores.length > 0) {
            console.log(`   • Productores con cervezas: ${data.productores.length}`);
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
        
        console.log('🔄 Generando reporte PDF de análisis comparativo de IBU...');
        
        const data = await run();
        
        const result = await jsreport.render({
            template: {
                content: require('fs').readFileSync('./data/Reportes/analisis_ibu_template.html', 'utf8'),
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
                    marginBottom: '1cm'
                }
            },
            data: data
        });
        
        const outputPath = `./ReportesPdf/analisis_ibu/reporte_analisis_ibu_${new Date().toISOString().split('T')[0]}.pdf`;
        require('fs').writeFileSync(outputPath, result.content);
        
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
    console.log('   node generar_reporte_ibu.js                    # Reporte HTML');
    console.log('   node generar_reporte_ibu.js --pdf              # Reporte en PDF');
    console.log('');
    console.log('📊 Descripción:');
    console.log('   Análisis comparativo del amargor (IBU) de cervezas');
    console.log('   American Amber Ale y American Pale Ale por productor');
}

module.exports = {
    generarReporte,
    generarReportePDF
}; 