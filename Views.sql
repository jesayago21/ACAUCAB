CREATE VIEW vista_recetas_tipo_cerveza AS
SELECT
    r.nombre AS "Nombre de la Receta",
    ir.numero_paso AS "Paso N°",
    i.descripcion AS "Instrucción del Paso",
    COALESCE(ing.nombre, 'N/A - Proceso') AS "Ingrediente Utilizado",
    ir.cantidad,
    ir.unidad_medida
FROM
    ing_rec AS ir
JOIN
    receta AS r ON ir.fk_receta = r.clave
JOIN
    instruccion AS i ON ir.fk_instruccion = i.clave
LEFT JOIN -- Usamos LEFT JOIN para incluir los pasos de proceso sin ingrediente (como maduración)
    ingrediente AS ing ON ir.fk_ingrediente = ing.clave
ORDER BY
    ir.numero_paso, ir.clave;


CREATE VIEW vista_horario_empleado AS
SELECT
    CONCAT(e.primer_nombre, ' ', e.primer_apellido) AS "Nombre del Empleado",
    c.clave AS "ID del Contrato",
    h.dia AS "Días del Horario",
    -- Usamos TO_CHAR para formatear la hora a un formato más legible
    TO_CHAR(h.fecha_hora_inicio, 'HH12:MI AM') AS "Hora de Inicio",
    TO_CHAR(h.fecha_hora_fin, 'HH12:MI AM') AS "Hora de Fin",
    CASE
        WHEN ch.horario_activo THEN 'Sí'
        ELSE 'No'
    END AS "Horario Activo en Contrato"
FROM
    con_hor AS ch
JOIN
    contrato AS c ON ch.fk_contrato = c.clave
JOIN
    empleado AS e ON c.fk_empleado = e.ci
JOIN
    horario AS h ON ch.fk_horario = h.clave
ORDER BY
    "Nombre del Empleado";



