/** Componente para gestión de métodos de pago múltiples */
import React, { useState, useEffect } from 'react';
import { clienteService, tasaCambioService, ventaService } from '../services/api';
import type { ClienteNatural, ClienteJuridico, MetodoPago, PuntosCliente, TasaCambio } from '../types/api';
import type { UseCarritoReturn } from '../hooks/useCarrito';

interface MetodosPagoProps {
  cliente: ClienteNatural | ClienteJuridico;
  carrito: UseCarritoReturn;
  onPagoExitoso: () => void;
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
  const [metodoPago, setMetodoPago] = useState<'Efectivo' | 'Cheque' | 'Tarjeta' | 'Puntos'>('Efectivo');
  const [subtipoTarjeta, setSubtipoTarjeta] = useState<'credito' | 'debito'>('credito');
  const [procesando, setProcesando] = useState(false);
  
  // Estados para puntos
  const [puntosCliente, setPuntosCliente] = useState<PuntosCliente | null>(null);
  const [montoPuntos, setMontoPuntos] = useState('');
  const [tasaPuntos, setTasaPuntos] = useState<TasaCambio | null>(null);
  
  // Estados para formularios
  const [montoEfectivo, setMontoEfectivo] = useState('');
  const [montoTarjeta, setMontoTarjeta] = useState('');
  const [montoCheque, setMontoCheque] = useState('');
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    vencimiento: '',
    banco: ''
  });
  const [datosCheque, setDatosCheque] = useState({
    numero: '',
    banco: ''
  });

  /** Cargar datos iniciales */
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      // Cargar tasa de cambio de puntos
      const tasaData = await tasaCambioService.obtenerTasaCambioPuntos();
      setTasaPuntos(tasaData);
      
      // Usar los puntos reales del cliente
      const puntosDisponibles = cliente.puntos_acumulados || 0;
      const puntosData: PuntosCliente = {
        puntos_disponibles: puntosDisponibles,
        valor_en_bolivares: parseFloat((puntosDisponibles * tasaData.monto_equivalencia).toFixed(2)),
        tasa_cambio: tasaData.monto_equivalencia
      };
      setPuntosCliente(puntosData);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
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

  /** Aplicar pago */
  const aplicarPago = (tipoPago: PagoAplicado['tipo'], monto: number, detalles?: any) => {
    if (monto <= 0 || monto > montoPendiente) return;

    const nuevoPago: PagoAplicado = {
      id: `${tipoPago}-${Date.now()}`,
      tipo: tipoPago,
      monto,
      detalles
    };

    setPagosAplicados(prev => [...prev, nuevoPago]);
    setMontoPendiente(prev => prev - monto);

    // Resetear formularios
    setMontoEfectivo('');
    setMontoPuntos('');
    setMontoTarjeta('');
    setMontoCheque('');
    setDatosTarjeta({ numero: '', vencimiento: '', banco: '' });
    setDatosCheque({ numero: '', banco: '' });
  };

  /** Remover pago aplicado */
  const removerPago = (pagoId: string) => {
    const pago = pagosAplicados.find(p => p.id === pagoId);
    if (!pago) return;

    setPagosAplicados(prev => prev.filter(p => p.id !== pagoId));
    setMontoPendiente(prev => prev + pago.monto);
  };

  /** Aplicar pago con efectivo */
  const handlePagoEfectivo = () => {
    const monto = parseFloat(montoEfectivo) || 0;
    if (monto > 0 && monto <= montoPendiente) {
      aplicarPago('Efectivo', monto);
    }
  };

  /** Aplicar pago con puntos */
  const handlePagoPuntos = () => {
    if (!puntosCliente || !tasaPuntos) return;
    
    const montoDeseado = parseFloat(montoPuntos) || 0;
    if (montoDeseado <= 0) return;
    
    const tasaActual = parseFloat(String(tasaPuntos.monto_equivalencia || tasaPuntos.tasa || 1));
    const puntosNecesarios = Math.ceil(montoDeseado / tasaActual);
    const montoMaximo = Math.min(puntosCliente.valor_en_bolivares, montoPendiente);
    const montoFinal = Math.min(montoDeseado, montoMaximo);
    const puntosFinales = Math.ceil(montoFinal / tasaActual);
    
    if (puntosFinales > puntosCliente.puntos_disponibles) {
      alert('No tienes suficientes puntos para este monto');
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
    if (!datosTarjeta.numero || !datosTarjeta.vencimiento || !datosTarjeta.banco) {
      alert('Complete todos los datos de la tarjeta');
      return;
    }

    const monto = parseFloat(montoTarjeta) || 0;
    if (monto <= 0 || monto > montoPendiente) {
      alert('Ingrese un monto válido');
      return;
    }

    const tipoFinal = subtipoTarjeta === 'credito' ? 'Tarjeta de credito' : 'Tarjeta de debito';
    aplicarPago(tipoFinal as PagoAplicado['tipo'], monto, {
      numero_tarjeta: datosTarjeta.numero,
      fecha_vencimiento: datosTarjeta.vencimiento,
      banco: datosTarjeta.banco
    });
  };

  /** Aplicar pago con cheque */
  const handlePagoCheque = () => {
    if (!datosCheque.numero || !datosCheque.banco) {
      alert('Complete todos los datos del cheque');
      return;
    }

    const monto = parseFloat(montoCheque) || 0;
    if (monto <= 0 || monto > montoPendiente) {
      alert('Ingrese un monto válido');
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

      // Crear la venta en el backend
      const resultado = await ventaService.crearVentaFisica(ventaData);
      
      if (resultado.success) {
        // Éxito - proceder al estado exitoso
        onPagoExitoso();
      } else {
        throw new Error(resultado.message || 'Error al procesar la venta');
      }
      
    } catch (error) {
      console.error('Error procesando el pago:', error);
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
              {metodoPago === 'Efectivo' && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Pago en Efectivo</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                        Monto (Bs.)
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        max={montoPendiente}
                        step="0.01"
                        value={montoEfectivo}
                        onChange={(e) => setMontoEfectivo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Pendiente: Bs. {formatearPrecio(montoPendiente)}
                      </p>
                    </div>
                    <button
                      onClick={handlePagoEfectivo}
                      disabled={!montoEfectivo || parseFloat(montoEfectivo) <= 0 || parseFloat(montoEfectivo) > montoPendiente}
                      className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Aplicar Pago en Efectivo
                    </button>
                  </div>
                </div>
              )}

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
                          1 punto = Bs. {(parseFloat(String(tasaPuntos.monto_equivalencia || tasaPuntos.tasa || 1))).toFixed(2)}
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
                            Puntos necesarios: {Math.ceil(parseFloat(montoPuntos) / parseFloat(String(tasaPuntos.monto_equivalencia || tasaPuntos.tasa || 1)))}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handlePagoPuntos}
                        disabled={!montoPuntos || parseFloat(montoPuntos) <= 0 || parseFloat(montoPuntos) > Math.min(puntosCliente.valor_en_bolivares, montoPendiente)}
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
                        maxLength={16}
                        value={datosTarjeta.numero}
                        onChange={(e) => setDatosTarjeta(prev => ({ ...prev, numero: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                        placeholder="1234 5678 9012 3456"
                      />
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
                        value={datosCheque.numero}
                        onChange={(e) => setDatosCheque(prev => ({ ...prev, numero: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                        placeholder="000001234"
                      />
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