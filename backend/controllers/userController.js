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

// Listar todos los usuarios con su rol
exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.clave, u.username, r.nombre AS rol, u.fk_empleado, u.fk_miembro, u.fk_cliente
            FROM usuario u
            JOIN rol r ON u.fk_rol = r.clave
            ORDER BY u.clave ASC
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
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
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
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
    if (!username || !contrasena || !fk_rol) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    try {
        const result = await db.query(
            `UPDATE usuario SET username=$1, contrasena=$2, fk_rol=$3, fk_empleado=$4, fk_miembro=$5, fk_cliente=$6
             WHERE clave=$7 RETURNING *`,
            [username, contrasena, fk_rol, fk_empleado || null, fk_miembro || null, fk_cliente || null, clave]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    const { clave } = req.params;
    try {
        const result = await db.query('DELETE FROM usuario WHERE clave=$1', [clave]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};