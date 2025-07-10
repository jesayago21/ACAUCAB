-- =============================================
-- SCRIPT DE PROCEDIMIENTOS ALMACENADOS PARA ACAUCAB
-- Versión: 2.0
-- Descripción: Script idempotente para crear o reemplazar todos los
-- procedimientos y funciones del backend. Incluye sentencias DROP
-- para permitir la re-ejecución segura del script.
-- =============================================

-- =============================================
-- SECCIÓN DE DROPS INICIAL
-- Eliminamos procedimientos y funciones para permitir su recreación.
-- NOTA: El orden no es estricto aquí debido a `IF EXISTS`, pero es buena práctica.
-- =============================================

-- Auth
DROP FUNCTION IF EXISTS login_usuario(VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS obtener_permisos_por_rol(INT);
DROP FUNCTION IF EXISTS obtener_permisos_por_usuario(INT);

-- Privileges
DROP FUNCTION IF EXISTS obtener_todos_los_privilegios();
DROP FUNCTION IF EXISTS obtener_privilegio_por_id(INT);
DROP FUNCTION IF EXISTS crear_privilegio(VARCHAR, TEXT);
DROP FUNCTION IF EXISTS actualizar_privilegio(INT, VARCHAR, TEXT);
DROP FUNCTION IF EXISTS eliminar_privilegio(INT);

-- Roles
DROP FUNCTION IF EXISTS crear_rol(VARCHAR);
DROP FUNCTION IF EXISTS obtener_todos_los_roles();
DROP FUNCTION IF EXISTS obtener_rol_por_id(INT);
DROP FUNCTION IF EXISTS actualizar_rol(INT, VARCHAR);
DROP FUNCTION IF EXISTS eliminar_rol(INT);
DROP PROCEDURE IF EXISTS asignar_privilegios_a_rol(INT, INT[]);
DROP FUNCTION IF EXISTS obtener_privilegios_por_rol_id(INT);

-- Users
DROP FUNCTION IF EXISTS obtener_todos_los_usuarios();
DROP FUNCTION IF EXISTS obtener_usuario_por_id(INTEGER);
DROP FUNCTION IF EXISTS crear_usuario(VARCHAR, VARCHAR, INT, INT, INT, INT);
DROP FUNCTION IF EXISTS actualizar_usuario(INT, VARCHAR, VARCHAR, INT, INT, INT, INT);
DROP FUNCTION IF EXISTS asignar_rol_a_usuario(INT, INT);
DROP FUNCTION IF EXISTS eliminar_usuario(INT);
DROP FUNCTION IF EXISTS obtener_empleados_disponibles();
DROP FUNCTION IF EXISTS obtener_miembros_disponibles();
DROP FUNCTION IF EXISTS obtener_clientes_disponibles();

-- Clients
DROP FUNCTION IF EXISTS identificar_cliente_completo(INT);
DROP PROCEDURE IF EXISTS crear_cliente_natural(INT, INT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, INT, VARCHAR, JSON);
DROP PROCEDURE IF EXISTS crear_cliente_juridico(INT, VARCHAR, VARCHAR, VARCHAR, INT, VARCHAR, VARCHAR, INT, INT, VARCHAR, JSON);
DROP FUNCTION IF EXISTS obtener_lugares_jerarquia();
DROP FUNCTION IF EXISTS obtener_lugares_planos();
DROP FUNCTION IF EXISTS obtener_puntos_cliente(INT);
DROP FUNCTION IF EXISTS verificar_cliente_por_tipo(VARCHAR, VARCHAR);

-- Shop
DROP FUNCTION IF EXISTS obtener_productos_disponibles(INT, TEXT, TEXT, BOOLEAN, INT, INT);
DROP FUNCTION IF EXISTS obtener_metodos_pago_favoritos(INT);
DROP FUNCTION IF EXISTS obtener_tiendas_fisicas();
DROP FUNCTION IF EXISTS obtener_tasa_cambio(tipo_moneda);
DROP FUNCTION IF EXISTS crear_venta_online(INT, VARCHAR, INT, JSON, JSON);
DROP FUNCTION IF EXISTS crear_venta_fisica(INT, INT, JSON, JSON);
DROP FUNCTION IF EXISTS obtener_producto_por_ean(BIGINT, INT);
DROP FUNCTION IF EXISTS obtener_venta_completa(INT);
DROP FUNCTION IF EXISTS obtener_venta_online_completa(INT);

-- Reposiciones
DROP FUNCTION IF EXISTS obtener_todas_las_reposiciones();
DROP FUNCTION IF EXISTS obtener_reposiciones_por_tienda(INT);
DROP FUNCTION IF EXISTS obtener_reposicion_por_id(INT);
DROP FUNCTION IF EXISTS actualizar_estado_reposicion(INT, INT, TEXT);
DROP FUNCTION IF EXISTS obtener_jefes_pasillo_por_tienda(INT);
DROP FUNCTION IF EXISTS crear_reposicion_manual(INT, INT, INT, INT);
DROP FUNCTION IF EXISTS obtener_reposiciones_con_detalles();
DROP FUNCTION IF EXISTS obtener_estadisticas_reposiciones(INT);

-- =============================================
-- PROCEDIMIENTOS PARA AUTHENTICATION (authController.js)
-- =============================================

-- 1. Procedimiento para el login de usuario
CREATE OR REPLACE FUNCTION login_usuario(
    p_username VARCHAR(50),
    p_password VARCHAR(255)
)
RETURNS TABLE (
    usuario_id INT,
    username VARCHAR(50),
    fk_rol INT,
    rol_nombre VARCHAR(50),
    tipo_entidad TEXT,
    empleado_ci INT,
    empleado_primer_nombre VARCHAR(50),
    empleado_primer_apellido VARCHAR(50),
    empleado_segundo_nombre VARCHAR(50),
    empleado_segundo_apellido VARCHAR(50),
    cargo_nombre VARCHAR(50),
    departamento_nombre VARCHAR(50),
    miembro_rif INT,
    miembro_razon_social VARCHAR(50),
    cliente_id INT,
    cliente_primer_nombre VARCHAR(50),
    cliente_primer_apellido VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.clave as usuario_id,
        u.username,
        u.fk_rol,
        r.nombre as rol_nombre,
        CASE 
            WHEN u.fk_empleado IS NOT NULL THEN 'empleado' 
            WHEN u.fk_miembro IS NOT NULL THEN 'miembro'
            WHEN u.fk_cliente IS NOT NULL THEN 'cliente'
            ELSE NULL 
        END as tipo_entidad,
        e.ci as empleado_ci,
        e.primer_nombre as empleado_primer_nombre,
        e.primer_apellido as empleado_primer_apellido,
        e.segundo_nombre as empleado_segundo_nombre,
        e.segundo_apellido as empleado_segundo_apellido,
        c.nombre as cargo_nombre,
        d.nombre as departamento_nombre,
        m.rif as miembro_rif,
        m.razon_social as miembro_razon_social,
        cl.clave as cliente_id,
        cl.primer_nombre as cliente_primer_nombre,
        cl.primer_apellido as cliente_primer_apellido
    FROM usuario u
    JOIN rol r ON u.fk_rol = r.clave
    LEFT JOIN empleado e ON u.fk_empleado = e.ci
    LEFT JOIN contrato ct ON e.ci = ct.fk_empleado AND ct.fecha_fin IS NULL
    LEFT JOIN cargo c ON ct.fk_cargo = c.clave
    LEFT JOIN departamento d ON ct.fk_departamento = d.clave
    LEFT JOIN miembro m ON u.fk_miembro = m.rif
    LEFT JOIN cliente cl ON u.fk_cliente = cl.clave
    WHERE u.username = p_username AND u.contrasena = p_password;
END;
$$;

-- 2. Procedimiento para obtener permisos por rol
CREATE OR REPLACE FUNCTION obtener_permisos_por_rol(
    p_rol_id INT
)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.clave, p.nombre, p.descripcion
    FROM privilegio p
    JOIN rol_pri rp ON p.clave = rp.fk_privilegio
    WHERE rp.fk_rol = p_rol_id
    ORDER BY p.nombre;
END;
$$;

-- 3. Procedimiento para obtener permisos por usuario
CREATE OR REPLACE FUNCTION obtener_permisos_por_usuario(
    p_usuario_id INT
)
RETURNS TABLE (
    nombre VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.nombre
    FROM privilegio p
    JOIN rol_pri rp ON p.clave = rp.fk_privilegio
    JOIN usuario u ON rp.fk_rol = u.fk_rol
    WHERE u.clave = p_usuario_id;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA PRIVILEGES (privilegeController.js)
-- =============================================

-- 1. Obtener todos los privilegios
CREATE OR REPLACE FUNCTION obtener_todos_los_privilegios()
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.clave, p.nombre, p.descripcion 
    FROM privilegio p
    ORDER BY p.nombre ASC;
END;
$$;

-- 2. Obtener privilegio por ID
CREATE OR REPLACE FUNCTION obtener_privilegio_por_id(p_id INT)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.clave, p.nombre, p.descripcion 
    FROM privilegio p
    WHERE p.clave = p_id;
END;
$$;

-- 3. Crear un nuevo privilegio
CREATE OR REPLACE FUNCTION crear_privilegio(
    p_nombre VARCHAR(50),
    p_descripcion TEXT
)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO privilegio (nombre, descripcion)
    VALUES (p_nombre, p_descripcion)
    RETURNING privilegio.clave, privilegio.nombre, privilegio.descripcion;
END;
$$;

-- 4. Actualizar un privilegio
CREATE OR REPLACE FUNCTION actualizar_privilegio(
    p_id INT,
    p_nombre VARCHAR(50),
    p_descripcion TEXT
)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE privilegio 
    SET nombre = p_nombre, descripcion = p_descripcion
    WHERE clave = p_id
    RETURNING privilegio.clave, privilegio.nombre, privilegio.descripcion;
END;
$$;

-- 5. Eliminar un privilegio
CREATE OR REPLACE FUNCTION eliminar_privilegio(p_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_id INT;
BEGIN
    DELETE FROM privilegio 
    WHERE clave = p_id 
    RETURNING clave INTO deleted_id;
    RETURN deleted_id;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA ROLES (roleController.js)
-- =============================================

-- 1. Crear un nuevo rol
CREATE OR REPLACE FUNCTION crear_rol(p_nombre VARCHAR(50))
RETURNS TABLE (clave INT, nombre VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO rol (nombre) VALUES (p_nombre)
    RETURNING rol.clave, rol.nombre;
END;
$$;

-- 2. Obtener todos los roles
CREATE OR REPLACE FUNCTION obtener_todos_los_roles()
RETURNS TABLE (clave INT, nombre VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT r.clave, r.nombre FROM rol r ORDER BY r.nombre ASC;
END;
$$;

-- 3. Obtener un rol por ID
CREATE OR REPLACE FUNCTION obtener_rol_por_id(p_id INT)
RETURNS TABLE (clave INT, nombre VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT r.clave, r.nombre FROM rol r WHERE r.clave = p_id;
END;
$$;

-- 4. Actualizar un rol
CREATE OR REPLACE FUNCTION actualizar_rol(p_id INT, p_nombre VARCHAR(50))
RETURNS TABLE (clave INT, nombre VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE rol SET nombre = p_nombre WHERE clave = p_id
    RETURNING rol.clave, rol.nombre;
END;
$$;

-- 5. Eliminar un rol
CREATE OR REPLACE FUNCTION eliminar_rol(p_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_id INT;
BEGIN
    DELETE FROM rol WHERE clave = p_id
    RETURNING clave INTO deleted_id;
    RETURN deleted_id;
END;
$$;

-- 6. Asignar privilegios a un rol
CREATE OR REPLACE PROCEDURE asignar_privilegios_a_rol(
    p_rol_id INT,
    p_privilegios_ids INT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Eliminar los privilegios antiguos para este rol
    DELETE FROM rol_pri WHERE fk_rol = p_rol_id;

    -- Insertar los nuevos privilegios si el array no está vacío
    IF array_length(p_privilegios_ids, 1) > 0 THEN
        INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha)
        SELECT p_rol_id, unnest(p_privilegios_ids), CURRENT_DATE;
    END IF;
END;
$$;

-- 7. Obtener privilegios por ID de rol
CREATE OR REPLACE FUNCTION obtener_privilegios_por_rol_id(p_rol_id INT)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.clave, p.nombre, p.descripcion
    FROM privilegio p
    JOIN rol_pri rp ON p.clave = rp.fk_privilegio
    WHERE rp.fk_rol = p_rol_id
    ORDER BY p.nombre ASC;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA USUARIOS (userController.js)
-- =============================================

-- 1. Obtener todos los usuarios con sus detalles
CREATE OR REPLACE FUNCTION obtener_todos_los_usuarios()
RETURNS TABLE (
    clave INTEGER,
    username VARCHAR,
    rol_id INTEGER,
    rol_nombre VARCHAR,
    tipo_entidad TEXT,
    entidad_id BIGINT,
    nombre_completo TEXT,
    permisos JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.clave,
        u.username,
        r.clave as rol_id,
        r.nombre as rol_nombre,
        CASE 
            WHEN u.fk_empleado IS NOT NULL THEN 'empleado'
            WHEN u.fk_miembro IS NOT NULL THEN 'miembro'
            WHEN u.fk_cliente IS NOT NULL THEN 'cliente'
            ELSE 'N/A'
        END AS tipo_entidad,
        COALESCE(u.fk_empleado::BIGINT, u.fk_miembro::BIGINT, u.fk_cliente::BIGINT) as entidad_id,
        CASE 
            WHEN u.fk_empleado IS NOT NULL THEN (e.primer_nombre || ' ' || e.primer_apellido)
            WHEN u.fk_miembro IS NOT NULL THEN m.razon_social
            WHEN u.fk_cliente IS NOT NULL THEN (c.primer_nombre || ' ' || c.primer_apellido)
            ELSE 'N/A'
        END AS nombre_completo,
        (SELECT json_agg(p.nombre) 
         FROM privilegio p
         JOIN rol_pri rp ON p.clave = rp.fk_privilegio
         WHERE rp.fk_rol = u.fk_rol) AS permisos
    FROM 
        usuario u
    JOIN 
        rol r ON u.fk_rol = r.clave
    LEFT JOIN 
        empleado e ON u.fk_empleado = e.ci AND u.fk_empleado IS NOT NULL
    LEFT JOIN 
        miembro m ON u.fk_miembro = m.rif AND u.fk_miembro IS NOT NULL
    LEFT JOIN 
        cliente c ON u.fk_cliente = c.clave AND u.fk_cliente IS NOT NULL
    ORDER BY u.clave ASC;
END;
$$;

-- 2. Obtener un usuario por su ID con detalles
CREATE OR REPLACE FUNCTION obtener_usuario_por_id(p_usuario_id INTEGER)
RETURNS TABLE (
    clave INTEGER,
    username VARCHAR,
    rol_id INTEGER,
    rol_nombre VARCHAR,
    tipo_entidad TEXT,
    entidad_id BIGINT,
    nombre_completo TEXT,
    permisos JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.clave,
        u.username,
        r.clave as rol_id,
        r.nombre as rol_nombre,
        CASE 
            WHEN u.fk_empleado IS NOT NULL THEN 'empleado'
            WHEN u.fk_miembro IS NOT NULL THEN 'miembro'
            WHEN u.fk_cliente IS NOT NULL THEN 'cliente'
            ELSE 'N/A'
        END AS tipo_entidad,
        COALESCE(u.fk_empleado::BIGINT, u.fk_miembro::BIGINT, u.fk_cliente::BIGINT) as entidad_id,
        CASE 
            WHEN u.fk_empleado IS NOT NULL THEN (e.primer_nombre || ' ' || e.primer_apellido)
            WHEN u.fk_miembro IS NOT NULL THEN m.razon_social
            WHEN u.fk_cliente IS NOT NULL THEN (c.primer_nombre || ' ' || c.primer_apellido)
            ELSE 'N/A'
        END AS nombre_completo,
        (SELECT json_agg(p.nombre) 
         FROM privilegio p
         JOIN rol_pri rp ON p.clave = rp.fk_privilegio
         WHERE rp.fk_rol = u.fk_rol) AS permisos
    FROM 
        usuario u
    JOIN 
        rol r ON u.fk_rol = r.clave
    LEFT JOIN 
        empleado e ON u.fk_empleado = e.ci AND u.fk_empleado IS NOT NULL
    LEFT JOIN 
        miembro m ON u.fk_miembro = m.rif AND u.fk_miembro IS NOT NULL
    LEFT JOIN 
        cliente c ON u.fk_cliente = c.clave AND u.fk_cliente IS NOT NULL
    WHERE u.clave = p_usuario_id;
END;
$$;

-- 3. Crear un nuevo usuario
CREATE OR REPLACE FUNCTION crear_usuario(
    p_username VARCHAR(50),
    p_contrasena VARCHAR(255),
    p_fk_rol INT,
    p_fk_empleado INT,
    p_fk_miembro INT,
    p_fk_cliente INT
)
RETURNS SETOF usuario
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_contrasena IS NULL OR p_contrasena = '' THEN
        RAISE EXCEPTION 'La contraseña no puede ser nula o vacía';
    END IF;

    RETURN QUERY
    INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente)
    VALUES (p_username, p_contrasena, p_fk_rol, p_fk_empleado, p_fk_miembro, p_fk_cliente)
    RETURNING *;
END;
$$;

-- 4. Actualizar un usuario
CREATE OR REPLACE FUNCTION actualizar_usuario(
    p_clave INT,
    p_username VARCHAR(50),
    p_contrasena VARCHAR(255),
    p_fk_rol INT,
    p_fk_empleado INT,
    p_fk_miembro INT,
    p_fk_cliente INT
)
RETURNS SETOF usuario
LANGUAGE plpgsql
AS $$
DECLARE
    v_contrasena_sql TEXT;
BEGIN
    -- Si no se proporciona contraseña, no se actualiza
    v_contrasena_sql := CASE
        WHEN p_contrasena IS NOT NULL AND p_contrasena <> '' 
        THEN p_contrasena
        ELSE (SELECT contrasena FROM usuario WHERE clave = p_clave)
    END;

    RETURN QUERY
    UPDATE usuario
    SET
        username = p_username,
        contrasena = v_contrasena_sql,
        fk_rol = p_fk_rol,
        fk_empleado = p_fk_empleado,
        fk_miembro = p_fk_miembro,
        fk_cliente = p_fk_cliente
    WHERE clave = p_clave
    RETURNING *;
END;
$$;

-- 5. Asignar rol a usuario
CREATE OR REPLACE FUNCTION asignar_rol_a_usuario(
    p_user_id INT,
    p_rol_id INT
)
RETURNS SETOF usuario
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verificar que el rol existe para evitar errores de FK
    IF NOT EXISTS (SELECT 1 FROM rol WHERE clave = p_rol_id) THEN
        RAISE EXCEPTION 'El rol con ID % no existe.', p_rol_id;
    END IF;

    RETURN QUERY
    UPDATE usuario SET fk_rol = p_rol_id WHERE clave = p_user_id
    RETURNING *;
END;
$$;

-- 6. Eliminar un usuario
CREATE OR REPLACE FUNCTION eliminar_usuario(p_clave INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_id INT;
BEGIN
    DELETE FROM usuario 
    WHERE clave = p_clave 
    RETURNING clave INTO deleted_id;
    RETURN deleted_id;
END;
$$;

-- 7. Obtener empleados disponibles para ser usuarios
CREATE OR REPLACE FUNCTION obtener_empleados_disponibles()
RETURNS TABLE (
    ci INT,
    nombre_completo TEXT,
    telefono TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.ci, 
        (e.primer_nombre || ' ' || e.primer_apellido)::TEXT as nombre_completo,
        CONCAT(t.codigo, '-', t.numero)::TEXT as telefono
    FROM empleado e
    LEFT JOIN usuario u ON e.ci = u.fk_empleado
    LEFT JOIN telefono t ON e.ci = t.fk_empleado
    WHERE u.fk_empleado IS NULL
    ORDER BY e.primer_nombre, e.primer_apellido;
END;
$$;

-- 8. Obtener miembros disponibles para ser usuarios
CREATE OR REPLACE FUNCTION obtener_miembros_disponibles()
RETURNS TABLE (
    rif INT,
    razon_social VARCHAR,
    email VARCHAR,
    telefono TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.rif, 
        m.razon_social, 
        ce.direccion_email AS email,
        CONCAT(t.codigo, '-', t.numero)::TEXT AS telefono
    FROM miembro m
    LEFT JOIN usuario u ON m.rif = u.fk_miembro
    LEFT JOIN correo_electronico ce ON m.rif = ce.fk_miembro
    LEFT JOIN telefono t ON m.rif = t.fk_miembro
    WHERE u.fk_miembro IS NULL
    ORDER BY m.razon_social;
END;
$$;

-- 9. Obtener clientes disponibles para ser usuarios
CREATE OR REPLACE FUNCTION obtener_clientes_disponibles()
RETURNS TABLE (
    clave INT,
    nombre_completo TEXT,
    ci INT,
    email VARCHAR,
    telefono TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.clave, 
        (c.primer_nombre || ' ' || c.primer_apellido)::TEXT as nombre_completo,
        c.ci,
        ce.direccion_email AS email,
        CONCAT(t.codigo, '-', t.numero)::TEXT AS telefono
    FROM cliente c
    LEFT JOIN usuario u ON c.clave = u.fk_cliente
    LEFT JOIN correo_electronico ce ON c.clave = ce.fk_cliente
    LEFT JOIN telefono t ON c.clave = t.fk_cliente
    WHERE u.fk_cliente IS NULL
    ORDER BY c.primer_nombre, c.primer_apellido;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA CLIENTES (clientController.js)
-- =============================================

-- 1. Identificar cliente completo por documento (CI o RIF)
CREATE OR REPLACE FUNCTION identificar_cliente_completo(p_documento INT)
RETURNS TABLE (
    cliente_info JSON,
    contactos JSON,
    telefonos JSON,
    correos JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH cliente_base AS (
        SELECT *
        FROM cliente c
        WHERE (c.tipo = 'natural' AND (c.ci = p_documento OR c.rif = p_documento))
           OR (c.tipo = 'juridico' AND c.rif = p_documento)
        LIMIT 1
    )
    SELECT
        to_json(cb.*) as cliente_info,
        (SELECT json_agg(pc.*) FROM persona_contacto pc WHERE pc.fk_cliente = cb.clave) as contactos,
        (SELECT json_agg(t.*) FROM telefono t WHERE t.fk_cliente = cb.clave) as telefonos,
        (SELECT json_agg(ce.*) FROM correo_electronico ce WHERE ce.fk_cliente = cb.clave) as correos
    FROM cliente_base cb;
END;
$$;

-- 2. Crear cliente natural
CREATE OR REPLACE PROCEDURE crear_cliente_natural(
    p_ci INT, p_rif INT, p_primer_nombre VARCHAR(50), p_segundo_nombre VARCHAR(50),
    p_primer_apellido VARCHAR(50), p_segundo_apellido VARCHAR(50), p_direccion_habitacion VARCHAR(255),
    p_fk_lugar INT, p_correo VARCHAR(100), p_telefonos JSON
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_cliente_id INT;
    tel RECORD;
BEGIN
    INSERT INTO cliente (
        ci, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
        direccion_habitacion, fk_direccion_habitacion, tipo
    ) VALUES (
        p_ci, p_rif, p_primer_nombre, p_segundo_nombre, p_primer_apellido, p_segundo_apellido,
        p_direccion_habitacion, p_fk_lugar, 'natural'
    ) RETURNING clave INTO new_cliente_id;

    INSERT INTO correo_electronico (direccion_email, fk_cliente) VALUES (p_correo, new_cliente_id);

    FOR tel IN SELECT * FROM json_to_recordset(p_telefonos) AS x(codigo VARCHAR, numero VARCHAR)
    LOOP
        INSERT INTO telefono (codigo, numero, fk_cliente) VALUES (tel.codigo, tel.numero, new_cliente_id);
    END LOOP;
END;
$$;


-- 3. Crear cliente jurídico
CREATE OR REPLACE PROCEDURE crear_cliente_juridico(
    p_rif INT, p_razon_social VARCHAR(50), p_denominacion_comercial VARCHAR(50),
    p_url_pagina_web VARCHAR(100), p_capital_disponible INT, p_direccion_fiscal VARCHAR(255),
    p_direccion_fisica VARCHAR(255), p_fk_fiscal INT, p_fk_fisica INT,
    p_correo VARCHAR(100), p_telefonos JSON
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_cliente_id INT;
    tel RECORD;
BEGIN
    INSERT INTO cliente (
        rif, razon_social, denominacion_comercial, url_pagina_web, capital_disponible,
        direccion_fiscal, direccion_fisica, fk_direccion_fiscal, fk_direccion_fisica, tipo
    ) VALUES (
        p_rif, p_razon_social, p_denominacion_comercial, p_url_pagina_web, p_capital_disponible,
        p_direccion_fiscal, p_direccion_fisica, p_fk_fiscal, p_fk_fisica, 'juridico'
    ) RETURNING clave INTO new_cliente_id;

    INSERT INTO correo_electronico (direccion_email, fk_cliente) VALUES (p_correo, new_cliente_id);

    FOR tel IN SELECT * FROM json_to_recordset(p_telefonos) AS x(codigo VARCHAR, numero VARCHAR)
    LOOP
        INSERT INTO telefono (codigo, numero, fk_cliente) VALUES (tel.codigo, tel.numero, new_cliente_id);
    END LOOP;
END;
$$;


-- 4. Obtener todos los lugares con jerarquía
CREATE OR REPLACE FUNCTION obtener_lugares_jerarquia()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    result JSON;
BEGIN
    WITH RECURSIVE lugar_recursivo AS (
        SELECT clave, nombre, tipo, fk_lugar, 1 as nivel, CAST(nombre AS TEXT) as path
        FROM lugar
        WHERE fk_lugar IS NULL
        UNION ALL
        SELECT l.clave, l.nombre, l.tipo, l.fk_lugar, lr.nivel + 1, CAST(lr.path || ' -> ' || l.nombre AS TEXT)
        FROM lugar l
        JOIN lugar_recursivo lr ON l.fk_lugar = lr.clave
    )
    SELECT json_agg(row_to_json(lr)) INTO result
    FROM lugar_recursivo lr;
    RETURN result;
END;
$$;

-- 5. Obtener lugares sin jerarquía (planos)
CREATE OR REPLACE FUNCTION obtener_lugares_planos()
RETURNS TABLE (clave INT, nombre VARCHAR(50), tipo VARCHAR(20), fk_lugar INT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT l.clave, l.nombre, l.tipo, l.fk_lugar FROM lugar l ORDER BY l.clave;
END;
$$;

-- 6. Obtener puntos de un cliente
CREATE OR REPLACE FUNCTION obtener_puntos_cliente(p_cliente_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    puntos INT;
BEGIN
    SELECT puntos_acumulados INTO puntos FROM cliente WHERE clave = p_cliente_id;
    RETURN puntos;
END;
$$;

-- 7. Verificar existencia de cliente por tipo y documento
CREATE OR REPLACE FUNCTION verificar_cliente_por_tipo(p_tipo VARCHAR(20), p_documento VARCHAR(50))
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    existe BOOLEAN;
    cliente_info JSON;
    tipo_busqueda VARCHAR(20);
BEGIN
    -- Convertir V a natural y J a juridico
    IF p_tipo = 'V' THEN
        tipo_busqueda := 'natural';
    ELSIF p_tipo = 'J' THEN
        tipo_busqueda := 'juridico';
    ELSE
        tipo_busqueda := p_tipo; -- Por si llega 'natural' o 'juridico' directamente
    END IF;

    IF tipo_busqueda = 'natural' THEN
        SELECT EXISTS(SELECT 1 FROM cliente WHERE ci = p_documento::INT AND tipo = 'natural') INTO existe;
        
        IF existe THEN
            SELECT json_build_object(
                'clave', c.clave,
                'rif', c.rif,
                'ci', c.ci,
                'tipo', c.tipo,
                'primer_nombre', c.primer_nombre,
                'segundo_nombre', c.segundo_nombre,
                'primer_apellido', c.primer_apellido,
                'segundo_apellido', c.segundo_apellido,
                'direccion_habitacion', c.direccion_habitacion,
                'puntos_acumulados', c.puntos_acumulados
            ) INTO cliente_info
            FROM cliente c 
            WHERE c.ci = p_documento::INT AND c.tipo = 'natural';
        END IF;
        
    ELSIF tipo_busqueda = 'juridico' THEN
        SELECT EXISTS(SELECT 1 FROM cliente WHERE rif = p_documento::INT AND tipo = 'juridico') INTO existe;
        
        IF existe THEN
            SELECT json_build_object(
                'clave', c.clave,
                'rif', c.rif,
                'tipo', c.tipo,
                'razon_social', c.razon_social,
                'denominacion_comercial', c.denominacion_comercial,
                'url_pagina_web', c.url_pagina_web,
                'capital_disponible', c.capital_disponible,
                'direccion_fiscal', c.direccion_fiscal,
                'direccion_fisica', c.direccion_fisica,
                'puntos_acumulados', c.puntos_acumulados
            ) INTO cliente_info
            FROM cliente c 
            WHERE c.rif = p_documento::INT AND c.tipo = 'juridico';
        END IF;
    ELSE
        existe := FALSE;
    END IF;
    
    -- Retornar resultado en formato JSON
    RETURN json_build_object(
        'found', existe,
        'message', CASE 
            WHEN existe THEN 'Cliente ' || tipo_busqueda || ' encontrado'
            ELSE 'Cliente ' || tipo_busqueda || ' no encontrado'
        END,
        'cliente', cliente_info,
        'tipo_documento', p_tipo,
        'numero_documento', p_documento
    );
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA TIENDA (shopController.js)
-- =============================================

-- 1. Obtener productos disponibles (unificado)
CREATE OR REPLACE FUNCTION obtener_productos_disponibles(
    p_tienda_id INT,
    p_busqueda TEXT,
    p_tipo_cerveza TEXT,
    p_solo_con_oferta BOOLEAN,
    p_limite INT,
    p_offset INT
)
RETURNS TABLE (
    clave INT,
    ean_13 BIGINT,
    nombre_presentacion VARCHAR(50),
    cantidad_unidades INT,
    precio NUMERIC,
    nombre_cerveza VARCHAR(50),
    grado_alcohol INT,
    tipo_cerveza VARCHAR(50),
    miembro VARCHAR(50),
    cantidad_disponible INT,
    tiene_oferta BOOLEAN,
    porcentaje_descuento INT,
    precio_oferta NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (p.clave)
        p.clave,
        p.ean_13,
        p.nombre AS nombre_presentacion,
        p.cantidad_unidades,
        p.precio,
        c.nombre AS nombre_cerveza,
        c.grado_alcohol,
        tc.nombre AS tipo_cerveza,
        m.razon_social AS miembro,
        SUM(it.cantidad)::INT AS cantidad_disponible,
        CASE 
          WHEN o.clave IS NOT NULL AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin 
          THEN true 
          ELSE false 
        END AS tiene_oferta,
        o.porcentaje_descuento,
        ROUND((p.precio * (1 - (COALESCE(o.porcentaje_descuento, 0)::DECIMAL / 100))), 2) AS precio_oferta
    FROM presentacion p
    INNER JOIN cerveza c ON p.fk_cerveza = c.clave
    INNER JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
    INNER JOIN miembro m ON c.fk_miembro = m.rif
    INNER JOIN inventario_tienda it ON p.clave = it.fk_presentacion
    LEFT JOIN oferta o ON p.clave = o.fk_presentacion AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin
    WHERE it.cantidad > 0
      AND (p_tienda_id IS NULL OR it.fk_tienda_fisica = p_tienda_id)
      AND (p_busqueda IS NULL OR (
          LOWER(c.nombre) LIKE LOWER('%' || p_busqueda || '%') OR
          LOWER(p.nombre) LIKE LOWER('%' || p_busqueda || '%') OR
          CAST(p.ean_13 AS TEXT) LIKE '%' || p_busqueda || '%'
      ))
      AND (p_tipo_cerveza IS NULL OR LOWER(tc.nombre) = LOWER(p_tipo_cerveza))
      AND (p_solo_con_oferta IS FALSE OR o.clave IS NOT NULL)
    GROUP BY p.clave, p.ean_13, p.nombre, p.cantidad_unidades, p.precio, 
             c.nombre, c.grado_alcohol, tc.nombre, m.razon_social, 
             o.clave, o.fecha_inicio, o.fecha_fin, o.porcentaje_descuento
    ORDER BY p.clave, p.nombre
    LIMIT p_limite OFFSET p_offset;
END;
$$;

-- 1. Obtener productos disponibles en online (unificado)
CREATE OR REPLACE FUNCTION obtener_productos_disponibles_ecommerce(
    p_busqueda TEXT,
    p_tipo_cerveza TEXT,
    p_solo_con_oferta BOOLEAN,
    p_limite INT,
    p_offset INT
)
RETURNS TABLE (
    clave INT,
    ean_13 BIGINT,
    nombre_presentacion VARCHAR(50),
    cantidad_unidades INT,
    precio NUMERIC,
    nombre_cerveza VARCHAR(50),
    grado_alcohol INT,
    tipo_cerveza VARCHAR(50),
    miembro VARCHAR(50),
    cantidad_disponible INT,
    tiene_oferta BOOLEAN,
    porcentaje_descuento INT,
    precio_oferta NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.clave,
        p.ean_13,
        p.nombre AS nombre_presentacion,
        p.cantidad_unidades,
        p.precio,
        c.nombre AS nombre_cerveza,
        c.grado_alcohol,
        tc.nombre AS tipo_cerveza,
        m.razon_social AS miembro,
        SUM(a.cantidad_unidades)::INT AS cantidad_disponible,
        CASE 
          WHEN o.clave IS NOT NULL AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin 
          THEN true 
          ELSE false 
        END AS tiene_oferta,
        o.porcentaje_descuento,
        ROUND((p.precio * (1 - (COALESCE(o.porcentaje_descuento, 0)::DECIMAL / 100))), 2) AS precio_oferta
    FROM presentacion p
    INNER JOIN cerveza c ON p.fk_cerveza = c.clave
    INNER JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
    INNER JOIN miembro m ON c.fk_miembro = m.rif
    INNER JOIN almacen a ON p.clave = a.fk_presentacion
    LEFT JOIN oferta o ON p.clave = o.fk_presentacion AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin
    WHERE a.cantidad_unidades > 0
      AND (p_busqueda IS NULL OR (
          LOWER(c.nombre) LIKE LOWER('%' || p_busqueda || '%') OR
          LOWER(p.nombre) LIKE LOWER('%' || p_busqueda || '%') OR
          CAST(p.ean_13 AS TEXT) LIKE '%' || p_busqueda || '%'
      ))
      AND (p_tipo_cerveza IS NULL OR LOWER(tc.nombre) = LOWER(p_tipo_cerveza))
      AND (p_solo_con_oferta IS FALSE OR o.clave IS NOT NULL)
    GROUP BY p.clave, p.ean_13, p.nombre, p.cantidad_unidades, p.precio, 
             c.nombre, c.grado_alcohol, tc.nombre, m.razon_social, 
             o.clave, o.fecha_inicio, o.fecha_fin, o.porcentaje_descuento
    ORDER BY p.clave, p.nombre
    LIMIT p_limite OFFSET p_offset;
END;
$$;





-- 2. Obtener métodos de pago favoritos de un cliente
CREATE OR REPLACE FUNCTION obtener_metodos_pago_favoritos(p_cliente_id INT)
RETURNS TABLE (
    id INT,
    banco VARCHAR(50),
    numero_tarjeta VARCHAR(20),
    fecha_vencimiento DATE,
    tipo TEXT,
    moneda tipo_moneda
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.clave as id,
        mp.banco,
        CAST(mp.numero_tarjeta AS VARCHAR) as numero_tarjeta,
        mp.fecha_vencimiento,
        CASE WHEN mp.tipo = 'Tarjeta de credito' THEN 'credito' ELSE 'debito' END as tipo,
        mp.moneda
    FROM metodo_de_pago mp
    WHERE mp.fk_cliente = p_cliente_id 
      AND mp.metodo_preferido = true 
      AND mp.tipo IN ('Tarjeta de credito', 'Tarjeta de debito');
END;
$$;

-- 3. Obtener todas las tiendas físicas
CREATE OR REPLACE FUNCTION obtener_tiendas_fisicas()
RETURNS TABLE (clave INT, nombre VARCHAR(50), direccion TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT tf.clave, tf.nombre, tf.direccion FROM tienda_fisica tf;
END;
$$;

-- 4. Obtener tasa de cambio por moneda
CREATE OR REPLACE FUNCTION obtener_tasa_cambio(p_moneda tipo_moneda)
RETURNS SETOF tasa_cambio
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM tasa_cambio 
    WHERE moneda = p_moneda AND fecha_fin IS NULL 
    ORDER BY fecha_inicio DESC 
    LIMIT 1;
END;
$$;

-- 5. Crear Venta Online (actualizada para ecommerce)
CREATE OR REPLACE FUNCTION crear_venta_online(
    p_usuario_id INT,
    p_direccion_envio VARCHAR,
    p_lugar_id INT,
    p_items JSON,
    p_pagos JSON
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    item RECORD;
    pago RECORD;
    total_venta NUMERIC := 0;
    v_venta_id INT;
    v_almacen_id INT;
    v_metodo_pago_id INT;
    v_tasa_cambio_id INT;
    v_lugar_tipo VARCHAR;
    DEFAULT_TIENDA_ONLINE_ID INT := 1; -- Asumiendo que existe una tienda online con id 1
BEGIN
    -- Validar que el lugar de envío sea una parroquia
    SELECT tipo INTO v_lugar_tipo FROM lugar WHERE clave = p_lugar_id;
    IF v_lugar_tipo <> 'parroquia' THEN
        RAISE EXCEPTION 'La dirección de envío debe corresponder a una parroquia. Se proporcionó un lugar de tipo: %', v_lugar_tipo;
    END IF;

    -- Calcular el monto total de la venta a partir de los items
    FOR item IN SELECT * FROM json_to_recordset(p_items) AS x(presentacion_id INT, cantidad INT, precio_unitario NUMERIC)
    LOOP
        total_venta := total_venta + (item.cantidad * item.precio_unitario);
    END LOOP;

    -- Insertar la cabecera de la venta online
    INSERT INTO venta_online (fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario)
    VALUES (CURRENT_DATE, total_venta, p_direccion_envio, p_lugar_id, DEFAULT_TIENDA_ONLINE_ID, p_usuario_id)
    RETURNING clave INTO v_venta_id;

    -- Insertar detalles de la venta y actualizar el stock en el almacén central
    FOR item IN SELECT * FROM json_to_recordset(p_items) AS x(presentacion_id INT, cantidad INT, precio_unitario NUMERIC)
    LOOP
        SELECT clave INTO v_almacen_id FROM almacen WHERE fk_presentacion = item.presentacion_id;
        
        IF v_almacen_id IS NULL THEN
            RAISE EXCEPTION 'No se encontró el almacén para la presentación %', item.presentacion_id;
        END IF;

        INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
        VALUES (v_venta_id, v_almacen_id, item.cantidad, item.precio_unitario);

        UPDATE almacen SET cantidad_unidades = cantidad_unidades - item.cantidad WHERE clave = v_almacen_id;
    END LOOP;

    -- Insertar los registros de pago asociados a la venta (adaptado para ecommerce)
    FOR pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(
        tipo VARCHAR, 
        monto NUMERIC, 
        numero_tarjeta BIGINT, 
        fecha_vencimiento DATE,
        banco VARCHAR,
        puntos_usados INT,
        guardar_como_favorito BOOLEAN
    )
    LOOP
        -- Crear método de pago y obtener tasa de cambio según el tipo
        IF pago.tipo = 'Puntos' THEN
            -- Para puntos, se busca una tasa de cambio específica para PUNTOS.
            SELECT clave INTO v_tasa_cambio_id
            FROM tasa_cambio
            WHERE moneda = 'PUNTOS' AND (fecha_fin IS NULL OR CURRENT_DATE <= fecha_fin)
            ORDER BY fecha_inicio DESC
            LIMIT 1;

            IF v_tasa_cambio_id IS NULL THEN
                RAISE EXCEPTION 'No se encontró una tasa de cambio activa para PUNTOS. Verifique que exista una tasa para la moneda PUNTOS.';
            END IF;

            -- Crear método de pago para Puntos
            INSERT INTO metodo_de_pago (moneda, tipo, fk_cliente)
            SELECT 'PUNTOS', 'Puntos'::tipo_metodo_pago, u.fk_cliente
            FROM usuario u WHERE u.clave = p_usuario_id
            RETURNING clave INTO v_metodo_pago_id;
        ELSE
            -- Para tarjetas (y otros tipos que usen VES por defecto)
            SELECT clave INTO v_tasa_cambio_id
            FROM tasa_cambio
            WHERE moneda = 'VES'
                AND (fecha_fin IS NULL OR CURRENT_DATE <= fecha_fin)
            ORDER BY fecha_inicio DESC
            LIMIT 1;

            IF v_tasa_cambio_id IS NULL THEN
                RAISE EXCEPTION 'No se encontró una tasa de cambio activa para VES';
            END IF;
            
            -- Crear método de pago para Tarjeta
            INSERT INTO metodo_de_pago (
                moneda, tipo, numero_tarjeta, fecha_vencimiento, banco, 
                metodo_preferido, fk_cliente
            )
            SELECT 
                'VES', 
                pago.tipo::tipo_metodo_pago, 
                pago.numero_tarjeta, 
                pago.fecha_vencimiento, 
                pago.banco,
                COALESCE(pago.guardar_como_favorito, FALSE),
                u.fk_cliente
            FROM usuario u WHERE u.clave = p_usuario_id
            RETURNING clave INTO v_metodo_pago_id;
        END IF;

        -- Insertar el pago
        INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online)
        VALUES (CURRENT_DATE, pago.monto, v_tasa_cambio_id, v_metodo_pago_id, v_venta_id);
        
        -- Para puntos, descontar del cliente (las ventas online NO generan puntos)
        IF pago.tipo = 'Puntos' AND pago.puntos_usados > 0 THEN
            UPDATE cliente 
            SET puntos_acumulados = puntos_acumulados - pago.puntos_usados
            FROM usuario u
            WHERE cliente.clave = u.fk_cliente AND u.clave = p_usuario_id;
        END IF;
    END LOOP;
    
    RETURN v_venta_id;
END;
$$;

-- 6. Crear venta física (función que retorna el ID de la venta)
CREATE OR REPLACE FUNCTION crear_venta_fisica(
    p_tienda_id INT,
    p_cliente_id INT,
    p_items JSON,
    p_pagos JSON
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    item RECORD;
    pago RECORD;
    total_venta NUMERIC := 0;
    inv_tienda_id INT;
    v_venta_id INT;
BEGIN
    -- Calcular el monto total de la venta
    FOR item IN SELECT * FROM json_to_recordset(p_items) AS x(presentacion_id INT, cantidad INT, precio_unitario NUMERIC)
    LOOP
        total_venta := total_venta + (item.cantidad * item.precio_unitario);
    END LOOP;

    -- Insertar la venta
    INSERT INTO venta_tienda_fisica (fecha, total_venta, fk_tienda_fisica, fk_cliente)
    VALUES (CURRENT_DATE, total_venta, p_tienda_id, p_cliente_id)
    RETURNING clave INTO v_venta_id;

    -- Insertar detalles de la venta y actualizar inventario
    FOR item IN SELECT * FROM json_to_recordset(p_items) AS x(presentacion_id INT, cantidad INT, precio_unitario NUMERIC)
    LOOP
        SELECT clave INTO inv_tienda_id FROM inventario_tienda WHERE fk_presentacion = item.presentacion_id AND fk_tienda_fisica = p_tienda_id;
        
        INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
        VALUES (item.cantidad, item.precio_unitario, v_venta_id, inv_tienda_id);

        UPDATE inventario_tienda SET cantidad = cantidad - item.cantidad WHERE clave = inv_tienda_id;
    END LOOP;

    -- Insertar pagos
    FOR pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(metodo_pago_id INT, monto NUMERIC, tasa_cambio_id INT)
    LOOP
        INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica)
        VALUES (CURRENT_DATE, pago.monto, pago.tasa_cambio_id, pago.metodo_pago_id, v_venta_id);
    END LOOP;
    
    RETURN v_venta_id;
END;
$$;

-- 7. Obtener producto por EAN
CREATE OR REPLACE FUNCTION obtener_producto_por_ean(p_ean BIGINT, p_tienda_id INT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    producto_json JSON;
BEGIN
    SELECT row_to_json(t)
    INTO producto_json
    FROM (
        SELECT 
            p.clave, p.nombre, p.precio, c.nombre as cerveza, it.cantidad as stock
        FROM presentacion p
        JOIN cerveza c ON p.fk_cerveza = c.clave
        JOIN inventario_tienda it ON it.fk_presentacion = p.clave
        WHERE p.ean_13 = p_ean AND it.fk_tienda_fisica = p_tienda_id
    ) t;
    RETURN producto_json;
END;
$$;

-- 8. Obtener datos completos de una venta
CREATE OR REPLACE FUNCTION obtener_venta_completa(p_venta_id INT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    venta_completa JSON;
BEGIN
    SELECT json_build_object(
        'venta', (SELECT row_to_json(v) FROM venta_tienda_fisica v WHERE v.clave = p_venta_id),
        'cliente', (SELECT row_to_json(c) FROM cliente c JOIN venta_tienda_fisica v ON c.clave = v.fk_cliente WHERE v.clave = p_venta_id),
        'detalle', (
            SELECT json_agg(json_build_object(
                'detalle_id', dv.clave,
                'cantidad', dv.cantidad,
                'precio_unitario', dv.precio_unitario,
                'presentacion_id', p.clave,
                'presentacion_nombre', p.nombre,
                'cerveza_nombre', c.nombre
            ))
            FROM detalle_venta_fisica dv
            JOIN inventario_tienda it ON dv.fk_inventario_tienda = it.clave
            JOIN presentacion p ON it.fk_presentacion = p.clave
            JOIN cerveza c ON p.fk_cerveza = c.clave
            WHERE dv.fk_venta_tienda_fisica = p_venta_id
        ),
        'pagos', (
            SELECT json_agg(json_build_object(
                'pago_id', pa.clave,
                'monto', pa.monto_total,
                'tipo_metodo', mp.tipo,
                'moneda', mp.moneda,
                'banco', mp.banco,
                'tasa_cambio', tc.monto_equivalencia
            ))
            FROM pago pa
            JOIN metodo_de_pago mp ON pa.fk_metodo_de_pago = mp.clave
            LEFT JOIN tasa_cambio tc ON pa.fk_tasa_cambio = tc.clave
            WHERE pa.fk_venta_tienda_fisica = p_venta_id
        )
    ) INTO venta_completa;

    RETURN venta_completa;
END;
$$;

-- 9. Obtener datos completos de una venta ONLINE
CREATE OR REPLACE FUNCTION obtener_venta_online_completa(p_venta_id INT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    venta_completa JSON;
BEGIN
    SELECT json_build_object(
        'venta', (
            SELECT row_to_json(v)
            FROM (
                SELECT vo.*, u.username, c.primer_nombre, c.primer_apellido, c.rif, c.ci
                FROM venta_online vo
                JOIN usuario u ON vo.fk_usuario = u.clave
                LEFT JOIN cliente c ON u.fk_cliente = c.clave
                WHERE vo.clave = p_venta_id
            ) v
        ),
        'detalle', (
            SELECT json_agg(json_build_object(
                'detalle_id', dvo.clave,
                'cantidad', dvo.cantidad,
                'precio_unitario', dvo.precio_unitario,
                'presentacion_id', p.clave,
                'presentacion_nombre', p.nombre,
                'cerveza_nombre', c.nombre,
                'ean_13', p.ean_13
            ))
            FROM detalle_venta_online dvo
            JOIN almacen a ON dvo.fk_almacen = a.clave
            JOIN presentacion p ON a.fk_presentacion = p.clave
            JOIN cerveza c ON p.fk_cerveza = c.clave
            WHERE dvo.fk_venta_online = p_venta_id
        ),
        'pagos', (
            SELECT json_agg(json_build_object(
                'pago_id', pa.clave,
                'monto', pa.monto_total,
                'tipo_metodo', mp.tipo,
                'moneda', mp.moneda,
                'banco', mp.banco,
                'tasa_cambio', tc.monto_equivalencia
            ))
            FROM pago pa
            JOIN metodo_de_pago mp ON pa.fk_metodo_de_pago = mp.clave
            LEFT JOIN tasa_cambio tc ON pa.fk_tasa_cambio = tc.clave
            WHERE pa.fk_venta_online = p_venta_id
        )
    ) INTO venta_completa;

    RETURN venta_completa;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA REPOSICIONES
-- =============================================

-- 1. Obtener todas las reposiciones con detalles
CREATE OR REPLACE FUNCTION obtener_reposiciones_con_detalles()
RETURNS TABLE (
    clave INT,
    fk_almacen INT,
    fk_inventario_tienda INT,
    fk_usuario INT,
    cantidad INT,
    fecha DATE,
    estado_actual VARCHAR(50),
    fecha_ultimo_cambio TIMESTAMP,
    comentario_ultimo TEXT,
    producto_nombre VARCHAR(50),
    presentacion_nombre VARCHAR(50),
    stock_actual INT,
    tienda_nombre VARCHAR(50),
    usuario_responsable VARCHAR(50),
    jefe_pasillo VARCHAR(50),
    urgencia VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.clave,
        r.fk_almacen,
        r.fk_inventario_tienda,
        r.fk_usuario,
        r.cantidad,
        r.fecha,
        e.estado as estado_actual,
        h.fecha as fecha_ultimo_cambio,
        h.comentario as comentario_ultimo,
        c.nombre as producto_nombre,
        p.nombre as presentacion_nombre,
        it.cantidad as stock_actual,
        tf.nombre as tienda_nombre,
        u.username as usuario_responsable,
        CAST(COALESCE(
            (emp.primer_nombre || ' ' || emp.primer_apellido),
            cl.primer_nombre || ' ' || cl.primer_apellido,
            mem.razon_social
        ) AS VARCHAR(50)) as jefe_pasillo,
        CAST(CASE 
            WHEN it.cantidad <= 5 THEN 'Crítico'
            WHEN it.cantidad <= 10 THEN 'Urgente'
            WHEN it.cantidad <= 20 THEN 'Moderado'
            ELSE 'Normal'
        END AS VARCHAR(20)) as urgencia
    FROM reposicion r
    LEFT JOIN (
        SELECT DISTINCT ON (h_sub.fk_reposicion) 
            h_sub.fk_reposicion, h_sub.fk_estatus, h_sub.fecha, h_sub.comentario
        FROM historico h_sub
        WHERE h_sub.fk_reposicion IS NOT NULL
        ORDER BY h_sub.fk_reposicion, h_sub.fecha DESC
    ) h ON r.clave = h.fk_reposicion
    LEFT JOIN estatus e ON h.fk_estatus = e.clave
    JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
    JOIN presentacion p ON it.fk_presentacion = p.clave
    JOIN cerveza c ON p.fk_cerveza = c.clave
    JOIN tienda_fisica tf ON it.fk_tienda_fisica = tf.clave
    JOIN usuario u ON r.fk_usuario = u.clave
    LEFT JOIN empleado emp ON u.fk_empleado = emp.ci
    LEFT JOIN cliente cl ON u.fk_cliente = cl.clave
    LEFT JOIN miembro mem ON u.fk_miembro = mem.rif
    ORDER BY r.fecha DESC, urgencia;
END;
$$;

-- 2. Obtener reposiciones por tienda específica
CREATE OR REPLACE FUNCTION obtener_reposiciones_por_tienda(p_tienda_id INT)
RETURNS TABLE (
    clave INT,
    fk_almacen INT,
    fk_inventario_tienda INT,
    fk_usuario INT,
    cantidad INT,
    fecha DATE,
    estado_actual VARCHAR(50),
    fecha_ultimo_cambio TIMESTAMP,
    comentario_ultimo TEXT,
    producto_nombre VARCHAR(50),
    presentacion_nombre VARCHAR(50),
    stock_actual INT,
    usuario_responsable VARCHAR(50),
    urgencia VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.clave,
        r.fk_almacen,
        r.fk_inventario_tienda,
        r.fk_usuario,
        r.cantidad,
        r.fecha,
        e.estado as estado_actual,
        h.fecha as fecha_ultimo_cambio,
        h.comentario as comentario_ultimo,
        c.nombre as producto_nombre,
        p.nombre as presentacion_nombre,
        it.cantidad as stock_actual,
        u.username as usuario_responsable,
        CAST(CASE 
            WHEN it.cantidad <= 5 THEN 'Crítico'
            WHEN it.cantidad <= 10 THEN 'Urgente'
            WHEN it.cantidad <= 20 THEN 'Moderado'
            ELSE 'Normal'
        END AS VARCHAR(20)) as urgencia
    FROM reposicion r
    LEFT JOIN (
        SELECT DISTINCT ON (h_sub.fk_reposicion) 
            h_sub.fk_reposicion, h_sub.fk_estatus, h_sub.fecha, h_sub.comentario
        FROM historico h_sub
        WHERE h_sub.fk_reposicion IS NOT NULL
        ORDER BY h_sub.fk_reposicion, h_sub.fecha DESC
    ) h ON r.clave = h.fk_reposicion
    LEFT JOIN estatus e ON h.fk_estatus = e.clave
    JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
    JOIN presentacion p ON it.fk_presentacion = p.clave
    JOIN cerveza c ON p.fk_cerveza = c.clave
    JOIN usuario u ON r.fk_usuario = u.clave
    WHERE it.fk_tienda_fisica = p_tienda_id
    ORDER BY r.fecha DESC, urgencia;
END;
$$;

-- 3. Obtener una reposición específica por ID
CREATE OR REPLACE FUNCTION obtener_reposicion_por_id(p_reposicion_id INT)
RETURNS TABLE (
    clave INT,
    fk_almacen INT,
    fk_inventario_tienda INT,
    fk_usuario INT,
    cantidad INT,
    fecha DATE,
    estado_actual VARCHAR(50),
    historial_estados JSON,
    producto_nombre VARCHAR(50),
    presentacion_nombre VARCHAR(50),
    stock_actual INT,
    tienda_nombre VARCHAR(50),
    usuario_responsable VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.clave,
        r.fk_almacen,
        r.fk_inventario_tienda,
        r.fk_usuario,
        r.cantidad,
        r.fecha,
        e_actual.estado as estado_actual,
        (
            SELECT json_agg(
                json_build_object(
                    'estado', e.estado,
                    'fecha', h.fecha,
                    'comentario', h.comentario
                ) ORDER BY h.fecha DESC
            )
            FROM historico h
            JOIN estatus e ON h.fk_estatus = e.clave
            WHERE h.fk_reposicion = r.clave
        ) as historial_estados,
        c.nombre as producto_nombre,
        p.nombre as presentacion_nombre,
        it.cantidad as stock_actual,
        tf.nombre as tienda_nombre,
        u.username as usuario_responsable
    FROM reposicion r
    LEFT JOIN (
        SELECT DISTINCT ON (fk_reposicion) 
            fk_reposicion, fk_estatus
        FROM historico 
        WHERE fk_reposicion IS NOT NULL
        ORDER BY fk_reposicion, fecha DESC
    ) h_actual ON r.clave = h_actual.fk_reposicion
    LEFT JOIN estatus e_actual ON h_actual.fk_estatus = e_actual.clave
    JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
    JOIN presentacion p ON it.fk_presentacion = p.clave
    JOIN cerveza c ON p.fk_cerveza = c.clave
    JOIN tienda_fisica tf ON it.fk_tienda_fisica = tf.clave
    JOIN usuario u ON r.fk_usuario = u.clave
    WHERE r.clave = p_reposicion_id;
END;
$$;

-- 4. Actualizar estado de reposición (solo jefes de pasillo)
CREATE OR REPLACE FUNCTION actualizar_estado_reposicion(
    p_reposicion_id INT,
    p_nuevo_estado_id INT,
    p_comentario TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    usuario_actual_id INTEGER;
    es_jefe_pasillo BOOLEAN := FALSE;
    es_administrador BOOLEAN := FALSE;
    tienda_reposicion INT;
    tienda_usuario INT;
BEGIN
    -- Obtener el ID del usuario actual desde la variable de sesión
    usuario_actual_id := NULLIF(current_setting('app.current_user_id', true), '')::INTEGER;
    
    IF usuario_actual_id IS NULL OR usuario_actual_id <= 0 THEN
        RAISE EXCEPTION 'Usuario no identificado. No se puede actualizar el estado de la reposición.';
    END IF;
    
    -- Verificar si el usuario es administrador
    SELECT EXISTS (
        SELECT 1
        FROM usuario u
        JOIN rol r ON r.clave = u.fk_rol
        WHERE u.clave = usuario_actual_id
        AND r.nombre = 'Administrador'
    ) INTO es_administrador;
    
    -- Si es administrador, permitir la operación
    IF es_administrador THEN
        INSERT INTO historico (fecha, fk_estatus, fk_reposicion, comentario)
        VALUES (NOW(), p_nuevo_estado_id, p_reposicion_id, p_comentario);
        RETURN TRUE;
    END IF;
    
    -- Verificar si el usuario tiene el rol de jefe de pasillo
    SELECT EXISTS (
        SELECT 1
        FROM usuario u
        JOIN rol r ON r.clave = u.fk_rol
        WHERE u.clave = usuario_actual_id
        AND r.nombre = 'Jefe de Pasillo'
    ) INTO es_jefe_pasillo;
    
    IF NOT es_jefe_pasillo THEN
        RAISE EXCEPTION 'Acceso denegado: Solo los jefes de pasillo pueden modificar el estado de las reposiciones. Usuario ID: %', usuario_actual_id;
    END IF;
    
    -- Obtener la tienda de la reposición
    SELECT it.fk_tienda_fisica INTO tienda_reposicion
    FROM reposicion r
    JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
    WHERE r.clave = p_reposicion_id;
    
    -- Obtener la tienda del usuario (a través de su contrato activo)
    SELECT d.fk_tienda_fisica INTO tienda_usuario
    FROM usuario u
    JOIN empleado e ON u.fk_empleado = e.ci
    JOIN contrato c ON e.ci = c.fk_empleado
    JOIN departamento d ON c.fk_departamento = d.clave
    WHERE u.clave = usuario_actual_id
    AND c.fecha_fin IS NULL; -- Contrato activo
    
    -- Verificar que el jefe de pasillo pertenece a la misma tienda
    IF tienda_usuario != tienda_reposicion THEN
        RAISE EXCEPTION 'Acceso denegado: Solo puede modificar reposiciones de su tienda asignada. Tienda usuario: %, Tienda reposición: %', tienda_usuario, tienda_reposicion;
    END IF;
    
    -- Insertar el nuevo estado en el histórico
    INSERT INTO historico (fecha, fk_estatus, fk_reposicion, comentario)
    VALUES (NOW(), p_nuevo_estado_id, p_reposicion_id, p_comentario);
    
    RETURN TRUE;
END;
$$;

-- 5. Obtener jefes de pasillo por tienda
CREATE OR REPLACE FUNCTION obtener_jefes_pasillo_por_tienda(p_tienda_id INT)
RETURNS TABLE (
    usuario_id INT,
    username VARCHAR(50),
    nombre_completo TEXT,
    telefono TEXT,
    email VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.clave as usuario_id,
        u.username,
        (e.primer_nombre || ' ' || e.primer_apellido)::TEXT as nombre_completo,
        CONCAT(t.codigo, '-', t.numero)::TEXT as telefono,
        ce.direccion_email as email
    FROM usuario u
    JOIN rol r ON u.fk_rol = r.clave
    JOIN empleado e ON u.fk_empleado = e.ci
    JOIN contrato c ON e.ci = c.fk_empleado
    JOIN departamento d ON c.fk_departamento = d.clave
    LEFT JOIN telefono t ON e.ci = t.fk_empleado
    LEFT JOIN correo_electronico ce ON e.ci = ce.fk_empleado
    WHERE r.nombre = 'Jefe de Pasillo'
    AND d.fk_tienda_fisica = p_tienda_id
    AND c.fecha_fin IS NULL; -- Solo contratos activos
END;
$$;

-- 6. Crear reposición manual
CREATE OR REPLACE FUNCTION crear_reposicion_manual(
    p_inventario_tienda_id INT,
    p_cantidad INT,
    p_usuario_id INT,
    p_comentario TEXT DEFAULT NULL
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_almacen_id INT;
    v_reposicion_id INT;
    v_estado_procesando_id INT;
BEGIN
    -- Obtener el almacén correspondiente a la presentación
    SELECT a.clave INTO v_almacen_id
    FROM inventario_tienda it
    JOIN presentacion p ON it.fk_presentacion = p.clave
    JOIN almacen a ON a.fk_presentacion = p.clave
    WHERE it.clave = p_inventario_tienda_id;
    
    IF v_almacen_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el almacén correspondiente para el inventario de tienda ID: %', p_inventario_tienda_id;
    END IF;
    
    -- Crear la reposición
    INSERT INTO reposicion (fk_almacen, fk_inventario_tienda, fk_usuario, cantidad, fecha)
    VALUES (v_almacen_id, p_inventario_tienda_id, p_usuario_id, p_cantidad, CURRENT_DATE)
    RETURNING clave INTO v_reposicion_id;
    
    -- Obtener el ID del estado 'procesando' para reposición
    SELECT clave INTO v_estado_procesando_id
    FROM estatus 
    WHERE estado = 'procesando' AND aplicable_a = 'reposicion'
    LIMIT 1;
    
    -- Insertar el estado inicial en el histórico
    INSERT INTO historico (fecha, fk_estatus, fk_reposicion, comentario)
    VALUES (NOW(), v_estado_procesando_id, v_reposicion_id, COALESCE(p_comentario, 'Reposición creada manualmente'));
    
    RETURN v_reposicion_id;
END;
$$;

-- 7. Obtener estadísticas de reposiciones
CREATE OR REPLACE FUNCTION obtener_estadisticas_reposiciones(p_tienda_id INT DEFAULT NULL)
RETURNS TABLE (
    total_reposiciones BIGINT,
    pendientes BIGINT,
    en_proceso BIGINT,
    completadas BIGINT,
    criticas BIGINT,
    promedio_tiempo_procesamiento TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH reposiciones_filtradas AS (
        SELECT r.clave, r.fecha as fecha_reposicion, it.cantidad as stock_actual,
               (SELECT e.estado 
                FROM historico h
                JOIN estatus e ON h.fk_estatus = e.clave
                WHERE h.fk_reposicion = r.clave
                ORDER BY h.fecha DESC
                LIMIT 1) as estado_actual
        FROM reposicion r
        JOIN inventario_tienda it ON r.fk_inventario_tienda = it.clave
        WHERE (p_tienda_id IS NULL OR it.fk_tienda_fisica = p_tienda_id)
    )
    SELECT 
        COUNT(*) as total_reposiciones,
        COUNT(*) FILTER (WHERE estado_actual = 'procesando') as pendientes,
        COUNT(*) FILTER (WHERE estado_actual = 'listo para entrega') as en_proceso,
        COUNT(*) FILTER (WHERE estado_actual = 'entregado') as completadas,
        COUNT(*) FILTER (WHERE stock_actual <= 5) as criticas,
        COALESCE(
            floor(
                extract(epoch from avg(age(now()::date, fecha_reposicion))) / 86400
            )::text || ' días', 
            'N/A'
        ) as promedio_tiempo_procesamiento
    FROM reposiciones_filtradas;
END;
$$;


-- Stored Procedures para Gestión de Compras
-- Archivo: procedures_compras.sql

-- 1. Obtener todas las órdenes de compra con información completa
CREATE OR REPLACE FUNCTION obtener_ordenes_compra(
    p_estado_filtro VARCHAR(50) DEFAULT NULL,
    p_miembro_id INT DEFAULT NULL,
    p_limite INT DEFAULT 50,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    clave INT,
    fecha DATE,
    monto_total INT,
    miembro_rif INT,
    miembro_nombre VARCHAR(100),
    estado_actual VARCHAR(50),
    fecha_estado DATE,
    productos_cantidad INT,
    observaciones TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.clave,
        c.fecha,
        c.monto_total,
        c.fk_miembro as miembro_rif,
        m.razon_social as miembro_nombre,
        COALESCE(est.estado, 'emitida') as estado_actual,
        COALESCE(h.fecha, c.fecha) as fecha_estado,
        COALESCE(dc.cantidad, 0) as productos_cantidad,
        '' as observaciones
    FROM compra c
    INNER JOIN miembro m ON c.fk_miembro = m.rif
    LEFT JOIN (
        SELECT DISTINCT ON (h1.fk_compra) 
            h1.fk_compra, 
            h1.fecha, 
            e1.estado
        FROM historico h1
        INNER JOIN estatus e1 ON h1.fk_estatus = e1.clave
        WHERE h1.fk_compra IS NOT NULL 
        AND e1.aplicable_a = 'compra'
        ORDER BY h1.fk_compra, h1.fecha DESC
    ) h ON c.clave = h.fk_compra
    LEFT JOIN estatus est ON h.estado = est.estado
    LEFT JOIN detalle_compra dc ON c.clave = dc.fk_compra
    WHERE 
        (p_estado_filtro IS NULL OR COALESCE(est.estado, 'emitida') = p_estado_filtro)
        AND (p_miembro_id IS NULL OR c.fk_miembro = p_miembro_id)
    ORDER BY c.fecha DESC
    LIMIT p_limite OFFSET p_offset;
END;
$$;

-- 2. Obtener detalles de una orden de compra específica
CREATE OR REPLACE FUNCTION obtener_detalle_orden_compra(p_compra_id INT)
RETURNS TABLE (
    compra_clave INT,
    compra_fecha DATE,
    compra_monto_total INT,
    miembro_rif INT,
    miembro_nombre VARCHAR(100),
    estado_actual VARCHAR(50),
    fecha_estado DATE,
    detalle_clave INT,
    almacen_clave INT,
    presentacion_nombre VARCHAR(50),
    cerveza_nombre VARCHAR(50),
    cantidad INT,
    precio_unitario DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.clave as compra_clave,
        c.fecha as compra_fecha,
        c.monto_total as compra_monto_total,
        c.fk_miembro as miembro_rif,
        m.razon_social as miembro_nombre,
        COALESCE(est.estado, 'emitida') as estado_actual,
        COALESCE(h.fecha, c.fecha) as fecha_estado,
        dc.clave as detalle_clave,
        dc.fk_almacen as almacen_clave,
        p.nombre as presentacion_nombre,
        cer.nombre as cerveza_nombre,
        dc.cantidad,
        dc.precio_unitario
    FROM compra c
    INNER JOIN miembro m ON c.fk_miembro = m.rif
    LEFT JOIN detalle_compra dc ON c.clave = dc.fk_compra
    LEFT JOIN almacen a ON dc.fk_almacen = a.clave
    LEFT JOIN presentacion p ON a.fk_presentacion = p.clave
    LEFT JOIN cerveza cer ON p.fk_cerveza = cer.clave
    LEFT JOIN (
        SELECT DISTINCT ON (h1.fk_compra) 
            h1.fk_compra, 
            h1.fecha, 
            e1.estado
        FROM historico h1
        INNER JOIN estatus e1 ON h1.fk_estatus = e1.clave
        WHERE h1.fk_compra IS NOT NULL 
        AND e1.aplicable_a = 'compra'
        ORDER BY h1.fk_compra, h1.fecha DESC
    ) h ON c.clave = h.fk_compra
    LEFT JOIN estatus est ON h.estado = est.estado
    WHERE c.clave = p_compra_id;
END;
$$;

-- 3. Crear nueva orden de compra
CREATE OR REPLACE FUNCTION crear_orden_compra(
    p_miembro_rif INT,
    p_almacen_id INT,
    p_cantidad INT,
    p_precio_unitario DECIMAL(10,2)
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_compra_id INT;
    v_monto_total DECIMAL(10,2);
BEGIN
    -- Calcular monto total
    v_monto_total := p_cantidad * p_precio_unitario;
    
    -- Crear la compra
    INSERT INTO compra (fecha, monto_total, fk_miembro)
    VALUES (CURRENT_DATE, v_monto_total::INT, p_miembro_rif)
    RETURNING clave INTO v_compra_id;
    
    -- Crear el detalle de compra
    INSERT INTO detalle_compra (fk_almacen, fk_compra, cantidad, precio_unitario)
    VALUES (p_almacen_id, v_compra_id, p_cantidad, p_precio_unitario);
    
    -- Crear el registro en histórico con estado inicial
    INSERT INTO historico (fecha, fk_estatus, fk_compra)
    VALUES (
        CURRENT_DATE, 
        (SELECT clave FROM estatus WHERE estado = 'emitida' AND aplicable_a = 'compra' LIMIT 1),
        v_compra_id
    );
    
    RETURN v_compra_id;
END;
$$;

-- 4. Cambiar estado de orden de compra
CREATE OR REPLACE FUNCTION cambiar_estado_orden_compra(
    p_compra_id INT,
    p_nuevo_estado VARCHAR(50)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_estatus_id INT;
BEGIN
    -- Buscar el ID del estatus
    SELECT clave INTO v_estatus_id 
    FROM estatus 
    WHERE estado = p_nuevo_estado AND aplicable_a = 'compra';
    
    IF v_estatus_id IS NULL THEN
        RAISE EXCEPTION 'Estado % no válido para compras', p_nuevo_estado;
    END IF;
    
    -- Insertar nuevo registro en histórico
    INSERT INTO historico (fecha, fk_estatus, fk_compra)
    VALUES (CURRENT_DATE, v_estatus_id, p_compra_id);
    
    RETURN TRUE;
END;
$$;

-- 5. Obtener estadísticas de compras
CREATE OR REPLACE FUNCTION obtener_estadisticas_compras()
RETURNS TABLE (
    total_ordenes INT,
    ordenes_pendientes INT,
    monto_total_mes DECIMAL(15,2),
    productos_total INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INT as total_ordenes,
        COUNT(CASE 
            WHEN COALESCE(ultimo_estado.estado, 'emitida') IN ('emitida', 'procesando') 
            THEN 1 
        END)::INT as ordenes_pendientes,
        COALESCE(SUM(CASE 
            WHEN c.fecha >= DATE_TRUNC('month', CURRENT_DATE) 
            THEN c.monto_total 
        END), 0)::DECIMAL(15,2) as monto_total_mes,
        COALESCE(SUM(dc.cantidad), 0)::INT as productos_total
    FROM compra c
    LEFT JOIN detalle_compra dc ON c.clave = dc.fk_compra
    LEFT JOIN (
        SELECT DISTINCT ON (h.fk_compra) 
            h.fk_compra, 
            e.estado
        FROM historico h
        INNER JOIN estatus e ON h.fk_estatus = e.clave
        WHERE h.fk_compra IS NOT NULL 
        AND e.aplicable_a = 'compra'
        ORDER BY h.fk_compra, h.fecha DESC
    ) ultimo_estado ON c.clave = ultimo_estado.fk_compra;
END;
$$;

-- 6. Obtener miembros disponibles para compras
CREATE OR REPLACE FUNCTION obtener_miembros_proveedores()
RETURNS TABLE (
    rif INT,
    razon_social VARCHAR(100),
    denominacion_comercial VARCHAR(100),
    url_pagina_web VARCHAR(255),
    total_compras INT,
    ultimo_pedido DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.rif,
        m.razon_social,
        m.denominacion_comercial,
        m.url_pagina_web,
        COUNT(c.clave)::INT as total_compras,
        MAX(c.fecha) as ultimo_pedido
    FROM miembro m
    LEFT JOIN compra c ON m.rif = c.fk_miembro
    GROUP BY m.rif, m.razon_social, m.denominacion_comercial, m.url_pagina_web
    ORDER BY m.razon_social;
END;
$$;

-- 7. Obtener estados disponibles para compras
CREATE OR REPLACE FUNCTION obtener_estados_compra()
RETURNS TABLE (
    clave INT,
    estado VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.clave,
        e.estado,
        '' as descripcion
    FROM estatus e
    WHERE e.aplicable_a = 'compra'
    ORDER BY e.estado;
END;
$$; 


CREATE OR REPLACE FUNCTION reporte_tendencia_ventas(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE(fecha_venta DATE, total_ventas DECIMAL)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_unificadas AS (
        SELECT fecha::DATE AS fecha_venta, monto_total FROM venta_online
        UNION ALL
        SELECT fecha::DATE AS fecha_venta, total_venta AS monto_total FROM venta_tienda_fisica
    )
    SELECT
        vu.fecha_venta,
        SUM(vu.monto_total) AS total_ventas
    FROM
        ventas_unificadas vu
    WHERE
        vu.fecha_venta BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY
        vu.fecha_venta
    ORDER BY
        vu.fecha_venta;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA EVENTOS (eventController.js)
-- =============================================

-- Drops para eventos
DROP FUNCTION IF EXISTS obtener_tipos_evento();
DROP FUNCTION IF EXISTS crear_tipo_evento(VARCHAR, TEXT);
DROP FUNCTION IF EXISTS actualizar_tipo_evento(INT, VARCHAR, TEXT);
DROP FUNCTION IF EXISTS eliminar_tipo_evento(INT);
DROP FUNCTION IF EXISTS obtener_todos_eventos(DATE, DATE, INT, VARCHAR);
DROP FUNCTION IF EXISTS obtener_evento_por_id(INT);
DROP FUNCTION IF EXISTS crear_evento(VARCHAR, DATE, DATE, TEXT, INT, INT, INT, INT);
DROP FUNCTION IF EXISTS actualizar_evento(INT, VARCHAR, DATE, DATE, TEXT, INT, INT, INT, INT);
DROP FUNCTION IF EXISTS eliminar_evento(INT);
DROP FUNCTION IF EXISTS obtener_eventos_activos();
DROP FUNCTION IF EXISTS obtener_eventos_proximos(INT);
DROP FUNCTION IF EXISTS obtener_subeventos_por_evento(INT);
DROP FUNCTION IF EXISTS crear_subevento(INT, VARCHAR, DATE, DATE, TEXT, INT, INT, INT);
DROP FUNCTION IF EXISTS actualizar_subevento(INT, VARCHAR, DATE, DATE, TEXT, INT, INT, INT);
DROP FUNCTION IF EXISTS eliminar_subevento(INT);
DROP FUNCTION IF EXISTS obtener_inventario_evento(INT);
DROP FUNCTION IF EXISTS actualizar_inventario_evento(INT, INT, INT);
DROP FUNCTION IF EXISTS transferir_inventario_a_evento(INT, INT, INT);
DROP FUNCTION IF EXISTS registrar_asistencia_evento(INT, INT);
DROP FUNCTION IF EXISTS obtener_asistentes_evento(INT);
DROP FUNCTION IF EXISTS vender_entrada_evento(INT, INT, JSON);
DROP FUNCTION IF EXISTS obtener_invitados_evento(INT);
DROP FUNCTION IF EXISTS agregar_invitado_evento(INT, INT, INT, VARCHAR, VARCHAR, INT);

-- 1. Gestión de tipos de eventos
CREATE OR REPLACE FUNCTION obtener_tipos_evento()
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT te.clave, te.nombre, te.descripcion
    FROM tipo_evento te
    ORDER BY te.nombre;
END;
$$;

CREATE OR REPLACE FUNCTION crear_tipo_evento(
    p_nombre VARCHAR(50),
    p_descripcion TEXT
)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO tipo_evento (nombre, descripcion)
    VALUES (p_nombre, p_descripcion)
    RETURNING tipo_evento.clave, tipo_evento.nombre, tipo_evento.descripcion;
END;
$$;

CREATE OR REPLACE FUNCTION actualizar_tipo_evento(
    p_id INT,
    p_nombre VARCHAR(50),
    p_descripcion TEXT
)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    descripcion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE tipo_evento
    SET nombre = p_nombre, descripcion = p_descripcion
    WHERE clave = p_id
    RETURNING tipo_evento.clave, tipo_evento.nombre, tipo_evento.descripcion;
END;
$$;

CREATE OR REPLACE FUNCTION eliminar_tipo_evento(p_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_id INT;
BEGIN
    DELETE FROM tipo_evento WHERE clave = p_id RETURNING clave INTO deleted_id;
    RETURN deleted_id;
END;
$$;

-- 2. Gestión de eventos principales
CREATE OR REPLACE FUNCTION obtener_todos_eventos(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_lugar_id INT DEFAULT NULL,
    p_tipo VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE,
    direccion TEXT,
    precio_entrada INT,
    tipo_evento VARCHAR(50),
    lugar VARCHAR(50),
    cantidad_subeventos BIGINT,
    cantidad_asistentes BIGINT,
    ingresos_totales DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.clave,
        e.nombre,
        e.fecha_inicio,
        e.fecha_fin,
        e.direccion,
        e.precio_entrada,
        te.nombre as tipo_evento,
        l.nombre as lugar,
        COUNT(DISTINCT se.clave) as cantidad_subeventos,
        COUNT(DISTINCT a.clave) as cantidad_asistentes,
        COALESCE(SUM(ve.monto_total), 0) as ingresos_totales
    FROM evento e
    JOIN tipo_evento te ON e.fk_tipo_evento = te.clave
    JOIN lugar l ON e.fk_lugar = l.clave
    LEFT JOIN evento se ON se.fk_evento = e.clave
    LEFT JOIN asistencia a ON a.fk_evento = e.clave
    LEFT JOIN venta_entrada ve ON ve.fk_evento = e.clave
    WHERE (p_fecha_inicio IS NULL OR e.fecha_inicio >= p_fecha_inicio)
      AND (p_fecha_fin IS NULL OR e.fecha_fin <= p_fecha_fin)
      AND (p_lugar_id IS NULL OR e.fk_lugar = p_lugar_id)
      AND (p_tipo IS NULL OR te.nombre = p_tipo)
      AND e.fk_evento IS NULL -- Solo eventos principales
    GROUP BY e.clave, e.nombre, e.fecha_inicio, e.fecha_fin, 
             e.direccion, e.precio_entrada, te.nombre, l.nombre
    ORDER BY e.fecha_inicio DESC;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_evento_por_id(p_evento_id INT)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE,
    direccion TEXT,
    precio_entrada INT,
    tipo_evento_id INT,
    tipo_evento_nombre VARCHAR(50),
    lugar_id INT,
    lugar_nombre VARCHAR(50),
    evento_padre_id INT,
    evento_padre_nombre VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.clave,
        e.nombre,
        e.fecha_inicio,
        e.fecha_fin,
        e.direccion,
        e.precio_entrada,
        te.clave as tipo_evento_id,
        te.nombre as tipo_evento_nombre,
        l.clave as lugar_id,
        l.nombre as lugar_nombre,
        ep.clave as evento_padre_id,
        ep.nombre as evento_padre_nombre
    FROM evento e
    JOIN tipo_evento te ON e.fk_tipo_evento = te.clave
    JOIN lugar l ON e.fk_lugar = l.clave
    LEFT JOIN evento ep ON e.fk_evento = ep.clave
    WHERE e.clave = p_evento_id;
END;
$$;

CREATE OR REPLACE FUNCTION crear_evento(
    p_nombre VARCHAR(50),
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_direccion TEXT,
    p_precio_entrada INT,
    p_fk_evento INT,
    p_fk_lugar INT,
    p_fk_tipo_evento INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_evento_id INT;
BEGIN
    INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, 
                       precio_entrada, fk_evento, fk_lugar, fk_tipo_evento)
    VALUES (p_nombre, p_fecha_inicio, p_fecha_fin, p_direccion, 
            p_precio_entrada, p_fk_evento, p_fk_lugar, p_fk_tipo_evento)
    RETURNING clave INTO v_evento_id;
    
    RETURN v_evento_id;
END;
$$;

CREATE OR REPLACE FUNCTION actualizar_evento(
    p_id INT,
    p_nombre VARCHAR(50),
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_direccion TEXT,
    p_precio_entrada INT,
    p_fk_evento INT,
    p_fk_lugar INT,
    p_fk_tipo_evento INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE evento
    SET nombre = p_nombre,
        fecha_inicio = p_fecha_inicio,
        fecha_fin = p_fecha_fin,
        direccion = p_direccion,
        precio_entrada = p_precio_entrada,
        fk_evento = p_fk_evento,
        fk_lugar = p_fk_lugar,
        fk_tipo_evento = p_fk_tipo_evento
    WHERE clave = p_id;
    
    RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION eliminar_evento(p_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_id INT;
BEGIN
    DELETE FROM evento WHERE clave = p_id RETURNING clave INTO deleted_id;
    RETURN deleted_id;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_eventos_activos()
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE,
    tipo_evento VARCHAR(50),
    lugar VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.clave,
        e.nombre,
        e.fecha_inicio,
        e.fecha_fin,
        te.nombre as tipo_evento,
        l.nombre as lugar
    FROM evento e
    JOIN tipo_evento te ON e.fk_tipo_evento = te.clave
    JOIN lugar l ON e.fk_lugar = l.clave
    WHERE CURRENT_DATE BETWEEN e.fecha_inicio AND e.fecha_fin
      AND e.fk_evento IS NULL
    ORDER BY e.fecha_inicio;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_eventos_proximos(p_dias INT DEFAULT 30)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE,
    dias_para_inicio INT,
    tipo_evento VARCHAR(50),
    lugar VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.clave,
        e.nombre,
        e.fecha_inicio,
        e.fecha_fin,
        (e.fecha_inicio - CURRENT_DATE)::INT as dias_para_inicio,
        te.nombre as tipo_evento,
        l.nombre as lugar
    FROM evento e
    JOIN tipo_evento te ON e.fk_tipo_evento = te.clave
    JOIN lugar l ON e.fk_lugar = l.clave
    WHERE e.fecha_inicio > CURRENT_DATE
      AND e.fecha_inicio <= CURRENT_DATE + p_dias
      AND e.fk_evento IS NULL
    ORDER BY e.fecha_inicio;
END;
$$;

-- 3. Gestión de sub-eventos
CREATE OR REPLACE FUNCTION obtener_subeventos_por_evento(p_evento_id INT)
RETURNS TABLE (
    clave INT,
    nombre VARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE,
    direccion TEXT,
    precio_entrada INT,
    tipo_evento VARCHAR(50),
    cantidad_asistentes BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.clave,
        e.nombre,
        e.fecha_inicio,
        e.fecha_fin,
        e.direccion,
        e.precio_entrada,
        te.nombre as tipo_evento,
        COUNT(DISTINCT a.clave) as cantidad_asistentes
    FROM evento e
    JOIN tipo_evento te ON e.fk_tipo_evento = te.clave
    LEFT JOIN asistencia a ON a.fk_evento = e.clave
    WHERE e.fk_evento = p_evento_id
    GROUP BY e.clave, e.nombre, e.fecha_inicio, e.fecha_fin, 
             e.direccion, e.precio_entrada, te.nombre
    ORDER BY e.fecha_inicio;
END;
$$;

CREATE OR REPLACE FUNCTION crear_subevento(
    p_evento_padre_id INT,
    p_nombre VARCHAR(50),
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_direccion TEXT,
    p_precio_entrada INT,
    p_fk_lugar INT,
    p_fk_tipo_evento INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_subevento_id INT;
    v_fecha_inicio_padre DATE;
    v_fecha_fin_padre DATE;
BEGIN
    -- Validar que las fechas estén dentro del evento padre
    SELECT fecha_inicio, fecha_fin 
    INTO v_fecha_inicio_padre, v_fecha_fin_padre
    FROM evento 
    WHERE clave = p_evento_padre_id;
    
    IF p_fecha_inicio < v_fecha_inicio_padre OR p_fecha_fin > v_fecha_fin_padre THEN
        RAISE EXCEPTION 'Las fechas del sub-evento deben estar dentro del rango del evento padre';
    END IF;
    
    -- Crear el sub-evento
    INSERT INTO evento (nombre, fecha_inicio, fecha_fin, direccion, 
                       precio_entrada, fk_evento, fk_lugar, fk_tipo_evento)
    VALUES (p_nombre, p_fecha_inicio, p_fecha_fin, p_direccion, 
            p_precio_entrada, p_evento_padre_id, p_fk_lugar, p_fk_tipo_evento)
    RETURNING clave INTO v_subevento_id;
    
    RETURN v_subevento_id;
END;
$$;

CREATE OR REPLACE FUNCTION actualizar_subevento(
    p_id INT,
    p_nombre VARCHAR(50),
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_direccion TEXT,
    p_precio_entrada INT,
    p_fk_lugar INT,
    p_fk_tipo_evento INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_evento_padre_id INT;
    v_fecha_inicio_padre DATE;
    v_fecha_fin_padre DATE;
BEGIN
    -- Obtener el evento padre
    SELECT fk_evento INTO v_evento_padre_id
    FROM evento WHERE clave = p_id;
    
    IF v_evento_padre_id IS NOT NULL THEN
        -- Validar fechas con el evento padre
        SELECT fecha_inicio, fecha_fin 
        INTO v_fecha_inicio_padre, v_fecha_fin_padre
        FROM evento 
        WHERE clave = v_evento_padre_id;
        
        IF p_fecha_inicio < v_fecha_inicio_padre OR p_fecha_fin > v_fecha_fin_padre THEN
            RAISE EXCEPTION 'Las fechas del sub-evento deben estar dentro del rango del evento padre';
        END IF;
    END IF;
    
    UPDATE evento
    SET nombre = p_nombre,
        fecha_inicio = p_fecha_inicio,
        fecha_fin = p_fecha_fin,
        direccion = p_direccion,
        precio_entrada = p_precio_entrada,
        fk_lugar = p_fk_lugar,
        fk_tipo_evento = p_fk_tipo_evento
    WHERE clave = p_id;
    
    RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION eliminar_subevento(p_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_id INT;
BEGIN
    -- Solo permitir eliminar si es un sub-evento
    DELETE FROM evento 
    WHERE clave = p_id AND fk_evento IS NOT NULL
    RETURNING clave INTO deleted_id;
    
    RETURN deleted_id;
END;
$$;

-- 4. Gestión de inventario de eventos
CREATE OR REPLACE FUNCTION obtener_inventario_evento(p_evento_id INT)
RETURNS TABLE (
    clave INT,
    presentacion_id INT,
    presentacion_nombre VARCHAR(50),
    cerveza_nombre VARCHAR(50),
    precio DECIMAL(10,2),
    cantidad_disponible INT,
    cantidad_vendida BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ie.clave,
        p.clave as presentacion_id,
        p.nombre as presentacion_nombre,
        c.nombre as cerveza_nombre,
        p.precio,
        ie.cantidad_unidades as cantidad_disponible,
        COALESCE(SUM(dve.cantidad), 0) as cantidad_vendida
    FROM inventario_evento ie
    JOIN presentacion p ON ie.fk_presentacion = p.clave
    JOIN cerveza c ON p.fk_cerveza = c.clave
    LEFT JOIN detalle_venta_evento dve ON dve.fk_inventario_evento = ie.clave
    WHERE ie.fk_evento = p_evento_id
    GROUP BY ie.clave, p.clave, p.nombre, c.nombre, p.precio, ie.cantidad_unidades;
END;
$$;

CREATE OR REPLACE FUNCTION actualizar_inventario_evento(
    p_evento_id INT,
    p_presentacion_id INT,
    p_cantidad INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_inventario_id INT;
BEGIN
    -- Buscar si ya existe el inventario
    SELECT clave INTO v_inventario_id
    FROM inventario_evento
    WHERE fk_evento = p_evento_id AND fk_presentacion = p_presentacion_id;
    
    IF v_inventario_id IS NOT NULL THEN
        -- Actualizar cantidad existente
        UPDATE inventario_evento
        SET cantidad_unidades = p_cantidad
        WHERE clave = v_inventario_id;
    ELSE
        -- Crear nuevo registro
        INSERT INTO inventario_evento (fk_presentacion, fk_evento, cantidad_unidades)
        VALUES (p_presentacion_id, p_evento_id, p_cantidad);
    END IF;
    
    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION transferir_inventario_a_evento(
    p_almacen_id INT,
    p_evento_id INT,
    p_cantidad INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_presentacion_id INT;
    v_cantidad_disponible INT;
    v_inventario_evento_id INT;
BEGIN
    -- Obtener presentación y cantidad disponible
    SELECT fk_presentacion, cantidad_unidades 
    INTO v_presentacion_id, v_cantidad_disponible
    FROM almacen 
    WHERE clave = p_almacen_id;
    
    IF v_cantidad_disponible < p_cantidad THEN
        RAISE EXCEPTION 'No hay suficiente inventario en almacén. Disponible: %, Solicitado: %', 
                        v_cantidad_disponible, p_cantidad;
    END IF;
    
    -- Descontar del almacén
    UPDATE almacen
    SET cantidad_unidades = cantidad_unidades - p_cantidad
    WHERE clave = p_almacen_id;
    
    -- Buscar si ya existe inventario para este evento y presentación
    SELECT clave INTO v_inventario_evento_id
    FROM inventario_evento
    WHERE fk_evento = p_evento_id AND fk_presentacion = v_presentacion_id;
    
    IF v_inventario_evento_id IS NOT NULL THEN
        -- Actualizar inventario existente
        UPDATE inventario_evento
        SET cantidad_unidades = cantidad_unidades + p_cantidad
        WHERE clave = v_inventario_evento_id;
    ELSE
        -- Crear nuevo inventario
        INSERT INTO inventario_evento (fk_presentacion, fk_evento, cantidad_unidades)
        VALUES (v_presentacion_id, p_evento_id, p_cantidad);
    END IF;
    
    RETURN TRUE;
END;
$$;

-- 5. Gestión de participantes y asistencia
CREATE OR REPLACE FUNCTION registrar_asistencia_evento(
    p_evento_id INT,
    p_cliente_id INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_asistencia_id INT;
BEGIN
    -- Verificar si ya está registrado
    SELECT clave INTO v_asistencia_id
    FROM asistencia
    WHERE fk_evento = p_evento_id AND fk_cliente = p_cliente_id;
    
    IF v_asistencia_id IS NOT NULL THEN
        RAISE EXCEPTION 'El cliente ya tiene asistencia registrada para este evento';
    END IF;
    
    INSERT INTO asistencia (fecha_entrada, fk_evento, fk_cliente)
    VALUES (NOW(), p_evento_id, p_cliente_id)
    RETURNING clave INTO v_asistencia_id;
    
    RETURN v_asistencia_id;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_asistentes_evento(p_evento_id INT)
RETURNS TABLE (
    asistencia_id INT,
    cliente_id INT,
    cliente_nombre TEXT,
    cliente_documento INT,
    fecha_entrada TIMESTAMP,
    tipo_cliente tipo_cliente
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.clave as asistencia_id,
        c.clave as cliente_id,
        CASE 
            WHEN c.tipo = 'natural' THEN c.primer_nombre || ' ' || c.primer_apellido
            ELSE c.razon_social
        END as cliente_nombre,
        CASE 
            WHEN c.tipo = 'natural' THEN c.ci
            ELSE c.rif
        END as cliente_documento,
        a.fecha_entrada,
        c.tipo as tipo_cliente
    FROM asistencia a
    JOIN cliente c ON a.fk_cliente = c.clave
    WHERE a.fk_evento = p_evento_id
    ORDER BY a.fecha_entrada DESC;
END;
$$;

CREATE OR REPLACE FUNCTION vender_entrada_evento(
    p_evento_id INT,
    p_cliente_id INT,
    p_pagos JSON
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_venta_id INT;
    v_precio_entrada INT;
    pago RECORD;
BEGIN
    -- Obtener precio de entrada
    SELECT precio_entrada INTO v_precio_entrada
    FROM evento WHERE clave = p_evento_id;
    
    IF v_precio_entrada IS NULL THEN
        RAISE EXCEPTION 'El evento no tiene precio de entrada definido';
    END IF;
    
    -- Crear venta de entrada
    INSERT INTO venta_entrada (fecha, monto_total, fk_evento, fk_cliente)
    VALUES (CURRENT_DATE, v_precio_entrada, p_evento_id, p_cliente_id)
    RETURNING clave INTO v_venta_id;
    
    -- Procesar pagos
    FOR pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(metodo_pago_id INT, monto NUMERIC, tasa_cambio_id INT)
    LOOP
        INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_entrada)
        VALUES (CURRENT_DATE, pago.monto, pago.tasa_cambio_id, pago.metodo_pago_id, v_venta_id);
    END LOOP;
    
    RETURN v_venta_id;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_invitados_evento(p_evento_id INT)
RETURNS TABLE (
    invitado_id INT,
    rif INT,
    nombre_completo TEXT,
    tipo_invitado VARCHAR(50),
    fecha_entrada TIMESTAMP,
    fecha_salida TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.ci as invitado_id,
        i.rif,
        i.primer_nombre || ' ' || i.primer_apellido as nombre_completo,
        ti.nombre as tipo_invitado,
        ie.fecha_hora_entrada,
        ie.fecha_hora_salida
    FROM inv_eve ie
    JOIN invitado i ON ie.fk_invitado = i.ci
    JOIN tipo_invitado ti ON i.fk_tipo_invitado = ti.clave
    WHERE ie.fk_evento = p_evento_id
    ORDER BY ie.fecha_hora_entrada DESC;
END;
$$;

CREATE OR REPLACE FUNCTION agregar_invitado_evento(
    p_evento_id INT,
    p_ci INT,
    p_rif INT,
    p_primer_nombre VARCHAR(50),
    p_primer_apellido VARCHAR(50),
    p_tipo_invitado_id INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_invitado_id INT;
BEGIN
    -- Crear o actualizar invitado
    INSERT INTO invitado (ci, rif, primer_nombre, primer_apellido, fk_tipo_invitado)
    VALUES (p_ci, p_rif, p_primer_nombre, p_primer_apellido, p_tipo_invitado_id)
    ON CONFLICT (ci) DO UPDATE
    SET rif = EXCLUDED.rif,
        primer_nombre = EXCLUDED.primer_nombre,
        primer_apellido = EXCLUDED.primer_apellido,
        fk_tipo_invitado = EXCLUDED.fk_tipo_invitado
    RETURNING ci INTO v_invitado_id;
    
    -- Registrar en el evento
    INSERT INTO inv_eve (fecha_hora_entrada, fk_invitado, fk_evento)
    VALUES (NOW(), v_invitado_id, p_evento_id);
    
    RETURN v_invitado_id;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA DASHBOARD (dashboardController.js)
-- =============================================

-- Drops para dashboard
DROP FUNCTION IF EXISTS obtener_ventas_totales(DATE, DATE, VARCHAR);
DROP FUNCTION IF EXISTS obtener_crecimiento_ventas(DATE, DATE, DATE, DATE);
DROP FUNCTION IF EXISTS calcular_ticket_promedio(DATE, DATE);
DROP FUNCTION IF EXISTS obtener_volumen_unidades_vendidas(DATE, DATE);
DROP FUNCTION IF EXISTS obtener_ventas_por_estilo_cerveza(DATE, DATE);
DROP FUNCTION IF EXISTS obtener_clientes_nuevos_vs_recurrentes(DATE, DATE);
DROP FUNCTION IF EXISTS calcular_tasa_retencion_clientes(DATE, DATE);
DROP FUNCTION IF EXISTS calcular_rotacion_inventario(DATE, DATE);
DROP FUNCTION IF EXISTS obtener_tasa_ruptura_stock();
DROP FUNCTION IF EXISTS obtener_ventas_por_empleado(DATE, DATE);

-- 1. Indicadores de Ventas

CREATE OR REPLACE FUNCTION obtener_ventas_totales(
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_tipo_tienda VARCHAR(20) DEFAULT NULL
)
RETURNS TABLE (
    tipo_venta VARCHAR(20),
    cantidad_ventas BIGINT,
    monto_total DECIMAL(15,2),
    promedio_venta DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_unificadas AS (
        SELECT 
            'online'::VARCHAR(20) as tipo,
            vo.monto_total as monto,
            vo.fecha
        FROM venta_online vo
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        SELECT 
            'fisica'::VARCHAR(20) as tipo,
            vf.total_venta as monto,
            vf.fecha
        FROM venta_tienda_fisica vf
        WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        SELECT 
            'evento'::VARCHAR(20) as tipo,
            ve.monto_total as monto,
            ve.fecha
        FROM venta_evento ve
        WHERE ve.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    )
    SELECT 
        vu.tipo as tipo_venta,
        COUNT(*) as cantidad_ventas,
        SUM(vu.monto) as monto_total,
        AVG(vu.monto) as promedio_venta
    FROM ventas_unificadas vu
    WHERE p_tipo_tienda IS NULL OR vu.tipo = p_tipo_tienda
    GROUP BY vu.tipo
    
    UNION ALL
    
    SELECT 
        'total'::VARCHAR(20) as tipo_venta,
        COUNT(*) as cantidad_ventas,
        SUM(vu.monto) as monto_total,
        AVG(vu.monto) as promedio_venta
    FROM ventas_unificadas vu
    WHERE p_tipo_tienda IS NULL OR vu.tipo = p_tipo_tienda;
END;
$$; 
CREATE OR REPLACE FUNCTION obtener_crecimiento_ventas(
    p_fecha_inicio_actual DATE,
    p_fecha_fin_actual DATE,
    p_fecha_inicio_anterior DATE,
    p_fecha_fin_anterior DATE
)
RETURNS TABLE (
    ventas_periodo_actual DECIMAL(15,2),
    ventas_periodo_anterior DECIMAL(15,2),
    diferencia_absoluta DECIMAL(15,2),
    porcentaje_crecimiento DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_ventas_actual DECIMAL(15,2);
    v_ventas_anterior DECIMAL(15,2);
BEGIN
    -- Calcular ventas período actual
    SELECT COALESCE(SUM(monto), 0) INTO v_ventas_actual
    FROM (
        SELECT monto_total as monto FROM venta_online 
        WHERE fecha BETWEEN p_fecha_inicio_actual AND p_fecha_fin_actual
        UNION ALL
        SELECT total_venta as monto FROM venta_tienda_fisica 
        WHERE fecha BETWEEN p_fecha_inicio_actual AND p_fecha_fin_actual
        UNION ALL
        SELECT monto_total as monto FROM venta_evento 
        WHERE fecha BETWEEN p_fecha_inicio_actual AND p_fecha_fin_actual
    ) ventas_actual;
    
    -- Calcular ventas período anterior
    SELECT COALESCE(SUM(monto), 0) INTO v_ventas_anterior
    FROM (
        SELECT monto_total as monto FROM venta_online 
        WHERE fecha BETWEEN p_fecha_inicio_anterior AND p_fecha_fin_anterior
        UNION ALL
        SELECT total_venta as monto FROM venta_tienda_fisica 
        WHERE fecha BETWEEN p_fecha_inicio_anterior AND p_fecha_fin_anterior
        UNION ALL
        SELECT monto_total as monto FROM venta_evento 
        WHERE fecha BETWEEN p_fecha_inicio_anterior AND p_fecha_fin_anterior
    ) ventas_anterior;
    
    RETURN QUERY
    SELECT 
        v_ventas_actual as ventas_periodo_actual,
        v_ventas_anterior as ventas_periodo_anterior,
        v_ventas_actual - v_ventas_anterior as diferencia_absoluta,
        CASE 
            WHEN v_ventas_anterior = 0 THEN 100.00
            ELSE ROUND(((v_ventas_actual - v_ventas_anterior) / v_ventas_anterior * 100)::NUMERIC, 2)
        END as porcentaje_crecimiento;
END;
$$;

CREATE OR REPLACE FUNCTION calcular_ticket_promedio(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    tipo_venta VARCHAR(20),
    ticket_promedio DECIMAL(10,2),
    cantidad_items_promedio DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    -- Ventas online
    SELECT 
        'online'::VARCHAR(20) as tipo_venta,
        AVG(vo.monto_total) as ticket_promedio,
        AVG(items_por_venta.cantidad_items) as cantidad_items_promedio
    FROM venta_online vo
    LEFT JOIN (
        SELECT fk_venta_online, SUM(cantidad) as cantidad_items
        FROM detalle_venta_online
        GROUP BY fk_venta_online
    ) items_por_venta ON vo.clave = items_por_venta.fk_venta_online
    WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    
    UNION ALL
    
    -- Ventas físicas
    SELECT 
        'fisica'::VARCHAR(20) as tipo_venta,
        AVG(vf.total_venta) as ticket_promedio,
        AVG(items_por_venta.cantidad_items) as cantidad_items_promedio
    FROM venta_tienda_fisica vf
    LEFT JOIN (
        SELECT fk_venta_tienda_fisica, SUM(cantidad) as cantidad_items
        FROM detalle_venta_fisica
        GROUP BY fk_venta_tienda_fisica
    ) items_por_venta ON vf.clave = items_por_venta.fk_venta_tienda_fisica
    WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    
    UNION ALL
    
    -- Total general
    SELECT 
        'total'::VARCHAR(20) as tipo_venta,
        AVG(monto) as ticket_promedio,
        AVG(items) as cantidad_items_promedio
    FROM (
        SELECT vo.monto_total as monto, COALESCE(SUM(dvo.cantidad), 0) as items
        FROM venta_online vo
        LEFT JOIN detalle_venta_online dvo ON vo.clave = dvo.fk_venta_online
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        GROUP BY vo.clave, vo.monto_total
        
        UNION ALL
        
        SELECT vf.total_venta as monto, COALESCE(SUM(dvf.cantidad), 0) as items
        FROM venta_tienda_fisica vf
        LEFT JOIN detalle_venta_fisica dvf ON vf.clave = dvf.fk_venta_tienda_fisica
        WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        GROUP BY vf.clave, vf.total_venta
    ) todas_ventas;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_volumen_unidades_vendidas(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    tipo_presentacion VARCHAR(50),
    unidades_vendidas BIGINT,
    litros_vendidos DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_unificadas AS (
        -- Ventas online
        SELECT 
            p.nombre as presentacion,
            p.cantidad_unidades as ml_por_unidad,
            dvo.cantidad
        FROM detalle_venta_online dvo
        JOIN almacen a ON dvo.fk_almacen = a.clave
        JOIN presentacion p ON a.fk_presentacion = p.clave
        JOIN venta_online vo ON dvo.fk_venta_online = vo.clave
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        -- Ventas físicas
        SELECT 
            p.nombre as presentacion,
            p.cantidad_unidades as ml_por_unidad,
            dvf.cantidad
        FROM detalle_venta_fisica dvf
        JOIN inventario_tienda it ON dvf.fk_inventario_tienda = it.clave
        JOIN presentacion p ON it.fk_presentacion = p.clave
        JOIN venta_tienda_fisica vf ON dvf.fk_venta_tienda_fisica = vf.clave
        WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        -- Ventas en eventos
        SELECT 
            p.nombre as presentacion,
            p.cantidad_unidades as ml_por_unidad,
            dve.cantidad
        FROM detalle_venta_evento dve
        JOIN inventario_evento ie ON dve.fk_inventario_evento = ie.clave
        JOIN presentacion p ON ie.fk_presentacion = p.clave
        JOIN venta_evento ve ON dve.fk_venta_evento = ve.clave
        WHERE ve.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    )
    SELECT 
        presentacion as tipo_presentacion,
        SUM(cantidad) as unidades_vendidas,
        SUM(cantidad * ml_por_unidad / 1000.0) as litros_vendidos
    FROM ventas_unificadas
    GROUP BY presentacion
    ORDER BY unidades_vendidas DESC;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_ventas_por_estilo_cerveza(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    estilo_cerveza VARCHAR(50),
    cantidad_vendida BIGINT,
    monto_total DECIMAL(15,2),
    porcentaje_del_total DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_por_estilo AS (
        -- Ventas online
        SELECT 
            tc.nombre as estilo,
            dvo.cantidad,
            dvo.cantidad * dvo.precio_unitario as monto
        FROM detalle_venta_online dvo
        JOIN almacen a ON dvo.fk_almacen = a.clave
        JOIN presentacion p ON a.fk_presentacion = p.clave
        JOIN cerveza c ON p.fk_cerveza = c.clave
        JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
        JOIN venta_online vo ON dvo.fk_venta_online = vo.clave
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        -- Ventas físicas
        SELECT 
            tc.nombre as estilo,
            dvf.cantidad,
            dvf.cantidad * dvf.precio_unitario as monto
        FROM detalle_venta_fisica dvf
        JOIN inventario_tienda it ON dvf.fk_inventario_tienda = it.clave
        JOIN presentacion p ON it.fk_presentacion = p.clave
        JOIN cerveza c ON p.fk_cerveza = c.clave
        JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
        JOIN venta_tienda_fisica vf ON dvf.fk_venta_tienda_fisica = vf.clave
        WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        -- Ventas en eventos
        SELECT 
            tc.nombre as estilo,
            dve.cantidad,
            dve.cantidad * dve.precio_unitario as monto
        FROM detalle_venta_evento dve
        JOIN inventario_evento ie ON dve.fk_inventario_evento = ie.clave
        JOIN presentacion p ON ie.fk_presentacion = p.clave
        JOIN cerveza c ON p.fk_cerveza = c.clave
        JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
        JOIN venta_evento ve ON dve.fk_venta_evento = ve.clave
        WHERE ve.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ),
    totales AS (
        SELECT SUM(monto) as total_general_estilos
        FROM ventas_por_estilo
    )
    SELECT 
        estilo as estilo_cerveza,
        SUM(cantidad) as cantidad_vendida,
        SUM(monto) as monto_total,
        ROUND((SUM(monto) / totales.total_general_estilos * 100)::NUMERIC, 2) as porcentaje_del_total
    FROM ventas_por_estilo
    CROSS JOIN totales
    GROUP BY estilo, totales.total_general_estilos
    ORDER BY monto_total DESC;
END;
$$;

-- 2. Indicadores de Clientes
CREATE OR REPLACE FUNCTION obtener_clientes_nuevos_vs_recurrentes(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    tipo_cliente VARCHAR(20),
    cantidad INT,
    porcentaje DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH clientes_periodo AS (
        SELECT DISTINCT fk_cliente as cliente_id
        FROM venta_tienda_fisica
        WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION
        
        SELECT DISTINCT c.clave as cliente_id
        FROM venta_online vo
        JOIN usuario u ON vo.fk_usuario = u.clave
        JOIN cliente c ON u.fk_cliente = c.clave
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION
        
        SELECT DISTINCT fk_cliente as cliente_id
        FROM venta_evento
        WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ),
    clientes_anteriores AS (
        SELECT DISTINCT fk_cliente as cliente_id
        FROM venta_tienda_fisica
        WHERE fecha < p_fecha_inicio
        
        UNION
        
        SELECT DISTINCT c.clave as cliente_id
        FROM venta_online vo
        JOIN usuario u ON vo.fk_usuario = u.clave
        JOIN cliente c ON u.fk_cliente = c.clave
        WHERE vo.fecha < p_fecha_inicio
        
        UNION
        
        SELECT DISTINCT fk_cliente as cliente_id
        FROM venta_evento
        WHERE fecha < p_fecha_inicio
    ),
    clasificacion AS (
        SELECT 
            cp.cliente_id,
            CASE 
                WHEN ca.cliente_id IS NULL THEN 'nuevo'
                ELSE 'recurrente'
            END as tipo
        FROM clientes_periodo cp
        LEFT JOIN clientes_anteriores ca ON cp.cliente_id = ca.cliente_id
    ),
    conteos AS (
        SELECT 
            tipo,
            COUNT(*) as cantidad_clientes
        FROM clasificacion
        GROUP BY tipo
    ),
    total AS (
        SELECT SUM(cantidad_clientes) as total_clientes FROM conteos
    )
    SELECT 
        c.tipo as tipo_cliente,
        c.cantidad_clientes::INT as cantidad,
        ROUND((c.cantidad_clientes::DECIMAL / NULLIF(t.total_clientes, 0) * 100), 2) as porcentaje
    FROM conteos c
    CROSS JOIN total t;
END;
$$;

CREATE OR REPLACE FUNCTION calcular_tasa_retencion_clientes(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    clientes_inicio_periodo INT,
    clientes_fin_periodo INT,
    clientes_retenidos INT,
    tasa_retencion DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_clientes_inicio INT;
    v_clientes_fin INT;
    v_clientes_retenidos INT;
BEGIN
    -- Clientes activos al inicio del período (compraron en los 30 días anteriores)
    WITH clientes_inicio AS (
        SELECT DISTINCT cliente_id FROM (
            SELECT fk_cliente as cliente_id FROM venta_tienda_fisica
            WHERE fecha BETWEEN p_fecha_inicio - INTERVAL '30 days' AND p_fecha_inicio
            
            UNION
            
            SELECT c.clave as cliente_id FROM venta_online vo
            JOIN usuario u ON vo.fk_usuario = u.clave
            JOIN cliente c ON u.fk_cliente = c.clave
            WHERE vo.fecha BETWEEN p_fecha_inicio - INTERVAL '30 days' AND p_fecha_inicio
            
            UNION
            
            SELECT fk_cliente as cliente_id FROM venta_evento
            WHERE fecha BETWEEN p_fecha_inicio - INTERVAL '30 days' AND p_fecha_inicio
        ) ci
    ),
    clientes_fin AS (
        SELECT DISTINCT cliente_id FROM (
            SELECT fk_cliente as cliente_id FROM venta_tienda_fisica
            WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
            
            UNION
            
            SELECT c.clave as cliente_id FROM venta_online vo
            JOIN usuario u ON vo.fk_usuario = u.clave
            JOIN cliente c ON u.fk_cliente = c.clave
            WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
            
            UNION
            
            SELECT fk_cliente as cliente_id FROM venta_evento
            WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        ) cf
    )
    SELECT 
        COUNT(DISTINCT ci.cliente_id),
        COUNT(DISTINCT cf.cliente_id),
        COUNT(DISTINCT ci.cliente_id) FILTER (WHERE cf.cliente_id IS NOT NULL),
        CASE 
            WHEN COUNT(DISTINCT ci.cliente_id) = 0 THEN 0
            ELSE ROUND((COUNT(DISTINCT ci.cliente_id) FILTER (WHERE cf.cliente_id IS NOT NULL)::DECIMAL / 
                       COUNT(DISTINCT ci.cliente_id) * 100), 2)
        END
    INTO v_clientes_inicio, v_clientes_fin, v_clientes_retenidos
    FROM clientes_inicio ci
    LEFT JOIN clientes_fin cf ON ci.cliente_id = cf.cliente_id;
    
    RETURN QUERY
    SELECT v_clientes_inicio, v_clientes_fin, v_clientes_retenidos,
           CASE 
               WHEN v_clientes_inicio = 0 THEN 0
               ELSE ROUND((v_clientes_retenidos::DECIMAL / v_clientes_inicio * 100), 2)
           END as tasa_retencion;
END;
$$;

-- 3. Indicadores de Inventario y Operaciones
CREATE OR REPLACE FUNCTION calcular_rotacion_inventario(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    tipo_inventario VARCHAR(20),
    valor_promedio_inventario DECIMAL(15,2),
    costo_productos_vendidos DECIMAL(15,2),
    rotacion_inventario DECIMAL(5,2),
    dias_inventario INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_dias_periodo INT;
BEGIN
    v_dias_periodo := p_fecha_fin - p_fecha_inicio + 1;
    
    RETURN QUERY
    -- Almacén central
    SELECT 
        'almacen'::VARCHAR(20) as tipo_inventario,
        AVG(a.cantidad_unidades * p.precio) as valor_promedio_inventario,
        SUM(dvo.cantidad * dvo.precio_unitario) as costo_productos_vendidos,
        CASE 
            WHEN AVG(a.cantidad_unidades * p.precio) = 0 THEN 0
            ELSE ROUND((SUM(dvo.cantidad * dvo.precio_unitario) / AVG(a.cantidad_unidades * p.precio))::NUMERIC, 2)
        END as rotacion_inventario,
        CASE 
            WHEN SUM(dvo.cantidad * dvo.precio_unitario) = 0 THEN 0
            ELSE ROUND((AVG(a.cantidad_unidades * p.precio) / (SUM(dvo.cantidad * dvo.precio_unitario) / v_dias_periodo))::NUMERIC)::INT
        END as dias_inventario
    FROM almacen a
    JOIN presentacion p ON a.fk_presentacion = p.clave
    LEFT JOIN detalle_venta_online dvo ON dvo.fk_almacen = a.clave
    LEFT JOIN venta_online vo ON dvo.fk_venta_online = vo.clave AND vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    
    UNION ALL
    
    -- Tiendas físicas
    SELECT 
        'tienda'::VARCHAR(20) as tipo_inventario,
        AVG(it.cantidad * p.precio) as valor_promedio_inventario,
        SUM(dvf.cantidad * dvf.precio_unitario) as costo_productos_vendidos,
        CASE 
            WHEN AVG(it.cantidad * p.precio) = 0 THEN 0
            ELSE ROUND((SUM(dvf.cantidad * dvf.precio_unitario) / AVG(it.cantidad * p.precio))::NUMERIC, 2)
        END as rotacion_inventario,
        CASE 
            WHEN SUM(dvf.cantidad * dvf.precio_unitario) = 0 THEN 0
            ELSE ROUND((AVG(it.cantidad * p.precio) / (SUM(dvf.cantidad * dvf.precio_unitario) / v_dias_periodo))::NUMERIC)::INT
        END as dias_inventario
    FROM inventario_tienda it
    JOIN presentacion p ON it.fk_presentacion = p.clave
    LEFT JOIN detalle_venta_fisica dvf ON dvf.fk_inventario_tienda = it.clave
    LEFT JOIN venta_tienda_fisica vf ON dvf.fk_venta_tienda_fisica = vf.clave AND vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_tasa_ruptura_stock()
RETURNS TABLE (
    tipo_inventario VARCHAR(20),
    total_productos INT,
    productos_sin_stock INT,
    tasa_ruptura DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    -- Almacén central
    SELECT 
        'almacen'::VARCHAR(20) as tipo_inventario,
        COUNT(*)::INT as total_productos,
        COUNT(*) FILTER (WHERE cantidad_unidades = 0)::INT as productos_sin_stock,
        ROUND((COUNT(*) FILTER (WHERE cantidad_unidades = 0)::DECIMAL / NULLIF(COUNT(*), 0) * 100), 2) as tasa_ruptura
    FROM almacen
    
    UNION ALL
    
    -- Tiendas físicas (agregado)
    SELECT 
        'tienda'::VARCHAR(20) as tipo_inventario,
        COUNT(DISTINCT fk_presentacion)::INT as total_productos,
        COUNT(DISTINCT fk_presentacion) FILTER (WHERE total_cantidad = 0)::INT as productos_sin_stock,
        ROUND((COUNT(DISTINCT fk_presentacion) FILTER (WHERE total_cantidad = 0)::DECIMAL / 
               NULLIF(COUNT(DISTINCT fk_presentacion), 0) * 100), 2) as tasa_ruptura
    FROM (
        SELECT fk_presentacion, SUM(cantidad) as total_cantidad
        FROM inventario_tienda
        GROUP BY fk_presentacion
    ) inventario_agregado;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_ventas_por_empleado(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    empleado_id INT,
    empleado_nombre TEXT,
    cargo VARCHAR(50),
    tienda VARCHAR(50),
    cantidad_ventas BIGINT,
    monto_total_ventas DECIMAL(15,2),
    ticket_promedio DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.ci as empleado_id,
        (e.primer_nombre || ' ' || e.primer_apellido)::TEXT as empleado_nombre,
        c.nombre as cargo,
        tf.nombre as tienda,
        COUNT(vf.clave) as cantidad_ventas,
        SUM(vf.total_venta) as monto_total_ventas,
        AVG(vf.total_venta) as ticket_promedio
    FROM venta_tienda_fisica vf
    JOIN tienda_fisica tf ON vf.fk_tienda_fisica = tf.clave
    JOIN departamento d ON d.fk_tienda_fisica = tf.clave
    JOIN contrato ct ON ct.fk_departamento = d.clave AND ct.fecha_fin IS NULL
    JOIN empleado e ON ct.fk_empleado = e.ci
    JOIN cargo c ON ct.fk_cargo = c.clave
    WHERE vf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
      AND c.nombre IN ('Vendedor', 'Cajero', 'Jefe de Tienda')
    GROUP BY e.ci, e.primer_nombre, e.primer_apellido, c.nombre, tf.nombre
    ORDER BY monto_total_ventas DESC;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA VENTAS ONLINE COMPLETAS
-- =============================================

-- Drops para ventas online completas
DROP FUNCTION IF EXISTS validar_stock_online(JSON);
DROP FUNCTION IF EXISTS aplicar_ofertas_carrito(JSON, INT);
DROP FUNCTION IF EXISTS calcular_costo_envio(INT, DECIMAL);
DROP FUNCTION IF EXISTS procesar_venta_online_completa(INT, JSON, JSON, VARCHAR);
DROP FUNCTION IF EXISTS actualizar_estado_envio(INT, VARCHAR, TEXT);
DROP FUNCTION IF EXISTS obtener_tracking_envio(INT);

-- 1. Validar stock disponible para venta online
CREATE OR REPLACE FUNCTION validar_stock_online(p_items JSON)
RETURNS TABLE (
    presentacion_id INT,
    cantidad_solicitada INT,
    cantidad_disponible INT,
    stock_suficiente BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH items_solicitados AS (
        SELECT 
            (item->>'presentacion_id')::INT as presentacion_id,
            (item->>'cantidad')::INT as cantidad
        FROM json_array_elements(p_items) as item
    )
    SELECT 
        i.presentacion_id,
        i.cantidad as cantidad_solicitada,
        a.cantidad_unidades as cantidad_disponible,
        (a.cantidad_unidades >= i.cantidad) as stock_suficiente
    FROM items_solicitados i
    JOIN almacen a ON a.fk_presentacion = i.presentacion_id;
END;
$$;

-- 2. Aplicar ofertas al carrito
CREATE OR REPLACE FUNCTION aplicar_ofertas_carrito(
    p_items JSON,
    p_cliente_id INT
)
RETURNS TABLE (
    presentacion_id INT,
    precio_original DECIMAL(10,2),
    descuento_aplicado INT,
    precio_final DECIMAL(10,2),
    ahorro DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH items_carrito AS (
        SELECT 
            (item->>'presentacion_id')::INT as presentacion_id,
            (item->>'cantidad')::INT as cantidad
        FROM json_array_elements(p_items) as item
    )
    SELECT 
        ic.presentacion_id,
        p.precio as precio_original,
        COALESCE(o.porcentaje_descuento, 0) as descuento_aplicado,
        CASE 
            WHEN o.clave IS NOT NULL THEN ROUND(p.precio * (1 - o.porcentaje_descuento::DECIMAL / 100), 2)
            ELSE p.precio
        END as precio_final,
        CASE 
            WHEN o.clave IS NOT NULL THEN ROUND(p.precio * o.porcentaje_descuento::DECIMAL / 100, 2)
            ELSE 0
        END as ahorro
    FROM items_carrito ic
    JOIN presentacion p ON p.clave = ic.presentacion_id
    LEFT JOIN oferta o ON o.fk_presentacion = p.clave 
                      AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin;
END;
$$;

-- 3. Calcular costo de envío
CREATE OR REPLACE FUNCTION calcular_costo_envio(
    p_lugar_id INT,
    p_monto_total DECIMAL(10,2)
)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_tipo_lugar VARCHAR(20);
    v_costo_base DECIMAL(10,2);
    v_costo_envio DECIMAL(10,2);
BEGIN
    -- Obtener tipo de lugar
    SELECT tipo INTO v_tipo_lugar
    FROM lugar WHERE clave = p_lugar_id;
    
    -- Calcular costo base según tipo de lugar
    CASE v_tipo_lugar
        WHEN 'parroquia' THEN v_costo_base := 50.00;
        WHEN 'municipio' THEN v_costo_base := 100.00;
        WHEN 'estado' THEN v_costo_base := 200.00;
        ELSE v_costo_base := 150.00;
    END CASE;
    
    -- Aplicar descuentos por monto
    IF p_monto_total >= 1000 THEN
        v_costo_envio := 0; -- Envío gratis
    ELSIF p_monto_total >= 500 THEN
        v_costo_envio := v_costo_base * 0.5; -- 50% descuento
    ELSE
        v_costo_envio := v_costo_base;
    END IF;
    
    RETURN v_costo_envio;
END;
$$;

-- 4. Procesar venta online completa con todas las validaciones
CREATE OR REPLACE FUNCTION procesar_venta_online_completa(
    p_usuario_id INT,
    p_items JSON,
    p_pagos JSON,
    p_direccion_envio VARCHAR(255)
)
RETURNS TABLE (
    venta_id INT,
    monto_subtotal DECIMAL(15,2),
    monto_descuentos DECIMAL(15,2),
    costo_envio DECIMAL(10,2),
    monto_total DECIMAL(15,2),
    estado VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_venta_id INT;
    v_cliente_id INT;
    v_lugar_id INT;
    v_monto_subtotal DECIMAL(15,2) := 0;
    v_monto_descuentos DECIMAL(15,2) := 0;
    v_costo_envio DECIMAL(10,2);
    v_monto_total DECIMAL(15,2);
    item RECORD;
    pago RECORD;
    v_precio_final DECIMAL(10,2);
    v_almacen_id INT;
    v_estado_inicial_id INT;
    v_metodo_pago_id INT;
    v_tasa_cambio_id INT;
BEGIN
    -- Obtener cliente del usuario
    SELECT fk_cliente INTO v_cliente_id
    FROM usuario WHERE clave = p_usuario_id;
    
    IF v_cliente_id IS NULL THEN
        RAISE EXCEPTION 'El usuario no está asociado a un cliente';
    END IF;
    
    -- Obtener lugar del cliente
    SELECT COALESCE(fk_direccion_habitacion, fk_direccion_fisica) INTO v_lugar_id
    FROM cliente WHERE clave = v_cliente_id;
    
    -- Validar stock
    IF EXISTS (
        SELECT 1 FROM validar_stock_online(p_items)
        WHERE NOT stock_suficiente
    ) THEN
        RAISE EXCEPTION 'No hay suficiente stock para algunos productos';
    END IF;
    
    -- Calcular montos con ofertas
    FOR item IN 
        SELECT * FROM json_to_recordset(p_items) AS x(
            presentacion_id INT, 
            cantidad INT, 
            precio_unitario NUMERIC
        )
    LOOP
        -- Obtener precio con oferta
        SELECT precio_final INTO v_precio_final
        FROM aplicar_ofertas_carrito(
            json_build_array(json_build_object(
                'presentacion_id', item.presentacion_id,
                'cantidad', item.cantidad
            )),
            v_cliente_id
        )
        WHERE presentacion_id = item.presentacion_id;
        
        v_monto_subtotal := v_monto_subtotal + (item.cantidad * item.precio_unitario);
        v_monto_descuentos := v_monto_descuentos + (item.cantidad * (item.precio_unitario - v_precio_final));
    END LOOP;
    
    -- Calcular costo de envío
    v_costo_envio := calcular_costo_envio(v_lugar_id, v_monto_subtotal - v_monto_descuentos);
    v_monto_total := v_monto_subtotal - v_monto_descuentos + v_costo_envio;
    
    -- Crear venta
    INSERT INTO venta_online (fecha, monto_total, direccion_envio, fk_lugar, fk_tienda_online, fk_usuario)
    VALUES (CURRENT_DATE, v_monto_total, p_direccion_envio, v_lugar_id, 1, p_usuario_id)
    RETURNING clave INTO v_venta_id;
    
    -- Insertar detalles con precios finales
    FOR item IN 
        SELECT * FROM json_to_recordset(p_items) AS x(
            presentacion_id INT, 
            cantidad INT, 
            precio_unitario NUMERIC
        )
    LOOP
        -- Obtener almacén y precio final
        SELECT clave INTO v_almacen_id 
        FROM almacen WHERE fk_presentacion = item.presentacion_id;
        
        SELECT precio_final INTO v_precio_final
        FROM aplicar_ofertas_carrito(
            json_build_array(json_build_object(
                'presentacion_id', item.presentacion_id,
                'cantidad', item.cantidad
            )),
            v_cliente_id
        )
        WHERE presentacion_id = item.presentacion_id;
        
        -- Insertar detalle
        INSERT INTO detalle_venta_online (fk_venta_online, fk_almacen, cantidad, precio_unitario)
        VALUES (v_venta_id, v_almacen_id, item.cantidad, v_precio_final);
        
        -- Actualizar stock
        UPDATE almacen 
        SET cantidad_unidades = cantidad_unidades - item.cantidad
        WHERE clave = v_almacen_id;
    END LOOP;
    
    -- Procesar pagos
    FOR pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(
        tipo VARCHAR, 
        monto NUMERIC, 
        numero_tarjeta BIGINT, 
        fecha_vencimiento DATE,
        banco VARCHAR,
        puntos_usados INT,
        guardar_como_favorito BOOLEAN
    )
    LOOP
        -- Crear método de pago y obtener tasa de cambio según el tipo
        IF pago.tipo = 'Puntos' THEN
            -- Para puntos, se busca una tasa de cambio específica para PUNTOS.
            SELECT clave INTO v_tasa_cambio_id
            FROM tasa_cambio
            WHERE moneda = 'PUNTOS' AND (fecha_fin IS NULL OR CURRENT_DATE <= fecha_fin)
            ORDER BY fecha_inicio DESC
            LIMIT 1;

            IF v_tasa_cambio_id IS NULL THEN
                RAISE EXCEPTION 'No se encontró una tasa de cambio activa para PUNTOS. Verifique que exista una tasa para la moneda PUNTOS.';
            END IF;

            -- Crear método de pago para Puntos
            INSERT INTO metodo_de_pago (moneda, tipo, fk_cliente)
            SELECT 'PUNTOS', 'Puntos'::tipo_metodo_pago, u.fk_cliente
            FROM usuario u WHERE u.clave = p_usuario_id
            RETURNING clave INTO v_metodo_pago_id;
        ELSE
            -- Para tarjetas (y otros tipos que usen VES por defecto)
            SELECT clave INTO v_tasa_cambio_id
            FROM tasa_cambio
            WHERE moneda = 'VES'
                AND (fecha_fin IS NULL OR CURRENT_DATE <= fecha_fin)
            ORDER BY fecha_inicio DESC
            LIMIT 1;

            IF v_tasa_cambio_id IS NULL THEN
                RAISE EXCEPTION 'No se encontró una tasa de cambio activa para VES';
            END IF;
            
            -- Crear método de pago para Tarjeta
            INSERT INTO metodo_de_pago (
                moneda, tipo, numero_tarjeta, fecha_vencimiento, banco, 
                metodo_preferido, fk_cliente
            )
            SELECT 
                'VES', 
                pago.tipo::tipo_metodo_pago, 
                pago.numero_tarjeta, 
                pago.fecha_vencimiento, 
                pago.banco,
                COALESCE(pago.guardar_como_favorito, FALSE),
                u.fk_cliente
            FROM usuario u WHERE u.clave = p_usuario_id
            RETURNING clave INTO v_metodo_pago_id;
        END IF;

        -- Insertar el pago
        INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online)
        VALUES (CURRENT_DATE, pago.monto, v_tasa_cambio_id, v_metodo_pago_id, v_venta_id);

        -- Para puntos, descontar del cliente (las ventas online NO generan puntos)
        IF pago.tipo = 'Puntos' AND pago.puntos_usados > 0 THEN
            UPDATE cliente 
            SET puntos_acumulados = puntos_acumulados - pago.puntos_usados
            FROM usuario u
            WHERE cliente.clave = u.fk_cliente AND u.clave = p_usuario_id;
        END IF;
    END LOOP;
    
    -- Crear estado inicial
    SELECT clave INTO v_estado_inicial_id
    FROM estatus 
    WHERE estatus.estado = 'procesando' AND estatus.aplicable_a = 'venta online'
    LIMIT 1;
    
    INSERT INTO historico (fecha, fk_estatus, fk_venta_online, comentario)
    VALUES (NOW(), v_estado_inicial_id, v_venta_id, 'Orden recibida y procesando');
    
    -- Retornar resumen
    RETURN QUERY
    SELECT 
        v_venta_id,
        v_monto_subtotal,
        v_monto_descuentos,
        v_costo_envio,
        v_monto_total,
        'procesando'::VARCHAR(50);
END;
$$;

-- 5. Actualizar estado de envío
CREATE OR REPLACE FUNCTION actualizar_estado_envio(
    p_venta_id INT,
    p_nuevo_estado VARCHAR(50),
    p_comentario TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado_id INT;
    v_estado_actual VARCHAR(50);
    v_fecha_estado_actual TIMESTAMP;
BEGIN
    -- Obtener estado actual
    SELECT e.estado, h.fecha
    INTO v_estado_actual, v_fecha_estado_actual
    FROM historico h
    JOIN estatus e ON h.fk_estatus = e.clave
    WHERE h.fk_venta_online = p_venta_id
    ORDER BY h.fecha DESC
    LIMIT 1;
    
    -- Validar transición de estados
    IF v_estado_actual = 'procesando' AND p_nuevo_estado = 'listo para entrega' THEN
        -- Validar que no hayan pasado más de 2 horas
        IF (NOW() - v_fecha_estado_actual) > INTERVAL '2 hours' THEN
            RAISE EXCEPTION 'Han pasado más de 2 horas desde el estado procesando';
        END IF;
    ELSIF v_estado_actual = 'entregado' THEN
        RAISE EXCEPTION 'La orden ya fue entregada y no puede cambiar de estado';
    END IF;
    
    -- Obtener ID del nuevo estado
    SELECT clave INTO v_estado_id
    FROM estatus
    WHERE estado = p_nuevo_estado AND aplicable_a = 'venta online';
    
    IF v_estado_id IS NULL THEN
        RAISE EXCEPTION 'Estado % no válido para venta online', p_nuevo_estado;
    END IF;
    
    -- Insertar nuevo estado
    INSERT INTO historico (fecha, fk_estatus, fk_venta_online, comentario)
    VALUES (NOW(), v_estado_id, p_venta_id, p_comentario);
    
    RETURN TRUE;
END;
$$;

-- 6. Obtener tracking de envío
CREATE OR REPLACE FUNCTION obtener_tracking_envio(p_venta_id INT)
RETURNS TABLE (
    estado VARCHAR(50),
    fecha TIMESTAMP,
    comentario TEXT,
    es_estado_actual BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH estados_ordenados AS (
        SELECT 
            e.estado,
            h.fecha,
            h.comentario,
            ROW_NUMBER() OVER (ORDER BY h.fecha DESC) as rn
        FROM historico h
        JOIN estatus e ON h.fk_estatus = e.clave
        WHERE h.fk_venta_online = p_venta_id
        ORDER BY h.fecha DESC
    )
    SELECT 
        estado,
        fecha,
        comentario,
        (rn = 1) as es_estado_actual
    FROM estados_ordenados;
END;
$$;

-- =============================================
-- PROCEDIMIENTOS PARA OFERTAS
-- =============================================

-- Drops para ofertas
DROP FUNCTION IF EXISTS obtener_ofertas_activas();
DROP FUNCTION IF EXISTS crear_oferta(INT, INT, DATE, DATE);
DROP FUNCTION IF EXISTS validar_periodo_oferta_proc(INT, DATE);
DROP FUNCTION IF EXISTS eliminar_oferta(INT);
DROP FUNCTION IF EXISTS obtener_historial_ofertas(INT);

-- 1. Obtener ofertas activas
CREATE OR REPLACE FUNCTION obtener_ofertas_activas()
RETURNS TABLE (
    oferta_id INT,
    presentacion_id INT,
    presentacion_nombre VARCHAR(50),
    cerveza_nombre VARCHAR(50),
    precio_original DECIMAL(10,2),
    porcentaje_descuento INT,
    precio_oferta DECIMAL(10,2),
    fecha_inicio DATE,
    fecha_fin DATE,
    dias_restantes INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.clave as oferta_id,
        p.clave as presentacion_id,
        p.nombre as presentacion_nombre,
        c.nombre as cerveza_nombre,
        p.precio as precio_original,
        o.porcentaje_descuento,
        ROUND(p.precio * (1 - o.porcentaje_descuento::DECIMAL / 100), 2) as precio_oferta,
        o.fecha_inicio,
        o.fecha_fin,
        (o.fecha_fin - CURRENT_DATE)::INT as dias_restantes
    FROM oferta o
    JOIN presentacion p ON o.fk_presentacion = p.clave
    JOIN cerveza c ON p.fk_cerveza = c.clave
    WHERE CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin
    ORDER BY o.fecha_fin;
END;
$$;

-- 2. Crear nueva oferta
CREATE OR REPLACE FUNCTION crear_oferta(
    p_presentacion_id INT,
    p_porcentaje_descuento INT,
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_oferta_id INT;
BEGIN
    -- Validar período de 30 días
    IF NOT validar_periodo_oferta_proc(p_presentacion_id, p_fecha_inicio) THEN
        RAISE EXCEPTION 'Debe esperar al menos 30 días después de la última oferta para este producto';
    END IF;
    
    -- Validar porcentaje
    IF p_porcentaje_descuento <= 0 OR p_porcentaje_descuento >= 100 THEN
        RAISE EXCEPTION 'El porcentaje de descuento debe estar entre 1 y 99';
    END IF;
    
    -- Validar fechas
    IF p_fecha_inicio > p_fecha_fin THEN
        RAISE EXCEPTION 'La fecha de inicio debe ser anterior a la fecha de fin';
    END IF;
    
    -- Crear oferta
    INSERT INTO oferta (porcentaje_descuento, fecha_inicio, fecha_fin, fk_presentacion)
    VALUES (p_porcentaje_descuento, p_fecha_inicio, p_fecha_fin, p_presentacion_id)
    RETURNING clave INTO v_oferta_id;
    
    RETURN v_oferta_id;
END;
$$;

-- 3. Validar período de oferta (función auxiliar)
CREATE OR REPLACE FUNCTION validar_periodo_oferta_proc(
    p_presentacion_id INT,
    p_fecha_inicio DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_ultima_fecha_fin DATE;
BEGIN
    -- Obtener fecha fin de la última oferta
    SELECT MAX(fecha_fin) INTO v_ultima_fecha_fin
    FROM oferta
    WHERE fk_presentacion = p_presentacion_id;
    
    -- Si no hay ofertas previas, permitir
    IF v_ultima_fecha_fin IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Verificar que hayan pasado 30 días
    RETURN (p_fecha_inicio - v_ultima_fecha_fin) >= 30;
END;
$$;

-- 4. Eliminar oferta
CREATE OR REPLACE FUNCTION eliminar_oferta(p_oferta_id INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    -- Solo permitir eliminar ofertas futuras
    IF EXISTS (
        SELECT 1 FROM oferta 
        WHERE clave = p_oferta_id 
        AND fecha_inicio <= CURRENT_DATE
    ) THEN
        RAISE EXCEPTION 'No se pueden eliminar ofertas que ya iniciaron';
    END IF;
    
    DELETE FROM oferta WHERE clave = p_oferta_id;
    
    RETURN FOUND;
END;
$$;

-- 5. Obtener historial de ofertas de una presentación
CREATE OR REPLACE FUNCTION obtener_historial_ofertas(p_presentacion_id INT)
RETURNS TABLE (
    oferta_id INT,
    porcentaje_descuento INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado VARCHAR(20),
    ventas_durante_oferta BIGINT,
    ingresos_durante_oferta DECIMAL(15,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_oferta AS (
        SELECT 
            o.clave as oferta_id,
            COUNT(DISTINCT COALESCE(dvo.clave, dvf.clave, dve.clave)) as ventas,
            SUM(
                COALESCE(dvo.cantidad * dvo.precio_unitario, 0) +
                COALESCE(dvf.cantidad * dvf.precio_unitario, 0) +
                COALESCE(dve.cantidad * dve.precio_unitario, 0)
            ) as ingresos
        FROM oferta o
        LEFT JOIN almacen a ON a.fk_presentacion = o.fk_presentacion
        LEFT JOIN detalle_venta_online dvo ON dvo.fk_almacen = a.clave
        LEFT JOIN venta_online vo ON dvo.fk_venta_online = vo.clave 
            AND vo.fecha BETWEEN o.fecha_inicio AND o.fecha_fin
        
        LEFT JOIN inventario_tienda it ON it.fk_presentacion = o.fk_presentacion
        LEFT JOIN detalle_venta_fisica dvf ON dvf.fk_inventario_tienda = it.clave
        LEFT JOIN venta_tienda_fisica vf ON dvf.fk_venta_tienda_fisica = vf.clave 
            AND vf.fecha BETWEEN o.fecha_inicio AND o.fecha_fin
        
        LEFT JOIN inventario_evento ie ON ie.fk_presentacion = o.fk_presentacion
        LEFT JOIN detalle_venta_evento dve ON dve.fk_inventario_evento = ie.clave
        LEFT JOIN venta_evento ve ON dve.fk_venta_evento = ve.clave 
            AND ve.fecha BETWEEN o.fecha_inicio AND o.fecha_fin
        
        WHERE o.fk_presentacion = p_presentacion_id
        GROUP BY o.clave
    )
    SELECT 
        o.clave as oferta_id,
        o.porcentaje_descuento,
        o.fecha_inicio,
        o.fecha_fin,
        CASE 
            WHEN CURRENT_DATE < o.fecha_inicio THEN 'programada'::VARCHAR(20)
            WHEN CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin THEN 'activa'::VARCHAR(20)
            ELSE 'finalizada'::VARCHAR(20)
        END as estado,
        COALESCE(vo.ventas, 0) as ventas_durante_oferta,
        COALESCE(vo.ingresos, 0) as ingresos_durante_oferta
    FROM oferta o
    LEFT JOIN ventas_oferta vo ON o.clave = vo.oferta_id
    WHERE o.fk_presentacion = p_presentacion_id
    ORDER BY o.fecha_inicio DESC;
END;
$$;

-- =============================================
-- FUNCIONES ADICIONALES PARA REPORTES DEL DASHBOARD
-- =============================================

-- Reporte de ventas por canal de distribución
CREATE OR REPLACE FUNCTION reporte_ventas_por_canal(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    canal VARCHAR(20),
    cantidad_ventas BIGINT,
    monto_total DECIMAL(15,2),
    porcentaje_del_total DECIMAL(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ventas_por_canal AS (
        SELECT 
            'Online' as canal,
            COUNT(*) as ventas,
            SUM(vo.monto_total) as monto
        FROM venta_online vo
        WHERE vo.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        SELECT 
            'Tienda Física' as canal,
            COUNT(*) as ventas,
            SUM(vtf.total_venta) as monto
        FROM venta_tienda_fisica vtf
        WHERE vtf.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
        
        UNION ALL
        
        SELECT 
            'Eventos' as canal,
            COUNT(*) as ventas,
            SUM(ve.monto_total) as monto
        FROM venta_evento ve
        WHERE ve.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ),
    total AS (
        SELECT SUM(monto) as total_general FROM ventas_por_canal
    )
    SELECT 
        vpc.canal,
        vpc.ventas as cantidad_ventas,
        vpc.monto as monto_total,
        ROUND((vpc.monto / NULLIF(t.total_general, 0) * 100)::NUMERIC, 2) as porcentaje_del_total
    FROM ventas_por_canal vpc
    CROSS JOIN total t
    ORDER BY vpc.monto DESC;
END;
$$;

-- Reporte de inventario actual
CREATE OR REPLACE FUNCTION reporte_inventario_actual()
RETURNS TABLE (
    tipo_inventario VARCHAR(20),
    presentacion_id INT,
    presentacion_nombre VARCHAR(50),
    cerveza_nombre VARCHAR(50),
    tipo_cerveza VARCHAR(50),
    stock_actual INT,
    valor_inventario DECIMAL(10,2),
    estado_stock VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    -- Almacén central
    SELECT 
        'Almacén'::VARCHAR(20) as tipo_inventario,
        p.clave as presentacion_id,
        p.nombre as presentacion_nombre,
        c.nombre as cerveza_nombre,
        tc.nombre as tipo_cerveza,
        a.cantidad_unidades as stock_actual,
        (a.cantidad_unidades * p.precio) as valor_inventario,
        CASE 
            WHEN a.cantidad_unidades = 0 THEN 'Sin Stock'::VARCHAR(20)
            WHEN a.cantidad_unidades <= 100 THEN 'Stock Bajo'::VARCHAR(20)
            WHEN a.cantidad_unidades <= 500 THEN 'Stock Normal'::VARCHAR(20)
            ELSE 'Stock Alto'::VARCHAR(20)
        END as estado_stock
    FROM almacen a
    JOIN presentacion p ON a.fk_presentacion = p.clave
    JOIN cerveza c ON p.fk_cerveza = c.clave
    JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
    
    UNION ALL
    
    -- Inventario de tiendas (agregado)
    SELECT 
        'Tienda'::VARCHAR(20) as tipo_inventario,
        p.clave as presentacion_id,
        p.nombre as presentacion_nombre,
        c.nombre as cerveza_nombre,
        tc.nombre as tipo_cerveza,
        SUM(it.cantidad)::INT as stock_actual,
        SUM(it.cantidad * p.precio) as valor_inventario,
        CASE 
            WHEN SUM(it.cantidad) = 0 THEN 'Sin Stock'::VARCHAR(20)
            WHEN SUM(it.cantidad) <= 20 THEN 'Stock Bajo'::VARCHAR(20)
            WHEN SUM(it.cantidad) <= 100 THEN 'Stock Normal'::VARCHAR(20)
            ELSE 'Stock Alto'::VARCHAR(20)
        END as estado_stock
    FROM inventario_tienda it
    JOIN presentacion p ON it.fk_presentacion = p.clave
    JOIN cerveza c ON p.fk_cerveza = c.clave
    JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
    GROUP BY p.clave, p.nombre, c.nombre, tc.nombre
    
    ORDER BY tipo_inventario, cerveza_nombre, presentacion_nombre;
END;
$$;

-- Reporte de mejores productos (Top 10) - Ya existe en el archivo original
-- Función reporte_tendencia_ventas ya existe al final del archivo original