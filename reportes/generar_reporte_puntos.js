const fs = require('fs');
const path = require('path');
const jsreport = require('jsreport')();

// Usa rutas absolutas para todo
const outputDir = path.resolve(__dirname, 'ReportesPdf/puntos_canjeados');
const templatePath = path.resolve(__dirname, 'data/Reportes/puntos_canjeados_template.html');
const dataScriptPath = path.resolve(__dirname, 'data/Reportes/puntos_canjeados_report.js');
const { run } = require(dataScriptPath);

async function generarReporte() {
    try {
        await jsreport.init();

        console.log('🔄 Generando reporte de puntos canjeados...');

        const data = await run();

        console.log('✅ Datos obtenidos correctamente');
        console.log(`📊 Total de clientes: ${data.resumen?.total_clientes_afiliados || 0}`);
        console.log(`💰 Valor total: Bs. ${data.resumen?.total_bolivares || '0.00'}`);

        const result = await jsreport.render({
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

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const now = new Date();
        const fecha = now.toISOString().split('T')[0];
        const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const outputPath = path.join(outputDir, `reporte_puntos_canjeados_${fecha}_${hora}.html`);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

        console.log('✅ Reporte generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);
        console.log(`📅 Período: ${data.fechaInicio} - ${data.fechaFin}`);

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
        await jsreport.close();
    }
}

// Función para generar reporte con fechas personalizadas
async function generarReporteConFechas(fechaInicio, fechaFin) {
    try {
        await jsreport.init();

        console.log(`🔄 Generando reporte para el período: ${fechaInicio} - ${fechaFin}`);

        const { run } = require(dataScriptPath);
        const data = await run(fechaInicio, fechaFin);

        const result = await jsreport.render({
            template: {
                content: fs.readFileSync(templatePath, 'utf8'),
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

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `reporte_puntos_canjeados_${fechaInicio}_${fechaFin}.html`);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

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
                content: fs.readFileSync(templatePath, 'utf8'),
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

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const now = new Date();
        const fecha = now.toISOString().split('T')[0];
        const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const outputPath = path.join(outputDir, `reporte_puntos_canjeados_${fecha}_${hora}.pdf`);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

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
    generarReporte();
} else if (args[0] === '--fechas' && args.length === 3) {
    generarReporteConFechas(args[1], args[2]);
} else if (args[0] === '--pdf') {
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