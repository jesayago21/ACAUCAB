const db = require('../config/db'); // Asegúrate de que esta ruta sea correcta

/**
 * Crea un nuevo rol en la base de datos.
 */
exports.createRole = async (req, res) => {
    const { nombre } = req.body;

    // Validación básica
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del rol es requerido.' });
    }
    try {
        const result = await db.query(
            'INSERT INTO rol (nombre) VALUES ($1) RETURNING clave, nombre',
            [nombre]
        );
        // Retornamos el rol creado con todos sus campos
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear el rol:', error);
        // Manejo de error para nombres de rol duplicados
        if (error.code === '23505') { // Código de error para unique_violation en PostgreSQL
            return res.status(409).json({ message: 'Ya existe un rol con este nombre.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear el rol.' });
    }
};

/**
 * Obtiene todos los roles de la base de datos.
 */
exports.getAllRoles = async (req, res) => {
    try {
        // Selecciona clave, nombre y descripcion para mostrar la información completa del rol
        const result = await db.query('SELECT clave, nombre FROM rol ORDER BY nombre ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los roles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los roles.' });
    }
};

/**
 * Obtiene un rol específico por su ID.
 */
exports.getRoleById = async (req, res) => {
    // Asegúrate de que el parámetro de la ruta en roleRoutes.js sea ':clave' o ':id' y lo manejes aquí.
    // Si en tu ruta pones router.get('/:id', ...), aquí deberías usar const { id } = req.params;
    // Para consistencia con tu tabla, usaremos 'clave' aquí.
    const { id } = req.params;

    try {
        // Selecciona clave, nombre y descripcion para mostrar la información completa del rol
        const result = await db.query('SELECT clave, nombre FROM rol WHERE clave = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el rol por clave:', error); // Cambiado a 'clave' para consistencia
        res.status(500).json({ message: 'Error interno del servidor al obtener el rol.' });
    }
};

/**
 * Actualiza un rol existente por su ID.
 * Requiere 'name' y/o 'description' en el cuerpo de la solicitud.
 */
exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del rol es requerido.' });
    }

    try {
        const result = await db.query(
            'UPDATE rol SET nombre = $1 WHERE clave = $2 RETURNING clave, nombre',
            [nombre, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado para actualizar.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el rol:', error);
        if (error.code === '23505') { // Código de error para unique_violation
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
        const result = await db.query('DELETE FROM rol WHERE clave = $1 RETURNING clave', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado para eliminar.' });
        }
        res.status(200).json({ message: 'Rol eliminado exitosamente.', id: result.rows[0].clave });
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        // Podrías añadir manejo de error si el rol está siendo referenciado por usuarios
        if (error.code === '23503') { // Código de error para foreign_key_violation en PostgreSQL
            return res.status(409).json({ message: 'No se puede eliminar el rol porque está asociado a uno o más usuarios.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al eliminar el rol.' });
    }
};


exports.assignPrivilegesToRole = async (req, res) => {
    const { id } = req.params;
    const { privilegiosClave } = req.body;

    // Validación básica
    if (!Array.isArray(privilegiosClave)) {
        return res.status(400).json({ message: 'El campo "privilegiosClave" debe ser un array de IDs de privilegios.' });
    }

    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        // 1. Verificar si el rol existe
        const roleExists = await client.query('SELECT 1 FROM rol WHERE clave = $1', [id]);
        if (roleExists.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }

        // 2. Eliminar todas las asignaciones de privilegios existentes para este rol
        await client.query('DELETE FROM rol_pri WHERE fk_rol = $1', [id]);

        // 3. Insertar los nuevos privilegios solo si el array no está vacío
        if (privilegiosClave.length > 0) {
            // Construir la parte VALUES de la consulta INSERT dinámicamente
            const values = privilegiosClave.map((privilegioClave, index) => `($1, $${index + 2}, CURRENT_DATE)`).join(',');
            const queryParams = [id, ...privilegiosClave];

            await client.query(
                `INSERT INTO rol_pri (fk_rol, fk_privilegio, fecha) VALUES ${values}`,
                queryParams
            );
        }

        await client.query('COMMIT');
        res.status(200).json({ message: 'Privilegios asignados al rol exitosamente.' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error asignando privilegios al rol:', error);
        if (error.code === '23503') { // foreign_key_violation
            return res.status(400).json({ message: 'Uno o más IDs de privilegios proporcionados no son válidos.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al asignar privilegios.' });
    } finally {
        client.release();
    }
};

exports.getPrivilegesByRoleId = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el rol existe
        const roleExists = await db.query('SELECT 1 FROM rol WHERE clave = $1', [id]);
        if (roleExists.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }

        const result = await db.query(
            `SELECT p.clave, p.nombre, p.descripcion
             FROM privilegio p
             JOIN rol_pri rp ON p.clave = rp.fk_privilegio
             WHERE rp.fk_rol = $1
             ORDER BY p.nombre ASC`,
            [id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error obteniendo privilegios por clave de rol:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener privilegios por rol.' });
    }
};