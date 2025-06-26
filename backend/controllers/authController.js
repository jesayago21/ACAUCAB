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
        const userResult = await pool.query('SELECT * FROM login_usuario($1, $2)', [username, password]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas' 
            });
        }

        const userData = userResult.rows[0];

        // Obtener permisos atómicos del usuario
        const permissionsResult = await pool.query('SELECT * FROM obtener_permisos_por_rol($1)', [userData.fk_rol]);
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
        const result = await pool.query('SELECT * FROM obtener_permisos_por_usuario($1)', [usuario_id]);
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