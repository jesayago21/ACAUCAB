const jsreport = require('jsreport')();
const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN DEL REPORTE ---
const reportName = 'venta_evento_entrada';
const reportTitle = 'Ingresos por Evento';
const dataScriptPath = `./data/Reportes/${reportName}_report.js`;
const templatePath = `./data/Reportes/${reportName}_template.html`;
const outputDir = `./ReportesPdf/ingresos_eventos`;

// Asegurarse de que el directorio de salida exista
fs.mkdirSync(outputDir, { recursive: true });

// Helper para formatear moneda, usado en la consola y en la plantilla
function formatCurrency(value) {
    const number = Number(value);
    return !isNaN(number) ? number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0.00';
}

// Función base para renderizar el reporte
async function renderReport(data, format = 'html') {
    const recipe = format === 'pdf' ? 'chrome-pdf' : 'html';
    const result = await jsreport.render({
        template: {
            content: fs.readFileSync(templatePath, 'utf8'),
            engine: 'handlebars',
            recipe: recipe,
            helpers: `
                function formatCurrency(value) {
                    const number = Number(value);
                    return !isNaN(number) ? number.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") : '0.00';
                }
                function eq(a, b) { return a === b; }
            `,
            chrome: { // Opciones para PDF
                format: 'A4',
                landscape: true, // La tabla puede ser ancha, modo paisaje es mejor
                marginTop: '1.5cm',
                marginLeft: '1.5cm',
                marginRight: '1.5cm',
                marginBottom: '1.5cm'
            }
        },
        data: data
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = data.customFileName ? `reporte_${reportName}_${data.customFileName}.${format}` : `reporte_${reportName}_${timestamp}.${format}`;
    const outputPath = path.join(outputDir, fileName);
    
    fs.writeFileSync(outputPath, result.content);

    console.log(`✅ Reporte en ${format.toUpperCase()} generado exitosamente!`);
    console.log(`📁 Archivo guardado en: ${outputPath}`);
    console.log(`📅 Período: ${data.fechaInicio} - ${data.fechaFin}`);

    if (data.resumen) {
        console.log('\n📈 RESUMEN DEL REPORTE:');
        console.log(`   • Eventos Analizados: ${data.resumen.numero_eventos}`);
        console.log(`   • Ingresos por Entradas:  Bs. ${formatCurrency(data.resumen.gran_total_entradas)}`);
        console.log(`   • Ingresos por Productos: Bs. ${formatCurrency(data.resumen.gran_total_productos)}`);
        console.log(`   • Ingresos Totales:       Bs. ${formatCurrency(data.resumen.gran_total_general)}`);
    }
}


// --- FUNCIONES DE GENERACIÓN ---

// Generar con fechas por defecto (del script de datos)
async function generarReporte(format = 'html') {
    try {
        await jsreport.init();
        console.log(`🔄 Generando reporte de ${reportTitle} con fechas por defecto...`);
        const { run } = require(dataScriptPath);
        const data = await run();
        await renderReport(data, format);
    } catch (error) {
        console.error('❌ Error generando el reporte:', error.message, error.stack);
    } finally {
        await jsreport.close();
    }
}

// Generar con fechas personalizadas desde la línea de comandos
async function generarReporteConFechas(fechaInicio, fechaFin, format = 'html') {
    let tempScriptPath = '';
    try {
        await jsreport.init();
        console.log(`🔄 Generando reporte para el período: ${fechaInicio} - ${fechaFin}`);
        
        const dataScript = fs.readFileSync(dataScriptPath, 'utf8');
        const modifiedScript = dataScript
            .replace(/const fechaInicio = '.*?';/, `const fechaInicio = '${fechaInicio}';`)
            .replace(/const fechaFin = '.*?';/, `const fechaFin = '${fechaFin}';`);
        
        tempScriptPath = `./data/Reportes/${reportName}_report_temp.js`;
        fs.writeFileSync(tempScriptPath, modifiedScript);
        
        delete require.cache[require.resolve(path.resolve(tempScriptPath))];
        const { run: runModified } = require(tempScriptPath);
        
        const data = await runModified();
        data.customFileName = `${fechaInicio}_a_${fechaFin}`;
        
        await renderReport(data, format);

    } catch (error) {
        console.error('❌ Error generando el reporte con fechas personalizadas:', error.message, error.stack);
    } finally {
        if (tempScriptPath && fs.existsSync(tempScriptPath)) {
            fs.unlinkSync(tempScriptPath); // Limpiar archivo temporal
        }
        await jsreport.close();
    }
}


// --- EJECUCIÓN DESDE LÍNEA DE COMANDOS ---

(async () => {
    const args = process.argv.slice(2);
    const scriptName = path.basename(__filename);

    if (args.includes('--pdf')) {
        const fechasIndex = args.indexOf('--fechas');
        if (fechasIndex !== -1 && args.length > fechasIndex + 2) {
            await generarReporteConFechas(args[fechasIndex + 1], args[fechasIndex + 2], 'pdf');
        } else {
            await generarReporte('pdf');
        }
    } else if (args.includes('--fechas')) {
        const fechasIndex = args.indexOf('--fechas');
        if (args.length > fechasIndex + 2) {
            await generarReporteConFechas(args[fechasIndex + 1], args[fechasIndex + 2], 'html');
        } else {
            showHelp(scriptName);
        }
    } else if (args.length === 0) {
        await generarReporte('html');
    } else {
        showHelp(scriptName);
    }
})();

function showHelp(scriptName) {
    console.log('📖 Uso del script:');
    console.log(`   node ${scriptName}                    # Reporte HTML con fechas por defecto`);
    console.log(`   node ${scriptName} --pdf              # Reporte PDF con fechas por defecto`);
    console.log(`   node ${scriptName} --fechas YYYY-MM-DD YYYY-MM-DD  # Reporte HTML con fechas personalizadas`);
    console.log(`   node ${scriptName} --fechas YYYY-MM-DD YYYY-MM-DD --pdf # Reporte PDF con fechas personalizadas`);
    console.log('');
    console.log('📅 Ejemplo:');
    console.log(`   node ${scriptName} --fechas 2024-11-01 2024-11-30 --pdf`);
}
