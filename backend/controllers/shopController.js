const db = require('../config/db');

/** Obtener presentaciones de cerveza disponibles en inventario de tienda física con ofertas */
const getAvailableProducts = async (req, res) => {
  const { tienda_id } = req.query; // Parámetro opcional para filtrar por tienda
  
  try {
    /** Query para obtener presentaciones con información completa y ofertas activas */
    const queryText = `
      SELECT 
        p.clave,
        p.ean_13,
        p.nombre AS nombre_presentacion,
        p.cantidad_unidades,
        p.precio,
        c.nombre AS nombre_cerveza,
        c.grado_alcohol,
        tc.nombre AS tipo_cerveza,
        m.razon_social AS miembro,
        it.cantidad AS cantidad_disponible,
        lt.nombre AS lugar_tienda,
        tf.nombre AS tienda_fisica,
        CASE 
          WHEN o.clave IS NOT NULL AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin 
          THEN true 
          ELSE false 
        END AS tiene_oferta,
        o.porcentaje_descuento,
        o.fecha_inicio AS fecha_inicio_oferta,
        o.fecha_fin AS fecha_fin_oferta
      FROM presentacion p
      INNER JOIN cerveza c ON p.fk_cerveza = c.clave
      INNER JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
      INNER JOIN miembro m ON c.fk_miembro = m.rif
      INNER JOIN inventario_tienda it ON p.clave = it.fk_presentacion
      INNER JOIN lugar_tienda lt ON it.fk_lugar_tienda = lt.clave
      INNER JOIN tienda_fisica tf ON it.fk_tienda_fisica = tf.clave
      LEFT JOIN oferta o ON p.clave = o.fk_presentacion 
        AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin
      WHERE it.cantidad > 0
      ${tienda_id ? 'AND tf.clave = $1' : ''}
      ORDER BY tf.nombre, lt.nombre, p.nombre;
    `;
    
    const queryParams = tienda_id ? [tienda_id] : [];
    const { rows } = await db.query(queryText, queryParams);
    
    res.status(200).json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      productos: rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener métodos de pago del usuario (tarjetas de crédito)
const getUserPaymentMethods = async (req, res) => {
  const { userId } = req.params;
  try {
    const queryText = `
      SELECT clave, banco, numero_tarjeta, fecha_vencimiento 
      FROM metodo_de_pago 
      WHERE fk_usuario = $1 AND tipo = 'Tarjeta de credito';
    `;
    const { rows } = await db.query(queryText, [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// La función estrella: crear una orden llamando al Stored Procedure
const createOnlineOrder = async (req, res) => {
  // El frontend nos envía el cuerpo de la petición con los datos de la orden
  const {
    usuarioId,
    direccionEnvio,
    lugarId,
    metodoPagoId,
    tasaCambioId,
    items, // Esto debe ser un string JSON: '[{"producto_id":1, "cantidad":2, "precio":10.50}]'
  } = req.body;

  // Validación básica de entrada
  if (!usuarioId || !items || !metodoPagoId) {
    return res.status(400).json({ message: 'Faltan datos para crear la orden.' });
  }

  try {
    // ¡AQUÍ ESTÁ LA MAGIA!
    // Llamamos al Stored Procedure con CALL.
    // El último parámetro (p_nueva_venta_id) se inicializa en 0 y la BD lo modificará.
    const queryText = 'CALL crear_venta_online($1, $2, $3, $4, $5, $6, $7)';
    const queryParams = [
      usuarioId,
      direccionEnvio,
      lugarId,
      metodoPagoId,
      tasaCambioId,
      JSON.stringify(items), // Convertimos el array de JS a un string JSON para la BD
      0 // Valor inicial para el parámetro INOUT
    ];

    await db.query(queryText, queryParams);
    
    // NOTA: Para obtener el valor de vuelta de p_nueva_venta_id, la sintaxis puede variar.
    // Una forma más simple es cambiar el SP a una FUNCTION que RETORNE el ID.
    // Pero con CALL, el driver debe manejar parámetros de salida.
    // Asumamos que el SP funciona y la venta se creó.

    res.status(201).json({ message: 'Venta creada exitosamente.' });

  } catch (error) {
    // Si el Stored Procedure lanzó una excepción (ej: stock insuficiente), la capturamos aquí.
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'Error al procesar la venta.',
      error: error.message, // Enviamos el mensaje de error de la BD al cliente (ej: "Stock insuficiente...")
    });
  }
};

/** Obtener solo productos con ofertas activas */
const getProductsWithOffers = async (req, res) => {
  const { tienda_id } = req.query;
  
  try {
    /** Query para obtener solo presentaciones con ofertas activas */
    const queryText = `
      SELECT 
        p.clave,
        p.ean_13,
        p.nombre AS nombre_presentacion,
        p.cantidad_unidades,
        p.precio,
        c.nombre AS nombre_cerveza,
        c.grado_alcohol,
        tc.nombre AS tipo_cerveza,
        m.razon_social AS miembro,
        it.cantidad AS cantidad_disponible,
        lt.nombre AS lugar_tienda,
        tf.nombre AS tienda_fisica,
        o.porcentaje_descuento,
        Round((p.precio * (1 - (CAST(o.porcentaje_descuento AS DECIMAL) / 100))),2) AS precio_oferta, 
        o.fecha_inicio AS fecha_inicio_oferta,
        o.fecha_fin AS fecha_fin_oferta
      FROM presentacion p
      INNER JOIN cerveza c ON p.fk_cerveza = c.clave
      INNER JOIN tipo_cerveza tc ON c.fk_tipo_cerveza = tc.clave
      INNER JOIN miembro m ON c.fk_miembro = m.rif
      INNER JOIN inventario_tienda it ON p.clave = it.fk_presentacion
      INNER JOIN lugar_tienda lt ON it.fk_lugar_tienda = lt.clave
      INNER JOIN tienda_fisica tf ON it.fk_tienda_fisica = tf.clave
      INNER JOIN oferta o ON p.clave = o.fk_presentacion
      WHERE it.cantidad > 0
        AND CURRENT_DATE BETWEEN o.fecha_inicio AND o.fecha_fin
        ${tienda_id ? 'AND tf.clave = $1' : ''}
      ORDER BY o.porcentaje_descuento DESC, tf.nombre, p.nombre;
    `;
    
    const queryParams = tienda_id ? [tienda_id] : [];
    const { rows } = await db.query(queryText, queryParams);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products with offers:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/** Obtener lista de tiendas físicas disponibles */
const getTiendasFisicas = async (req, res) => {
  try {
    const queryText = `
      SELECT clave, nombre, direccion, rif_empresa
      FROM tienda_fisica
      ORDER BY nombre;
    `;
    const { rows } = await db.query(queryText);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching tiendas físicas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/** Obtener la tasa de cambio actual del USD */
const getTasaCambioActual = async (req, res) => {
  try {
    const queryText = `
      SELECT clave, moneda, monto_equivalencia, fecha_inicio, fecha_fin
      FROM tasa_cambio
      WHERE moneda = 'USD'
        AND (fecha_fin IS NULL OR fecha_fin >= CURRENT_DATE)
        AND fecha_inicio <= CURRENT_DATE
      ORDER BY fecha_inicio DESC
      LIMIT 1;
    `;
    
    const { rows } = await db.query(queryText);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró una tasa de cambio USD vigente'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Tasa de cambio obtenida exitosamente',
      tasa: rows[0]
    });
    
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

/** Obtener la tasa de cambio actual de PUNTOS */
const getTasaCambioPuntos = async (req, res) => {
  try {
    const queryText = `
      SELECT clave, moneda, monto_equivalencia, fecha_inicio, fecha_fin
      FROM tasa_cambio
      WHERE moneda = 'PUNTOS'
        AND (fecha_fin IS NULL OR fecha_fin >= CURRENT_DATE)
        AND fecha_inicio <= CURRENT_DATE
      ORDER BY fecha_inicio DESC
      LIMIT 1;
    `;
    
    const { rows } = await db.query(queryText);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró una tasa de cambio de PUNTOS vigente'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Tasa de cambio de puntos obtenida exitosamente',
      tasa: rows[0]
    });
    
  } catch (error) {
    console.error('Error fetching points exchange rate:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

/** Crear una venta de tienda física */
const createVentaFisica = async (req, res) => {
  const {
    cliente_id,
    tienda_id = 1, // Default a tienda ID 1
    items,
    metodos_pago,
    total_venta
  } = req.body;

  // Validación básica de entrada
  if (!cliente_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ 
      success: false,
      message: 'Datos de venta incompletos o inválidos' 
    });
  }

  try {
    // Iniciar transacción
    await db.query('BEGIN');

    // 1. Crear la venta en venta_tienda_fisica
    const insertVentaQuery = `
      INSERT INTO venta_tienda_fisica (fecha, total_venta, fk_tienda_fisica, fk_cliente)
      VALUES (CURRENT_DATE, $1, $2, $3)
      RETURNING clave;
    `;
    
    const ventaResult = await db.query(insertVentaQuery, [total_venta, tienda_id, cliente_id]);
    const ventaId = ventaResult.rows[0].clave;

    // 2. Insertar los detalles de la venta
    for (const item of items) {
      // Obtener el inventario_tienda correspondiente al producto
      const inventarioQuery = `
        SELECT clave, cantidad
        FROM inventario_tienda 
        WHERE fk_presentacion = $1 AND fk_tienda_fisica = $2
        LIMIT 1;
      `;
      
      const inventarioResult = await db.query(inventarioQuery, [item.producto_id, tienda_id]);
      
      if (inventarioResult.rows.length === 0) {
        throw new Error(`Producto ${item.producto_id} no disponible en inventario`);
      }
      
      const inventarioTienda = inventarioResult.rows[0];
      
      if (inventarioTienda.cantidad < item.cantidad) {
        throw new Error(`Stock insuficiente para producto ${item.producto_id}. Disponible: ${inventarioTienda.cantidad}, Solicitado: ${item.cantidad}`);
      }

      // Insertar detalle de venta
      const insertDetalleQuery = `
        INSERT INTO detalle_venta_fisica (cantidad, precio_unitario, fk_venta_tienda_fisica, fk_inventario_tienda)
        VALUES ($1, $2, $3, $4);
      `;
      
      await db.query(insertDetalleQuery, [
        item.cantidad,
        item.precio_unitario,
        ventaId,
        inventarioTienda.clave
      ]);

      // Actualizar inventario (restar cantidad vendida)
      const updateInventarioQuery = `
        UPDATE inventario_tienda 
        SET cantidad = cantidad - $1 
        WHERE clave = $2;
      `;
      
      await db.query(updateInventarioQuery, [item.cantidad, inventarioTienda.clave]);
    }

    // 3. Manejar métodos de pago con lógica específica por tipo
    for (const metodoPago of metodos_pago) {
      let insertMetodoPagoQuery;
      let metodoPagoParams;
      
      // Construir query específico según el tipo de método de pago
      switch (metodoPago.tipo) {
        case 'Efectivo':
          insertMetodoPagoQuery = `
            INSERT INTO metodo_de_pago (moneda, metodo_preferido, valor, tipo)
            VALUES ('VES', FALSE, $1, $2)
            RETURNING clave;
          `;
          metodoPagoParams = [metodoPago.monto, metodoPago.tipo];
          break;
          
        case 'Cheque':
          insertMetodoPagoQuery = `
            INSERT INTO metodo_de_pago (moneda, metodo_preferido, numero_cheque, banco, tipo)
            VALUES ('VES', FALSE, $1, $2, $3)
            RETURNING clave;
          `;
          metodoPagoParams = [
            metodoPago.detalles?.numero_cheque || null,
            metodoPago.detalles?.banco || null,
            metodoPago.tipo
          ];
          break;
          
        case 'Tarjeta de credito':
        case 'Tarjeta de debito':
          insertMetodoPagoQuery = `
            INSERT INTO metodo_de_pago (moneda, metodo_preferido, numero_tarjeta, fecha_vencimiento, banco, tipo)
            VALUES ('VES', FALSE, $1, $2, $3, $4)
            RETURNING clave;
          `;
          metodoPagoParams = [
            metodoPago.detalles?.numero_tarjeta || null,
            metodoPago.detalles?.fecha_vencimiento || null,
            metodoPago.detalles?.banco || null,
            metodoPago.tipo
          ];
          break;
          
        case 'Puntos':
          insertMetodoPagoQuery = `
            INSERT INTO metodo_de_pago (moneda, metodo_preferido, tipo)
            VALUES ('PUNTOS', FALSE, $1)
            RETURNING clave;
          `;
          metodoPagoParams = [metodoPago.tipo];
          break;
          
        default:
          throw new Error(`Tipo de método de pago no soportado: ${metodoPago.tipo}`);
      }
      
      const metodoPagoResult = await db.query(insertMetodoPagoQuery, metodoPagoParams);
      const metodoPagoId = metodoPagoResult.rows[0].clave;

      // Obtener tasa de cambio apropiada según el método
      const monedaPago = metodoPago.tipo === 'Puntos' ? 'PUNTOS' : 'VES';
      const tasaQuery = `
        SELECT clave FROM tasa_cambio 
        WHERE moneda = $1
        AND (fecha_fin IS NULL OR fecha_fin >= CURRENT_DATE)
        ORDER BY fecha_inicio DESC 
        LIMIT 1;
      `;
      
      const tasaResult = await db.query(tasaQuery, [monedaPago]);
      const tasaId = tasaResult.rows.length > 0 ? tasaResult.rows[0].clave : 1; // Fallback

      // Crear registro de pago
      const insertPagoQuery = `
        INSERT INTO pago (fecha_pago, monto_total, fk_tasa_cambio, fk_metodo_de_pago, fk_venta_tienda_fisica)
        VALUES (CURRENT_DATE, $1, $2, $3, $4);
      `;
      
      await db.query(insertPagoQuery, [
        metodoPago.monto,
        tasaId,
        metodoPagoId,
        ventaId
      ]);

      // Si es pago con puntos, descontar los puntos usados del cliente
      if (metodoPago.tipo === 'Puntos' && metodoPago.detalles?.puntos_usados) {
        const updatePuntosUsadosQuery = `
          UPDATE cliente 
          SET puntos_acumulados = puntos_acumulados - $1 
          WHERE clave = $2;
        `;
        
        await db.query(updatePuntosUsadosQuery, [
          metodoPago.detalles.puntos_usados,
          cliente_id
        ]);
      }
    }

    // 4. Actualizar puntos del cliente (1 punto por producto)
    const puntosGanados = items.reduce((sum, item) => sum + item.cantidad, 0);
    const updatePuntosQuery = `
      UPDATE cliente 
      SET puntos_acumulados = COALESCE(puntos_acumulados, 0) + $1 
      WHERE clave = $2;
    `;
    
    await db.query(updatePuntosQuery, [puntosGanados, cliente_id]);

    // Calcular total de puntos usados en la venta
    const totalPuntosUsados = metodos_pago
      .filter(mp => mp.tipo === 'Puntos' && mp.detalles?.puntos_usados)
      .reduce((sum, mp) => sum + mp.detalles.puntos_usados, 0);

    // Confirmar transacción
    await db.query('COMMIT');

    // Crear mensaje informativo
    let mensaje = `Venta creada exitosamente. Puntos ganados: ${puntosGanados}`;
    if (totalPuntosUsados > 0) {
      mensaje += `, Puntos usados: ${totalPuntosUsados}`;
    }

    res.status(201).json({
      success: true,
      venta_id: ventaId,
      puntos_ganados: puntosGanados,
      puntos_usados: totalPuntosUsados,
      message: mensaje
    });

  } catch (error) {
    // Rollback en caso de error
    await db.query('ROLLBACK');
    console.error('Error creating venta física:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la venta',
      error: error.message
    });
  }
};

module.exports = {
  getAvailableProducts,
  getUserPaymentMethods,
  createOnlineOrder,
  getProductsWithOffers,
  getTiendasFisicas,
  getTasaCambioActual,
  getTasaCambioPuntos,
  createVentaFisica,
};