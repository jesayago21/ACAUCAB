/** Rutas de autenticación */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             rol:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *             entidad:
 *               type: object
 *             tipo_entidad:
 *               type: string
 *             permisos:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/verificar-permiso:
 *   post:
 *     summary: Verificar si un usuario tiene un permiso específico
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               permiso_nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verificación exitosa
 */
router.post('/verificar-permiso', authController.verificarPermiso);

/**
 * @swagger
 * /api/auth/perfil/{usuario_id}:
 *   get:
 *     summary: Obtener perfil completo del usuario
 *     tags: [Autenticación]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/perfil/:usuario_id', authController.getPerfilUsuario);

module.exports = router; 