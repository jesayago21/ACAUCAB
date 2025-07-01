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

-- 5. Crear Venta Online
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
    DEFAULT_TIENDA_ONLINE_ID INT := 1; -- Asumiendo que existe una tienda online con id 1
BEGIN
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

    -- Insertar los registros de pago asociados a la venta
    FOR pago IN SELECT * FROM json_to_recordset(p_pagos) AS x(metodo_pago_id INT, monto NUMERIC, tasa_cambio_id INT)
    LOOP
        INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_online)
        VALUES (CURRENT_DATE, pago.monto, pago.tasa_cambio_id, pago.metodo_pago_id, v_venta_id);
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