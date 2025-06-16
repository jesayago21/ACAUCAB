-- Esta consulta une la información de las recetas, los tipos de cerveza, los ingredientes y las instrucciones
-- para mostrar una vista detallada de cada paso de la elaboración.

SELECT
    tc.nombre AS nombre_cerveza,      -- Nombre del tipo de cerveza asociado a la receta
    r.nombre AS nombre_receta,          -- Nombre de la receta
    ir.numero_paso,                     -- Número del paso en la secuencia de la receta
    i.descripcion AS instruccion,       -- Descripción de la instrucción a realizar
    ing.nombre AS ingrediente,          -- Nombre del ingrediente a utilizar en el paso
    ir.cantidad,                        -- Cantidad del ingrediente
    ir.unidad_medida                    -- Unidad de medida para la cantidad
FROM
    ing_rec ir                          -- La tabla central que conecta todo
JOIN
    receta r ON ir.fk_receta = r.clave  -- Unimos con la tabla de recetas
JOIN
    tipo_cerveza tc ON r.clave = tc.fk_receta -- Unimos con los tipos de cerveza para obtener el nombre
JOIN
    ingrediente ing ON ir.fk_ingrediente = ing.clave -- Unimos con la tabla de ingredientes
JOIN
    instruccion i ON ir.fk_instruccion = i.clave  -- Unimos con la tabla de instrucciones
ORDER BY
    nombre_cerveza,                     -- Ordenamos por el nombre de la cerveza
    ir.numero_paso;                     -- Y luego por el número de paso para ver la secuencia
