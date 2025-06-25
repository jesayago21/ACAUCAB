const fs = require('fs');
const path = require('path');
const jsreport = require('jsreport')();

// Usa rutas absolutas para todo
const outputDir = path.resolve(__dirname, 'ReportesPdf/ingresos_eventos');
const templatePath = path.resolve(__dirname, 'data/Reportes/venta_evento_entrada_template.html');
const dataScriptPath = path.resolve(__dirname, 'data/Reportes/venta_evento_entrada_report.js');
const { run } = require(dataScriptPath);

async function generarReporte() {
    try {
        await jsreport.init();

        console.log('🔄 Generando reporte de ingresos por evento...');

        const data = await run();

        console.log('✅ Datos obtenidos correctamente');
        console.log(`📊 Eventos analizados: ${data.resumen?.numero_eventos || 0}`);
        console.log(`💰 Ingresos totales: Bs. ${data.resumen?.gran_total_general || '0.00'}`);

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
        const outputPath = path.join(outputDir, `reporte_venta_evento_entrada_${fecha}_${hora}.html`);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

        console.log('✅ Reporte generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);
        console.log(`📅 Período: ${data.fechaInicio} - ${data.fechaFin}`);

        if (data.resumen) {
            console.log('\n📈 RESUMEN DEL REPORTE:');
            console.log(`   • Eventos Analizados: ${data.resumen.numero_eventos}`);
            console.log(`   • Ingresos por Entradas:  Bs. ${data.resumen.gran_total_entradas}`);
            console.log(`   • Ingresos por Productos: Bs. ${data.resumen.gran_total_productos}`);
            console.log(`   • Ingresos Totales:       Bs. ${data.resumen.gran_total_general}`);
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
                    function formatCurrency(value) {
                        const number = Number(value);
                        return !isNaN(number) ? number.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") : '0.00';
                    }
                    function eq(a, b) { return a === b; }
                `
            },
            data: data
        });

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `reporte_venta_evento_entrada_${fechaInicio}_${fechaFin}.html`);
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

        console.log('🔄 Generando reporte PDF de ingresos por evento...');

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
        const outputPath = path.join(outputDir, `reporte_venta_evento_entrada_${fecha}_${hora}.pdf`);
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
    console.log('   node generar_reporte_ventas_entradas.js                    # Reporte con fechas por defecto (últimos 30 días)');
    console.log('   node generar_reporte_ventas_entradas.js --fechas 2024-01-01 2024-12-31  # Fechas personalizadas');
    console.log('   node generar_reporte_ventas_entradas.js --pdf              # Reporte en PDF');
    console.log('');
    console.log('📊 Descripción:');
    console.log('   Análisis de ventas de eventos (entradas y productos).');
    console.log('   Por defecto analiza los últimos 30 días si no se especifican fechas.');
    console.log('');
    console.log('📅 Ejemplos:');
    console.log('   node generar_reporte_ventas_entradas.js --fechas 2024-11-01 2024-11-30  # Noviembre 2024');
    console.log('   node generar_reporte_ventas_entradas.js --fechas 2023-01-01 2023-12-31  # Año 2023');
}

module.exports = {
    generarReporte,
    generarReporteConFechas,
    generarReportePDF
};