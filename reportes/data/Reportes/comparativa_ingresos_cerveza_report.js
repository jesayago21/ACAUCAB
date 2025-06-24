const pool = require('../../../backend/config/db');

async function run() {
    try {
        // Consulta simplificada usando la vista
        const query = `
            SELECT 
                fecha,
                canal_venta,
                categoria_cerveza,
                productor,
                cerveza,
                tipo_cerveza,
                cantidad,
                precio_unitario,
                ingreso_total,
                año,
                mes,
                periodo
            FROM v_comparativa_ingresos_cerveza
            ORDER BY fecha DESC, canal_venta, categoria_cerveza
        `;
        
        const result = await pool.query(query);
        const ventas = result.rows;
        
        // Procesar los datos
        const resumen = {
            total_ventas: ventas.length,
            total_ingresos: 0,
            ale: { total_ingresos: 0, total_unidades: 0, ventas_fisica: 0, ventas_online: 0 },
            lager: { total_ingresos: 0, total_unidades: 0, ventas_fisica: 0, ventas_online: 0 },
            total_unidades: 0
        };
        
        // Agrupar por período (mes)
        const ventas_por_periodo = {};
        const cervezas_populares = {};
        const productores_ranking = {};
        
        ventas.forEach(venta => {
            const periodo = venta.periodo; // Ya viene formateado como YYYY-MM
            
            // Inicializar estructuras si no existen
            if (!ventas_por_periodo[periodo]) {
                ventas_por_periodo[periodo] = {
                    ale: { ingresos: 0, unidades: 0, fisica: 0, online: 0 },
                    lager: { ingresos: 0, unidades: 0, fisica: 0, online: 0 }
                };
            }
            
            if (!cervezas_populares[venta.cerveza]) {
                cervezas_populares[venta.cerveza] = {
                    categoria: venta.categoria_cerveza,
                    productor: venta.productor,
                    ingresos: 0,
                    unidades: 0,
                    fisica: 0,
                    online: 0
                };
            }
            
            if (!productores_ranking[venta.productor]) {
                productores_ranking[venta.productor] = {
                    ale: { ingresos: 0, unidades: 0 },
                    lager: { ingresos: 0, unidades: 0 }
                };
            }
            
            // Acumular datos
            const ingreso = venta.ingreso_total;
            const categoria = venta.categoria_cerveza.toLowerCase();
            const canal = venta.canal_venta.toLowerCase();
            
            // Resumen general
            resumen.total_ingresos += ingreso;
            resumen[categoria].total_ingresos += ingreso;
            resumen[categoria].total_unidades += venta.cantidad;
            resumen.total_unidades += venta.cantidad;
            if (canal === 'física') {
                resumen[categoria].ventas_fisica += ingreso;
            } else {
                resumen[categoria].ventas_online += ingreso;
            }
            
            // Por período
            ventas_por_periodo[periodo][categoria].ingresos += ingreso;
            ventas_por_periodo[periodo][categoria].unidades += venta.cantidad;
            if (canal === 'física') {
                ventas_por_periodo[periodo][categoria].fisica += ingreso;
            } else {
                ventas_por_periodo[periodo][categoria].online += ingreso;
            }
            
            // Cervezas populares
            cervezas_populares[venta.cerveza].ingresos += ingreso;
            cervezas_populares[venta.cerveza].unidades += venta.cantidad;
            if (canal === 'física') {
                cervezas_populares[venta.cerveza].fisica += ingreso;
            } else {
                cervezas_populares[venta.cerveza].online += ingreso;
            }
            
            // Productores
            productores_ranking[venta.productor][categoria].ingresos += ingreso;
            productores_ranking[venta.productor][categoria].unidades += venta.cantidad;
        });
        
        // Calcular porcentajes y estadísticas
        const porcentaje_ale = resumen.total_ingresos > 0 ? ((resumen.ale.total_ingresos / resumen.total_ingresos) * 100).toFixed(1) : 0;
        const porcentaje_lager = resumen.total_ingresos > 0 ? ((resumen.lager.total_ingresos / resumen.total_ingresos) * 100).toFixed(1) : 0;
        
        // Top 5 cervezas por ingresos
        const top_cervezas = Object.entries(cervezas_populares)
            .sort(([,a], [,b]) => b.ingresos - a.ingresos)
            .slice(0, 5)
            .map(([nombre, datos]) => ({
                nombre,
                categoria: datos.categoria,
                productor: datos.productor,
                ingresos: datos.ingresos,
                unidades: datos.unidades,
                porcentaje_fisica: datos.ingresos > 0 ? ((datos.fisica / datos.ingresos) * 100).toFixed(1) : 0,
                porcentaje_online: datos.ingresos > 0 ? ((datos.online / datos.ingresos) * 100).toFixed(1) : 0
            }));
        
        // Top 5 productores por ingresos totales
        const top_productores = Object.entries(productores_ranking)
            .map(([nombre, datos]) => ({
                nombre,
                ingresos_ale: datos.ale.ingresos,
                ingresos_lager: datos.lager.ingresos,
                ingresos_totales: datos.ale.ingresos + datos.lager.ingresos,
                unidades_ale: datos.ale.unidades,
                unidades_lager: datos.lager.unidades,
                porcentaje_ale: (datos.ale.ingresos + datos.lager.ingresos) > 0 ? 
                    ((datos.ale.ingresos / (datos.ale.ingresos + datos.lager.ingresos)) * 100).toFixed(1) : 0,
                porcentaje_lager: (datos.ale.ingresos + datos.lager.ingresos) > 0 ? 
                    ((datos.lager.ingresos / (datos.ale.ingresos + datos.lager.ingresos)) * 100).toFixed(1) : 0
            }))
            .sort((a, b) => b.ingresos_totales - a.ingresos_totales)
            .slice(0, 5);
        
        // Preparar datos para el template
        const data = {
            fechaGeneracion: new Date().toLocaleDateString('es-ES'),
            horaGeneracion: new Date().toLocaleTimeString('es-ES'),
            resumen: {
                total_ventas: resumen.total_ventas,
                total_ingresos: resumen.total_ingresos.toFixed(2),
                ale: {
                    ingresos: resumen.ale.total_ingresos.toFixed(2),
                    unidades: resumen.ale.total_unidades,
                    ventas_fisica: resumen.ale.ventas_fisica.toFixed(2),
                    ventas_online: resumen.ale.ventas_online.toFixed(2),
                    porcentaje: porcentaje_ale
                },
                lager: {
                    ingresos: resumen.lager.total_ingresos.toFixed(2),
                    unidades: resumen.lager.total_unidades,
                    ventas_fisica: resumen.lager.ventas_fisica.toFixed(2),
                    ventas_online: resumen.lager.ventas_online.toFixed(2),
                    porcentaje: porcentaje_lager
                },
                total_unidades: resumen.total_unidades
            },
            ventas_por_periodo: Object.entries(ventas_por_periodo)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([periodo, datos]) => ({
                    periodo,
                    ale: {
                        ingresos: datos.ale.ingresos.toFixed(2),
                        unidades: datos.ale.unidades,
                        fisica: datos.ale.fisica.toFixed(2),
                        online: datos.ale.online.toFixed(2)
                    },
                    lager: {
                        ingresos: datos.lager.ingresos.toFixed(2),
                        unidades: datos.lager.unidades,
                        fisica: datos.lager.fisica.toFixed(2),
                        online: datos.lager.online.toFixed(2)
                    }
                })),
            top_cervezas,
            top_productores,
            analisis_tendencias: {
                canal_preferido_ale: resumen.ale.ventas_fisica > resumen.ale.ventas_online ? 'Física' : 'Online',
                canal_preferido_lager: resumen.lager.ventas_fisica > resumen.lager.ventas_online ? 'Física' : 'Online',
                categoria_dominante: resumen.ale.total_ingresos > resumen.lager.total_ingresos ? 'Ale' : 'Lager',
                diferencia_porcentual: Math.abs(porcentaje_ale - porcentaje_lager).toFixed(1)
            }
        };
        
        return data;
        
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }
}

module.exports = { run }; 