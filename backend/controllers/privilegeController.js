const pool = require('../config/db'); // Asegúrate de que esta ruta sea correcta para tu conexión a la DB

/**
 * Crea un nuevo privilegio en la base de datos.
 * Requiere 'nombre' y opcionalmente 'descripcion' en el cuerpo de la solicitud.
 */
exports.createPrivilege = async (req, res) => {
    const { nombre, descripcion } = req.body;

    // Validación básica
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del privilegio es requerido.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO privilegio (nombre, descripcion) VALUES ($1, $2) RETURNING clave, nombre, descripcion',
            [nombre, descripcion]
        );
        // Retornamos el privilegio creado con sus campos
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear el privilegio:', error);
        // Manejo de error para nombres de privilegio duplicados (si 'nombre' es UNIQUE en tu DB)
        if (error.code === '23505') { // Código de error para unique_violation en PostgreSQL
            return res.status(409).json({ message: 'Ya existe un privilegio con este nombre.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear el privilegio.' });
    }
};

/**
 * Obtiene todos los privilegios de la base de datos.
 */
exports.getAllPrivileges = async (req, res) => {
    try {
        const result = await pool.query('SELECT clave, nombre, descripcion FROM privilegio ORDER BY nombre ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los privilegios:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los privilegios.' });
    }
};

/**
 * Obtiene un privilegio específico por su clave (ID).
 */
exports.getPrivilegeByClave = async (req, res) => {
    const { clave } = req.params; // Usamos 'clave' ya que es tu PRIMARY KEY

    try {
        const result = await pool.query('SELECT clave, nombre, descripcion FROM privilegio WHERE clave = $1', [clave]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Privilegio no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el privilegio por clave:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el privilegio.' });
    }
};

/**
 * Actualiza un privilegio existente por su clave (ID).
 * Requiere 'nombre' y/o 'descripcion' en el cuerpo de la solicitud.
 */
exports.updatePrivilege = async (req, res) => {
    const { clave } = req.params;
    const { nombre, descripcion } = req.body;

    // Validación: al menos un campo para actualizar
    if (!nombre && descripcion === undefined) {
        return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar (nombre o descripcion).' });
    }

    let query = 'UPDATE privilegio SET';
    const queryParams = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
        query += ` nombre = $${paramIndex}`;
        queryParams.push(nombre);
        paramIndex++;
    }
    if (descripcion !== undefined) {
        if (paramIndex > 1) query += ','; // Añadir coma si ya hay un campo anterior
        query += ` descripcion = $${paramIndex}`;
        queryParams.push(descripcion);
        paramIndex++;
    }

    query += ` WHERE clave = $${paramIndex} RETURNING clave, nombre, descripcion`;
    queryParams.push(clave);

    try {
        const result = await pool.query(query, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Privilegio no encontrado para actualizar.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el privilegio:', error);
        if (error.code === '23505') { // Código de error para unique_violation
            return res.status(409).json({ message: 'Ya existe un privilegio con este nombre.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar el privilegio.' });
    }
};

/**
 * Elimina un privilegio por su clave (ID).
 */
exports.deletePrivilege = async (req, res) => {
    const { clave } = req.params;

    try {
        const result = await pool.query('DELETE FROM privilegio WHERE clave = $1 RETURNING clave', [clave]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Privilegio no encontrado para eliminar.' });
        }
        res.status(200).json({ message: 'Privilegio eliminado exitosamente.', clave: result.rows[0].clave });
    } catch (error) {
        console.error('Error al eliminar el privilegio:', error);
        // Podrías añadir manejo de error si el privilegio está siendo referenciado por roles
        if (error.code === '23503') { // Código de error para foreign_key_violation en PostgreSQL
            return res.status(409).json({ message: 'No se puede eliminar el privilegio porque está asociado a uno o más roles.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al eliminar el privilegio.' });
    }
};