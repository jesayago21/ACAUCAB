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
 * /api/privileges:
 *   get:
 *     summary: Obtiene todos los privilegios
 *     tags: [Privilegios]
 *     responses:
 *       200:
 *         description: Lista de privilegios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clave:
 *                     type: integer
 *                     description: ID único del privilegio
 *                   nombre:
 *                     type: string
 *                     description: Nombre del privilegio
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del privilegio
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', privilegeController.getAllPrivileges);

/**
 * @swagger
 * /api/privileges/modules:
 *   get:
 *     summary: Obtiene privilegios agrupados por módulo
 *     tags: [Privilegios]
 *     responses:
 *       200:
 *         description: Privilegios agrupados por módulo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   module:
 *                     type: string
 *                     description: Nombre del módulo
 *                   displayName:
 *                     type: string
 *                     description: Nombre del módulo para mostrar
 *                   privileges:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         clave:
 *                           type: integer
 *                         nombre:
 *                           type: string
 *                         descripcion:
 *                           type: string
 *                         action:
 *                           type: string
 *       500:
 *         description: Error interno del servidor
 */
router.get('/modules', privilegeController.getPrivilegesByModule);

/**
 * @swagger
 * /api/privileges/{id}:
 *   get:
 *     summary: Obtiene un privilegio por su ID
 *     tags: [Privilegios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del privilegio
 *     responses:
 *       200:
 *         description: Privilegio encontrado
 *       404:
 *         description: Privilegio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', privilegeController.getPrivilegeById);

/**
 * @swagger
 * /api/privileges:
 *   post:
 *     summary: Crea un nuevo privilegio
 *     tags: [Privilegios]
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
 *                 description: Nombre único del privilegio
 *               descripcion:
 *                 type: string
 *                 description: Descripción del privilegio
 *     responses:
 *       201:
 *         description: Privilegio creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El privilegio ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', privilegeController.createPrivilege);

/**
 * @swagger
 * /api/privileges/{id}:
 *   put:
 *     summary: Actualiza un privilegio
 *     tags: [Privilegios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del privilegio
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
 *                 description: Nombre del privilegio
 *               descripcion:
 *                 type: string
 *                 description: Descripción del privilegio
 *     responses:
 *       200:
 *         description: Privilegio actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Privilegio no encontrado
 *       409:
 *         description: El nombre del privilegio ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', privilegeController.updatePrivilege);

/**
 * @swagger
 * /api/privileges/{id}:
 *   delete:
 *     summary: Elimina un privilegio
 *     tags: [Privilegios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del privilegio
 *     responses:
 *       200:
 *         description: Privilegio eliminado exitosamente
 *       404:
 *         description: Privilegio no encontrado
 *       409:
 *         description: No se puede eliminar porque está asignado a roles
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', privilegeController.deletePrivilege);

module.exports = router; 