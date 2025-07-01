const fs = require('fs');
const path = require('path');
const jsreport = require('jsreport')();

// Usa rutas absolutas para todo
const outputDir = path.resolve(__dirname, 'ReportesPdf/tendencia_ventas');
const templatePath = path.resolve(__dirname, 'data/Reportes/tendencia_ventas_template.html');
const dataScriptPath = path.resolve(__dirname, 'data/Reportes/tendencia_ventas_report.js');
const { run } = require(dataScriptPath);

// Reporte HTML con fechas por defecto
async function generarReporte() {
    try {
        await jsreport.init();

        console.log('🔄 Generando reporte de tendencia de ventas...');
        console.log('📅 Período: Fechas por defecto (últimos 30 días)');

        const data = await run();

        console.log('✅ Datos obtenidos correctamente');
        console.log(`📊 Total de días con ventas: ${data.resumen?.total_dias || 0}`);
        console.log(`💰 Ingresos totales: $${data.resumen?.total_ingresos || '0.00'}`);

        const result = await jsreport.render({
            template: {
                content: fs.readFileSync(templatePath, 'utf8'),
                engine: 'handlebars',
                recipe: 'html',
                 helpers: `
                    function json(context) {
                        return JSON.stringify(context);
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
        const outputPath = path.join(outputDir, `reporte_tendencia_ventas_${fecha}_${hora}.html`);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

        console.log('✅ Reporte HTML generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error generando el reporte de tendencia de ventas:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
    } finally {
        if (jsreport.close) await jsreport.close();
    }
}

// Reporte HTML con fechas personalizadas
async function generarReporteConFechas(fechaInicio, fechaFin) {
    try {
        await jsreport.init();

        console.log('🔄 Generando reporte de tendencia de ventas...');
        console.log(`📅 Período: Del ${fechaInicio} al ${fechaFin}`);

        const data = await run(fechaInicio, fechaFin);

        console.log('✅ Datos obtenidos correctamente');
        console.log(`📊 Total de días con ventas: ${data.resumen?.total_dias || 0}`);
        console.log(`💰 Ingresos totales: $${data.resumen?.total_ingresos || '0.00'}`);

        const result = await jsreport.render({
            template: {
                content: fs.readFileSync(templatePath, 'utf8'),
                engine: 'handlebars',
                recipe: 'html',
                helpers: `
                    function json(context) {
                        return JSON.stringify(context);
                    }
                `
            },
            data: data
        });

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `reporte_tendencia_ventas_${fechaInicio}_${fechaFin}.html`);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

        console.log('✅ Reporte HTML generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error generando el reporte de tendencia de ventas:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
    } finally {
        if (jsreport.close) await jsreport.close();
    }
}

// Ejecutar según los argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length === 0) {
    generarReporte();
} else if (args.length === 2) {
    generarReporteConFechas(args[0], args[1]);
} else {
    console.log('❌ Uso incorrecto. Opciones:');
    console.log('   node generar_reporte_tendencia_ventas.js                    # Fechas por defecto');
    console.log('   node generar_reporte_tendencia_ventas.js 2024-01-01 2024-12-31  # Fechas específicas');
}

module.exports = {
    generarReporte,
    generarReporteConFechas
}; 