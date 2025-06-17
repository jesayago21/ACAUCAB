--Inserts de miembros al azar

INSERT INTO miembro (rif, razon_social, denominacion_comercial, direccion_fiscal, direccion_fisica, fecha_afiliacion, fk_lugar_1, fk_lugar_2) VALUES
(123456789, 'Cervecería Artesanal Andina S.A.', 'Andina Brew', 'Av. Principal #45, El Hatillo', 'Calle Comercial #22, Local B', '2020-03-15', 101, 102),
(234567890, 'Malta Caribe C.A.', 'Caribe Malt', 'Calle 7 con Av. 8, Porlamar', 'Zona Industrial Sector C, Nave 5', '2019-11-22', 201, 202),
(345678901, 'Cervezas del Ávila Ltd.', 'Ávila Beer', 'Av. Boyacá #100, Caracas', 'Urbanización Industrial La Yaguara', '2021-05-30', 132, 132),
(456789012, 'Hop Masters Venezuela', 'Hop Masters', 'Calle Los Cedros #33, Mérida', 'Polígono Industrial Norte, Galpón 12', '2018-08-14', 152, 135),
(567890123, 'Cervecería Táchira Premium', 'Táchira Gold', 'Av. 19 de Abril #78, San Cristóbal', 'Parque Tecnológico, Edif. Cervecero', '2022-01-10', 142, 152),
(678901234, 'Oriente Brewing Company', 'Oriente BC', 'Calle Santiago #56, Barcelona', 'Zona Franca Industrial, Módulo 7', '2017-09-05', 234, 155),
(789012345, 'Cervezas del Lago C.A.', 'Lago Brew', 'Av. Circunvalación #200, Maracaibo', 'Sector Costa Verde, Planta 1', '2020-07-19', 242, 242),
(890123456, 'Art Brew Venezuela', 'Art Brew', 'Calle Los Pinos #12, Valencia', 'Ciudad Industrial, Bodega 24', '2019-04-25', 242, 244),
(901234567, 'Cervecería Orinoco Flow', 'Orinoco Flow', 'Av. Bolívar #500, Ciudad Bolívar', 'Polígono Sur, Instalaciones Río', '2021-10-08', 131, 131),
(112233445, 'Cervezas Altamira S.R.L.', 'Altamira Craft', 'Av. Francisco de Miranda #150, Caracas', 'Centro de Producción Artesanal Este', '2018-12-03', 152, 176),
(223344556, 'Brew Lab Venezuela', 'Brew Lab', 'Calle El Sol #25, Mérida', 'Parque Científico, Laboratorio 3', '2022-06-17', 141, 234),
(334455667, 'Cervecería Margarita Paradise', 'Paradise Beer', 'Av. 4 de Mayo #77, Porlamar', 'Complejo Turístico Costa Azul', '2017-07-29', 141, 120),
(445566778, 'Andes Beer Factory', 'Andes Factory', 'Calle Los Andes #90, Tovar', 'Finca Agrícola La Cumbre', '2020-09-12', 212, 141),
(556677889, 'Cervezas del Zulia Dorado', 'Zulia Dorado', 'Av. 5 de Julio #44, Maracaibo', 'Puerto Industrial, Almacén 9', '2019-02-28', 284, 184),
(667788990, 'Craft Roots Venezuela', 'Craft Roots', 'Calle Humboldt #11, Colonia Tovar', 'Hacienda Cervecera Valle Alemán', '2021-08-15', 101, 174),
(778899001, 'Cervecería Llanera Hoppy', 'Llanera Hoppy', 'Av. Los Llanos #300, Barinas', 'Hato Ganadero El Cervecero', '2018-04-09', 173, 147),
(889900112, 'Caracas Hop Society', 'CHS Brews', 'Calle Chacao #65, Caracas', 'Centro Artesanal La Floresta', '2022-03-01', 161, 116),
(990011223, 'Cervezas Yaracuy Artesanal', 'Yaracuy Art', 'Av. Yaracuy #120, San Felipe', 'Ruta del Cacao, Finca El Trigal', '2017-11-18', 363, 163),
(100200300, 'Amazonia Brewing Co.', 'Amazonia Beer', 'Calle Amazonas #5, Puerto Ayacucho', 'Reserva Natural, Edif. Principal', '2020-01-05', 162, 151),
(200300400, 'Roraima Craft Brewers', 'Roraima Brew', 'Av. Gran Sabana #500, Santa Elena', 'Comunidad Indígena Sector Brew', '2019-06-21', 196, 152);

--Cervezas
-- Cervecería Artesanal Andina S.A. (3 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Andina Golden Lager', 5, 4, 1, 123456789),      -- Pilsner
('Andina Mountain Amber', 6, 18, 1, 123456789),    -- Amber Ale
('Andina Black Forest Stout', 7, 30, 1, 123456789); -- Stout

-- Malta Caribe C.A. (4 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Caribe American Amber', 6, 39, 2, 234567890),    -- American Amber Ale (usa receta específica)
('Caribe Tropical IPA', 7, 42, 1, 234567890),      -- American IPA
('Caribe Coastal Pilsner', 5, 4, 1, 234567890),    -- Pilsner
('Caribe Sunset Porter', 6, 31, 1, 234567890);     -- Porter

-- Cervezas del Ávila Ltd. (3 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Ávila Peak Lager', 5, 2, 1, 345678901),          -- Lager
('Ávila Guardian Stout', 7, 30, 1, 345678901),     -- Stout
('Ávila Valley Wheat', 5, 24, 1, 345678901);       -- Weizen-Weissbier

-- Hop Masters Venezuela (4 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Hop Masters IPA', 7, 28, 1, 456789012),          -- Indian Pale Ale (IPA)
('Hop Masters Belgian Dubbel', 7, 36, 1, 456789012), -- Belgian Dubbel
('Hop Masters Blonde Ale', 5, 19, 1, 456789012),   -- Blonde Ale
('Hop Masters Imperial Stout', 9, 45, 1, 456789012); -- Imperial Stout

-- Cervecería Táchira Premium (3 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Táchira Andina Ale', 6, 18, 1, 567890123),       -- Amber Ale
('Táchira Dark Porter', 6, 31, 1, 567890123),      -- Porter
('Táchira Session Lager', 4, 11, 1, 567890123);    -- Oktoberfest-Marzen

-- Oriente Brewing Company (4 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Oriente Caribbean Wit', 5, 25, 1, 678901234),    -- Witbier
('Oriente Coast IPA', 7, 28, 1, 678901234),        -- Indian Pale Ale (IPA)
('Oriente Golden Strong', 8, 37, 1, 678901234),    -- Belgian Golden Strong Ale
('Oriente Coconut Porter', 6, 31, 1, 678901234);   -- Porter

-- Cervezas del Lago C.A. (3 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Lago Maracaibo Pilsner', 5, 51, 1, 789012345),   -- Bohemian Pilsener
('Lago Catatumbo Stout', 7, 30, 1, 789012345),     -- Stout
('Lago Zulia Amber', 6, 18, 1, 789012345);         -- Amber Ale

-- Art Brew Venezuela (4 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Art Brew Saison', 6, 38, 1, 890123456),          -- Belgian Specialty Ale
('Art Brew Belgian Tripel', 9, 37, 1, 890123456),  -- Belgian Golden Strong Ale
('Art Brew Nitro Stout', 6, 49, 1, 890123456),     -- Dry Stout
('Art Brew Hazy IPA', 7, 42, 1, 890123456);        -- American IPA

-- Cervecería Orinoco Flow (3 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Orinoco Delta Pale', 6, 26, 1, 901234567),       -- American Pale Ale
('Orinoco Rainforest Ale', 6, 22, 1, 901234567),   -- Red Ale
('Orinoco Jungle IPA', 7, 28, 1, 901234567);       -- Indian Pale Ale (IPA)

-- Cervezas Altamira S.R.L. (4 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Altamira Mountain Lager', 5, 2, 1, 112233445),   -- Lager
('Altamira Urban IPA', 7, 42, 1, 112233445),       -- American IPA
('Altamira Valley Ale', 6, 18, 1, 112233445),      -- Amber Ale
('Altamira Reserve Bock', 8, 9, 1, 112233445);     -- Bock

-- Brew Lab Venezuela (3 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Brew Lab Experimental IPA', 7, 43, 1, 223344556), -- Imperial IPA
('Brew Lab Classic Pils', 5, 4, 1, 223344556),     -- Pilsner
('Brew Lab Barrel Aged Stout', 10, 45, 1, 223344556); -- Imperial Stout

-- Cervecería Margarita Paradise (4 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Paradise Beach Blonde', 5, 19, 1, 334455667),    -- Blonde Ale
('Paradise Sunset Amber', 6, 39, 2, 334455667),    -- American Amber Ale (usa receta específica)
('Paradise Coconut Porter', 6, 31, 1, 334455667),  -- Porter
('Paradise Tropical IPA', 7, 42, 1, 334455667);    -- American IPA

-- Andes Beer Factory (3 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Andes Peak Lager', 5, 2, 1, 445566778),          -- Lager
('Andes Glacier IPA', 7, 28, 1, 445566778),        -- Indian Pale Ale (IPA)
('Andes Valley Wheat', 5, 24, 1, 445566778);       -- Weizen-Weissbier

-- Cervezas del Zulia Dorado (4 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Zulia Dorada Pilsner', 5, 4, 1, 556677889),      -- Pilsner
('Zulia Oil Stout', 7, 30, 1, 556677889),          -- Stout
('Zulia Bridge Ale', 6, 18, 1, 556677889),         -- Amber Ale
('Zulia Sunset IPA', 7, 42, 1, 556677889);         -- American IPA

-- Craft Roots Venezuela (3 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Craft Roots Heritage Ale', 6, 22, 1, 667788990), -- Red Ale
('Craft Roots Organic Pale', 6, 26, 1, 667788990), -- American Pale Ale
('Craft Roots Forest Stout', 7, 30, 1, 667788990); -- Stout

-- Cervecería Llanera Hoppy (4 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Llanera Sabana Lager', 5, 2, 1, 778899001),      -- Lager
('Llanera Cattleman Stout', 7, 30, 1, 778899001),  -- Stout
('Llanera Sunset Ale', 6, 18, 1, 778899001),       -- Amber Ale
('Llanera Hoppy IPA', 7, 42, 1, 778899001);        -- American IPA

-- Caracas Hop Society (3 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('CHS Urban Pale', 6, 26, 1, 889900112),           -- American Pale Ale
('CHS Metropolitan IPA', 7, 42, 1, 889900112),     -- American IPA
('CHS Capital Stout', 7, 30, 1, 889900112);        -- Stout

-- Cervezas Yaracuy Artesanal (4 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Yaracuy Cacao Porter', 6, 31, 1, 990011223),     -- Porter
('Yaracuy Valley Ale', 6, 18, 1, 990011223),       -- Amber Ale
('Yaracuy Mountain IPA', 7, 28, 1, 990011223),     -- Indian Pale Ale (IPA)
('Yaracuy Artisan Lager', 5, 2, 1, 990011223);     -- Lager

-- Amazonia Brewing Co. (3 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Amazonia Jungle Ale', 6, 38, 1, 100200300),      -- Belgian Specialty Ale
('Amazonia River IPA', 7, 28, 1, 100200300),       -- Indian Pale Ale (IPA)
('Amazonia Rainforest Stout', 8, 45, 1, 100200300);-- Imperial Stout

-- Roraima Craft Brewers (4 cervezas)
INSERT INTO cerveza (nombre, grado_alcohol, fk_tipo_cerveza, fk_receta, fk_miembro) VALUES
('Roraima Summit Ale', 6, 18, 1, 200300400),       -- Amber Ale
('Roraima Plateau Lager', 5, 2, 1, 200300400),     -- Lager
('Roraima Gran Sabana IPA', 7, 42, 1, 200300400),  -- American IPA
('Roraima Tepuy Stout', 8, 30, 1, 200300400);      -- Stout



--Clientes
--Naturales

INSERT INTO cliente (rif, puntos_acumulados, tipo, ci, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_habitacion, fk_direccion_habitacion) VALUES
(123456789, 0, 'natural', 12345678, 'Juan', 'Carlos', 'Pérez', 'González', 'Calle Este, Nro 123, Urb. La Floresta', 15),
(234567890, 0, 'natural', 23456789, 'María', 'Alejandra', 'Rodríguez', 'López', 'Av. Norte, Edif. Sol, Piso 5, Apto 501', 42),
(345678901, 0, 'natural', 34567890, 'Carlos', 'Andrés', 'García', 'Martínez', 'Calle Oeste, Res. Montecarlo, Casa 7', 78),
(456789012, 0, 'natural', 45678901, 'Ana', 'Isabel', 'Sánchez', 'Fernández', 'Av. Principal, Qta. Las Acacias', 112),
(567890123, 0, 'natural', 56789012, 'Pedro', 'Luis', 'Torres', 'Ramírez', 'Calle Sur, Edif. Altamira, Apto 302', 156),
(678901234, 0, 'natural', 67890123, 'Laura', 'Valentina', 'Díaz', 'Hernández', 'Av. Este, Urb. El Rosal, Casa 15', 189),
(789012345, 0, 'natural', 78901234, 'Luis', 'Miguel', 'Jiménez', 'Gómez', 'Calle Norte, Res. Los Pinos, Casa 22', 224),
(890123456, 0, 'natural', 89012345, 'Sofía', 'Gabriela', 'Ruiz', 'Álvarez', 'Av. Oeste, Edif. Horizonte, Apto 801', 267),
(901234567, 0, 'natural', 90123456, 'Jorge', 'Alberto', 'Morales', 'Vargas', 'Calle Principal, Urb. Santa Paula, Casa 33', 289),
(112233445, 0, 'natural', 11223344, 'Patricia', 'Carolina', 'Rojas', 'Silva', 'Av. Sur, Res. Las Mercedes, Casa 12', 312),
(223344556, 0, 'natural', 22334455, 'Ricardo', 'José', 'Mendoza', 'Castro', 'Calle Este, Edif. Atlántico, Apto 502', 45),
(334455667, 0, 'natural', 33445566, 'Gabriela', 'Fernanda', 'Guerrero', 'Ríos', 'Av. Norte, Urb. La Lagunita, Casa 8', 98),
(445566778, 0, 'natural', 44556677, 'Andrés', 'Felipe', 'Navarro', 'Peña', 'Calle Oeste, Res. El Ávila, Casa 18', 123),
(556677889, 0, 'natural', 55667788, 'Valeria', 'Antonieta', 'Fuentes', 'Delgado', 'Av. Principal, Edif. Galaxia, Apto 1002', 176),
(667788990, 0, 'natural', 66778899, 'Fernando', 'Enrique', 'Cortez', 'Ortega', 'Calle Sur, Urb. Los Chorros, Casa 25', 201),
(778899001, 0, 'natural', 77889900, 'Camila', 'Alejandra', 'Paredes', 'Miranda', 'Av. Este, Res. El Paraíso, Casa 9', 245),
(889900112, 0, 'natural', 88990011, 'Roberto', 'Carlos', 'Vega', 'Campos', 'Calle Norte, Edif. Panorama, Apto 603', 278),
(990011223, 0, 'natural', 99001122, 'Daniela', 'Victoria', 'Salazar', 'Molina', 'Av. Oeste, Urb. La California, Casa 14', 301),
(100200300, 0, 'natural', 10020030, 'Diego', 'Armando', 'Cordero', 'Vera', 'Calle Principal, Res. Alto Prado, Casa 6', 335),
(200300400, 0, 'natural', 20030040, 'Isabella', 'María', 'Aguirre', 'Lara', 'Av. Sur, Edif. Mediterráneo, Apto 402', 12);

--Juridicos
INSERT INTO cliente (rif, puntos_acumulados, tipo, razon_social, denominacion_comercial, url_pagina_web, capital_disponible, direccion_fiscal, direccion_fisica, fk_direccion_fiscal, fk_direccion_fisica) VALUES
(123456780, 0, 'juridico', 'Distribuciones Caribe C.A.', 'Bar Caribe', 'https://www.barcaribe.com', 5000000, 'Av. Principal, Centro Comercial Sambil, Nivel 3', 'Av. Principal, Centro Comercial Sambil, Nivel 3', 25, 25),
(234567891, 0, 'juridico', 'Gastronomía Gourmet S.R.L.', 'Restaurante El Buen Sabor', 'https://www.elbuensabor.com.ve', 3000000, 'Calle Este, Edif. Galerías, Local 5', 'Calle Este, Edif. Galerías, Local 5', 47, 47),
(345678902, 0, 'juridico', 'Hotel Paraíso Caribeño C.A.', 'Hotel Paraíso', 'https://www.hotelparaisocaribe.com', 10000000, 'Av. La Costa, Sector Playa', 'Av. La Costa, Sector Playa', 89, 89),
(456789013, 0, 'juridico', 'Servicios Corporativos Venezuela', 'CorpServ Ven', 'https://corpservven.com', 7500000, 'Torre Financiera, Piso 12', 'Torre Financiera, Piso 12', 114, 114),
(567890124, 0, 'juridico', 'Alimentos y Bebidas Delicias S.A.', 'Delicias Express', 'https://deliciasexpress.com.ve', 2000000, 'Calle Comercio, Centro Empresarial', 'Calle Comercio, Centro Empresarial', 167, 167),
(678901235, 0, 'juridico', 'Hotel Montaña Encantada', 'Montaña Lodge', 'https://www.montanalodge.com', 8500000, 'Carretera Montaña, Km 12', 'Carretera Montaña, Km 12', 192, 192),
(789012346, 0, 'juridico', 'Servicios Integrales Técnicos', 'SIT Solutions', 'https://sitsolutions.com.ve', 4000000, 'Av. Tecnológica, Parque Industrial', 'Av. Tecnológica, Parque Industrial', 227, 227),
(890123457, 0, 'juridico', 'Comercializadora La Bodeguita C.A.', 'La Bodeguita Premium', 'https://labodeguitapremium.com', 1500000, 'Calle Mercado, Local 22', 'Calle Mercado, Local 22', 259, 259),
(901234568, 0, 'juridico', 'Corporación Hotelera Nacional', 'City Suites Hotel', 'https://www.citysuiteshotel.com', 12000000, 'Av. Bolívar, Centro Financiero', 'Av. Bolívar, Centro Financiero', 293, 293),
(112233446, 0, 'juridico', 'Distribuidora de Alimentos S.A.', 'DistriAlimentos', 'https://distrialimentos.com.ve', 6000000, 'Zona Industrial, Nave 7', 'Zona Industrial, Nave 7', 34, 34),
(223344557, 0, 'juridico', 'Servicios Gastronómicos Elite', 'Catering Elite', 'https://cateringelite.com', 3500000, 'Av. Gourmet, Edif. Sabores', 'Av. Gourmet, Edif. Sabores', 76, 76),
(334455668, 0, 'juridico', 'Bodega El Economico C.A.', 'Bodegón Popular', 'https://bodegonpopular.com.ve', 1800000, 'Calle Comercial, Mercado Municipal', 'Calle Comercial, Mercado Municipal', 118, 118),
(445566779, 0, 'juridico', 'Hotel Playa Dorada', 'Playa Dorada Resort', 'https://playadoradaresort.com', 9500000, 'Costa Dorada, Sector Turístico', 'Costa Dorada, Sector Turístico', 173, 173),
(556677890, 0, 'juridico', 'Servicios Corporativos Integrales', 'CorpIntegral', 'https://corpintegral.ve', 5500000, 'Torre Ejecutiva, Piso 15', 'Torre Ejecutiva, Piso 15', 208, 208),
(667788991, 0, 'juridico', 'Restaurante Sabores Criollos C.A.', 'Sabores de Mi Tierra', 'https://saboresdemitierra.com.ve', 2500000, 'Av. Tradición, Local 15', 'Av. Tradición, Local 15', 243, 243),
(778899002, 0, 'juridico', 'Comedor Industrial Alimenta', 'Alimenta Corp', 'https://alimentacorp.com', 4500000, 'Zona Industrial, Bloque D', 'Zona Industrial, Bloque D', 278, 278),
(889900113, 0, 'juridico', 'Hotel Ciudad Jardín', 'Jardín Suites', 'https://www.jardinsuites.com', 8000000, 'Av. Jardín, Sector Botánico', 'Av. Jardín, Sector Botánico', 305, 305),
(990011224, 0, 'juridico', 'Bodegón 24 Horas C.A.', 'Bodegón Express', 'https://bodegonexpress24.com.ve', 1200000, 'Calle Principal, Esquina Mercal', 'Calle Principal, Esquina Mercal', 19, 19),
(100200301, 0, 'juridico', 'Servicios de Mantenimiento Técnico', 'MantenTec', 'https://mantentec.com.ve', 3000000, 'Av. Industrial, Galpón 12', 'Av. Industrial, Galpón 12', 67, 67),
(200300401, 0, 'juridico', 'Hotel Vista Montaña', 'Vista Montaña Lodge', 'https://vistamontana.com', 7000000, 'Carretera Panorámica, Km 8', 'Carretera Panorámica, Km 8', 142, 142);