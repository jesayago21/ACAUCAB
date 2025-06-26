const db = require('../config/db');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_todos_los_usuarios()');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

// Obtener un solo usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const { clave } = req.params;
        const result = await db.query('SELECT * FROM obtener_usuario_por_id($1)', [clave]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    const { username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente } = req.body;

    const relaciones = [fk_empleado, fk_miembro, fk_cliente].filter(x => x != null && x !== '');
    if (relaciones.length !== 1) {
        return res.status(400).json({ message: 'Debe especificar exactamente uno de: fk_empleado, fk_miembro o fk_cliente.' });
    }
    if (!username || !contrasena || !fk_rol) {
        return res.status(400).json({ message: 'Faltan datos obligatorios: username, contrasena, fk_rol.' });
    }

    try {
        const result = await db.query(
            'SELECT * FROM crear_usuario($1, $2, $3, $4, $5, $6)',
            [username, contrasena, fk_rol, fk_empleado || null, fk_miembro || null, fk_cliente || null]
        );
        res.status(201).json({ success: true, message: 'Usuario creado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    const { clave } = req.params;
    const { username, contrasena, fk_rol, fk_empleado, fk_miembro, fk_cliente } = req.body;

    const relaciones = [fk_empleado, fk_miembro, fk_cliente].filter(x => x != null && x !== '');
    if (relaciones.length > 1) {
        return res.status(400).json({ message: 'Un usuario solo puede estar asociado a una entidad (empleado, miembro o cliente).' });
    }
     if (!username || !fk_rol) {
        return res.status(400).json({ message: 'Username y rol son obligatorios.' });
    }

    try {
        const result = await db.query(
            'SELECT * FROM actualizar_usuario($1, $2, $3, $4, $5, $6, $7)',
            [clave, username, contrasena || null, fk_rol, fk_empleado || null, fk_miembro || null, fk_cliente || null]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    const { clave } = req.params;
    try {
        const result = await db.query('SELECT eliminar_usuario($1) as deleted_id', [clave]);
        if (result.rows[0].deleted_id === null) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

// Asignar rol a usuario
exports.assignRoleToUser = async (req, res) => {
    const { clave } = req.params;
    const { roleId } = req.body;
    try {
        const result = await db.query('SELECT * FROM asignar_rol_a_usuario($1, $2)', [clave, roleId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Rol asignado exitosamente.', user: result.rows[0] });
    } catch (error) {
        console.error('Error al asignar rol:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

// Obtener empleados disponibles
exports.getAvailableEmployees = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_empleados_disponibles()');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener empleados disponibles:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

// Obtener miembros disponibles
exports.getAvailableMembers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_miembros_disponibles()');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener miembros disponibles:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

// Obtener clientes disponibles
exports.getAvailableClients = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_clientes_disponibles()');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener clientes disponibles:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};