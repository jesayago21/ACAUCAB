const pool = require('../../../backend/config/db');

// Con fechas que vienen del front
/**
 * async function run(fechaInicio, fechaFin) {
  try {
    // Si no se pasan fechas, usa valores por defecto
    fechaInicio = fechaInicio || '2025-06-17';
    fechaFin = fechaFin || '2025-06-21';

 */

async function run(fechaIni, fechaFinal) {
  try {
    // Validar y procesar las fechas
    let fechaInicio = fechaIni;
    let fechaFin = fechaFinal;
    let usandoFechasPorDefecto = false;

    console.log('📋 Parámetros recibidos en reporte de puntos:');
    console.log(`   • fechaIni: ${fechaIni || 'NO PROPORCIONADA'}`);
    console.log(`   • fechaFinal: ${fechaFinal || 'NO PROPORCIONADA'}`);

    // Si no se pasan fechas, usar valores por defecto (últimos 30 días)
    if (!fechaInicio || !fechaFin) {
      usandoFechasPorDefecto = true;
      const hoy = new Date();
      fechaFin = hoy.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const inicio = new Date(fechaFin);
      inicio.setDate(inicio.getDate() - 30);
      fechaInicio = inicio.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      
      console.log('⚠️  Usando fechas por defecto (últimos 30 días)');
      console.log(`   • fechaInicio por defecto: ${fechaInicio}`);
      console.log(`   • fechaFin por defecto: ${fechaFin}`);
    }

    // Validar formato de fechas
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
      throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    // Validar que fecha inicio no sea mayor que fecha fin
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      throw new Error('La fecha de inicio no puede ser mayor que la fecha de fin');
    }

    console.log('🔄 Ejecutando consulta de puntos canjeados...');
    console.log(`📅 Período: ${fechaInicio} a ${fechaFin}`);
    if (usandoFechasPorDefecto) {
      console.log('📅 Usando período por defecto (últimos 30 días)');
    } else {
      console.log('📅 Usando fechas proporcionadas como parámetros');
    }

    // Consulta principal usando la vista optimizada
    const queryCompleta = `
      SELECT *
      FROM vw_puntos_canjeados_completa
      WHERE fecha_pago BETWEEN $1 AND $2
      ORDER BY fecha_pago DESC, bolivares_equivalentes DESC
    `;

    console.log('🔍 Ejecutando consulta SQL con parámetros:', [fechaInicio, fechaFin]);
    const result = await pool.query(queryCompleta, [fechaInicio, fechaFin]);
    const datos = result.rows;
    
    console.log(`✅ Consulta completada. Se encontraron ${datos.length} registros.`);

    // Procesar datos para generar resumen y detalle
    const resumen = {
      total_clientes_afiliados: 0,
      total_pagos_puntos: datos.length,
      total_puntos_canjeados: 0,
      total_bolivares: 0,
      primera_fecha_pago: null,
      ultima_fecha_pago: null
    };

    const clientes = {};
    const porTipo = {
      natural: { cantidad_clientes: 0, total_puntos_canjeados: 0, total_bolivares: 0 },
      juridico: { cantidad_clientes: 0, total_puntos_canjeados: 0, total_bolivares: 0 }
    };

    // Procesar cada registro
    datos.forEach(row => {
      // Resumen general
      resumen.total_puntos_canjeados += parseFloat(row.puntos_canjeados || 0);
      resumen.total_bolivares += parseFloat(row.bolivares_equivalentes || 0);
      
      if (!resumen.primera_fecha_pago || new Date(row.fecha_pago) < new Date(resumen.primera_fecha_pago)) {
        resumen.primera_fecha_pago = row.fecha_pago;
      }
      if (!resumen.ultima_fecha_pago || new Date(row.fecha_pago) > new Date(resumen.ultima_fecha_pago)) {
        resumen.ultima_fecha_pago = row.fecha_pago;
      }

      // Agrupar por cliente
      if (!clientes[row.rif]) {
        clientes[row.rif] = {
          rif: row.rif,
          cliente: row.cliente,
          tipo_cliente: row.tipo_cliente,
          cantidad_pagos_puntos: 0,
          total_puntos_canjeados: 0,
          total_bolivares: 0,
          primera_fecha_pago: row.fecha_pago,
          ultima_fecha_pago: row.fecha_pago
        };
        resumen.total_clientes_afiliados++;
      }

      clientes[row.rif].cantidad_pagos_puntos++;
      clientes[row.rif].total_puntos_canjeados += parseFloat(row.puntos_canjeados || 0);
      clientes[row.rif].total_bolivares += parseFloat(row.bolivares_equivalentes || 0);
      
      if (new Date(row.fecha_pago) < new Date(clientes[row.rif].primera_fecha_pago)) {
        clientes[row.rif].primera_fecha_pago = row.fecha_pago;
      }
      if (new Date(row.fecha_pago) > new Date(clientes[row.rif].ultima_fecha_pago)) {
        clientes[row.rif].ultima_fecha_pago = row.fecha_pago;
      }

      // Agrupar por tipo
      const tipo = row.tipo_cliente;
      if (porTipo[tipo]) {
        porTipo[tipo].total_puntos_canjeados += parseFloat(row.puntos_canjeados || 0);
        porTipo[tipo].total_bolivares += parseFloat(row.bolivares_equivalentes || 0);
      }
    });

    // Contar clientes por tipo
    Object.values(clientes).forEach(cliente => {
      const tipo = cliente.tipo_cliente;
      if (porTipo[tipo]) {
        porTipo[tipo].cantidad_clientes++;
      }
    });

    // Formatear datos para el reporte
    const detalle = Object.values(clientes)
      .sort((a, b) => parseFloat(b.total_bolivares) - parseFloat(a.total_bolivares))
      .map(cliente => ({
        ...cliente,
        total_bolivares: parseFloat(cliente.total_bolivares).toFixed(2),
        total_puntos_canjeados: parseInt(cliente.total_puntos_canjeados),
        primera_fecha_pago: new Date(cliente.primera_fecha_pago).toLocaleDateString('es-ES'),
        ultima_fecha_pago: new Date(cliente.ultima_fecha_pago).toLocaleDateString('es-ES')
      }));

    const resumenFormateado = {
      ...resumen,
      total_bolivares: parseFloat(resumen.total_bolivares).toFixed(2),
      total_puntos_canjeados: parseInt(resumen.total_puntos_canjeados),
      primera_fecha_pago: resumen.primera_fecha_pago ? new Date(resumen.primera_fecha_pago).toLocaleDateString('es-ES') : 'N/A',
      ultima_fecha_pago: resumen.ultima_fecha_pago ? new Date(resumen.ultima_fecha_pago).toLocaleDateString('es-ES') : 'N/A'
    };

    const puntos_por_tipo = Object.entries(porTipo)
      .filter(([tipo, datos]) => datos.cantidad_clientes > 0)
      .map(([tipo, datos]) => ({
        tipo_cliente: tipo,
        cantidad_clientes: datos.cantidad_clientes,
        total_puntos_canjeados: parseInt(datos.total_puntos_canjeados),
        total_bolivares: parseFloat(datos.total_bolivares).toFixed(2),
        tipo_cliente_formatted: tipo === 'natural' ? 'cliente Natural' : 'cliente Jurídico'
      }))
      .sort((a, b) => parseFloat(b.total_bolivares) - parseFloat(a.total_bolivares));

    // Calcular rankings
    const top_clientes = [...detalle]
      .sort((a, b) => parseInt(b.total_puntos_canjeados) - parseInt(a.total_puntos_canjeados))
      .slice(0, 5);

    const top_valor = [...detalle]
      .sort((a, b) => parseFloat(b.total_bolivares) - parseFloat(a.total_bolivares))
      .slice(0, 5);

    // Análisis de tendencias
    const analisis_tendencias = {
      tipo_dominante: porTipo.natural.total_bolivares > porTipo.juridico.total_bolivares ? 'Natural' : 'Jurídico',
      promedio_puntos_cliente: resumen.total_clientes_afiliados > 0 ? Math.round(resumen.total_puntos_canjeados / resumen.total_clientes_afiliados) : 0,
      promedio_valor_cliente: resumen.total_clientes_afiliados > 0 ? (resumen.total_bolivares / resumen.total_clientes_afiliados).toFixed(2) : '0.00',
      tasa_uso: resumen.total_clientes_afiliados > 0 ? Math.round((resumen.total_pagos_puntos / resumen.total_clientes_afiliados) * 100) : 0
    };

    console.log('📊 Datos procesados correctamente');
    console.log(`   • Total clientes: ${resumenFormateado.total_clientes_afiliados}`);
    console.log(`   • Total pagos: ${resumenFormateado.total_pagos_puntos}`);
    console.log(`   • Total puntos: ${resumenFormateado.total_puntos_canjeados}`);

    return {
      detalle,
      resumen: resumenFormateado,
      puntos_por_tipo,
      top_clientes,
      top_valor,
      analisis_tendencias,
      fechaInicio: new Date(fechaInicio).toLocaleDateString('es-ES'),
      fechaFin: new Date(fechaFin).toLocaleDateString('es-ES'),
      fechaGeneracion: new Date().toLocaleDateString('es-ES'),
      horaGeneracion: new Date().toLocaleTimeString('es-ES'),
      parametros: {
        fechaInicioOriginal: fechaIni,
        fechaFinOriginal: fechaFinal,
        fechaInicioProcesada: fechaInicio,
        fechaFinProcesada: fechaFin,
        usandoFechasPorDefecto: usandoFechasPorDefecto
      }
    };

  } catch (error) {
    console.error('❌ Error ejecutando consulta:', error);
    throw new Error(`Error en reporte de puntos canjeados: ${error.message}`);
  }
}

module.exports = { run };