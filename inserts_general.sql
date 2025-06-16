-- Script general para la inserción de datos
-- Este script organiza la ejecución de los inserts en el orden correcto
-- para respetar las dependencias entre tablas

-- Primero insertamos los datos de lugares que no tienen dependencias
\i 'insert lugar.sql'

-- Luego insertamos los datos base para las recetas y cervezas
\i 'INSERT.sql'

-- Mensaje de confirmación
SELECT 'Todos los inserts han sido ejecutados correctamente.' as mensaje; 