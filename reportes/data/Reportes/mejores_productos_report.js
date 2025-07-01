const pool = require('../../../backend/config/db');

async function run(fechaInicio = null, fechaFin = null) {
    try {
        let fechaIni = fechaInicio;
        let fechaFinParam = fechaFin;
        let usandoFechasPorDefecto = false;

        if (!fechaIni || !fechaFinParam) {
            usandoFechasPorDefecto = true;
            const hoy = new Date();
            fechaFinParam = hoy.toISOString().slice(0, 10);
            const inicio = new Date();
            inicio.setDate(hoy.getDate() - 30);
            fechaIni = inicio.toISOString().slice(0, 10);
        }

        const query = `
            WITH ventas_periodo AS (
                SELECT * FROM v_comparativa_ingresos_cerveza
                WHERE fecha BETWEEN $1 AND $2
            )
            SELECT
                cerveza,
                productor,
                categoria_cerveza,
                SUM(cantidad) AS unidades_vendidas,
                SUM(ingreso_total) AS ingresos_generados
            FROM ventas_periodo
            GROUP BY cerveza, productor, categoria_cerveza
            ORDER BY ingresos_generados DESC
            LIMIT 10;
        `;
        
        const params = [fechaIni, fechaFinParam];
        const result = await pool.query(query, params);
        const productos = result.rows;

        const resumen = {
            total_productos: productos.length,
            top_producto_ingresos: productos.length > 0 ? productos[0].cerveza : 'N/A',
            total_ingresos_top10: productos.reduce((acc, p) => acc + parseFloat(p.ingresos_generados), 0),
        };

        const data = {
            fechaGeneracion: new Date().toLocaleDateString('es-ES'),
            horaGeneracion: new Date().toLocaleTimeString('es-ES'),
            periodoReporte: usandoFechasPorDefecto 
                ? `Últimos 30 días (${new Date(fechaIni).toLocaleDateString('es-ES')} - ${new Date(fechaFinParam).toLocaleDateString('es-ES')})`
                : `Del ${new Date(fechaIni).toLocaleDateString('es-ES')} al ${new Date(fechaFinParam).toLocaleDateString('es-ES')}`,
            productos: productos.map(p => ({
                ...p,
                unidades_vendidas: parseInt(p.unidades_vendidas),
                ingresos_generados: parseFloat(p.ingresos_generados).toFixed(2),
            })),
            resumen: {
                ...resumen,
                total_ingresos_top10: resumen.total_ingresos_top10.toFixed(2),
            },
            parametros: {
                fechaInicioOriginal: fechaInicio,
                fechaFinOriginal: fechaFin,
            }
        };

        return data;

    } catch (error) {
        console.error('❌ Error en el script del reporte de mejores productos:', error);
        throw error;
    }
}

module.exports = { run }; 