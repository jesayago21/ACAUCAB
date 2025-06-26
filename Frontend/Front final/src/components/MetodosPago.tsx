/** Componente para gestión de métodos de pago múltiples */
import React, { useState, useEffect } from 'react';
import { clienteService, tasaCambioService, ventaService } from '../services/api';
import type { ClienteNatural, ClienteJuridico, MetodoPago, PuntosCliente, TasaCambio } from '../types/api';
import type { UseCarritoReturn } from '../hooks/useCarrito';

interface MetodosPagoProps {
  cliente: ClienteNatural | ClienteJuridico;
  carrito: UseCarritoReturn;
  onPagoExitoso: (clienteActualizado?: ClienteNatural | ClienteJuridico) => void;
  onVolver: () => void;
}

interface PagoAplicado {
  id: string;
  tipo: 'Efectivo' | 'Cheque' | 'Tarjeta de credito' | 'Tarjeta de debito' | 'Puntos';
  monto: number;
  detalles?: any;
}



export default function MetodosPago({ 
  cliente, 
  carrito, 
  onPagoExitoso, 
  onVolver 
}: MetodosPagoProps) {
  const [montoPendiente, setMontoPendiente] = useState(carrito.totalPrecio);
  const [pagosAplicados, setPagosAplicados] = useState<PagoAplicado[]>([]);
  const [metodoPago, setMetodoPago] = useState<'Efectivo' | 'Cheque' | 'Tarjeta' | 'Puntos' | ''>('');
  const [subtipoTarjeta, setSubtipoTarjeta] = useState<'credito' | 'debito'>('credito');
  const [procesando, setProcesando] = useState(false);
  
  // Estados para puntos
  const [puntosCliente, setPuntosCliente] = useState<PuntosCliente | null>(null);
  const [montoPuntos, setMontoPuntos] = useState('');
  const [tasaPuntos, setTasaPuntos] = useState<TasaCambio | null>(null);
  
  // Estados para formularios
  const [montoEntregado, setMontoEntregado] = useState('');
  const [montoPagar, setMontoPagar] = useState(''); // Nuevo: monto específico a pagar en efectivo
  const [monedaEfectivo, setMonedaEfectivo] = useState<'VES' | 'USD' | 'EUR'>('VES');
  const [tasasCambio, setTasasCambio] = useState<{ [moneda: string]: TasaCambio }>({});
  const [montoTarjeta, setMontoTarjeta] = useState('');
  const [montoCheque, setMontoCheque] = useState('');
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    vencimiento: '',
    banco: '',
    guardarComoFavorito: false
  });
  const [datosCheque, setDatosCheque] = useState({
    numero: '',
    banco: ''
  });
  
  // Estados para métodos favoritos
  const [metodosFavoritos, setMetodosFavoritos] = useState<any[]>([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  /** Cargar datos iniciales */
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      console.log('🔄 Cargando datos iniciales...');
      
      // Cargar todas las tasas de cambio de una vez
      const todasLasTasas = await tasaCambioService.obtenerTodasLasTasas();
      console.log('📊 Tasas de cambio obtenidas:', todasLasTasas);
      
      // Configurar todas las tasas
      setTasasCambio(todasLasTasas);
      
      if (todasLasTasas.PUNTOS) {
        setTasaPuntos(todasLasTasas.PUNTOS);
      }
      
      // Cargar métodos de pago favoritos del cliente (solo tarjetas)
      try {
        const favoritos = await clienteService.obtenerMetodosFavoritos(cliente.clave!);
        setMetodosFavoritos(favoritos);
        console.log(`💳 ${favoritos.length} métodos favoritos cargados`);
      } catch (error) {
        console.error('Error cargando métodos favoritos:', error);
        setMetodosFavoritos([]);
      }
      
      // Usar los puntos reales del cliente
      const puntosDisponibles = cliente.puntos_acumulados || 0;
      const tasaPuntosValor = todasLasTasas.PUNTOS?.monto_equivalencia || 1;
      const puntosData: PuntosCliente = {
        puntos_disponibles: puntosDisponibles,
        valor_en_bolivares: parseFloat((puntosDisponibles * tasaPuntosValor).toFixed(2)),
        tasa_cambio: tasaPuntosValor
      };
      setPuntosCliente(puntosData);
      
      console.log('✅ Datos iniciales cargados exitosamente');
    } catch (error) {
      console.error('❌ Error cargando datos iniciales:', error);
      // Fallback con datos del cliente sin tasa
      if (cliente.puntos_acumulados) {
        const puntosSimulados: PuntosCliente = {
          puntos_disponibles: cliente.puntos_acumulados,
          valor_en_bolivares: cliente.puntos_acumulados * 1, // 1:1 como fallback
          tasa_cambio: 1
        };
        setPuntosCliente(puntosSimulados);
      }
    }
  };

  /** Formatear precio */
  const formatearPrecio = (precio: number): string => {
    return precio.toLocaleString('es-VE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  /** Calcular vuelto total de todos los pagos en efectivo */
  const calcularVueltoTotal = (): { totalVuelto: number; detallesVuelto: Array<{moneda: string, vuelto: number}> } => {
    let totalVueltoEnBs = 0;
    const detallesVuelto: Array<{moneda: string, vuelto: number}> = [];

    pagosAplicados.forEach(pago => {
      if (pago.tipo === 'Efectivo' && pago.detalles?.vuelto && pago.detalles.vuelto > 0) {
        const vueltoEnMoneda = pago.detalles.vuelto;
        const moneda = pago.detalles.moneda || 'VES';
        
        // Convertir vuelto a bolívares para sumar al total
        const vueltoEnBs = calcularEquivalenteBolivares(vueltoEnMoneda, moneda as 'VES' | 'USD' | 'EUR');
        totalVueltoEnBs += vueltoEnBs;
        
        // Agregar detalle del vuelto en moneda original
        detallesVuelto.push({
          moneda,
          vuelto: vueltoEnMoneda
        });
      }
    });

    return { totalVuelto: totalVueltoEnBs, detallesVuelto };
  };

  /** Aplicar pago */
  const aplicarPago = (tipoPago: PagoAplicado['tipo'], monto: number, detalles?: any) => {
    if (monto <= 0) return;

    // Para efectivo, permitir que el monto aplicado pueda ser mayor al pendiente
    // (el vuelto se maneja en los detalles)
    let montoFinalAplicado = monto;
    
    // Para otros métodos de pago, limitar al monto pendiente con tolerancia decimal
    if (tipoPago !== 'Efectivo') {
      // Usar tolerancia decimal para permitir montos exactos al pendiente
      if (monto > (montoPendiente + 0.001)) {
        console.error('❌ Intento de sobrepago detectado:', {
          tipoPago,
          monto,
          montoPendiente,
          diferencia: monto - montoPendiente
        });
        return; // No permitir sobrepago en otros métodos
      }
      montoFinalAplicado = Math.min(monto, montoPendiente);
    } else {
      // Para efectivo, el monto aplicado es el menor entre lo que se paga y lo pendiente
      // pero guardamos el vuelto en los detalles
      montoFinalAplicado = Math.min(monto, montoPendiente);
    }

    console.log('💳 Aplicando pago:', {
      tipoPago,
      montoOriginal: monto,
      montoFinalAplicado,
      montoPendiente,
      diferencia: montoPendiente - montoFinalAplicado
    });

    const nuevoPago: PagoAplicado = {
      id: `${tipoPago}-${Date.now()}`,
      tipo: tipoPago,
      monto: montoFinalAplicado,
      detalles
    };

    setPagosAplicados(prev => [...prev, nuevoPago]);
    setMontoPendiente(prev => prev - montoFinalAplicado);

    // Resetear formularios
    setMontoEntregado('');
    setMontoPagar('');
    setMontoPuntos('');
    setMontoTarjeta('');
    setMontoCheque('');
    setDatosTarjeta({ numero: '', vencimiento: '', banco: '', guardarComoFavorito: false });
    setDatosCheque({ numero: '', banco: '' });
  };

  /** Remover pago aplicado */
  const removerPago = (pagoId: string) => {
    const pago = pagosAplicados.find(p => p.id === pagoId);
    if (!pago) return;

    setPagosAplicados(prev => prev.filter(p => p.id !== pagoId));
    setMontoPendiente(prev => prev + pago.monto);
  };

  /** Calcular equivalente en bolívares según la moneda seleccionada */
  const calcularEquivalenteBolivares = (monto: number, moneda: 'VES' | 'USD' | 'EUR'): number => {
    if (moneda === 'VES') return monto;
    
    const tasa = tasasCambio[moneda];
    if (!tasa) return monto;
    
    // Convertir a bolívares usando la tasa actual
    return monto * tasa.monto_equivalencia;
  };

  /** Aplicar pago con efectivo */
  const handlePagoEfectivo = () => {
    const montoEntregadoNum = parseFloat(montoEntregado) || 0;
    const montoPagarNum = parseFloat(montoPagar) || 0;
    
    if (montoEntregadoNum <= 0 || montoPagarNum <= 0) {
      alert('Debe ingresar montos válidos en ambos campos.');
      return;
    }

    if (montoPagarNum > montoEntregadoNum) {
      alert('El "Monto a Pagar" no puede ser mayor al "Monto Entregado".');
      return;
    }

    const tasa = monedaEfectivo !== 'VES' ? tasasCambio[monedaEfectivo] : null;
    const montoPendienteEnMoneda = tasa 
      ? parseFloat((montoPendiente / tasa.monto_equivalencia).toFixed(2)) 
      : montoPendiente;

    // El monto que se aplica a la deuda es el mínimo entre lo que se quiere pagar y lo que se debe
    const montoAplicadoEnMoneda = Math.min(montoPagarNum, montoPendienteEnMoneda);
    
    // El vuelto se calcula sobre el monto entregado menos lo que se APLICÓ a la deuda
    const vueltoEnMoneda = montoEntregadoNum - montoAplicadoEnMoneda;
    
    // Convertir el monto APLICADO a bolívares para el sistema
    const montoAplicadoEnBs = calcularEquivalenteBolivares(montoAplicadoEnMoneda, monedaEfectivo);

    aplicarPago('Efectivo', montoAplicadoEnBs, {
      monto_original: montoAplicadoEnMoneda,
      moneda: monedaEfectivo,
      tasa_cambio: tasa?.monto_equivalencia || 1,
      monto_entregado: montoEntregadoNum,
      vuelto: vueltoEnMoneda,
    });
  };

  /** Aplicar pago con puntos */
  const handlePagoPuntos = () => {
    if (!puntosCliente || !tasaPuntos) return;
    
    const montoDeseado = parseFloat(montoPuntos) || 0;
    if (montoDeseado <= 0) return;
    
    const tasaActual = parseFloat(String(tasaPuntos.monto_equivalencia || 1));
    const puntosNecesarios = Math.ceil(montoDeseado / tasaActual);
    const montoMaximo = Math.min(puntosCliente.valor_en_bolivares, montoPendiente);
    const montoFinal = Math.min(montoDeseado, montoMaximo);
    const puntosFinales = Math.ceil(montoFinal / tasaActual);
    
    if (puntosFinales > puntosCliente.puntos_disponibles) {
      alert('No tienes suficientes puntos para este monto');
      return;
    }
    
    // Verificar que no exceda el monto pendiente con tolerancia decimal
    if (montoFinal > (montoPendiente + 0.001)) {
      alert(`El monto excede lo pendiente. Máximo: Bs. ${formatearPrecio(montoPendiente)}`);
      return;
    }
    
    aplicarPago('Puntos', montoFinal, { puntos_usados: puntosFinales });
    
    // Actualizar puntos disponibles
    setPuntosCliente(prev => prev ? {
      ...prev,
      puntos_disponibles: prev.puntos_disponibles - puntosFinales,
      valor_en_bolivares: parseFloat(((prev.puntos_disponibles - puntosFinales) * tasaActual).toFixed(2))
    } : null);
  };

  /** Aplicar pago con tarjeta */
  const handlePagoTarjeta = () => {
    console.log('💳 INICIANDO handlePagoTarjeta');
    console.log('📊 Estado actual:', {
      montoPendiente,
      montoTarjeta,
      datosTarjeta,
      subtipoTarjeta
    });

    if (!datosTarjeta.numero || !datosTarjeta.vencimiento || !datosTarjeta.banco) {
      console.error('❌ Datos de tarjeta incompletos');
      alert('Complete todos los datos de la tarjeta');
      return;
    }

    // Validar que el número de tarjeta tenga exactamente 16 dígitos
    const numeroLimpio = datosTarjeta.numero.replace(/\s/g, '');
    if (numeroLimpio.length !== 16 || !/^\d{16}$/.test(numeroLimpio)) {
      console.error('❌ Número de tarjeta inválido:', numeroLimpio);
      alert('El número de tarjeta debe tener exactamente 16 dígitos');
      return;
    }

    const monto = parseFloat(montoTarjeta) || 0;
    console.log('💰 Validando monto:', {
      montoIngresado: montoTarjeta,
      montoParsed: monto,
      montoPendiente,
      tolerancia: montoPendiente + 0.001,
      esValido: monto > 0 && monto <= (montoPendiente + 0.001)
    });

    // Usar tolerancia decimal para permitir montos exactos al pendiente
    if (monto <= 0 || monto > (montoPendiente + 0.001)) {
      console.error('❌ Monto inválido:', {
        monto,
        montoPendiente,
        maximo: montoPendiente + 0.001
      });
      alert(`Ingrese un monto válido. Máximo permitido: Bs. ${formatearPrecio(montoPendiente)}`);
      return;
    }

    const tipoFinal = subtipoTarjeta === 'credito' ? 'Tarjeta de credito' : 'Tarjeta de debito';
    console.log('✅ Aplicando pago con tarjeta:', {
      tipo: tipoFinal,
      monto,
      detalles: {
        numero_tarjeta: numeroLimpio,
        fecha_vencimiento: datosTarjeta.vencimiento,
        banco: datosTarjeta.banco,
        guardar_como_favorito: datosTarjeta.guardarComoFavorito
      }
    });

    aplicarPago(tipoFinal as PagoAplicado['tipo'], monto, {
      numero_tarjeta: numeroLimpio,
      fecha_vencimiento: datosTarjeta.vencimiento,
      banco: datosTarjeta.banco,
      guardar_como_favorito: datosTarjeta.guardarComoFavorito
    });

    console.log('✅ handlePagoTarjeta completado');
  };

  /** Aplicar pago con cheque */
  const handlePagoCheque = () => {
    if (!datosCheque.numero || !datosCheque.banco) {
      alert('Complete todos los datos del cheque');
      return;
    }

    // Validar que el número de cheque tenga exactamente 9 dígitos
    if (datosCheque.numero.length !== 9 || !/^\d{9}$/.test(datosCheque.numero)) {
      alert('El número de cheque debe tener exactamente 9 dígitos');
      return;
    }

    const monto = parseFloat(montoCheque) || 0;
    // Usar tolerancia decimal para permitir montos exactos al pendiente
    if (monto <= 0 || monto > (montoPendiente + 0.001)) {
      alert(`Ingrese un monto válido. Máximo permitido: Bs. ${formatearPrecio(montoPendiente)}`);
      return;
    }

    aplicarPago('Cheque', monto, {
      numero_cheque: datosCheque.numero,
      banco: datosCheque.banco
    });
  };

  /** Finalizar pago */
  const finalizarPago = async () => {
    if (montoPendiente > 0.01) {
      alert('Debe completar el pago total');
      return;
    }

    setProcesando(true);
    
    try {
      // Logs de debugging
      console.log('🔍 INICIANDO PROCESO DE PAGO');
      console.log('📋 Pagos aplicados:', pagosAplicados);
      console.log('🛒 Items del carrito:', carrito.items);
      console.log('💰 Total de la venta:', carrito.totalPrecio);
      
      // Preparar datos para la venta
      const ventaData = {
        cliente_id: cliente.clave!,
        tienda_id: 1, // ID de la tienda física
        items: carrito.items.map(item => ({
          producto_id: item.producto.clave,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        })),
        metodos_pago: pagosAplicados.map(pago => ({
          tipo: pago.tipo,
          monto: pago.monto,
          detalles: pago.detalles
        })),
        total_venta: carrito.totalPrecio
      };

      console.log('📤 Datos de venta a enviar:', JSON.stringify(ventaData, null, 2));

      // Crear la venta en el backend
      const resultado = await ventaService.crearVentaFisica(ventaData);
      
      console.log('✅ Respuesta del backend:', resultado);
      
      if (resultado.success) {
        console.log('✅ Venta creada exitosamente:', resultado);
        
        // Obtener puntos actualizados del cliente después de la venta
        try {
          console.log('🔄 Obteniendo puntos actualizados para cliente:', cliente.clave);
          const puntosActualizados = await clienteService.obtenerPuntosCliente(cliente.clave!);
          
          console.log('📊 Puntos actualizados obtenidos:', puntosActualizados);
          
          // Actualizar el objeto cliente con los nuevos puntos
          const clienteActualizado = {
            ...cliente,
            puntos_acumulados: puntosActualizados.puntos_disponibles
          };
          
          console.log('👤 Cliente actualizado:', {
            nombre: (clienteActualizado as any).tipo === 'natural' 
              ? `${(clienteActualizado as any).primer_nombre} ${(clienteActualizado as any).primer_apellido}`
              : (clienteActualizado as any).razon_social,
            puntos_anteriores: cliente.puntos_acumulados,
            puntos_nuevos: clienteActualizado.puntos_acumulados,
            diferencia: (cliente.puntos_acumulados || 0) - clienteActualizado.puntos_acumulados
          });
          
          // Éxito - proceder al estado exitoso con cliente actualizado
          onPagoExitoso(clienteActualizado);
        } catch (error) {
          console.error('❌ Error obteniendo puntos actualizados:', error);
          // Aún así proceder al estado exitoso
          onPagoExitoso();
        }
      } else {
        throw new Error(resultado.message || 'Error al procesar la venta');
      }
      
    } catch (error) {
      console.error('❌ Error procesando el pago:', error);
      setProcesando(false);
      
      // Mostrar mensaje de error al usuario
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al procesar el pago: ${errorMessage}\n\nPor favor, intente nuevamente.`);
    }
  };

  const nombreCliente = cliente.tipo === 'natural' 
    ? `${cliente.primer_nombre} ${cliente.primer_apellido}`
    : cliente.razon_social;

  if (procesando) {
    return (
      <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3D4A3A] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#2C2C2C] mb-2">Procesando Pago...</h2>
          <p className="text-gray-600">Por favor espere mientras procesamos su transacción</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onVolver}
                className="p-2 text-gray-600 hover:text-[#3D4A3A] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#2C2C2C]">Métodos de Pago</h1>
                <p className="text-sm text-gray-600">{nombreCliente}</p>
                {cliente.puntos_acumulados !== undefined && cliente.puntos_acumulados > 0 && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    🎯 {cliente.puntos_acumulados} puntos disponibles
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-[#2C2C2C]">
                Total: Bs. {formatearPrecio(carrito.totalPrecio)}
              </p>
              <p className="text-sm text-gray-600">
                {carrito.totalItems} artículo{carrito.totalItems !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de métodos de pago */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selector de método */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Seleccionar Método de Pago</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Efectivo', 'Cheque', 'Tarjeta', 'Puntos'].map((metodo) => (
                  <button
                    key={metodo}
                    onClick={() => setMetodoPago(metodo as any)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      metodoPago === metodo
                        ? 'border-[#3D4A3A] bg-[#3D4A3A] text-white'
                        : 'border-gray-200 hover:border-[#A1B5A0] hover:bg-green-50'
                    }`}
                  >
                    <div className="text-center">
                      {metodo === 'Efectivo' && (
                        <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                      {metodo === 'Cheque' && (
                        <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {metodo === 'Tarjeta' && (
                        <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )}
                      {metodo === 'Puntos' && (
                        <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      )}
                      <span className="text-xs font-medium">{metodo}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulario según método seleccionado */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              {metodoPago === 'Efectivo' && (() => {
                const montoEntregadoNum = parseFloat(montoEntregado) || 0;
                const tasa = monedaEfectivo !== 'VES' ? tasasCambio[monedaEfectivo] : null;
                const montoPendienteEnMoneda = tasa ? parseFloat((montoPendiente / tasa.monto_equivalencia).toFixed(2)) : montoPendiente;

                const montoAplicadoEnMoneda = Math.min(montoEntregadoNum, montoPendienteEnMoneda);
                const vueltoEnMoneda = montoEntregadoNum - montoAplicadoEnMoneda;

                return (
                  <div>
                    <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Pago en Efectivo</h3>
                    <div className="space-y-4">
                      {/* Selector de moneda */}
                      <div>
                        <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                          Tipo de Moneda
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'VES', label: 'Bolívares (VES)', flag: '🇻🇪' },
                            { value: 'USD', label: 'Dólares (USD)', flag: '🇺🇸' },
                            { value: 'EUR', label: 'Euros (EUR)', flag: '🇪🇺' }
                          ].map((moneda) => (
                            <button
                              key={moneda.value}
                              onClick={() => setMonedaEfectivo(moneda.value as any)}
                              className={`p-2 rounded-lg border-2 text-sm transition-all ${
                                monedaEfectivo === moneda.value
                                  ? 'border-[#3D4A3A] bg-[#3D4A3A] text-white'
                                  : 'border-gray-200 hover:border-[#A1B5A0]'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-lg mb-1">{moneda.flag}</div>
                                <div className="font-medium">{moneda.value}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        {tasa && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-xs text-blue-800">
                              💱 Tasa actual: 1 {monedaEfectivo} = Bs. {formatearPrecio(tasa.monto_equivalencia)}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                          Monto Entregado por Cliente ({monedaEfectivo})
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={montoEntregado}
                          onChange={(e) => setMontoEntregado(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                          placeholder="Ej: 20 (si paga con billete de $20)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Pendiente: {
                            monedaEfectivo === 'VES' 
                            ? `Bs. ${formatearPrecio(montoPendiente)}`
                            : `${monedaEfectivo} ${formatearPrecio(montoPendienteEnMoneda)} (Bs. ${formatearPrecio(montoPendiente)})`
                          }
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                          Monto a Pagar con este Método ({monedaEfectivo})
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          max={monedaEfectivo === 'VES' ? montoPendiente : montoPendienteEnMoneda}
                          step="0.01"
                          value={montoPagar}
                          onChange={(e) => setMontoPagar(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                          placeholder="Ej: 15 (del billete de $20)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Puede ser menor al monto entregado si quiere pagar parcialmente
                        </p>
                      </div>
                      
                      {montoEntregado && montoPagar && parseFloat(montoEntregado) > 0 && parseFloat(montoPagar) > 0 && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded space-y-1">
                          <p className="text-sm text-green-800 font-medium">
                            Monto a aplicar: {monedaEfectivo} {formatearPrecio(parseFloat(montoPagar))}
                          </p>
                          <p className="text-xs text-green-700">
                            (Equivale a Bs. {formatearPrecio(calcularEquivalenteBolivares(parseFloat(montoPagar), monedaEfectivo))})
                          </p>
                          
                          {parseFloat(montoEntregado) - parseFloat(montoPagar) > 0.001 && (
                            <div className="pt-2 mt-2 border-t border-green-200">
                              <p className="text-sm text-yellow-800 font-bold">
                                Vuelto a entregar: {monedaEfectivo} {formatearPrecio(parseFloat(montoEntregado) - parseFloat(montoPagar))}
                              </p>
                              <p className="text-xs text-yellow-700">
                                (Equivale a Bs. {formatearPrecio(calcularEquivalenteBolivares(parseFloat(montoEntregado) - parseFloat(montoPagar), monedaEfectivo))})
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Información de validaciones y límites */}
                      {monedaEfectivo !== 'VES' && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-xs text-blue-800 font-medium">
                            💱 Monto pendiente en {monedaEfectivo}: {formatearPrecio(parseFloat((montoPendiente / (tasasCambio[monedaEfectivo]?.monto_equivalencia || 1)).toFixed(2)))}
                          </p>
                          <p className="text-xs text-blue-700">
                            Puede pagar hasta este monto en {monedaEfectivo}
                          </p>
                        </div>
                      )}

                      {/* Validaciones visuales */}
                      {montoEntregado && montoPagar && (
                        <div className="mt-2">
                          {parseFloat(montoEntregado) <= 0 && (
                            <p className="text-xs text-red-600">⚠️ Debe ingresar un monto entregado válido</p>
                          )}
                          {parseFloat(montoPagar) <= 0 && (
                            <p className="text-xs text-red-600">⚠️ Debe ingresar un monto a pagar válido</p>
                          )}
                          {parseFloat(montoPagar) > parseFloat(montoEntregado) && (
                            <p className="text-xs text-red-600">⚠️ El monto a pagar no puede ser mayor al entregado</p>
                          )}
                        </div>
                      )}
                      
                      <button
                        onClick={handlePagoEfectivo}
                        disabled={(() => {
                          if (!montoEntregado || !montoPagar) return true;
                          
                          const montoEntregadoNum = parseFloat(montoEntregado);
                          const montoPagarNum = parseFloat(montoPagar);
                          
                          if (montoEntregadoNum <= 0 || montoPagarNum <= 0) return true;
                          
                          // La única validación estricta es que no se puede pagar más de lo que se entrega
                          if (montoPagarNum > montoEntregadoNum) return true;
                          
                          return false;
                        })()}
                        className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Aplicar Pago en Efectivo
                      </button>
                    </div>
                  </div>
                )
              })()}

              {metodoPago === 'Puntos' && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Pago con Puntos de Fidelidad</h3>
                  {puntosCliente && tasaPuntos ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <strong>Puntos disponibles:</strong> {puntosCliente.puntos_disponibles} puntos
                        </p>
                        <p className="text-sm text-green-600">
                          Equivale a: Bs. {formatearPrecio(puntosCliente.valor_en_bolivares)}
                        </p>
                        <p className="text-xs text-green-600">
                          1 punto = Bs. {(parseFloat(String(tasaPuntos.monto_equivalencia || 1))).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                          Monto en Bs. (usando puntos)
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          max={Math.min(puntosCliente.valor_en_bolivares, montoPendiente)}
                          step="0.01"
                          value={montoPuntos}
                          onChange={(e) => setMontoPuntos(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                          placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Máximo disponible: Bs. {formatearPrecio(Math.min(puntosCliente.valor_en_bolivares, montoPendiente))}
                        </p>
                        {montoPuntos && (
                          <p className="text-xs text-blue-600 mt-1">
                            Puntos necesarios: {Math.ceil(parseFloat(montoPuntos) / parseFloat(String(tasaPuntos.monto_equivalencia || 1)))}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handlePagoPuntos}
                        disabled={!montoPuntos || parseFloat(montoPuntos) <= 0 || parseFloat(montoPuntos) > (Math.min(puntosCliente.valor_en_bolivares, montoPendiente) + 0.001)}
                        className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Aplicar Pago con Puntos
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">Cargando información de puntos...</p>
                  )}
                </div>
              )}

              {metodoPago === 'Tarjeta' && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Pago con Tarjeta</h3>
                  
                  {/* Métodos favoritos */}
                  {metodosFavoritos.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-medium text-[#2C2C2C]">Métodos Favoritos</h4>
                        <button
                          onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
                          className="text-sm text-[#3D4A3A] hover:text-[#2C3631] transition-colors"
                        >
                          {mostrarFavoritos ? 'Ocultar' : 'Ver'} ({metodosFavoritos.length})
                        </button>
                      </div>
                      
                      {mostrarFavoritos && (
                        <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                          {metodosFavoritos.map((metodo, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded border hover:border-[#A1B5A0] cursor-pointer transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">
                                  {metodo.banco?.substring(0, 3).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">**** **** **** {metodo.numero_tarjeta?.slice(-4)}</p>
                                  <p className="text-xs text-gray-500">{metodo.banco} • Vence {metodo.fecha_vencimiento}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setDatosTarjeta({
                                    numero: metodo.numero_tarjeta || '',
                                    vencimiento: metodo.fecha_vencimiento || '',
                                    banco: metodo.banco || '',
                                    guardarComoFavorito: false
                                  });
                                  setMostrarFavoritos(false);
                                }}
                                className="px-3 py-1 text-xs bg-[#3D4A3A] text-white rounded hover:bg-[#2C3631] transition-colors"
                              >
                                Usar
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="tipoTarjeta"
                          value="credito"
                          checked={subtipoTarjeta === 'credito'}
                          onChange={(e) => setSubtipoTarjeta(e.target.value as 'credito')}
                          className="mr-2"
                        />
                        Crédito
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="tipoTarjeta"
                          value="debito"
                          checked={subtipoTarjeta === 'debito'}
                          onChange={(e) => setSubtipoTarjeta(e.target.value as 'debito')}
                          className="mr-2"
                        />
                        Débito
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={datosTarjeta.numero}
                        onChange={(e) => {
                          // Solo permitir números y espacios, máximo 16 dígitos
                          const valor = e.target.value.replace(/\D/g, '');
                          if (valor.length <= 16) {
                            // Formatear con espacios cada 4 dígitos para mejor UX
                            const formateado = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
                            setDatosTarjeta(prev => ({ ...prev, numero: formateado }));
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                        placeholder="1234 5678 9012 3456"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Debe tener exactamente 16 dígitos
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                          Vencimiento
                        </label>
                        <input
                          type="month"
                          value={datosTarjeta.vencimiento}
                          onChange={(e) => setDatosTarjeta(prev => ({ ...prev, vencimiento: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                          Banco
                        </label>
                        <input
                          type="text"
                          value={datosTarjeta.banco}
                          onChange={(e) => setDatosTarjeta(prev => ({ ...prev, banco: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                          placeholder="Nombre del banco"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                        Monto (Bs.)
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        max={montoPendiente}
                        step="0.01"
                        value={montoTarjeta}
                        onChange={(e) => setMontoTarjeta(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Pendiente: Bs. {formatearPrecio(montoPendiente)}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="guardarTarjeta"
                        checked={datosTarjeta.guardarComoFavorito}
                        onChange={(e) => setDatosTarjeta(prev => ({ ...prev, guardarComoFavorito: e.target.checked }))}
                        className="mr-2"
                      />
                      <label htmlFor="guardarTarjeta" className="text-sm text-gray-700">
                        Guardar como método favorito para futuros pagos
                      </label>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-700">
                        Será cobrado a su tarjeta de {subtipoTarjeta}
                      </p>
                    </div>

                    <button
                      onClick={handlePagoTarjeta}
                      disabled={!datosTarjeta.numero || !datosTarjeta.vencimiento || !datosTarjeta.banco || !montoTarjeta || parseFloat(montoTarjeta) <= 0}
                      className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Procesar Pago con Tarjeta
                    </button>
                  </div>
                </div>
              )}

              {metodoPago === 'Cheque' && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Pago con Cheque</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                        Número de Cheque
                      </label>
                      <input
                        type="text"
                        maxLength={9}
                        value={datosCheque.numero}
                        onChange={(e) => {
                          // Solo permitir números, máximo 9 dígitos
                          const valor = e.target.value.replace(/\D/g, '');
                          if (valor.length <= 9) {
                            setDatosCheque(prev => ({ ...prev, numero: valor }));
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                        placeholder="000001234"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Debe tener exactamente 9 dígitos
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                        Banco Emisor
                      </label>
                      <input
                        type="text"
                        value={datosCheque.banco}
                        onChange={(e) => setDatosCheque(prev => ({ ...prev, banco: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                        placeholder="Nombre del banco"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                        Monto del Cheque (Bs.)
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        max={montoPendiente}
                        step="0.01"
                        value={montoCheque}
                        onChange={(e) => setMontoCheque(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Pendiente: Bs. {formatearPrecio(montoPendiente)}
                      </p>
                    </div>

                    <button
                      onClick={handlePagoCheque}
                      disabled={!datosCheque.numero || !datosCheque.banco || !montoCheque || parseFloat(montoCheque) <= 0}
                      className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Procesar Pago con Cheque
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel de resumen */}
          <div className="space-y-6">
            {/* Resumen del pedido */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Resumen del Pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Bs. {formatearPrecio(carrito.totalPrecio)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>Bs. {formatearPrecio(carrito.totalPrecio)}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Ganará {carrito.puntosGanados} puntos con esta compra
                </div>
              </div>
            </div>

            {/* Estado del pago */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Estado del Pago</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total a pagar:</span>
                  <span className="font-semibold">Bs. {formatearPrecio(carrito.totalPrecio)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pagado:</span>
                  <span className="font-semibold text-green-600">
                    Bs. {formatearPrecio(carrito.totalPrecio - montoPendiente)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm text-gray-600">Pendiente:</span>
                  <span className={`font-semibold ${montoPendiente > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                    Bs. {formatearPrecio(montoPendiente)}
                  </span>
                </div>
              </div>

              {/* Pagos aplicados */}
              {pagosAplicados.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-[#2C2C2C] mb-2">Pagos Aplicados:</h4>
                  <div className="space-y-2">
                    {pagosAplicados.map((pago) => (
                      <div key={pago.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{pago.tipo}</span>
                          {pago.detalles?.puntos_usados && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({pago.detalles.puntos_usados} pts)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>Bs. {formatearPrecio(pago.monto)}</span>
                          <button
                            onClick={() => removerPago(pago.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vuelto Total */}
              {(() => {
                const { totalVuelto, detallesVuelto } = calcularVueltoTotal();
                return totalVuelto > 0.01 && (
                  <div className="mt-4 pt-4 border-t border-yellow-200 bg-yellow-50 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-yellow-800 mb-2">💰 Vuelto Total a Entregar:</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-yellow-700">Total en Bs.:</span>
                        <span className="font-bold text-yellow-800">Bs. {formatearPrecio(totalVuelto)}</span>
                      </div>
                      {detallesVuelto.length > 0 && (
                        <div className="text-xs text-yellow-600 mt-2">
                          <p className="font-medium mb-1">Desglose por moneda:</p>
                          {detallesVuelto.map((detalle, index) => (
                            <p key={index}>• {detalle.moneda} {formatearPrecio(detalle.vuelto)}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Botón finalizar */}
              <button
                onClick={finalizarPago}
                disabled={montoPendiente > 0.01}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  {montoPendiente > 0.01 ? `Faltan Bs. ${formatearPrecio(montoPendiente)}` : 'Finalizar Pago'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 