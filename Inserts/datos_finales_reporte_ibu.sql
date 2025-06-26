-- =================================================================================
-- SCRIPT FINAL PARA CARACTERÍSTICAS DEL REPORTE IBU
-- =================================================================================
-- Este script AÑADE las características de Color e IBU a las cervezas
-- existentes en el archivo 3inserts_miem_cer.sql.
-- Es seguro de ejecutar y no borra ni duplica datos.
-- FK para 'Color' = 1
-- FK para 'Amargor (IBU)' = 2
-- =================================================================================

-- Características para Cervezas de "Malta Caribe C.A."
-- Cerveza: Caribe American Amber (clave=4)
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Color ámbar medio', 13, 1, 4);
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Amargor balanceado', 30, 2, 4);

-- Cerveza: Caribe Tropical IPA (clave=5)
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Color dorado', 6, 1, 5);
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Amargor alto y resinoso', 65, 2, 5);

-- Características para Cervezas de "Cervecería Llanera Hoppy"
-- Cerveza: Llanera Hoppy IPA (clave=56)
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Color cobre pálido', 8, 1, 56);
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Amargor cítrico y floral', 60, 2, 56);

-- Características para Cervezas de "Caracas Hop Society"
-- Cerveza: CHS Urban Pale (clave=57)
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Color dorado brillante', 5, 1, 57);
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Amargor refrescante', 38, 2, 57);

-- Cerveza: CHS Metropolitan IPA (clave=58)
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Color ámbar claro', 9, 1, 58);
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Fuerte presencia de lúpulo', 70, 2, 58);

-- Características para Cervezas de "Cervecería Orinoco Flow"
-- Cerveza: Orinoco Delta Pale (clave=31)
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Color anaranjado pálido', 7, 1, 31);
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Amargor moderado con notas frutales', 40, 2, 31);

-- Características para Cervezas de "Cervezas Altamira S.R.L."
-- Cerveza: Altamira Urban IPA (clave=34)
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Color dorado intenso', 6, 1, 34);
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Explosión de lúpulos americanos', 68, 2, 34);

-- Características para Cervezas de "Craft Roots Venezuela"
-- Cerveza: Craft Roots Organic Pale (clave=50)
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Color miel claro', 6, 1, 50);
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Amargor terroso y herbal', 35, 2, 50);

-- Características para "Paradise Sunset Amber" (clave=44)
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Color rojizo atardecer', 15, 1, 44);
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Balance de malta y lúpulo', 32, 2, 44);

-- Características para "Andina Mountain Amber" (clave=2)
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Color ámbar profundo', 14, 1, 2);
INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES ('Suave amargor con notas a caramelo', 28, 2, 2); 