-- Migración para agregar PUNTOS al tipo de moneda
-- Ejecutar este script en la base de datos

-- Agregar PUNTOS al enum tipo_moneda
ALTER TYPE tipo_moneda ADD VALUE 'PUNTOS';

-- Insertar tasa de cambio para puntos (ejemplo: 1 punto = 10 Bs)
INSERT INTO tasa_cambio (moneda, monto_equivalencia, fecha_inicio) 
VALUES ('PUNTOS', 10.00, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Verificar que se insertó correctamente
SELECT * FROM tasa_cambio WHERE moneda = 'PUNTOS'; 