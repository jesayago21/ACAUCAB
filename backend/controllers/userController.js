const db = require('../config/db');

// Función para asignar un rol a un usuario (relación 1:1)
exports.assignRoleToUser = async (req, res) => {
    const { userId } = req.params;
    const { roleId } = req.body; // Solo un ID de rol

    try {
        // 1. Verificar que el usuario existe
        const userExists = await db.query('SELECT clave FROM usuario WHERE clave = $1', [userId]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 2. Verificar que el rol existe
        const roleExists = await db.query('SELECT clave FROM rol WHERE clave = $1', [roleId]);
        if (roleExists.rows.length === 0) {
            return res.status(400).json({ message: `Rol con ID ${roleId} no existe` });
        }

        // 3. Actualizar el rol del usuario (relación 1:1)
        const updateResult = await db.query(
            'UPDATE usuario SET fk_rol = $1 WHERE clave = $2 RETURNING *',
            [roleId, userId]
        );

        res.status(200).json({ 
            message: 'Rol asignado exitosamente',
            user: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error al asignar rol:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Listar todos los usuarios con información completa
exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                u.clave,
                u.username,
                r.clave as rol_id,
                r.nombre AS rol,
                u.fk_empleado,
                u.fk_miembro,
                u.fk_cliente,
                -- Información del empleado
                CASE 
                    WHEN u.fk_empleado IS NOT NULL THEN 
                        json_build_object(
                            'ci', e.ci,
                            'primer_nombre', e.primer_nombre,
                            'segundo_nombre', e.segundo_nombre,
                            'primer_apellido', e.primer_apellido,
                            'segundo_apellido', e.segundo_apellido,
                            'telefono', t_emp.telefono_completo,
                            'fecha_nacimiento', e.fecha_nacimiento,
                            'descripcion', e.descripcion,
                            'tipo_entidad', 'empleado'
                        )
                    ELSE NULL
                END as entidad_empleado,
                -- Información del miembro
                CASE 
                    WHEN u.fk_miembro IS NOT NULL THEN 
                        json_build_object(
                            'rif', m.rif,
                            'razon_social', m.razon_social,
                            'denominacion_comercial', m.denominacion_comercial,
                            'direccion_fiscal', m.direccion_fiscal,
                            'direccion_fisica', m.direccion_fisica,
                            'fecha_afiliacion', m.fecha_afiliacion,
                            'telefono', t_miem.telefono_completo,
                            'email', ce_miem.direccion_email,
                            'tipo_entidad', 'miembro'
                        )
                    ELSE NULL
                END as entidad_miembro,
                -- Información del cliente
                CASE 
                    WHEN u.fk_cliente IS NOT NULL THEN 
                        json_build_object(
                            'clave', c.clave,
                            'rif', c.rif,
                            'tipo', c.tipo,
                            'puntos_acumulados', c.puntos_acumulados,
                            -- Campos para cliente natural
                            'ci', c.ci,
                            'primer_nombre', c.primer_nombre,
                            'segundo_nombre', c.segundo_nombre,
                            'primer_apellido', c.primer_apellido,
                            'segundo_apellido', c.segundo_apellido,
                            'direccion_habitacion', c.direccion_habitacion,
                            -- Campos para cliente jurídico
                            'razon_social', c.razon_social,
                            'denominacion_comercial', c.denominacion_comercial,
                            'url_pagina_web', c.url_pagina_web,
                            'capital_disponible', c.capital_disponible,
                            'direccion_fiscal', c.direccion_fiscal,
                            'direccion_fisica', c.direccion_fisica,
                            'telefono', t_cli.telefono_completo,
                            'email', ce_cli.direccion_email,
                            'tipo_entidad', 'cliente'
                        )
                    ELSE NULL
                END as entidad_cliente,
                -- Tipo de entidad
                CASE 
                    WHEN u.fk_empleado IS NOT NULL THEN 'empleado'
                    WHEN u.fk_miembro IS NOT NULL THEN 'miembro'
                    WHEN u.fk_cliente IS NOT NULL THEN 'cliente'
                    ELSE 'sin_asignar'
                END as tipo_entidad
            FROM usuario u
            JOIN rol r ON u.fk_rol = r.clave
            LEFT JOIN empleado e ON u.fk_empleado = e.ci
            LEFT JOIN miembro m ON u.fk_miembro = m.rif
            LEFT JOIN cliente c ON u.fk_cliente = c.clave
            -- Teléfonos
            LEFT JOIN (
                SELECT fk_empleado, CONCAT(codigo, '-', numero) as telefono_completo
                FROM telefono 
                WHERE fk_empleado IS NOT NULL
            ) t_emp ON u.fk_empleado = t_emp.fk_empleado
            LEFT JOIN (
                SELECT fk_miembro, CONCAT(codigo, '-', numero) as telefono_completo
                FROM telefono 
                WHERE fk_miembro IS NOT NULL
            ) t_miem ON u.fk_miembro = t_miem.fk_miembro
            LEFT JOIN (
                SELECT fk_cliente, CONCAT(codigo, '-', numero) as telefono_completo
                FROM telefono 
                WHERE fk_cliente IS NOT NULL
            ) t_cli ON u.fk_cliente = t_cli.fk_cliente
            -- Correos electrónicos
            LEFT JOIN correo_electronico ce_miem ON u.fk_miembro = ce_miem.fk_miembro
            LEFT JOIN correo_electronico ce_cli ON u.fk_cliente = ce_cli.fk_cliente
            ORDER BY u.clave ASC
        `);

        // Obtener permisos para cada usuario
        const usersWithPermissions = await Promise.all(
            result.rows.map(async (user) => {
                const permissionsResult = await db.query(`
                    SELECT p.clave, p.nombre, p.descripcion
                    FROM rol_pri rp
                    JOIN privilegio p ON rp.fk_privilegio = p.clave
                    WHERE rp.fk_rol = $1
                `, [user.rol_id]);

                return {
                    ...user,
                    entidad: user.entidad_empleado || user.entidad_miembro || user.entidad_cliente,
                    permisos: permissionsResult.rows
                };
            })
        );

        res.status(200).json(usersWithPermissions);
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Crear usuario
exports.createUser = async (req, res) => {
    const { username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente } = req.body;

    // Validar que solo uno de los campos de relación venga con valor
    const relaciones = [fk_empleado, fk_miembro, fk_cliente].filter(x => x !== undefined && x !== null);
    if (relaciones.length !== 1) {
        return res.status(400).json({ message: 'Debes especificar solo uno de: fk_empleado, fk_miembro o fk_cliente.' });
    }
    if (!username || !contrasena || !fk_rol) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    try {
        const result = await db.query(
            `INSERT INTO usuario (username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [username, contrasena, fk_rol, fk_empleado || null, fk_miembro || null, fk_cliente || null]
        );
        res.status(201).json({ success: true, message: 'Usuario creado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    const { clave } = req.params;
    const { username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente } = req.body;

    // Validar que solo uno de los campos de relación venga con valor
    const relaciones = [fk_empleado, fk_miembro, fk_cliente].filter(x => x !== undefined && x !== null);
    if (relaciones.length !== 1) {
        return res.status(400).json({ message: 'Debes especificar solo uno de: fk_empleado, fk_miembro o fk_cliente.' });
    }
    if (!username || !fk_rol) {
        return res.status(400).json({ message: 'Username y rol son obligatorios.' });
    }

    try {
        let query, params;
        
        // Si se proporciona contraseña, actualizarla también
        if (contrasena) {
            query = `UPDATE usuario SET username=$1, contrasena=$2, fk_rol=$3, fk_empleado=$4, fk_miembro=$5, fk_cliente=$6
                     WHERE clave=$7 RETURNING *`;
            params = [username, contrasena, fk_rol, fk_empleado || null, fk_miembro || null, fk_cliente || null, clave];
        } else {
            // No actualizar la contraseña si no se proporciona
            query = `UPDATE usuario SET username=$1, fk_rol=$2, fk_empleado=$3, fk_miembro=$4, fk_cliente=$5
                     WHERE clave=$6 RETURNING *`;
            params = [username, fk_rol, fk_empleado || null, fk_miembro || null, fk_cliente || null, clave];
        }

        const result = await db.query(query, params);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    const { clave } = req.params;
    try {
        const result = await db.query('DELETE FROM usuario WHERE clave=$1', [clave]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Obtener empleados disponibles
exports.getAvailableEmployees = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                e.ci, 
                e.primer_nombre, 
                e.segundo_nombre, 
                e.primer_apellido, 
                e.segundo_apellido,
                CONCAT(t.codigo, '-', t.numero) as telefono
            FROM empleado e
            LEFT JOIN usuario u ON e.ci = u.fk_empleado
            LEFT JOIN telefono t ON e.ci = t.fk_empleado
            WHERE u.fk_empleado IS NULL
            ORDER BY e.primer_nombre, e.primer_apellido
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener miembros disponibles
exports.getAvailableMembers = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                m.rif, 
                m.razon_social, 
                ce.direccion_email as email,
                CONCAT(t.codigo, '-', t.numero) as telefono
            FROM miembro m
            LEFT JOIN usuario u ON m.rif = u.fk_miembro
            LEFT JOIN correo_electronico ce ON m.rif = ce.fk_miembro
            LEFT JOIN telefono t ON m.rif = t.fk_miembro
            WHERE u.fk_miembro IS NULL
            ORDER BY m.razon_social
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener miembros:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener clientes disponibles
exports.getAvailableClients = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                c.clave, 
                c.primer_nombre, 
                c.segundo_nombre, 
                c.primer_apellido, 
                c.segundo_apellido, 
                c.ci,
                ce.direccion_email as email,
                CONCAT(t.codigo, '-', t.numero) as telefono
            FROM cliente c
            LEFT JOIN usuario u ON c.clave = u.fk_cliente
            LEFT JOIN correo_electronico ce ON c.clave = ce.fk_cliente
            LEFT JOIN telefono t ON c.clave = t.fk_cliente
            WHERE u.fk_cliente IS NULL
            ORDER BY c.primer_nombre, c.primer_apellido
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};