const pool = require('../../../backend/config/db');

async function run() {
    try {
        // Consulta para obtener cervezas American Amber Ale y American Pale Ale
        const query = `
            SELECT 
                m.denominacion_comercial AS productor,
                c.nombre AS cerveza,
                tc.nombre AS tipo_cerveza,
                c.grado_alcohol,
                m.razon_social,
                m.direccion_fiscal,
                cc.valor AS ibu
            FROM cerveza c
            JOIN miembro m ON c.fk_miembro = m.rif
            JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
            LEFT JOIN car_cer cc ON cc.fk_cerveza = c.clave
            LEFT JOIN caracteristica ca ON cc.fk_caracteristica = ca.clave
            WHERE tc.nombre IN ('American Amber Ale', 'American Pale Ale')
                AND (ca.nombre = 'Amargor (IBU)' OR ca.nombre IS NULL)
            ORDER BY m.denominacion_comercial, tc.nombre, cc.valor DESC
        `;
        
        const result = await pool.query(query);
        
        // Procesar los datos
        const cervezas = result.rows;
        
        // Agrupar por productor
        const productores = {};
        let totalCervezas = 0;
        let totalIBU = 0;
        let cervezasConIBU = 0;
        
        cervezas.forEach(cerveza => {
            if (!productores[cerveza.productor]) {
                productores[cerveza.productor] = {
                    razon_social: cerveza.razon_social,
                    direccion: cerveza.direccion_fiscal,
                    american_amber_ale: [],
                    american_pale_ale: []
                };
            }
            
            const cervezaData = {
                nombre: cerveza.cerveza,
                ibu: cerveza.ibu || 'No especificado',
                grado_alcohol: cerveza.grado_alcohol
            };
            
            if (cerveza.tipo_cerveza === 'American Amber Ale') {
                productores[cerveza.productor].american_amber_ale.push(cervezaData);
            } else if (cerveza.tipo_cerveza === 'American Pale Ale') {
                productores[cerveza.productor].american_pale_ale.push(cervezaData);
            }
            
            totalCervezas++;
            if (cerveza.ibu && !isNaN(cerveza.ibu)) {
                totalIBU += parseFloat(cerveza.ibu);
                cervezasConIBU++;
            }
        });
        
        // Calcular estadísticas
        const promedioIBU = cervezasConIBU > 0 ? (totalIBU / cervezasConIBU).toFixed(1) : 0;
        
        // Encontrar valores máximos y mínimos
        let maxIBU = 0;
        let minIBU = Infinity;
        let cervezaMaxIBU = '';
        let cervezaMinIBU = '';
        let productorMaxIBU = '';
        let productorMinIBU = '';
        
        cervezas.forEach(cerveza => {
            if (cerveza.ibu && !isNaN(cerveza.ibu)) {
                const ibu = parseFloat(cerveza.ibu);
                if (ibu > maxIBU) {
                    maxIBU = ibu;
                    cervezaMaxIBU = cerveza.cerveza;
                    productorMaxIBU = cerveza.productor;
                }
                if (ibu < minIBU) {
                    minIBU = ibu;
                    cervezaMinIBU = cerveza.cerveza;
                    productorMinIBU = cerveza.productor;
                }
            }
        });
        
        // Preparar datos para el template
        const data = {
            fechaGeneracion: new Date().toLocaleDateString('es-ES'),
            horaGeneracion: new Date().toLocaleTimeString('es-ES'),
            resumen: {
                total_productores: Object.keys(productores).length,
                total_cervezas: totalCervezas,
                cervezas_con_ibu: cervezasConIBU,
                promedio_ibu: promedioIBU,
                max_ibu: maxIBU,
                min_ibu: minIBU === Infinity ? 0 : minIBU,
                cerveza_max_ibu: cervezaMaxIBU,
                cerveza_min_ibu: cervezaMinIBU,
                productor_max_ibu: productorMaxIBU,
                productor_min_ibu: productorMinIBU
            },
            productores: Object.entries(productores).map(([nombre, datos]) => ({
                nombre: nombre,
                razon_social: datos.razon_social,
                direccion: datos.direccion,
                american_amber_ale: datos.american_amber_ale,
                american_pale_ale: datos.american_pale_ale,
                total_cervezas: datos.american_amber_ale.length + datos.american_pale_ale.length
            })),
            rangos_ibu: {
                american_amber_ale: {
                    minimo: 25,
                    maximo: 40,
                    descripcion: 'Moderado a alto amargor con notas de caramelo'
                },
                american_pale_ale: {
                    minimo: 30,
                    maximo: 50,
                    descripcion: 'Alto amargor con notas cítricas y florales'
                }
            }
        };
        
        return data;
        
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }
}

module.exports = { run }; 