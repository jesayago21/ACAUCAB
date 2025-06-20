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