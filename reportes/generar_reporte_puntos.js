const jsreport = require('jsreport')();
const { run } = require('./data/Reportes/puntos_canjeados_report.js');

async function generarReporte() {
    try {
        // Inicializar jsreport
        await jsreport.init();
        
        console.log('🔄 Generando reporte de puntos canjeados...');
        
        // Obtener datos del reporte
        const data = await run();
        
        console.log('✅ Datos obtenidos correctamente');
        console.log(`📊 Total de clientes: ${data.resumen?.total_clientes_afiliados || 0}`);
        console.log(`💰 Valor total: Bs. ${data.resumen?.total_bolivares || '0.00'}`);
        
        // Generar el reporte
        const result = await jsreport.render({
            template: {
                content: require('fs').readFileSync('./data/Reportes/puntos_canjeados_template.html', 'utf8'),
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
        const outputPath = `./ReportesPdf/puntos_canjeados/reporte_puntos_canjeados_${new Date().toISOString().split('T')[0]}.html`;
        require('fs').writeFileSync(outputPath, result.content);
        
        console.log('✅ Reporte generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);
        console.log(`📅 Período: ${data.fechaInicio} - ${data.fechaFin}`);
        
        // Mostrar resumen
        if (data.resumen) {
            console.log('\n📈 RESUMEN DEL REPORTE:');
            console.log(`   • Clientes afiliados: ${data.resumen.total_clientes_afiliados}`);
            console.log(`   • Pagos con puntos: ${data.resumen.total_pagos_puntos}`);
            console.log(`   • Puntos canjeados: ${data.resumen.total_puntos_canjeados}`);
            console.log(`   • Valor total: Bs. ${data.resumen.total_bolivares}`);
        }
        
        if (data.detalle && data.detalle.length > 0) {
            console.log(`   • Clientes con canjes: ${data.detalle.length}`);
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

// Función para generar reporte con fechas personalizadas
async function generarReporteConFechas(fechaInicio, fechaFin) {
    try {
        await jsreport.init();

        console.log(`🔄 Generando reporte para el período: ${fechaInicio} - ${fechaFin}`);

        // Llama directamente a run con las fechas recibidas
        const { run } = require('./data/Reportes/puntos_canjeados_report.js');
        const data = await run(fechaInicio, fechaFin);

        const result = await jsreport.render({
            template: {
                content: require('fs').readFileSync('./data/Reportes/puntos_canjeados_template.html', 'utf8'),
                engine: 'handlebars',
                recipe: 'html',
                helpers: `
                    function eq(a, b) {
                        return a === b;
                    }
                `,
            },
            data: data
        });

        const outputPath = `./ReportesPdf/puntos_canjeados/reporte_puntos_canjeados_${fechaInicio}_${fechaFin}.html`;
        require('fs').writeFileSync(outputPath, result.content);

        console.log('✅ Reporte generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error generando el reporte:', error.message);
    } finally {
        await jsreport.close();
    }
}

// Función para generar reporte en PDF
async function generarReportePDF() {
    try {
        await jsreport.init();
        
        console.log('🔄 Generando reporte PDF de puntos canjeados...');
        
        const data = await run();
        
        const result = await jsreport.render({
            template: {
                content: require('fs').readFileSync('./data/Reportes/puntos_canjeados_template.html', 'utf8'),
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
        
        const outputPath = `./ReportesPdf/puntos_canjeados/reporte_puntos_canjeados_${new Date().toISOString().split('T')[0]}.pdf`;
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
    // Generar reporte con fechas por defecto
    generarReporte();
} else if (args[0] === '--fechas' && args.length === 3) {
    // Generar reporte con fechas personalizadas
    generarReporteConFechas(args[1], args[2]);
} else if (args[0] === '--pdf') {
    // Generar reporte en PDF
    generarReportePDF();
} else {
    console.log('📖 Uso del script:');
    console.log('   node generar_reporte_puntos.js                    # Reporte con fechas por defecto (2024)');
    console.log('   node generar_reporte_puntos.js --fechas 2024-01-01 2024-12-31  # Fechas personalizadas');
    console.log('   node generar_reporte_puntos.js --pdf              # Reporte en PDF');
    console.log('');
    console.log('📅 Ejemplos:');
    console.log('   node generar_reporte_puntos.js --fechas 2024-11-01 2024-11-30  # Noviembre 2024');
    console.log('   node generar_reporte_puntos.js --fechas 2023-01-01 2023-12-31  # Año 2023');
}

module.exports = {
    generarReporte,
    generarReporteConFechas,
    generarReportePDF
}; 