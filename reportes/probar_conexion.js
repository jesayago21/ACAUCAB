const { Client } = require('pg');

// Configuraciones comunes a probar
const configuraciones = [
    // Configuración original
    {
        host: 'localhost',
        port: 5432,
        database: 'grupo7',
        user: 'grupo7',
        password: '123456'
    },
    // Configuración con usuario postgres
    {
        host: 'localhost',
        port: 5432,
        database: 'grupo7',
        user: 'postgres',
        password: 'postgres'
    },
    // Configuración con usuario postgres y contraseña vacía
    {
        host: 'localhost',
        port: 5432,
        database: 'grupo7',
        user: 'postgres',
        password: ''
    },
    // Configuración con usuario postgres y contraseña admin
    {
        host: 'localhost',
        port: 5432,
        database: 'grupo7',
        user: 'postgres',
        password: 'admin'
    },
    // Configuración con usuario postgres y contraseña 123456
    {
        host: 'localhost',
        port: 5432,
        database: 'grupo7',
        user: 'postgres',
        password: '123456'
    },
    // Configuración con base de datos postgres
    {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'postgres'
    }
];

async function probarConexion(config) {
    const client = new Client(config);
    
    try {
        console.log(`🔄 Probando: ${config.user}@${config.host}:${config.port}/${config.database}`);
        await client.connect();
        
        // Probar consulta simple
        const result = await client.query('SELECT version()');
        console.log('✅ Conexión exitosa!');
        
        // Verificar si existe la base de datos grupo7
        const dbResult = await client.query(`
            SELECT datname FROM pg_database WHERE datname = 'grupo7'
        `);
        
        if (dbResult.rows.length > 0) {
            console.log('✅ Base de datos "grupo7" encontrada');
            
            // Conectar a grupo7 y verificar tablas
            await client.end();
            const clientGrupo7 = new Client({
                ...config,
                database: 'grupo7'
            });
            
            await clientGrupo7.connect();
            
            const tablasResult = await clientGrupo7.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('pago', 'cliente', 'venta_online', 'metodo_de_pago', 'tasa_cambio', 'usuario')
                ORDER BY table_name
            `);
            
            console.log('📋 Tablas encontradas:');
            tablasResult.rows.forEach(row => {
                console.log(`   • ${row.table_name}`);
            });
            
            await clientGrupo7.end();
            
            // Actualizar configuración
            actualizarConfiguracion(config);
            return true;
        } else {
            console.log('⚠️  Base de datos "grupo7" no encontrada');
            await client.end();
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return false;
    }
}

function actualizarConfiguracion(config) {
    const fs = require('fs');
    
    try {
        // Actualizar jsreport.config.json
        const jsreportConfig = JSON.parse(fs.readFileSync('./jsreport.config.json', 'utf8'));
        jsreportConfig.extensions.data.extensions.postgres.connectionString = 
            `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
        
        fs.writeFileSync('./jsreport.config.json', JSON.stringify(jsreportConfig, null, 2));
        console.log('✅ jsreport.config.json actualizado');
        
        // Actualizar script de datos
        const dataScript = fs.readFileSync('./data/Reportes/puntos_canjeados_report.js', 'utf8');
        const updatedScript = dataScript.replace(
            /connectionString: 'postgres:\/\/.*?@localhost:5432\/.*?'/,
            `connectionString: 'postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}'`
        );
        
        fs.writeFileSync('./data/Reportes/puntos_canjeados_report.js', updatedScript);
        console.log('✅ Script de datos actualizado');
        
        console.log('\n🚀 Configuración actualizada. Ahora puedes ejecutar:');
        console.log('   node generar_reporte_puntos.js');
        
    } catch (error) {
        console.error('❌ Error actualizando configuración:', error.message);
    }
}

async function main() {
    console.log('🔍 Probando configuraciones de conexión a PostgreSQL...\n');
    
    for (let i = 0; i < configuraciones.length; i++) {
        console.log(`\n--- Prueba ${i + 1}/${configuraciones.length} ---`);
        const exito = await probarConexion(configuraciones[i]);
        
        if (exito) {
            console.log('\n🎉 ¡Configuración encontrada y actualizada!');
            break;
        }
    }
    
    console.log('\n📝 Si ninguna configuración funcionó, verifica:');
    console.log('1. Que PostgreSQL esté corriendo');
    console.log('2. El usuario y contraseña correctos');
    console.log('3. Que la base de datos "grupo7" exista');
    console.log('4. Ejecuta: pgAdmin o psql para verificar la configuración');
}

main().catch(console.error); 