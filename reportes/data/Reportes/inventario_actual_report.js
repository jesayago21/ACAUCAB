const pool = require('../../../backend/config/db');

async function run() {
    try {
        const result = await pool.query('SELECT * FROM reporte_inventario_actual()');
        const productos = result.rows;

        const resumen = {
            total_productos: productos.length,
            valor_total_inventario: productos.reduce((acc, p) => acc + parseFloat(p.valor_inventario || 0), 0).toFixed(2)
        };

        const data = {
            fechaGeneracion: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            productos: productos.map(p => ({
                ...p,
                valor_inventario: parseFloat(p.valor_inventario || 0).toFixed(2)
            })),
            resumen
        };

        return data;

    } catch (error) {
        console.error('❌ Error en el script del reporte de inventario actual:', error);
        throw error;
    }
}

module.exports = { run }; 