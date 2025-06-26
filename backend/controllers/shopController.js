const db = require('../config/db');

/**
 * Obtener productos disponibles con filtros y paginación.
 */
const getAvailableProducts = async (req, res) => {
    const { tienda_id, busqueda, tipo, limite = 10, offset = 0, solo_ofertas = false } = req.query;
    try {
        const { rows } = await db.query(
            'SELECT * FROM obtener_productos_disponibles($1, $2, $3, $4, $5, $6)',
            [tienda_id || null, busqueda || null, tipo || null, solo_ofertas, limite, offset]
        );
        res.status(200).json({ success: true, productos: rows });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener métodos de pago favoritos de un cliente.
 */
const getClienteFavoritePaymentMethods = async (req, res) => {
    const { clienteId } = req.params;
    try {
        const { rows } = await db.query('SELECT * FROM obtener_metodos_pago_favoritos($1)', [clienteId]);
        res.status(200).json({ success: true, metodos: rows });
    } catch (error) {
        console.error('Error fetching favorite payment methods:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

/**
 * Crear una venta online.
 */
const createOnlineOrder = async (req, res) => {
    const { usuarioId, direccionEnvio, lugarId, items, metodosPago } = req.body;
    try {
        const result = await db.query(
            'SELECT crear_venta_online($1, $2, $3, $4::JSON, $5::JSON) as venta_id', [
            usuarioId, direccionEnvio, lugarId, JSON.stringify(items), JSON.stringify(metodosPago)
        ]);
        res.status(201).json({ success: true, message: 'Venta creada exitosamente.', venta_id: result.rows[0].venta_id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error al procesar la venta.', error: error.message });
    }
};

/**
 * Obtener todas las tiendas físicas.
 */
const getTiendasFisicas = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM obtener_tiendas_fisicas()');
        res.status(200).json({ success: true, tiendas: rows });
    } catch (error) {
        console.error('Error al obtener tiendas:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener la tasa de cambio actual para una moneda.
 */
const getTasaCambioActual = async (req, res) => {
    const { moneda } = req.query;
    try {
        const { rows } = await db.query('SELECT * FROM obtener_tasa_cambio($1)', [moneda]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontró tasa de cambio para la moneda especificada.' });
        }
        res.status(200).json({ success: true, tasa: rows[0] });
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
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
      }
    }
    // Finalizar transacción
    await db.query('COMMIT');
    console.log('✅ Venta creada y transacción finalizada exitosamente');

    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      venta_id: ventaId
    });

  } catch (error) {
    // Revertir transacción en caso de error
    await db.query('ROLLBACK');
    console.error('❌ Error en createVentaFisica, transacción revertida:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor al crear la venta'
    });
  }
};

/**
 * Obtener un producto por su código EAN-13 para el punto de venta.
 */
const getProductByEAN = async (req, res) => {
    const { ean, tienda_id } = req.query;
    try {
        const { rows } = await db.query('SELECT obtener_producto_por_ean($1, $2) as producto', [ean, tienda_id]);
        if (!rows[0] || !rows[0].producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado en esta tienda.' });
        }
        res.status(200).json({ success: true, producto: rows[0].producto });
    } catch (error) {
        console.error('Error al obtener producto por EAN:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener los datos completos de una venta por su ID.
 */
const getVentaCompleta = async (req, res) => {
    const { ventaId } = req.params;
    try {
        const result = await db.query('SELECT obtener_venta_completa($1) as venta_data', [ventaId]);
        if (!result.rows[0] || !result.rows[0].venta_data || !result.rows[0].venta_data.venta) {
            return res.status(404).json({ success: false, message: 'Venta no encontrada' });
        }
        res.status(200).json({ success: true, data: result.rows[0].venta_data });
    } catch (error) {
        console.error('Error al obtener datos completos de la venta:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

/**
 * Obtener los datos completos de una venta ONLINE por su ID.
 */
const getVentaOnlineCompleta = async (req, res) => {
    const { ventaId } = req.params;
    try {
        const result = await db.query('SELECT obtener_venta_online_completa($1) as venta_data', [ventaId]);
        if (!result.rows[0] || !result.rows[0].venta_data || !result.rows[0].venta_data.venta) {
            return res.status(404).json({ success: false, message: 'Venta online no encontrada' });
        }
        res.status(200).json({ success: true, data: result.rows[0].venta_data });
    } catch (error) {
        console.error('Error al obtener datos completos de la venta online:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

module.exports = {
    getAvailableProducts,
    getClienteFavoritePaymentMethods,
    createOnlineOrder,
    getTiendasFisicas,
    getTasaCambioActual,
    createVentaFisica,
    getProductByEAN,
    getVentaCompleta,
    getVentaOnlineCompleta,
};