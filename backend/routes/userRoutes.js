const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /usuarios/{userId}/rol:
 *   put:
 *     summary: Asigna un rol a un usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: integer
 *                 description: ID del rol a asignar
 *                 example: 2
 *     responses:
 *       200:
 *         description: Rol asignado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     clave:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     fk_rol:
 *                       type: integer
 *       400:
 *         description: Datos inválidos o rol no existe
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:userId/rol', userController.assignRoleToUser);

module.exports = router;