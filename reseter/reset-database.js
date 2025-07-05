const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

/**
 * Script para resetear completamente la base de datos ACAUCAB
 * Ejecuta secuencialmente: DROP -> CREATE -> INSERT CON TODO -> PROCEDURES -> TRIGGERS -> VIEWS
 */

/** Configuración de la conexión a la base de datos */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

/** Función para leer archivo SQL */
function leerArchivoSQL(rutaArchivo) {
  try {
    const rutaCompleta = path.join(__dirname, rutaArchivo);
    const contenido = fs.readFileSync(rutaCompleta, 'utf8');
    console.log(`✓ Archivo leído: ${rutaArchivo}`);
    return contenido;
  } catch (error) {
    console.error(`✗ Error leyendo archivo ${rutaArchivo}:`, error.message);
    throw error;
  }
}

/** Función para ejecutar script SQL */
async function ejecutarSQL(contenidoSQL, nombreArchivo) {
  const client = await pool.connect();
  try {
    console.log(`🔄 Ejecutando: ${nombreArchivo}...`);
    
    // Para archivos grandes de inserts, procedures, triggers y vistas, ejecutar como un bloque único
    if (nombreArchivo.includes('insert') || nombreArchivo.includes('Insert') || 
        nombreArchivo.includes('Procedures') || nombreArchivo.includes('procedures') ||
        nombreArchivo.includes('triggers') || nombreArchivo.includes('Triggers') ||
        nombreArchivo.includes('Views') || nombreArchivo.includes('views')) {
      // Ejecutar todo el archivo como una sola query para mantener el orden
      await client.query(contenidoSQL);
    } else {
      // Para otros archivos, dividir por declaraciones
      const declaraciones = contenidoSQL
        .split(';')
        .map(sql => sql.trim())
        .filter(sql => sql.length > 0 && !sql.startsWith('--'));
      
      for (const declaracion of declaraciones) {
        if (declaracion.trim()) {
          await client.query(declaracion);
        }
      }
    }
    
    console.log(`✅ ${nombreArchivo} ejecutado exitosamente`);
  } catch (error) {
    console.error(`❌ Error ejecutando ${nombreArchivo}:`, error.message);
    throw error;
  } finally {
    client.release();
  }
}

/** Orden de archivos a ejecutar - FLUJO SIMPLIFICADO */
const ARCHIVOS_SQL = [
  // 1. DROP - Eliminar estructura existente
  { archivo: '../DROP.sql', descripcion: 'Eliminando estructura de BD existente' },
  
  // 2. CREATE - Crear estructura
  { archivo: '../CREATE version 2.sql', descripcion: 'Creando estructura de BD' },
  
  // 3. INSERT CON TODO - Todos los datos en un solo archivo
  { archivo: '../Inserts/Insert con todo.sql', descripcion: 'Insertando todos los datos' },
  
  // 4. PROCEDURES - Procedimientos almacenados
  { archivo: '../Procedures.sql', descripcion: 'Creando procedimientos almacenados' },
  
  // 5. TRIGGERS - Disparadores
  { archivo: '../triggers.sql', descripcion: 'Creando triggers' },
  
  // 6. VIEWS - Vistas
  { archivo: '../Views.sql', descripcion: 'Creando vistas' }
];

/** Función principal */
async function resetearBaseDatos() {
    console.log('🚀 Iniciando reseteo COMPLETO de la base de datos ACAUCAB...\n');
  
  const tiempoInicio = Date.now();
  let archivosEjecutados = 0;
  
  try {
    // Verificar conexión
    console.log('🔌 Verificando conexión a la base de datos...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión establecida correctamente\n');
    
    // Ejecutar cada archivo en orden
    for (const { archivo, descripcion } of ARCHIVOS_SQL) {
      console.log(`📄 ${descripcion}`);
      
      // Verificar si el archivo existe
      const rutaCompleta = path.join(__dirname, archivo);
      if (!fs.existsSync(rutaCompleta)) {
        console.log(`⚠️  Archivo no encontrado: ${archivo} - Saltando...`);
        continue;
      }
      
      // Leer y ejecutar
      const contenidoSQL = leerArchivoSQL(archivo);
      await ejecutarSQL(contenidoSQL, archivo);
      archivosEjecutados++;
      console.log(''); // Línea en blanco para separar
    }
    
    const tiempoTotal = ((Date.now() - tiempoInicio) / 1000).toFixed(2);
    
    console.log('🎉 ¡RESETEO COMPLETADO EXITOSAMENTE!');
    console.log(`📊 Archivos ejecutados: ${archivosEjecutados}/${ARCHIVOS_SQL.length}`);
    console.log(`⏱️  Tiempo total: ${tiempoTotal} segundos`);
    
  } catch (error) {
    console.error('\n💥 ERROR DURANTE EL RESETEO:');
    console.error(error.message);
    console.error('\n🔧 Verifica:');
    console.error('- Conexión a la base de datos');
    console.error('- Permisos de usuario');
    console.error('- Sintaxis de los archivos SQL');
    process.exit(1);
  } finally {
    await pool.end();
    console.log('\n🔌 Conexión cerrada');
  }
}

/** Función para mostrar ayuda */
function mostrarAyuda() {
  console.log(`
🗃️  SCRIPT DE RESETEO DE BASE DE DATOS ACAUCAB
===============================================

Este script ejecuta automáticamente todos los archivos SQL necesarios
para resetear completamente la base de datos en el siguiente orden:

1. DROP.sql - Elimina estructura existente
2. CREATE version 2.sql - Crea nueva estructura  
3. Insert con todo.sql - Todos los datos en un archivo
4. Procedures.sql - Procedimientos almacenados
5. triggers.sql - Disparadores
6. Views.sql - Vistas

USO:
    node reset-database.js [opción]

OPCIONES:
    --help, -h      Muestra esta ayuda
    --list, -l      Lista los archivos que se ejecutarán

REQUISITOS:
    - Archivo .env con configuración de BD
    - Permisos para DROP/CREATE en la BD
    - Todos los archivos SQL en sus ubicaciones
  `);
}

/** Función para listar archivos */
function listarArchivos() {
  console.log(`\n📋 ARCHIVOS QUE SE EJECUTARÁN:\n`);
  ARCHIVOS_SQL.forEach((item, index) => {
    const existe = fs.existsSync(path.join(__dirname, item.archivo));
    const estado = existe ? '✅' : '❌';
    console.log(`${index + 1}. ${estado} ${item.archivo}`);
    console.log(`   ${item.descripcion}\n`);
  });
}

/** Manejo de argumentos de línea de comandos */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    mostrarAyuda();
    return;
  }
  
  if (args.includes('--list') || args.includes('-l')) {
    listarArchivos();
    return;
  }
  
  // Ejecutar directamente sin confirmación
  await resetearBaseDatos();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { resetearBaseDatos, ARCHIVOS_SQL }; 