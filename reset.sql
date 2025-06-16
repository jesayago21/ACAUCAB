-- Script para resetear la base de datos
-- Ejecuta primero el DROP.sql para eliminar todas las tablas
\i 'DROP.sql'

-- Luego ejecuta el CREATE version 2.sql para crear todas las tablas nuevamente
\i 'CREATE version 2.sql'

-- Finalmente ejecuta el archivo de inserts general
\i 'inserts_general.sql' 