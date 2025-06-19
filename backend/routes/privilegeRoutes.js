// src/routes/privilegeRoutes.js
const express = require('express');
const router = express.Router();
const privilegeController = require('../controllers/privilegeController');

/**
 * @swagger
 * tags:
 *   name: Privilegios
 *   description: Gestión de privilegios del sistema
 */

/**
 * @swagger
 * /privileges:
 *   post:
 *     summary: Crea un nuevo privilegio
 *     tags: [Privilegios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre único del privilegio.
 *                 example: 'crear_factura'
 *               descripcion:
 *                 type: string
 *                 description: Descripción del privilegio.
 *                 example: 'Permite al usuario crear nuevas facturas.'
 *     responses:
 *       201:
 *         description: Privilegio creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clave:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: 'crear_factura'
 *                 descripcion:
 *                   type: string
 *                   example: 'Permite al usuario crear nuevas facturas.'
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Acceso denegado (privilegios insuficientes).
 *       409:
 *         description: El nombre del privilegio ya existe.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', privilegeController.createPrivilege);

/**
 * @swagger
 * /privileges:
 *   get:
 *     summary: Obtiene todos los privilegios
 *     tags: [Privilegios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de privilegios obtenida exitosamente.
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
 *                     example: 'crear_factura'
 *                   descripcion:
 *                     type: string
 *                     example: 'Permite al usuario crear nuevas facturas.'
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', privilegeController.getAllPrivileges);

/**
 * @swagger
 * /privileges/{clave}:
 *   get:
 *     summary: Obtiene un privilegio por su clave (ID)
 *     tags: [Privilegios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clave
 *         schema:
 *           type: integer
 *         required: true
 *         description: Clave (ID) del privilegio a obtener.
 *     responses:
 *       200:
 *         description: Privilegio encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clave:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: 'crear_factura'
 *                 descripcion:
 *                   type: string
 *                   example: 'Permite al usuario crear nuevas facturas.'
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Privilegio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:clave', privilegeController.getPrivilegeByClave);

/**
 * @swagger
 * /privileges/{clave}:
 *   put:
 *     summary: Actualiza un privilegio por su clave (ID)
 *     tags: [Privilegios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clave
 *         schema:
 *           type: integer
 *         required: true
 *         description: Clave (ID) del privilegio a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre único para el privilegio.
 *                 example: 'crear_y_editar_facturas'
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción para el privilegio.
 *                 example: 'Permite al usuario crear y modificar facturas existentes.'
 *     responses:
 *       200:
 *         description: Privilegio actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clave:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: 'crear_y_editar_facturas'
 *                 descripcion:
 *                   type: string
 *                   example: 'Permite al usuario crear y modificar facturas existentes.'
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Privilegio no encontrado.
 *       409:
 *         description: El nombre del privilegio ya existe.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:clave', privilegeController.updatePrivilege);

/**
 * @swagger
 * /privileges/{clave}:
 *   delete:
 *     summary: Elimina un privilegio por su clave (ID)
 *     tags: [Privilegios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clave
 *         schema:
 *           type: integer
 *         required: true
 *         description: Clave (ID) del privilegio a eliminar.
 *     responses:
 *       200:
 *         description: Privilegio eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Privilegio eliminado exitosamente.'
 *                 clave:
 *                   type: integer
 *                   example: 2
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado (puede que el privilegio esté asociado a roles).
 *       404:
 *         description: Privilegio no encontrado.
 *       409:
 *         description: No se puede eliminar el privilegio porque está asociado a uno o más roles.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/:clave', privilegeController.deletePrivilege);

module.exports = router;