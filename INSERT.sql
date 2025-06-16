
-- ========= INSERCIÓN DE RECETAS =========
-- Se inserta una receta genérica para los tipos de cerveza que no tienen una receta explícita en el documento.
INSERT INTO receta (clave, nombre, descripcion) VALUES
(1, 'Receta no especificada', 'La receta para este tipo de cerveza no ha sido detallada en el documento de referencia. Generalmente incluye agua, malta de cebada, lúpulo y levadura.');

-- Se inserta la receta específica para la American Amber Ale, tal como se detalla en el documento.
INSERT INTO receta (clave, nombre, descripcion) VALUES
(2, 'Receta American Amber Ale (Todo Grano)',
'Tipo: Todo Grano. Agua: 18-19 litros. Volumen alcohólico: 5,8%. IBUS: 16.
Ingredientes:
- Malta Best Malz Pale Ale: (5kg)
- Malta Best Malz Aromatic: (0,5kg)
- Malta Best Malz Caramel Light (0,4kg)
- Lúpulo Columbus (7 gr) - Adición a los 60 min. restantes
- Lúpulo Cascade (7 gr) - Adición a los 20 min. restantes
- Lúpulo Columbus (10 gr) - Flameout (con el fuego apagado)
- Lúpulo Cascade (30 gr) - Flameout (con el fuego apagado)
- Levadura: Danstar Bry-97
Instrucciones:
1. Maceración de toda la malta durante 1 hora a 66 grados.
2. Realizar el sparging a 76 grados.
3. Ebullición de una hora, siguiendo los tiempos de adición del lúpulo indicados.
4. Fermentar a 18-20 grados.
5. Maduración en botella o en barril durante 4 semanas.');

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
(34, '�?mbar Belga', 'Ale belga de color ámbar con notas frutales y especiadas.', 16, 1),
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
(7, 'Agua', 'Agua tratada para la elaboración de cerveza, con un perfil de minerales específico.');

-- ========= INSERCIÓN DE INSTRUCCIONES GENÉRICAS REUTILIZABLES =========
-- Esta tabla funciona como un catálogo central de pasos de elaboración de cerveza.
INSERT INTO instruccion (clave, descripcion) VALUES
(1, 'Macerar granos: Mezclar las maltas molidas con agua caliente para convertir los almidones en azúcares fermentables.'),
(2, 'Lavar granos (Sparging): Enjuagar los granos con agua caliente para extraer los azúcares restantes.'),
(3, 'Adicionar lúpulo de amargor: Añadir lúpulo al inicio del hervor (aprox. 60 min) para extraer sus alfa-ácidos.'),
(4, 'Adicionar lúpulo de sabor: Añadir lúpulo hacia la mitad o final del hervor (aprox. 15-20 min) para aportar sabor.'),
(5, 'Adicionar lúpulo de aroma (Flameout): Añadir lúpulo justo al apagar el fuego para capturar los aceites aromáticos volátiles.'),
(6, 'Fermentar: Inocular la levadura en el mosto enfriado para que convierta los azúcares en alcohol y CO2.'),
(7, 'Madurar: Dejar la cerveza en reposo a bajas temperaturas para que los sabores se refinen y la cerveza se aclare.');

-- ========= INSERCIÓN DE INGREDIENTES Y PASOS PARA LA RECETA "AMERICAN AMBER ALE" (fk_receta = 2) =========
-- Se renombró la tabla a ing_rec y se añadió la fk_instruccion para vincular cada ingrediente/paso a una instrucción genérica.
-- Paso 1: Maceración
INSERT INTO ing_rec(clave, cantidad, unidad_medida, fk_receta, fk_ingrediente, fk_instruccion, numero_paso) VALUES
(1, 5.00, 'kg', 2, 1, 1, 1), -- Malta Pale Ale -> Macerar
(2, 0.50, 'kg', 2, 2, 1, 1), -- Malta Aromatic -> Macerar
(3, 0.40, 'kg', 2, 3, 1, 1); -- Malta Caramel -> Macerar

-- Paso 2: Lavado de granos (Sparging). Se usa el ingrediente 'Agua' de forma genérica para este paso.
INSERT INTO ing_rec(clave, cantidad, unidad_medida, fk_receta, fk_ingrediente, fk_instruccion, numero_paso) VALUES
(9, 10.00, 'litros', 2, 7, 2, 2);

-- Paso 3: Ebullición y adición de lúpulos
INSERT INTO ing_rec(clave, cantidad, unidad_medida, fk_receta, fk_ingrediente, fk_instruccion, numero_paso) VALUES
(4, 7.00, 'gr', 2, 4, 3, 3),  -- Columbus -> Amargor (60 min)
(5, 7.00, 'gr', 2, 5, 4, 3),  -- Cascade -> Sabor (20 min)
(6, 10.00, 'gr', 2, 4, 5, 3), -- Columbus -> Aroma (Flameout)
(7, 30.00, 'gr', 2, 5, 5, 3); -- Cascade -> Aroma (Flameout)

-- Paso 4: Fermentación
INSERT INTO ing_rec(clave, cantidad, unidad_medida, fk_receta, fk_ingrediente, fk_instruccion, numero_paso) VALUES
(8, 1.00, 'sobre', 2, 6, 6, 4); -- Levadura -> Fermentar

-- Paso 5: Maduración. Es un paso del proceso que no requiere un ingrediente específico.
INSERT INTO ing_rec(clave, cantidad, unidad_medida, fk_receta, fk_ingrediente, fk_instruccion, numero_paso) VALUES
(10, 0, 'N/A', 2, 7, 7, 5);

-- OJO METER TIEMPO EN ING CER, ARREGLAR ESO
