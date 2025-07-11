const db = require('../config/db');

/** Obtener presentaciones de cerveza disponibles en inventario de tienda física con ofertas */
const getAvailableProducts = async (req, res) => {
  const { tienda_id, busqueda, tipo, limite, offset } = req.query;
  
  try {
    // Construir condiciones WHERE dinámicamente
    let whereConditions = ['it.cantidad > 0'];
    let queryParams = [];
    let paramIndex = 1;

    // Filtro por tienda
    if (tienda_id) {
      whereConditions.push(`tf.clave = $${paramIndex}`);
      queryParams.push(tienda_id);
      paramIndex++;
    }

    // Filtro de búsqueda (nombre de cerveza, presentación o EAN)
    if (busqueda) {
      whereConditions.push(`(
        LOWER(c.nombre) LIKE LOWER($${paramIndex}) OR 
        LOWER(p.nombre) LIKE LOWER($${paramIndex}) OR 
        CAST(p.ean_13 AS TEXT) LIKE $${paramIndex}
      )`);
      queryParams.push(`%${busqueda}%`);
      paramIndex++;
    }

    // Filtro por tipo de cerveza
    if (tipo) {
      whereConditions.push(`LOWER(tc.nombre) = LOWER($${paramIndex})`);
      queryParams.push(tipo);
      paramIndex++;
    }

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
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY 
        CASE WHEN CAST(p.ean_13 AS TEXT) = '${busqueda || ''}' THEN 0 ELSE 1 END,
        tf.nombre, lt.nombre, p.nombre
      ${limite ? `LIMIT ${parseInt(limite)}` : ''}
      ${offset ? `OFFSET ${parseInt(offset)}` : ''};
    `;
    
    const { rows } = await db.query(queryText, queryParams);
    
    // Mapear los resultados para asegurar tipos de datos correctos
    const productos = rows.map(row => ({
      ...row,
      precio: parseFloat(row.precio) || 0,
      porcentaje_descuento: row.porcentaje_descuento ? parseFloat(row.porcentaje_descuento) : null,
      grado_alcohol: parseInt(row.grado_alcohol) || 0,
      cantidad_unidades: parseInt(row.cantidad_unidades) || 0,
      cantidad_disponible: parseInt(row.cantidad_disponible) || 0
    }));
    
    res.status(200).json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      productos: productos
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

/** Obtener métodos de pago favoritos del cliente */
const getClienteFavoritePaymentMethods = async (req, res) => {
  const { clienteId } = req.params;
  
  try {
    const queryText = `
      SELECT 
        clave,
        banco,
        numero_tarjeta,
        fecha_vencimiento,
        tipo,
        moneda
      FROM metodo_de_pago 
      WHERE fk_cliente = $1 
        AND metodo_preferido = true 
        AND tipo IN ('Tarjeta de credito', 'Tarjeta de debito')
      ORDER BY clave DESC;
    `;
    
    const { rows } = await db.query(queryText, [clienteId]);
    
    // Formatear los datos para el frontend
    const metodosFavoritos = rows.map(metodo => ({
      id: metodo.clave,
      banco: metodo.banco,
      numero_tarjeta: metodo.numero_tarjeta?.toString(),
      fecha_vencimiento: metodo.fecha_vencimiento,
      tipo: metodo.tipo === 'Tarjeta de credito' ? 'credito' : 'debito',
      moneda: metodo.moneda
    }));
    
    res.status(200).json({
      success: true,
      metodos: metodosFavoritos
    });
    
  } catch (error) {
    console.error('Error fetching favorite payment methods:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

// La función estrella: crear una orden llamando al Stored Procedure
const createOnlineOrder = async (req, res) => {
  const {
    usuarioId,
    direccionEnvio,
    lugarId,
    items,
    metodosPago // <-- ahora es un array [{metodo_id, monto, tasa_id}]
  } = req.body;

  if (!usuarioId || !items || !metodosPago || !Array.isArray(metodosPago) || metodosPago.length === 0) {
    return res.status(400).json({ message: 'Faltan datos para crear la orden.' });
  }

  try {
    const queryText = 'CALL crear_venta_online($1, $2, $3, $4, $5)';
    const queryParams = [
      usuarioId,
      direccionEnvio,
      lugarId,
      JSON.stringify(items),
      JSON.stringify(metodosPago)
    ];

    await db.query(queryText, queryParams);

    res.status(201).json({ message: 'Venta creada exitosamente.' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'Error al procesar la venta.',
      error: error.message,
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
    
    // Mapear los resultados para asegurar tipos de datos correctos
    const productos = rows.map(row => ({
      ...row,
      precio: parseFloat(row.precio) || 0,
      precio_oferta: parseFloat(row.precio_oferta) || 0,
      porcentaje_descuento: parseFloat(row.porcentaje_descuento) || 0,
      grado_alcohol: parseInt(row.grado_alcohol) || 0,
      cantidad_unidades: parseInt(row.cantidad_unidades) || 0,
      cantidad_disponible: parseInt(row.cantidad_disponible) || 0,
      tiene_oferta: true // Siempre true para esta función
    }));
    
    res.status(200).json(productos);
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

/** Obtener todas las tasas de cambio vigentes */
const getAllTasasCambio = async (req, res) => {
  try {
    const queryText = `
      SELECT DISTINCT ON (moneda)
        clave,
        moneda,
        monto_equivalencia,
        fecha_inicio,
        fecha_fin
      FROM tasa_cambio 
      WHERE (fecha_fin IS NULL OR fecha_fin >= CURRENT_DATE)
        AND fecha_inicio <= CURRENT_DATE
      ORDER BY 
        moneda, 
        fecha_fin ASC NULLS FIRST, -- Prioriza las tasas sin fecha de fin
        fecha_inicio DESC;
    `;
    
    const { rows } = await db.query(queryText);
    
    // Organizar las tasas por moneda para facilitar el acceso
    const tasasPorMoneda = {};
    rows.forEach(tasa => {
      tasasPorMoneda[tasa.moneda] = tasa;
    });
    
    res.status(200).json({
      success: true,
      message: 'Tasas de cambio obtenidas exitosamente',
      tasas: tasasPorMoneda,
      tasas_array: rows
    });
    
  } catch (error) {
    console.error('Error fetching all exchange rates:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

/** Crear una venta de tienda física */
const createVentaFisica = async (req, res) => {
  console.log('🔍 INICIANDO createVentaFisica');
  console.log('📋 Datos recibidos:', JSON.stringify(req.body, null, 2));
  
  const {
    cliente_id,
    tienda_id = 1, // Default a tienda ID 1
    items,
    metodos_pago,
    total_venta
  } = req.body;

  // Validación básica de entrada
  if (!cliente_id || !items || !Array.isArray(items) || items.length === 0) {
    console.error('❌ Datos de venta incompletos');
    return res.status(400).json({ 
      success: false,
      message: 'Datos de venta incompletos o inválidos' 
    });
  }

  console.log(`📊 Cliente: ${cliente_id}, Tienda: ${tienda_id}, Items: ${items.length}, Métodos de pago: ${metodos_pago.length}`);

  try {
    // Iniciar transacción
    await db.query('BEGIN');
    console.log('✅ Transacción iniciada');

    // Validar puntos del cliente si hay pagos con puntos
    const pagosConPuntos = metodos_pago.filter(mp => mp.tipo === 'Puntos');
    console.log(`💎 Pagos con puntos encontrados: ${pagosConPuntos.length}`);
    
    if (pagosConPuntos.length > 0) {
      // Obtener puntos actuales del cliente
      const puntosClienteQuery = `
        SELECT puntos_acumulados 
        FROM cliente 
        WHERE clave = $1;
      `;
      const puntosResult = await db.query(puntosClienteQuery, [cliente_id]);
      
      if (puntosResult.rows.length === 0) {
        throw new Error('Cliente no encontrado');
      }
      
      const puntosDisponibles = puntosResult.rows[0].puntos_acumulados || 0;
      const totalPuntosNecesarios = pagosConPuntos.reduce((sum, mp) => {
        const puntosUsados = mp.detalles?.puntos_usados || 0;
        console.log(`💎 Método de pago con puntos - Puntos usados: ${puntosUsados}`);
        return sum + puntosUsados;
      }, 0);
      
      console.log(`💎 Puntos disponibles: ${puntosDisponibles}, Puntos necesarios: ${totalPuntosNecesarios}`);
      
      if (puntosDisponibles < totalPuntosNecesarios) {
        throw new Error(`Puntos insuficientes. Disponibles: ${puntosDisponibles}, Necesarios: ${totalPuntosNecesarios}`);
      }
    }

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
      `;//
      
      await db.query(updateInventarioQuery, [item.cantidad, inventarioTienda.clave]);
    }

    // 3. Manejar métodos de pago con lógica específica por tipo
    console.log('💳 Procesando métodos de pago...');
    for (const metodoPago of metodos_pago) {
      console.log(`\n📝 Procesando método: ${metodoPago.tipo}`);
      console.log(`   Monto: ${metodoPago.monto}`);
      console.log(`   Detalles:`, metodoPago.detalles);
      
      let insertMetodoPagoQuery;
      let metodoPagoParams;
      
      // Construir query específico según el tipo de método de pago
      switch (metodoPago.tipo) {
        case 'Efectivo':
          // Determinar la moneda del efectivo basada en los detalles
          const monedaEfectivo = metodoPago.detalles?.moneda || 'VES';
          insertMetodoPagoQuery = `
            INSERT INTO metodo_de_pago (moneda, metodo_preferido, valor, tipo)
            VALUES ($1, FALSE, $2, $3)
            RETURNING clave;
          `;
          metodoPagoParams = [monedaEfectivo, metodoPago.detalles?.monto_original || metodoPago.monto, metodoPago.tipo];
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
          const esPreferido = metodoPago.detalles?.guardar_como_favorito || false;
          
          /** Convertir fecha de vencimiento de formato YYYY-MM a fecha completa del último día del mes */
          let fechaVencimientoCompleta = null;
          if (metodoPago.detalles?.fecha_vencimiento) {
            const fechaVencimiento = metodoPago.detalles.fecha_vencimiento;
            // Si viene en formato YYYY-MM (ej: 2028-06), convertir al último día del mes
            if (fechaVencimiento.match(/^\d{4}-\d{2}$/)) {
              // Crear fecha del último día del mes
              const [year, month] = fechaVencimiento.split('-');
              const ultimoDiaDelMes = new Date(parseInt(year), parseInt(month), 0).getDate();
              fechaVencimientoCompleta = `${year}-${month}-${ultimoDiaDelMes.toString().padStart(2, '0')}`;
            } else {
              // Si ya viene completa, usarla tal como está
              fechaVencimientoCompleta = fechaVencimiento;
            }
          }
          
          insertMetodoPagoQuery = `
            INSERT INTO metodo_de_pago (moneda, fk_cliente, metodo_preferido, numero_tarjeta, fecha_vencimiento, banco, tipo)
            VALUES ('VES', $1, $2, $3, $4, $5, $6)
            RETURNING clave;
          `;
          metodoPagoParams = [
            cliente_id,
            esPreferido,
            metodoPago.detalles?.numero_tarjeta || null,
            fechaVencimientoCompleta,
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
      console.log(metodoPago);
      let monedaPago;
      if (metodoPago.tipo === 'Puntos') {
        monedaPago = 'PUNTOS';
      } else if (metodoPago.tipo === 'Tarjeta de credito' || metodoPago.tipo === 'Tarjeta de debito') {
        // Para tarjetas, usar VES por defecto si no se especifica la moneda
        monedaPago = metodoPago.detalles?.moneda || 'VES';
      } else if (metodoPago.detalles?.moneda) {
        // Para otros métodos, usar la moneda especificada
        if (['VES', 'EUR', 'USD'].includes(metodoPago.detalles.moneda)) {
          monedaPago = metodoPago.detalles.moneda;
        } else {
          throw new Error(`Moneda no soportada: ${metodoPago.detalles.moneda}`);
        }
      } else {
        // Si no hay moneda especificada, usar VES por defecto
        monedaPago = 'VES';
      }

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

      // El trigger se encargará automáticamente de descontar los puntos
      // cuando el método de pago sea de tipo 'Puntos'
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

/** Buscar producto específicamente por EAN */
const getProductByEAN = async (req, res) => {
  const { ean } = req.params;
  const { tienda_id } = req.query;
  
  try {
    /** Query para obtener producto específico por EAN */
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
      WHERE CAST(p.ean_13 AS TEXT) = $1
        AND it.cantidad > 0
        ${tienda_id ? 'AND tf.clave = $2' : ''}
      LIMIT 1;
    `;
    
    const queryParams = tienda_id ? [ean, tienda_id] : [ean];
    const { rows } = await db.query(queryText, queryParams);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Producto con EAN ${ean} no encontrado o sin stock`
      });
    }
    
    // Mapear el resultado para asegurar tipos de datos correctos
    const producto = {
      ...rows[0],
      precio: parseFloat(rows[0].precio) || 0,
      porcentaje_descuento: rows[0].porcentaje_descuento ? parseFloat(rows[0].porcentaje_descuento) : null,
      grado_alcohol: parseInt(rows[0].grado_alcohol) || 0,
      cantidad_unidades: parseInt(rows[0].cantidad_unidades) || 0,
      cantidad_disponible: parseInt(rows[0].cantidad_disponible) || 0
    };
    
    res.status(200).json({
      success: true,
      message: 'Producto encontrado',
      producto: producto
    });
    
  } catch (error) {
    console.error('Error fetching product by EAN:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

/** Obtener una venta completa por su ID */
const getCompleteSale = async (req, res) => {
    const { ventaId } = req.params;
    try {
        const { rows } = await db.query('SELECT * FROM obtener_venta_completa($1)', [ventaId]);
        const ventaCompleta = rows[0];
        if (ventaCompleta) {
            res.json({ success: true, data: ventaCompleta });
        } else {
            res.status(404).json({ success: false, message: 'Venta no encontrada.' });
        }
    } catch (error) {
        console.error('Error al obtener venta completa:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener listado de todas las ventas en tienda física
const getVentasTienda = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM obtener_listado_ventas_tienda()');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener el listado de ventas en tienda:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

module.exports = {
  getAvailableProducts,
  getUserPaymentMethods,
  getClienteFavoritePaymentMethods,
  createOnlineOrder,
  getProductsWithOffers,
  getTiendasFisicas,
  getTasaCambioActual,
  getTasaCambioPuntos,
  getAllTasasCambio,
  createVentaFisica,
  getProductByEAN,
  getCompleteSale,
  getVentasTienda
};