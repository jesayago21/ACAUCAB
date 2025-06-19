const db = require('../config/db');

/**
 * Identificar cliente por cédula/RIF
 * Busca un cliente existente en la base de datos por su cédula (natural) o RIF (jurídico)
 */
const identificarCliente = async (req, res) => {
  const { documento } = req.body;
  
  if (!documento) {
    return res.status(400).json({ message: 'El documento es requerido' });
  }

  try {
    // Buscar cliente por CI (natural) o RIF (jurídico)
    const queryText = `
      SELECT 
        c.clave,
        c.rif,
        c.puntos_acumulados,
        c.tipo,
        -- Datos para cliente natural
        c.ci,
        c.primer_nombre,
        c.segundo_nombre,
        c.primer_apellido,
        c.segundo_apellido,
        c.direccion_habitacion,
        l1.nombre AS lugar_habitacion,
        -- Datos para cliente jurídico
        c.razon_social,
        c.denominacion_comercial,
        c.url_pagina_web,
        c.capital_disponible,
        c.direccion_fiscal,
        c.direccion_fisica,
        l2.nombre AS lugar_fiscal,
        l3.nombre AS lugar_fisico
      FROM cliente c
      LEFT JOIN lugar l1 ON c.fk_direccion_habitacion = l1.clave  
      LEFT JOIN lugar l2 ON c.fk_direccion_fiscal = l2.clave
      LEFT JOIN lugar l3 ON c.fk_direccion_fisica = l3.clave
      WHERE (c.tipo = 'natural' AND (c.ci = $1 OR c.rif = $1)) 
         OR (c.tipo = 'juridico' AND c.rif = $1)
      LIMIT 1;
    `;
    
    const { rows } = await db.query(queryText, [documento]);
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        message: 'Cliente no encontrado',
        found: false,
        documento: documento
      });
    }

    const cliente = rows[0];
    
    // Formatear respuesta según el tipo de cliente
    const clienteFormateado = {
      clave: cliente.clave,
      documento: cliente.tipo === 'natural' ? cliente.ci : cliente.rif,
      tipo: cliente.tipo,
      puntos_acumulados: cliente.puntos_acumulados,
      ...(cliente.tipo === 'natural' ? {
        nombre: cliente.primer_nombre,
        segundo_nombre: cliente.segundo_nombre,
        apellido: cliente.primer_apellido,
        segundo_apellido: cliente.segundo_apellido,
        direccion: cliente.direccion_habitacion,
        lugar: cliente.lugar_habitacion
      } : {
        razon_social: cliente.razon_social,
        denominacion_comercial: cliente.denominacion_comercial,
        url_pagina_web: cliente.url_pagina_web,
        capital_disponible: cliente.capital_disponible,
        direccion_fiscal: cliente.direccion_fiscal,
        direccion_fisica: cliente.direccion_fisica,
        lugar_fiscal: cliente.lugar_fiscal,
        lugar_fisico: cliente.lugar_fisico
      })
    };

    res.status(200).json({
      message: 'Cliente encontrado',
      found: true,
      cliente: clienteFormateado
    });

  } catch (error) {
    console.error('Error al identificar cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Crear nuevo cliente
 * Crea un nuevo cliente natural o jurídico según los datos proporcionados
 */
const crearCliente = async (req, res) => {
  const { tipo, ...datosCliente } = req.body;

  if (!tipo || !['natural', 'juridico'].includes(tipo)) {
    return res.status(400).json({ message: 'Tipo de cliente inválido' });
  }

  try {
    let queryText;
    let queryParams;

    if (tipo === 'natural') {
      const { 
        ci, 
        rif,
        primer_nombre, 
        segundo_nombre,
        primer_apellido, 
        segundo_apellido,
        direccion_habitacion,
        fk_direccion_habitacion 
      } = datosCliente;

      // Validar campos requeridos para cliente natural
      if (!ci || !rif || !primer_nombre || !primer_apellido || !direccion_habitacion) {
        return res.status(400).json({ 
          message: 'Faltan campos requeridos para cliente natural' 
        });
      }

      queryText = `
        INSERT INTO cliente (
          rif, tipo, ci, primer_nombre, segundo_nombre, 
          primer_apellido, segundo_apellido, direccion_habitacion, 
          fk_direccion_habitacion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING clave, rif, ci, primer_nombre, primer_apellido, puntos_acumulados;
      `;
      
      queryParams = [
        rif, tipo, ci, primer_nombre, segundo_nombre || null,
        primer_apellido, segundo_apellido || null, direccion_habitacion,
        fk_direccion_habitacion || 1 // Default a algún lugar válido
      ];

    } else {
      const {
        rif,
        razon_social,
        denominacion_comercial,
        url_pagina_web,
        capital_disponible,
        direccion_fiscal,
        direccion_fisica,
        fk_direccion_fiscal,
        fk_direccion_fisica
      } = datosCliente;

      // Validar campos requeridos para cliente jurídico
      if (!rif || !razon_social || !denominacion_comercial || !url_pagina_web || 
          capital_disponible === undefined || !direccion_fiscal || !direccion_fisica) {
        return res.status(400).json({ 
          message: 'Faltan campos requeridos para cliente jurídico' 
        });
      }

      queryText = `
        INSERT INTO cliente (
          rif, tipo, razon_social, denominacion_comercial,
          url_pagina_web, capital_disponible, direccion_fiscal,
          direccion_fisica, fk_direccion_fiscal, fk_direccion_fisica
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING clave, rif, razon_social, denominacion_comercial, puntos_acumulados;
      `;

      queryParams = [
        rif, tipo, razon_social, denominacion_comercial,
        url_pagina_web, capital_disponible, direccion_fiscal,
        direccion_fisica, fk_direccion_fiscal || 1, fk_direccion_fisica || 1
      ];
    }

    const { rows } = await db.query(queryText, queryParams);
    const nuevoCliente = rows[0];

    res.status(201).json({
      message: 'Cliente creado exitosamente',
      cliente: nuevoCliente
    });

  } catch (error) {
    console.error('Error al crear cliente:', error);
    
    // Manejar errores específicos de la base de datos
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ 
        message: 'Ya existe un cliente con este documento' 
      });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Obtener lugares disponibles para direcciones
 */
const getLugares = async (req, res) => {
  try {
    const queryText = `
      SELECT clave, nombre, tipo, fk_lugar
      FROM lugar
      ORDER BY tipo, nombre;
    `;
    
    const { rows } = await db.query(queryText);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener lugares:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  identificarCliente,
  crearCliente,
  getLugares
}; 