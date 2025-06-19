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
    res.status(200).json(rows);
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
        c.nombre AS nombre_cerveza,
        c.grado_alcohol,
        tc.nombre AS tipo_cerveza,
        m.razon_social AS miembro,
        it.cantidad AS cantidad_disponible,
        lt.nombre AS lugar_tienda,
        tf.nombre AS tienda_fisica,
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

module.exports = {
  getAvailableProducts,
  getUserPaymentMethods,
  createOnlineOrder,
  getProductsWithOffers,
  getTiendasFisicas,
};