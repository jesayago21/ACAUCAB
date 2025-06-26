const db = require('../config/db');

/**
 * Identificar cliente por cédula/RIF de forma completa y eficiente.
 */
const identificarCliente = async (req, res) => {
  const { documento } = req.body;
  if (!documento) {
    return res.status(400).json({ message: 'El documento es requerido' });
  }
  try {
    const { rows } = await db.query('SELECT * FROM identificar_cliente_completo($1)', [documento]);
    if (rows.length === 0 || !rows[0].cliente_info) {
      return res.status(404).json({ message: 'Cliente no encontrado', found: false });
    }
    const result = rows[0];
    const cliente = {
        ...result.cliente_info,
        personas_contacto: result.contactos || [],
        telefonos: result.telefonos || [],
        correo: (result.correos && result.correos.length > 0) ? result.correos[0] : null
    };
    res.status(200).json({ message: 'Cliente encontrado', found: true, cliente });
  } catch (error) {
    console.error('Error al identificar cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Crear un nuevo cliente (natural o jurídico).
 */
const crearCliente = async (req, res) => {
  const { tipo, correo, telefonos, ...datosCliente } = req.body;

  if (!tipo || !['natural', 'juridico'].includes(tipo)) {
    return res.status(400).json({ message: 'Tipo de cliente inválido' });
  }
  // Validaciones básicas de contacto
  if (!correo || !correo.direccion_email) {
      return res.status(400).json({ message: 'Correo electrónico es requerido' });
  }
  if (!telefonos || !Array.isArray(telefonos) || telefonos.length === 0) {
      return res.status(400).json({ message: 'Al menos un teléfono es requerido' });
  }

  try {
    if (tipo === 'natural') {
      const { ci, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_habitacion, fk_direccion_habitacion } = datosCliente;
      await db.query('CALL crear_cliente_natural($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::JSON)', [
        ci, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
        direccion_habitacion, fk_direccion_habitacion, correo.direccion_email, JSON.stringify(telefonos)
      ]);
    } else { // tipo === 'juridico'
      const { rif, razon_social, denominacion_comercial, url_pagina_web, capital_disponible, direccion_fiscal, direccion_fisica, fk_direccion_fiscal, fk_direccion_fisica } = datosCliente;
      await db.query('CALL crear_cliente_juridico($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::JSON)', [
        rif, razon_social, denominacion_comercial, url_pagina_web, capital_disponible,
        direccion_fiscal, direccion_fisica, fk_direccion_fiscal, fk_direccion_fisica,
        correo.direccion_email, JSON.stringify(telefonos)
      ]);
    }
    res.status(201).json({ success: true, message: `Cliente ${tipo} creado exitosamente.` });
  } catch (error) {
    console.error(`Error al crear cliente ${tipo}:`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Obtener todos los lugares con su jerarquía.
 */
const getLugares = async (req, res) => {
    try {
        const result = await db.query('SELECT obtener_lugares_jerarquia() as lugares');
        res.status(200).json(result.rows[0].lugares);
    } catch (error) {
        console.error('Error al obtener lugares:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener todos los lugares en una lista plana.
 */
const getLugaresPlanos = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM obtener_lugares_planos()');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener lugares planos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener municipios por ID de estado.
 */
const getMunicipiosPorEstado = async (req, res) => {
    const { estadoId } = req.params;
    try {
        const result = await db.query("SELECT * FROM obtener_lugares_planos()");
        const municipios = result.rows.filter(lugar => lugar.tipo === 'municipio' && lugar.fk_lugar === parseInt(estadoId, 10));
        res.status(200).json(municipios);
    } catch (error) {
        console.error('Error al obtener municipios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener parroquias por ID de municipio.
 */
const getParroquiasPorMunicipio = async (req, res) => {
    const { municipioId } = req.params;
    try {
        const result = await db.query("SELECT * FROM obtener_lugares_planos()");
        const parroquias = result.rows.filter(lugar => lugar.tipo === 'parroquia' && lugar.fk_lugar === parseInt(municipioId, 10));
        res.status(200).json(parroquias);
    } catch (error) {
        console.error('Error al obtener parroquias:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener puntos acumulados de un cliente.
 */
const obtenerPuntosCliente = async (req, res) => {
    const { clienteId } = req.params;
    try {
        const result = await db.query('SELECT obtener_puntos_cliente($1) as puntos', [clienteId]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener puntos del cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Verificar si un cliente ya existe por tipo y documento.
 */
const verificarClientePorTipo = async (req, res) => {
    const { tipo_documento, numero_documento } = req.body;
    if (!tipo_documento || !numero_documento) {
        return res.status(400).json({ message: 'Los parámetros "tipo_documento" y "numero_documento" son requeridos.' });
    }
    try {
        const result = await db.query('SELECT verificar_cliente_por_tipo($1, $2) as resultado', [tipo_documento, numero_documento]);
        const data = result.rows[0].resultado;
        
        if (data.found) {
            res.status(200).json(data);
        } else {
            res.status(404).json(data);
        }
    } catch (error) {
        console.error('Error al verificar cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
  identificarCliente,
  crearCliente,
  getLugares,
  getLugaresPlanos,
  getMunicipiosPorEstado,
  getParroquiasPorMunicipio,
  obtenerPuntosCliente,
  verificarClientePorTipo,
};
