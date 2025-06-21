# Reseteo básico con confirmación, no corre trigguers ni procedures

npm run reset:basic

# Reseteo básico sin confirmación

npm run reset:basic:force

# Ver qué archivos básicos se ejecutarán

npm run reset:list:basic

# Uso directo

node reset-database.js --basic
node reset-database.js --basic --force

# 🗃️ Script de Reseteo de Base de Datos ACAUCAB

Este script automatiza completamente el proceso de reseteo de la base de datos ACAUCAB, ejecutando secuencialmente todos los archivos SQL necesarios.

## 🚀 Características

- **Ejecución automática** de todos los scripts SQL en orden correcto
- **Dos modos de reseteo**: Completo y Básico
- **Verificación de archivos** antes de la ejecución
- **Logs detallados** del proceso
- **Manejo de errores** robusto
- **Confirmación de seguridad** antes de ejecutar
- **Múltiples opciones** de línea de comandos

## 🔄 Modos de Reseteo

### Modo COMPLETO (por defecto)

Ejecuta todos los archivos incluyendo procedures y triggers. Ideal para:

- Reseteo completo del ambiente de desarrollo
- Preparación de ambiente de producción
- Cuando necesitas toda la funcionalidad de BD

### Modo BÁSICO (`--basic`)

Ejecuta solo estructura, datos y vistas, omitiendo procedures y triggers. Ideal para:

- Desarrollo rápido cuando solo necesitas los datos
- Testing básico de la aplicación
- Cuando hay problemas con procedures/triggers
- Ambiente de desarrollo ligero

## 📋 Orden de Ejecución

El script ejecuta los archivos en el siguiente orden:

1. **DROP.sql** - Elimina estructura existente
2. **CREATE version 2.sql** - Crea nueva estructura
3. **Inserts/** - Datos en orden de dependencias:
   - `1insert lugar.sql` - Datos de lugares
   - `2INSERT cer_rec.sql` - Cervezas y recetas
   - `3inserts miem_cer.sql` - Miembros certificados
   - `4Inserts_empleado-rolesymas.sql` - Empleados y roles
   - `5Insert usuario-pago y ultimos.sql` - Usuarios y pagos
   - `6Insert_usuarios_prueba.sql` - Usuarios de prueba
   - `8Insert_roles_privilegios_nuevos.sql` - Roles y privilegios
   - `9ult estatus e historico.sql` - Estatus e histórico
   - `10Insert_privilegios_atomicos_corregidos.sql` - Privilegios atómicos
4. **procedures/Procedures.sql** - Procedimientos almacenados
5. **triggers.sql** - Disparadores
6. **Views.sql** - Vistas

## ⚙️ Configuración

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acaucab
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 3. Verificar permisos

Asegúrate de que el usuario de BD tenga permisos para:

- DROP DATABASE / DROP TABLE
- CREATE DATABASE / CREATE TABLE
- INSERT, UPDATE, DELETE
- CREATE FUNCTION, CREATE TRIGGER

## 🔧 Uso

### Comandos disponibles

```powershell
# Reseteo COMPLETO interactivo (con confirmación)
npm run reset

# Reseteo COMPLETO forzado (sin confirmación)
npm run reset:force

# Reseteo BÁSICO interactivo (sin procedures/triggers)
npm run reset:basic

# Reseteo BÁSICO forzado (sin procedures/triggers)
npm run reset:basic:force

# Listar archivos COMPLETOS que se ejecutarán
npm run reset:list

# Listar archivos BÁSICOS que se ejecutarán
npm run reset:list:basic

# Mostrar ayuda
npm run reset:help
```

### Uso directo

```powershell
# Ejecución COMPLETA normal
node reset-database.js

# Ejecución BÁSICA (sin procedures/triggers)
node reset-database.js --basic

# Con opciones combinadas
node reset-database.js --help
node reset-database.js --list
node reset-database.js --list --basic
node reset-database.js --force
node reset-database.js --basic --force
```

## 📊 Ejemplo de Salida

```
🚀 Iniciando reseteo completo de la base de datos ACAUCAB...

🔌 Verificando conexión a la base de datos...
✅ Conexión establecida correctamente

📄 Eliminando estructura de BD existente
✓ Archivo leído: DROP.sql
🔄 Ejecutando: DROP.sql...
✅ DROP.sql ejecutado exitosamente

📄 Creando estructura de BD
✓ Archivo leído: CREATE version 2.sql
🔄 Ejecutando: CREATE version 2.sql...
✅ CREATE version 2.sql ejecutado exitosamente

... (continúa con cada archivo)

🎉 ¡RESETEO COMPLETADO EXITOSAMENTE!
📊 Archivos ejecutados: 12/12
⏱️  Tiempo total: 45.32 segundos

🔌 Conexión cerrada
```

## ⚠️ Precauciones

- **ESTE SCRIPT ELIMINA TODOS LOS DATOS EXISTENTES**
- Siempre haz backup antes de ejecutar
- Verifica que tengas los permisos necesarios
- Asegúrate de que todos los archivos SQL estén presentes

## 🐛 Solución de Problemas

### Error de conexión

```
💥 ERROR DURANTE EL RESETEO:
connect ECONNREFUSED 127.0.0.1:5432
```

**Solución:** Verifica que PostgreSQL esté ejecutándose y que la configuración en `.env` sea correcta.

### Error de permisos

```
❌ Error ejecutando DROP.sql:
permission denied for database
```

**Solución:** Verifica que el usuario tenga permisos de DROP/CREATE en la base de datos.

### Archivo no encontrado

```
⚠️  Archivo no encontrado: Inserts/1insert lugar.sql - Saltando...
```

**Solución:** Verifica que todos los archivos SQL estén en sus ubicaciones correctas.

## 🔄 Personalización

Para modificar el orden de ejecución o agregar archivos, edita el array `ARCHIVOS_SQL` en `reset-database.js`:

```javascript
const ARCHIVOS_SQL = [
  { archivo: "tu-archivo.sql", descripcion: "Descripción del archivo" },
  // ... más archivos
];
```

## 📝 Logs

El script proporciona logs detallados de todo el proceso:

- ✅ Operaciones exitosas
- ❌ Errores con detalles
- ⚠️ Advertencias
- 📊 Estadísticas finales

## 🤝 Contribución

Para contribuir:

1. Verifica que tu código funcione con el patrón existente
2. Agrega comentarios en español
3. Mantén el orden lógico de ejecución
4. Actualiza este README si es necesario
