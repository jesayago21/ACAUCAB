const pool = require('../../../backend/config/db');

async function run(fechaInicio = null, fechaFin = null) {
    try {
        // Validar y procesar las fechas
        let fechaIni = fechaInicio;
        let fechaFinParam = fechaFin;
        let usandoFechasPorDefecto = false;

        console.log('📋 Parámetros recibidos en reporte de tendencia de ventas:');
        console.log(`   • fechaInicio: ${fechaInicio || 'NO PROPORCIONADA'}`);
        console.log(`   • fechaFin: ${fechaFin || 'NO PROPORCIONADA'}`);

        // Si no se pasan fechas, usar valores por defecto (últimos 30 días)
        if (!fechaIni || !fechaFinParam) {
            usandoFechasPorDefecto = true;
            const hoy = new Date();
            fechaFinParam = hoy.toISOString().slice(0, 10); // 'YYYY-MM-DD'
            const inicio = new Date();
            inicio.setDate(hoy.getDate() - 30);
            fechaIni = inicio.toISOString().slice(0, 10); // 'YYYY-MM-DD'
            
            console.log('⚠️  Usando fechas por defecto (últimos 30 días)');
            console.log(`   • fechaIni por defecto: ${fechaIni}`);
            console.log(`   • fechaFin por defecto: ${fechaFinParam}`);
        }

        // Validar formato de fechas
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(fechaIni) || !fechaRegex.test(fechaFinParam)) {
            throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
        }

        // Validar que fecha inicio no sea mayor que fecha fin
        if (new Date(fechaIni) > new Date(fechaFinParam)) {
            throw new Error('La fecha de inicio no puede ser mayor que la fecha de fin');
        }

        console.log('🔄 Ejecutando consulta de tendencia de ventas...');
        console.log(`📅 Período: ${fechaIni} a ${fechaFinParam}`);

        // Construir la consulta con filtros de fecha
        const query = `
            SELECT 
                fecha,
                SUM(ingreso_total) as total_diario
            FROM v_comparativa_ingresos_cerveza
            WHERE fecha BETWEEN $1 AND $2
            GROUP BY fecha
            ORDER BY fecha ASC
        `;
        
        const params = [fechaIni, fechaFinParam];
        
        console.log('🔍 Ejecutando consulta SQL con parámetros:', params);
        const result = await pool.query(query, params);
        const ventasDiarias = result.rows;
        
        console.log(`✅ Consulta completada. Se encontraron ${ventasDiarias.length} días con ventas.`);
        
        // Procesar los datos para el gráfico
        const labels = ventasDiarias.map(v => new Date(v.fecha).toLocaleDateString('es-ES'));
        const dataPoints = ventasDiarias.map(v => parseFloat(v.total_diario));
        
        const resumen = {
            total_dias: ventasDiarias.length,
            total_ingresos: dataPoints.reduce((acc, val) => acc + val, 0),
            dia_mayor_venta: { fecha: '', monto: 0 },
            dia_menor_venta: { fecha: '', monto: Infinity }
        };

        let maxVenta = 0;
        let minVenta = Infinity;

        ventasDiarias.forEach(venta => {
            const monto = parseFloat(venta.total_diario);
            if (monto > maxVenta) {
                maxVenta = monto;
                resumen.dia_mayor_venta = {
                    fecha: new Date(venta.fecha).toLocaleDateString('es-ES'),
                    monto: monto
                };
            }
            if (monto < minVenta) {
                minVenta = monto;
                resumen.dia_menor_venta = {
                    fecha: new Date(venta.fecha).toLocaleDateString('es-ES'),
                    monto: monto
                };
            }
        });

        if (resumen.dia_menor_venta.monto === Infinity) {
            resumen.dia_menor_venta.monto = 0;
        }

        // Preparar datos para el template
        const data = {
            fechaGeneracion: new Date().toLocaleDateString('es-ES'),
            horaGeneracion: new Date().toLocaleTimeString('es-ES'),
            periodoReporte: usandoFechasPorDefecto ? 
                `Período por defecto: Del ${new Date(fechaIni).toLocaleDateString('es-ES')} al ${new Date(fechaFinParam).toLocaleDateString('es-ES')}` :
                `Del ${new Date(fechaIni).toLocaleDateString('es-ES')} al ${new Date(fechaFinParam).toLocaleDateString('es-ES')}`,
            chartData: {
                labels: labels,
                data: dataPoints,
            },
            resumen: {
                ...resumen,
                total_ingresos: resumen.total_ingresos.toFixed(2),
                dia_mayor_venta: {
                    ...resumen.dia_mayor_venta,
                    monto: resumen.dia_mayor_venta.monto.toFixed(2)
                },
                dia_menor_venta: {
                    ...resumen.dia_menor_venta,
                    monto: resumen.dia_menor_venta.monto.toFixed(2)
                }
            },
            parametros: {
                fechaInicioOriginal: fechaInicio,
                fechaFinOriginal: fechaFin,
                fechaInicioProcesada: fechaIni,
                fechaFinProcesada: fechaFinParam,
                usandoFechasPorDefecto: usandoFechasPorDefecto
            }
        };

        console.log('📊 Datos procesados para el reporte de tendencias.');
        return data;

    } catch (error) {
        console.error('❌ Error en el script del reporte de tendencia de ventas:', error);
        // Lanzar el error para que el generador del reporte lo capture
        throw error;
    }
}

module.exports = { run }; 