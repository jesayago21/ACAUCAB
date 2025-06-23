const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clave:
 *                     type: integer
 *                     description: ID único del usuario
 *                   username:
 *                     type: string
 *                     description: Nombre de usuario
 *                   fk_rol:
 *                     type: integer
 *                     description: ID del rol asignado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario único
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *               fk_rol:
 *                 type: integer
 *                 description: ID del rol a asignar
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El nombre de usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/{clave}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clave
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nuevo nombre de usuario
 *               password:
 *                 type: string
 *                 description: Nueva contraseña
 *               fk_rol:
 *                 type: integer
 *                 description: Nuevo ID del rol
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:clave', userController.updateUser);

/**
 * @swagger
 * /api/users/{clave}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clave
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:clave', userController.deleteUser);

/**
 * @swagger
 * /api/users/{userId}/rol:
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
 *         description: Rol no válido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:userId/rol', userController.assignRoleToUser);

/**
 * @swagger
 * /api/users/available/employees:
 *   get:
 *     summary: Obtiene empleados disponibles para asignar a usuarios
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empleados disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ci:
 *                     type: integer
 *                     description: Cédula del empleado
 *                   primer_nombre:
 *                     type: string
 *                     description: Primer nombre del empleado
 *                   segundo_nombre:
 *                     type: string
 *                     description: Segundo nombre del empleado
 *                   primer_apellido:
 *                     type: string
 *                     description: Primer apellido del empleado
 *                   segundo_apellido:
 *                     type: string
 *                     description: Segundo apellido del empleado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/available/employees', userController.getAvailableEmployees);

/**
 * @swagger
 * /api/users/available/members:
 *   get:
 *     summary: Obtiene miembros disponibles para asignar a usuarios
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de miembros disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rif:
 *                     type: string
 *                     description: RIF del miembro
 *                   razon_social:
 *                     type: string
 *                     description: Razón social del miembro
 *                   email:
 *                     type: string
 *                     description: Email del miembro
 *                   telefono:
 *                     type: string
 *                     description: Teléfono del miembro
 *       500:
 *         description: Error interno del servidor
 */
router.get('/available/members', userController.getAvailableMembers);

/**
 * @swagger
 * /api/users/available/clients:
 *   get:
 *     summary: Obtiene clientes disponibles para asignar a usuarios
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clave:
 *                     type: integer
 *                     description: ID del cliente
 *                   primer_nombre:
 *                     type: string
 *                     description: Primer nombre del cliente
 *                   segundo_nombre:
 *                     type: string
 *                     description: Segundo nombre del cliente
 *                   primer_apellido:
 *                     type: string
 *                     description: Primer apellido del cliente
 *                   segundo_apellido:
 *                     type: string
 *                     description: Segundo apellido del cliente
 *                   ci:
 *                     type: integer
 *                     description: Cédula del cliente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/available/clients', userController.getAvailableClients);

module.exports = router;