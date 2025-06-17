-- =================================================================
-- INSERCIÓN DE DATOS EN LA TABLA 'lugar_tienda'
-- Se crea una jerarquía: Zona -> Pasillo -> Anaquel.
-- NOTA: Se usa la estrategia del "nodo raíz" para cumplir con la restricción NOT NULL.
-- =================================================================

-- Paso 1: Crear el nodo raíz ficticio que se contiene a sí mismo.
-- Este registro representará a toda la tienda física.
INSERT INTO lugar_tienda (nombre, tipo) VALUES
('Tienda ACAUCAB Sede Principal', 'zona'); -- Clave: 1 (asumida, se autoapunta)

-- Paso 2: Crear las Zonas principales, que están contenidas en la "Tienda".
-- (fk_lugar_tienda = 1)
INSERT INTO lugar_tienda (nombre, tipo, fk_lugar_tienda) VALUES
('Almacén Principal', 'zona', 1),             -- Clave: 2
('Piso de Ventas', 'zona', 1);                 -- Clave: 3

-- Paso 3: Crear los Pasillos dentro del Almacén Principal.
-- (fk_lugar_tienda = 2)
INSERT INTO lugar_tienda (nombre, tipo, fk_lugar_tienda) VALUES
('Pasillo de Recepción de Mercancía', 'pasillo', 2), -- Clave: 4
('Pasillo de Cajas Nacionales (Stock)', 'pasillo', 2),  -- Clave: 5
('Pasillo de Barriles (Stock)', 'pasillo', 2);         -- Clave: 6

-- Paso 4: Crear los Pasillos en el Piso de Ventas.
-- (fk_lugar_tienda = 3)
INSERT INTO lugar_tienda (nombre, tipo, fk_lugar_tienda) VALUES
('Pasillo de Cervezas Claras (Lager/Pilsner)', 'pasillo', 3), -- Clave: 7
('Pasillo de Cervezas Oscuras (Stout/Porter)', 'pasillo', 3), -- Clave: 8
('Pasillo de Cervezas Especiales (IPA/APA)', 'pasillo', 3),   -- Clave: 9
('Pasillo de Ofertas - DiarioDeUnaCerveza', 'pasillo', 3);     -- Clave: 10

-- Paso 5: Crear los Anaqueles dentro de los pasillos del Piso de Ventas.
-- Estos son los lugares específicos donde se realiza la reposición.
INSERT INTO lugar_tienda (nombre, tipo, fk_lugar_tienda) VALUES
-- Anaqueles para el pasillo de Cervezas Claras (fk_lugar_tienda = 7)
('Anaquel Superior - Pilsner', 'anaquel', 7),   -- Clave: 11
('Anaquel Inferior - Lager', 'anaquel', 7),     -- Clave: 12

-- Anaqueles para el pasillo de Cervezas Oscuras (fk_lugar_tienda = 8)
('Anaquel Izquierdo - Stouts', 'anaquel', 8),   -- Clave: 13
('Anaquel Derecho - Porters', 'anaquel', 8),    -- Clave: 14

-- Anaquel para el pasillo de Ofertas (fk_lugar_tienda = 10)
('Exhibidor Central de Ofertas', 'anaquel', 10);-- Clave: 15

