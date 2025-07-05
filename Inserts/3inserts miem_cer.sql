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


--Tipo evento
INSERT INTO tipo_evento (nombre, descripcion) VALUES
('Festival', 'Evento masivo con múltiples cervecerías artesanales, catas y música en vivo.'),--maayor posible
('Taller', 'Sesión educativa para aprender a degustar y apreciar diferentes estilos de cerveza.'),
('Concurso', 'Competencia de cerveceros caseros con jurados profesionales.'),
('Lanzamiento de Producto', 'Evento exclusivo para presentación de nuevas cervezas al mercado.'),
('Cena Maridaje', 'Experiencia gastronómica con platos diseñados para combinar con cervezas específicas.'),
('Tour', 'Recorrido guiado por instalaciones de producción con degustación incluida.'),
('Meet the Brewer', 'Encuentro íntimo con maestros cerveceros para conocer sus procesos creativos.'),
('Ponencia', 'Celebración tradicional alemana adaptada con cervezas artesanales locales.'),
('Curso de Elaboración', 'Taller práctico para aprender a elaborar cerveza artesanal en casa.'),
('Expo Ingredientes', 'Exhibición de materias primas para elaboración de cerveza con proveedores especializados.'),
('Actividad', 'Actividad de entretenimiento para los asistentes dentro de un evento.');



--Eventos (5 por cada estado)
-- Amazonas (fk_lugar = 1)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Amazonas', '2024-06-15', '2024-06-17', 'Av. Orinoco, Puerto Ayacucho', 20, NULL, 1, 1),
('Taller de Cata Selvática', '2024-07-05', '2024-07-05', 'Centro Cultural Amazonas', 15, NULL, 1, 2),
('Concurso Homebrew Orinoquía', '2024-08-12', '2024-08-13', 'Plaza Bolívar, Puerto Ayacucho', 10, NULL, 1, 3),
('Tour Cervecero Selva', '2024-09-03', '2024-09-03', 'Cervecería Selva', 25, NULL, 1, 6),
('Cena Maridaje Amazónico', '2024-10-22', '2024-10-22', 'Restaurante La Jungla', 50, NULL, 1, 5);

-- Anzoátegui (fk_lugar = 2)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero de Barcelona', '2024-06-22', '2024-06-24', 'Paseo Colón, Barcelona', 20, NULL, 2, 1),
('Taller de Cata Costera', '2024-07-10', '2024-07-10', 'Centro de Convenciones', 15, NULL, 2, 2),
('Lanzamiento Costa Caribe', '2024-08-18', '2024-08-18', 'C.C. Plaza Mayor', NULL, NULL, 2, 4),
('Curso Elaboración Anzoátegui', '2024-09-07', '2024-09-08', 'Escuela Gastronómica', 40, NULL, 2, 9),
('Expo Ingredientes Orientales', '2024-10-25', '2024-10-26', 'Zona Industrial', 10, NULL, 2, 10);

-- Apure (fk_lugar = 3)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Llanero Apure', '2024-06-18', '2024-06-20', 'Av. 23 de Enero, San Fernando', 20, NULL, 3, 1),
('Meet the Brewer Llanero', '2024-07-08', '2024-07-08', 'Cervecería Llanera', 15, NULL, 3, 7),
('Concurso Homebrew Apureño', '2024-08-15', '2024-08-16', 'Plaza Los Llanos', 10, NULL, 3, 3),
('Oktoberfest San Fernando', '2024-09-28', '2024-09-29', 'Club Social', 30, NULL, 3, 8),
('Taller de Cata Llanera', '2024-10-12', '2024-10-12', 'Biblioteca Pública', 15, NULL, 3, 2);

-- Aragua (fk_lugar = 4)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Maracay', '2024-07-12', '2024-07-14', 'Av. Las Delicias', 25, NULL, 4, 1),
('Tour Cervecero Aragua', '2024-08-05', '2024-08-05', 'Cervecería Jardín', 20, NULL, 4, 6),
('Cena Maridaje Central', '2024-09-15', '2024-09-15', 'Restaurante Gourmet', 55, NULL, 4, 5),
('Expo Ingredientes Aragua', '2024-10-30', '2024-10-31', 'Centro de Eventos', 12, NULL, 4, 10),
('Concurso Homebrew Central', '2024-11-22', '2024-11-23', 'Plaza Bolívar', 10, NULL, 4, 3);

-- Barinas (fk_lugar = 5)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Llanero', '2024-07-25', '2024-07-27', 'Av. 23 de Enero, Barinas', 20, NULL, 5, 1),
('Taller de Cata Barinés', '2024-08-20', '2024-08-20', 'Centro Cultural', 15, NULL, 5, 2),
('Lanzamiento Sabana', '2024-09-10', '2024-09-10', 'C.C. Llanero', NULL, NULL, 5, 4),
('Curso Elaboración Barinas', '2024-10-05', '2024-10-06', 'Escuela Técnica', 35, NULL, 5, 9),
('Meet the Brewer Llanero', '2024-11-15', '2024-11-15', 'Cervecería Sabana', 15, NULL, 5, 7);

-- Bolívar (fk_lugar = 6)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Guayana', '2024-08-01', '2024-08-03', 'Paseo Orinoco, Ciudad Guayana', 25, NULL, 6, 1),
('Tour Cervecero Minero', '2024-09-02', '2024-09-02', 'Cervecería Hierro', 20, NULL, 6, 6),
('Cena Maridaje Guayanes', '2024-10-18', '2024-10-18', 'Restaurante Río', 60, NULL, 6, 5),
('Expo Ingredientes del Sur', '2024-11-12', '2024-11-13', 'Poliedro', 10, NULL, 6, 10),
('Concurso Homebrew Bolívar', '2024-12-07', '2024-12-08', 'Plaza del Hierro', 10, NULL, 6, 3);

-- Carabobo (fk_lugar = 7)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Valencia', '2024-08-10', '2024-08-12', 'Av. Bolívar, Valencia', 30, NULL, 7, 1),
('Taller de Cata Industrial', '2024-09-05', '2024-09-05', 'Centro de Convenciones', 20, NULL, 7, 2),
('Lanzamiento Puerto Cabello', '2024-10-15', '2024-10-15', 'C.C. Sambil', NULL, NULL, 7, 4),
('Curso Elaboración Carabobo', '2024-11-08', '2024-11-09', 'Escuela de Cocina', 45, NULL, 7, 9),
('Oktoberfest Valencia', '2024-12-12', '2024-12-13', 'Club Aleman', 35, NULL, 7, 8);

-- Cojedes (fk_lugar = 8)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Llanero', '2024-08-22', '2024-08-24', 'Av. Miranda, San Carlos', 20, NULL, 8, 1),
('Meet the Brewer Cojedeño', '2024-09-18', '2024-09-18', 'Cervecería Sabana', 15, NULL, 8, 7),
('Concurso Homebrew Cojedes', '2024-10-22', '2024-10-23', 'Plaza Central', 10, NULL, 8, 3),
('Tour Cervecero Ganadero', '2024-11-20', '2024-11-20', 'Hacienda La Fortuna', 25, NULL, 8, 6),
('Taller de Cata Llanera', '2024-12-18', '2024-12-18', 'Centro Cultural', 15, NULL, 8, 2);

-- Delta Amacuro (fk_lugar = 9)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Delta', '2024-09-01', '2024-09-03', 'Av. Orinoco, Tucupita', 20, NULL, 9, 1),
('Taller de Cata Fluvial', '2024-10-02', '2024-10-02', 'Centro Warao', 15, NULL, 9, 2),
('Lanzamiento Delta', '2024-11-05', '2024-11-05', 'Malecón', NULL, NULL, 9, 4),
('Curso Elaboración Delta', '2024-12-03', '2024-12-04', 'Escuela Técnica', 35, NULL, 9, 9),
('Expo Ingredientes Fluviales', '2025-01-14', '2025-01-15', 'Centro de Eventos', 10, NULL, 9, 10);

-- Falcón (fk_lugar = 10)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Coriano', '2024-09-12', '2024-09-14', 'Paseo Alameda, Coro', 25, NULL, 10, 1),
('Tour Cervecero Costero', '2024-10-10', '2024-10-10', 'Cervecería Médanos', 20, NULL, 10, 6),
('Cena Maridaje Falconiana', '2024-11-15', '2024-11-15', 'Restaurante Dunas', 50, NULL, 10, 5),
('Expo Ingredientes Costeros', '2024-12-12', '2024-12-13', 'Centro de Convenciones', 12, NULL, 10, 10),
('Concurso Homebrew Falcón', '2025-01-22', '2025-01-23', 'Plaza Bolívar', 10, NULL, 10, 3);

-- Guárico (fk_lugar = 11)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Central', '2024-09-25', '2024-09-27', 'Av. Miranda, San Juan', 20, NULL, 11, 1),
('Meet the Brewer Guariqueño', '2024-10-25', '2024-10-25', 'Cervecería Llano', 15, NULL, 11, 7),
('Concurso Homebrew Guárico', '2024-11-25', '2024-11-26', 'Plaza Central', 10, NULL, 11, 3),
('Oktoberfest San Juan', '2024-12-15', '2024-12-16', 'Club Social', 30, NULL, 11, 8),
('Taller de Cata Llanera', '2025-01-15', '2025-01-15', 'Centro Cultural', 15, NULL, 11, 2);

-- Lara (fk_lugar = 12)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Barquisimetano', '2024-10-05', '2024-10-07', 'Av. Morán, Barquisimeto', 30, NULL, 12, 1),
('Taller de Cata Centroccidental', '2024-11-02', '2024-11-02', 'Centro de Convenciones', 20, NULL, 12, 2),
('Lanzamiento Lara', '2024-12-05', '2024-12-05', 'C.C. Sambil', NULL, NULL, 12, 4),
('Curso Elaboración Lara', '2025-01-10', '2025-01-11', 'Escuela Gastronómica', 45, NULL, 12, 9),
('Tour Cervecero Andino', '2025-02-15', '2025-02-15', 'Cervecería Divina Pastora', 25, NULL, 12, 6);

-- Mérida (fk_lugar = 13)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Andino de Cerveza', '2024-10-18', '2024-10-20', 'Av. Urdaneta, Mérida', 35, NULL, 13, 1),
('Cena Maridaje Andino', '2024-11-20', '2024-11-20', 'Restaurante Pico Águila', 65, NULL, 13, 5),
('Tour Cervecero Montaña', '2024-12-18', '2024-12-18', 'Cervecería Sierra', 30, NULL, 13, 6),
('Expo Ingredientes Andinos', '2025-01-22', '2025-01-23', 'Centro de Eventos', 15, NULL, 13, 10),
('Concurso Homebrew Andino', '2025-02-25', '2025-02-26', 'Plaza Bolívar', 15, NULL, 13, 3);

-- Miranda (fk_lugar = 14)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Oriental', '2024-11-01', '2024-11-03', 'Av. Miranda, Los Teques', 30, NULL, 14, 1),
('Taller de Cata Metropolitano', '2024-12-03', '2024-12-03', 'Centro Cultural', 25, NULL, 14, 2),
('Lanzamiento Miranda', '2025-01-10', '2025-01-10', 'C.C. Lider', NULL, NULL, 14, 4),
('Curso Elaboración Miranda', '2025-02-14', '2025-02-15', 'Escuela de Cocina', 50, NULL, 14, 9),
('Meet the Brewer Mirandino', '2025-03-18', '2025-03-18', 'Cervecería Ávila', 20, NULL, 14, 7);

-- Monagas (fk_lugar = 15)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Maturinés', '2024-11-15', '2024-11-17', 'Av. Bolívar, Maturín', 25, NULL, 15, 1),
('Tour Cervecero Petrolero', '2024-12-12', '2024-12-12', 'Cervecería Petrolera', 20, NULL, 15, 6),
('Cena Maridaje Oriental', '2025-01-15', '2025-01-15', 'Restaurante El Morichal', 55, NULL, 15, 5),
('Expo Ingredientes Monagas', '2025-02-18', '2025-02-19', 'Centro de Eventos', 12, NULL, 15, 10),
('Concurso Homebrew Monagas', '2025-03-22', '2025-03-23', 'Plaza Bolívar', 10, NULL, 15, 3);

-- Nueva Esparta (fk_lugar = 16)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Isleño', '2024-11-28', '2024-11-30', 'Av. Santiago Mariño, Porlamar', 40, NULL, 16, 1),
('Taller de Cata en Playa', '2024-12-28', '2024-12-28', 'Playa El Agua', 30, NULL, 16, 2),
('Lanzamiento Margarita', '2025-01-30', '2025-01-30', 'C.C. Sambil', NULL, NULL, 16, 4),
('Curso Elaboración Isla', '2025-02-28', '2025-03-01', 'Escuela de Turismo', 60, NULL, 16, 9),
('Oktoberfest Caribeño', '2025-03-30', '2025-03-31', 'Club Costa Azul', 40, NULL, 16, 8);

-- Portuguesa (fk_lugar = 17)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Llanero', '2024-12-05', '2024-12-07', 'Av. Los Agricultores, Guanare', 25, NULL, 17, 1),
('Meet the Brewer Portugueseño', '2025-01-07', '2025-01-07', 'Cervecería Agrícola', 20, NULL, 17, 7),
('Concurso Homebrew Portuguesa', '2025-02-10', '2025-02-11', 'Plaza Bolívar', 15, NULL, 17, 3),
('Tour Cervecero Agrícola', '2025-03-15', '2025-03-15', 'Hacienda Santa Rosa', 30, NULL, 17, 6),
('Taller de Cata Llanera', '2025-04-18', '2025-04-18', 'Centro Cultural', 20, NULL, 17, 2);

-- Sucre (fk_lugar = 18)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Oriental', '2024-12-15', '2024-12-17', 'Paseo Colón, Cumaná', 30, NULL, 18, 1),
('Tour Cervecero Costero', '2025-01-15', '2025-01-15', 'Cervecería Caribe', 25, NULL, 18, 6),
('Cena Maridaje de Mar', '2025-02-18', '2025-02-18', 'Restaurante Puerto', 60, NULL, 18, 5),
('Expo Ingredientes Costeros', '2025-03-22', '2025-03-23', 'Centro de Eventos', 15, NULL, 18, 10),
('Concurso Homebrew Sucre', '2025-04-25', '2025-04-26', 'Plaza Bolívar', 15, NULL, 18, 3);

-- Táchira (fk_lugar = 19)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Andino Tachirense', '2025-01-05', '2025-01-07', 'Av. Universidad, San Cristóbal', 35, NULL, 19, 1),
('Taller de Cata Fronterizo', '2025-02-05', '2025-02-05', 'Centro Cultural', 25, NULL, 19, 2),
('Lanzamiento Táchira', '2025-03-10', '2025-03-10', 'C.C. Sambil', NULL, NULL, 19, 4),
('Curso Elaboración Andina', '2025-04-14', '2025-04-15', 'Escuela Gastronómica', 50, NULL, 19, 9),
('Oktoberfest Andino', '2025-05-20', '2025-05-21', 'Club Alemán', 40, NULL, 19, 8);

-- Trujillo (fk_lugar = 20)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Trujillano', '2025-01-15', '2025-01-17', 'Av. Bolívar, Valera', 30, NULL, 20, 1),
('Meet the Brewer Andino', '2025-02-15', '2025-02-15', 'Cervecería Valle', 20, NULL, 20, 7),
('Concurso Homebrew Trujillo', '2025-03-22', '2025-03-23', 'Plaza Bolívar', 15, NULL, 20, 3),
('Tour Cervecero Agrícola', '2025-04-25', '2025-04-25', 'Hacienda Café', 30, NULL, 20, 6),
('Taller de Cata Andina', '2025-05-28', '2025-05-28', 'Centro Cultural', 20, NULL, 20, 2);

-- Vargas (fk_lugar = 21)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Costero', '2025-02-01', '2025-02-03', 'Av. La Costa, La Guaira', 40, NULL, 21, 1),
('Taller de Cata en Playa', '2025-03-05', '2025-03-05', 'Playa Camurí Chico', 30, NULL, 21, 2),
('Lanzamiento Vargas', '2025-04-10', '2025-04-10', 'C.C. Macuto', NULL, NULL, 21, 4),
('Curso Elaboración Costero', '2025-05-15', '2025-05-16', 'Escuela de Turismo', 60, NULL, 21, 9),
('Cena Maridaje del Mar', '2025-06-20', '2025-06-20', 'Restaurante Bahía', 70, NULL, 21, 5);

-- Yaracuy (fk_lugar = 22)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Yaracuyano', '2025-02-15', '2025-02-17', 'Av. Yaracuy, San Felipe', 30, NULL, 22, 1),
('Tour Cervecero Agrícola', '2025-03-18', '2025-03-18', 'Cervecería Cacao', 25, NULL, 22, 6),
('Cena Maridaje de Montaña', '2025-04-22', '2025-04-22', 'Restaurante El Cacao', 55, NULL, 22, 5),
('Expo Ingredientes Yaracuy', '2025-05-26', '2025-05-27', 'Centro de Eventos', 15, NULL, 22, 10),
('Concurso Homebrew Yaracuy', '2025-06-30', '2025-07-01', 'Plaza Bolívar', 15, NULL, 22, 3);

-- Zulia (fk_lugar = 23)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero del Lago', '2025-03-01', '2025-03-03', 'Paseo del Lago, Maracaibo', 40, NULL, 23, 1),
('Taller de Cata Zuliano', '2025-04-03', '2025-04-03', 'Centro de Convenciones', 30, NULL, 23, 2),
('Lanzamiento Petrolero', '2025-05-08', '2025-05-08', 'C.C. Lago Mall', NULL, NULL, 23, 4),
('Curso Elaboración Zulia', '2025-06-12', '2025-06-13', 'Escuela Gastronómica', 55, NULL, 23, 9),
('Oktoberfest Marabino', '2025-07-18', '2025-07-19', 'Club Aleman', 45, NULL, 23, 8);

-- Dependencias Federales (fk_lugar = 24)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Isla', '2025-03-15', '2025-03-17', 'Playa El Yaque, Isla Margarita', 50, NULL, 24, 1),
('Cena Maridaje en Playa', '2025-04-18', '2025-04-18', 'Restaurante El Yaque', 80, NULL, 24, 5),
('Tour Cervecero Caribeño', '2025-05-22', '2025-05-22', 'Cervecería Isla Bonita', 40, NULL, 24, 6),
('Expo Ingredientes Insulares', '2025-06-26', '2025-06-27', 'Centro de Eventos', 20, NULL, 24, 10),
('Concurso Homebrew Caribe', '2025-07-30', '2025-07-31', 'Playa Parguito', 20, NULL, 24, 3);

--Tipo invitado
INSERT INTO tipo_invitado (nombre) VALUES
('Maestro Cervecero'),
('Sommelier de Cerveza'),
('Crítico Gastronómico'),
('Representante de Prensa'),
('Influencer'),
('Proveedor'),
('Cliente VIP'),
('Ejecutivo de Cuentas'),
('Personalidad Pública'),
('Jurado de Competencia');

-- Invitados 
INSERT INTO invitado (rif, primer_nombre, primer_apellido, fk_tipo_invitado) VALUES
(123456789, 'Carlos', 'Rodríguez', 1),   -- Maestro Cervecero
(234567890, 'María', 'González', 2),     -- Sommelier
(345678901, 'Luis', 'Pérez', 3),         -- Crítico Gastronómico
(456789012, 'Ana', 'Martínez', 4),       -- Representante de Prensa
(567890123, 'Pedro', 'López', 5),        -- Influencer
(678901234, 'Laura', 'Hernández', 6),    -- Proveedor
(789012345, 'Jorge', 'Díaz', 7),         -- Cliente VIP
(890123456, 'Sofía', 'Torres', 8),       -- Ejecutivo de Cuentas
(901234567, 'Diego', 'Ramírez', 9),      -- Personalidad Pública
(112233445, 'Isabella', 'Fernández', 10);-- Jurado

--Invitado_Evento
INSERT INTO inv_eve (fecha_hora_entrada, fecha_hora_salida, fk_invitado, fk_evento) VALUES
('2025-06-16 18:00:00', '2025-06-16 22:30:00', 1, 1),
('2025-06-16 19:15:00', '2025-06-16 23:00:00', 2, 2),
('2025-06-16 20:00:00', '2025-06-16 23:45:00', 3, 3),
('2025-06-16 17:45:00', '2025-06-16 21:15:00', 4, 4),
('2025-06-16 18:30:00', '2025-06-16 22:00:00', 5, 5),
('2025-06-16 19:00:00', '2025-06-16 22:45:00', 6, 6),
('2025-06-16 20:30:00', '2025-06-16 23:30:00', 7, 7),
('2025-06-16 17:30:00', '2025-06-16 21:00:00', 8, 8),
('2025-06-16 18:45:00', '2025-06-16 22:15:00', 9, 9),
('2025-06-16 19:30:00', '2025-06-16 23:15:00', 10, 10);

--Caracteristica
INSERT INTO caracteristica (nombre) VALUES
('Color'),
('Amargor (IBU)'),
('Alcohol (% ABV)'),
('Cuerpo'),
('Aroma'),
('Sabor'),
('Carbonatación'),
('Claridad'),
('Retención de espuma'),
('Fermentación');

INSERT INTO car_tip (descripcion, valor, rango_menor, rango_mayor, fk_caracteristica, fk_tipo_cerveza) VALUES
('Color claro', 5, 2, 10, 1, 2),
('Amargor medio', 20, 15, 30, 2, 2),
('Alcohol moderado', 5, 4, 6, 3, 3),
('Cuerpo ligero', 3, 1, 5, 4, 4),
('Aroma cítrico', 8, 5, 10, 5, 5),
('Sabor maltoso', 7, 5, 9, 6, 6),
('Carbonatación alta', 9, 7, 10, 7, 7),
('Claridad cristalina', 10, 8, 10, 8, 8),
('Retención de espuma óptima', 9, 7, 10, 9, 9),
('Fermentación alta', 8, 6, 10, 10, 10);


INSERT INTO car_cer (descripcion, valor, fk_caracteristica, fk_cerveza) VALUES
('Color dorado', 8, 1, 5),
('Amargor suave', 15, 2, 6),
('Alcohol bajo', 4, 3, 7),
('Cuerpo cremoso', 6, 4, 8),
('Aroma herbal', 7, 5, 9),
('Sabor afrutado', 9, 6, 10),
('Carbonatación moderada', 7, 7, 11),
('Claridad turbia', 5, 8, 12),
('Retención de espuma media', 6, 9, 13),
('Fermentación baja', 4, 10, 14);

--Eve_mie
INSERT INTO eve_mie (clave, descripcion_participacion, fk_miembro, fk_evento) VALUES
(1, 'Participación como expositor en el evento', 123456789, 1),
(2, 'Asistencia como invitado especial', 234567890, 2),
(3, 'Organización y logística del evento', 345678901, 3),
(4, 'Colaboración en la promoción y difusión', 456789012, 4),
(5, 'Participación en mesa redonda', 567890123, 5),
(6, 'Facilitación de talleres educativos',678901234, 6),
(7, 'Coordinación de recursos y materiales', 789012345, 7),
(8, 'Presentación de informe y resultados', 890123456, 8),
(9, 'Moderador en discusión grupal', 901234567, 9),
(10, 'Participación en la planificación estra', 112233445,10);

-- Asistencia
INSERT INTO asistencia (clave, fecha_entrada, fk_evento, fk_cliente) VALUES
(1, '2025-06-17 10:00:00', 1, 1),
(2, '2025-06-17 11:00:00', 2, 2),
(3, '2025-06-17 12:00:00', 3, 3),
(4, '2025-06-17 13:00:00', 4, 4),
(5, '2025-06-17 14:00:00', 5, 5),
(6, '2025-06-17 15:00:00', 6, 6),
(7, '2025-06-17 16:00:00', 7, 7),
(8, '2025-06-17 17:00:00', 8, 8),
(9, '2025-06-17 18:00:00', 9, 9),
(10, '2025-06-17 19:00:00', 10, 10);

INSERT INTO cuota (clave, fecha, monto, fk_miembro) VALUES
(1, '2025-06-01', 500, 123456789),
(2, '2025-06-02', 750, 234567890),
(3, '2025-06-03', 600, 345678901),
(4, '2025-06-04', 850, 456789012),
(5, '2025-06-05', 900, 567890123),
(6, '2025-06-06', 700, 678901234),
(7, '2025-06-07', 650, 789012345),
(8, '2025-06-08', 800, 890123456),
(9, '2025-06-09', 550, 901234567),
(10, '2025-06-10', 950, 112233445);
