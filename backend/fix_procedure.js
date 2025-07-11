const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'acaucab',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function fixProcedure() {
  try {
    const client = await pool.connect();
    
    // Procedimiento corregido
    const procedureSQL = `
    CREATE OR REPLACE FUNCTION obtener_miembros_proveedores()
    RETURNS TABLE (
        rif INT,
        razon_social VARCHAR(100),
        denominacion_comercial VARCHAR(100),
        total_compras INT,
        ultimo_pedido DATE
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN QUERY
        SELECT 
            m.rif,
            m.razon_social,
            m.denominacion_comercial,
            COUNT(c.clave)::INT as total_compras,
            MAX(c.fecha) as ultimo_pedido
        FROM miembro m
        LEFT JOIN compra c ON m.rif = c.fk_miembro
        GROUP BY m.rif, m.razon_social, m.denominacion_comercial
        ORDER BY m.razon_social;
    END;
    $$;
    `;
    
    await client.query(procedureSQL);
    console.log('✅ Procedimiento corregido exitosamente');
    
    // Probar el procedimiento
    const result = await client.query('SELECT * FROM obtener_miembros_proveedores() LIMIT 5');
    console.log('✅ Prueba del procedimiento exitosa. Resultados:');
    console.log(result.rows);
    
    client.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixProcedure(); 