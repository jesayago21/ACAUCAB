const pool = require('../config/db'); // Asegúrate de que esta ruta sea correcta

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
        const result = await pool.query(
            'INSERT INTO rol (nombre) VALUES ($1, $2) RETURNING id, name',
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
        const result = await pool.query('SELECT clave, nombre FROM rol ORDER BY nombre ASC');
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
        const result = await pool.query('SELECT clave, nombre FROM rol WHERE clave = $1', [id]);

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
    const { clave } = req.params;
    const { nombre } = req.body;
    const queryParams = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
        query += `, nombre = $${paramIndex}`;
        queryParams.push(nombre);
        paramIndex++;
    }

    query += ` WHERE clave = $${paramIndex} RETURNING clave, nombre`;
    queryParams.push(clave);

    try {
        const result = await pool.query(query, queryParams);

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
    const { clave } = req.params;

    try {
        const result = await pool.query('DELETE FROM rol WHERE clave = $1 RETURNING clave', [clave]);

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
    const { rolClave } = req.params; // Usamos 'rolClave' para coincidir con el nombre de tu PK de rol
    const { privilegiosClave } = req.body; // Un array de claves de privilegios (ej: [1, 5, 8])

    // Validación básica
    if (!Array.isArray(privilegiosClave)) {
        return res.status(400).json({ message: 'El campo "privilegiosClave" debe ser un array de IDs de privilegios.' });
    }

    const client = await pool.connect(); // Obtener un cliente del pool para una transacción
    try {
        await client.query('BEGIN'); // Iniciar la transacción

        // 1. Opcional: Verificar si el rol existe
        const roleExists = await client.query('SELECT 1 FROM rol WHERE clave = $1', [rolClave]);
        if (roleExists.rows.length === 0) {
            await client.query('ROLLBACK'); // Deshacer la transacción si el rol no existe
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }

        // 2. Eliminar todas las asignaciones de privilegios existentes para este rol
        await client.query('DELETE FROM rol_privilegio WHERE rol_clave = $1', [rolClave]);

        // 3. Insertar los nuevos privilegios solo si el array no está vacío
        if (privilegiosClave.length > 0) {
            // Construir la parte VALUES de la consulta INSERT dinámicamente
            const values = privilegiosClave.map((privilegioClave, index) => `($1, $${index + 2})`).join(',');
            const queryParams = [rolClave, ...privilegiosClave];

            await client.query(
                `INSERT INTO rol_pri (rol_clave, privilegio_clave) VALUES ${values}`,
                queryParams
            );
        }

        await client.query('COMMIT'); // Confirmar la transacción
        res.status(200).json({ message: 'Privilegios asignados al rol exitosamente.' });

    } catch (error) {
        await client.query('ROLLBACK'); // En caso de error, deshacer la transacción
        console.error('Error asignando privilegios al rol:', error);
        // Manejo de errores de clave foránea, si un privilegio_clave no existe
        if (error.code === '23503') { // foreign_key_violation
            return res.status(400).json({ message: 'Uno o más IDs de privilegios proporcionados no son válidos.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al asignar privilegios.' });
    } finally {
        client.release(); // Liberar el cliente de vuelta al pool
    }
};

exports.getPrivilegesByRoleId = async (req, res) => {
    const { rolClave } = req.params; // Usamos 'rolClave'

    try {
        // Opcional: Verificar si el rol existe
        const roleExists = await pool.query('SELECT 1 FROM rol WHERE clave = $1', [rolClave]);
        if (roleExists.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }

        const result = await pool.query(
            `SELECT p.clave, p.nombre, p.descripcion
             FROM privilegio p
             JOIN rol_privilegio rp ON p.clave = rp.privilegio_clave
             WHERE rp.rol_clave = $1
             ORDER BY p.nombre ASC`, // Ordenar por nombre del privilegio
            [rolClave]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error obteniendo privilegios por clave de rol:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener privilegios por rol.' });
    }
};