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
