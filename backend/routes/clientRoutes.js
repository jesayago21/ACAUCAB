const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

/**
 * @swagger
 * components:
 *   schemas:
 *     ClienteNatural:
 *       type: object
 *       required:
 *         - ci
 *         - rif
 *         - primer_nombre
 *         - primer_apellido
 *         - direccion_habitacion
 *       properties:
 *         ci:
 *           type: integer
 *           description: Cédula de identidad del cliente natural
 *           example: 12345678
 *         rif:
 *           type: integer
 *           description: RIF del cliente
 *           example: 123456789
 *         primer_nombre:
 *           type: string
 *           description: Primer nombre del cliente
 *           example: "Juan"
 *         segundo_nombre:
 *           type: string
 *           description: Segundo nombre del cliente (opcional)
 *           example: "Carlos"
 *         primer_apellido:
 *           type: string
 *           description: Primer apellido del cliente
 *           example: "Pérez"
 *         segundo_apellido:
 *           type: string
 *           description: Segundo apellido del cliente (opcional)
 *           example: "González"
 *         direccion_habitacion:
 *           type: string
 *           description: Dirección de habitación
 *           example: "Av. Libertador, Caracas"
 *         fk_direccion_habitacion:
 *           type: integer
 *           description: ID del lugar de la dirección
 *           example: 1
 *     
 *     ClienteJuridico:
 *       type: object
 *       required:
 *         - rif
 *         - razon_social
 *         - denominacion_comercial
 *         - url_pagina_web
 *         - capital_disponible
 *         - direccion_fiscal
 *         - direccion_fisica
 *       properties:
 *         rif:
 *           type: integer
 *           description: RIF del cliente jurídico
 *           example: 123456789
 *         razon_social:
 *           type: string
 *           description: Razón social de la empresa
 *           example: "Empresa XYZ C.A."
 *         denominacion_comercial:
 *           type: string
 *           description: Denominación comercial
 *           example: "XYZ Store"
 *         url_pagina_web:
 *           type: string
 *           description: URL de la página web
 *           example: "https://www.xyz.com"
 *         capital_disponible:
 *           type: integer
 *           description: Capital disponible de la empresa
 *           example: 100000
 *         direccion_fiscal:
 *           type: string
 *           description: Dirección fiscal
 *           example: "Torre XYZ, Caracas"
 *         direccion_fisica:
 *           type: string
 *           description: Dirección física
 *           example: "Centro Comercial ABC, Local 123"
 *         fk_direccion_fiscal:
 *           type: integer
 *           description: ID del lugar fiscal
 *           example: 1
 *         fk_direccion_fisica:
 *           type: integer
 *           description: ID del lugar físico
 *           example: 2
 */

/**
 * @swagger
 * /api/clientes/identificar:
 *   post:
 *     summary: Identificar cliente por documento
 *     description: Busca un cliente existente por su cédula (cliente natural) o RIF (cliente jurídico)
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documento
 *             properties:
 *               documento:
 *                 type: integer
 *                 description: Cédula de identidad o RIF del cliente
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Cliente encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente encontrado"
 *                 found:
 *                   type: boolean
 *                   example: true
 *                 cliente:
 *                   type: object
 *                   description: Datos del cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente no encontrado"
 *                 found:
 *                   type: boolean
 *                   example: false
 *                 documento:
 *                   type: integer
 *                   example: 12345678
 *       400:
 *         description: Documento no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/identificar', clientController.identificarCliente);

/**
 * @swagger
 * /api/clientes/crear:
 *   post:
 *     summary: Crear nuevo cliente
 *     description: Crea un nuevo cliente natural o jurídico según el tipo especificado
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - allOf:
 *                   - type: object
 *                     properties:
 *                       tipo:
 *                         type: string
 *                         enum: [natural]
 *                         example: "natural"
 *                   - $ref: '#/components/schemas/ClienteNatural'
 *               - allOf:
 *                   - type: object
 *                     properties:
 *                       tipo:
 *                         type: string
 *                         enum: [juridico]
 *                         example: "juridico"
 *                   - $ref: '#/components/schemas/ClienteJuridico'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente creado exitosamente"
 *                 cliente:
 *                   type: object
 *                   description: Datos del cliente creado
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: Cliente ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/crear', clientController.crearCliente);

/**
 * @swagger
 * /api/clientes/lugares:
 *   get:
 *     summary: Obtener lugares disponibles
 *     description: Retorna la lista de lugares disponibles para usar en direcciones de clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de lugares disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clave:
 *                     type: integer
 *                     description: ID único del lugar
 *                   nombre:
 *                     type: string
 *                     description: Nombre del lugar
 *                   tipo:
 *                     type: string
 *                     description: Tipo de lugar (estado, municipio, parroquia)
 *                   fk_lugar:
 *                     type: integer
 *                     description: ID del lugar padre
 *       500:
 *         description: Error interno del servidor
 */
router.get('/lugares', clientController.getLugares);

module.exports = router; 