/** Controlador de autenticación y autorización */
const pool = require('../config/db');

/**
 * Función para derivar permisos especiales basados en permisos atómicos
 */
function deriveSpecialPermissions(atomicPermissions) {
    const specialPermissions = [];
    const permissionNames = atomicPermissions.map(p => p.nombre);
    
    // Dashboard administrativo - si tiene permisos de gestión de usuarios o roles
    if (permissionNames.includes('consultar usuario') || permissionNames.includes('consultar rol')) {
        specialPermissions.push({
            nombre: 'ver dashboard admin',
            descripcion: 'Acceso al dashboard administrativo'
        });
    }
    
    // Gestión de estados de reposición
    if (permissionNames.includes('consultar reposicion') && permissionNames.includes('modificar reposicion')) {
        specialPermissions.push({
            nombre: 'gestionar estados reposicion',
            descripcion: 'Gestionar estados de reposiciones'
        });
    }
    
    // Gestión de estados de compra
    if (permissionNames.includes('consultar compra') && permissionNames.includes('modificar compra')) {
        specialPermissions.push({
            nombre: 'gestionar estados compra',
            descripcion: 'Gestionar estados de órdenes de compra'
        });
    }
    
    // Gestión de estados de venta online
    if (permissionNames.includes('consultar venta online') && permissionNames.includes('modificar venta online')) {
        specialPermissions.push({
            nombre: 'gestionar estados venta online',
            descripcion: 'Gestionar estados de ventas online'
        });
    }
    
    // Gestión de roles y privilegios
    if (permissionNames.includes('consultar rol') && permissionNames.includes('modificar rol') && 
        permissionNames.includes('consultar privilegio')) {
        specialPermissions.push({
            nombre: 'gestionar roles privilegios',
            descripcion: 'Gestión completa de roles y privilegios'
        });
    }
    
    // Reportes avanzados
    if (permissionNames.includes('consultar venta tienda fisica') || 
        permissionNames.includes('consultar venta online') || 
        permissionNames.includes('consultar venta evento')) {
        specialPermissions.push({
            nombre: 'ver reportes ventas',
            descripcion: 'Acceso a reportes de ventas'
        });
    }
    
    if (permissionNames.includes('consultar inventario') || permissionNames.includes('consultar almacen')) {
        specialPermissions.push({
            nombre: 'ver reportes inventario',
            descripcion: 'Acceso a reportes de inventario'
        });
    }
    
    return specialPermissions;
}

/**
 * Login de usuario con autenticación completa
 */
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Usuario y contraseña son requeridos' 
        });
    }

    try {
        const query = `
            SELECT 
                u.clave as usuario_id,
                u.username,
                u.fk_rol,
                r.nombre as rol_nombre,
                -- Información de empleado si aplica
                CASE WHEN u.fk_empleado IS NOT NULL THEN 'empleado' 
                     WHEN u.fk_miembro IS NOT NULL THEN 'miembro'
                     WHEN u.fk_cliente IS NOT NULL THEN 'cliente'
                     ELSE NULL END as tipo_entidad,
                -- Datos del empleado
                e.ci as empleado_ci,
                e.primer_nombre as empleado_primer_nombre,
                e.primer_apellido as empleado_primer_apellido,
                e.segundo_nombre as empleado_segundo_nombre,
                e.segundo_apellido as empleado_segundo_apellido,
                -- Datos del cargo y departamento del empleado
                c.nombre as cargo_nombre,
                d.nombre as departamento_nombre,
                -- Datos del miembro
                m.rif as miembro_rif,
                m.razon_social as miembro_razon_social,
                -- Datos del cliente
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
            WHERE u.username = $1 AND u.contrasena = $2
        `;

        const userResult = await pool.query(query, [username, password]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas' 
            });
        }

        const userData = userResult.rows[0];

        // Obtener permisos atómicos del usuario
        const permissionsQuery = `
            SELECT p.clave, p.nombre, p.descripcion
            FROM privilegio p
            JOIN rol_pri rp ON p.clave = rp.fk_privilegio
            WHERE rp.fk_rol = $1
            ORDER BY p.nombre
        `;

        const permissionsResult = await pool.query(permissionsQuery, [userData.fk_rol]);
        const atomicPermissions = permissionsResult.rows;

        // Derivar permisos especiales
        const specialPermissions = deriveSpecialPermissions(atomicPermissions);

        // Combinar permisos atómicos y especiales
        const allPermissions = [...atomicPermissions, ...specialPermissions];

        // Construir respuesta del usuario
        const user = {
            id: userData.usuario_id,
            username: userData.username,
            tipo_entidad: userData.tipo_entidad,
            rol: {
                id: userData.fk_rol,
                nombre: userData.rol_nombre
            },
            permisos: allPermissions,
            entidad: null
        };

        // Agregar información específica según el tipo de entidad
        if (userData.tipo_entidad === 'empleado') {
            user.entidad = {
                ci: userData.empleado_ci,
                primer_nombre: userData.empleado_primer_nombre,
                primer_apellido: userData.empleado_primer_apellido,
                segundo_nombre: userData.empleado_segundo_nombre,
                segundo_apellido: userData.empleado_segundo_apellido,
                cargo: userData.cargo_nombre,
                departamento: userData.departamento_nombre
            };
        } else if (userData.tipo_entidad === 'miembro') {
            user.entidad = {
                rif: userData.miembro_rif,
                razon_social: userData.miembro_razon_social
            };
        } else if (userData.tipo_entidad === 'cliente') {
            user.entidad = {
                id: userData.cliente_id,
                primer_nombre: userData.cliente_primer_nombre,
                primer_apellido: userData.cliente_primer_apellido
            };
        }

        res.json({
            success: true,
            message: 'Login exitoso',
            user: user
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
};

/**
 * Verificar si un usuario tiene un permiso específico
 */
exports.verificarPermiso = async (req, res) => {
    const { usuario_id, permiso } = req.body;

    if (!usuario_id || !permiso) {
        return res.status(400).json({ 
            success: false, 
            message: 'Usuario ID y permiso son requeridos' 
        });
    }

    try {
        // Obtener permisos atómicos del usuario
        const query = `
            SELECT p.nombre
            FROM privilegio p
            JOIN rol_pri rp ON p.clave = rp.fk_privilegio
            JOIN usuario u ON rp.fk_rol = u.fk_rol
            WHERE u.clave = $1
        `;

        const result = await pool.query(query, [usuario_id]);
        const atomicPermissions = result.rows;

        // Derivar permisos especiales
        const specialPermissions = deriveSpecialPermissions(atomicPermissions);
        const allPermissions = [...atomicPermissions, ...specialPermissions];

        const hasPermission = allPermissions.some(p => p.nombre === permiso);

        res.json({
            success: true,
            hasPermission: hasPermission
        });

    } catch (error) {
        console.error('Error verificando permiso:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
};

/**
 * Obtener perfil completo de usuario
 */
exports.getPerfilUsuario = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const query = `
            SELECT 
                u.clave as usuario_id,
                u.username,
                r.nombre as rol_nombre,
                CASE WHEN u.fk_empleado IS NOT NULL THEN 'empleado' 
                     WHEN u.fk_miembro IS NOT NULL THEN 'miembro'
                     WHEN u.fk_cliente IS NOT NULL THEN 'cliente'
                     ELSE NULL END as tipo_entidad
            FROM usuario u
            JOIN rol r ON u.fk_rol = r.clave
            WHERE u.clave = $1
        `;

        const userResult = await pool.query(query, [usuario_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuario no encontrado' 
            });
        }

        const userData = userResult.rows[0];

        // Obtener permisos
        const permissionsQuery = `
            SELECT p.clave, p.nombre, p.descripcion
            FROM privilegio p
            JOIN rol_pri rp ON p.clave = rp.fk_privilegio
            JOIN usuario u ON rp.fk_rol = u.fk_rol
            WHERE u.clave = $1
            ORDER BY p.nombre
        `;

        const permissionsResult = await pool.query(permissionsQuery, [usuario_id]);
        const atomicPermissions = permissionsResult.rows;
        const specialPermissions = deriveSpecialPermissions(atomicPermissions);

        res.json({
            success: true,
            user: {
                ...userData,
                permisos: [...atomicPermissions, ...specialPermissions]
            }
        });

    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
}; 