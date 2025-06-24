const fs = require('fs');
const path = require('path');
const jsreport = require('jsreport')();

// Usa rutas absolutas para todo
const outputDir = path.resolve(__dirname, 'ReportesPdf/analisis_ibu');
const templatePath = path.resolve(__dirname, 'data/Reportes/analisis_ibu_template.html');
const dataScriptPath = path.resolve(__dirname, 'data/Reportes/analisis_ibu_report.js');
const { run } = require(dataScriptPath);

async function generarReporte() {
    try {
        await jsreport.init();

        console.log('🔄 Generando reporte de análisis comparativo de IBU...');

        const data = await run();

        console.log('✅ Datos obtenidos correctamente');
        console.log(`📊 Total de productores: ${data.resumen?.total_productores || 0}`);
        console.log(`🍺 Total de cervezas: ${data.resumen?.total_cervezas || 0}`);
        console.log(`📈 IBU promedio: ${data.resumen?.promedio_ibu || '0.0'}`);

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
        const outputPath = path.join(outputDir, `reporte_analisis_ibu_${fecha}_${hora}.html`);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

        console.log('✅ Reporte generado exitosamente!');
        console.log(`📁 Archivo guardado en: ${outputPath}`);
        console.log(`📅 Fecha de generación: ${data.fechaGeneracion}`);

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
        const outputPath = path.join(outputDir, `reporte_analisis_ibu_${fecha}_${hora}.pdf`);
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
} else if (args[0] === '--pdf') {
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