const db = require('../config/db');

/**
 * Identificar cliente por cédula/RIF
 * Busca un cliente existente en la base de datos por su cédula (natural) o RIF (jurídico)
 * Incluye información de contacto y personas de contacto para clientes jurídicos
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
    
    // Obtener correo electrónico del cliente
    const correoQuery = `
      SELECT direccion_email 
      FROM correo_electronico 
      WHERE fk_cliente = $1;
    `;
    const { rows: correoRows } = await db.query(correoQuery, [cliente.clave]);
    
    // Obtener teléfonos del cliente
    const telefonosQuery = `
      SELECT clave, codigo, numero, extension 
      FROM telefono 
      WHERE fk_cliente = $1;
    `;
    const { rows: telefonosRows } = await db.query(telefonosQuery, [cliente.clave]);

    // Obtener personas de contacto si es cliente jurídico
    let personasContacto = [];
    if (cliente.tipo === 'juridico') {
      const personasQuery = `
        SELECT 
          pc.clave,
          pc.primer_nombre,
          pc.primer_apellido,
          ce.direccion_email,
          t.codigo,
          t.numero,
          t.extension
        FROM persona_contacto pc
        LEFT JOIN correo_electronico ce ON ce.fk_persona_contacto = pc.clave
        LEFT JOIN telefono t ON t.fk_persona_contacto = pc.clave
        WHERE pc.fk_cliente = $1;
      `;
      const { rows: personasRows } = await db.query(personasQuery, [cliente.clave]);
      
      // Agrupar personas de contacto con sus datos
      const personasMap = new Map();
      personasRows.forEach(persona => {
        if (!personasMap.has(persona.clave)) {
          personasMap.set(persona.clave, {
            clave: persona.clave,
            primer_nombre: persona.primer_nombre,
            primer_apellido: persona.primer_apellido,
            correo: { direccion_email: persona.direccion_email },
            telefono: {
              codigo: persona.codigo,
              numero: persona.numero,
              extension: persona.extension
            }
          });
        }
      });
      personasContacto = Array.from(personasMap.values());
    }
    
    // Formatear respuesta según el tipo de cliente
    const clienteFormateado = {
      clave: cliente.clave,
      documento: cliente.tipo === 'natural' ? cliente.ci : cliente.rif,
      rif: cliente.rif,
      tipo: cliente.tipo,
      puntos_acumulados: cliente.puntos_acumulados,
      correo: correoRows[0] || null,
      telefonos: telefonosRows,
      ...(cliente.tipo === 'natural' ? {
        ci: cliente.ci,
        primer_nombre: cliente.primer_nombre,
        segundo_nombre: cliente.segundo_nombre,
        primer_apellido: cliente.primer_apellido,
        segundo_apellido: cliente.segundo_apellido,
        direccion_habitacion: cliente.direccion_habitacion,
        lugar_habitacion: cliente.lugar_habitacion,
        // Campos calculados para compatibilidad
        nombre: cliente.primer_nombre,
        apellido: cliente.primer_apellido,
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
        lugar_fisico: cliente.lugar_fisico,
        personas_contacto: personasContacto
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
 * Crea un nuevo cliente natural o jurídico con sus datos de contacto
 */
const crearCliente = async (req, res) => {
  const { tipo, correo, telefonos, personas_contacto, ...datosCliente } = req.body;

  if (!tipo || !['natural', 'juridico'].includes(tipo)) {
    return res.status(400).json({ message: 'Tipo de cliente inválido' });
  }

  if (!correo || !correo.direccion_email) {
    return res.status(400).json({ message: 'Correo electrónico es requerido' });
  }

  if (!telefonos || !Array.isArray(telefonos) || telefonos.length === 0) {
    return res.status(400).json({ message: 'Al menos un teléfono es requerido' });
  }

  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');

    let queryText;
    let queryParams;
    let nuevoCliente;

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
        await client.query('ROLLBACK');
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
        fk_direccion_habitacion || 1
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
        await client.query('ROLLBACK');
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

    const { rows } = await client.query(queryText, queryParams);
    nuevoCliente = rows[0];

    // Insertar correo electrónico
    const correoQuery = `
      INSERT INTO correo_electronico (direccion_email, fk_cliente)
      VALUES ($1, $2)
      RETURNING clave, direccion_email;
    `;
    const { rows: correoRows } = await client.query(correoQuery, [
      correo.direccion_email, 
      nuevoCliente.clave
    ]);

    // Insertar teléfonos
    const telefonosInsertados = [];
    for (const telefono of telefonos) {
      const telefonoQuery = `
        INSERT INTO telefono (codigo, numero, extension, fk_cliente)
        VALUES ($1, $2, $3, $4)
        RETURNING clave, codigo, numero, extension;
      `;
      const { rows: telRows } = await client.query(telefonoQuery, [
        telefono.codigo,
        telefono.numero,
        telefono.extension || null,
        nuevoCliente.clave
      ]);
      telefonosInsertados.push(telRows[0]);
    }

    // Insertar personas de contacto (solo para clientes jurídicos)
    const personasContactoInsertadas = [];
    if (tipo === 'juridico' && personas_contacto && Array.isArray(personas_contacto)) {
      for (const persona of personas_contacto) {
        // Insertar persona de contacto
        const personaQuery = `
          INSERT INTO persona_contacto (primer_nombre, primer_apellido, fk_cliente)
          VALUES ($1, $2, $3)
          RETURNING clave, primer_nombre, primer_apellido;
        `;
        const { rows: personaRows } = await client.query(personaQuery, [
          persona.primer_nombre,
          persona.primer_apellido,
          nuevoCliente.clave
        ]);
        const nuevaPersona = personaRows[0];

        // Insertar correo de la persona de contacto
        const correoPersonaQuery = `
          INSERT INTO correo_electronico (direccion_email, fk_persona_contacto)
          VALUES ($1, $2)
          RETURNING direccion_email;
        `;
        const { rows: correoPersonaRows } = await client.query(correoPersonaQuery, [
          persona.correo.direccion_email,
          nuevaPersona.clave
        ]);

        // Insertar teléfono de la persona de contacto
        const telefonoPersonaQuery = `
          INSERT INTO telefono (codigo, numero, extension, fk_persona_contacto)
          VALUES ($1, $2, $3, $4)
          RETURNING codigo, numero, extension;
        `;
        const { rows: telefonoPersonaRows } = await client.query(telefonoPersonaQuery, [
          persona.telefono.codigo,
          persona.telefono.numero,
          persona.telefono.extension || null,
          nuevaPersona.clave
        ]);

        personasContactoInsertadas.push({
          ...nuevaPersona,
          correo: correoPersonaRows[0],
          telefono: telefonoPersonaRows[0]
        });
      }
    }

    await client.query('COMMIT');

    // Formatear respuesta
    const clienteCompleto = {
      ...nuevoCliente,
      tipo,
      correo: correoRows[0],
      telefonos: telefonosInsertados,
      ...(tipo === 'juridico' && { personas_contacto: personasContactoInsertadas })
    };

    res.status(201).json({
      message: 'Cliente creado exitosamente',
      cliente: clienteCompleto
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear cliente:', error);
    
    // Manejar errores específicos de la base de datos
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ 
        message: 'Ya existe un cliente con este documento o correo' 
      });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    client.release();
  }
};

/**
 * Obtener lugares disponibles para direcciones con estructura jerárquica
 */
const getLugares = async (req, res) => {
  try {
    // Obtener todos los lugares con su jerarquía
    const queryText = `
      WITH RECURSIVE lugares_jerarquia AS (
        -- Estados (nivel raíz)
        SELECT clave, nombre, tipo, fk_lugar, 0 as nivel
        FROM lugar 
        WHERE tipo = 'estado' OR fk_lugar IS NULL
        
        UNION ALL
        
        -- Municipios y parroquias
        SELECT l.clave, l.nombre, l.tipo, l.fk_lugar, lj.nivel + 1
        FROM lugar l
        INNER JOIN lugares_jerarquia lj ON l.fk_lugar = lj.clave
      )
      SELECT * FROM lugares_jerarquia
      ORDER BY nivel, nombre;
    `;
    
    const { rows } = await db.query(queryText);
    
    // Organizar en estructura jerárquica
    const estados = [];
    const municipiosMap = new Map();
    const parroquiasMap = new Map();
    
    rows.forEach(lugar => {
      if (lugar.tipo === 'estado') {
        estados.push({
          ...lugar,
          municipios: []
        });
      } else if (lugar.tipo === 'municipio') {
        if (!municipiosMap.has(lugar.fk_lugar)) {
          municipiosMap.set(lugar.fk_lugar, []);
        }
        municipiosMap.get(lugar.fk_lugar).push({
          ...lugar,
          parroquias: []
        });
      } else if (lugar.tipo === 'parroquia') {
        if (!parroquiasMap.has(lugar.fk_lugar)) {
          parroquiasMap.set(lugar.fk_lugar, []);
        }
        parroquiasMap.get(lugar.fk_lugar).push(lugar);
      }
    });
    
    // Ensamblar la estructura completa
    estados.forEach(estado => {
      if (municipiosMap.has(estado.clave)) {
        estado.municipios = municipiosMap.get(estado.clave);
        estado.municipios.forEach(municipio => {
          if (parroquiasMap.has(municipio.clave)) {
            municipio.parroquias = parroquiasMap.get(municipio.clave);
          }
        });
      }
    });
    
    res.status(200).json({
      message: 'Lugares obtenidos exitosamente',
      lugares: {
        estados
      }
    });
  } catch (error) {
    console.error('Error al obtener lugares:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Obtener lugares planos (para compatibilidad)
 */
const getLugaresPlanos = async (req, res) => {
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

/**
 * Obtener municipios por estado
 */
const getMunicipiosPorEstado = async (req, res) => {
  const { estadoId } = req.params;
  
  try {
    const queryText = `
      SELECT clave, nombre, tipo, fk_lugar
      FROM lugar
      WHERE tipo = 'municipio' AND fk_lugar = $1
      ORDER BY nombre;
    `;
    
    const { rows } = await db.query(queryText, [estadoId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Obtener parroquias por municipio
 */
const getParroquiasPorMunicipio = async (req, res) => {
  const { municipioId } = req.params;
  
  try {
    const queryText = `
      SELECT clave, nombre, tipo, fk_lugar
      FROM lugar
      WHERE tipo = 'parroquia' AND fk_lugar = $1
      ORDER BY nombre;
    `;
    
    const { rows } = await db.query(queryText, [municipioId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener parroquias:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  identificarCliente,
  crearCliente,
  getLugares,
  getLugaresPlanos,
  getMunicipiosPorEstado,
  getParroquiasPorMunicipio
}; 