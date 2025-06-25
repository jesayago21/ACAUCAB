const fs = require('fs');
const path = require('path');
const jsreport = require('jsreport')();

// Usa rutas absolutas para todo
const outputDir = path.resolve(__dirname, 'ReportesPdf/comparativa_ingresos');
const templatePath = path.resolve(__dirname, 'data/Reportes/comparativa_ingresos_cerveza_template.html');
const dataScriptPath = path.resolve(__dirname, 'data/Reportes/comparativa_ingresos_cerveza_report.js');
const { run } = require(dataScriptPath);

async function generarReporte(fechaInicio = null, fechaFin = null) {
    try {
        await jsreport.init();

        console.log('🔄 Generando reporte de comparativa de ingresos por tipo de cerveza...');
        
        if (fechaInicio && fechaFin) {
            console.log(`📅 Período: Del ${fechaInicio} al ${fechaFin}`);
        } else if (fechaInicio) {
            console.log(`📅 Desde: ${fechaInicio}`);
        } else if (fechaFin) {
            console.log(`📅 Hasta: ${fechaFin}`);
        } else {
            console.log('📅 Período: Todos los datos disponibles');
        }

        const data = await run(fechaInicio, fechaFin);

        console.log('✅ Datos obtenidos correctamente');
        console.log(`📊 Total de ventas analizadas: ${data.resumen?.total_ventas || 0}`);
        console.log(`💰 Ingresos totales: $${data.resumen?.total_ingresos || '0.00'}`);
        console.log(`🍺 Participación Ale: ${data.resumen?.ale?.porcentaje || '0'}%`);
        console.log(`🍺 Participación Lager: ${data.resumen?.lager?.porcentaje || '0'}%`);

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
        const outputPath = path.join(outputDir, `reporte_comparativa_ingresos_cerveza_${fecha}_${hora}.html`);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

        console.log('✅ Reporte HTML generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);
        console.log(`📅 Fecha de generación: ${data.fechaGeneracion} ${data.horaGeneracion}`);

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
        await jsreport.close();
    }
}

// Ejecutar según los argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length === 0) {
    // Sin parámetros: generar reporte con todos los datos
    generarReporte();
} else if (args.length === 1) {
    // Un parámetro: fecha de inicio
    generarReporte(args[0]);
} else if (args.length === 2) {
    // Dos parámetros: fecha de inicio y fin
    generarReporte(args[0], args[1]);
} else {
    console.log('❌ Uso incorrecto. Opciones:');
    console.log('   node generar_reporte_comparativa_cerveza.js                    # Todos los datos');
    console.log('   node generar_reporte_comparativa_cerveza.js 2024-01-01        # Desde fecha');
    console.log('   node generar_reporte_comparativa_cerveza.js 2024-01-01 2024-12-31  # Rango de fechas');
}

module.exports = {
    generarReporte
};