/** Componente para gestión de métodos de pago específicos del ecommerce */
import React, { useState, useEffect, useCallback } from 'react';
import { ecommerceService, tasaCambioService } from '../services/api';
import type { ClienteNatural, ClienteJuridico, TasaCambio } from '../types/api';
import type { UseCarritoReturn } from '../hooks/useCarrito';
import DireccionEnvio from './DireccionEnvio';

interface MetodosPagoEcommerceProps {
  cliente: ClienteNatural | ClienteJuridico;
  usuario_id: number;
  carrito: UseCarritoReturn;
  onPagoExitoso: () => void;
  onVolver: () => void;
}

interface PagoAplicado {
  id: string;
  tipo: 'Tarjeta de credito' | 'Puntos';
  monto: number;
  detalles?: any;
}

const formatearPrecio = (precio: number): string => {
  return precio.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export default function MetodosPagoEcommerce({ 
  cliente, 
  usuario_id,
  carrito, 
  onPagoExitoso, 
  onVolver 
}: MetodosPagoEcommerceProps) {
  const [montoPendiente, setMontoPendiente] = useState(carrito.totalPrecio);
  const [pagosAplicados, setPagosAplicados] = useState<PagoAplicado[]>([]);
  const [metodoPago, setMetodoPago] = useState<'Tarjeta' | 'Puntos' | ''>('');
  const [procesando, setProcesando] = useState(false);
  
  // Estados para dirección de envío
  const [direccionEnvio, setDireccionEnvio] = useState({
    direccion: '',
    lugarId: null as number | null
  });

  // Estados para puntos
  const [puntosDisponibles, setPuntosDisponibles] = useState(cliente.puntos_acumulados || 0);
  const [montoPuntos, setMontoPuntos] = useState('');
  const [tasaPuntos, setTasaPuntos] = useState<TasaCambio | null>(null);
  
  // Estados para tarjetas
  const [montoTarjeta, setMontoTarjeta] = useState('');
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    vencimiento: '',
    banco: '',
    guardarComoFavorito: false
  });
  
  // Estados para métodos favoritos
  const [metodosFavoritos, setMetodosFavoritos] = useState<any[]>([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(true);

  /** Cargar datos iniciales */
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      console.log('🔄 Cargando datos iniciales para ecommerce...');
      
      // Cargar tasa de puntos
      const todasLasTasas = await tasaCambioService.obtenerTodasLasTasas();
      if (todasLasTasas.PUNTOS) {
        setTasaPuntos(todasLasTasas.PUNTOS);
      }
      
      // Cargar métodos de pago favoritos (solo tarjetas de crédito y puntos)
      try {
        const favoritos = await ecommerceService.obtenerMetodosPago(cliente.clave!);
        setMetodosFavoritos(favoritos);
        console.log(`💳 ${favoritos.length} métodos favoritos cargados para ecommerce`);
      } catch (error) {
        console.error('Error cargando métodos favoritos:', error);
        setMetodosFavoritos([]);
      }
      
      console.log('✅ Datos iniciales cargados exitosamente');
    } catch (error) {
      console.error('❌ Error cargando datos iniciales:', error);
    }
  };

  const handleDireccionChange = useCallback((direccion: string, lugarId: number | null) => {
    setDireccionEnvio({ direccion, lugarId });
  }, []);

  /** Aplicar pago */
  const aplicarPago = (tipoPago: PagoAplicado['tipo'], monto: number, detalles?: any) => {
    if (monto <= 0) return;

    if (Math.abs(montoPendiente) <= 0.02) {
      alert('La compra ya está completamente pagada.');
      return;
    }

    let montoFinalAplicado = Math.min(monto, montoPendiente);

    const nuevoPago: PagoAplicado = {
      id: `${tipoPago}-${Date.now()}`,
      tipo: tipoPago,
      monto: montoFinalAplicado,
      detalles
    };

    setPagosAplicados(prev => [...prev, nuevoPago]);
    
    const nuevoMontoPendiente = parseFloat((montoPendiente - montoFinalAplicado).toFixed(2));
    
    if (Math.abs(nuevoMontoPendiente) <= 0.05) {
      setMontoPendiente(0);
    } else {
      setMontoPendiente(Math.max(0, nuevoMontoPendiente));
    }

    // Resetear formularios
    setMontoPuntos('');
    setMontoTarjeta('');
    setDatosTarjeta({ numero: '', vencimiento: '', banco: '', guardarComoFavorito: false });
  };

  /** Remover pago aplicado */
  const removerPago = (pagoId: string) => {
    const pago = pagosAplicados.find(p => p.id === pagoId);
    if (!pago) return;

    setPagosAplicados(prev => prev.filter(p => p.id !== pagoId));
    const nuevoMontoPendiente = montoPendiente + pago.monto;
    setMontoPendiente(nuevoMontoPendiente);
  };

  /** Aplicar pago con puntos */
  const handlePagoPuntos = () => {
    if (!tasaPuntos) return;
    
    if (Math.abs(montoPendiente) <= 0.02) {
      alert('La compra ya está completamente pagada.');
      return;
    }
    
    const montoDeseado = parseFloat(montoPuntos) || 0;
    if (montoDeseado <= 0) return;
    
    const tasaActual = parseFloat(String(tasaPuntos.monto_equivalencia || 1));
    const puntosNecesarios = Math.ceil(montoDeseado / tasaActual);
    const valorMaximoPuntos = puntosDisponibles * tasaActual;
    const montoMaximo = Math.min(valorMaximoPuntos, montoPendiente);
    const montoFinal = Math.min(montoDeseado, montoMaximo);
    const puntosFinales = Math.ceil(montoFinal / tasaActual);
    
    if (puntosFinales > puntosDisponibles) {
      alert('No tienes suficientes puntos para este monto');
      return;
    }
    
    aplicarPago('Puntos', montoFinal, { puntos_usados: puntosFinales });
    
    // Actualizar puntos disponibles
    setPuntosDisponibles(prev => prev - puntosFinales);
  };

  /** Aplicar pago con tarjeta */
  const handlePagoTarjeta = () => {
    if (Math.abs(montoPendiente) <= 0.02) {
      alert('La compra ya está completamente pagada.');
      return;
    }

    if (!datosTarjeta.numero || !datosTarjeta.vencimiento || !datosTarjeta.banco) {
      alert('Complete todos los datos de la tarjeta');
      return;
    }

    const numeroLimpio = datosTarjeta.numero.replace(/\s/g, '');
    if (numeroLimpio.length !== 16 || !/^\d{16}$/.test(numeroLimpio)) {
      alert('El número de tarjeta debe tener exactamente 16 dígitos');
      return;
    }

    const monto = parseFloat(montoTarjeta) || 0;
    if (monto <= 0 || monto > (montoPendiente + 0.001)) {
      alert(`Ingrese un monto válido. Máximo permitido: Bs. ${formatearPrecio(montoPendiente)}`);
      return;
    }

    aplicarPago('Tarjeta de credito', monto, {
      numero_tarjeta: numeroLimpio,
      fecha_vencimiento: datosTarjeta.vencimiento,
      banco: datosTarjeta.banco,
      guardar_como_favorito: datosTarjeta.guardarComoFavorito
    });
  };

  /** Usar tarjeta favorita */
  const usarTarjetaFavorita = (metodo: any) => {
    // Formatear la fecha de YYYY-MM-DD a YYYY-MM
    const fechaVencimientoFormateada = metodo.fecha_vencimiento 
      ? new Date(metodo.fecha_vencimiento).toISOString().slice(0, 7) 
      : '';
      
    setDatosTarjeta({
      numero: metodo.numero_tarjeta || '',
      vencimiento: fechaVencimientoFormateada,
      banco: metodo.banco || '',
      guardarComoFavorito: false
    });
    setMostrarFavoritos(false);
  };

  /** Finalizar pago */
  const finalizarPago = async () => {
    if (Math.abs(montoPendiente) > 0.02) {
      alert('Debe completar el pago total antes de procesar la compra.');
      return;
    }

    if (pagosAplicados.length === 0) {
      alert('Debe aplicar al menos un método de pago.');
      return;
    }

    setProcesando(true);
    
    try {
      console.log('🔍 INICIANDO PROCESO DE PAGO ECOMMERCE');
      console.log('📋 Pagos aplicados:', pagosAplicados);
      console.log('🛒 Items del carrito:', carrito.items);
      console.log('💰 Total de la venta:', carrito.totalPrecio);
      
      // Preparar datos para la venta online
      const ventaData = {
        usuario_id: usuario_id,
        items: carrito.items.map(item => ({
          presentacion_id: item.producto.clave,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        })),
        metodos_pago: pagosAplicados.map(pago => ({
          tipo: pago.tipo,
          monto: pago.monto,
          ...pago.detalles
        })),
        direccion_envio: direccionEnvio.direccion || 'Dirección no especificada',
        lugar_id: direccionEnvio.lugarId
      };

      console.log('📤 Datos de venta online a enviar:', JSON.stringify(ventaData, null, 2));

      // Crear la venta en el backend
      const resultado = await ecommerceService.crearVentaOnline(ventaData);
      
      console.log('✅ Respuesta del backend:', resultado);
      
      if (resultado.success) {
        console.log('✅ Venta online creada exitosamente:', resultado);
        onPagoExitoso();
      } else {
        throw new Error(resultado.message || 'Error al procesar la venta online');
      }
      
    } catch (error: any) {
      console.error('❌ Error procesando pago online:', error);
      alert(`Error procesando el pago: ${error.message}`);
    } finally {
      setProcesando(false);
    }
  };

  if (procesando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3D4A3A] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-[#2C2C2C] mb-2">Procesando Pago Online</h2>
            <p className="text-gray-600">Por favor espere mientras procesamos su compra...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#2C2C2C]">Métodos de Pago - Ecommerce</h1>
            <button
              onClick={onVolver}
              className="px-4 py-2 text-[#3D4A3A] border border-[#3D4A3A] rounded-lg hover:bg-[#3D4A3A] hover:text-white transition-colors"
            >
              Volver al Carrito
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Para compras online solo se permiten tarjetas de crédito y puntos de fidelidad
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de métodos de pago */}
          <div className="lg:col-span-2 space-y-6">
            
            <DireccionEnvio onDireccionChange={handleDireccionChange} cliente={cliente} />

            {/* Selector de método */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Seleccionar Método de Pago</h2>
              <div className="grid grid-cols-2 gap-3">
                {['Tarjeta', 'Puntos'].map((metodo) => (
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

            {/* Formularios de pago */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {metodoPago === 'Puntos' && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Pago con Puntos de Fidelidad</h3>
                  {tasaPuntos ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <strong>Puntos disponibles:</strong> {puntosDisponibles} puntos
                        </p>
                        <p className="text-sm text-green-600">
                          Equivale a: Bs. {formatearPrecio(puntosDisponibles * parseFloat(String(tasaPuntos.monto_equivalencia || 1)))}
                        </p>
                        <p className="text-xs text-green-600">
                          1 punto = Bs. {(parseFloat(String(tasaPuntos.monto_equivalencia || 1))).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                          Monto a pagar con puntos (Bs.)
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          max={Math.min(puntosDisponibles * parseFloat(String(tasaPuntos.monto_equivalencia || 1)), montoPendiente)}
                          step="0.01"
                          value={montoPuntos}
                          onChange={(e) => setMontoPuntos(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                          placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Pendiente: Bs. {formatearPrecio(montoPendiente)} | 
                          Máximo con puntos: Bs. {formatearPrecio(Math.min(puntosDisponibles * parseFloat(String(tasaPuntos.monto_equivalencia || 1)), montoPendiente))}
                        </p>
                      </div>

                      <button
                        onClick={handlePagoPuntos}
                        disabled={!montoPuntos || parseFloat(montoPuntos) <= 0}
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
                  <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Pago con Tarjeta de Crédito</h3>
                  
                  {/* Métodos favoritos */}
                  {metodosFavoritos.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-medium text-[#2C2C2C]">Tarjetas Guardadas</h4>
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
                                  <p className="text-sm font-medium">**** **** **** {metodo.numero_tarjeta?.toString().slice(-4)}</p>
                                  <p className="text-xs text-gray-500">{metodo.banco} • Vence {metodo.fecha_vencimiento}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => usarTarjetaFavorita(metodo)}
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
                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={datosTarjeta.numero}
                        onChange={(e) => {
                          const valor = e.target.value.replace(/\D/g, '');
                          if (valor.length <= 16) {
                            const formateado = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
                            setDatosTarjeta(prev => ({ ...prev, numero: formateado }));
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                          Fecha de Vencimiento
                        </label>
                        <input
                          type="date"
                          value={datosTarjeta.vencimiento}
                          onChange={(e) => setDatosTarjeta(prev => ({ ...prev, vencimiento: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                          min={new Date().toISOString().split('T')[0]}
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
                        Guardar para futuros pagos
                      </label>
                    </div>

                    <button
                      onClick={handlePagoTarjeta}
                      disabled={!datosTarjeta.numero || !datosTarjeta.vencimiento || !datosTarjeta.banco || !montoTarjeta || parseFloat(montoTarjeta) <= 0}
                      className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Aplicar Pago con Tarjeta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel de resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Resumen de Pago</h3>
              
              {/* Total */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Total de la compra:</span>
                  <span className="font-semibold">Bs. {formatearPrecio(carrito.totalPrecio)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Pendiente por pagar:</span>
                  <span className="font-semibold">Bs. {formatearPrecio(montoPendiente)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Pagado:</span>
                  <span className="font-semibold">Bs. {formatearPrecio(carrito.totalPrecio - montoPendiente)}</span>
                </div>
              </div>

              {/* Pagos aplicados */}
              {pagosAplicados.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-[#2C2C2C] mb-2">Pagos Aplicados:</h4>
                  <div className="space-y-2">
                    {pagosAplicados.map((pago) => (
                      <div key={pago.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{pago.tipo}</p>
                          <p className="text-xs text-gray-500">
                            Bs. {formatearPrecio(pago.monto)}
                          </p>
                        </div>
                        <button
                          onClick={() => removerPago(pago.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón finalizar */}
              <button
                onClick={finalizarPago}
                disabled={Math.abs(montoPendiente) > 0.02 || pagosAplicados.length === 0}
                className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {Math.abs(montoPendiente) > 0.02 
                  ? `Faltan Bs. ${formatearPrecio(montoPendiente)}`
                  : 'Finalizar Compra Online'
                }
              </button>

              {Math.abs(montoPendiente) <= 0.02 && (
                <p className="text-xs text-green-600 text-center mt-2">
                  ✅ Pago completo. Listo para procesar.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 