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
 * /roles:
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
 * /roles:
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
 * /roles/{id}:
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
 * /roles/{id}:
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
 * /roles/{id}:
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


/**
 * @swagger
 * /roles/{rolClave}/privileges:
 *   put:
 *     summary: Asigna privilegios a un rol
 *     tags: [Roles]
 *     description: |
 *       Asigna un conjunto de privilegios a un rol específico.
 *       Esta operación reemplaza *todos* los privilegios existentes del rol con los proporcionados en el body.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rolClave
 *         schema:
 *           type: integer
 *         required: true
 *         description: Clave (ID) del rol al que se asignarán los privilegios.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - privilegiosClave
 *             properties:
 *               privilegiosClave:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array de claves (IDs) de privilegios a asignar al rol.
 *                 example: [1, 2, 5]
 *     responses:
 *       200:
 *         description: Privilegios asignados al rol exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Privilegios asignados al rol exitosamente.'
 *       400:
 *         description: Datos de entrada inválidos (por ejemplo, privilegiosClave no es un array o contiene IDs no válidos).
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado (privilegios insuficientes para asignar).
 *       404:
 *         description: Rol no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:rolClave/privileges', roleController.assignPrivilegesToRole);

/**
 * @swagger
 * /roles/{rolClave}/privileges:
 *   get:
 *     summary: Obtiene los privilegios de un rol
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rolClave
 *         schema:
 *           type: integer
 *         required: true
 *         description: Clave (ID) del rol del que se desean obtener los privilegios.
 *     responses:
 *       200:
 *         description: Lista de privilegios asignados al rol.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clave:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: 'crear_producto'
 *                   descripcion:
 *                     type: string
 *                     example: 'Permite crear nuevos productos.'
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Rol no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:rolClave/privileges', roleController.getPrivilegesByRoleId);

module.exports = router;