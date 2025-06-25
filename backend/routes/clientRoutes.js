const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Telefono:
 *       type: object
 *       required:
 *         - codigo
 *         - numero
 *       properties:
 *         codigo:
 *           type: integer
 *           enum: [414, 416, 412, 424, 426]
 *           description: Código del operador (sin 0)
 *           example: 414
 *         numero:
 *           type: integer
 *           description: Número de teléfono (7 dígitos)
 *           example: 1234567
 *         extension:
 *           type: integer
 *           description: Extensión (opcional)
 *           example: 123
 *     
 *     CorreoElectronico:
 *       type: object
 *       required:
 *         - direccion_email
 *       properties:
 *         direccion_email:
 *           type: string
 *           format: email
 *           description: Dirección de correo electrónico
 *           example: "cliente@ejemplo.com"
 *     
 *     PersonaContacto:
 *       type: object
 *       required:
 *         - primer_nombre
 *         - primer_apellido
 *         - correo
 *         - telefono
 *       properties:
 *         primer_nombre:
 *           type: string
 *           description: Primer nombre de la persona de contacto
 *           example: "María"
 *         primer_apellido:
 *           type: string
 *           description: Primer apellido de la persona de contacto
 *           example: "González"
 *         correo:
 *           $ref: '#/components/schemas/CorreoElectronico'
 *         telefono:
 *           $ref: '#/components/schemas/Telefono'
 *
 *     ClienteNatural:
 *       type: object
 *       required:
 *         - ci
 *         - rif
 *         - primer_nombre
 *         - primer_apellido
 *         - direccion_habitacion
 *         - correo
 *         - telefonos
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
 *           description: ID de la parroquia de la dirección
 *           example: 1
 *         correo:
 *           $ref: '#/components/schemas/CorreoElectronico'
 *         telefonos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Telefono'
 *           minItems: 1
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
 *         - correo
 *         - telefonos
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
 *           description: ID de la parroquia fiscal
 *           example: 1
 *         fk_direccion_fisica:
 *           type: integer
 *           description: ID de la parroquia física
 *           example: 2
 *         correo:
 *           $ref: '#/components/schemas/CorreoElectronico'
 *         telefonos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Telefono'
 *           minItems: 1
 *         personas_contacto:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PersonaContacto'
 *           description: Personas de contacto (opcional para clientes jurídicos)
 *     
 *     Lugar:
 *       type: object
 *       properties:
 *         clave:
 *           type: integer
 *           description: ID único del lugar
 *         nombre:
 *           type: string
 *           description: Nombre del lugar
 *         tipo:
 *           type: string
 *           enum: [estado, municipio, parroquia]
 *           description: Tipo de lugar
 *         fk_lugar:
 *           type: integer
 *           description: ID del lugar padre
 */

/**
 * @swagger
 * /api/clientes/identificar:
 *   post:
 *     summary: Identificar cliente por documento
 *     description: Busca un cliente existente por su cédula (cliente natural) o RIF (cliente jurídico). Incluye información de contacto y personas de contacto.
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
 *                   description: Datos completos del cliente con información de contacto
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
 *     description: Crea un nuevo cliente natural o jurídico con sus datos de contacto y personas de contacto (si aplica)
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
 *                   description: Datos del cliente creado con información de contacto
 *       400:
 *         description: Datos de entrada inválidos o faltantes
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
 *     summary: Obtener lugares con estructura jerárquica
 *     description: Retorna la estructura jerárquica completa de estados, municipios y parroquias
 *     tags: [Lugares]
 *     responses:
 *       200:
 *         description: Estructura jerárquica de lugares
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lugares obtenidos exitosamente"
 *                 lugares:
 *                   type: object
 *                   properties:
 *                     estados:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Lugar'
 *                           - type: object
 *                             properties:
 *                               municipios:
 *                                 type: array
 *                                 items:
 *                                   allOf:
 *                                     - $ref: '#/components/schemas/Lugar'
 *                                     - type: object
 *                                       properties:
 *                                         parroquias:
 *                                           type: array
 *                                           items:
 *                                             $ref: '#/components/schemas/Lugar'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/lugares', clientController.getLugares);

/**
 * @swagger
 * /api/clientes/lugares/planos:
 *   get:
 *     summary: Obtener lugares en lista plana
 *     description: Retorna todos los lugares en una lista plana (para compatibilidad)
 *     tags: [Lugares]
 *     responses:
 *       200:
 *         description: Lista plana de lugares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lugar'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/lugares/planos', clientController.getLugaresPlanos);

/**
 * @swagger
 * /api/clientes/municipios/{estadoId}:
 *   get:
 *     summary: Obtener municipios por estado
 *     description: Retorna los municipios que pertenecen a un estado específico
 *     tags: [Lugares]
 *     parameters:
 *       - in: path
 *         name: estadoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado
 *     responses:
 *       200:
 *         description: Lista de municipios del estado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lugar'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/municipios/:estadoId', clientController.getMunicipiosPorEstado);

/**
 * @swagger
 * /api/clientes/parroquias/{municipioId}:
 *   get:
 *     summary: Obtener parroquias por municipio
 *     description: Retorna las parroquias que pertenecen a un municipio específico
 *     tags: [Lugares]
 *     parameters:
 *       - in: path
 *         name: municipioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del municipio
 *     responses:
 *       200:
 *         description: Lista de parroquias del municipio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lugar'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/parroquias/:municipioId', clientController.getParroquiasPorMunicipio);

/**
 * @swagger
 * /api/clientes/{clienteId}/puntos:
 *   get:
 *     summary: Obtener puntos actualizados de un cliente
 *     description: Retorna los puntos acumulados actuales de un cliente específico
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del cliente
 *     responses:
 *       200:
 *         description: Puntos del cliente obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Puntos obtenidos exitosamente"
 *                 found:
 *                   type: boolean
 *                   example: true
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     clave:
 *                       type: integer
 *                       description: ID del cliente
 *                     puntos_acumulados:
 *                       type: integer
 *                       description: Puntos acumulados actuales
 *                       example: 150
 *       400:
 *         description: ID del cliente no proporcionado
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:clienteId/puntos', clientController.obtenerPuntosCliente);

/**
 * @swagger
 * /api/clientes/verificar-por-tipo:
 *   post:
 *     summary: Verificar cliente por tipo de documento específico (V o J)
 *     description: Busca un cliente existente de forma específica por V (cédula natural) o J (RIF jurídico)
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_documento
 *               - numero_documento
 *             properties:
 *               tipo_documento:
 *                 type: string
 *                 enum: [V, J]
 *                 description: Tipo de documento (V para venezolano/natural, J para jurídico)
 *                 example: "V"
 *               numero_documento:
 *                 type: string
 *                 description: Número de documento sin el prefijo V/J
 *                 example: "12345678"
 *           examples:
 *             cliente_natural:
 *               summary: Cliente natural
 *               value:
 *                 tipo_documento: "V"
 *                 numero_documento: "12345678"
 *             cliente_juridico:
 *               summary: Cliente jurídico
 *               value:
 *                 tipo_documento: "J"
 *                 numero_documento: "123456789"
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
 *                   example: "Cliente natural encontrado"
 *                 found:
 *                   type: boolean
 *                   example: true
 *                 cliente:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/ClienteNatural'
 *                     - $ref: '#/components/schemas/ClienteJuridico'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente natural no encontrado"
 *                 found:
 *                   type: boolean
 *                   example: false
 *                 tipo_documento:
 *                   type: string
 *                   example: "V"
 *                 numero_documento:
 *                   type: string
 *                   example: "12345678"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tipo de documento inválido. Debe ser V o J"
 *                 found:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Error interno del servidor
 */
router.post('/verificar-por-tipo', clientController.verificarClientePorTipo);

module.exports = router; 