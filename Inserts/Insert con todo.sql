--ingresa todos los estados

INSERT INTO lugar (nombre,tipo,fk_lugar)
VALUES ('Amazonas', 'estado', NULL),
       ('Anzoátegui', 'estado', NULL),
       ('Apure', 'estado', NULL),
       ('Aragua', 'estado', NULL),
       ('Barinas', 'estado', NULL),
       ('Bolívar', 'estado', NULL),
       ('Carabobo', 'estado', NULL),
       ('Cojedes', 'estado', NULL),
       ('Delta Amacuro', 'estado', NULL),
       ('Distrito Capital', 'estado', NULL),
       ('Falcón', 'estado', NULL),
       ('Guárico', 'estado', NULL),
       ('Lara', 'estado', NULL),
       ('La Guaira', 'estado', NULL),
       ('Mérida', 'estado', NULL),
       ('Miranda', 'estado', NULL),
       ('Monagas', 'estado', NULL),
       ('Nueva Esparta', 'estado', NULL),
       ('Portuguesa', 'estado', NULL),
       ('Sucre', 'estado', NULL),
       ('Táchira', 'estado', NULL),
       ('Trujillo', 'estado', NULL),
       ('Yaracuy', 'estado', NULL),
       ('Zulia', 'estado', NULL);

-- ==============================================
-- Inserción de datos: Municipios del Estado Amazonas
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Alto Orinoco', 'municipio', 1),
       ('Atabapo', 'municipio', 1),
       ('Atures', 'municipio', 1),
       ('Autana', 'municipio', 1),
       ('Manapiare', 'municipio', 1),
       ('Maroa', 'municipio', 1),
       ('Río Negro', 'municipio', 1);

-- ==============================================
-- Inserción de datos: Municipios del Estado Anzoátegui
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Anaco', 'municipio', 2),
       ('Aragua', 'municipio', 2),
       ('Bolívar', 'municipio', 2),
       ('Bruzual', 'municipio', 2),
       ('Cajigal', 'municipio', 2),
       ('Carvajal', 'municipio', 2),
       ('Freites', 'municipio', 2),
       ('Guanipa', 'municipio', 2),
       ('Guanta', 'municipio', 2),
       ('Independencia', 'municipio', 2),
       ('Libertad', 'municipio', 2),
       ('Sir Arthur McGregor', 'municipio', 2),
       ('Miranda', 'municipio', 2),
       ('Monagas', 'municipio', 2),
       ('Peñalver', 'municipio', 2),
       ('Píritu', 'municipio', 2),
       ('San Juan de Capistrano', 'municipio', 2),
       ('Santa Ana', 'municipio', 2),
       ('Simón Rodríguez', 'municipio', 2),
       ('Sotillo', 'municipio', 2),
       ('Turístico Diego Bautista Urbaneja', 'municipio', 2);

-- ==============================================
-- Inserción de datos: Municipios del Estado Apure
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Achaguas', 'municipio', 3),
       ('Biruaca', 'municipio', 3),
       ('Pedro Camejo', 'municipio', 3),
       ('Muñoz', 'municipio', 3),
       ('Páez', 'municipio', 3),
       ('Rómulo Gallegos', 'municipio', 3),
       ('San Fernando', 'municipio', 3);

-- ==============================================
-- Inserción de datos: Municipios del Estado Aragua
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Alcántara', 'municipio', 4),
       ('Bolívar', 'municipio', 4),
       ('Camatagua', 'municipio', 4),
       ('Girardot', 'municipio', 4),
       ('Iragorry', 'municipio', 4),
       ('Lamas', 'municipio', 4),
       ('Libertador', 'municipio', 4),
       ('Mariño', 'municipio', 4),
       ('Michelena', 'municipio', 4),
       ('Ocumare de la Costa de Oro', 'municipio', 4),
       ('Revenga', 'municipio', 4),
       ('Ribas', 'municipio', 4),
       ('San Casimiro', 'municipio', 4),
       ('San Sebastián', 'municipio', 4),
       ('Sucre', 'municipio', 4),
       ('Tovar', 'municipio', 4),
       ('Urdaneta', 'municipio', 4),
       ('Zamora', 'municipio', 4);

-- ==============================================
-- Inserción de datos: Municipios del Estado Barinas
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Alberto Arvelo Torrealba', 'municipio', 5),
       ('Andrés Eloy Blanco', 'municipio', 5),
       ('Antonio José de Sucre', 'municipio', 5),
       ('Arismendi', 'municipio', 5),
       ('Barinas', 'municipio', 5),
       ('Bolívar', 'municipio', 5),
       ('Cruz Paredes', 'municipio', 5),
       ('Ezequiel Zamora', 'municipio', 5),
       ('Obispos', 'municipio', 5),
       ('Pedraza', 'municipio', 5),
       ('Rojas', 'municipio', 5),
       ('Sosa', 'municipio', 5);

-- ==============================================
-- Inserción de datos: Municipios del Estado Bolívar
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Angostura', 'municipio', 6),
       ('Angostura del Orinoco', 'municipio', 6),
       ('Caroní', 'municipio', 6),
       ('Cedeño', 'municipio', 6),
       ('Chien', 'municipio', 6),
       ('El Callao', 'municipio', 6),
       ('Gran Sabana', 'municipio', 6),
       ('Piar', 'municipio', 6),
       ('Roscio', 'municipio', 6),
       ('Sifontes', 'municipio', 6),
       ('Sucre', 'municipio', 6);

-- ==============================================
-- Inserción de datos: Municipios del Estado Carabobo
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Bejuma', 'municipio', 7),
       ('Carlos Arvelo', 'municipio', 7),
       ('Diego Ibarra', 'municipio', 7),
       ('Guacara', 'municipio', 7),
       ('Juan José Mora', 'municipio', 7),
       ('Libertador', 'municipio', 7),
       ('Los Guayos', 'municipio', 7),
       ('Miranda', 'municipio', 7),
       ('Montalbán', 'municipio', 7),
       ('Naguanagua', 'municipio', 7),
       ('Puerto Cabello', 'municipio', 7),
       ('San Diego', 'municipio', 7),
       ('San Joaquín', 'municipio', 7),
       ('Valencia', 'municipio', 7);

-- ==============================================
-- Inserción de datos: Municipios del Estado Cojedes
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Anzoátegui', 'municipio', 8),
       ('San Carlos', 'municipio', 8),
       ('Girardot', 'municipio', 8),
       ('Lima Blanco', 'municipio', 8),
       ('Pao de San Juan Bautista', 'municipio', 8),
       ('Ricaurte', 'municipio', 8),
       ('Rómulo Gallegos', 'municipio', 8),
       ('Tinaco', 'municipio', 8),
       ('Tinaquillo', 'municipio', 8);

-- ==============================================
-- Inserción de datos: Municipios del Estado Delta Amacuro
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Antonio Díaz', 'municipio', 9),
       ('Casacoima', 'municipio', 9),
       ('Pedernales', 'municipio', 9),
       ('Tucupita', 'municipio', 9);

-- ==============================================
-- Inserción de datos: Municipio Distrito Capital
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Caracas', 'municipio', 10);

-- ==============================================
-- Inserción de datos: Municipios del Estado Falcón
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Acosta', 'municipio', 11),
       ('Bolívar', 'municipio', 11),
       ('Buchivacoa', 'municipio', 11),
       ('Carirubana', 'municipio', 11),
       ('Colina', 'municipio', 11),
       ('Dabajuro', 'municipio', 11),
       ('Democracia', 'municipio', 11),
       ('Falcón', 'municipio', 11),
       ('Federación', 'municipio', 11),
       ('Iturriza', 'municipio', 11),
       ('Jacura', 'municipio', 11),
       ('Los Taques', 'municipio', 11),
       ('Manaure', 'municipio', 11),
       ('Mauroa', 'municipio', 11),
       ('Miranda', 'municipio', 11),
       ('Palmasola', 'municipio', 11),
       ('Petit', 'municipio', 11),
       ('Píritu', 'municipio', 11),
       ('San Francisco', 'municipio', 11),
       ('Sucre', 'municipio', 11),
       ('Silva', 'municipio', 11),
       ('Tocópero', 'municipio', 11),
       ('Unión', 'municipio', 11),
       ('Urumaco', 'municipio', 11),
       ('Zamora', 'municipio', 11);

-- ==============================================
-- Inserción de datos: Municipios del Estado Guárico
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Camaguán', 'municipio', 12),
       ('Chaguaramas', 'municipio', 12),
       ('El Socorro', 'municipio', 12),
       ('Francisco de Miranda', 'municipio', 12),
       ('José Félix Ribas', 'municipio', 12),
       ('José Tadeo Monagas', 'municipio', 12),
       ('Juan Germán Roscio', 'municipio', 12),
       ('Juan José Rondón', 'municipio', 12),
       ('Julián Mellado', 'municipio', 12),
       ('Leonardo Infante', 'municipio', 12),
       ('Ortiz', 'municipio', 12),
       ('San Gerónimo de Guayabal', 'municipio', 12),
       ('San José de Guaribe', 'municipio', 12),
       ('Santa María de Ipire', 'municipio', 12),
       ('Zaraza', 'municipio', 12);

-- ==============================================
-- Inserción de datos: Municipios del Estado Lara
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Andrés Eloy Blanco', 'municipio', 13),
       ('Crespo', 'municipio', 13),
       ('Iribarren', 'municipio', 13),
       ('Jiménez', 'municipio', 13),
       ('Morán', 'municipio', 13),
       ('Palavecino', 'municipio', 13),
       ('Simón Planas', 'municipio', 13),
       ('Torres', 'municipio', 13),
       ('Urdaneta', 'municipio', 13);

-- ==============================================
-- Inserción de datos: Municipio La Guaira
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Vargas', 'municipio', 14);

-- ==============================================
-- Inserción de datos: Municipios del Estado Mérida
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Alberto Adriani', 'municipio', 15),
       ('Andrés Bello', 'municipio', 15),
       ('Antonio Pinto Salinas', 'municipio', 15),
       ('Aricagua', 'municipio', 15),
       ('Arzobispo Chacón', 'municipio', 15),
       ('Campo Elías', 'municipio', 15),
       ('Caracciolo Parra Olmedo', 'municipio', 15),
       ('Cardenal Quintero', 'municipio', 15),
       ('Guaraque', 'municipio', 15),
       ('Julio César Salas', 'municipio', 15),
       ('Justo Briceño', 'municipio', 15),
       ('Libertador', 'municipio', 15),
       ('Miranda', 'municipio', 15),
       ('Obispo Ramos de Lora', 'municipio', 15),
       ('Padre Noguera', 'municipio', 15),
       ('Pueblo Llano', 'municipio', 15),
       ('Rangel', 'municipio', 15),
       ('Rivas Dávila', 'municipio', 15),
       ('Santos Marquina', 'municipio', 15),
       ('Sucre', 'municipio', 15),
       ('Tovar', 'municipio', 15),
       ('Tulio Febres Cordero', 'municipio', 15),
       ('Zea', 'municipio', 15);

-- ==============================================
-- Inserción de datos: Municipios del Estado Miranda
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Acevedo', 'municipio', 16),
       ('Andrés Bello', 'municipio', 16),
       ('Baruta', 'municipio', 16),
       ('Bolívar', 'municipio', 16),
       ('Brión', 'municipio', 16),
       ('Buroz', 'municipio', 16),
       ('Carrizal', 'municipio', 16),
       ('Chacao', 'municipio', 16),
       ('Cristóbal Rojas', 'municipio', 16),
       ('El Hatillo', 'municipio', 16),
       ('Guaicaipuro', 'municipio', 16),
       ('Gual', 'municipio', 16),
       ('Independencia', 'municipio', 16),
       ('Lander', 'municipio', 16),
       ('Los Salias', 'municipio', 16),
       ('Páez', 'municipio', 16),
       ('Paz Castillo', 'municipio', 16),
       ('Plaza', 'municipio', 16),
       ('Sucre', 'municipio', 16),
       ('Urdaneta', 'municipio', 16),
       ('Zamora', 'municipio', 16);

-- ==============================================
-- Inserción de datos: Municipios del Estado Monagas
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Acosta', 'municipio', 17),
       ('Aguasay', 'municipio', 17),
       ('Bolívar', 'municipio', 17),
       ('Caripe', 'municipio', 17),
       ('Cedeño', 'municipio', 17),
       ('Libertador', 'municipio', 17),
       ('Maturín', 'municipio', 17),
       ('Piar', 'municipio', 17),
       ('Punceres', 'municipio', 17),
       ('Santa Bárbara', 'municipio', 17),
       ('Sotillo', 'municipio', 17),
       ('Uracoa', 'municipio', 17),
       ('Zamora', 'municipio', 17);

-- ==============================================
-- Inserción de datos: Municipios del Estado Nueva Esparta
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Antolín del Campo', 'municipio', 18),
       ('Antonio Díaz', 'municipio', 18),
       ('Arismendi', 'municipio', 18),
       ('García', 'municipio', 18),
       ('Gómez', 'municipio', 18),
       ('Macanao', 'municipio', 18),
       ('Maneiro', 'municipio', 18),
       ('Marcano', 'municipio', 18),
       ('Mariño', 'municipio', 18),
       ('Tubores', 'municipio', 18),
       ('Villalba', 'municipio', 18);

-- ==============================================
-- Inserción de datos: Municipios del Estado Portuguesa
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Agua Blanca', 'municipio', 19),
       ('Araure', 'municipio', 19),
       ('Esteller', 'municipio', 19),
       ('Guanare', 'municipio', 19),
       ('Guanarito', 'municipio', 19),
       ('José Vicente de Unda', 'municipio', 19),
       ('Ospino', 'municipio', 19),
       ('Páez', 'municipio', 19),
       ('Papelón', 'municipio', 19),
       ('San Genaro de Boconoíto', 'municipio', 19),
       ('San Rafael de Onoto', 'municipio', 19),
       ('Santa Rosalía', 'municipio', 19),
       ('Sucre', 'municipio', 19),
       ('Turén', 'municipio', 19);

-- ==============================================
-- Inserción de datos: Municipios del Estado Sucre
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Andrés Eloy Blanco', 'municipio', 20),
       ('Andrés Mata', 'municipio', 20),
       ('Arismendi', 'municipio', 20),
       ('Benítez', 'municipio', 20),
       ('Bermúdez', 'municipio', 20),
       ('Bolívar', 'municipio', 20),
       ('Cajigal', 'municipio', 20),
       ('Cruz Salmerón Acosta', 'municipio', 20),
       ('Libertador', 'municipio', 20),
       ('Mariño', 'municipio', 20),
       ('Mejía', 'municipio', 20),
       ('Montes', 'municipio', 20),
       ('Ribero', 'municipio', 20),
       ('Sucre', 'municipio', 20),
       ('Valdez', 'municipio', 20);

-- ==============================================
-- Inserción de datos: Municipios del Estado Táchira
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Andrés Bello', 'municipio', 21),
       ('Antonio Rómulo Costa', 'municipio', 21),
       ('Ayacucho', 'municipio', 21),
       ('Bolívar', 'municipio', 21),
       ('Cárdenas', 'municipio', 21),
       ('Córdoba', 'municipio', 21),
       ('Fernández', 'municipio', 21),
       ('Francisco de Miranda', 'municipio', 21),
       ('García de Hevia', 'municipio', 21),
       ('Guásimos', 'municipio', 21),
       ('Independencia', 'municipio', 21),
       ('Jáuregui', 'municipio', 21),
       ('José María Vargas', 'municipio', 21),
       ('Junín', 'municipio', 21),
       ('Libertad', 'municipio', 21),
       ('Libertador', 'municipio', 21),
       ('Lobatera', 'municipio', 21),
       ('Michelena', 'municipio', 21),
       ('Panamericano', 'municipio', 21),
       ('Pedro María Ureña', 'municipio', 21),
       ('Rafael Urdaneta', 'municipio', 21),
       ('Samuel Dario Maldonado', 'municipio', 21),
       ('San Cristóbal', 'municipio', 21),
       ('San Judas Tadeo', 'municipio', 21),
       ('Seboruco', 'municipio', 21),
       ('Simón Rodríguez', 'municipio', 21),
       ('Sucre', 'municipio', 21),
       ('Torbes', 'municipio', 21),
       ('Uribante', 'municipio', 21);

-- ==============================================
-- Inserción de datos: Municipios del Estado Trujillo
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Andrés Bello', 'municipio', 22),
       ('Boconó', 'municipio', 22),
       ('Bolívar', 'municipio', 22),
       ('Candelaria', 'municipio', 22),
       ('Carache', 'municipio', 22),
       ('Carvajal', 'municipio', 22),
       ('Escuque', 'municipio', 22),
       ('Juan Vicente Campos Elías', 'municipio', 22),
       ('La Ceiba', 'municipio', 22),
       ('Márquez Cañizales', 'municipio', 22),
       ('Miranda', 'municipio', 22),
       ('Monte Carmelo', 'municipio', 22),
       ('Motatán', 'municipio', 22),
       ('Pampán', 'municipio', 22),
       ('Pampanito', 'municipio', 22),
       ('Rangel', 'municipio', 22),
       ('Sucre', 'municipio', 22),
       ('Trujillo', 'municipio', 22),
       ('Urdaneta', 'municipio', 22),
       ('Valera', 'municipio', 22);

-- ==============================================
-- Inserción de datos: Municipios del Estado Yaracuy
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Arístides Bastidas', 'municipio', 23),
       ('Bolívar', 'municipio', 23),
       ('Bruzual', 'municipio', 23),
       ('Cocorote', 'municipio', 23),
       ('Independencia', 'municipio', 23),
       ('José Antonio Páez', 'municipio', 23),
       ('La Trinidad', 'municipio', 23),
       ('Manuel Monge', 'municipio', 23),
       ('Nirgua', 'municipio', 23),
       ('Peña', 'municipio', 23),
       ('San Felipe', 'municipio', 23),
       ('Sucre', 'municipio', 23),
       ('Urachiche', 'municipio', 23),
       ('Veroes', 'municipio', 23);

-- ==============================================
-- Inserción de datos: Municipios del Estado Zulia
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Almirante Padilla', 'municipio', 24),
       ('Baralt', 'municipio', 24),
       ('Cabimas', 'municipio', 24),
       ('Catatumbo', 'municipio', 24),
       ('Colón', 'municipio', 24),
       ('Francisco Javier Pulgar', 'municipio', 24),
       ('Guajira', 'municipio', 24),
       ('Jesús Enrique Losada', 'municipio', 24),
       ('Jesús María Semprún', 'municipio', 24),
       ('La Cañada de Urdaneta', 'municipio', 24),
       ('Lagunillas', 'municipio', 24),
       ('Machiques de Perijá', 'municipio', 24),
       ('Mara', 'municipio', 24),
       ('Maracaibo', 'municipio', 24),
       ('Miranda', 'municipio', 24),
       ('Rosario de Perijá', 'municipio', 24),
       ('San Francisco', 'municipio', 24),
       ('Santa Rita', 'municipio', 24),
       ('Simón Bolívar', 'municipio', 24),
       ('Sucre', 'municipio', 24),
       ('Valmore Rodríguez', 'municipio', 24);

-- #######################################################
--  Inserción de datos: Parroquias (todas las entidades)
-- #######################################################

-- ==============================================
-- Parroquias del Municipio Alto Orinoco (Amazonas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LA ESMERALDA', 'parroquia', 25),
       ('HUACHAMACARE', 'parroquia', 25),
       ('MARAWAKA', 'parroquia', 25),
       ('MAVACA', 'parroquia', 25),
       ('SIERRA PARIMA', 'parroquia', 25);

-- ==============================================
-- Parroquias del Municipio Atabapo (Amazonas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN FERNANDO DE ATABA', 'parroquia', 26),
       ('UCATA', 'parroquia', 26),
       ('YAPACANA', 'parroquia', 26),
       ('CANAME', 'parroquia', 26);

-- ==============================================
-- Parroquias del Municipio Atures (Amazonas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('FERNANDO GIRON TOVAR', 'parroquia', 27),
       ('LUIS ALBERTO GOMEZ', 'parroquia', 27),
       ('PARHUEÑA', 'parroquia', 27),
       ('PLATANILLAL', 'parroquia', 27);

-- ==============================================
-- Parroquias del Municipio Autana (Amazonas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. ISLA DE RATON', 'parroquia', 28),
       ('SAMARIAPO', 'parroquia', 28),
       ('SIPAPO', 'parroquia', 28),
       ('MUNDUAPO', 'parroquia', 28),
       ('GUAYAPO', 'parroquia', 28);

-- ==============================================
-- Parroquias del Municipio Manapiare (Amazonas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN JUAN DE MANAPIARE', 'parroquia', 29),
       ('ALTO VENTUARI', 'parroquia', 29),
       ('MEDIO VENTUARI', 'parroquia', 29),
       ('BAJO VENTUARI', 'parroquia', 29);

-- ==============================================
-- Parroquias del Municipio Maroa (Amazonas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. MAROA', 'parroquia', 30),
       ('VICTORINO', 'parroquia', 30),
       ('COMUNIDAD', 'parroquia', 30);

-- ==============================================
-- Parroquias del Municipio Río Negro (Amazonas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN CARLOS DE RIO NEG', 'parroquia', 31),
       ('SOLANO', 'parroquia', 31),
       ('COCUY', 'parroquia', 31);

-- ==============================================
-- Parroquias del Municipio Anaco (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ANACO', 'parroquia', 32),
       ('SAN JOAQUIN', 'parroquia', 32),
       ('BUENA VISTA', 'parroquia', 32);

-- ==============================================
-- Parroquias del Municipio Aragua (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. ARAGUA DE BARCELONA', 'parroquia', 33),
       ('CACHIPO', 'parroquia', 33);

-- ==============================================
-- Parroquias del Municipio Bolívar (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL CARMEN', 'parroquia', 34),
       ('SAN CRISTOBAL', 'parroquia', 34),
       ('BERGANTIN', 'parroquia', 34),
       ('CAIGUA', 'parroquia', 34),
       ('EL PILAR', 'parroquia', 34),
       ('NARICUAL', 'parroquia', 34);

-- ==============================================
-- Parroquias del Municipio Bruzual (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CLARINES', 'parroquia', 35),
       ('GUANAPE', 'parroquia', 35),
       ('SABANA DE UCHIRE', 'parroquia', 35);

-- ==============================================
-- Parroquias del Municipio Cajigal (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. ONOTO', 'parroquia', 36),
       ('SAN PABLO', 'parroquia', 36);

-- ==============================================
-- Parroquias del Municipio Carvajal (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('VALLE DE GUANAPE', 'parroquia', 37),
       ('SANTA BARBARA', 'parroquia', 37);

-- ==============================================
-- Parroquias del Municipio Freites (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CANTAURA', 'parroquia', 38),
       ('LIBERTADOR', 'parroquia', 38),
       ('SANTA ROSA', 'parroquia', 38),
       ('URICA', 'parroquia', 38);

-- ==============================================
-- Parroquia del Municipio Guanipa (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN JOSE DE GUANIPA', 'parroquia', 39);

-- ==============================================
-- Parroquias del Municipio Guanta (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GUANTA', 'parroquia', 40),
       ('CHORRERON', 'parroquia', 40);

-- ==============================================
-- Parroquias del Municipio Independencia (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SOLEDAD', 'parroquia', 41),
       ('MAMO', 'parroquia', 41);

-- ==============================================
-- Parroquias del Municipio Libertad (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN MATEO', 'parroquia', 42),
       ('EL CARITO', 'parroquia', 42),
       ('SANTA INES', 'parroquia', 42);

-- ==============================================
-- Parroquias del Municipio Sir Arthur McGregor (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL CHAPARRO', 'parroquia', 43),
       ('TOMAS ALFARO CALATRAVA', 'parroquia', 43);

-- ==============================================
-- Parroquias del Municipio Miranda (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PARIAGUAN', 'parroquia', 44),
       ('ATAPIRIRE', 'parroquia', 44),
       ('BOCA DEL PAO', 'parroquia', 44),
       ('EL PAO', 'parroquia', 44);

-- ==============================================
-- Parroquias del Municipio Monagas (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. MAPIRE', 'parroquia', 45),
       ('PIAR', 'parroquia', 45),
       ('SN DIEGO DE CABRUTICA', 'parroquia', 45),
       ('SANTA CLARA', 'parroquia', 45),
       ('UVERITO', 'parroquia', 45),
       ('ZUATA', 'parroquia', 45);

-- ==============================================
-- Parroquias del Municipio Peñalver (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PUERTO PIRITU', 'parroquia', 46),
       ('SAN MIGUEL', 'parroquia', 46),
       ('SUCRE', 'parroquia', 46);

-- ==============================================
-- Parroquias del Municipio Píritu (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PIRITU', 'parroquia', 47),
       ('SAN FRANCISCO', 'parroquia', 47);

-- ==============================================
-- Parroquias del Municipio San Juan de Capistrano (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BOCA UCHIRE', 'parroquia', 48),
       ('BOCA DE CHAVEZ', 'parroquia', 48);

-- ==============================================
-- Parroquias del Municipio Santa Ana (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SANTA ANA', 'parroquia', 49),
       ('PUEBLO NUEVO', 'parroquia', 49);

-- ==============================================
-- Parroquias del Municipio Simón Rodríguez (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EDMUNDO BARRIOS', 'parroquia', 50),
       ('MIGUEL OTERO SILVA', 'parroquia', 50),
       ('CM. EL TIGRE', 'parroquia', 50);

-- ==============================================
-- Parroquias del Municipio Sotillo (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('POZUELOS', 'parroquia', 51),
       ('CM PTO. LA CRUZ', 'parroquia', 51);

-- ==============================================
-- Parroquias del Municipio Turístico Diego Bautista Urbaneja (Anzoátegui)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('LECHERIAS', 'parroquia', 52),
       ('EL MORRO', 'parroquia', 52);

-- ==============================================
-- Parroquias del Municipio Achaguas (Apure)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ACHAGUAS', 'parroquia', 53),
       ('APURITO', 'parroquia', 53),
       ('EL YAGUAL', 'parroquia', 53),
       ('GUACHARA', 'parroquia', 53),
       ('MUCURITAS', 'parroquia', 53),
       ('QUESERAS DEL MEDIO', 'parroquia', 53);

-- ==============================================
-- Parroquia del Municipio Biruaca (Apure)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BIRUACA', 'parroquia', 54);

-- ==============================================
-- Parroquias del Municipio Pedro Camejo (Apure)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN JUAN DE PAYARA', 'parroquia', 55),
       ('CODAZZI', 'parroquia', 55),
       ('CUNAVICHE', 'parroquia', 55);

-- ==============================================
-- Parroquias del Municipio Muñoz (Apure)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BRUZUAL', 'parroquia', 56),
       ('MANTECAL', 'parroquia', 56),
       ('QUINTERO', 'parroquia', 56),
       ('SAN VICENTE', 'parroquia', 56),
       ('RINCON HONDO', 'parroquia', 56);

-- ==============================================
-- Parroquias del Municipio Páez (Apure)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GUASDUALITO', 'parroquia', 57),
       ('ARAMENDI', 'parroquia', 57),
       ('EL AMPARO', 'parroquia', 57),
       ('SAN CAMILO', 'parroquia', 57),
       ('URDANETA', 'parroquia', 57);

-- ==============================================
-- Parroquias del Municipio Rómulo Gallegos (Apure)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ELORZA', 'parroquia', 58),
       ('LA TRINIDAD', 'parroquia', 58);

-- ==============================================
-- Parroquias del Municipio San Fernando (Apure)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN FERNANDO', 'parroquia', 59),
       ('PEÑALVER', 'parroquia', 59),
       ('EL RECREO', 'parroquia', 59),
       ('SN RAFAEL DE ATAMAICA', 'parroquia', 59);

-- ==============================================
-- Parroquias del Municipio Alcántara (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SANTA RITA', 'parroquia', 60),
       ('FRANCISCO DE MIRANDA', 'parroquia', 60),
       ('MONS FELICIANO G', 'parroquia', 60);

-- ==============================================
-- Parroquia del Municipio Bolívar (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN MATEO', 'parroquia', 61);

-- ==============================================
-- Parroquias del Municipio Camatagua (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CAMATAGUA', 'parroquia', 62),
       ('CARMEN DE CURA', 'parroquia', 62);

-- ==============================================
-- Parroquias del Municipio Girardot (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LAS DELICIAS', 'parroquia', 63),
       ('CHORONI', 'parroquia', 63),
       ('MADRE MA DE SAN JOSE', 'parroquia', 63),
       ('JOAQUIN CRESPO', 'parroquia', 63),
       ('PEDRO JOSE OVALLES', 'parroquia', 63),
       ('JOSE CASANOVA GODOY', 'parroquia', 63),
       ('ANDRES ELOY BLANCO', 'parroquia', 63),
       ('LOS TACARIGUAS', 'parroquia', 63);

-- ==============================================
-- Parroquias del Municipio Iragorry (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. EL LIMON', 'parroquia', 64),
       ('CA A DE AZUCAR', 'parroquia', 64);

-- ==============================================
-- Parroquia del Municipio Lamas (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SANTA CRUZ', 'parroquia', 65);

-- ==============================================
-- Parroquias del Municipio Libertador (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PALO NEGRO', 'parroquia', 66),
       ('SAN MARTIN DE PORRES', 'parroquia', 66);

-- ==============================================
-- Parroquias del Municipio Mariño (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. TURMERO', 'parroquia', 67),
       ('SAMAN DE GUERE', 'parroquia', 67),
       ('ALFREDO PACHECO M', 'parroquia', 67),
       ('CHUAO', 'parroquia', 67),
       ('AREVALO APONTE', 'parroquia', 67);

-- ==============================================
-- Parroquias del Municipio Michelena (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LAS TEJERIAS', 'parroquia', 68),
       ('TIARA', 'parroquia', 68);

-- ==============================================
-- Parroquia del Municipio Ocumare de la Costa de Oro (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('OCUMARE DE LA COSTA', 'parroquia', 69);

-- ==============================================
-- Parroquia del Municipio Revenga (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. EL CONSEJO', 'parroquia', 70);

-- ==============================================
-- Parroquias del Municipio Ribas (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LA VICTORIA', 'parroquia', 71),
       ('ZUATA', 'parroquia', 71),
       ('PAO DE ZARATE', 'parroquia', 71),
       ('CASTOR NIEVES RIOS', 'parroquia', 71),
       ('LAS GUACAMAYAS', 'parroquia', 71);

-- ==============================================
-- Parroquias del Municipio San Casimiro (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN CASIMIRO', 'parroquia', 72),
       ('VALLE MORIN', 'parroquia', 72),
       ('GUIRIPA', 'parroquia', 72),
       ('OLLAS DE CARAMACATE', 'parroquia', 72);

-- ==============================================
-- Parroquia del Municipio San Sebastián (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN SEBASTIAN', 'parroquia', 73);

-- ==============================================
-- Parroquias del Municipio Sucre (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CAGUA', 'parroquia', 74),
       ('BELLA VISTA', 'parroquia', 74);

-- ==============================================
-- Parroquia del Municipio Tovar (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. COLONIA TOVAR', 'parroquia', 75);

-- ==============================================
-- Parroquias del Municipio Urdaneta (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. BARBACOAS', 'parroquia', 76),
       ('SAN FRANCISCO DE CARA', 'parroquia', 76),
       ('TAGUAY', 'parroquia', 76),
       ('LAS PEÑITAS', 'parroquia', 76);

-- ==============================================
-- Parroquias del Municipio Zamora (Aragua)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. VILLA DE CURA', 'parroquia', 77),
       ('MAGDALENO', 'parroquia', 77),
       ('SAN FRANCISCO DE ASIS', 'parroquia', 77),
       ('VALLES DE TUCUTUNEMO', 'parroquia', 77),
       ('PQ AUGUSTO MIJARES', 'parroquia', 77);

-- ==============================================
-- Parroquias del Municipio Alberto Arvelo Torrealba (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('RODRIGUEZ DOMINGUEZ', 'parroquia', 78),
       ('SABANETA', 'parroquia', 78);

-- ==============================================
-- Parroquias del Municipio Andrés Eloy Blanco (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL CANTON', 'parroquia', 79),
       ('SANTA CRUZ DE GUACAS', 'parroquia', 79),
       ('PUERTO VIVAS', 'parroquia', 79);

-- ==============================================
-- Parroquias del Municipio Antonio José de Sucre (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('TICOPORO', 'parroquia', 80),
       ('NICOLÁS PULIDO', 'parroquia', 80),
       ('ANDRÉS BELLO', 'parroquia', 80);

-- ==============================================
-- Parroquias del Municipio Arismendi (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ARISMENDI', 'parroquia', 81),
       ('GUADARRAMA', 'parroquia', 81),
       ('LA UNION', 'parroquia', 81),
       ('SAN ANTONIO', 'parroquia', 81);

-- ==============================================
-- Parroquias del Municipio Barinas (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('Méndez', 'parroquia', 82),
       ('Alto Barinas', 'parroquia', 82),
       ('Corazón de Jesús', 'parroquia', 82),
       ('El Carmen', 'parroquia', 82),
       ('Betancourt', 'parroquia', 82),
       ('Barinas', 'parroquia', 82),
       ('Torunos', 'parroquia', 82),
       ('Fajardo', 'parroquia', 82),
       ('Larriva', 'parroquia', 82),
       ('Páez', 'parroquia', 82),
       ('San Silvestre', 'parroquia', 82),
       ('Santa Inés', 'parroquia', 82),
       ('Santa Lucía', 'parroquia', 82),
       ('Domínguez', 'parroquia', 82);

-- ==============================================
-- Parroquias del Municipio Bolívar (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ALTAMIRA', 'parroquia', 83),
       ('BARINITAS', 'parroquia', 83),
       ('CALDERAS', 'parroquia', 83);

-- ==============================================
-- Parroquias del Municipio Cruz Paredes (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BARRANCAS', 'parroquia', 84),
       ('EL SOCORRO', 'parroquia', 84),
       ('MASPARRITO', 'parroquia', 84);

-- ==============================================
-- Parroquias del Municipio Ezequiel Zamora (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SANTA BARBARA', 'parroquia', 85),
       ('JOSE IGNACIO DEL PUMAR', 'parroquia', 85),
       ('RAMON IGNACIO MENDEZ', 'parroquia', 85),
       ('PEDRO BRICEÑO MENDEZ', 'parroquia', 85);

-- ==============================================
-- Parroquias del Municipio Obispos (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL REAL', 'parroquia', 86),
       ('LA LUZ', 'parroquia', 86),
       ('OBISPOS', 'parroquia', 86),
       ('LOS GUASIMITOS', 'parroquia', 86);

-- ==============================================
-- Parroquias del Municipio Pedraza (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CIUDAD BOLIVIA', 'parroquia', 87),
       ('IGNACIO BRICEÑO', 'parroquia', 87),
       ('PAEZ', 'parroquia', 87),
       ('JOSE FELIX RIBAS', 'parroquia', 87);

-- ==============================================
-- Parroquias del Municipio Rojas (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('DOLORES', 'parroquia', 88),
       ('LIBERTAD', 'parroquia', 88),
       ('PALACIO FAJARDO', 'parroquia', 88),
       ('SANTA ROSA', 'parroquia', 88);

-- ==============================================
-- Parroquias del Municipio Sosa (Barinas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CIUDAD DE NUTRIAS', 'parroquia', 89),
       ('EL REGALO', 'parroquia', 89),
       ('PUERTO DE NUTRIAS', 'parroquia', 89),
       ('SANTA CATALINA', 'parroquia', 89);

-- ==============================================
-- Parroquias del Municipio Angostura (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CIUDAD PIAR', 'parroquia', 90),
       ('SAN FRANCISCO', 'parroquia', 90),
       ('BARCELONETA', 'parroquia', 90),
       ('SANTA BARBARA', 'parroquia', 90);

-- ==============================================
-- Parroquias del Municipio Angostura del Orinoco (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CATEDRAL', 'parroquia', 91),
       ('AGUA SALADA', 'parroquia', 91),
       ('LA SABANITA', 'parroquia', 91),
       ('VISTA HERMOSA', 'parroquia', 91),
       ('MARHUANTA', 'parroquia', 91),
       ('JOSE ANTONIO PAEZ', 'parroquia', 91),
       ('ORINOCO', 'parroquia', 91),
       ('PANAPANA', 'parroquia', 91),
       ('ZEA', 'parroquia', 91);

-- ==============================================
-- Parroquias del Municipio Caroní (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SIMON BOLIVAR', 'parroquia', 92),
       ('ONCE DE ABRIL', 'parroquia', 92),
       ('VISTA AL SOL', 'parroquia', 92),
       ('CHIRICA', 'parroquia', 92),
       ('DALLA COSTA', 'parroquia', 92),
       ('CACHAMAY', 'parroquia', 92),
       ('UNIVERSIDAD', 'parroquia', 92),
       ('UNARE', 'parroquia', 92),
       ('YOCOIMA', 'parroquia', 92),
       ('POZO VERDE', 'parroquia', 92);

-- ==============================================
-- Parroquias del Municipio Cedeño (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CAICARA DEL ORINOCO', 'parroquia', 93),
       ('ASCENSION FARRERAS', 'parroquia', 93),
       ('ALTAGRACIA', 'parroquia', 93),
       ('LA URBANA', 'parroquia', 93),
       ('GUANIAMO', 'parroquia', 93),
       ('PIJIGUAOS', 'parroquia', 93);

-- ==============================================
-- Parroquia del Municipio Chien (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. EL PALMAR', 'parroquia', 94);

-- ==============================================
-- Parroquia del Municipio El Callao (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. EL CALLAO', 'parroquia', 95);

-- ==============================================
-- Parroquias del Municipio Gran Sabana (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SANTA ELENA DE UAIREN', 'parroquia', 96),
       ('IKABARU', 'parroquia', 96);

-- ==============================================
-- Parroquias del Municipio Piar (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. UPATA', 'parroquia', 97),
       ('ANDRES ELOY BLANCO', 'parroquia', 97),
       ('PEDRO COVA', 'parroquia', 97);

-- ==============================================
-- Parroquias del Municipio Roscio (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. GUASIPATI', 'parroquia', 98),
       ('SALOM', 'parroquia', 98);

-- ==============================================
-- Parroquias del Municipio Sifontes (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. TUMEREMO', 'parroquia', 99),
       ('DALLA COSTA', 'parroquia', 99),
       ('SAN ISIDRO', 'parroquia', 99);

-- ==============================================
-- Parroquias del Municipio Sucre (Bolívar)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. MARIPA', 'parroquia', 100),
       ('ARIPAO', 'parroquia', 100),
       ('LAS MAJADAS', 'parroquia', 100),
       ('MOITACO', 'parroquia', 100),
       ('GUARATARO', 'parroquia', 100);

-- ==============================================
-- Parroquias del Municipio Bejuma (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BEJUMA', 'parroquia', 101),
       ('CANOABO', 'parroquia', 101),
       ('SIMON BOLIVAR', 'parroquia', 101);

-- ==============================================
-- Parroquias del Municipio Carlos Arvelo (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GUIGUE', 'parroquia', 102),
       ('BELEN', 'parroquia', 102),
       ('TACARIGUA', 'parroquia', 102);

-- ==============================================
-- Parroquias del Municipio Diego Ibarra (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MARIARA', 'parroquia', 103),
       ('AGUAS CALIENTES', 'parroquia', 103);

-- ==============================================
-- Parroquias del Municipio Guacara (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GUACARA', 'parroquia', 104),
       ('CIUDAD ALIANZA', 'parroquia', 104),
       ('YAGUA', 'parroquia', 104);

-- ==============================================
-- Parroquias del Municipio Juan José Mora (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MORON', 'parroquia', 105),
       ('URAMA', 'parroquia', 105);

-- ==============================================
-- Parroquias del Municipio Libertador (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('U TOCUYITO', 'parroquia', 106),
       ('U INDEPENDENCIA', 'parroquia', 106);

-- ==============================================
-- Parroquia del Municipio Los Guayos (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('U LOS GUAYOS', 'parroquia', 107);

-- ==============================================
-- Parroquia del Municipio Miranda (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MIRANDA', 'parroquia', 108);

-- ==============================================
-- Parroquia del Municipio Montalbán (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MONTALBAN', 'parroquia', 109);

-- ==============================================
-- Parroquia del Municipio Naguanagua (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('NAGUANAGUA', 'parroquia', 110);

-- ==============================================
-- Parroquias del Municipio Puerto Cabello (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('DEMOCRACIA', 'parroquia', 111),
       ('FRATERNIDAD', 'parroquia', 111),
       ('GOAIGOAZA', 'parroquia', 111),
       ('JUAN JOSE FLORES', 'parroquia', 111),
       ('BARTOLOME SALOM', 'parroquia', 111),
       ('UNION', 'parroquia', 111),
       ('BORBURATA', 'parroquia', 111),
       ('PATANEMO', 'parroquia', 111);

-- ==============================================
-- Parroquia del Municipio San Diego (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('URB SAN DIEGO', 'parroquia', 112);

-- ==============================================
-- Parroquia del Municipio San Joaquín (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN JOAQUIN', 'parroquia', 113);

-- ==============================================
-- Parroquias del Municipio Valencia (Carabobo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CANDELARIA', 'parroquia', 114),
       ('CATEDRAL', 'parroquia', 114),
       ('EL SOCORRO', 'parroquia', 114),
       ('MIGUEL PEÑA', 'parroquia', 114),
       ('SAN BLAS', 'parroquia', 114),
       ('SAN JOSE', 'parroquia', 114),
       ('SANTA ROSA', 'parroquia', 114),
       ('RAFAEL URDANETA', 'parroquia', 114),
       ('NEGRO PRIMERO', 'parroquia', 114);

-- ==============================================
-- Parroquias del Municipio Anzoátegui (Cojedes)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('COJEDES', 'parroquia', 115),
       ('JUAN DE MATA SUAREZ', 'parroquia', 115);

-- ==============================================
-- Parroquias del Municipio San Carlos (Cojedes)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN CARLOS DE AUSTRIA', 'parroquia', 116),
       ('JUAN ANGEL BRAVO', 'parroquia', 116),
       ('MANUEL MANRIQUE', 'parroquia', 116);

-- ==============================================
-- Parroquias del Municipio Girardot (Cojedes)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL BAUL', 'parroquia', 117),
       ('SUCRE', 'parroquia', 117);

-- ==============================================
-- Parroquias del Municipio Lima Blanco (Cojedes)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MACAPO', 'parroquia', 118),
       ('LA AGUADITA', 'parroquia', 118);

-- ==============================================
-- Parroquias del Municipio Pao de San Juan Bautista (Cojedes)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL PAO', 'parroquia', 119);

-- ==============================================
-- Parroquias del Municipio Ricaurte (Cojedes)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('LIBERTAD DE COJEDES', 'parroquia', 120),
       ('EL AMPARO', 'parroquia', 120);

-- ==============================================
-- Parroquia del Municipio Rómulo Gallegos (Cojedes)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ROMULO GALLEGOS', 'parroquia', 121);

-- ==============================================
-- Parroquia del Municipio Tinaco (Cojedes)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GRL/JEFE JOSE L SILVA', 'parroquia', 122);

-- ==============================================
-- Parroquia del Municipio Tinaquillo (Cojedes)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('TINAQUILLO', 'parroquia', 123);

-- ==============================================
-- Parroquias del Municipio Antonio Díaz (Delta Amacuro)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CURIAPO', 'parroquia', 124),
       ('SANTOS DE ABELGAS', 'parroquia', 124),
       ('MANUEL RENAUD', 'parroquia', 124),
       ('PADRE BARRAL', 'parroquia', 124),
       ('ANICETO LUGO', 'parroquia', 124),
       ('ALMIRANTE LUIS BRION', 'parroquia', 124);

-- ==============================================
-- Parroquias del Municipio Casacoima (Delta Amacuro)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('IMATACA', 'parroquia', 125),
       ('ROMULO GALLEGOS', 'parroquia', 125),
       ('JUAN BAUTISTA ARISMEN', 'parroquia', 125),
       ('MANUEL PIAR', 'parroquia', 125),
       ('5 DE JULIO', 'parroquia', 125);

-- ==============================================
-- Parroquias del Municipio Pedernales (Delta Amacuro)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PEDERNALES', 'parroquia', 126),
       ('LUIS B PRIETO FIGUERO', 'parroquia', 126);

-- ==============================================
-- Parroquias del Municipio Tucupita (Delta Amacuro)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN JOSE', 'parroquia', 127),
       ('VIRGEN DEL VALLE', 'parroquia', 127),
       ('SAN RAFAEL', 'parroquia', 127),
       ('JOSE VIDAL MARCANO', 'parroquia', 127),
       ('LEONARDO RUIZ PINEDA', 'parroquia', 127),
       ('MONS. ARGIMIRO GARCIA', 'parroquia', 127),
       ('MCL.ANTONIO J DE SUCRE', 'parroquia', 127),
       ('JUAN MILLAN', 'parroquia', 127);

-- ==============================================
-- Parroquias del Municipio Distrito Capital (Caracas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ALTAGRACIA', 'parroquia', 128),
       ('CANDELARIA', 'parroquia', 128),
       ('CATEDRAL', 'parroquia', 128),
       ('LA PASTORA', 'parroquia', 128),
       ('SAN AGUSTIN', 'parroquia', 128),
       ('SAN JOSE', 'parroquia', 128),
       ('SAN JUAN', 'parroquia', 128),
       ('SANTA ROSALIA', 'parroquia', 128),
       ('SANTA TERESA', 'parroquia', 128),
       ('SUCRE', 'parroquia', 128),
       ('23 DE ENERO', 'parroquia', 128),
       ('ANTIMANO', 'parroquia', 128),
       ('EL RECREO', 'parroquia', 128),
       ('EL VALLE', 'parroquia', 128),
       ('LA VEGA', 'parroquia', 128),
       ('MACARAO', 'parroquia', 128),
       ('CARICUAO', 'parroquia', 128),
       ('EL JUNQUITO', 'parroquia', 128),
       ('COCHE', 'parroquia', 128),
       ('SAN PEDRO', 'parroquia', 128),
       ('SAN BERNARDINO', 'parroquia', 128),
       ('EL PARAISO', 'parroquia', 128);

-- ==============================================
-- Parroquias del Municipio Acosta (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN JUAN DE LOS CAYOS', 'parroquia', 129),
       ('CAPADARE', 'parroquia', 129),
       ('LA PASTORA', 'parroquia', 129),
       ('LIBERTADOR', 'parroquia', 129);

-- ==============================================
-- Parroquias del Municipio Bolívar (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN LUIS', 'parroquia', 130),
       ('ARACUA', 'parroquia', 130),
       ('LA PEÑA', 'parroquia', 130);

-- ==============================================
-- Parroquias del Municipio Buchivacoa (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CAPATARIDA', 'parroquia', 131),
       ('BOROJO', 'parroquia', 131),
       ('SEQUE', 'parroquia', 131),
       ('ZAZARIDA', 'parroquia', 131),
       ('BARIRO', 'parroquia', 131),
       ('GUAJIRO', 'parroquia', 131);

-- ==============================================
-- Parroquias del Municipio Carirubana (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('NORTE', 'parroquia', 132),
       ('CARIRUBANA', 'parroquia', 132),
       ('PUNTA CARDON', 'parroquia', 132),
       ('SANTA ANA', 'parroquia', 132);

-- ==============================================
-- Parroquias del Municipio Colina (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('LA VELA DE CORO', 'parroquia', 133),
       ('ACURIGUA', 'parroquia', 133),
       ('GUAIBACOA', 'parroquia', 133),
       ('MACORUCA', 'parroquia', 133),
       ('LAS CALDERAS', 'parroquia', 133);

-- ==============================================
-- Parroquia del Municipio Dabajuro (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. DABAJURO', 'parroquia', 134);

-- ==============================================
-- Parroquias del Municipio Democracia (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PEDREGAL', 'parroquia', 135),
       ('AGUA CLARA', 'parroquia', 135),
       ('AVARIA', 'parroquia', 135),
       ('PIEDRA GRANDE', 'parroquia', 135),
       ('PURURECHE', 'parroquia', 135);

-- ==============================================
-- Parroquias del Municipio Falcón (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PUEBLO NUEVO', 'parroquia', 136),
       ('ADICORA', 'parroquia', 136),
       ('BARAIVED', 'parroquia', 136),
       ('BUENA VISTA', 'parroquia', 136),
       ('JADACAQUIVA', 'parroquia', 136),
       ('MORUY', 'parroquia', 136),
       ('EL VINCULO', 'parroquia', 136),
       ('EL HATO', 'parroquia', 136),
       ('ADAURE', 'parroquia', 136);

-- ==============================================
-- Parroquias del Municipio Federación (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CHURUGUARA', 'parroquia', 137),
       ('AGUA LARGA', 'parroquia', 137),
       ('INDEPENDENCIA', 'parroquia', 137),
       ('MAPARARI', 'parroquia', 137),
       ('EL PAUJI', 'parroquia', 137);

-- ==============================================
-- Parroquias del Municipio Iturriza (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CHICHIRIVICHE', 'parroquia', 138),
       ('BOCA DE TOCUYO', 'parroquia', 138),
       ('TOCUYO DE LA COSTA', 'parroquia', 138);

-- ==============================================
-- Parroquias del Municipio Jacura (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('JACURA', 'parroquia', 139),
       ('AGUA LINDA', 'parroquia', 139),
       ('ARAURIMA', 'parroquia', 139);

-- ==============================================
-- Parroquias del Municipio Los Taques (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('LOS TAQUES', 'parroquia', 140),
       ('JUDIBANA', 'parroquia', 140);

-- ==============================================
-- Parroquia del Municipio Manaure (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. YARACAL', 'parroquia', 141);

-- ==============================================
-- Parroquias del Municipio Mauroa (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MENE DE MAUROA', 'parroquia', 142),
       ('CASIGUA', 'parroquia', 142),
       ('SAN FELIX', 'parroquia', 142);

-- ==============================================
-- Parroquias del Municipio Miranda (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN ANTONIO', 'parroquia', 143),
       ('SAN GABRIEL', 'parroquia', 143),
       ('SANTA ANA', 'parroquia', 143),
       ('GUZMAN GUILLERMO', 'parroquia', 143),
       ('MITARE', 'parroquia', 143),
       ('SABANETA', 'parroquia', 143),
       ('RIO SECO', 'parroquia', 143);

-- ==============================================
-- Parroquia del Municipio Palmasola (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PALMA SOLA', 'parroquia', 144);

-- ==============================================
-- Parroquias del Municipio Petit (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CABURE', 'parroquia', 145),
       ('CURIMAGUA', 'parroquia', 145),
       ('COLINA', 'parroquia', 145);

-- ==============================================
-- Parroquias del Municipio Píritu (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PIRITU', 'parroquia', 146),
       ('SAN JOSE DE LA COSTA', 'parroquia', 146);

-- ==============================================
-- Parroquia del Municipio San Francisco (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. MIRIMIRE', 'parroquia', 147);

-- ==============================================
-- Parroquias del Municipio Sucre (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SUCRE', 'parroquia', 148),
       ('PECAYA', 'parroquia', 148);

-- ==============================================
-- Parroquias del Municipio Silva (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('TUCACAS', 'parroquia', 149),
       ('BOCA DE AROA', 'parroquia', 149);

-- ==============================================
-- Parroquia del Municipio Tocópero (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. TOCOPERO', 'parroquia', 150);

-- ==============================================
-- Parroquias del Municipio Unión (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('STA.CRUZ DE BUCARAL', 'parroquia', 151),
       ('EL CHARAL', 'parroquia', 151),
       ('LAS VEGAS DEL TUY', 'parroquia', 151);

-- ==============================================
-- Parroquias del Municipio Urumaco (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('URUMACO', 'parroquia', 152),
       ('BRUZUAL', 'parroquia', 152);

-- ==============================================
-- Parroquias del Municipio Zamora (Falcón)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PUERTO CUMAREBO', 'parroquia', 153),
       ('LA CIENAGA', 'parroquia', 153),
       ('LA SOLEDAD', 'parroquia', 153),
       ('PUEBLO CUMAREBO', 'parroquia', 153),
       ('ZAZARIDA', 'parroquia', 153);

-- ==============================================
-- Parroquias del Municipio Camaguán (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CAMAGUAN', 'parroquia', 154),
       ('PUERTO MIRANDA', 'parroquia', 154),
       ('UVERITO', 'parroquia', 154);

-- ==============================================
-- Parroquia del Municipio Chaguaramas (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CHAGUARAMAS', 'parroquia', 155);

-- ==============================================
-- Parroquia del Municipio El Socorro (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL SOCORRO', 'parroquia', 156);

-- ==============================================
-- Parroquias del Municipio Francisco de Miranda (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CALABOZO', 'parroquia', 157),
       ('EL CALVARIO', 'parroquia', 157),
       ('EL RASTRO', 'parroquia', 157),
       ('GUARDATINAJAS', 'parroquia', 157);

-- ==============================================
-- Parroquias del Municipio José Félix Ribas (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('TUCUPIDO', 'parroquia', 158),
       ('SAN RAFAEL DE LAYA', 'parroquia', 158);

-- ==============================================
-- Parroquias del Municipio José Tadeo Monagas (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ALTAGRACIA DE ORITUCO', 'parroquia', 161),
       ('LEZAMA', 'parroquia', 161),
       ('LIBERTAD DE ORITUCO', 'parroquia', 161),
       ('SAN FCO DE MACAIRA', 'parroquia', 161),
       ('SAN RAFAEL DE ORITUCO', 'parroquia', 161),
       ('SOUBLETTE', 'parroquia', 161),
       ('PASO REAL DE MACAIRA', 'parroquia', 161);

-- ==============================================
-- Parroquias del Municipio Juan Germán Roscio (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN JUAN DE LOS MORROS', 'parroquia', 160),
       ('PARAPARA', 'parroquia', 160),
       ('CANTAGALLO', 'parroquia', 160);

-- ==============================================
-- Parroquias del Municipio Juan José Rondón (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('LAS MERCEDES', 'parroquia', 161),
       ('STA RITA DE MANAPIRE', 'parroquia', 161),
       ('CABRUTA', 'parroquia', 161);

-- ==============================================
-- Parroquias del Municipio Julián Mellado (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL SOMBRERO', 'parroquia', 162),
       ('SOSA', 'parroquia', 162);

-- ==============================================
-- Parroquias del Municipio Leonardo Infante (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('VALLE DE LA PASCUA', 'parroquia', 163),
       ('ESPINO', 'parroquia', 163);

-- ==============================================
-- Parroquias del Municipio Ortiz (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ORTIZ', 'parroquia', 164),
       ('SAN FCO. DE TIZNADOS', 'parroquia', 164),
       ('SAN JOSE DE TIZNADOS', 'parroquia', 164),
       ('S LORENZO DE TIZNADOS', 'parroquia', 164);

-- ==============================================
-- Parroquias del Municipio San Gerónimo de Guayabal (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GUAYABAL', 'parroquia', 165),
       ('CAZORLA', 'parroquia', 165);

-- ==============================================
-- Parroquia del Municipio San José de Guaribe (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN JOSE DE GUARIBE', 'parroquia', 166);

-- ==============================================
-- Parroquias del Municipio Santa María de Ipire (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SANTA MARIA DE IPIRE', 'parroquia', 167),
       ('ALTAMIRA', 'parroquia', 167);

-- ==============================================
-- Parroquias del Municipio Zaraza (Guárico)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ZARAZA', 'parroquia', 168),
       ('SAN JOSE DE UNARE', 'parroquia', 168);

-- ==============================================
-- Parroquias del Municipio Andrés Eloy Blanco (Lara)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PIO TAMAYO', 'parroquia', 169),
       ('YACAMBU', 'parroquia', 169),
       ('QBDA. HONDA DE GUACHE', 'parroquia', 169);

-- ==============================================
-- Parroquias del Municipio Crespo (Lara)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('FREITEZ', 'parroquia', 170),
       ('JOSE MARIA BLANCO', 'parroquia', 170);

-- ==============================================
-- Parroquias del Municipio Iribarren (Lara)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CATEDRAL', 'parroquia', 171),
       ('LA CONCEPCION', 'parroquia', 171),
       ('SANTA ROSA', 'parroquia', 171),
       ('UNION', 'parroquia', 171),
       ('EL CUJI', 'parroquia', 171),
       ('TAMACA', 'parroquia', 171),
       ('JUAN DE VILLEGAS', 'parroquia', 171),
       ('AGUEDO F. ALVARADO', 'parroquia', 171),
       ('BUENA VISTA', 'parroquia', 171),
       ('JUAREZ', 'parroquia', 171);

-- ==============================================
-- Parroquias del Municipio Jiménez (Lara)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('JUAN B RODRIGUEZ', 'parroquia', 172),
       ('DIEGO DE LOZADA', 'parroquia', 172),
       ('SAN MIGUEL', 'parroquia', 172),
       ('CUARA', 'parroquia', 172),
       ('PARAISO DE SAN JOSE', 'parroquia', 172),
       ('TINTORERO', 'parroquia', 172),
       ('JOSE BERNARDO DORANTE', 'parroquia', 172),
       ('CRNEL. MARIANO PERAZA', 'parroquia', 172);

-- ==============================================
-- Parroquias del Municipio Morán (Lara)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BOLIVAR', 'parroquia', 173),
       ('ANZOATEGUI', 'parroquia', 173),
       ('GUARICO', 'parroquia', 173),
       ('HUMOCARO ALTO', 'parroquia', 173),
       ('HUMOCARO BAJO', 'parroquia', 173),
       ('MORAN', 'parroquia', 173),
       ('HILARIO LUNA Y LUNA', 'parroquia', 173),
       ('LA CANDELARIA', 'parroquia', 173);

-- ==============================================
-- Parroquias del Municipio Palavecino (Lara)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CABUDARE', 'parroquia', 174),
       ('JOSE G. BASTIDAS', 'parroquia', 174),
       ('AGUA VIVA', 'parroquia', 174);

-- ==============================================
-- Parroquias del Municipio Simón Planas (Lara)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SARARE', 'parroquia', 175),
       ('GUSTAVO VEGAS LEON', 'parroquia', 175),
       ('BURIA', 'parroquia', 175);

-- ==============================================
-- Parroquias del Municipio Torres (Lara)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('TRINIDAD SAMUEL', 'parroquia', 176),
       ('ANTONIO DIAZ', 'parroquia', 176),
       ('CAMACARO', 'parroquia', 176),
       ('CASTAÑEDA', 'parroquia', 176),
       ('CHIQUINQUIRA', 'parroquia', 176),
       ('ESPINOZA LOS MONTEROS', 'parroquia', 176),
       ('LARA', 'parroquia', 176),
       ('MANUEL MORILLO', 'parroquia', 176),
       ('MONTES DE OCA', 'parroquia', 176),
       ('TORRES', 'parroquia', 176),
       ('EL BLANCO', 'parroquia', 176),
       ('MONTA A VERDE', 'parroquia', 176),
       ('HERIBERTO ARROYO', 'parroquia', 176),
       ('LAS MERCEDES', 'parroquia', 176),
       ('CECILIO ZUBILLAGA', 'parroquia', 176),
       ('REYES VARGAS', 'parroquia', 176),
       ('ALTAGRACIA', 'parroquia', 176);

-- ==============================================
-- Parroquias del Municipio Urdaneta (Lara)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SIQUISIQUE', 'parroquia', 177),
       ('SAN MIGUEL', 'parroquia', 177),
       ('XAGUAS', 'parroquia', 177),
       ('MOROTURO', 'parroquia', 177);

-- ==============================================
-- Parroquias del Municipio Vargas (La Guaira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CARABALLEDA', 'parroquia', 178),
       ('CARAYACA', 'parroquia', 178),
       ('CARUAO', 'parroquia', 178),
       ('CATIA LA MAR', 'parroquia', 178),
       ('LA GUAIRA', 'parroquia', 178),
       ('MACUTO', 'parroquia', 178),
       ('MAIQUETIA', 'parroquia', 178),
       ('NAIGUATA', 'parroquia', 178),
       ('EL JUNKO', 'parroquia', 178),
       ('PQ RAUL LEONI', 'parroquia', 178),
       ('PQ CARLOS SOUBLETTE', 'parroquia', 178);

-- ==============================================
-- Parroquias del Municipio Alberto Adriani (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GABRIEL PICON G.', 'parroquia', 179),
       ('HECTOR AMABLE MORA', 'parroquia', 179),
       ('JOSE NUCETE SARDI', 'parroquia', 179),
       ('PULIDO MENDEZ', 'parroquia', 179),
       ('PTE. ROMULO GALLEGOS', 'parroquia', 179),
       ('PRESIDENTE BETANCOURT', 'parroquia', 179),
       ('PRESIDENTE PAEZ', 'parroquia', 179);

-- ==============================================
-- Parroquia del Municipio Andrés Bello (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LA AZULITA', 'parroquia', 180);

-- ==============================================
-- Parroquias del Municipio Antonio Pinto Salinas (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. STA CRUZ DE MORA', 'parroquia', 181),
       ('MESA BOLIVAR', 'parroquia', 181),
       ('MESA DE LAS PALMAS', 'parroquia', 181);

-- ==============================================
-- Parroquias del Municipio Aricagua (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. ARICAGUA', 'parroquia', 182),
       ('SAN ANTONIO', 'parroquia', 182);

-- ==============================================
-- Parroquias del Municipio Arzobispo Chacón (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CANAGUA', 'parroquia', 183),
       ('CAPURI', 'parroquia', 183),
       ('CHACANTA', 'parroquia', 183),
       ('EL MOLINO', 'parroquia', 183),
       ('GUAIMARAL', 'parroquia', 183),
       ('MUCUTUY', 'parroquia', 183),
       ('MUCUCHACHI', 'parroquia', 183);

-- ==============================================
-- Parroquias del Municipio Campo Elías (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ACEQUIAS', 'parroquia', 184),
       ('JAJI', 'parroquia', 184),
       ('LA MESA', 'parroquia', 184),
       ('SAN JOSE', 'parroquia', 184),
       ('MONTALBAN', 'parroquia', 184),
       ('MATRIZ', 'parroquia', 184),
       ('FERNANDEZ PEÑA', 'parroquia', 184);

-- ==============================================
-- Parroquias del Municipio Caracciolo Parra Olmedo (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. TUCANI', 'parroquia', 185),
       ('FLORENCIO RAMIREZ', 'parroquia', 185);

-- ==============================================
-- Parroquias del Municipio Cardenal Quintero (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SANTO DOMINGO', 'parroquia', 186),
       ('LAS PIEDRAS', 'parroquia', 186);

-- ==============================================
-- Parroquias del Municipio Guaraque (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. GUARAQUE', 'parroquia', 187),
       ('MESA DE QUINTERO', 'parroquia', 187),
       ('RIO NEGRO', 'parroquia', 187);

-- ==============================================
-- Parroquias del Municipio Julio César Salas (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. ARAPUEY', 'parroquia', 188),
       ('PALMIRA', 'parroquia', 188);

-- ==============================================
-- Parroquias del Municipio Justo Briceño (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. TORONDOY', 'parroquia', 189),
       ('SAN CRISTOBAL DE T', 'parroquia', 189);

-- ==============================================
-- Parroquias del Municipio Libertador (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ARIAS', 'parroquia', 190),
       ('SAGRARIO', 'parroquia', 190),
       ('MILLA', 'parroquia', 190),
       ('EL LLANO', 'parroquia', 190),
       ('JUAN RODRIGUEZ SUAREZ', 'parroquia', 190),
       ('JACINTO PLAZA', 'parroquia', 190),
       ('DOMINGO PEÑA', 'parroquia', 190),
       ('GONZALO PICON FEBRES', 'parroquia', 190),
       ('OSUNA RODRIGUEZ', 'parroquia', 190),
       ('LASSO DE LA VEGA', 'parroquia', 190),
       ('CARACCIOLO PARRA P', 'parroquia', 190),
       ('MARIANO PICON SALAS', 'parroquia', 190),
       ('ANTONIO SPINETTI DINI', 'parroquia', 190),
       ('EL MORRO', 'parroquia', 190),
       ('LOS NEVADOS', 'parroquia', 190);

-- ==============================================
-- Parroquias del Municipio Miranda (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. TIMOTES', 'parroquia', 191),
       ('ANDRES ELOY BLANCO', 'parroquia', 191),
       ('PIÑANGO', 'parroquia', 191),
       ('LA VENTA', 'parroquia', 191);

-- ==============================================
-- Parroquias del Municipio Obispo Ramos de Lora (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. STA ELENA DE ARENALES', 'parroquia', 192),
       ('ELOY PAREDES', 'parroquia', 192),
       ('PQ R DE ALCAZAR', 'parroquia', 192);

-- ==============================================
-- Parroquia del Municipio Padre Noguera (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. STA MARIA DE CAPARO', 'parroquia', 193);

-- ==============================================
-- Parroquia del Municipio Pueblo Llano (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PUEBLO LLANO', 'parroquia', 194);

-- ==============================================
-- Parroquias del Municipio Rangel (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. MUCUCHIES', 'parroquia', 195),
       ('MUCURUBA', 'parroquia', 195),
       ('SAN RAFAEL', 'parroquia', 195),
       ('CACUTE', 'parroquia', 195),
       ('LA TOMA', 'parroquia', 195);

-- ==============================================
-- Parroquias del Municipio Rivas Dávila (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. BAILADORES', 'parroquia', 196),
       ('GERONIMO MALDONADO', 'parroquia', 196);

-- ==============================================
-- Parroquias del Municipio Santos Marquina (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. TABAY', 'parroquia', 197);

-- ==============================================
-- Parroquias del Municipio Sucre (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LAGUNILLAS', 'parroquia', 198),
       ('CHIGUARA', 'parroquia', 198),
       ('ESTANQUES', 'parroquia', 198),
       ('SAN JUAN', 'parroquia', 198),
       ('PUEBLO NUEVO DEL SUR', 'parroquia', 198),
       ('LA TRAMPA', 'parroquia', 198);

-- ==============================================
-- Parroquias del Municipio Tovar (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL LLANO', 'parroquia', 199),
       ('TOVAR', 'parroquia', 199),
       ('EL AMPARO', 'parroquia', 199),
       ('SAN FRANCISCO', 'parroquia', 199);

-- ==============================================
-- Parroquias del Municipio Tulio Febres Cordero (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. NUEVA BOLIVIA', 'parroquia', 200),
       ('INDEPENDENCIA', 'parroquia', 200),
       ('MARIA C PALACIOS', 'parroquia', 200),
       ('SANTA APOLONIA', 'parroquia', 200);

-- ==============================================
-- Parroquias del Municipio Zea (Mérida)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. ZEA', 'parroquia', 201),
       ('CAÑO EL TIGRE', 'parroquia', 201);

-- ==============================================
-- Parroquias del Municipio Acevedo (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CAUCAGUA', 'parroquia', 202),
       ('ARAGUITA', 'parroquia', 202),
       ('AREVALO GONZALEZ', 'parroquia', 202),
       ('CAPAYA', 'parroquia', 202),
       ('PANAQUIRE', 'parroquia', 202),
       ('RIBAS', 'parroquia', 202),
       ('EL CAFE', 'parroquia', 202),
       ('MARIZAPA', 'parroquia', 202);

-- ==============================================
-- Parroquias del Municipio Andrés Bello (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN JOSE DE BARLOVENTO', 'parroquia', 203),
       ('CUMBO', 'parroquia', 203);

-- ==============================================
-- Parroquias del Municipio Baruta (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BARUTA', 'parroquia', 204),
       ('EL CAFETAL', 'parroquia', 204),
       ('LAS MINAS DE BARUTA', 'parroquia', 204);

-- ==============================================
-- Parroquias del Municipio Bolívar (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN FCO DE YARE', 'parroquia', 205),
       ('S ANTONIO DE YARE', 'parroquia', 205);

-- ==============================================
-- Parroquias del Municipio Brión (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('HIGUEROTE', 'parroquia', 206),
       ('CURIEPE', 'parroquia', 206),
       ('TACARIGUA', 'parroquia', 206);

-- ==============================================
-- Parroquia del Municipio Buroz (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MAMPORAL', 'parroquia', 207);

-- ==============================================
-- Parroquia del Municipio Carrizal (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CARRIZAL', 'parroquia', 208);

-- ==============================================
-- Parroquia del Municipio Chacao (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CHACAO', 'parroquia', 209);

-- ==============================================
-- Parroquias del Municipio Cristóbal Rojas (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CHARALLAVE', 'parroquia', 210),
       ('LAS BRISAS', 'parroquia', 210);

-- ==============================================
-- Parroquia del Municipio El Hatillo (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL HATILLO', 'parroquia', 211);

-- ==============================================
-- Parroquias del Municipio Guaicaipuro (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('LOS TEQUES', 'parroquia', 212),
       ('CECILIO ACOSTA', 'parroquia', 212),
       ('PARACOTOS', 'parroquia', 212),
       ('SAN PEDRO', 'parroquia', 212),
       ('TACATA', 'parroquia', 212),
       ('EL JARILLO', 'parroquia', 212),
       ('ALTAGRACIA DE LA M', 'parroquia', 212);

-- ==============================================
-- Parroquias del Municipio Gual (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CUPIRA', 'parroquia', 213),
       ('MACHURUCUTO', 'parroquia', 213);

-- ==============================================
-- Parroquias del Municipio Independencia (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('STA TERESA DEL TUY', 'parroquia', 214),
       ('EL CARTANAL', 'parroquia', 214);

-- ==============================================
-- Parroquias del Municipio Lander (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('OCUMARE DEL TUY', 'parroquia', 215),
       ('LA DEMOCRACIA', 'parroquia', 215),
       ('SANTA BARBARA', 'parroquia', 215);

-- ==============================================
-- Parroquia del Municipio Los Salias (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN ANTONIO LOS ALTOS', 'parroquia', 216);

-- ==============================================
-- Parroquias del Municipio Páez (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('RIO CHICO', 'parroquia', 217),
       ('EL GUAPO', 'parroquia', 217),
       ('TACARIGUA DE LA LAGUNA', 'parroquia', 217),
       ('PAPARO', 'parroquia', 217),
       ('SN FERNANDO DEL GUAPO', 'parroquia', 217);

-- ==============================================
-- Parroquia del Municipio Paz Castillo (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SANTA LUCIA', 'parroquia', 218);

-- ==============================================
-- Parroquia del Municipio Plaza (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GUARENAS', 'parroquia', 219);

-- ==============================================
-- Parroquias del Municipio Sucre (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PETARE', 'parroquia', 220),
       ('LEONCIO MARTINEZ', 'parroquia', 220),
       ('CAUCAGUITA', 'parroquia', 220),
       ('FILAS DE MARICHES', 'parroquia', 220),
       ('LA DOLORITA', 'parroquia', 220);

-- ==============================================
-- Parroquias del Municipio Urdaneta (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CUA', 'parroquia', 221),
       ('NUEVA CUA', 'parroquia', 221);

-- ==============================================
-- Parroquias del Municipio Zamora (Miranda)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GUATIRE', 'parroquia', 222),
       ('ARAIRA', 'parroquia', 222);

-- ==============================================
-- Parroquias del Municipio Acosta (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN ANTONIO', 'parroquia', 223),
       ('SAN FRANCISCO', 'parroquia', 223);

-- ==============================================
-- Parroquia del Municipio Aguasay (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. AGUASAY', 'parroquia', 224);

-- ==============================================
-- Parroquia del Municipio Bolívar (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CARIPITO', 'parroquia', 225);

-- ==============================================
-- Parroquias del Municipio Caripe (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CARIPE', 'parroquia', 226),
       ('TERESEN', 'parroquia', 226),
       ('EL GUACHARO', 'parroquia', 226),
       ('SAN AGUSTIN', 'parroquia', 226),
       ('LA GUANOTA', 'parroquia', 226),
       ('SABANA DE PIEDRA', 'parroquia', 226);

-- ==============================================
-- Parroquias del Municipio Cedeño (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CAICARA', 'parroquia', 227),
       ('AREO', 'parroquia', 227),
       ('SAN FELIX', 'parroquia', 227),
       ('VIENTO FRESCO', 'parroquia', 227);

-- ==============================================
-- Parroquias del Municipio Libertador (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. TEMBLADOR', 'parroquia', 228),
       ('TABASCA', 'parroquia', 228),
       ('LAS ALHUACAS', 'parroquia', 228),
       ('CHAGUARAMAS', 'parroquia', 228);

-- ==============================================
-- Parroquias del Municipio Maturín (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL FURRIAL', 'parroquia', 229),
       ('JUSEPIN', 'parroquia', 229),
       ('EL COROZO', 'parroquia', 229),
       ('SAN VICENTE', 'parroquia', 229),
       ('LA PICA', 'parroquia', 229),
       ('ALTO DE LOS GODOS', 'parroquia', 229),
       ('BOQUERON', 'parroquia', 229),
       ('LAS COCUIZAS', 'parroquia', 229),
       ('SANTA CRUZ', 'parroquia', 229),
       ('SAN SIMON', 'parroquia', 229);

-- ==============================================
-- Parroquias del Municipio Piar (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. ARAGUA', 'parroquia', 230),
       ('CHAGUARAMAL', 'parroquia', 230),
       ('GUANAGUANA', 'parroquia', 230),
       ('APARICIO', 'parroquia', 230),
       ('TAGUAYA', 'parroquia', 230),
       ('EL PINTO', 'parroquia', 230),
       ('LA TOSCANA', 'parroquia', 230);

-- ==============================================
-- Parroquias del Municipio Punceres (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. QUIRIQUIRE', 'parroquia', 231),
       ('CACHIPO', 'parroquia', 231);

-- ==============================================
-- Parroquias del Municipio Santa Bárbara (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MORON', 'parroquia', 232),
       ('CM. SANTA BARBARA', 'parroquia', 232);

-- ==============================================
-- Parroquias del Municipio Sotillo (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. BARRANCAS', 'parroquia', 233),
       ('LOS BARRANCOS DE FAJARDO', 'parroquia', 233);

-- ==============================================
-- Parroquias del Municipio Uracoa (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. URACOA', 'parroquia', 234);

-- ==============================================
-- Parroquias del Municipio Zamora (Monagas)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PUNTA DE MATA', 'parroquia', 235),
       ('EL TEJERO', 'parroquia', 235);

-- ==============================================
-- Parroquias del Municipio Antolín del Campo (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ANTOLIN DEL CAMPO', 'parroquia', 236),
       ('CM.LA PLAZA DE PARAGUACHI', 'parroquia', 236);

-- ==============================================
-- Parroquias del Municipio Antonio Díaz (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN JUAN BAUTISTA', 'parroquia', 237),
       ('ZABALA', 'parroquia', 237);

-- ==============================================
-- Parroquias del Municipio Arismendi (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ARISMENDI', 'parroquia', 238),
       ('CM. LA ASUNCION', 'parroquia', 238);

-- ==============================================
-- Parroquias del Municipio García (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. VALLE ESP SANTO', 'parroquia', 239),
       ('FRANCISCO FAJARDO', 'parroquia', 239);

-- ==============================================
-- Parroquias del Municipio Gómez (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SANTA ANA', 'parroquia', 240),
       ('GUEVARA', 'parroquia', 240),
       ('MATASIETE', 'parroquia', 240),
       ('BOLIVAR', 'parroquia', 240),
       ('SUCRE', 'parroquia', 240);

-- ==============================================
-- Parroquias del Municipio Macanao (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. BOCA DEL RIO', 'parroquia', 241),
       ('SAN FRANCISCO', 'parroquia', 241);

-- ==============================================
-- Parroquias del Municipio Maneiro (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PAMPATAR', 'parroquia', 242),
       ('AGUIRRE', 'parroquia', 242);

-- ==============================================
-- Parroquias del Municipio Marcano (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. JUAN GRIEGO', 'parroquia', 243),
       ('ADRIAN', 'parroquia', 243);

-- ==============================================
-- Parroquias del Municipio Mariño (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MARIÑO', 'parroquia', 244),
       ('CM. PORLAMAR', 'parroquia', 244);

-- ==============================================
-- Parroquias del Municipio Tubores (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PUNTA DE PIEDRAS', 'parroquia', 245),
       ('LOS BARALES', 'parroquia', 245);

-- ==============================================
-- Parroquias del Municipio Villalba (Nueva Esparta)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN PEDRO DE COCHE', 'parroquia', 246),
       ('VICENTE FUENTES', 'parroquia', 246);

-- ==============================================
-- Parroquia del Municipio Agua Blanca (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. AGUA BLANCA', 'parroquia', 247);

-- ==============================================
-- Parroquias del Municipio Araure (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. ARAURE', 'parroquia', 248),
       ('RIO ACARIGUA', 'parroquia', 248);

-- ==============================================
-- Parroquias del Municipio Esteller (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PIRITU', 'parroquia', 249),
       ('UVERAL', 'parroquia', 249);

-- ==============================================
-- Parroquias del Municipio Guanare (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. GUANARE', 'parroquia', 250),
       ('CORDOBA', 'parroquia', 250),
       ('SAN JUAN GUANAGUANARE', 'parroquia', 250),
       ('VIRGEN DE LA COROMOTO', 'parroquia', 250),
       ('SAN JOSE DE LA MONTAÑA', 'parroquia', 250);

-- ==============================================
-- Parroquias del Municipio Guanarito (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. GUANARITO', 'parroquia', 251),
       ('TRINIDAD DE LA CAPILLA', 'parroquia', 251),
       ('DIVINA PASTORA', 'parroquia', 251);

-- ==============================================
-- Parroquias del Municipio José Vicente de Unda (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CHABASQUEN', 'parroquia', 252),
       ('PEÑA BLANCA', 'parroquia', 252);

-- ==============================================
-- Parroquias del Municipio Ospino (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. OSPINO', 'parroquia', 253),
       ('APARICION', 'parroquia', 253),
       ('LA ESTACION', 'parroquia', 253);

-- ==============================================
-- Parroquias del Municipio Páez (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. ACARIGUA', 'parroquia', 254),
       ('PAYARA', 'parroquia', 254),
       ('PIMPINELA', 'parroquia', 254),
       ('RAMON PERAZA', 'parroquia', 254);

-- ==============================================
-- Parroquias del Municipio Papelón (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PAPELON', 'parroquia', 255),
       ('CAÑO DELGADITO', 'parroquia', 255);

-- ==============================================
-- Parroquias del Municipio San Genaro de Boconoíto (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. BOCONOITO', 'parroquia', 256),
       ('ANTOLIN TOVAR AQUINO', 'parroquia', 256);

-- ==============================================
-- Parroquias del Municipio San Rafael de Onoto (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN RAFAEL DE ONOTO', 'parroquia', 257),
       ('SANTA FE', 'parroquia', 257),
       ('THERMO MORLES', 'parroquia', 257);

-- ==============================================
-- Parroquias del Municipio Santa Rosalía (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. EL PLAYON', 'parroquia', 258),
       ('FLORIDA', 'parroquia', 258);

-- ==============================================
-- Parroquias del Municipio Sucre (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. BISCUCUY', 'parroquia', 259),
       ('CONCEPCION', 'parroquia', 259),
       ('SAN RAFAEL PALO ALZADO', 'parroquia', 259),
       ('UVENCIO A VELASQUEZ', 'parroquia', 259),
       ('SAN JOSE DE SAGUAZ', 'parroquia', 259),
       ('VILLA ROSA', 'parroquia', 259);

-- ==============================================
-- Parroquias del Municipio Turén (Portuguesa)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. VILLA BRUZUAL', 'parroquia', 260),
       ('CANELONES', 'parroquia', 260),
       ('SANTA CRUZ', 'parroquia', 260),
       ('SAN ISIDRO LABRADOR', 'parroquia', 260);

-- ==============================================
-- Parroquias del Municipio Andrés Eloy Blanco (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MARIÑO', 'parroquia', 261),
       ('ROMULO GALLEGOS', 'parroquia', 261);

-- ==============================================
-- Parroquias del Municipio Andrés Mata (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN JOSE DE AREOCUAR', 'parroquia', 262),
       ('TAVERA ACOSTA', 'parroquia', 262);

-- ==============================================
-- Parroquias del Municipio Arismendi (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('RIO CARIBE', 'parroquia', 263),
       ('SAN JUAN GALDONAS', 'parroquia', 263),
       ('PUERTO SANTO', 'parroquia', 263),
       ('EL MORRO DE PTO SANTO', 'parroquia', 263),
       ('ANTONIO JOSE DE SUCRE', 'parroquia', 263);

-- ==============================================
-- Parroquias del Municipio Benítez (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL PILAR', 'parroquia', 264),
       ('EL RINCON', 'parroquia', 264),
       ('GUARAUNOS', 'parroquia', 264),
       ('TUNAPUICITO', 'parroquia', 264),
       ('UNION', 'parroquia', 264),
       ('GRAL FCO. A VASQUEZ', 'parroquia', 264);

-- ==============================================
-- Parroquias del Municipio Bermúdez (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SANTA CATALINA', 'parroquia', 265),
       ('SANTA ROSA', 'parroquia', 265),
       ('SANTA TERESA', 'parroquia', 265),
       ('BOLIVAR', 'parroquia', 265),
       ('MACARAPANA', 'parroquia', 265);

-- ==============================================
-- Parroquias del Municipio Bolívar (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. MARIGUITAR', 'parroquia', 266);

-- ==============================================
-- Parroquias del Municipio Cajigal (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('YAGUARAPARO', 'parroquia', 267),
       ('LIBERTAD', 'parroquia', 267),
       ('PAUJIL', 'parroquia', 267);

-- ==============================================
-- Parroquias del Municipio Cruz Salmerón Acosta (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ARAYA', 'parroquia', 268),
       ('MANICUARE', 'parroquia', 268),
       ('CHACOPATA', 'parroquia', 268);

-- ==============================================
-- Parroquias del Municipio Libertador (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('TUNAPUY', 'parroquia', 269),
       ('CAMPO ELIAS', 'parroquia', 269);

-- ==============================================
-- Parroquias del Municipio Mariño (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('IRAPA', 'parroquia', 270),
       ('CAMPO CLARO', 'parroquia', 270),
       ('SORO', 'parroquia', 270),
       ('SAN ANTONIO DE IRAPA', 'parroquia', 270),
       ('MARABAL', 'parroquia', 270);

-- ==============================================
-- Parroquia del Municipio Mejía (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN ANT DEL GOLFO', 'parroquia', 271);

-- ==============================================
-- Parroquias del Municipio Montes (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CUMANACOA', 'parroquia', 272),
       ('ARENAS', 'parroquia', 272),
       ('ARICAGUA', 'parroquia', 272),
       ('COCOLLAR', 'parroquia', 272),
       ('SAN FERNANDO', 'parroquia', 272),
       ('SAN LORENZO', 'parroquia', 272);

-- ==============================================
-- Parroquias del Municipio Ribero (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CARIACO', 'parroquia', 273),
       ('CATUARO', 'parroquia', 273),
       ('RENDON', 'parroquia', 273),
       ('SANTA CRUZ', 'parroquia', 273),
       ('SANTA MARIA', 'parroquia', 273);

-- ==============================================
-- Parroquias del Municipio Sucre (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ALTAGRACIA', 'parroquia', 274),
       ('AYACUCHO', 'parroquia', 274),
       ('SANTA INES', 'parroquia', 274),
       ('VALENTIN VALIENTE', 'parroquia', 274),
       ('SAN JUAN', 'parroquia', 274),
       ('GRAN MARISCAL', 'parroquia', 274),
       ('RAUL LEONI', 'parroquia', 274);

-- ==============================================
-- Parroquias del Municipio Valdez (Sucre)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GUIRIA', 'parroquia', 275),
       ('CRISTOBAL COLON', 'parroquia', 275),
       ('PUNTA DE PIEDRA', 'parroquia', 275),
       ('BIDEAU', 'parroquia', 275);

-- ==============================================
-- Parroquia del Municipio Andrés Bello (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CORDERO', 'parroquia', 276);

-- ==============================================
-- Parroquia del Municipio Antonio Rómulo Costa (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LAS MESAS', 'parroquia', 277);

-- ==============================================
-- Parroquias del Municipio Ayacucho (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. COLON', 'parroquia', 278),
       ('RIVAS BERTI', 'parroquia', 278),
       ('SAN PEDRO DEL RIO', 'parroquia', 278);

-- ==============================================
-- Parroquias del Municipio Bolívar (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN ANT DEL TACHIRA', 'parroquia', 279),
       ('PALOTAL', 'parroquia', 279),
       ('JUAN VICENTE GOMEZ', 'parroquia', 279),
       ('ISAIAS MEDINA ANGARITA', 'parroquia', 279);

-- ==============================================
-- Parroquias del Municipio Cárdenas (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. TARIBA', 'parroquia', 280),
       ('LA FLORIDA', 'parroquia', 280),
       ('AMENODORO RANGEL LAMU', 'parroquia', 280);

-- ==============================================
-- Parroquia del Municipio Córdoba (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. STA. ANA  DEL TACHIRA', 'parroquia', 281);

-- ==============================================
-- Parroquias del Municipio Fernández (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM.SAN RAFAEL DEL PINAL', 'parroquia', 282),
       ('SANTO DOMINGO', 'parroquia', 282),
       ('ALBERTO ADRIANI', 'parroquia', 282);

-- ==============================================
-- Parroquia del Municipio Francisco de Miranda (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN JOSE DE BOLIVAR', 'parroquia', 283);

-- ==============================================
-- Parroquias del Municipio García de Hevia (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LA FRIA', 'parroquia', 284),
       ('BOCA DE GRITA', 'parroquia', 284),
       ('JOSE ANTONIO PAEZ', 'parroquia', 284);

-- ==============================================
-- Parroquia del Municipio Guásimos (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PALMIRA', 'parroquia', 285);

-- ==============================================
-- Parroquias del Municipio Independencia (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CAPACHO NUEVO', 'parroquia', 286),
       ('JUAN GERMAN ROSCIO', 'parroquia', 286),
       ('ROMAN CARDENAS', 'parroquia', 286);

-- ==============================================
-- Parroquias del Municipio Jáuregui (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LA GRITA', 'parroquia', 287),
       ('EMILIO C. GUERRERO', 'parroquia', 287),
       ('MONS. MIGUEL A SALAS', 'parroquia', 287);

-- ==============================================
-- Parroquia del Municipio José María Vargas (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. EL COBRE', 'parroquia', 288);

-- ==============================================
-- Parroquias del Municipio Junín (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. RUBIO', 'parroquia', 289),
       ('BRAMON', 'parroquia', 289),
       ('LA PETROLEA', 'parroquia', 289),
       ('QUINIMARI', 'parroquia', 289);

-- ==============================================
-- Parroquias del Municipio Libertad (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CAPACHO VIEJO', 'parroquia', 290),
       ('CIPRIANO CASTRO', 'parroquia', 290),
       ('MANUEL FELIPE RUGELES', 'parroquia', 290);

-- ==============================================
-- Parroquias del Municipio Libertador (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. ABEJALES', 'parroquia', 291),
       ('SAN JOAQUIN DE NAVAY', 'parroquia', 291),
       ('DORADAS', 'parroquia', 291),
       ('EMETERIO OCHOA', 'parroquia', 291);

-- ==============================================
-- Parroquias del Municipio Lobatera (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LOBATERA', 'parroquia', 292),
       ('CONSTITUCION', 'parroquia', 292);

-- ==============================================
-- Parroquia del Municipio Michelena (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. MICHELENA', 'parroquia', 293);

-- ==============================================
-- Parroquias del Municipio Panamericano (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. COLONCITO', 'parroquia', 294),
       ('LA PALMITA', 'parroquia', 294);

-- ==============================================
-- Parroquias del Municipio Pedro María Ureña (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. UREÑA', 'parroquia', 295),
       ('NUEVA ARCADIA', 'parroquia', 295);

-- ==============================================
-- Parroquia del Municipio Rafael Urdaneta (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. DELICIAS', 'parroquia', 296);

-- ==============================================
-- Parroquias del Municipio Samuel Dario Maldonado (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. LA TENDIDA', 'parroquia', 297),
       ('BOCONO', 'parroquia', 297),
       ('HERNANDEZ', 'parroquia', 297);

-- ==============================================
-- Parroquias del Municipio San Cristóbal (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('LA CONCORDIA', 'parroquia', 298),
       ('PEDRO MARIA MORANTES', 'parroquia', 298),
       ('SN JUAN BAUTISTA', 'parroquia', 298),
       ('SAN SEBASTIAN', 'parroquia', 298),
       ('DR. FCO. ROMERO LOBO', 'parroquia', 298);

-- ==============================================
-- Parroquia del Municipio San Judas Tadeo (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. UMUQUENA', 'parroquia', 299);

-- ==============================================
-- Parroquia del Municipio Seboruco (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SEBORUCO', 'parroquia', 300);

-- ==============================================
-- Parroquia del Municipio Simón Rodríguez (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN SIMON', 'parroquia', 301);

-- ==============================================
-- Parroquias del Municipio Sucre (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. QUENIQUEA', 'parroquia', 302),
       ('SAN PABLO', 'parroquia', 302),
       ('ELEAZAR LOPEZ CONTRERA', 'parroquia', 302);

-- ==============================================
-- Parroquia del Municipio Torbes (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN JOSECITO', 'parroquia', 303);

-- ==============================================
-- Parroquias del Municipio Uribante (Táchira)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. PREGONERO', 'parroquia', 304),
       ('CARDENAS', 'parroquia', 304),
       ('POTOSI', 'parroquia', 304),
       ('JUAN PABLO PEÑALOZA', 'parroquia', 304);

-- ==============================================
-- Parroquias del Municipio Andrés Bello (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SANTA ISABEL', 'parroquia', 305),
       ('ARAGUANEY', 'parroquia', 305),
       ('EL JAGUITO', 'parroquia', 305),
       ('LA ESPERANZA', 'parroquia', 305);

-- ==============================================
-- Parroquias del Municipio Boconó (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BOCONO', 'parroquia', 306),
       ('EL CARMEN', 'parroquia', 306),
       ('MOSQUEY', 'parroquia', 306),
       ('AYACUCHO', 'parroquia', 306),
       ('BURBUSAY', 'parroquia', 306),
       ('GENERAL RIVAS', 'parroquia', 306),
       ('MONSEÑOR JAUREGUI', 'parroquia', 306),
       ('RAFAEL RANGEL', 'parroquia', 306),
       ('SAN JOSE', 'parroquia', 306),
       ('SAN MIGUEL', 'parroquia', 306),
       ('GUARAMACAL', 'parroquia', 306),
       ('LA VEGA DE GUARAMACAL', 'parroquia', 306);

-- ==============================================
-- Parroquias del Municipio Bolívar (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SABANA GRANDE', 'parroquia', 307),
       ('CHEREGUE', 'parroquia', 307),
       ('GRANADOS', 'parroquia', 307);

-- ==============================================
-- Parroquias del Municipio Candelaria (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CHEJENDE', 'parroquia', 308),
       ('CARRILLO', 'parroquia', 308),
       ('CEGARRA', 'parroquia', 308),
       ('BOLIVIA', 'parroquia', 308),
       ('MANUEL SALVADOR ULLOA', 'parroquia', 308),
       ('SAN JOSE', 'parroquia', 308),
       ('ARNOLDO GABALDON', 'parroquia', 308);

-- ==============================================
-- Parroquias del Municipio Carache (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CARACHE', 'parroquia', 309),
       ('LA CONCEPCION', 'parroquia', 309),
       ('CUICAS', 'parroquia', 309),
       ('PANAMERICANA', 'parroquia', 309),
       ('SANTA CRUZ', 'parroquia', 309);

-- ==============================================
-- Parroquias del Municipio Carvajal (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CARVAJAL', 'parroquia', 310),
       ('ANTONIO N BRICEÑO', 'parroquia', 310),
       ('CAMPO ALEGRE', 'parroquia', 310),
       ('JOSE LEONARDO SUAREZ', 'parroquia', 310);

-- ==============================================
-- Parroquias del Municipio Escuque (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ESCUQUE', 'parroquia', 311),
       ('SABANA LIBRE', 'parroquia', 311),
       ('LA UNION', 'parroquia', 311),
       ('SANTA RITA', 'parroquia', 311);

-- ==============================================
-- Parroquias del Municipio Juan Vicente Campos Elías (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CAMPO ELIAS', 'parroquia', 312),
       ('ARNOLDO GABALDON', 'parroquia', 312),
       ('SANTA APOLONIA', 'parroquia', 312);

-- ==============================================
-- Parroquias del Municipio La Ceiba (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('LA CEIBA', 'parroquia', 313),
       ('EL PROGRESO', 'parroquia', 313),
       ('TRES DE FEBRERO', 'parroquia', 313);

-- ==============================================
-- Parroquias del Municipio Márquez Cañizales (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL SOCORRO', 'parroquia', 314),
       ('LOS CAPRICHOS', 'parroquia', 314),
       ('ANTONIO JOSE DE SUCRE', 'parroquia', 314);

-- ==============================================
-- Parroquias del Municipio Miranda (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('EL DIVIDIVE', 'parroquia', 315),
       ('AGUA CALIENTE', 'parroquia', 315),
       ('EL CENIZO', 'parroquia', 315),
       ('AGUA SANTA', 'parroquia', 315),
       ('VALERITA', 'parroquia', 315);

-- ==============================================
-- Parroquias del Municipio Monte Carmelo (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MONTE CARMELO', 'parroquia', 316),
       ('BUENA VISTA', 'parroquia', 316),
       ('STA MARIA DEL HORCON', 'parroquia', 316);

-- ==============================================
-- Parroquias del Municipio Motatán (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MOTATAN', 'parroquia', 317),
       ('EL BAÑO', 'parroquia', 317),
       ('JALISCO', 'parroquia', 317);

-- ==============================================
-- Parroquias del Municipio Pampán (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PAMPAN', 'parroquia', 318),
       ('SANTA ANA', 'parroquia', 318),
       ('LA PAZ', 'parroquia', 318),
       ('FLOR DE PATRIA', 'parroquia', 318);

-- ==============================================
-- Parroquias del Municipio Pampanito (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PAMPANITO', 'parroquia', 319),
       ('PAMPANITO II', 'parroquia', 319),
       ('LA CONCEPCION', 'parroquia', 319);

-- ==============================================
-- Parroquias del Municipio Rangel (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BETIJOQUE', 'parroquia', 320),
       ('JOSE G HERNANDEZ', 'parroquia', 320),
       ('LA PUEBLITA', 'parroquia', 320),
       ('EL CEDRO', 'parroquia', 320);

-- ==============================================
-- Parroquias del Municipio Sucre (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SABANA DE MENDOZA', 'parroquia', 321),
       ('JUNIN', 'parroquia', 321),
       ('VALMORE RODRIGUEZ', 'parroquia', 321),
       ('EL PARAISO', 'parroquia', 321);

-- ==============================================
-- Parroquias del Municipio Trujillo (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CRISTOBAL MENDOZA', 'parroquia', 322),
       ('CHIQUINQUIRA', 'parroquia', 322),
       ('MATRIZ', 'parroquia', 322),
       ('MONSEÑOR CARRILLO', 'parroquia', 322),
       ('CRUZ CARRILLO', 'parroquia', 322),
       ('ANDRES LINARES', 'parroquia', 322),
       ('TRES ESQUINAS', 'parroquia', 322);

-- ==============================================
-- Parroquias del Municipio Urdaneta (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('LA QUEBRADA', 'parroquia', 323),
       ('JAJO', 'parroquia', 323),
       ('LA MESA', 'parroquia', 323),
       ('SANTIAGO', 'parroquia', 323),
       ('CABIMBU', 'parroquia', 323),
       ('TUÑAME', 'parroquia', 323);

-- ==============================================
-- Parroquias del Municipio Valera (Trujillo)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MERCEDES DIAZ', 'parroquia', 324),
       ('JUAN IGNACIO MONTILLA', 'parroquia', 324),
       ('LA BEATRIZ', 'parroquia', 324),
       ('MENDOZA', 'parroquia', 324),
       ('LA PUERTA', 'parroquia', 324),
       ('SAN LUIS', 'parroquia', 324);

-- ==============================================
-- Parroquia del Municipio Arístides Bastidas (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN PABLO', 'parroquia', 325);

-- ==============================================
-- Parroquia del Municipio Bolívar (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. AROA', 'parroquia', 326);

-- ==============================================
-- Parroquias del Municipio Bruzual (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. CHIVACOA', 'parroquia', 327),
       ('CAMPO ELIAS', 'parroquia', 327);

-- ==============================================
-- Parroquia del Municipio Cocorote (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. COCOROTE', 'parroquia', 328);

-- ==============================================
-- Parroquia del Municipio Independencia (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. INDEPENDENCIA', 'parroquia', 329);

-- ==============================================
-- Parroquia del Municipio José Antonio Páez (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SABANA DE PARRA', 'parroquia', 330);

-- ==============================================
-- Parroquia del Municipio La Trinidad (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. BORAURE', 'parroquia', 331);

-- ==============================================
-- Parroquia del Municipio Manuel Monge (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. YUMARE', 'parroquia', 332);

-- ==============================================
-- Parroquias del Municipio Nirgua (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. NIRGUA', 'parroquia', 333),
       ('SALOM', 'parroquia', 333),
       ('TEMERLA', 'parroquia', 333);

-- ==============================================
-- Parroquias del Municipio Peña (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. YARITAGUA', 'parroquia', 334),
       ('SAN ANDRES', 'parroquia', 334);

-- ==============================================
-- Parroquias del Municipio San Felipe (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. SAN FELIPE', 'parroquia', 335),
       ('ALBARICO', 'parroquia', 335),
       ('SAN JAVIER', 'parroquia', 335);

-- ==============================================
-- Parroquia del Municipio Sucre (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. GUAMA', 'parroquia', 336);

-- ==============================================
-- Parroquia del Municipio Urachiche (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. URACHICHE', 'parroquia', 337);

-- ==============================================
-- Parroquias del Municipio Veroes (Yaracuy)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('CM. FARRIAR', 'parroquia', 338),
       ('EL GUAYABO', 'parroquia', 338);

-- ==============================================
-- Parroquias del Municipio Almirante Padilla (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MONAGAS', 'parroquia', 339),
       ('ISLA DE TOAS', 'parroquia', 339);

-- ==============================================
-- Parroquias del Municipio Baralt (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GENERAL URDANETA', 'parroquia', 340),
       ('LIBERTADOR', 'parroquia', 340),
       ('MANUEL GUANIPA MATOS', 'parroquia', 340),
       ('MARCELINO BRICEÑO', 'parroquia', 340),
       ('SAN TIMOTEO', 'parroquia', 340),
       ('PUEBLO NUEVO', 'parroquia', 340);

-- ==============================================
-- Parroquias del Municipio Cabimas (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('AMBROSIO', 'parroquia', 341),
       ('GERMAN RIOS LINARES', 'parroquia', 341),
       ('JORGE HERNANDEZ', 'parroquia', 341),
       ('LA ROSA', 'parroquia', 341),
       ('PUNTA GORDA', 'parroquia', 341),
       ('CARMEN HERRERA', 'parroquia', 341),
       ('SAN BENITO', 'parroquia', 341),
       ('ROMULO BETANCOURT', 'parroquia', 341),
       ('ARISTIDES CALVANI', 'parroquia', 341);

-- ==============================================
-- Parroquias del Municipio Catatumbo (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('UDON PEREZ', 'parroquia', 342),
       ('ENCONTRADOS', 'parroquia', 342);

-- ==============================================
-- Parroquias del Municipio Colón (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SANTA CRUZ DEL ZULIA', 'parroquia', 343),
       ('URRIBARRI', 'parroquia', 343),
       ('MORALITO', 'parroquia', 343),
       ('SAN CARLOS DEL ZULIA', 'parroquia', 343),
       ('SANTA BARBARA', 'parroquia', 343);

-- ==============================================
-- Parroquias del Municipio Francisco Javier Pulgar (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SIMON RODRIGUEZ', 'parroquia', 344),
       ('CARLOS QUEVEDO', 'parroquia', 344),
       ('FRANCISCO J PULGAR', 'parroquia', 344);

-- ==============================================
-- Parroquias del Municipio Guajira (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GOAJIRA', 'parroquia', 345),
       ('ELIAS SANCHEZ RUBIO', 'parroquia', 345),
       ('SINAMAICA', 'parroquia', 345),
       ('ALTA GUAJIRA', 'parroquia', 345);

-- ==============================================
-- Parroquias del Municipio Jesús Enrique Losada (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('JOSE RAMON YEPEZ', 'parroquia', 346),
       ('LA CONCEPCION', 'parroquia', 346),
       ('SAN JOSE', 'parroquia', 346),
       ('MARIANO PARRA LEON', 'parroquia', 346);

-- ==============================================
-- Parroquias del Municipio Jesús María Semprún (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BARI', 'parroquia', 347),
       ('JESUS M SEMPRUN', 'parroquia', 347);

-- ==============================================
-- Parroquias del Municipio La Cañada de Urdaneta (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ANDRES BELLO', 'parroquia', 348),
       ('POTRERITOS', 'parroquia', 348),
       ('EL CARMELO', 'parroquia', 348),
       ('CHIQUINQUIRA', 'parroquia', 348),
       ('CONCEPCION', 'parroquia', 348);

-- ==============================================
-- Parroquias del Municipio Lagunillas (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('ELEAZAR LOPEZ C', 'parroquia', 349),
       ('ALONSO DE OJEDA', 'parroquia', 349),
       ('VENEZUELA', 'parroquia', 349),
       ('CAMPO LARA', 'parroquia', 349),
       ('LIBERTAD', 'parroquia', 349);

-- ==============================================
-- Parroquias del Municipio Machiques de Perijá (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('SAN JOSE DE PERIJA', 'parroquia', 350),
       ('BARTOLOME DE LAS CASAS', 'parroquia', 350),
       ('LIBERTAD', 'parroquia', 350),
       ('RIO NEGRO', 'parroquia', 350);

-- ==============================================
-- Parroquias del Municipio Mara (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('LUIS DE VICENTE', 'parroquia', 351),
       ('RICAURTE', 'parroquia', 351),
       ('MONS.MARCOS SERGIO G', 'parroquia', 351),
       ('SAN RAFAEL', 'parroquia', 351),
       ('LAS PARCELAS', 'parroquia', 351),
       ('TAMARE', 'parroquia', 351),
       ('LA SIERRITA', 'parroquia', 351);

-- ==============================================
-- Parroquias del Municipio Maracaibo (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('BOLIVAR', 'parroquia', 352),
       ('COQUIVACOA', 'parroquia', 352),
       ('CRISTO DE ARANZA', 'parroquia', 352),
       ('CHIQUINQUIRA', 'parroquia', 352),
       ('SANTA LUCIA', 'parroquia', 352),
       ('OLEGARIO VILLALOBOS', 'parroquia', 352),
       ('JUANA DE AVILA', 'parroquia', 352),
       ('CARACCIOLO PARRA PEREZ', 'parroquia', 352),
       ('IDELFONZO VASQUEZ', 'parroquia', 352),
       ('CACIQUE MARA', 'parroquia', 352),
       ('CECILIO ACOSTA', 'parroquia', 352),
       ('RAUL LEONI', 'parroquia', 352),
       ('FRANCISCO EUGENIO B', 'parroquia', 352),
       ('MANUEL DAGNINO', 'parroquia', 352),
       ('LUIS HURTADO HIGUERA', 'parroquia', 352),
       ('VENANCIO PULGAR', 'parroquia', 352),
       ('ANTONIO BORJAS ROMERO', 'parroquia', 352),
       ('SAN ISIDRO', 'parroquia', 352);

-- ==============================================
-- Parroquias del Municipio Miranda (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('FARIA', 'parroquia', 353),
       ('SAN ANTONIO', 'parroquia', 353),
       ('ANA MARIA CAMPOS', 'parroquia', 353),
       ('SAN JOSE', 'parroquia', 353),
       ('ALTAGRACIA', 'parroquia', 353);

-- ==============================================
-- Parroquias del Municipio Rosario de Perijá (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('DONALDO GARCIA', 'parroquia', 354),
       ('SIXTO ZAMBRANO', 'parroquia', 354),
       ('EL ROSARIO', 'parroquia', 354);

-- ==============================================
-- Parroquias del Municipio San Francisco (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('MARCIAL HERNANDEZ', 'parroquia', 355),
       ('FRANCISCO OCHOA', 'parroquia', 355),
       ('SAN FRANCISCO', 'parroquia', 355),
       ('EL BAJO', 'parroquia', 355),
       ('DOMITILA FLORES', 'parroquia', 355),
       ('LOS CORTIJOS', 'parroquia', 355);

-- ==============================================
-- Parroquias del Municipio Santa Rita (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('PEDRO LUCAS URRIBARRI', 'parroquia', 356),
       ('SANTA RITA', 'parroquia', 356),
       ('JOSE CENOVIO URRIBARR', 'parroquia', 356),
       ('EL MENE', 'parroquia', 356);

-- ==============================================
-- Parroquias del Municipio Simón Bolívar (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('RAFAEL MARIA BARALT', 'parroquia', 357),
       ('MANUEL MANRIQUE', 'parroquia', 357),
       ('RAFAEL URDANETA', 'parroquia', 357);

-- ==============================================
-- Parroquias del Municipio Sucre (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('GIBRALTAR', 'parroquia', 358),
       ('HERAS', 'parroquia', 358),
       ('M.ARTURO CELESTINO A', 'parroquia', 358),
       ('ROMULO GALLEGOS', 'parroquia', 358),
       ('BOBURES', 'parroquia', 358),
       ('EL BATEY', 'parroquia', 358);

-- ==============================================
-- Parroquias del Municipio Valmore Rodríguez (Zulia)
-- ==============================================
INSERT INTO lugar (nombre,
                   tipo,
                   fk_lugar)
VALUES ('RAUL CUENCA', 'parroquia', 359),
       ('LA VICTORIA', 'parroquia', 359),
       ('RAFAEL URDANETA', 'parroquia', 359);

--
-- FIN DEL SCRIPT DE INSERCIÓN DE LUGAR
--

INSERT INTO receta (clave, nombre, descripcion) VALUES
(1, 'Receta no especificada', 'La receta para este tipo de cerveza no ha sido detallada en el documento de referencia. Generalmente incluye agua, malta de cebada, lúpulo y levadura.'),
(2, 'Receta American Amber Ale (Todo Grano)',
'Receta simplificada, se diferencia por su color característico de ambar y notas florales'),
(3, 'Receta India Pale Ale (IPA)', 'Una receta lupulada y amarga, con aromas cítricos y resinosos. Utiliza maltas pálidas para resaltar el lúpulo.'),
(4, 'Receta Stout Irlandesa', 'Cerveza oscura, seca y con notas tostadas a café y chocolate amargo. Ligeramente cremosa.'),
(5, 'Receta Hefeweizen (Trigo Bávara)', 'Cerveza de trigo de alta fermentación, con distintivos aromas a plátano y clavo. Sin filtrar.'),
(6, 'Receta Pilsner Checa', 'Lager pálida, limpia y refrescante, con un balance entre la dulzura de la malta y el amargor del lúpulo Saaz.'),
(7, 'Receta Brown Ale Inglesa', 'Cerveza con cuerpo medio, notas a caramelo, toffee y frutos secos. Baja en amargor y con un final suave.'),
(8, 'Receta Belgian Dubbel', 'Cerveza trapense de color ámbar oscuro, con complejidad de ésteres frutales, especias y malta caramelizada.'),
(9, 'Receta Porter (Londres)', 'Cerveza oscura con un perfil de sabor a malta tostada, chocolate y café, pero más ligera y menos amarga que una Stout.'),
(10, 'Receta Gose Ale', 'Cerveza agria de trigo con un toque de sal y cilantro. Refrescante y ligeramente ácida.');
-- ========= INSERCIÓN DE TIPOS DE CERVEZA =========
-- ========= INSERCIÓN DE TIPOS DE CERVEZA =========
-- Nota: La clave 1 se usa como raíz para los tipos principales.

-- Nivel 1: Familias Principales (Lager y Ale)
INSERT INTO tipo_cerveza (clave, nombre, descripcion, historia, fk_receta) VALUES
(2, 'Lager', 'Cervezas de baja fermentación, con levaduras que actúan en la parte baja del fermentador a temperaturas bajas y por tiempos largos. Suelen ser de color claro y graduación moderada.', 'El término proviene del alemán "lagern" (almacenar), por el método de maduración en frío.', 1),
(3, 'Ale', 'Cervezas de alta fermentación, con levaduras que actúan en la superficie a temperaturas más cálidas y por tiempos cortos. Suelen tener más lúpulo y mayor contenido alcohólico que las Lagers.', 'Originarias del Reino Unido, es el método de elaboración más antiguo.', 1);

-- Nivel 2: Sub-tipos de Lager
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(4, 'Pilsner', 'Sabor bastante ligero pero intenso, fermentada con levadura de baja fermentación, con un contenido de alcohol medio.', 2, 1),
(5, 'Spezial', 'Un tipo de Lager alemana.', 2, 1),
(6, 'Dortmunster', 'Estilo de Lager pálida originario de Dortmund, Alemania.', 2, 1),
(7, 'Schwarzbier (Black Beer)', 'Lager oscura alemana, de color negro pero con un sabor suave y no tan tostado como una Stout.', 2, 1),
(8, 'Vienna', 'Lager de color ámbar con un dulzor suave de malta.', 2, 1),
(9, 'Bock', 'Lager muy rica en maltas tostadas, de color oscuro y con más de 7% de alcohol.', 2, 1),
(10, 'Munich Helles', 'Lager pálida de Munich, con énfasis en el sabor a malta.', 2, 1),
(11, 'Oktoberfest-Marzen', 'Lager maltosa de color ámbar, tradicionalmente servida en el Oktoberfest.', 2, 1);

-- Nivel 3: Sub-tipos de Bock
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(12, 'Eisbock', 'Una Bock que se congela parcialmente para retirar el hielo y aumentar la concentración de alcohol.', 9, 1);

-- Nivel 2: Sub-tipos de Ale
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(13, 'Cervezas de Trigo', 'Hechas total o parcialmente con malta de trigo, son claras de color y de baja graduación.', 3, 1),
(14, 'Pale Ale', 'Familia de cervezas ale de color claro, elaboradas con pequeñas proporciones de malta tostada y mucho lúpulo.', 3, 1),
(15, 'Dark Ales', 'Cervezas ale oscuras, como las Stouts y las Porters.', 3, 1),
(16, 'Cervezas Belgas', 'Cervezas de sabor intenso, con buenas dosis de lúpulo pero con el fondo dulce de maltas ámbar y cristal.', 3, 1),
(17, 'Barley Wine', 'Vino de cebada. Cervezas con mucho cuerpo y graduaciones que superan el 10% de alcohol.', 3, 1),
(18, 'Amber Ale', 'Estilo de Ale con un perfil de malta más pronunciado y color ámbar.', 3, 1),
(19, 'Blonde Ale', 'Caracterizada por un sabor ligero y cuerpo liviano, y un aroma a frutas tropicales.', 3, 1),
(20, 'Düsseldorf Altbier', 'Estilo de Ale alemán, de color cobre y un amargor balanceado.', 3, 1),
(21, 'Lambic', 'Estilo de Ale belga de fermentación espontánea.', 3, 1),
(22, 'Red Ale', 'Ale de color rojizo con un perfil de malta a caramelo.', 3, 1),
(23, 'Spice, Herb o Vegetable Beer', 'Cerveza elaborada con especias, hierbas o vegetales para añadir complejidad.', 3, 1);

-- Nivel 3: Sub-tipos de Cervezas de Trigo
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(24, 'Weizen-Weissbier', 'Cerveza blanca de trigo, típica del sur de Alemania.', 13, 1),
(25, 'Witbier', 'Cerveza blanca de trigo belga, a menudo condimentada con cilantro y cáscara de naranja.', 13, 1);

-- Nivel 3: Sub-tipos de Pale Ale
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(26, 'American Pale Ale', 'Adaptación americana de la Pale Ale inglesa, más limpia y con lúpulos cítricos.', 14, 1),
(27, 'English Pale Ale', 'Estilo clásico inglés, con un balance entre malta y lúpulos terrosos o florales.', 14, 1),
(28, 'Indian Pale Ale (IPA)', 'Cerveza muy alcohólica y rica en lúpulo, diseñada para aguantar largas travesías.', 14, 1),
(29, 'English Bitter', 'Un clásico de los Pubs del Reino Unido, amarga y de baja carbonatación.', 14, 1);

-- Nivel 3: Sub-tipos de Dark Ales
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(30, 'Stout', 'Cerveza muy oscura (negra), hecha con maltas tostadas y caramelizadas. Textura espesa y cremosa.', 15, 1),
(31, 'Porter', 'Similar a la Stout pero algo menos oscura y potente.', 15, 1);

-- Nivel 3: Sub-tipos de Cervezas Belgas
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(32, 'De Abadía', 'Estilo de cerveza belga fuerte, tradicionalmente elaborada en monasterios.', 16, 1),
(33, 'Trapense', 'Cerveza elaborada en monasterios trapenses. Es una denominación de origen controlada.', 16, 1),
(34, 'Ámbar Belga', 'Ale belga de color ámbar con notas frutales y especiadas.', 16, 1),
(35, 'Flamenca', 'Ale rojiza de Flandes, caracterizada por su acidez.', 16, 1),
(36, 'Belgian Dubbel', 'Ale rojiza profunda, moderadamente fuerte, maltosa y compleja con notas a pasas y fruta seca.', 16, 1),
(37, 'Belgian Golden Strong Ale', 'Ale dorada, compleja, efervescente y fuerte, con notas frutales y especiadas.', 16, 1),
(38, 'Belgian Specialty Ale', 'Categoría abierta para cervezas belgas únicas que no encajan en otros estilos.', 16, 1);

-- Nivel 3: Sub-tipos de Amber Ale
INSERT INTO tipo_cerveza (clave, nombre, descripcion, historia, fk_tipo_cerveza, fk_receta) VALUES
(39, 'American Amber Ale', 'Amber Ale moderadamente fuerte con un sabor a malta de caramelo, a menudo con un carácter lupulado notable.', 'Nació a finales del siglo XX en el Norte de California y Noroeste del Pacífico.', 18, 2);

-- Nivel 3: Sub-tipos de Lambic
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(40, 'Fruit Lambic', 'Lambic a la que se le añade fruta durante la fermentación.', 21, 1);

-- Nivel 3: Sub-tipos de Red Ale
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(41, 'Irish Red Ale', 'Fácil de beber, con un sabor a malta dulce y un final tostado.', 22, 1);

-- Nivel 4: Sub-tipos de IPA
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(42, 'American IPA', 'Menos maltosa y más lupulizada que la IPA inglesa, con lúpulos americanos cítricos o resinosos.', 28, 1),
(43, 'Imperial IPA', 'Una IPA más fuerte y lupulada, también conocida como Double IPA.', 28, 1);

-- Nivel 4: Sub-tipos de English Bitter
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(44, 'Extra-Strong Bitter (ESB)', 'Versión más fuerte y balanceada del estilo Bitter.', 29, 1);

-- Nivel 4: Sub-tipos de Stout
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(45, 'Imperial Stout', 'Stout con una altísima concentración de malta y alta graduación alcohólica.', 30, 1),
(46, 'Chocolate Stout', 'Stout donde predomina el sabor de la malta chocolate.', 30, 1),
(47, 'Coffee Stout', 'Stout con adición de café o maltas que evocan su sabor.', 30, 1),
(48, 'Milk Stout', 'Stout endulzada con lactosa, lo que le da un cuerpo más pleno y un sabor más dulce.', 30, 1),
(49, 'Dry Stout', 'Stout seca y tostada, con un característico amargor a café. El ejemplo más famoso es Guinness.', 30, 1),
(50, 'Sweet Stout', 'Stout más dulce y con menos amargor que la Dry Stout.', 30, 1);

-- Nivel 4: Sub-tipos de Pilsner
INSERT INTO tipo_cerveza (clave, nombre, descripcion, fk_tipo_cerveza, fk_receta) VALUES
(51, 'Bohemian Pilsener', 'Pilsner original de Bohemia, con un carácter de malta más rico y un lúpulo Saaz especiado.', 4, 1);

-- ========= INSERCIÓN DE INGREDIENTES =========
-- Estos son los componentes básicos que se pueden usar en cualquier receta.
INSERT INTO ingrediente (clave, nombre, descripcion) VALUES
(1, 'Malta Best Malz Pale Ale', 'Malta base de dos hileras, ideal para cervezas tipo Ale.'),
(2, 'Malta Best Malz Aromatic', 'Malta que aporta un intenso aroma y sabor a malta.'),
(3, 'Malta Best Malz Caramel Light', 'Malta de caramelo que aporta color, cuerpo y un ligero dulzor.'),
(4, 'Lúpulo Columbus', 'Lúpulo de doble propósito, aporta amargor y aromas terrosos y cítricos.'),
(5, 'Lúpulo Cascade', 'Lúpulo americano clásico, conocido por sus notas florales, especiadas y cítricas.'),
(6, 'Levadura Danstar Bry-97', 'Levadura Ale americana que produce cervezas limpias y de perfil neutro.'),
(7, 'Agua', 'Agua tratada para la elaboración de cerveza, con un perfil de minerales específico.'),
(8, 'Malta Best Malz Munich', 'Malta que aporta un color más oscuro y un sabor robusto a la cerveza.'),
(9, 'Lúpulo Saaz', 'Lúpulo noble checo, utilizado en cervezas tipo Lager por su aroma suave y especiado.'),
(10, 'Levadura Safale S-04', 'Levadura de fermentación alta, usada en cervezas inglesas por su perfil frutal.');

-- =================================================================
-- PASO 2: INSERCIÓN DE INSTRUCCIONES ESPECÍFICAS DE LA RECETA
-- ¡AQUÍ ESTÁ EL CAMBIO PRINCIPAL!
-- Estas son las instrucciones literales de TU receta. Cada una es un paso único.
-- =================================================================

-- Primero, limpiamos las instrucciones genéricas anteriores.
TRUNCATE TABLE instruccion RESTART IDENTITY CASCADE;

INSERT INTO instruccion (descripcion) VALUES
-- Clave: 1
('Maceración de toda la malta durante 1 hora a 66 grados.'),
-- Clave: 2
('Realizar el sparging a 76 grados.'),
-- Clave: 3
('Ebullición de una hora, siguiendo los tiempos de adición del lúpulo indicados.'),
-- Clave: 4
('Adición a los 60 min. restantes'),
-- Clave: 5
('Adición a los 20 min. restantes'),
-- Clave: 6
('Adición Flameout (con el fuego apagado)'),
-- Clave: 7
('Fermentar a 18-20 grados.'),
-- Clave: 8
('Maduración en botella o en barril durante 4 semanas.');
--faltan 2

-- =================================================================
-- PASO 3: VINCULAR INGREDIENTES A LAS INSTRUCCIONES ESPECÍFICAS DE LA RECETA
-- Tabla 'ing_rec': aquí se une todo para la receta "American Amber Ale" (fk_receta = 2).
-- =================================================================

-- Paso 1 de la receta: Maceración. Usa la instrucción con clave=1.
-- Todos estos ingredientes se usan en el mismo paso.
INSERT INTO ing_rec (cantidad, unidad_medida, fk_receta, fk_ingrediente, fk_instruccion, numero_paso) VALUES
(18.5, 'litros', 2, 7, 1, 1), -- Agua para la maceración (18-19 litros)
(5.00, 'kg', 2, 1, 1, 1),     -- Malta Pale Ale
(0.50, 'kg', 2, 2, 1, 1),     -- Malta Aromatic
(0.40, 'kg', 2, 3, 1, 1);     -- Malta Caramel Light

-- Paso 2 de la receta: Sparging. Usa la instrucción con clave=2.
-- Este es un paso de proceso que principalmente usa agua.
INSERT INTO ing_rec (cantidad, unidad_medida, fk_receta, fk_ingrediente, fk_instruccion, numero_paso) VALUES
(0.00, 'N/A', 2, 7, 2, 2); -- El agua para el sparging ya se considera en el total. Se registra el paso.

-- Paso 3 de la receta: Ebullición. Usa la instrucción con clave=3.
-- Todos los lúpulos se añaden durante este único paso, aunque en momentos diferentes.
-- La instrucción general (clave 3) describe el proceso completo.
INSERT INTO ing_rec (cantidad, unidad_medida, fk_receta, fk_ingrediente, fk_instruccion, numero_paso) VALUES
(0.00, 'N/A', 2, NULL, 3, 3),
(7.00, 'gr', 2, 4, 4, 3.1),  -- Lúpulo Columbus (Adición a los 60 min. restantes)
(7.00, 'gr', 2, 5, 5, 3.2),  -- Lúpulo Cascade (Adición a los 20 min. restantes)
(10.00, 'gr', 2, 4, 6, 4.1), -- Lúpulo Columbus (Flameout)
(30.00, 'gr', 2, 5, 6, 4.2); -- Lúpulo Cascade (Flameout)

-- Paso 4 de la receta: Fermentación. Usa la instrucción con clave=4.
INSERT INTO ing_rec (cantidad, unidad_medida, fk_receta, fk_ingrediente, fk_instruccion, numero_paso) VALUES
(1.00, 'sobre', 2, 6, 7, 5); -- Levadura Danstar Bry-97

-- Paso 5 de la receta: Maduración. Usa la instrucción con clave=5.
-- Este es un paso de proceso que no consume un ingrediente nuevo, se registra para completar la receta.
INSERT INTO ing_rec (cantidad, unidad_medida, fk_receta, fk_ingrediente, fk_instruccion, numero_paso) VALUES
(0.00 , 'N/A', 2, NULL, 8, 6); -- No hay un ingrediente asociado, pero sí una duración. fk_ingrediente puede ser NULL.

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
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Amazonas', '2024-06-15', '2024-06-17', '14:00', 'Av. Orinoco, Puerto Ayacucho', 20, NULL, 1, 1),
('Taller de Cata Selvática', '2024-07-05', '2024-07-05', '16:00', 'Centro Cultural Amazonas', 15, NULL, 1, 2),
('Concurso Homebrew Orinoquía', '2024-08-12', '2024-08-13', '10:00', 'Plaza Bolívar, Puerto Ayacucho', 10, NULL, 1, 3),
('Tour Cervecero Selva', '2024-09-03', '2024-09-03', '15:00', 'Cervecería Selva', 25, NULL, 1, 6),
('Cena Maridaje Amazónico', '2024-10-22', '2024-10-22', '19:00', 'Restaurante La Jungla', 50, NULL, 1, 5);

-- Anzoátegui (fk_lugar = 2)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero de Barcelona', '2024-06-22', '2024-06-24', '14:00', 'Paseo Colón, Barcelona', 20, NULL, 2, 1),
('Taller de Cata Costera', '2024-07-10', '2024-07-10', '16:00', 'Centro de Convenciones', 15, NULL, 2, 2),
('Lanzamiento Costa Caribe', '2024-08-18', '2024-08-18', '18:00', 'C.C. Plaza Mayor', NULL, NULL, 2, 4),
('Curso Elaboración Anzoátegui', '2024-09-07', '2024-09-08', '09:00', 'Escuela Gastronómica', 40, NULL, 2, 9),
('Expo Ingredientes Orientales', '2024-10-25', '2024-10-26', '10:00', 'Zona Industrial', 10, NULL, 2, 10);

-- Apure (fk_lugar = 3)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Llanero Apure', '2024-06-18', '2024-06-20', '14:00', 'Av. 23 de Enero, San Fernando', 20, NULL, 3, 1),
('Meet the Brewer Llanero', '2024-07-08', '2024-07-08', '17:00', 'Cervecería Llanera', 15, NULL, 3, 7),
('Concurso Homebrew Apureño', '2024-08-15', '2024-08-16', '10:00', 'Plaza Los Llanos', 10, NULL, 3, 3),
('Oktoberfest San Fernando', '2024-09-28', '2024-09-29', '16:00', 'Club Social', 30, NULL, 3, 8),
('Taller de Cata Llanera', '2024-10-12', '2024-10-12', '16:00', 'Biblioteca Pública', 15, NULL, 3, 2);

-- Aragua (fk_lugar = 4)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Maracay', '2024-07-12', '2024-07-14', '14:00', 'Av. Las Delicias', 25, NULL, 4, 1),
('Tour Cervecero Aragua', '2024-08-05', '2024-08-05', '15:00', 'Cervecería Jardín', 20, NULL, 4, 6),
('Cena Maridaje Central', '2024-09-15', '2024-09-15', '19:00', 'Restaurante Gourmet', 55, NULL, 4, 5),
('Expo Ingredientes Aragua', '2024-10-30', '2024-10-31', '10:00', 'Centro de Eventos', 12, NULL, 4, 10),
('Concurso Homebrew Central', '2024-11-22', '2024-11-23', '10:00', 'Plaza Bolívar', 10, NULL, 4, 3);

-- Barinas (fk_lugar = 5)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Llanero', '2024-07-25', '2024-07-27', '14:00', 'Av. 23 de Enero, Barinas', 20, NULL, 5, 1),
('Taller de Cata Barinés', '2024-08-20', '2024-08-20', '16:00', 'Centro Cultural', 15, NULL, 5, 2),
('Lanzamiento Sabana', '2024-09-10', '2024-09-10', '18:00', 'C.C. Llanero', NULL, NULL, 5, 4),
('Curso Elaboración Barinas', '2024-10-05', '2024-10-06', '09:00', 'Escuela Técnica', 35, NULL, 5, 9),
('Meet the Brewer Llanero', '2024-11-15', '2024-11-15', '17:00', 'Cervecería Sabana', 15, NULL, 5, 7);

-- Bolívar (fk_lugar = 6)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Guayana', '2024-08-01', '2024-08-03', '14:00', 'Paseo Orinoco, Ciudad Guayana', 25, NULL, 6, 1),
('Tour Cervecero Minero', '2024-09-02', '2024-09-02', '15:00', 'Cervecería Hierro', 20, NULL, 6, 6),
('Cena Maridaje Guayanes', '2024-10-18', '2024-10-18', '19:00', 'Restaurante Río', 60, NULL, 6, 5),
('Expo Ingredientes del Sur', '2024-11-12', '2024-11-13', '10:00', 'Poliedro', 10, NULL, 6, 10),
('Concurso Homebrew Bolívar', '2024-12-07', '2024-12-08', '10:00', 'Plaza del Hierro', 10, NULL, 6, 3);

-- Carabobo (fk_lugar = 7)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Valencia', '2024-08-10', '2024-08-12', '14:00', 'Av. Bolívar, Valencia', 30, NULL, 7, 1),
('Taller de Cata Industrial', '2024-09-05', '2024-09-05', '16:00', 'Centro de Convenciones', 20, NULL, 7, 2),
('Lanzamiento Puerto Cabello', '2024-10-15', '2024-10-15', '18:00', 'C.C. Sambil', NULL, NULL, 7, 4),
('Curso Elaboración Carabobo', '2024-11-08', '2024-11-09', '09:00', 'Escuela de Cocina', 45, NULL, 7, 9),
('Oktoberfest Valencia', '2024-12-12', '2024-12-13', '16:00', 'Club Aleman', 35, NULL, 7, 8);

-- Cojedes (fk_lugar = 8)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Llanero', '2024-08-22', '2024-08-24', '14:00', 'Av. Miranda, San Carlos', 20, NULL, 8, 1),
('Meet the Brewer Cojedeño', '2024-09-18', '2024-09-18', '17:00', 'Cervecería Sabana', 15, NULL, 8, 7),
('Concurso Homebrew Cojedes', '2024-10-22', '2024-10-23', '10:00', 'Plaza Central', 10, NULL, 8, 3),
('Tour Cervecero Ganadero', '2024-11-20', '2024-11-20', '15:00', 'Hacienda La Fortuna', 25, NULL, 8, 6),
('Taller de Cata Llanera', '2024-12-18', '2024-12-18', '16:00', 'Centro Cultural', 15, NULL, 8, 2);

-- Delta Amacuro (fk_lugar = 9)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Delta', '2024-09-01', '2024-09-03', '14:00', 'Av. Orinoco, Tucupita', 20, NULL, 9, 1),
('Taller de Cata Fluvial', '2024-10-02', '2024-10-02', '16:00', 'Centro Warao', 15, NULL, 9, 2),
('Lanzamiento Delta', '2024-11-05', '2024-11-05', '18:00', 'Malecón', NULL, NULL, 9, 4),
('Curso Elaboración Delta', '2024-12-03', '2024-12-04', '09:00', 'Escuela Técnica', 35, NULL, 9, 9),
('Expo Ingredientes Fluviales', '2025-01-14', '2025-01-15', '10:00', 'Centro de Eventos', 10, NULL, 9, 10);

-- Falcón (fk_lugar = 10)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Coriano', '2024-09-12', '2024-09-14', '14:00', 'Paseo Alameda, Coro', 25, NULL, 10, 1),
('Tour Cervecero Costero', '2024-10-10', '2024-10-10', '15:00', 'Cervecería Médanos', 20, NULL, 10, 6),
('Cena Maridaje Falconiana', '2024-11-15', '2024-11-15', '19:00', 'Restaurante Dunas', 50, NULL, 10, 5),
('Expo Ingredientes Costeros', '2024-12-12', '2024-12-13', '10:00', 'Centro de Convenciones', 12, NULL, 10, 10),
('Concurso Homebrew Falcón', '2025-01-22', '2025-01-23', '10:00', 'Plaza Bolívar', 10, NULL, 10, 3);

-- Guárico (fk_lugar = 11)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Central', '2024-09-25', '2024-09-27', '14:00', 'Av. Miranda, San Juan', 20, NULL, 11, 1),
('Meet the Brewer Guariqueño', '2024-10-25', '2024-10-25', '17:00', 'Cervecería Llano', 15, NULL, 11, 7),
('Concurso Homebrew Guárico', '2024-11-25', '2024-11-26', '10:00', 'Plaza Central', 10, NULL, 11, 3),
('Oktoberfest San Juan', '2024-12-15', '2024-12-16', '16:00', 'Club Social', 30, NULL, 11, 8),
('Taller de Cata Llanera', '2025-01-15', '2025-01-15', '16:00', 'Centro Cultural', 15, NULL, 11, 2);

-- Lara (fk_lugar = 12)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Barquisimetano', '2024-10-05', '2024-10-07', '14:00', 'Av. Morán, Barquisimeto', 30, NULL, 12, 1),
('Taller de Cata Centroccidental', '2024-11-02', '2024-11-02', '16:00', 'Centro de Convenciones', 20, NULL, 12, 2),
('Lanzamiento Lara', '2024-12-05', '2024-12-05', '18:00', 'C.C. Sambil', NULL, NULL, 12, 4),
('Curso Elaboración Lara', '2025-01-10', '2025-01-11', '09:00', 'Escuela Gastronómica', 45, NULL, 12, 9),
('Tour Cervecero Andino', '2025-02-15', '2025-02-15', '15:00', 'Cervecería Divina Pastora', 25, NULL, 12, 6);

-- Mérida (fk_lugar = 13)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Andino de Cerveza', '2024-10-18', '2024-10-20', '14:00', 'Av. Urdaneta, Mérida', 35, NULL, 13, 1),
('Cena Maridaje Andino', '2024-11-20', '2024-11-20', '19:00', 'Restaurante Pico Águila', 65, NULL, 13, 5),
('Tour Cervecero Montaña', '2024-12-18', '2024-12-18', '15:00', 'Cervecería Sierra', 30, NULL, 13, 6),
('Expo Ingredientes Andinos', '2025-01-22', '2025-01-23', '10:00', 'Centro de Eventos', 15, NULL, 13, 10),
('Concurso Homebrew Andino', '2025-02-25', '2025-02-26', '10:00', 'Plaza Bolívar', 15, NULL, 13, 3);

-- Miranda (fk_lugar = 14)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Oriental', '2024-11-01', '2024-11-03', '14:00', 'Av. Miranda, Los Teques', 30, NULL, 14, 1),
('Taller de Cata Metropolitano', '2024-12-03', '2024-12-03', '16:00', 'Centro Cultural', 25, NULL, 14, 2),
('Lanzamiento Miranda', '2025-01-10', '2025-01-10', '18:00', 'C.C. Lider', NULL, NULL, 14, 4),
('Curso Elaboración Miranda', '2025-02-14', '2025-02-15', '09:00', 'Escuela de Cocina', 50, NULL, 14, 9),
('Meet the Brewer Mirandino', '2025-03-18', '2025-03-18', '17:00', 'Cervecería Ávila', 20, NULL, 14, 7);

-- Monagas (fk_lugar = 15)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Maturinés', '2024-11-15', '2024-11-17', '14:00', 'Av. Bolívar, Maturín', 25, NULL, 15, 1),
('Tour Cervecero Petrolero', '2024-12-12', '2024-12-12', '15:00', 'Cervecería Petrolera', 20, NULL, 15, 6),
('Cena Maridaje Oriental', '2025-01-15', '2025-01-15', '19:00', 'Restaurante El Morichal', 55, NULL, 15, 5),
('Expo Ingredientes Monagas', '2025-02-18', '2025-02-19', '10:00', 'Centro de Eventos', 12, NULL, 15, 10),
('Concurso Homebrew Monagas', '2025-03-22', '2025-03-23', '10:00', 'Plaza Bolívar', 10, NULL, 15, 3);

-- Nueva Esparta (fk_lugar = 16)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Isleño', '2024-11-28', '2024-11-30', '14:00', 'Av. Santiago Mariño, Porlamar', 40, NULL, 16, 1),
('Taller de Cata en Playa', '2024-12-28', '2024-12-28', '16:00', 'Playa El Agua', 30, NULL, 16, 2),
('Lanzamiento Margarita', '2025-01-30', '2025-01-30', '18:00', 'C.C. Sambil', NULL, NULL, 16, 4),
('Curso Elaboración Isla', '2025-02-28', '2025-03-01', '09:00', 'Escuela de Turismo', 60, NULL, 16, 9),
('Oktoberfest Caribeño', '2025-03-30', '2025-03-31', '16:00', 'Club Costa Azul', 40, NULL, 16, 8);

-- Portuguesa (fk_lugar = 17)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Llanero', '2024-12-05', '2024-12-07', '14:00', 'Av. Los Agricultores, Guanare', 25, NULL, 17, 1),
('Meet the Brewer Portugueseño', '2025-01-07', '2025-01-07', '17:00', 'Cervecería Agrícola', 20, NULL, 17, 7),
('Concurso Homebrew Portuguesa', '2025-02-10', '2025-02-11', '10:00', 'Plaza Bolívar', 15, NULL, 17, 3),
('Tour Cervecero Agrícola', '2025-03-15', '2025-03-15', '15:00', 'Hacienda Santa Rosa', 30, NULL, 17, 6),
('Taller de Cata Llanera', '2025-04-18', '2025-04-18', '16:00', 'Centro Cultural', 20, NULL, 17, 2);

-- Sucre (fk_lugar = 18)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Oriental', '2024-12-15', '2024-12-17', '14:00', 'Paseo Colón, Cumaná', 30, NULL, 18, 1),
('Tour Cervecero Costero', '2025-01-15', '2025-01-15', '15:00', 'Cervecería Caribe', 25, NULL, 18, 6),
('Cena Maridaje de Mar', '2025-02-18', '2025-02-18', '19:00', 'Restaurante Puerto', 60, NULL, 18, 5),
('Expo Ingredientes Costeros', '2025-03-22', '2025-03-23', '10:00', 'Centro de Eventos', 15, NULL, 18, 10),
('Concurso Homebrew Sucre', '2025-04-25', '2025-04-26', '10:00', 'Plaza Bolívar', 15, NULL, 18, 3);

-- Táchira (fk_lugar = 19)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Andino Tachirense', '2025-01-05', '2025-01-07', '14:00', 'Av. Universidad, San Cristóbal', 35, NULL, 19, 1),
('Taller de Cata Fronterizo', '2025-02-05', '2025-02-05', '16:00', 'Centro Cultural', 25, NULL, 19, 2),
('Lanzamiento Táchira', '2025-03-10', '2025-03-10', '18:00', 'C.C. Sambil', NULL, NULL, 19, 4),
('Curso Elaboración Andina', '2025-04-14', '2025-04-15', '09:00', 'Escuela Gastronómica', 50, NULL, 19, 9),
('Oktoberfest Andino', '2025-05-20', '2025-05-21', '16:00', 'Club Alemán', 40, NULL, 19, 8);

-- Trujillo (fk_lugar = 20)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Trujillano', '2025-01-15', '2025-01-17', '14:00', 'Av. Bolívar, Valera', 30, NULL, 20, 1),
('Meet the Brewer Andino', '2025-02-15', '2025-02-15', '17:00', 'Cervecería Valle', 20, NULL, 20, 7),
('Concurso Homebrew Trujillo', '2025-03-22', '2025-03-23', '10:00', 'Plaza Bolívar', 15, NULL, 20, 3),
('Tour Cervecero Agrícola', '2025-04-25', '2025-04-25', '15:00', 'Hacienda Café', 30, NULL, 20, 6),
('Taller de Cata Andina', '2025-05-28', '2025-05-28', '16:00', 'Centro Cultural', 20, NULL, 20, 2);

-- Vargas (fk_lugar = 21)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Costero', '2025-02-01', '2025-02-03', '14:00', 'Av. La Costa, La Guaira', 40, NULL, 21, 1),
('Taller de Cata en Playa', '2025-03-05', '2025-03-05', '16:00', 'Playa Camurí Chico', 30, NULL, 21, 2),
('Lanzamiento Vargas', '2025-04-10', '2025-04-10', '18:00', 'C.C. Macuto', NULL, NULL, 21, 4),
('Curso Elaboración Costero', '2025-05-15', '2025-05-16', '09:00', 'Escuela de Turismo', 60, NULL, 21, 9),
('Cena Maridaje del Mar', '2025-06-20', '2025-06-20', '19:00', 'Restaurante Bahía', 70, NULL, 21, 5);

-- Yaracuy (fk_lugar = 22)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Yaracuyano', '2025-02-15', '2025-02-17', '14:00', 'Av. Yaracuy, San Felipe', 30, NULL, 22, 1),
('Tour Cervecero Agrícola', '2025-03-18', '2025-03-18', '15:00', 'Cervecería Cacao', 25, NULL, 22, 6),
('Cena Maridaje de Montaña', '2025-04-22', '2025-04-22', '19:00', 'Restaurante El Cacao', 55, NULL, 22, 5),
('Expo Ingredientes Yaracuy', '2025-05-26', '2025-05-27', '10:00', 'Centro de Eventos', 15, NULL, 22, 10),
('Concurso Homebrew Yaracuy', '2025-06-30', '2025-07-01', '10:00', 'Plaza Bolívar', 15, NULL, 22, 3);

-- Zulia (fk_lugar = 23)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero del Lago', '2025-03-01', '2025-03-03', '14:00', 'Paseo del Lago, Maracaibo', 40, NULL, 23, 1),
('Taller de Cata Zuliano', '2025-04-03', '2025-04-03', '16:00', 'Centro de Convenciones', 30, NULL, 23, 2),
('Lanzamiento Petrolero', '2025-05-08', '2025-05-08', '18:00', 'C.C. Lago Mall', NULL, NULL, 23, 4),
('Curso Elaboración Zulia', '2025-06-12', '2025-06-13', '09:00', 'Escuela Gastronómica', 55, NULL, 23, 9),
('Oktoberfest Marabino', '2025-07-18', '2025-07-19', '16:00', 'Club Aleman', 45, NULL, 23, 8);

-- Dependencias Federales (fk_lugar = 24)
INSERT INTO evento (nombre, fecha_inicio, fecha_fin, hora_inicio, direccion, precio_entrada, fk_evento, fk_lugar, fk_tipo_evento) VALUES
('Festival Cervecero Isla', '2025-03-15', '2025-03-17', '14:00', 'Playa El Yaque, Isla Margarita', 50, NULL, 24, 1),
('Cena Maridaje en Playa', '2025-04-18', '2025-04-18', '19:00', 'Restaurante El Yaque', 80, NULL, 24, 5),
('Tour Cervecero Caribeño', '2025-05-22', '2025-05-22', '15:00', 'Cervecería Isla Bonita', 40, NULL, 24, 6),
('Expo Ingredientes Insulares', '2025-06-26', '2025-06-27', '10:00', 'Centro de Eventos', 20, NULL, 24, 10),
('Concurso Homebrew Caribe', '2025-07-30', '2025-07-31', '10:00', 'Playa Parguito', 20, NULL, 24, 3);

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

-- =================================================================
-- TABLAS de EMPLEADOS, HORARIOS, CARGO, BENEFICIOS, NAN, departamento, tienda fisica, LUGAR TIENDA
-- =================================================================

-- Tabla horario
-- Llenamos con diferentes tipos de jornadas laborales.
INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(1, 'Lunes', '08:00:00', '17:00:00'),
(2, 'Martes', '08:00:00', '17:00:00'),
(3, 'Miercoles', '08:00:00', '17:00:00'),
(4, 'Jueves', '08:00:00', '17:00:00'),
(5, 'Viernes', '08:00:00', '17:00:00');

-- =================================================================

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(6, 'Lunes', '09:00:00', '18:00:00'),
(7, 'Martes', '09:00:00', '18:00:00'),
(8, 'Miercoles', '09:00:00', '18:00:00'),
(9, 'Jueves', '09:00:00', '18:00:00'),
(10, 'Viernes', '09:00:00', '18:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(11, 'Lunes', '08:30:00', '16:30:00'),
(12, 'Martes', '08:30:00', '16:30:00'),
(13, 'Miercoles', '08:30:00', '16:30:00'),
(14, 'Jueves', '08:30:00', '16:30:00'),
(15, 'Viernes', '08:30:00', '16:30:00'),
(16, 'Sabado', '08:30:00', '16:30:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(17, 'Sabado', '10:00:00', '19:00:00'),
(18, 'Domingo', '10:00:00', '19:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(19, 'Lunes', '14:00:00', '22:00:00'),
(20, 'Martes', '14:00:00', '22:00:00'),
(21, 'Miercoles', '14:00:00', '22:00:00'),
(22, 'Jueves', '14:00:00', '22:00:00'),
(23, 'Viernes', '14:00:00', '22:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(24, 'Lunes', '07:00:00', '15:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(25, 'Lunes', '08:00:00', '12:00:00'),
(26, 'Martes', '08:00:00', '12:00:00'),
(27, 'Miercoles', '08:00:00', '12:00:00'),
(28, 'Jueves', '08:00:00', '12:00:00'),
(29, 'Viernes', '08:00:00', '12:00:00');

INSERT INTO horario (clave, dia, fecha_hora_inicio, fecha_hora_fin) VALUES
(30, 'Lunes', '13:00:00', '17:00:00'),
(31, 'Martes', '13:00:00', '17:00:00'),
(32, 'Miercoles', '13:00:00', '17:00:00'),
(33, 'Jueves', '13:00:00', '17:00:00'),
(34, 'Viernes', '13:00:00', '17:00:00');
-- Tabla cargo
-- Llenamos con cargos relevantes para la empresa.
INSERT INTO cargo (clave, nombre, descripcion) VALUES
(1,'Gerente General', 'Responsable de la operación total de la tienda.'),
(2,'Gerente de Promociones', 'Encargado de crear y gestionar el "DiarioDeUnaCerveza" y otras ofertas.'),
(3,'Jefe de Compras', 'Responsable de aprobar y emitir órdenes de compra a proveedores.'),
(4,'Jefe de Despacho', 'Coordina la preparación de pedidos para la entrega.'),
(5,'Jefe de Entrega', 'Supervisa la logística de entrega de pedidos a clientes.'),
(6,'Analista de Inventario', 'Controla el stock de productos y genera órdenes de reposición.'),
(7,'Vendedor de Tienda', 'Atiende a los clientes en la tienda física y procesa ventas.'),
(8,'Cajero', 'Responsable del manejo de pagos en la tienda física.'),
(9,'Operador de Almacén', 'Organiza y mantiene el inventario en el almacén.'),
(10,'Repartidor', 'Realiza la entrega de los pedidos a los clientes.');

-- Tabla tipo_beneficio
-- Llenamos con beneficios comunes para empleados.
INSERT INTO tipo_beneficio (clave, nombre, descripcion) VALUES
(1,'Seguro Médico (HCM)', 'Póliza de Hospitalización, Cirugía y Maternidad.'),
(2,'Bono de Alimentación', 'Beneficio de alimentación mensual.'),
(3,'Bono de Transporte', 'Ayuda económica para gastos de transporte.'),
(4,'Plan de Jubilación', 'Aportes para un fondo de pensión privado.'),
(5,'Descuento en Productos', 'Descuento especial en la compra de productos de la empresa.'),
(6,'Bono de Productividad', 'Incentivo monetario por cumplimiento de metas.'),
(7,'Días de Vacaciones Adicionales', 'Días libres pagados adicionales a los de ley.'),
(8,'Fondo de Ahorro', 'Plan de ahorro con aportes de la empresa.'),
(9,'Seguro de Vida', 'Póliza de seguro de vida para el empleado.'),
(10,'Comisiones por Venta', 'Porcentaje de ganancia sobre las ventas realizadas.');

-- Tabla empleado
-- Creamos 10 empleados con datos variados.
INSERT INTO empleado (ci, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, descripcion) VALUES
(123456789, 'Carlos', 'Alberto', 'González', 'Pérez', '1985-05-15', 'Empleado con amplia experiencia en ventas.'),
(987654321, 'Ana', 'María', 'Rodríguez', 'López', '1990-11-20', 'Especialista en logística y despacho.'),
(234567890, 'Luis', 'Miguel', 'Martínez', 'Sánchez', '1988-02-10', 'Encargado del departamento de compras.'),
(345678901, 'Laura', 'Valentina', 'García', 'Ramírez', '1995-07-30', 'Gerente de la sucursal principal.'),
(456789012, 'Javier', 'José', 'Hernández', 'Díaz', '1992-09-05', 'Conductor y repartidor principal.'),
(567890123, 'Sofía', 'Isabel', 'Torres', 'Moreno', '1998-04-12', 'Cajera con excelente atención al cliente.'),
(678901234, 'Diego', 'Andrés', 'Silva', 'Mendoza', '1983-12-01', 'Gerente de promociones y marketing.'),
(789012345, 'Camila', 'Fernanda', 'Rojas', 'Castillo', '1996-06-25', 'Vendedora de tienda y catadora experta.'),
(890123456, 'Ricardo', 'Antonio', 'Ortega', 'Vargas', '1980-03-18', 'Jefe de operaciones de almacén.'),
(901234567, 'Valeria', 'Alejandra', 'Jiménez', 'Reyes', '1993-10-08', 'Analista de inventario y sistemas.');

-- Tabla tienda_fisica
-- Se asume que existen lugares con clave del 1 al 10.
INSERT INTO tienda_fisica (clave, nombre, direccion, rif_empresa, fk_lugar) VALUES
(1,'ACAUCAB Sede Principal', 'Av. Principal, Edif. Cervecero, Piso 1', 123456789, 1354);
/*
(2,'ACAUCAB Valencia', 'C.C. Metrópolis, Nivel Sol, Local 10', 123456789, 653),
(3,'ACAUCAB Maracay', 'Av. Las Delicias, al lado de la redoma', 123456789, 479),
(4,'ACAUCAB Barquisimeto', 'C.C. Sambil, Feria de Comida', 123456789, 171),
(5,'ACAUCAB Lechería', 'Av. Américo Vespucio, Plaza Mayor', 123456789, 444),
(6,'ACAUCAB Puerto Ordaz', 'C.C. Orinokia, Nivel Oro', 123456789, 592),
(7,'ACAUCAB Mérida', 'Av. Los Próceres, frente al McDonalds', 123456789, 1412),
(8,'ACAUCAB San Cristóbal', 'Barrio Obrero, Carrera 21', 123456789, 1265),
(9,'ACAUCAB Maracaibo', 'Av. 5 de Julio, Edif. Zuliano', 123456789, 879),
(10,'ACAUCAB Maturín', 'C.C. Monagas Plaza, Local 30', 123456789, 1068);
*/
-- =================================================================
-- TABLAS CON DEPENDENCIAS DE PRIMER NIVEL
-- =================================================================

-- Tabla departamento
-- Asignamos los 4 tipos de departamentos a diferentes tiendas.
INSERT INTO departamento (clave, nombre, descripcion, fk_tienda_fisica) VALUES
(1,'ventas', 'Departamento de ventas en tienda y corporativas.', 1),
(2,'despacho', 'Departamento de preparación de pedidos.', 1),
(3,'entrega', 'Departamento de logística y reparto.', 1),
(4,'compras', 'Departamento de adquisiciones y relación con proveedores.', 1),
(5,'ventas', 'Departamento de ventas en tienda.', 1),
(6,'recursos humanos', 'Departamento de recursos humanos.', 1),
(7,'finanzas', 'Departamento de finanzas.', 1),
(8,'marketing', 'Departamento de marketing.', 1),
(9,'produccion', 'Departamento de producción.', 1),
(10,'logistica', 'Departamento de logística.', 1);

-- Tabla emp_ben (Empleado - Beneficio)
-- Asignamos beneficios a varios empleados.
INSERT INTO emp_ben (monto, fk_empleado, fk_tipo_beneficio) VALUES
(50, 123456789, 2),  -- Carlos (1) recibe Bono de Alimentación (2)
(200,987654321, 1), -- Carlos (1) recibe Seguro Médico (1)
(50, 234567890, 2),  -- Ana (2) recibe Bono de Alimentación (2)
(30, 345678901, 3),  -- Ana (2) recibe Bono de Transporte (3)
(50, 456789012, 2),  -- Luis (3) recibe Bono de Alimentación (2)
(100,567890123, 8), -- Luis (3) recibe Fondo de Ahorro (8)
(5, 678901234,5),   -- Laura (4) recibe Descuento en Productos (5)
(80, 789012345, 10), -- Diego (7) recibe Comisiones por Venta (10)
(50, 890123456, 2),  -- Camila (8) recibe Bono de Alimentación (2)
(5, 901234567,5);   -- Camila (8) recibe Descuento en Productos (5)


-- Insertar persona_contacto (10 ejemplos)
INSERT INTO persona_contacto (clave, primer_nombre, primer_apellido, fk_miembro, fk_cliente) VALUES
(1,'Juan','Pérez',234567890,NULL), -- Persona de contacto del miembro 1
(2,'Ana','Gómez',345678901,NULL), -- Persona de contacto del miembro 1
(3,'Luis','Martínez',456789012,NULL), -- Persona de contacto del miembro 2
(4,'María','López',567890123,NULL), -- Persona de contacto del miembro 2
(5,'Carlos','Hernández',678901234,NULL), -- Persona de contacto del miembro 3
(6,'Laura','Ramírez',NULL,21), -- Persona de contacto del cliente 21
(7,'Pedro','Torres',NULL,22), -- Persona de contacto del cliente 22
(8,'Sofía','Vásquez',NULL,22), -- Persona de contacto del cliente 22
(9,'Andrés','Morales',NULL,23), -- Persona de contacto del cliente 23
(10,'Isabel','Reyes',NULL,23); -- Persona de contacto del cliente 23

-- Tabla telefono
-- Asignamos un teléfono a cada empleado.
INSERT INTO telefono (codigo, numero, extension, fk_empleado, fk_cliente, fk_miembro, fk_persona_contacto) VALUES 
(0414, 1234567, 1, 123456789, NULL, NULL, NULL),
(0416, 2345678, 2, NULL, 2, NULL, NULL),
(0412, 3456789, 3, NULL, 3, NULL, NULL),
(0424, 4567890, 4, NULL, NULL, NULL, 4),
(0426, 5678901, 5, 456789012, NULL, NULL, NULL),
(0414, 6789012, 6, NULL, 6, NULL, NULL),
(0416, 7890123, 7, NULL, 7, NULL, NULL),
(0412, 8901234, 8, NULL, NULL, NULL, 8),
(0424, 9012345, 9, 901234567, NULL, NULL, NULL),
(0426, 1122334, 10, NULL, 10, NULL, NULL);

--Insertar privilegios
-- Tabla: receta
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(1, 'Crear receta', 'Permite registrar una nueva receta de cerveza.'),
(2, 'Consultar receta', 'Permite ver los detalles de las recetas existentes.'),
(3, 'Modificar receta', 'Permite editar la información de una receta existente.'),
(4, 'Eliminar receta', 'Permite eliminar una receta del sistema.');

-- Tabla: tipo_cerveza
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(5, 'Crear tipo_cerveza', 'Permite registrar un nuevo tipo o categoría de cerveza.'),
(6, 'Consultar tipo_cerveza', 'Permite ver la lista de tipos de cerveza.'),
(7, 'Modificar tipo_cerveza', 'Permite editar la información de un tipo de cerveza.'),
(8, 'Eliminar tipo_cerveza', 'Permite eliminar un tipo de cerveza del sistema.');

-- Tabla: caracteristica
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(9, 'Crear caracteristica', 'Permite añadir nuevas características para cervezas (ej. Amargor).'),
(10, 'Consultar caracteristica', 'Permite ver las características existentes.'),
(11, 'Modificar caracteristica', 'Permite editar una característica existente.'),
(12, 'Eliminar caracteristica', 'Permite eliminar una característica del sistema.');

-- Tabla: tipo_evento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(13, 'Crear tipo_evento', 'Permite crear un nuevo tipo de evento (ej. Cata, Festival).'),
(14, 'Consultar tipo_evento', 'Permite ver la lista de tipos de evento.'),
(15, 'Modificar tipo_evento', 'Permite editar un tipo de evento existente.'),
(16, 'Eliminar tipo_evento', 'Permite eliminar un tipo de evento del sistema.');

-- Tabla: ingrediente
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(17, 'Crear ingrediente', 'Permite registrar un nuevo ingrediente para recetas.'),
(18, 'Consultar ingrediente', 'Permite ver la lista de ingredientes disponibles.'),
(19, 'Modificar ingrediente', 'Permite editar un ingrediente existente.'),
(20, 'Eliminar ingrediente', 'Permite eliminar un ingrediente del sistema.');

-- Tabla: cargo
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(21, 'Crear cargo', 'Permite registrar un nuevo cargo para empleados.'),
(22, 'Consultar cargo', 'Permite ver la lista de cargos existentes.'),
(23, 'Modificar cargo', 'Permite editar la información de un cargo.'),
(24, 'Eliminar cargo', 'Permite eliminar un cargo del sistema.');

-- Tabla: rol
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(25, 'Crear rol', 'Permite crear un nuevo rol de usuario en el sistema.'),
(26, 'Consultar rol', 'Permite ver la lista de roles de usuario.'),
(27, 'Modificar rol', 'Permite editar el nombre de un rol.'),
(28, 'Eliminar rol', 'Permite eliminar un rol de usuario.');

-- Tabla: privilegio
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(29, 'Crear privilegio', 'Permite crear nuevos privilegios en el sistema.'),
(30, 'Consultar privilegio', 'Permite ver la lista de todos los privilegios.'),
(31, 'Modificar privilegio', 'Permite editar un privilegio existente.'),
(32, 'Eliminar privilegio', 'Permite eliminar un privilegio del sistema.');

-- Tabla: tipo_beneficio
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(33, 'Crear tipo_beneficio', 'Permite crear nuevos tipos de beneficios para empleados.'),
(34, 'Consultar tipo_beneficio', 'Permite ver los tipos de beneficios existentes.'),
(35, 'Modificar tipo_beneficio', 'Permite editar un tipo de beneficio.'),
(36, 'Eliminar tipo_beneficio', 'Permite eliminar un tipo de beneficio.');

-- Tabla: tipo_invitado
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(37, 'Crear tipo_invitado', 'Permite crear un nuevo tipo de invitado (ej. Ponente).'),
(38, 'Consultar tipo_invitado', 'Permite ver la lista de tipos de invitado.'),
(39, 'Modificar tipo_invitado', 'Permite editar un tipo de invitado existente.'),
(40, 'Eliminar tipo_invitado', 'Permite eliminar un tipo de invitado.');

-- Tabla: lugar
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(41, 'Crear lugar', 'Permite añadir nuevos lugares (estados, municipios, parroquias).'),
(42, 'Consultar lugar', 'Permite ver la estructura de lugares.'),
(43, 'Modificar lugar', 'Permite editar un lugar existente.'),
(44, 'Eliminar lugar', 'Permite eliminar un lugar del sistema.');

-- Tabla: estatus
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(45, 'Crear estatus', 'Permite definir nuevos estados para procesos (compra, venta, etc.).'),
(46, 'Consultar estatus', 'Permite ver los posibles estados del sistema.'),
(47, 'Modificar estatus', 'Permite editar un estado existente.'),
(48, 'Eliminar estatus', 'Permite eliminar un estado del sistema.');

-- Tabla: lugar_tienda
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(49, 'Crear lugar_tienda', 'Permite añadir ubicaciones en una tienda (pasillo, anaquel).'),
(50, 'Consultar lugar_tienda', 'Permite ver las ubicaciones de una tienda.'),
(51, 'Modificar lugar_tienda', 'Permite editar una ubicación de tienda.'),
(52, 'Eliminar lugar_tienda', 'Permite eliminar una ubicación de tienda.');

-- Tabla: tasa_cambio
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(53, 'Crear tasa_cambio', 'Permite registrar una nueva tasa de cambio monetaria.'),
(54, 'Consultar tasa_cambio', 'Permite ver el historial de tasas de cambio.'),
(55, 'Modificar tasa_cambio', 'Permite editar una tasa de cambio (ej. fecha fin).'),
(56, 'Eliminar tasa_cambio', 'Permite eliminar un registro de tasa de cambio.');

-- Tabla: cliente
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(57, 'Crear cliente', 'Permite registrar nuevos clientes (naturales o jurídicos).'),
(58, 'Consultar cliente', 'Permite ver la información de los clientes.'),
(59, 'Modificar cliente', 'Permite editar los datos de un cliente.'),
(60, 'Eliminar cliente', 'Permite eliminar un cliente del sistema.');

-- Tabla: empleado
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(61, 'Crear empleado', 'Permite registrar un nuevo empleado.'),
(62, 'Consultar empleado', 'Permite ver la información de los empleados.'),
(63, 'Modificar empleado', 'Permite editar los datos de un empleado.'),
(64, 'Eliminar empleado', 'Permite dar de baja a un empleado.');

-- Tabla: miembro
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(65, 'Crear miembro', 'Permite afiliar un nuevo miembro a la asociación.'),
(66, 'Consultar miembro', 'Permite ver la información de los miembros.'),
(67, 'Modificar miembro', 'Permite editar los datos de un miembro.'),
(68, 'Eliminar miembro', 'Permite desafiliar a un miembro.');

-- Tabla: usuario
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(69, 'Crear usuario', 'Permite crear una nueva cuenta de usuario.'),
(70, 'Consultar usuario', 'Permite ver la información de los usuarios.'),
(71, 'Modificar usuario', 'Permite editar los datos de un usuario (ej. cambiar rol).'),
(72, 'Eliminar usuario', 'Permite eliminar una cuenta de usuario.');

-- Tabla: metodo_de_pago
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(73, 'Crear metodo_de_pago', 'Permite registrar un método de pago para un usuario.'),
(74, 'Consultar metodo_de_pago', 'Permite ver los métodos de pago registrados.'),
(75, 'Modificar metodo_de_pago', 'Permite editar un método de pago existente.'),
(76, 'Eliminar metodo_de_pago', 'Permite eliminar un método de pago de un usuario.');

-- Tabla: horario
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(77, 'Crear horario', 'Permite definir nuevos bloques de horarios de trabajo.'),
(78, 'Consultar horario', 'Permite ver los horarios definidos.'),
(79, 'Modificar horario', 'Permite editar un horario existente.'),
(80, 'Eliminar horario', 'Permite eliminar un horario.');

-- Tabla: cerveza
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(81, 'Crear cerveza', 'Permite registrar una nueva cerveza producida por un miembro.'),
(82, 'Consultar cerveza', 'Permite ver el catálogo de cervezas.'),
(83, 'Modificar cerveza', 'Permite editar la información de una cerveza.'),
(84, 'Eliminar cerveza', 'Permite eliminar una cerveza del catálogo.');

-- Tabla: presentacion
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(85, 'Crear presentacion', 'Permite crear una nueva presentación para una cerveza (ej. botella).'),
(86, 'Consultar presentacion', 'Permite ver las presentaciones de cervezas.'),
(87, 'Modificar presentacion', 'Permite editar una presentación existente.'),
(88, 'Eliminar presentacion', 'Permite eliminar una presentación.');

-- Tabla: tienda_fisica
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(89, 'Crear tienda_fisica', 'Permite registrar una nueva tienda física.'),
(90, 'Consultar tienda_fisica', 'Permite ver la lista de tiendas físicas.'),
(91, 'Modificar tienda_fisica', 'Permite editar la información de una tienda.'),
(92, 'Eliminar tienda_fisica', 'Permite cerrar o eliminar una tienda.');

-- Tabla: departamento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(93, 'Crear departamento', 'Permite crear un nuevo departamento en una tienda física.'),
(94, 'Consultar departamento', 'Permite ver los departamentos de las tiendas.'),
(95, 'Modificar departamento', 'Permite editar la información de un departamento.'),
(96, 'Eliminar departamento', 'Permite eliminar un departamento.');

-- Tabla: tienda_online
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(97, 'Crear tienda_online', 'Permite registrar una nueva tienda online.'),
(98, 'Consultar tienda_online', 'Permite ver la lista de tiendas online.'),
(99, 'Modificar tienda_online', 'Permite editar la información de una tienda online.'),
(100, 'Eliminar tienda_online', 'Permite eliminar una tienda online.');

-- Tabla: evento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(101, 'Crear evento', 'Permite organizar y registrar un nuevo evento.'),
(102, 'Consultar evento', 'Permite ver la lista de eventos.'),
(103, 'Modificar evento', 'Permite editar la información de un evento.'),
(104, 'Eliminar evento', 'Permite cancelar o eliminar un evento.');

-- Tabla: invitado
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(105, 'Crear invitado', 'Permite registrar un invitado para un evento.'),
(106, 'Consultar invitado', 'Permite ver la lista de invitados.'),
(107, 'Modificar invitado', 'Permite editar la información de un invitado.'),
(108, 'Eliminar invitado', 'Permite eliminar un invitado.');

-- Tabla: almacen
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(109, 'Crear almacen', 'Permite añadir una nueva línea de producto al almacén central.'),
(110, 'Consultar almacen', 'Permite ver el stock en el almacén central.'),
(111, 'Modificar almacen', 'Permite actualizar la cantidad de un producto en el almacén.'),
(112, 'Eliminar almacen', 'Permite eliminar una línea de producto del almacén.');

-- Tabla: persona_contacto
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(113, 'Crear persona_contacto', 'Permite añadir una persona de contacto a un cliente o miembro.'),
(114, 'Consultar persona_contacto', 'Permite ver las personas de contacto.'),
(115, 'Modificar persona_contacto', 'Permite editar los datos de una persona de contacto.'),
(116, 'Eliminar persona_contacto', 'Permite eliminar una persona de contacto.');

-- Tabla: inventario_tienda
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(117, 'Crear inventario_tienda', 'Permite añadir un producto al inventario de una tienda.'),
(118, 'Consultar inventario_tienda', 'Permite ver el inventario de una tienda física.'),
(119, 'Modificar inventario_tienda', 'Permite actualizar el stock en tienda.'),
(120, 'Eliminar inventario_tienda', 'Permite retirar un producto del inventario de tienda.');

-- Tabla: inventario_evento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(121, 'Crear inventario_evento', 'Permite asignar stock de productos a un evento.'),
(122, 'Consultar inventario_evento', 'Permite ver el inventario de un evento.'),
(123, 'Modificar inventario_evento', 'Permite ajustar las cantidades de stock en un evento.'),
(124, 'Eliminar inventario_evento', 'Permite retirar un producto del inventario de un evento.');

-- Tabla: compra
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(125, 'Crear compra', 'Permite registrar una nueva compra a un miembro.'),
(126, 'Consultar compra', 'Permite ver el historial de compras.'),
(127, 'Modificar compra', 'Permite editar los detalles de una compra.'),
(128, 'Eliminar compra', 'Permite anular o eliminar una compra.');

-- Tabla: venta_tienda_fisica
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(129, 'Crear venta_tienda_fisica', 'Permite registrar una venta en tienda física.'),
(130, 'Consultar venta_tienda_fisica', 'Permite ver el historial de ventas en tiendas.'),
(131, 'Modificar venta_tienda_fisica', 'Permite editar una venta de tienda.'),
(132, 'Eliminar venta_tienda_fisica', 'Permite anular una venta de tienda.');

-- Tabla: venta_online
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(133, 'Crear venta_online', 'Permite procesar un nuevo pedido online.'),
(134, 'Consultar venta_online', 'Permite ver el historial de ventas online.'),
(135, 'Modificar venta_online', 'Permite editar un pedido online.'),
(136, 'Eliminar venta_online', 'Permite cancelar un pedido online.');

-- Tabla: venta_evento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(137, 'Crear venta_evento', 'Permite registrar una venta de productos en un evento.'),
(138, 'Consultar venta_evento', 'Permite ver el historial de ventas en eventos.'),
(139, 'Modificar venta_evento', 'Permite editar una venta de evento.'),
(140, 'Eliminar venta_evento', 'Permite anular una venta de evento.');

-- Tabla: venta_entrada
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(141, 'Crear venta_entrada', 'Permite registrar la venta de una entrada a un evento.'),
(142, 'Consultar venta_entrada', 'Permite ver el historial de venta de entradas.'),
(143, 'Modificar venta_entrada', 'Permite editar una venta de entrada.'),
(144, 'Eliminar venta_entrada', 'Permite anular una venta de entrada.');

-- Tabla: contrato
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(145, 'Crear contrato', 'Permite generar un nuevo contrato para un empleado.'),
(146, 'Consultar contrato', 'Permite ver los contratos de los empleados.'),
(147, 'Modificar contrato', 'Permite editar los términos de un contrato.'),
(148, 'Eliminar contrato', 'Permite finalizar o eliminar un contrato.');

-- Tabla: oferta
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(149, 'Crear oferta', 'Permite crear una nueva oferta para un producto.'),
(150, 'Consultar oferta', 'Permite ver las ofertas activas e inactivas.'),
(151, 'Modificar oferta', 'Permite editar una oferta existente.'),
(152, 'Eliminar oferta', 'Permite eliminar una oferta.');

-- Tabla: detalle_compra
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(153, 'Crear detalle_compra', 'Permite añadir un item a una orden de compra.'),
(154, 'Consultar detalle_compra', 'Permite ver los items de una orden de compra.'),
(155, 'Modificar detalle_compra', 'Permite cambiar un item en una compra.'),
(156, 'Eliminar detalle_compra', 'Permite quitar un item de una orden de compra.');

-- Tabla: detalle_venta_fisica
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(157, 'Crear detalle_venta_fisica', 'Permite añadir un producto a una venta física.'),
(158, 'Consultar detalle_venta_fisica', 'Permite ver los productos de una venta física.'),
(159, 'Modificar detalle_venta_fisica', 'Permite cambiar un producto en una venta.'),
(160, 'Eliminar detalle_venta_fisica', 'Permite quitar un producto de una venta.');

-- Tabla: detalle_venta_online
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(161, 'Crear detalle_venta_online', 'Permite añadir un producto a un pedido online.'),
(162, 'Consultar detalle_venta_online', 'Permite ver los productos de un pedido online.'),
(163, 'Modificar detalle_venta_online', 'Permite cambiar un producto en un pedido.'),
(164, 'Eliminar detalle_venta_online', 'Permite quitar un producto de un pedido.');

-- Tabla: detalle_venta_evento
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(165, 'Crear detalle_venta_evento', 'Permite añadir un producto a una venta de evento.'),
(166, 'Consultar detalle_venta_evento', 'Permite ver los productos de una venta de evento.'),
(167, 'Modificar detalle_venta_evento', 'Permite cambiar un producto en una venta de evento.'),
(168, 'Eliminar detalle_venta_evento', 'Permite quitar un producto de una venta de evento.');

-- Tabla: cuota
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(169, 'Crear cuota', 'Permite generar una cuota para un miembro.'),
(170, 'Consultar cuota', 'Permite ver las cuotas de los miembros.'),
(171, 'Modificar cuota', 'Permite editar el monto o fecha de una cuota.'),
(172, 'Eliminar cuota', 'Permite anular o eliminar una cuota.');

-- Tabla: pago
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(173, 'Crear pago', 'Permite registrar un pago para una venta o cuota.'),
(174, 'Consultar pago', 'Permite ver el historial de pagos.'),
(175, 'Modificar pago', 'Permite editar un registro de pago.'),
(176, 'Eliminar pago', 'Permite anular un registro de pago.');

-- Tabla: asistencia
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(177, 'Crear asistencia', 'Permite registrar la asistencia de un cliente a un evento.'),
(178, 'Consultar asistencia', 'Permite ver los registros de asistencia a eventos.'),
(179, 'Modificar asistencia', 'Permite editar un registro de asistencia.'),
(180, 'Eliminar asistencia', 'Permite eliminar un registro de asistencia.');

-- Tabla: control_entrada
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(181, 'Crear control_entrada', 'Permite registrar la entrada/salida de un empleado.'),
(182, 'Consultar control_entrada', 'Permite ver los registros de asistencia de empleados.'),
(183, 'Modificar control_entrada', 'Permite corregir un registro de entrada/salida.'),
(184, 'Eliminar control_entrada', 'Permite eliminar un registro de asistencia de empleado.');

-- Tabla: vacacion
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(185, 'Crear vacacion', 'Permite registrar vacaciones para un empleado.'),
(186, 'Consultar vacacion', 'Permite ver las vacaciones de los empleados.'),
(187, 'Modificar vacacion', 'Permite editar un período de vacaciones.'),
(188, 'Eliminar vacacion', 'Permite anular un registro de vacaciones.');

-- Tabla: reposicion
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(189, 'Crear reposicion', 'Permite ejecutar una reposición de stock a una tienda.'),
(190, 'Consultar reposicion', 'Permite ver el historial de reposiciones.'),
(191, 'Modificar reposicion', 'Permite editar un registro de reposición.'),
(192, 'Eliminar reposicion', 'Permite anular una reposición.');

-- Tabla: eve_mie (Evento - Miembro)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(193, 'Crear eve_mie', 'Permite asignar la participación de un miembro a un evento.'),
(194, 'Consultar eve_mie', 'Permite ver los miembros participantes en un evento.'),
(195, 'Modificar eve_mie', 'Permite editar la descripción de participación de un miembro.'),
(196, 'Eliminar eve_mie', 'Permite revocar la participación de un miembro en un evento.');

-- Tabla: car_tip (Caracteristica - Tipo Cerveza)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(197, 'Crear car_tip', 'Permite asignar una característica a un tipo de cerveza.'),
(198, 'Consultar car_tip', 'Permite ver las características de los tipos de cerveza.'),
(199, 'Modificar car_tip', 'Permite editar los valores de una característica para un tipo.'),
(200, 'Eliminar car_tip', 'Permite quitar una característica de un tipo de cerveza.');

-- Tabla: instruccion
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(201, 'Crear instruccion', 'Permite registrar un nuevo paso o instrucción para recetas.'),
(202, 'Consultar instruccion', 'Permite ver la lista de instrucciones.'),
(203, 'Modificar instruccion', 'Permite editar una instrucción.'),
(204, 'Eliminar instruccion', 'Permite eliminar una instrucción.');

-- Tabla: ing_rec (Ingrediente - Receta)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(205, 'Crear ing_rec', 'Permite añadir un ingrediente o instrucción a una receta.'),
(206, 'Consultar ing_rec', 'Permite ver los pasos e ingredientes de una receta.'),
(207, 'Modificar ing_rec', 'Permite editar un paso o ingrediente en una receta.'),
(208, 'Eliminar ing_rec', 'Permite quitar un paso o ingrediente de una receta.');

-- Tabla: rol_pri (Rol - Privilegio)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(209, 'Crear rol_pri', 'Permite asignar un privilegio a un rol.'),
(210, 'Consultar rol_pri', 'Permite ver las asignaciones de privilegios a roles.'),
(211, 'Modificar rol_pri', 'Permite editar una asignación (ej. cambiar fecha).'),
(212, 'Eliminar rol_pri', 'Permite revocar un privilegio de un rol.');

-- Tabla: emp_ben (Empleado - Beneficio)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(213, 'Crear emp_ben', 'Permite asignar un beneficio a un empleado.'),
(214, 'Consultar emp_ben', 'Permite ver los beneficios asignados a los empleados.'),
(215, 'Modificar emp_ben', 'Permite editar un beneficio asignado (ej. monto).'),
(216, 'Eliminar emp_ben', 'Permite revocar un beneficio de un empleado.');

-- Tabla: inv_eve (Invitado - Evento)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(217, 'Crear inv_eve', 'Permite registrar la asistencia de un invitado a un evento.'),
(218, 'Consultar inv_eve', 'Permite ver la asistencia de invitados a eventos.'),
(219, 'Modificar inv_eve', 'Permite editar los detalles de asistencia de un invitado.'),
(220, 'Eliminar inv_eve', 'Permite anular la asistencia de un invitado.');

-- Tabla: con_hor (Contrato - Horario)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(221, 'Crear con_hor', 'Permite asignar un horario a un contrato de empleado.'),
(222, 'Consultar con_hor', 'Permite ver los horarios asignados a contratos.'),
(223, 'Modificar con_hor', 'Permite cambiar el estado de un horario en un contrato.'),
(224, 'Eliminar con_hor', 'Permite quitar un horario de un contrato.');

-- Tabla: car_cer (Caracteristica - Cerveza)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(225, 'Crear car_cer', 'Permite asignar una característica a una cerveza específica.'),
(226, 'Consultar car_cer', 'Permite ver las características de cervezas individuales.'),
(227, 'Modificar car_cer', 'Permite editar el valor de una característica para una cerveza.'),
(228, 'Eliminar car_cer', 'Permite quitar una característica de una cerveza.');

-- Tabla: historico (Solo consulta)
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(229, 'Crear historico', 'Permite crear una entrada en el historial (Uso restringido).'),
(230, 'Consultar historico', 'Permite ver el historial de cambios de estado de las operaciones.'),
(231, 'Modificar historico', 'Permite modificar una entrada del historial (Uso restringido).'),
(232, 'Eliminar historico', 'Permite eliminar una entrada del historial (Uso restringido).');
-- Nota: CRUD en 'historico' debe ser manejado por el sistema/triggers, no por usuarios finales.

-- Tabla: telefono
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(233, 'Crear telefono', 'Permite añadir un número de teléfono a una entidad.'),
(234, 'Consultar telefono', 'Permite ver los números de teléfono registrados.'),
(235, 'Modificar telefono', 'Permite editar un número de teléfono.'),
(236, 'Eliminar telefono', 'Permite eliminar un número de teléfono.');

-- Tabla: correo_electronico
INSERT INTO privilegio (clave, nombre, descripcion) VALUES
(237, 'Crear correo_electronico', 'Permite añadir un correo a una entidad.'),
(238, 'Consultar correo_electronico', 'Permite ver los correos registrados.'),
(239, 'Modificar correo_electronico', 'Permite editar un correo electrónico.'),
(240, 'Eliminar correo_electronico', 'Permite eliminar un correo electrónico.');

-- Insertar roles (10 ejemplos)
INSERT INTO rol (clave, nombre) VALUES
(1, 'Administrador'),      -- Control total del sistema
(2, 'Gerencia'),           -- Acceso a nivel directivo y de negocio
(3, 'Supervisión'),        -- Acceso para supervisar operaciones y personal
(4, 'Personal Operativo'), -- Acceso para Vendedores, Repartidores, etc.
(5, 'Acceso Básico Empleado'), -- Permisos mínimos (ver su propio perfil, etc.)
(6, 'Miembro'),            -- Acceso para productores afiliados
(7, 'Cliente');  


--Insertar privilegios por roles 
--------------------------------------------------------------------------------
-- Rol 1: Administrador (Control total del sistema)
-- Tiene todos los privilegios sin excepción.
--------------------------------------------------------------------------------
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio)
SELECT NOW(), 1, clave FROM privilegio;

--------------------------------------------------------------------------------
-- Rol 2: Gerencia (Acceso a nivel directivo y de negocio)
--------------------------------------------------------------------------------
-- GESTIÓN DE PERSONAL Y ESTRUCTURA ORGANIZACIONAL
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 2, 21), (NOW(), 2, 22), (NOW(), 2, 23), (NOW(), 2, 24), -- CRUD Cargo
(NOW(), 2, 33), (NOW(), 2, 34), (NOW(), 2, 35), (NOW(), 2, 36), -- CRUD Tipo Beneficio
(NOW(), 2, 61), (NOW(), 2, 62), (NOW(), 2, 63), (NOW(), 2, 64), -- CRUD Empleado
(NOW(), 2, 77), (NOW(), 2, 78), (NOW(), 2, 79), (NOW(), 2, 80), -- CRUD Horario
(NOW(), 2, 145), (NOW(), 2, 146), (NOW(), 2, 147), (NOW(), 2, 148), -- CRUD Contrato
(NOW(), 2, 185), (NOW(), 2, 186), (NOW(), 2, 187), (NOW(), 2, 188), -- CRUD Vacacion
(NOW(), 2, 213), (NOW(), 2, 214), (NOW(), 2, 215), (NOW(), 2, 216), -- Asignar/revocar Beneficio
(NOW(), 2, 221), (NOW(), 2, 222), (NOW(), 2, 223), (NOW(), 2, 224); -- Asignar/revocar Horario

-- GESTIÓN FINANCIERA Y DE VENTAS (CONTROL TOTAL)
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 2, 53), (NOW(), 2, 54), (NOW(), 2, 55), (NOW(), 2, 56),    -- CRUD Tasa Cambio
(NOW(), 2, 125), (NOW(), 2, 126), (NOW(), 2, 127), (NOW(), 2, 128),-- CRUD Compra (a miembros)
(NOW(), 2, 130), (NOW(), 2, 134), (NOW(), 2, 138), (NOW(), 2, 142),-- Consultar todas las ventas
(NOW(), 2, 149), (NOW(), 2, 150), (NOW(), 2, 151), (NOW(), 2, 152),-- CRUD Oferta
(NOW(), 2, 169), (NOW(), 2, 170), (NOW(), 2, 171), (NOW(), 2, 172),-- CRUD Cuota (de miembros)
(NOW(), 2, 174); -- Consultar Pagos

-- GESTIÓN DE TIENDAS, EVENTOS Y OPERACIONES
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 2, 89), (NOW(), 2, 90), (NOW(), 2, 91), (NOW(), 2, 92), -- CRUD Tienda Fisica
(NOW(), 2, 93), (NOW(), 2, 94), (NOW(), 2, 95), (NOW(), 2, 96), -- CRUD Departamento
(NOW(), 2, 97), (NOW(), 2, 98), (NOW(), 2, 99), (NOW(), 2, 100),-- CRUD Tienda Online
(NOW(), 2, 101), (NOW(), 2, 102), (NOW(), 2, 103), (NOW(), 2, 104), -- CRUD Evento
(NOW(), 2, 65), (NOW(), 2, 66), (NOW(), 2, 67), (NOW(), 2, 68);    -- CRUD Miembro (afiliar/desafiliar)

-- PERMISOS DE CONSULTA GENERAL
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 2, 2), (NOW(), 2, 6), (NOW(), 2, 10), (NOW(), 2, 14), (NOW(), 2, 18),
(NOW(), 2, 58), (NOW(), 2, 70), (NOW(), 2, 82), (NOW(), 2, 86), (NOW(), 2, 110),
(NOW(), 2, 118), (NOW(), 2, 230); -- Consultar casi todo

--------------------------------------------------------------------------------
-- Rol 3: Supervisión (Gestión de operaciones diarias)
--------------------------------------------------------------------------------
-- GESTIÓN DE INVENTARIO Y STOCK (SU TAREA PRINCIPAL)
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 3, 110), -- Consultar almacen
(NOW(), 3, 111), -- Modificar almacen
(NOW(), 3, 117), -- Crear inventario_tienda
(NOW(), 3, 118), -- Consultar inventario_tienda
(NOW(), 3, 119), -- Modificar inventario_tienda
(NOW(), 3, 189), -- Crear reposicion
(NOW(), 3, 190), -- Consultar reposicion
(NOW(), 3, 191); -- Modificar reposicion

-- SUPERVISIÓN DE PERSONAL Y HORARIOS
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 3, 62),  -- Consultar empleado (su equipo)
(NOW(), 3, 78),  -- Consultar horario
(NOW(), 3, 146), -- Consultar contrato (de su equipo)
(NOW(), 3, 182), -- Consultar control_entrada
(NOW(), 3, 183), -- Modificar control_entrada (corregir fichajes)
(NOW(), 3, 221), -- Asignar horario a contrato
(NOW(), 3, 222); -- Consultar asignación de horario

-- SUPERVISIÓN DE VENTAS
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 3, 130), -- Consultar venta_tienda_fisica
(NOW(), 3, 131), -- Modificar venta_tienda_fisica (para devoluciones/correcciones)
(NOW(), 3, 134), -- Consultar venta_online
(NOW(), 3, 138), -- Consultar venta_evento
(NOW(), 3, 174); -- Consultar pago

-- CONSULTAS GENERALES PARA SU TRABAJO
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 3, 58), -- Consultar cliente
(NOW(), 3, 82), -- Consultar cerveza
(NOW(), 3, 86); -- Consultar presentacion

--------------------------------------------------------------------------------
-- Rol 4: Personal Operativo (Vendedores, Repartidores, etc.)
--------------------------------------------------------------------------------
-- PERMISOS PARA VENDEDORES
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 4, 129), -- Crear venta_tienda_fisica
(NOW(), 4, 130), -- Consultar venta_tienda_fisica (sus ventas)
(NOW(), 4, 157), -- Crear detalle_venta_fisica
(NOW(), 4, 173), -- Crear pago
(NOW(), 4, 57),  -- Crear cliente
(NOW(), 4, 58),  -- Consultar cliente
(NOW(), 4, 118), -- Consultar inventario_tienda (ver stock)
(NOW(), 4, 150); -- Consultar oferta

-- PERMISOS PARA REPARTIDORES
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 4, 134), -- Consultar venta_online (para ver entregas)
(NOW(), 4, 135), -- Modificar venta_online (actualizar estado)
(NOW(), 4, 190); -- Consultar reposicion (para saber qué mover)

-- PERMISOS BÁSICOS DE EMPLEADO (heredados)
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 4, 62),  -- Consultar empleado (su perfil)
(NOW(), 4, 181); -- Crear control_entrada (fichar)

--------------------------------------------------------------------------------
-- Rol 5: Acceso Básico Empleado (Permisos mínimos de autoservicio)
--------------------------------------------------------------------------------
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 5, 62),  -- Consultar empleado (su propio perfil)
(NOW(), 5, 63),  -- Modificar empleado (su propio perfil)
(NOW(), 5, 146), -- Consultar contrato (el suyo)
(NOW(), 5, 181), -- Crear control_entrada (fichar)
(NOW(), 5, 186), -- Consultar vacacion (las suyas)
(NOW(), 5, 222), -- Consultar con_hor (su horario)
(NOW(), 5, 234), -- Consultar telefono (el suyo)
(NOW(), 5, 235); -- Modificar telefono (el suyo)

--------------------------------------------------------------------------------
-- Rol 6: Miembro (Productor de cerveza afiliado)
--------------------------------------------------------------------------------
-- GESTIÓN DE SU PERFIL
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 6, 66),  -- Consultar miembro (su perfil)
(NOW(), 6, 67),  -- Modificar miembro (su perfil)
(NOW(), 6, 113), (NOW(), 6, 114), (NOW(), 6, 115), (NOW(), 6, 116), -- CRUD Persona Contacto
(NOW(), 6, 233), (NOW(), 6, 234), (NOW(), 6, 235), (NOW(), 6, 236), -- CRUD Telefono
(NOW(), 6, 237), (NOW(), 6, 238), (NOW(), 6, 239), (NOW(), 6, 240); -- CRUD Correo

-- GESTIÓN DE SUS PRODUCTOS
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 6, 1), (NOW(), 6, 2), (NOW(), 6, 3), (NOW(), 6, 4),      -- CRUD Receta
(NOW(), 6, 81), (NOW(), 6, 82), (NOW(), 6, 83), (NOW(), 6, 84),  -- CRUD Cerveza
(NOW(), 6, 85), (NOW(), 6, 86), (NOW(), 6, 87), (NOW(), 6, 88);  -- CRUD Presentacion

-- CONSULTA DE FINANZAS Y PARTICIPACIÓN
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 6, 126), -- Consultar compra (compras que le hacen a él)
(NOW(), 6, 170), -- Consultar cuota (sus cuotas)
(NOW(), 6, 193), -- Crear eve_mie (participar en evento)
(NOW(), 6, 194), -- Consultar eve_mie
(NOW(), 6, 196); -- Eliminar eve_mie (cancelar participación)

--------------------------------------------------------------------------------
-- Rol 7: Cliente (Usuario final que compra)
--------------------------------------------------------------------------------
-- GESTIÓN DE SU CUENTA
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 7, 58),  -- Consultar cliente (su perfil)
(NOW(), 7, 59),  -- Modificar cliente (su perfil)
(NOW(), 7, 73), (NOW(), 7, 74), (NOW(), 7, 75), (NOW(), 7, 76), -- CRUD Metodo de pago
(NOW(), 7, 233), (NOW(), 7, 234), (NOW(), 7, 235), (NOW(), 7, 236), -- CRUD Telefono
(NOW(), 7, 237), (NOW(), 7, 238), (NOW(), 7, 239), (NOW(), 7, 240); -- CRUD Correo

-- INTERACCIÓN CON LA TIENDA
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(NOW(), 7, 82),  -- Consultar cerveza
(NOW(), 7, 86),  -- Consultar presentacion
(NOW(), 7, 102), -- Consultar evento
(NOW(), 7, 150), -- Consultar oferta
(NOW(), 7, 133), -- Crear venta_online
(NOW(), 7, 134), -- Consultar venta_online (sus compras)
(NOW(), 7, 141), -- Crear venta_entrada (comprar entrada)
(NOW(), 7, 142), -- Consultar venta_entrada (sus entradas)
(NOW(), 7, 177), -- Crear asistencia (al registrarse en un evento)
(NOW(), 7, 178); -- Consultar asistencia (la suya)


INSERT INTO correo_electronico (clave, direccion_email, fk_cliente, fk_miembro, fk_persona_contacto) VALUES
(1, 'cliente1@gmail.com', 1, NULL, NULL),
(2, 'cliente2@hotmail.com', 2, NULL, NULL),
(3, 'cliente3@gmail.com', 3, NULL, NULL),
(4, 'miembro1@gmail.com', NULL, 456789012, NULL),
(5, 'miembro1@hotmail.com', NULL, 678901234, NULL),
(6, 'miembro2@gmail.com', NULL, 890123456, NULL),
(7, 'miembro3@gmail.com', NULL, 223344556, NULL),
(8, 'personacontacto1@gmail.com', NULL, NULL, 1),
(9, 'personacontacto2@gmail.com', NULL, NULL, 2),
(10, 'personacontacto3@gmail.com', NULL, NULL, 3);



-- Tabla contrato
-- Creamos un contrato para cada empleado, asignándoles cargo y departamento.
INSERT INTO contrato (clave, fecha_inicio, fecha_fin, monto_salario, fk_empleado, fk_cargo, fk_departamento) VALUES
(1,'2020-01-15', NULL, 2500, 123456789, 4, 1), -- Laura (4) es Gerente General (1) en Ventas (1) de la Sede Principal
(2,'2021-03-01', NULL, 1800, 987654321, 7, 1), -- Diego (7) es Gerente Promociones (2) en Ventas (1) de la Sede Principal
(3,'2019-06-20', NULL, 1900,  234567890, 3, 4), -- Luis (3) es Jefe de Compras (3) en Compras (4) de la Sede Principal
(4,'2022-02-10', NULL, 1600, 345678901, 2,  2), -- Ana (2) es Jefe de Despacho (4) en Despacho (2) de la Sede Principal
(5,'2022-05-01', NULL, 1500, 456789012, 5,  3), -- Javier (5) es Jefe de Entrega (5) en Entrega (3) de la Sede Principal
(6,'2023-01-20', NULL, 1400, 567890123, 10, 4),-- Valeria (10) es Analista Inventario (6) en Compras (4) de la Sede Principal
(7,'2023-08-01', NULL, 900, 678901234,7, 1),  -- Camila (8) es Vendedora (7) en Ventas (5) de Valencia
(8,'2023-09-15', NULL, 750, 789012345, 6, 5),  -- Sofía (6) es Cajera (8) en Ventas (5) de Valencia
(9,'2018-11-05', NULL, 1000,890123456,7, 1), -- Ricardo (9) fue Operador Almacén (9) en Despacho (2) [Contrato finalizado]
(10,'2023-10-01', NULL, 850, 901234567, 7, 1); -- Carlos (1) es Repartidor (10) en Entrega (3) de la Sede Principal

-- =================================================================
-- TABLAS CON DEPENDENCIAS DE SEGUNDO NIVEL
-- =================================================================

-- Contratos 1 (Laura), 2 (Diego), 4 (Ana): Horario L-V de 08:00 a 17:00 (Claves 1-5)
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(true, 1, 1), (true, 2, 1), (true, 3, 1), (true, 4, 1), (true, 5, 1), -- Laura
(true, 1, 2), (true, 2, 2), (true, 3, 2), (true, 4, 2), (true, 5, 2), -- Diego
(true, 1, 4), (true, 2, 4), (true, 3, 4), (true, 4, 4), (true, 5, 4); -- Ana

-- Contratos 3 (Luis), 6 (Valeria): Horario L-V de 09:00 a 18:00 (Claves 6-10)
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(true, 6, 3), (true, 7, 3), (true, 8, 3), (true, 9, 3), (true, 10, 3), -- Luis
(true, 6, 6), (true, 7, 6), (true, 8, 6), (true, 9, 6), (true, 10, 6); -- Valeria

-- Contratos 5 (Javier) y 7 (Camila): Horario L-S de 08:30 a 16:30 (Claves 11-16)
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(true, 11, 5), (true, 12, 5), (true, 13, 5), (true, 14, 5), (true, 15, 5), (true, 16, 5), -- Javier
(true, 11, 7), (true, 12, 7), (true, 13, 7), (true, 14, 7), (true, 15, 7), (true, 16, 7); -- Camila

-- Contrato 8 (Sofía): Horario de Fin de Semana (Claves 17-18)
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(true, 17, 8), (true, 18, 8); -- Sofía

-- Contrato 9 (Ricardo, INACTIVO): Se asigna su antiguo horario (L-V 8-5) pero como inactivo.
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(false, 1, 9), (false, 2, 9), (false, 3, 9), (false, 4, 9), (false, 5, 9); -- Ricardo

-- Contrato 10 (Carlos): Horario Nocturno L-V (Claves 19-23)
INSERT INTO con_hor (horario_activo, fk_horario, fk_contrato) VALUES
(true, 19, 10), (true, 20, 10), (true, 21, 10), (true, 22, 10), (true, 23, 10); -- Carlos
-- Tabla vacacion
-- Registramos periodos de vacaciones para algunos contratos.
INSERT INTO vacacion (fecha_inicio, fecha_fin, fk_contrato) VALUES
('2023-12-20', '2024-01-10', 1), -- Laura (Contrato 1) tomó vacaciones en diciembre/enero
('2023-07-15', '2023-07-30', 2), -- Diego (Contrato 2) tomó vacaciones en julio
('2022-08-01', '2022-08-15', 3), -- Luis (Contrato 3) tomó vacaciones en agosto
('2021-09-01', '2021-09-15', 9), -- Ricardo (Contrato 9) tomó vacaciones antes de terminar contrato
('2024-02-05', '2024-02-19', 4), -- Ana (Contrato 4) tomó vacaciones en febrero
('2024-03-01', '2024-03-15', 5), -- Javier (Contrato 5) tomó vacaciones en marzo
('2023-11-10', '2023-11-20', 1), -- Laura (Contrato 1) tomó unos días adicionales
('2023-04-03', '2023-04-17', 7), -- Camila (Contrato 7) tomó vacaciones en abril
('2024-01-02', '2024-01-16', 6), -- Valeria (Contrato 6) tomó vacaciones en enero
('2023-12-18', '2023-12-26', 8); -- Sofía (Contrato 8) tomó vacaciones en diciembre

-- =================================================================
-- INSERCIÓN DE DATOS EN LA TABLA 'control_entrada'
-- Se simulan 10 fichajes de entrada y salida basados en los contratos
-- y horarios previamente definidos.
-- =================================================================

INSERT INTO control_entrada (fecha_hora_entrada, fecha_hora_salida, fk_contrato) VALUES
-- Registro 1: Laura (Contrato 1) - Llega un poco antes y se va a su hora en un día laboral normal.
-- Su horario es de 08:00 a 17:00.
('2024-05-20 07:57:10', '2024-05-20 17:02:30', 1),

-- Registro 2: Ana (Contrato 4) - Llega un poco tarde y se va 30 minutos después de su hora.
-- Su horario es de 08:00 a 17:00.
('2024-05-20 08:10:05', '2024-05-20 17:31:00', 4),

-- Registro 3: Luis (Contrato 3) - Un día normal. Llega puntual y se va puntual.
-- Su horario es de 09:00 a 18:00.
('2024-05-21 08:59:15', '2024-05-21 18:01:00', 3),

-- Registro 4: Sofía (Contrato 8) - Trabaja un fin de semana (su horario es de 10:00 a 19:00).
-- Es importante que el fichaje sea en Sábado o Domingo para ser coherente.
('2024-05-25 09:55:00', '2024-05-25 19:05:45', 8),

-- Registro 5: Carlos (Contrato 10) - Fichaje de su turno nocturno.
-- Entra a las 22:00 de un día y sale a las 06:00 del día siguiente.
-- Su horario es de 22:00 a 06:00.
('2024-05-22 21:58:30', '2024-05-23 06:03:10', 10),

-- Registro 6: Laura (Contrato 1) - Otro día, pero se retira más temprano por una cita médica.
('2024-05-23 08:01:20', '2024-05-23 14:30:00', 1),

-- Registro 7: Ricardo (Contrato 9) - Un registro histórico de antes que su contrato finalizara.
-- Su contrato terminó el 2022-11-04. Este fichaje es de Octubre 2022.
('2022-10-17 07:58:00', '2022-10-17 17:05:00', 9),

-- Registro 8: Javier (Contrato 5) - Olvidó marcar su salida.
-- El campo fecha_hora_salida quedará como NULL.
('2024-05-24 08:28:00', NULL, 5),

-- Registro 9: Camila (Contrato 7) - Se queda haciendo horas extras un viernes.
-- Su horario es hasta las 16:30.
('2024-05-24 08:35:10', '2024-05-24 19:15:22', 7),

-- Registro 10: Valeria (Contrato 6) - Un día estándar.
-- Su horario es de 09:00 a 18:00.
('2024-05-27 09:02:50', '2024-05-27 18:00:15', 6);

INSERT INTO lugar_tienda (clave, nombre, tipo, fk_lugar_tienda) VALUES
(1, 'Tienda ACAUCAB Sede Principal', 'zona', 1); -- Clave: 1 (se autoapunta para la jerarquía)

-- Paso 2: Crear las Zonas principales, que están contenidas en la "Tienda".
-- (fk_lugar_tienda = 1)
INSERT INTO lugar_tienda (clave, nombre, tipo, fk_lugar_tienda) VALUES
(2, 'Almacén Principal', 'zona', 1),             -- Clave: 2
(3, 'Piso de Ventas', 'zona', 1);               -- Clave: 3

-- Paso 3: Crear los Pasillos dentro del Almacén Principal.
-- (fk_lugar_tienda = 2)
INSERT INTO lugar_tienda (clave, nombre, tipo, fk_lugar_tienda) VALUES
(4, 'Pasillo de Recepción de Mercancía', 'pasillo', 2), -- Clave: 4
(5, 'Pasillo de Cajas Nacionales (Stock)', 'pasillo', 2),  -- Clave: 5
(6, 'Pasillo de Barriles (Stock)', 'pasillo', 2);         -- Clave: 6

-- Paso 4: Crear los Pasillos en el Piso de Ventas.
-- (fk_lugar_tienda = 3)
INSERT INTO lugar_tienda (clave, nombre, tipo, fk_lugar_tienda) VALUES
(7, 'Pasillo de Cervezas Claras (Lager/Pilsner)', 'pasillo', 3), -- Clave: 7
(8, 'Pasillo de Cervezas Oscuras (Stout/Porter)', 'pasillo', 3), -- Clave: 8
(9, 'Pasillo de Cervezas Especiales (IPA/APA)', 'pasillo', 3),   -- Clave: 9
(10, 'Pasillo de Ofertas - DiarioDeUnaCerveza', 'pasillo', 3);    -- Clave: 10

-- Paso 5: Crear los Anaqueles dentro de los pasillos del Piso de Ventas.
-- Estos son los lugares específicos donde se realiza la reposición.
INSERT INTO lugar_tienda (clave, nombre, tipo, fk_lugar_tienda) VALUES
-- Anaqueles para el pasillo de Cervezas Claras (fk_lugar_tienda = 7)
(11, 'Anaquel Superior - Pilsner', 'anaquel', 7),   -- Clave: 11
(12, 'Anaquel Inferior - Lager', 'anaquel', 7),     -- Clave: 12

-- Anaqueles para el pasillo de Cervezas Oscuras (fk_lugar_tienda = 8)
(13, 'Anaquel Izquierdo - Stouts', 'anaquel', 8),   -- Clave: 13
(14, 'Anaquel Derecho - Porters', 'anaquel', 8),    -- Clave: 14

-- Anaquel para el pasillo de Ofertas (fk_lugar_tienda = 10)
(15, 'Exhibidor Central de Ofertas', 'anaquel', 10); -- Clave: 15

--Insertar presentacion (10 ejemplos)
INSERT INTO presentacion (EAN_13, nombre, cantidad_unidades, precio, fk_cerveza) VALUES
(7501234567890, 'Botella 330ml', 1, 200.00, 1),
(7501234567891, 'Lata 355ml', 1, 160.00, 2),
(7501234567892, 'Pack 6 Botellas 330ml', 6, 1000.00, 3),
(7501234567893, 'Botella 500ml', 1, 250.00, 4),
(7501234567894, 'Lata 473ml', 1, 500.00, 5),
(7501234567895, 'Pack 12 Latas 355ml', 12, 1000.00, 6),
(7501234567896, 'Botella 1L', 1, 600.00, 7),
(7501234567897, 'Growler 2L', 1, 900.00, 8),
(7501234567898, 'Pack 4 Latas 473ml', 4, 800.00, 9),
(7501234567899, 'Botella 750ml', 1, 1000.00, 10);

--Insertar almacen (10 ejemplos)
INSERT INTO almacen (fk_presentacion, cantidad_unidades) VALUES
(1, 15000),
(2, 12000),
(3, 30000),
(4, 18000),
(5, 19500),
(6, 16000),
(7, 24000),
(8, 15000),
(9, 20000),
(10, 23500);

--Insertar oferta (10 ejemplos)

INSERT INTO oferta (porcentaje_descuento, fecha_inicio, fecha_fin, fk_presentacion) VALUES
(10, '2025-07-01', '2025-08-01', 1),
(15, '2025-07-05', '2025-08-01', 2),
(20, '2025-07-10', '2025-08-02', 3),
(5,  '2025-07-12', '2025-08-03', 4),
(25, '2025-07-15', '2025-08-08', 5),
(30, '2025-07-20', '2025-08-08', 6),
(12, '2025-07-22', '2025-08-08', 7),
(18, '2025-07-25', '2025-08-09', 8),
(8,  '2025-07-28', '2025-08-09', 9),
(22, '2025-08-01', '2025-08-10', 10);

INSERT INTO inventario_evento (clave, fk_presentacion, fk_evento, cantidad_unidades) VALUES
(1, 1, 1, 24),  -- Evento 1 con Botella 330ml
(2, 2, 2, 12),  -- Evento 2 con Lata 355ml
(3, 3, 3, 6),   -- Evento 3 con Pack 6 Botellas 330ml
(4, 4, 4, 20),  -- Evento 4 con Botella 500ml
(5, 5, 5, 24),  -- Evento 5 con Lata 473ml
(6, 6, 6, 12),  -- Evento 6 con Pack 12 Latas 355ml
(7, 7, 7, 8),   -- Evento 7 con Botella 1L
(8, 8, 8, 4),   -- Evento 8 con Growler 2L
(9, 9, 9, 4),   -- Evento 9 con Pack 4 Latas 473ml
(10, 10, 10, 10); -- Evento 10 con Botella 750ml

INSERT INTO venta_evento (fecha, monto_total, fk_evento, fk_cliente) VALUES
('2025-06-01', 150.75, 1, 1),
('2025-06-02', 200.50, 2, 2),
('2025-06-03', 175.30, 3, 3),
('2025-06-04', 220.90, 4, 4),
('2025-06-05', 189.45, 5, 5),
('2025-06-06', 250.80, 6, 6),
('2025-06-07', 130.60, 7, 7),
('2025-06-08', 275.20, 8, 8),
('2025-06-09', 165.90, 9, 9),
('2025-06-10', 300.00, 10, 10);

INSERT INTO detalle_venta_evento (cantidad, precio_unitario, fk_venta_evento, fk_inventario_evento) VALUES
(2, 25000, 1, 1),
(1, 50000, 2, 2),
(3, 10000, 3, 3),
(1, 15000, 4, 4),
(5, 5000, 5, 5),
(2, 20000, 6, 6),
(1, 30000, 7, 7),
(4, 7500, 8, 8),
(2, 40000, 9, 9),
(3, 12000, 10, 10);

INSERT INTO compra (fecha, monto_total, fk_miembro) VALUES
('2023-01-10', 150000, 123456789),
('2023-02-15', 220000, 234567890),
('2023-03-20', 85000, 345678901),
('2023-04-05', 300000, 456789012),
('2023-05-12', 175000, 567890123),
('2023-06-01', 95000, 678901234),
('2023-07-08', 250000, 789012345),
('2023-08-22', 120000, 890123456),
('2023-09-30', 400000, 901234567),
('2023-10-14', 180000, 112233445);


INSERT INTO detalle_compra (fk_almacen, fk_compra, cantidad, precio_unitario) VALUES
(1, 1, 50, 1500),
(2, 2, 30, 2500),
(3, 3, 100, 800),
(4, 4, 20, 10000),
(5, 5, 45, 3000),
(6, 6, 70, 1200),
(7, 7, 25, 8000),
(8, 8, 60, 2000),
(9, 9, 15, 25000),
(10, 10, 80, 1000);

-- =================================================================
-- VENTAS DE EVENTOS ADICIONALES PARA EL REPORTE (JUNIO-JULIO 2025)
-- =================================================================

-- Insertar ventas de eventos adicionales en el período correcto (usando claves automáticas)
INSERT INTO venta_evento (fecha, monto_total, fk_evento, fk_cliente) VALUES
('2025-06-15', 180.25, 1, 1),
('2025-06-16', 220.75, 2, 2),
('2025-06-17', 195.50, 3, 3),
('2025-06-18', 280.00, 4, 4),
('2025-06-19', 165.80, 5, 5),
('2025-06-20', 310.45, 1, 6),
('2025-06-21', 140.30, 2, 7),
('2025-06-22', 290.90, 3, 8),
('2025-06-23', 175.60, 4, 9),
('2025-06-24', 320.75, 5, 10),
('2025-06-25', 185.40, 1, 1),
('2025-06-26', 240.20, 2, 2),
('2025-06-27', 155.90, 3, 3),
('2025-06-28', 295.30, 4, 4),
('2025-06-29', 170.85, 5, 5),
('2025-06-30', 330.50, 1, 6),
('2025-07-01', 160.75, 2, 7),
('2025-07-02', 285.20, 3, 8),
('2025-07-03', 190.45, 4, 9),
('2025-07-04', 315.80, 5, 10);

-- Insertar detalles de venta de eventos para los nuevos registros (usando las últimas claves generadas)
INSERT INTO detalle_venta_evento (cantidad, precio_unitario, fk_venta_evento, fk_inventario_evento) VALUES
(1, 18025, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-15'), 1),
(2, 11037, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-16'), 2),
(3, 6516, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-17'), 3),
(1, 28000, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-18'), 4),
(4, 4145, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-19'), 5),
(2, 15522, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-20'), 1),
(1, 14030, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-21'), 2),
(3, 9696, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-22'), 3),
(2, 8780, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-23'), 4),
(3, 10691, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-24'), 5),
(1, 18540, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-25'), 1),
(2, 12010, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-26'), 2),
(3, 5196, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-27'), 3),
(1, 29530, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-28'), 4),
(4, 4271, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-29'), 5),
(2, 16525, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-06-30'), 1),
(1, 16075, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-07-01'), 2),
(3, 9506, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-07-02'), 3),
(2, 9522, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-07-03'), 4),
(3, 10526, (SELECT MAX(clave) FROM venta_evento WHERE fecha = '2025-07-04'), 5);

INSERT INTO usuario ( username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
( 'admin', 'admin', 4, 678901234, NULL, NULL),
( 'supervisor', 'supervisor123', 2, 234567890, NULL, NULL),
( 'soporte', 'soporte123', 5, 567890123, NULL, NULL),
( 'gerente', 'gerente123', 4, 345678901, NULL, NULL),
( 'analista', 'analista123', 5, 901234567, NULL, NULL),
( 'cliente1', 'cliente123', 6, NULL, NULL, 1),
( 'miembro1', 'miembro123', 7, NULL, 234567890, NULL),
( 'empleado1', 'empleado123', 5, 123456789, NULL, NULL),
( 'repartidor1', 'repartidor123', 5, 456789012, NULL, NULL),
( 'vendedor1', 'vendedor123', 5, 789012345, NULL, NULL),
( 'cliente2', 'cliente2', 7, NULL, NULL, 2),
( 'cliente3', 'cliente3', 7, NULL, NULL, 3),
( 'cliente4', 'cliente4', 7, NULL, NULL, 4),
( 'cliente5', 'cliente5', 7, NULL, NULL, 5),
( 'cliente6', 'cliente6', 7, NULL, NULL, 6),
( 'cliente7', 'cliente7', 7, NULL, NULL, 7),
( 'cliente8', 'cliente8', 7, NULL, NULL, 8),
( 'cliente9', 'cliente9', 7, NULL, NULL, 9),
( 'cliente10', 'cliente10', 7, NULL, NULL, 10),
( 'cliente11', 'cliente11', 7, NULL, NULL, 11),
( 'cliente12', 'cliente12', 7, NULL, NULL, 12),
( 'cliente13', 'cliente13', 7, NULL, NULL, 13),
( 'cliente14', 'cliente14', 7, NULL, NULL, 14),
( 'cliente15', 'cliente15', 7, NULL, NULL, 15),
( 'cliente16', 'cliente16', 7, NULL, NULL, 16),
( 'cliente19', 'cliente19', 7, NULL, NULL, 19),
( 'cliente20', 'cliente20', 7, NULL, NULL, 20),
( 'cliente21', 'cliente21', 7, NULL, NULL, 21),
( 'cliente22', 'cliente22', 7, NULL, NULL, 22),
( 'cliente23', 'cliente23', 7, NULL, NULL, 23),
( 'cliente24', 'cliente24', 7, NULL, NULL, 24),
( 'cliente25', 'cliente25', 7, NULL, NULL, 25),
( 'cliente26', 'cliente26', 6, NULL, NULL, 26),
( 'cliente27', 'cliente27', 6, NULL, NULL, 27),
( 'cliente28', 'cliente28', 6, NULL, NULL, 28),
( 'cliente29', 'cliente29', 6, NULL, NULL, 29),
( 'cliente30', 'cliente30', 6, NULL, NULL, 30),
( 'cliente31', 'cliente31', 6, NULL, NULL, 31),
( 'cliente32', 'cliente32', 6, NULL, NULL, 32),
( 'cliente33', 'cliente33', 6, NULL, NULL, 33),
( 'cliente34', 'cliente34', 6, NULL, NULL, 34),
( 'cliente35', 'cliente35', 6, NULL, NULL, 35),
( 'cliente36', 'cliente36', 6, NULL, NULL, 36),
( 'cliente37', 'cliente37', 6, NULL, NULL, 37),
( 'cliente38', 'cliente38', 6, NULL, NULL, 38),
( 'cliente39', 'cliente39', 6, NULL, NULL, 39),
( 'cliente40', 'cliente40', 6, NULL, NULL, 40);

INSERT INTO venta_entrada (fecha, monto_total, fk_evento, fk_cliente, fk_usuario) VALUES
('2025-06-17', 50.00, 1, 1, NULL),
('2025-06-18', 75.50, 2, NULL, 1),
('2025-06-19', 120.00, 3, 2, NULL),
('2025-06-20', 30.00, 4, NULL, 2),
('2025-06-21', 90.75, 5, 3, NULL),
('2025-06-22', 60.00, 1, NULL, 3),
('2025-06-23', 150.25, 2, 4, NULL),
('2025-06-24', 45.00, 3, NULL, 4),
('2025-06-25', 80.00, 4, 5, NULL),
('2025-06-26', 100.00, 5, NULL, 5);

INSERT INTO venta_tienda_fisica (clave, fecha, total_venta, fk_tienda_fisica, fk_cliente, fk_empleado) VALUES
(1, '2025-06-17', 150.75, 1, 1, 987654321),
(2, '2025-06-17', 230.00, 1, 2, 987654321),
(3, '2025-06-18', 85.50, 1, 3, 890123456),
(4, '2025-06-18', 310.20, 1, 4, 890123456),
(5, '2025-06-19', 190.00, 1, 5, 890123456),
(6, '2025-06-19', 65.40, 1, 1, 890123456),
(7, '2025-06-20', 450.00, 1, 2, 678901234),
(8, '2025-06-20', 120.00, 1, 3, 987654321),
(9, '2025-06-21', 75.80, 1, 4, 987654321),
(10, '2025-06-21', 200.00, 1, 5, 678901234);

INSERT INTO tienda_online (clave, nombre, url_web) VALUES
(1,'Cervezas Venezuela Online', 'https://www.cervezasvenezuela.com');

-- PRIMERA PARTE: Insertar solo las ventas online (sin detalles)
INSERT INTO venta_online (clave, fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario) VALUES
(1, '2025-06-17', 250.50, 'Avenida Libertador, Edificio Sol, Apto 5A', 1013, 1, 12),
(2, '2025-06-17', 120.00, 'Calle Real de Sabana Grande, Quinta La Pradera', 1297, 1, 12),
(3, '2025-06-18', 300.75, 'Plaza Venezuela, Residencias Estudiantes, Piso 10', 470, 1, 13),
(4, '2025-06-18', 80.25, 'Urbanización El Cafetal, Callejon Miranda, Casa 12', 1004, 1, 13),
(5, '2025-06-19', 450.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local B', 548, 1, 14),
(6, '2025-06-19', 180.90, 'El Paraíso, Calle Principal, Edificio Estrella', 715, 1, 14),
(7, '2025-06-20', 95.00, 'La Candelaria, Esquina El Horno, Apartamento 3', 649, 1, 15),
(8, '2025-06-20', 350.40, 'Chacao, Avenida Principal, Centro Comercial', 1004, 1, 15),
(9, '2025-06-21', 500.00, 'Altamira, Calle Sur, Residencia El Ávila, PH', 548, 1, 16),
(10, '2025-06-21', 65.70, 'San Bernardino, Av. La Estrella, Quinta Azul', 649, 1, 16),
(11, '2025-06-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5A', 706, 1, 17),
(12, '2025-06-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5A', 706, 1, 17),
(13, '2025-06-21', 58.00, 'Calle Real de Sabana Grande, Quinta La Pradera', 706, 1, 18),
(14, '2025-06-21', 40.00, 'Calle Real de Sabana Grande, Quinta La Pradera', 706, 1, 18),
(15, '2025-06-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 4-i', 714, 1, 19),
(16, '2025-06-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 4-i', 714, 1, 19),
(17, '2025-06-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 12', 204, 1, 20),
(18, '2025-06-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 12', 204, 1, 20),
(19, '2025-06-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local B', 209, 1, 21),
(20, '2025-06-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local B', 209, 1, 21),
(21, '2025-07-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5B', 706, 1, 22),
(22, '2025-07-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5B', 706, 1, 22),
(23, '2025-07-21', 58.00, 'Calle Real de Sabana Grande, Quinta Simja', 706, 1, 23),
(24, '2025-07-21', 40.00, 'Calle Real de Sabana Grande, Quinta Simja', 706, 1, 23),
(25, '2025-07-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 1, Apto 4-i', 714, 1, 24),
(26, '2025-07-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 1, Apto 4-i', 714, 1, 24),
(27, '2025-07-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 11', 204, 1, 25),
(28, '2025-07-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 11', 204, 1, 25),
(29, '2025-07-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local A', 209, 1, 26),
(30, '2025-07-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local A', 209, 1, 26),
(31, '2025-07-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5C', 706, 1, 27),
(32, '2025-07-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5C', 706, 1, 27),
(33, '2025-08-21', 58.00, 'Calle Real de Sabana Grande, Quinta Yaheli', 706, 1, 28),
(34, '2025-08-21', 40.00, 'Calle Real de Sabana Grande, Quinta Yaheli', 706, 1, 28),
(35, '2025-08-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 5-i', 714, 1, 29),
(36, '2025-08-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 5-i', 714, 1, 29),
(37, '2025-08-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 10', 204, 1, 30),
(38, '2025-08-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 10', 204, 1, 30),
(39, '2025-08-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local C', 209, 1, 31),
(40, '2025-08-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local C', 209, 1, 31),
(41, '2025-08-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5D', 706, 1, 32),
(42, '2025-08-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5D', 706, 1, 32),
(43, '2025-08-21', 58.00, 'Calle Real de Sabana Grande, Quinta Josefina', 706, 1, 33),
(44, '2025-08-21', 40.00, 'Calle Real de Sabana Grande, Quinta Josefina', 706, 1, 33),
(45, '2025-09-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 6-i', 714, 1, 34),
(46, '2025-09-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 6-i', 714, 1, 34),
(47, '2025-09-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 9', 204, 1, 35),
(48, '2025-09-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 9', 204, 1, 35),
(49, '2025-09-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local D', 209, 1, 36),
(50, '2025-09-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local D', 209, 1, 36),
(51, '2025-09-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5E', 706, 1, 37),
(52, '2025-09-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5E', 706, 1, 37),
(53, '2025-09-21', 58.00, 'Calle Real de Sabana Grande, Quinta Horacio', 706, 1, 38),
(54, '2025-09-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 7-i', 714, 1, 39),
(55, '2025-09-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 7-i', 714, 1, 39),
(56, '2025-09-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 8', 204, 1, 40),
(57, '2025-09-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 8', 204, 1, 40),
(58, '2025-09-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local E', 209, 1, 41),
(59, '2025-09-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local E', 209, 1, 41),
(60, '2025-09-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5F', 706, 1, 42),
(61, '2025-09-20', 48.00, 'Avenida Libertador, Edificio Sol, Apto 5F', 706, 1, 42),
(62, '2025-09-21', 58.00, 'Calle Real de Sabana Grande, Quinta Isabel', 706, 1, 43),
(63, '2025-09-21', 40.00, 'Calle Real de Sabana Grande, Quinta Isabel', 706, 1, 43),
(64, '2025-09-22', 76.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 8-i', 714, 1, 44),
(65, '2025-09-22', 40.00, 'Avenida Cristobal Mendoza, Edificio STAJAK, Torre 2, Apto 8-i', 714, 1, 44),
(66, '2025-09-23', 70.00,'Urbanización El Cafetal, Callejon Miranda, Casa 7', 204, 1, 45),
(67, '2025-09-23', 50.00,'Urbanización El Cafetal, Callejon Miranda, Casa 7', 204, 1, 45),
(68, '2025-09-24', 60.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local F', 209, 1, 46),
(69, '2025-09-24', 50.00, 'Los Palos Grandes, Av. Francisco de Miranda, Local F', 209, 1, 46),
(70, '2025-09-20', 50.00, 'Avenida Libertador, Edificio Sol, Apto 5G', 706, 1, 47);

INSERT INTO inventario_tienda (clave, fk_lugar_tienda, fk_presentacion, fk_tienda_fisica, cantidad) VALUES
(1, 1, 1, 1, 150),
(2, 2, 2, 1, 200),
(3, 3, 3, 1, 80),
(4, 4, 4, 1, 120),
(5, 5, 5, 1, 250),
(6, 6, 1, 1, 90),
(7, 7, 2, 1, 180),
(8, 8, 3, 1, 70),
(9, 9, 4, 1, 300),
(10, 10, 5, 1, 110);

-- Insertar detalles de venta física usando las claves reales generadas
-- Primera venta física (clave 1)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 1, 15075, 1, 1;

-- Segunda venta física (clave 2)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 2, 11500, 2, 3;

-- Tercera venta física (clave 3)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 3, 2850, 3, 5;

-- Cuarta venta física (clave 4)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 1, 31020, 4, 2;

-- Quinta venta física (clave 5)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 2, 9500, 5, 4;

-- Sexta venta física (clave 6)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 1, 6540, 6, 6;

-- Séptima venta física (clave 7)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 3, 15000, 7, 7;

-- Octava venta física (clave 8)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 1, 12000, 8, 9;

-- Novena venta física (clave 9)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 2, 3790, 9, 8;

-- Décima venta física (clave 10)
INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
SELECT 1, 20000, 10, 10;

INSERT INTO reposicion (fk_almacen, fk_inventario_tienda, fk_usuario, cantidad, fecha) VALUES
(1, 1, 1, 50, '2025-06-10'),
(2, 3, 2, 30, '2025-06-11'),
(3, 5, 3, 100, '2025-06-12'),
(1, 2, 1, 75, '2025-06-13'),
(2, 4, 4, 40, '2025-06-14'),
(3, 6, 5, 60, '2025-06-15'),
(1, 7, 1, 25, '2025-06-16'),
(2, 9, 2, 90, '2025-06-17'),
(3, 8, 3, 35, '2025-06-17'),
(1, 10, 4, 55, '2025-06-17');

INSERT INTO tasa_cambio (moneda, monto_equivalencia, fecha_inicio, fecha_fin) VALUES
('VES', 1.00, '2024-01-01', NULL),
('USD', 36.50, '2024-01-01', '2024-01-31'),
('EUR', 39.20, '2024-01-01', '2024-01-31'),
('USD', 37.00, '2024-02-01', '2024-02-29'),
('EUR', 40.50, '2024-02-01', '2024-02-29'),
('USD', 38.10, '2024-03-01', '2024-03-31'),
('EUR', 41.80, '2024-03-01', '2024-03-31'),
('USD', 38.90, '2024-04-01', '2025-06-16'),
('EUR', 42.50, '2025-04-01',NULL ), 
('USD', 105.19, '2025-06-17', NULL); 
-- Insertar tasa de cambio para puntos (ejemplo: 1 punto = 10 Bs)
INSERT INTO tasa_cambio (moneda, monto_equivalencia, fecha_inicio) 
VALUES ('PUNTOS', 1.00, CURRENT_DATE)
ON CONFLICT DO NOTHING;

INSERT INTO metodo_de_pago (moneda, metodo_preferido, fk_cliente, valor, numero_cheque, fecha_vencimiento, banco, numero_tarjeta, tipo) VALUES
('VES', FALSE, NULL, 50000, NULL, NULL, NULL, NULL, 'Efectivo'), -- Efectivo, no preferido, sin usuario
('USD', TRUE, 1, NULL, NULL, '2027-12-31', 'Banco Mercantil', 4111222233334444, 'Tarjeta de credito'), -- Tarjeta de crédito preferida para el usuario 1
('VES', FALSE, NULL, NULL, 100000001, NULL, 'Banco de Venezuela', NULL, 'Cheque'), -- Cheque, no preferido, sin usuario
('EUR', FALSE, 2, NULL, NULL, '2026-08-30', 'BBVA Banco Provincial', 4555666677778888, 'Tarjeta de debito'), -- Tarjeta de débito, no preferida, **sin usuario** para cumplir la restricción
('VES', FALSE, NULL, NULL, NULL, NULL, NULL, NULL, 'Puntos'), -- Puntos, no preferido, sin usuario
('USD', TRUE, 3, NULL, NULL, '2028-04-15', 'Banco Exterior', 4999000011112222, 'Tarjeta de credito'), -- Tarjeta de crédito preferida para el usuario 3
('VES', FALSE, NULL, 10000, NULL, NULL, NULL, NULL, 'Efectivo'), -- Otro efectivo, no preferido, sin usuario
('VES', FALSE, NULL, NULL, 100000002, NULL, 'Banco Nacional de Crédito', NULL, 'Cheque'), -- Otro cheque, no preferido, sin usuario
('USD', FALSE, 2, NULL, NULL, '2026-11-20', 'Banesco', 5111222233334444, 'Tarjeta de debito'), -- Tarjeta de débito, no preferida, **sin usuario**
('EUR', TRUE, 5, NULL, NULL, '2029-01-01', 'BOD', 5222333344445555, 'Tarjeta de credito'); -- Tarjeta de crédito preferida para el usuario 5
-- Estos son para probar la funcionalidad de métodos favoritos en el frontend

-- Métodos favoritos para cliente ID 1 (José Francisco)
INSERT INTO metodo_de_pago (moneda, fk_cliente, metodo_preferido, numero_tarjeta, fecha_vencimiento, banco, tipo)
VALUES 
('VES', 1, TRUE, 4111111111111111, '2025-12-01', 'Banco de Venezuela', 'Tarjeta de credito'),
('VES', 1, TRUE, 5555555555554444, '2026-08-01', 'Banesco', 'Tarjeta de debito');

-- Métodos favoritos para cliente ID 2 (María Elena)
INSERT INTO metodo_de_pago (moneda, fk_cliente, metodo_preferido, numero_tarjeta, fecha_vencimiento, banco, tipo)
VALUES 
('VES', 2, TRUE, 4000000000000002, '2025-10-01', 'Mercantil', 'Tarjeta de credito');

-- Métodos favoritos para cliente ID 3 (Carlos Andrés)
INSERT INTO metodo_de_pago (moneda, fk_cliente, metodo_preferido, numero_tarjeta, fecha_vencimiento, banco, tipo)
VALUES 
('VES', 3, TRUE, 3782822463100005, '2027-03-01', 'Provincial', 'Tarjeta de credito'),
('VES', 3, TRUE, 6011000990139424, '2026-06-01', 'Bicentenario', 'Tarjeta de debito');

-- Métodos favoritos para cliente jurídico ID 4 (EMPRESA DEMO)
INSERT INTO metodo_de_pago (moneda, fk_cliente, metodo_preferido, numero_tarjeta, fecha_vencimiento, banco, tipo)
VALUES 
('VES', 4, TRUE, 4242424242424242, '2025-11-01', 'Banco Nacional de Crédito', 'Tarjeta de credito'); 
--Insertar ordenes de compra 
--Ventas online 
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 1, 1, 10, 5;

-- Segunda venta online (clave 2) 
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 2, 2, 12, 4;

-- Tercera venta online (clave 3)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 3, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 3, 1, 7, 4;

-- Cuarta venta online (clave 4)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 4, 5, 10, 4;

-- Quinta venta online (clave 5)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 5, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 5, 6, 2, 18;

-- Sexta venta online (clave 6)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 6, 2, 10, 4;

-- Séptima venta online (clave 7)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 7, 1, 14, 5;

-- Octava venta online (clave 8)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 8, 3, 10, 5;

-- Novena venta online (clave 9)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 9, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 9, 4, 10, 5;

-- Décima venta online (clave 10)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 10, 1, 10, 5;

-- Venta 11 (clave 11)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 11, 1, 10, 5;

-- Venta 12 (clave 12)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 12, 2, 12, 4;

-- Venta 13 (clave 13)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 13, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 13, 1, 7, 4;

-- Venta 14 (clave 14)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 14, 5, 10, 4;

-- Venta 15 (clave 15)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 15, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 15, 6, 2, 18;

-- Venta 16 (clave 16)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 16, 2, 10, 4;

-- Venta 17 (clave 17)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 17, 1, 14, 5;

-- Venta 18 (clave 18)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 18, 3, 10, 5;

-- Venta 19 (clave 19)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 19, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 19, 4, 10, 5;

-- Venta 20 (clave 20)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 20, 1, 10, 5;

-- Venta 21 (clave 21)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 21, 1, 10, 5;

-- Venta 22 (clave 22)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 22, 2, 12, 4;

-- Venta 23 (clave 23)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 23, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 23, 1, 7, 4;

-- Venta 24 (clave 24)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 24, 5, 10, 4;

-- Venta 25 (clave 25)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 25, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 25, 6, 2, 18;

-- Venta 26 (clave 26)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 26, 2, 10, 4;

-- Venta 27 (clave 27)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 27, 1, 14, 5;

-- Venta 28 (clave 28)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 28, 3, 10, 5;

-- Venta 29 (clave 29)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 29, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 29, 4, 10, 5;

-- Venta 30 (clave 30)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 30, 1, 10, 5;

-- Venta 31 (clave 31)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 31, 1, 10, 5;

-- Venta 32 (clave 32)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 32, 2, 12, 4;

-- Venta 33 (clave 33)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 33, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 33, 1, 7, 4;

-- Venta 34 (clave 34)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 34, 5, 10, 4;

-- Venta 35 (clave 35)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 35, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 35, 6, 2, 18;

-- Venta 36 (clave 36)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 36, 2, 10, 4;

-- Venta 37 (clave 37)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 37, 1, 14, 5;

-- Venta 38 (clave 38)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 38, 3, 10, 5;

-- Venta 39 (clave 39)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 39, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 39, 4, 10, 5;

-- Venta 40 (clave 40)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 40, 1, 10, 5;

-- Venta 41 (clave 41)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 41, 1, 10, 5;

-- Venta 42 (clave 42)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 42, 2, 12, 4;

-- Venta 43 (clave 43)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 43, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 43, 1, 7, 4;

-- Venta 44 (clave 44)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 44, 5, 10, 4;

-- Venta 45 (clave 45)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 45, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 45, 6, 2, 18;

-- Venta 46 (clave 46)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 46, 2, 10, 4;

-- Venta 47 (clave 47)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 47, 1, 14, 5;

-- Venta 48 (clave 48)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 48, 3, 10, 5;

-- Venta 49 (clave 49)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 49, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 49, 4, 10, 5;

-- Venta 50 (clave 50)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 50, 1, 10, 5;

-- Venta 51 (clave 51)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 51, 1, 10, 5;

-- Venta 52 (clave 52)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 52, 2, 12, 4;

-- Venta 53 (clave 53)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 53, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 53, 1, 7, 4;

-- Venta 54 (clave 54)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 54, 5, 10, 4;

-- Venta 55 (clave 55)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 55, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 55, 6, 2, 18;

-- Venta 56 (clave 56)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 56, 2, 10, 4;

-- Venta 57 (clave 57)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 57, 1, 14, 5;

-- Venta 58 (clave 58)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 58, 3, 10, 5;

-- Venta 59 (clave 59)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 59, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 59, 4, 10, 5;

-- Venta 60 (clave 60)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 60, 1, 10, 5;

-- Venta 61 (clave 61)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 61, 1, 10, 5;

-- Venta 62 (clave 62)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 62, 2, 12, 4;

-- Venta 63 (clave 63)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 63, 3, 3, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 63, 1, 7, 4;

-- Venta 64 (clave 64)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 64, 5, 10, 4;

-- Venta 65 (clave 65)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 65, 1, 8, 5;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 65, 6, 2, 18;

-- Venta 66 (clave 66)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 66, 2, 10, 4;

-- Venta 67 (clave 67)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 67, 1, 14, 5;

-- Venta 68 (clave 68)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 68, 3, 10, 5;

-- Venta 69 (clave 69)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 69, 8, 1, 10;
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 69, 4, 10, 5;

-- Venta 70 (clave 70)
INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
SELECT 70, 1, 10, 5;

-- SINCRONIZAR SECUENCIAS DESPUÉS DE INSERTAR DATOS CON CLAVES EXPLÍCITAS
-- Esto evita errores de clave duplicada en futuros inserts automáticos

-- Sincronizar secuencia de venta_online
SELECT setval('venta_online_clave_seq', (SELECT MAX(clave) FROM venta_online));

-- Sincronizar secuencia de venta_tienda_fisica
SELECT setval('venta_tienda_fisica_clave_seq', (SELECT MAX(clave) FROM venta_tienda_fisica));

-- Sincronizar secuencia de usuario
SELECT setval('usuario_clave_seq', (SELECT MAX(clave) FROM usuario));

-- Sincronizar secuencia de detalle_venta_online
SELECT setval('detalle_venta_online_clave_seq', (SELECT MAX(clave) FROM detalle_venta_online));

-- Sincronizar secuencia de detalle_venta_fisica
SELECT setval('detalle_venta_fisica_clave_seq', (SELECT MAX(clave) FROM detalle_venta_fisica));

-- =================================================================
-- VENTAS DE ENTRADAS ADICIONALES PARA EL REPORTE (JUNIO-JULIO 2025)
-- =================================================================

-- Insertar ventas de entradas adicionales en el período correcto
INSERT INTO venta_entrada (fecha, monto_total, fk_evento, fk_cliente, fk_usuario) VALUES
('2025-06-15', 45.00, 1, 1, NULL),
('2025-06-16', 60.00, 2, NULL, 1),
('2025-06-17', 85.50, 3, 2, NULL),
('2025-06-18', 35.00, 4, NULL, 2),
('2025-06-19', 70.25, 5, 3, NULL),
('2025-06-20', 55.00, 1, NULL, 3),
('2025-06-21', 95.75, 2, 4, NULL),
('2025-06-22', 40.00, 3, NULL, 4),
('2025-06-23', 65.50, 4, 5, NULL),
('2025-06-24', 80.00, 5, NULL, 5),
('2025-06-25', 50.00, 1, 1, NULL),
('2025-06-26', 75.25, 2, NULL, 1),
('2025-06-27', 90.00, 3, 2, NULL),
('2025-06-28', 30.00, 4, NULL, 2),
('2025-06-29', 65.75, 5, 3, NULL),
('2025-06-30', 55.50, 1, NULL, 3),
('2025-07-01', 85.00, 2, 4, NULL),
('2025-07-02', 45.25, 3, NULL, 4),
('2025-07-03', 70.00, 4, 5, NULL),
('2025-07-04', 95.50, 5, NULL, 5);

/** Inserts de usuarios de prueba para testing del sistema de login */



-- Asignar privilegios a roles
-- Administrador tiene todos los privilegios
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(CURRENT_DATE, 1, 1), -- ver_reportes
(CURRENT_DATE, 1, 2), -- gestionar_usuarios
(CURRENT_DATE, 1, 3), -- gestionar_inventario
(CURRENT_DATE, 1, 4), -- configurar_sistema
(CURRENT_DATE, 1, 5), -- procesar_ventas
(CURRENT_DATE, 1, 6); -- gestionar_clientes

-- Vendedor solo puede procesar ventas y ver algunos reportes
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(CURRENT_DATE, 2, 1), -- ver_reportes
(CURRENT_DATE, 2, 5), -- procesar_ventas
(CURRENT_DATE, 2, 6); -- gestionar_clientes

-- Supervisor puede todo excepto configurar sistema
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(CURRENT_DATE, 3, 1), -- ver_reportes
(CURRENT_DATE, 3, 2), -- gestionar_usuarios
(CURRENT_DATE, 3, 3), -- gestionar_inventario
(CURRENT_DATE, 3, 5), -- procesar_ventas
(CURRENT_DATE, 3, 6); -- gestionar_clientes

-- Cliente Admin solo puede ver reportes básicos
INSERT INTO rol_pri (fecha, fk_rol, fk_privilegio) VALUES
(CURRENT_DATE, 4, 1); -- ver_reportes

-- Insertar empleados de prueba
INSERT INTO empleado (ci, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, descripcion) VALUES
(12345678, 'Juan', 'Carlos', 'Pérez', 'González', '1985-03-15', 'Administrador del sistema'),
(87654321, 'María', 'Elena', 'Rodríguez', 'López', '1990-07-22', 'Vendedora principal'),
(11223344, 'Pedro', 'Antonio', 'Martínez', 'Silva', '1988-11-10', 'Supervisor de tienda');

-- Insertar usuarios de prueba
-- Usuario administrador (empleado)
INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
('admin', 'admin123', 1, 12345678, NULL, NULL);

-- Usuario vendedor (empleado)
INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
('vendedor', 'vend123', 2, 87654321, NULL, NULL);

-- Usuario supervisor (empleado)
INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
('supervisor', 'super123', 3, 11223344, NULL, NULL);

-- Usuario cliente
INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente) VALUES
('cliente', '123', 7, NULL, NULL, 1);

-- Insertar contratos para los empleados (necesario para obtener cargo y departamento)
INSERT INTO contrato (clave, fecha_inicio, fecha_fin, monto_salario, fk_empleado, fk_cargo, fk_departamento) VALUES
(11, CURRENT_DATE - INTERVAL '1 year', NULL, 50000, 12345678, 1, 1), -- admin
(12, CURRENT_DATE - INTERVAL '6 months', NULL, 35000, 87654321, 2, 2), -- vendedor
(13, CURRENT_DATE - INTERVAL '8 months', NULL, 45000, 11223344, 3, 2); -- supervisor

/** 
CREDENCIALES DE PRUEBA:

1. Administrador:
   - Usuario: admin
   - Contraseña: admin123
   - Permisos: Todos

2. Vendedor:
   - Usuario: vendedor
   - Contraseña: vend123
   - Permisos: Ver reportes, procesar ventas, gestionar clientes

3. Supervisor:
   - Usuario: supervisor
   - Contraseña: super123
   - Permisos: Todos excepto configurar sistema

4. Cliente:
   - Usuario: cliente
   - Contraseña: cliente123
   - Permisos: Solo ver reportes básicos
*/ 

-- =====================================================
-- ASIGNACIÓN DE PRIVILEGIOS A ROLES - SISTEMA ACAUCAB  
-- =====================================================
-- Basado en permisos atómicos básicos por tabla

-- =====================================================
-- ROL: ADMINISTRADOR (Todos los privilegios)
-- =====================================================

-- Privilegios de gestión de productos y recetas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear receta', 'consultar receta', 'modificar receta', 'eliminar receta',
    'crear tipo cerveza', 'consultar tipo cerveza', 'modificar tipo cerveza', 'eliminar tipo cerveza',
    'crear caracteristica', 'consultar caracteristica', 'modificar caracteristica', 'eliminar caracteristica',
    'crear ingrediente', 'consultar ingrediente', 'modificar ingrediente', 'eliminar ingrediente',
    'crear cerveza', 'consultar cerveza', 'modificar cerveza', 'eliminar cerveza',
    'crear presentacion', 'consultar presentacion', 'modificar presentacion', 'eliminar presentacion'
);

-- Privilegios de gestión de personas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear cliente', 'consultar cliente', 'modificar cliente', 'eliminar cliente',
    'crear empleado', 'consultar empleado', 'modificar empleado', 'eliminar empleado',
    'crear miembro', 'consultar miembro', 'modificar miembro', 'eliminar miembro'
);

-- Privilegios de gestión de usuarios y seguridad
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear usuario', 'consultar usuario', 'modificar usuario', 'eliminar usuario',
    'crear rol', 'consultar rol', 'modificar rol', 'eliminar rol',
    'crear privilegio', 'consultar privilegio', 'modificar privilegio', 'eliminar privilegio'
);

-- Privilegios de gestión de ventas y compras
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear compra', 'consultar compra', 'modificar compra', 'eliminar compra',
    'crear venta tienda fisica', 'consultar venta tienda fisica', 'modificar venta tienda fisica', 'eliminar venta tienda fisica',
    'crear venta online', 'consultar venta online', 'modificar venta online', 'eliminar venta online',
    'crear venta evento', 'consultar venta evento', 'modificar venta evento', 'eliminar venta evento'
);

-- Privilegios de gestión de inventario
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear inventario', 'consultar inventario', 'modificar inventario', 'eliminar inventario',
    'crear almacen', 'consultar almacen', 'modificar almacen', 'eliminar almacen',
    'crear reposicion', 'consultar reposicion', 'modificar reposicion', 'eliminar reposicion'
);

-- Privilegios de gestión de eventos y ofertas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 1, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear evento', 'consultar evento', 'modificar evento', 'eliminar evento',
    'crear pago', 'consultar pago', 'modificar pago', 'eliminar pago',
    'crear oferta', 'consultar oferta', 'modificar oferta', 'eliminar oferta'
);

-- =====================================================
-- ROL: SUPERVISOR (Privilegios de supervisión)
-- =====================================================

-- Privilegios de consulta y modificación de productos
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar receta', 'modificar receta',
    'consultar tipo cerveza', 'modificar tipo cerveza',
    'consultar caracteristica', 'modificar caracteristica',
    'consultar ingrediente', 'modificar ingrediente',
    'consultar cerveza', 'modificar cerveza',
    'consultar presentacion', 'modificar presentacion'
);

-- Privilegios de gestión de clientes
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear cliente', 'consultar cliente', 'modificar cliente',
    'consultar empleado', 'consultar miembro'
);

-- Privilegios de gestión de ventas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear venta tienda fisica', 'consultar venta tienda fisica', 'modificar venta tienda fisica',
    'crear venta online', 'consultar venta online', 'modificar venta online',
    'crear venta evento', 'consultar venta evento', 'modificar venta evento'
);

-- Privilegios de gestión de inventario y reposiciones
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar inventario', 'modificar inventario',
    'consultar almacen', 'modificar almacen',
    'crear reposicion', 'consultar reposicion', 'modificar reposicion'
);

-- Privilegios de gestión de compras y pagos
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear compra', 'consultar compra', 'modificar compra',
    'crear pago', 'consultar pago', 'modificar pago'
);

-- Privilegios de gestión de eventos y ofertas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 2, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar evento', 'modificar evento',
    'crear oferta', 'consultar oferta', 'modificar oferta'
);

-- =====================================================
-- ROL: VENDEDOR (Privilegios básicos de venta)
-- =====================================================

-- Privilegios de consulta de productos
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar receta', 'consultar tipo cerveza', 'consultar caracteristica',
    'consultar ingrediente', 'consultar cerveza', 'consultar presentacion'
);

-- Privilegios de gestión básica de clientes
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear cliente', 'consultar cliente', 'modificar cliente'
);

-- Privilegios de ventas básicas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear venta tienda fisica', 'consultar venta tienda fisica',
    'crear venta evento', 'consultar venta evento'
);

-- Privilegios de consulta de inventario
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar inventario', 'consultar almacen'
);

-- Privilegios de gestión de pagos
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear pago', 'consultar pago'
);

-- Privilegios de consulta de ofertas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 3, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar oferta', 'consultar evento'
);

-- =====================================================
-- ROL: CLIENTE ADMIN (Privilegios limitados de consulta)
-- =====================================================

-- Privilegios básicos de consulta
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 4, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar cerveza', 'consultar presentacion', 'consultar tipo cerveza',
    'consultar caracteristica', 'consultar oferta', 'consultar evento'
);

-- Privilegios de gestión de su propio perfil
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 4, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar cliente', 'modificar cliente'
);

-- Privilegios de consulta de sus propias ventas
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 4, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar venta online', 'consultar pago'
);

-- =====================================================
-- ROL: JEFE DE PASILLO (Gestión específica de reposiciones)
-- =====================================================

-- Privilegios para gestión de reposiciones
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 8, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'crear reposicion', 'consultar reposicion', 'modificar reposicion',
    'consultar inventario', 'consultar almacen'
);

-- Privilegios básicos de empleado
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 8, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar empleado', 'modificar empleado', 'consultar contrato',
    'crear control_entrada', 'consultar vacacion'
);

-- Privilegios para ver información de productos
INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) 
SELECT 8, p.clave, CURRENT_DATE FROM privilegio p WHERE p.nombre IN (
    'consultar cerveza', 'consultar presentacion', 'consultar tipo cerveza'
);

-- Comentario informativo sobre la lógica de permisos especiales:
-- Los permisos especiales se derivan automáticamente en el backend basándose en combinaciones de permisos atómicos:
-- 
-- - 'ver dashboard admin': Se otorga si tiene 'consultar usuario' O 'consultar rol'
-- - 'gestionar estados reposicion': Se otorga si tiene 'consultar reposicion' Y 'modificar reposicion'  
-- - 'gestionar estados compra': Se otorga si tiene 'consultar compra' Y 'modificar compra'
-- - 'gestionar estados venta online': Se otorga si tiene 'consultar venta online' Y 'modificar venta online'
-- - 'gestionar roles privilegios': Se otorga si tiene 'consultar rol' Y 'modificar rol' Y 'consultar privilegio'
-- - 'ver reportes ventas': Se otorga si tiene cualquier 'consultar venta...'
-- - 'ver reportes inventario': Se otorga si tiene 'consultar inventario' O 'consultar almacen' 

-- ========= INSERTS PARA ESTATUS DE COMPRAS DE MERCANCÍA =========
-- Estados permitidos por el trigger: procesando, listo para entrega, entregado
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (1, 'procesando', 'compra');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (2, 'listo para entrega', 'compra');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (3, 'entregado', 'compra');

-- ========= INSERTS PARA ESTATUS DE CUOTAS DE AFILIACIÓN =========
-- Estados permitidos por el trigger: por pagar, pagado, vencido
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (4, 'por pagar', 'cuota');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (5, 'pagado', 'cuota');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (6, 'vencido', 'cuota');

-- ========= INSERTS PARA ESTATUS DE VENTAS ONLINE =========
-- Estados permitidos por el trigger: procesando, listo para entrega, entregado
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (7, 'procesando', 'venta online');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (8, 'listo para entrega', 'venta online');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (9, 'entregado', 'venta online');

-- ========= INSERTS PARA ESTATUS DE REPOSICIÓN EN ESTANTES =========
-- Estados permitidos por el trigger: procesando, listo para entrega, entregado
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (10, 'procesando', 'reposicion');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (11, 'listo para entrega', 'reposicion');
INSERT INTO estatus (clave, estado, aplicable_a) VALUES (12, 'entregado', 'reposicion');

-- ===================================================================================
-- ACTUALIZACIÓN DE PUNTOS DE CLIENTES (ANTES DE LOS PAGOS)
-- ===================================================================================

-- Actualizar puntos de algunos clientes para permitir pagos con puntos
UPDATE cliente SET puntos_acumulados = 100 WHERE clave = 1; -- Cliente 1 ahora tiene 100 puntos
UPDATE cliente SET puntos_acumulados = 50 WHERE clave = 3;  -- Cliente 3 ahora tiene 50 puntos
UPDATE cliente SET puntos_acumulados = 25 WHERE clave = 5;  -- Cliente 5 ahora tiene 25 puntos (necesita 19 para 189.45)

-- =================================================================
-- INSERCIÓN DE DATOS EN LA TABLA 'historico'
-- Se simulan los ciclos de vida de diferentes entidades (Ventas, Compras, etc.)
-- basándose en las reglas de negocio y los estatus definidos.
-- =================================================================

-- ===================================================================================
-- BLOQUE 1: HISTORIAL COMPLETO PARA 5 VENTAS ONLINE
-- Se simula el ciclo de vida de 5 ventas, cumpliendo la regla de < 2 horas
-- para pasar de 'procesando' a 'listo para entrega'.
-- ===================================================================================

-- Historia para Venta Online con clave = 1
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-17 10:00:00', 7, 1), -- Estatus 7: procesando
('2025-06-17 11:30:15', 8, 1), -- Estatus 8: listo para entrega (dentro de las 2 horas)
('2025-06-17 16:45:00', 9, 1); -- Estatus 9: entregado

-- Historia para Venta Online con clave = 2
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-17 14:05:00', 7, 2), -- Estatus 7: procesando
('2025-06-17 15:50:00', 8, 2), -- Estatus 8: listo para entrega (dentro de las 2 horas)
('2025-06-18 11:00:00', 9, 2); -- Estatus 9: entregado al día siguiente

-- Historia para Venta Online con clave = 3
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-18 09:00:00', 7, 3), -- Estatus 7: procesando
('2025-06-18 09:45:30', 8, 3), -- Estatus 8: listo para entrega (procesamiento rápido)
('2025-06-18 15:20:00', 9, 3); -- Estatus 9: entregado

-- Historia para Venta Online con clave = 4 (Esta venta quedará 'Lista para Entrega' pero no 'Entregada')
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-18 18:10:00', 7, 4), -- Estatus 7: procesando
('2025-06-18 19:55:00', 8, 4); -- Estatus 8: listo para entrega (aún pendiente de despacho final)

-- Historia para Venta Online con clave = 5
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-19 13:00:00', 7, 5), -- Estatus 7: procesando
('2025-06-19 14:59:00', 8, 5), -- Estatus 8: listo para entrega (justo a tiempo)
('2025-06-19 19:00:00', 9, 5); -- Estatus 9: entregado al final del día

-- ===================================================================================
-- BLOQUE 2: HISTORIAL PARA 5 ÓRDENES DE COMPRA A PROVEEDORES
-- Se simula el ciclo de vida de 5 compras usando los estados correctos del trigger
-- ===================================================================================

-- Historia para Compra con clave = 1 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-01-10 10:00:00', 1, 1), -- Estatus 1: procesando
('2023-01-25 14:00:00', 2, 1), -- Estatus 2: listo para entrega
('2023-02-09 11:00:00', 3, 1); -- Estatus 3: entregado

-- Historia para Compra con clave = 2 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-02-15 11:00:00', 1, 2), -- Estatus 1: procesando
('2023-03-02 16:30:00', 2, 2), -- Estatus 2: listo para entrega
('2023-03-17 15:00:00', 3, 2); -- Estatus 3: entregado

-- Historia para Compra con clave = 3 (Quedará como 'Listo para entrega' pero pendiente de entrega)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-03-20 14:00:00', 1, 3), -- Estatus 1: procesando
('2023-04-05 12:00:00', 2, 3); -- Estatus 2: listo para entrega

-- Historia para Compra con clave = 4 (Quedará como 'Procesando')
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-04-05 15:00:00', 1, 4); -- Estatus 1: procesando

-- Historia para Compra con clave = 5 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_compra) VALUES
('2023-05-12 09:00:00', 1, 5), -- Estatus 1: procesando
('2023-05-30 11:45:00', 2, 5), -- Estatus 2: listo para entrega
('2023-06-14 14:00:00', 3, 5); -- Estatus 3: entregado

-- ===================================================================================
-- BLOQUE 3: HISTORIAL PARA 5 ÓRDENES DE REPOSICIÓN
-- Se simula el ciclo de vida de las órdenes de reposición usando los estados correctos
-- ===================================================================================

-- Historia para Reposición con clave = 1 (Ciclo completo y rápido)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-10 09:00:00', 10, 1), -- Estatus 10: procesando
('2025-06-10 09:15:00', 11, 1), -- Estatus 11: listo para entrega
('2025-06-10 10:00:00', 12, 1); -- Estatus 12: entregado

-- Historia para Reposición con clave = 2 (Ciclo completo, un poco más lento)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-11 14:00:00', 10, 2), -- Estatus 10: procesando
('2025-06-11 16:30:00', 11, 2), -- Estatus 11: listo para entrega
('2025-06-11 17:15:00', 12, 2); -- Estatus 12: entregado

-- Historia para Reposición con clave = 3 (Queda 'Listo para entrega')
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-12 08:30:00', 10, 3), -- Estatus 10: procesando
('2025-06-12 08:40:00', 11, 3); -- Estatus 11: listo para entrega

-- Historia para Reposición con clave = 4 (Queda 'Procesando', pendiente de acción)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-13 11:00:00', 10, 4); -- Estatus 10: procesando

-- Historia para Reposición con clave = 5 (Ciclo completo)
INSERT INTO historico (fecha, fk_estatus, fk_reposicion) VALUES
('2025-06-14 13:00:00', 10, 5), -- Estatus 10: procesando
('2025-06-14 13:05:00', 11, 5), -- Estatus 11: listo para entrega
('2025-06-14 13:45:00', 12, 5); -- Estatus 12: entregado

-- ===================================================================================
-- BLOQUE 4: HISTORIAL PARA 5 CUOTAS DE AFILIACIÓN
-- Se simulan diferentes escenarios de pago para las cuotas de los miembros.
-- Todas las cuotas se generan en Junio de 2025.
-- ===================================================================================

-- Historia para Cuota con clave = 1 (Pagada a tiempo)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-01 00:00:01', 4, 1), -- Estatus 4: por pagar (al momento de generarse)
('2025-06-05 10:30:00', 5, 1); -- Estatus 5: pagado (dentro del mes)

-- Historia para Cuota con clave = 2 (Pagada casi al final del mes)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-02 00:00:01', 4, 2), -- Estatus 4: por pagar
('2025-06-28 15:00:00', 5, 2); -- Estatus 5: pagado

-- Historia para Cuota con clave = 3 (Cuota que se venció)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-03 00:00:01', 4, 3), -- Estatus 4: por pagar
('2025-07-01 00:00:01', 6, 3); -- Estatus 6: vencido (al pasar al siguiente mes sin ser pagada)

-- Historia para Cuota con clave = 4 (Pagada a tiempo)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-04 00:00:01', 4, 4), -- Estatus 4: por pagar
('2025-06-10 11:45:00', 5, 4); -- Estatus 5: pagado

-- Historia para Cuota con clave = 5 (Aún está pendiente de pago)
INSERT INTO historico (fecha, fk_estatus, fk_cuota) VALUES
('2025-06-05 00:00:01', 4, 5); -- Estatus 4: por pagar (es el único estado que tiene hasta ahora)

-- ===================================================================================
-- BLOQUE 1: PAGOS PARA VENTAS ONLINE (5 registros)
-- Regla: Obligatoriamente con Tarjeta de Crédito.
-- Métodos de pago (TC): 2 (Usuario 1), 6 (Usuario 3), 10 (Usuario 5)
-- ===================================================================================

-- Pago para Venta Online 1 (Monto: 250.50, Usuario: 1)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online) VALUES
('2025-06-17', 250.50, 1, 2, 1);

-- Pago para Venta Online 3 (Monto: 300.75, Usuario: 3)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online) VALUES
('2025-06-18', 300.75, 2, 6, 3);

-- Pago para Venta Online 5 (Monto: 450.00, Usuario: 5)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online) VALUES
('2025-06-19', 450.00, 3, 10, 5);

-- Pago para Venta Online 7 (Monto: 95.00, Usuario: 7 -> usará una TC genérica si no tiene una preferida)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online) VALUES
('2025-06-20', 95.00, 4, 2, 7); -- Usando la TC del método 2 como ejemplo

-- Pago para Venta Online 9 (Monto: 500.00, Usuario: 9)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online) VALUES
('2025-06-21', 500.00, 5, 2, 9); -- Usando la TC del método 2 como ejemplo


-- ===================================================================================
-- BLOQUE 2: PAGOS PARA VENTAS EN TIENDA FÍSICA (5 registros)
-- Se usan diversos métodos de pago.
-- ===================================================================================

-- Pago para Venta Física 3 (Monto: 85.50) con Tarjeta de Débito
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-18', 85.50, 2, 4, 3); -- Método 4: Tarjeta de débito

-- Pago para Venta Física 5 (Monto: 190.00) con Cheque
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-19', 190.00, 3, 3, 5); -- Método 3: Cheque

-- Pago para Venta Física 7 (Monto: 450.00) con Efectivo (cambiado de Puntos porque el cliente no tiene suficientes puntos)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-20', 450.00, 4, 1, 7); -- Método 1: Efectivo (cambiado de 5: Puntos)

-- Pago para Venta Física 10 (Monto: 200.00) con Tarjeta de Crédito
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-21', 200.00, 5, 2, 10); -- Método 2: Tarjeta de Crédito


-- ===================================================================================
-- BLOQUE 3: PAGOS PARA CUOTAS DE AFILIACIÓN (5 registros)
-- Se vincula con el historial de cuotas pagadas y vencidas.
-- ===================================================================================

-- Pago para Cuota 1 (Monto: 500), pagada a tiempo.
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_cuota) VALUES
('2025-06-05', 500.00, 6, 2, 1); -- Coincide con la fecha del historial 'Pagada'

-- Pago para Cuota 2 (Monto: 750), pagada a tiempo.
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_cuota) VALUES
('2025-06-28', 750.00, 1, 1, 2); -- Fecha de pago de ejemplo

-- Pago para Cuota 4 (Monto: 850), pagada a tiempo.
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_cuota) VALUES
('2025-06-10', 850.00, 7, 6, 4); -- Coincide con la fecha del historial 'Pagada'

-- Pago para Cuota 6 (Monto: 700)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_cuota) VALUES
('2025-06-15', 700.00, 1, 4, 6);

-- Pago para Cuota 8 (Monto: 800)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_cuota) VALUES
('2025-06-20', 800.00, 4, 2, 8);


-- ===================================================================================
-- BLOQUE 4: PAGOS PARA VENTAS DE EVENTOS (5 registros)
-- ===================================================================================

-- Pago para Venta de Evento 1 (Monto: 150.75)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_evento) VALUES
('2025-06-01', 150.75, 6, 1, 1);

-- Pago para Venta de Evento 2 (Monto: 200.50)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_evento) VALUES
('2025-06-02', 200.50, 6, 2, 2);

-- Pago para Venta de Evento 3 (Monto: 175.30)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_evento) VALUES
('2025-06-03', 175.30, 6, 3, 3);

-- Pago para Venta de Evento 4 (Monto: 220.90)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_evento) VALUES
('2025-06-04', 220.90, 6, 4, 4);

-- Pago para Venta de Evento 5 (Monto: 189.45)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_evento) VALUES
('2025-06-05', 189.45, 6, 5, 5);


-- ===================================================================================
-- BLOQUE 5: PAGOS PARA VENTAS DE ENTRADAS (5 registros)
-- ===================================================================================

-- Pago para Venta de Entrada 1 (Monto: 50.00)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada) VALUES
('2025-06-17', 50.00, 1, 1, 1);

-- Pago para Venta de Entrada 2 (Monto: 75.50)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada) VALUES
('2025-06-18', 75.50, 2, 2, 2);

-- Pago para Venta de Entrada 3 (Monto: 120.00)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada) VALUES
('2025-06-19', 120.00, 3, 3, 3);

-- Pago para Venta de Entrada 4 (Monto: 30.00)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada) VALUES
('2025-06-20', 30.00, 4, 4, 4);

-- Pago para Venta de Entrada 5 (Monto: 90.75)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada) VALUES
('2025-06-21', 90.75, 5, 5, 5);

-- ===================================================================================
-- Historico de ventas online (CORREGIDO: usando estatus correctos para ventas online)
-- Estatus 7: procesando, Estatus 8: listo para entrega, Estatus 9: entregado
-- SOLO para ventas online que existen (del 11 al 70)
-- ===================================================================================

-- Historico para ventas online 11-70 (todas en estado 'procesando')
INSERT INTO historico (fecha, fk_estatus, fk_venta_online) VALUES
('2025-06-20 10:00:00', 7, 11), -- Estatus 7: procesando para venta online
('2025-06-20 10:00:00', 7, 12), -- Estatus 7: procesando para venta online
('2025-06-21 10:00:00', 7, 13), -- Estatus 7: procesando para venta online
('2025-06-21 10:00:00', 7, 14), -- Estatus 7: procesando para venta online
('2025-06-22 10:00:00', 7, 15), -- Estatus 7: procesando para venta online
('2025-06-22 10:00:00', 7, 16), -- Estatus 7: procesando para venta online
('2025-06-23 10:00:00', 7, 17), -- Estatus 7: procesando para venta online
('2025-06-23 10:00:00', 7, 18), -- Estatus 7: procesando para venta online
('2025-06-24 10:00:00', 7, 19), -- Estatus 7: procesando para venta online
('2025-06-24 10:00:00', 7, 20), -- Estatus 7: procesando para venta online
('2025-07-20 10:00:00', 7, 21), -- Estatus 7: procesando para venta online
('2025-07-20 10:00:00', 7, 22), -- Estatus 7: procesando para venta online
('2025-07-21 10:00:00', 7, 23), -- Estatus 7: procesando para venta online
('2025-07-21 10:00:00', 7, 24), -- Estatus 7: procesando para venta online
('2025-07-22 10:00:00', 7, 25), -- Estatus 7: procesando para venta online
('2025-07-22 10:00:00', 7, 26), -- Estatus 7: procesando para venta online
('2025-07-23 10:00:00', 7, 27), -- Estatus 7: procesando para venta online
('2025-07-23 10:00:00', 7, 28), -- Estatus 7: procesando para venta online
('2025-07-24 10:00:00', 7, 29), -- Estatus 7: procesando para venta online
('2025-07-24 10:00:00', 7, 30), -- Estatus 7: procesando para venta online
('2025-08-20 10:00:00', 7, 31), -- Estatus 7: procesando para venta online
('2025-08-20 10:00:00', 7, 32), -- Estatus 7: procesando para venta online
('2025-08-21 10:00:00', 7, 33), -- Estatus 7: procesando para venta online
('2025-08-21 10:00:00', 7, 34), -- Estatus 7: procesando para venta online
('2025-08-22 10:00:00', 7, 35), -- Estatus 7: procesando para venta online
('2025-08-22 10:00:00', 7, 36), -- Estatus 7: procesando para venta online
('2025-08-23 10:00:00', 7, 37), -- Estatus 7: procesando para venta online
('2025-08-23 10:00:00', 7, 38), -- Estatus 7: procesando para venta online
('2025-08-24 10:00:00', 7, 39), -- Estatus 7: procesando para venta online
('2025-08-24 10:00:00', 7, 40), -- Estatus 7: procesando para venta online
('2025-08-20 10:00:00', 7, 41), -- Estatus 7: procesando para venta online
('2025-08-20 10:00:00', 7, 42), -- Estatus 7: procesando para venta online
('2025-08-21 10:00:00', 7, 43), -- Estatus 7: procesando para venta online
('2025-08-21 10:00:00', 7, 44), -- Estatus 7: procesando para venta online
('2025-09-22 10:00:00', 7, 45), -- Estatus 7: procesando para venta online
('2025-09-22 10:00:00', 7, 46), -- Estatus 7: procesando para venta online
('2025-09-23 10:00:00', 7, 47), -- Estatus 7: procesando para venta online
('2025-09-23 10:00:00', 7, 48), -- Estatus 7: procesando para venta online
('2025-09-24 10:00:00', 7, 49), -- Estatus 7: procesando para venta online
('2025-09-24 10:00:00', 7, 50), -- Estatus 7: procesando para venta online
('2025-09-20 10:00:00', 7, 51), -- Estatus 7: procesando para venta online
('2025-09-20 10:00:00', 7, 52), -- Estatus 7: procesando para venta online
('2025-09-21 10:00:00', 7, 53), -- Estatus 7: procesando para venta online
('2025-09-21 10:00:00', 7, 54), -- Estatus 7: procesando para venta online
('2025-09-22 10:00:00', 7, 55), -- Estatus 7: procesando para venta online
('2025-09-22 10:00:00', 7, 56), -- Estatus 7: procesando para venta online
('2025-10-23 10:00:00', 7, 57), -- Estatus 7: procesando para venta online
('2025-10-23 10:00:00', 7, 58), -- Estatus 7: procesando para venta online
('2025-10-24 10:00:00', 7, 59), -- Estatus 7: procesando para venta online
('2025-10-24 10:00:00', 7, 60), -- Estatus 7: procesando para venta online
('2025-10-20 10:00:00', 7, 61), -- Estatus 7: procesando para venta online
('2025-10-20 10:00:00', 7, 62), -- Estatus 7: procesando para venta online
('2025-10-21 10:00:00', 7, 63), -- Estatus 7: procesando para venta online
('2025-10-21 10:00:00', 7, 64), -- Estatus 7: procesando para venta online
('2025-10-22 10:00:00', 7, 65), -- Estatus 7: procesando para venta online
('2025-10-22 10:00:00', 7, 66), -- Estatus 7: procesando para venta online
('2025-10-23 10:00:00', 7, 67), -- Estatus 7: procesando para venta online
('2025-10-23 10:00:00', 7, 68), -- Estatus 7: procesando para venta online
('2025-10-24 10:00:00', 7, 69), -- Estatus 7: procesando para venta online
('2025-10-24 10:00:00', 7, 70); -- Estatus 7: procesando para venta online

-- ===================================================================================
-- PAGOS ADICIONALES CON PUNTOS (DESPUÉS DE ACTUALIZAR PUNTOS)
-- ===================================================================================

-- Pago para Venta Física 1 (Monto: 150.75) con Puntos (cliente 1 tiene 100 puntos, suficientes para 15 puntos)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-17', 150.75, 11, 5, 1); -- Método 5: Puntos (usando tasa 11 que es PUNTOS: 10.00)

-- Pago para Venta Física 7 (Monto: 450.00) con Efectivo (cambiado de Puntos porque el cliente no tiene suficientes puntos)
INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica) VALUES
('2025-06-20', 250.00, 4, 1, 7); -- Método 1: Efectivo (cambiado de 5: Puntos)

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