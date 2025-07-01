const fs = require('fs');
const path = require('path');
const jsreport = require('jsreport')();

const outputDir = path.resolve(__dirname, 'ReportesPdf/mejores_productos');
const templatePath = path.resolve(__dirname, 'data/Reportes/mejores_productos_template.html');
const dataScriptPath = path.resolve(__dirname, 'data/Reportes/mejores_productos_report.js');
const { run } = require(dataScriptPath);

async function generarReporteConFechas(fechaInicio, fechaFin) {
    try {
        await jsreport.init();

        const data = await run(fechaInicio, fechaFin);
        
        const result = await jsreport.render({
            template: {
                content: fs.readFileSync(templatePath, 'utf8'),
                engine: 'handlebars',
                recipe: 'html',
                helpers: `
                    function add(a, b) { return a + b; }
                `
            },
            data: data
        });

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const fileName = fechaInicio && fechaFin 
            ? `reporte_mejores_productos_${fechaInicio}_${fechaFin}.html`
            : `reporte_mejores_productos_${new Date().toISOString().split('T')[0]}.html`;

        const outputPath = path.join(outputDir, fileName);
        fs.writeFileSync(outputPath, result.content);
        console.log(`ARCHIVO_REPORTE: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error generando el reporte de mejores productos:', error);
        process.exit(1);
    } finally {
        if (jsreport.close) await jsreport.close();
    }
}

const args = process.argv.slice(2);
generarReporteConFechas(args[0] || null, args[1] || null);

module.exports = { generarReporteConFechas }; 