const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles de usuario
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crea un nuevo rol
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre único del rol.
 *                 example: 'Administrador'
 *               description:
 *                 type: string
 *                 description: Descripción del rol.
 *                 example: 'Rol con permisos para administrar el sistema.'
 *     responses:
 *       201:
 *         description: Rol creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: 'Administrador'
 *                 description:
 *                   type: string
 *                   example: 'Rol con permisos para administrar el sistema.'
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Acceso denegado (privilegios insuficientes).
 *       409:
 *         description: El nombre del rol ya existe.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', roleController.createRole); // Aquí iría authenticateToken y authorize(['create_role'])

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtiene todos los roles
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: 'Administrador'
 *                   description:
 *                     type: string
 *                     example: 'Rol con permisos para administrar el sistema.'
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', roleController.getAllRoles); // Aquí iría authenticateToken y authorize(['view_roles'])

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtiene un rol por su ID
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol a obtener.
 *     responses:
 *       200:
 *         description: Rol encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: 'Administrador'
 *                 description:
 *                   type: string
 *                   example: 'Rol con permisos para administrar el sistema.'
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Rol no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', roleController.getRoleById); // Aquí iría authenticateToken y authorize(['view_roles'])

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualiza un rol por su ID
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre único para el rol.
 *                 example: 'Admin General'
 *               description:
 *                 type: string
 *                 description: Nueva descripción para el rol.
 *                 example: 'Rol con permisos administrativos generales.'
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: 'Admin General'
 *                 description:
 *                   type: string
 *                   example: 'Rol con permisos administrativos generales.'
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Rol no encontrado.
 *       409:
 *         description: El nombre del rol ya existe.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:id', roleController.updateRole); // Aquí iría authenticateToken y authorize(['edit_role'])

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Elimina un rol por su ID
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol a eliminar.
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Rol eliminado exitosamente.'
 *                 id:
 *                   type: integer
 *                   example: 2
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado (puede que el rol esté asociado a usuarios).
 *       404:
 *         description: Rol no encontrado.
 *       409:
 *         description: No se puede eliminar el rol porque está asociado a uno o más usuarios.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/:id', roleController.deleteRole); // Aquí iría authenticateToken y authorize(['delete_role'])

module.exports = router;