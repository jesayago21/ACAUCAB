const pool = require('../config/db');

/**
 * Crea un nuevo rol.
 */
exports.createRole = async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del rol es requerido.' });
    }
    try {
        const result = await pool.query('SELECT * FROM crear_rol($1)', [nombre]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear el rol:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Ya existe un rol con este nombre.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear el rol.' });
    }
};

/**
 * Obtiene todos los roles.
 */
exports.getAllRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM obtener_todos_los_roles()');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los roles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los roles.' });
    }
};

/**
 * Obtiene un rol por su ID.
 */
exports.getRoleById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM obtener_rol_por_id($1)', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el rol por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el rol.' });
    }
};

/**
 * Actualiza un rol existente por su ID.
 */
exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del rol es requerido.' });
    }
    try {
        const result = await pool.query('SELECT * FROM actualizar_rol($1, $2)', [id, nombre]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado para actualizar.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el rol:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Ya existe un rol con este nombre.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar el rol.' });
    }
};

/**
 * Elimina un rol por su ID.
 */
exports.deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT eliminar_rol($1) as clave', [id]);
        if (result.rows.length === 0 || result.rows[0].clave === null) {
            return res.status(404).json({ message: 'Rol no encontrado para eliminar.' });
        }
        res.status(200).json({ message: 'Rol eliminado exitosamente.', id: result.rows[0].clave });
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        if (error.code === '23503') {
            return res.status(409).json({ message: 'No se puede eliminar el rol porque está asociado a uno o más usuarios.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al eliminar el rol.' });
    }
};

/**
 * Asigna una lista de privilegios a un rol.
 */
exports.assignPrivilegesToRole = async (req, res) => {
    const { roleId } = req.params;
    const { privilegeIds } = req.body;

    if (!Array.isArray(privilegeIds)) {
        return res.status(400).json({ message: 'El campo "privilegeIds" debe ser un array de IDs de privilegios.' });
    }

    try {
        await pool.query('CALL asignar_privilegios_a_rol($1, $2::INT[])', [roleId, privilegeIds]);
        res.status(200).json({ message: 'Privilegios asignados al rol exitosamente.' });
    } catch (error) {
        console.error('Error asignando privilegios al rol:', error);
        if (error.code === '23503') { // foreign_key_violation
            return res.status(400).json({ message: 'Uno o más IDs de rol o privilegios proporcionados no son válidos.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al asignar privilegios.' });
    }
};

/**
 * Obtiene todos los privilegios asociados a un rol.
 */
exports.getPrivilegesByRoleId = async (req, res) => {
    const { roleId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM obtener_privilegios_por_rol_id($1)', [roleId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error obteniendo privilegios por ID de rol:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener privilegios por rol.' });
    }
};