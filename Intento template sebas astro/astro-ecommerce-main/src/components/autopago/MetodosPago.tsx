import React, { useState, useEffect } from 'react';
import type { PagoProps, PagoParcial, MetodoPago, DatosPago, TipoTarjeta } from '../../types/autopago';
import type { Cliente } from '../../types/client';
import { calcularValorPuntos, type PuntosCliente } from '../../services/pointsService';

/** Props extendidas para incluir datos del cliente */
interface MetodosPagoProps extends PagoProps {
  cliente?: Cliente;
}

/** Componente para gestión de métodos de pago múltiples */
const MetodosPago: React.FC<MetodosPagoProps> = ({ total, cliente, onPagoCompletado, onVolver }) => {
  const [pagos, setPagos] = useState<PagoParcial[]>([]);
  const [metodoActual, setMetodoActual] = useState<MetodoPago>('efectivo');
  const [tipoTarjeta, setTipoTarjeta] = useState<TipoTarjeta>('debito');
  const [montoActual, setMontoActual] = useState<string>('');
  const [referencia, setReferencia] = useState<string>('');
  const [procesando, setProcesando] = useState(false);
  const [puntosInfo, setPuntosInfo] = useState<PuntosCliente | null>(null);
  const [cargandoPuntos, setCargandoPuntos] = useState(false);
  const [errorPuntos, setErrorPuntos] = useState<string>('');

  /** Cargar información de puntos del cliente */
  useEffect(() => {
    const cargarPuntosCliente = async () => {
      if (!cliente || typeof cliente.puntos_acumulados !== 'number' || cliente.puntos_acumulados <= 0) {
        return;
      }

      setCargandoPuntos(true);
      setErrorPuntos('');

      try {
        const infoPuntos = await calcularValorPuntos(cliente.puntos_acumulados);
        setPuntosInfo(infoPuntos);
      } catch (error) {
        console.error('Error al cargar puntos:', error);
        setErrorPuntos('No se pudo cargar la información de puntos');
      } finally {
        setCargandoPuntos(false);
      }
    };

    cargarPuntosCliente();
  }, [cliente]);

  /** Calcular totales */
  const totalPagado = pagos.reduce((sum, pago) => sum + pago.monto, 0);
  const restante = total - totalPagado;
  const cambio = restante < 0 ? Math.abs(restante) : 0;

  /** Datos de los métodos de pago */
  const metodosPago = {
    efectivo: {
      nombre: 'Efectivo',
      icono: 'fas fa-money-bill-wave',
      colorIcon: 'text-green-500',
      descripcion: 'Pago en efectivo',
      requiereReferencia: false
    },
    tarjeta: {
      nombre: 'Tarjeta',
      icono: 'fas fa-credit-card',
      colorIcon: 'text-blue-500',
      descripcion: 'Débito o crédito',
      requiereReferencia: true
    },
    cheque: {
      nombre: 'Cheque',
      icono: 'fas fa-money-check',
      colorIcon: 'text-purple-500',
      descripcion: 'Cheque bancario',
      requiereReferencia: true
    },
    puntos: {
      nombre: 'Puntos',
      icono: 'fas fa-star',
      colorIcon: 'text-yellow-500',
      descripcion: 'Puntos de fidelidad',
      requiereReferencia: false
    }
  };

  /** Validar si se pueden usar puntos */
  const puedeUsarPuntos = () => {
    return cliente && 
           typeof cliente.puntos_acumulados === 'number' &&
           cliente.puntos_acumulados > 0 && 
           puntosInfo && 
           puntosInfo.valor_en_bolivares > 0 &&
           !errorPuntos;
  };

  /** Obtener monto máximo disponible para puntos */
  const getMontoMaximoPuntos = () => {
    if (!puntosInfo) return 0;
    return Math.min(puntosInfo.valor_en_bolivares, restante);
  };

  /** Agregar método de pago */
  const agregarPago = () => {
    const monto = parseFloat(montoActual);
    
    if (!monto || monto <= 0) {
      alert('Ingrese un monto válido');
      return;
    }
    
    if (monto > restante + 0.01) { // Permitir pequeña diferencia por redondeo
      alert('El monto no puede ser mayor al restante');
      return;
    }

    if (metodosPago[metodoActual].requiereReferencia && !referencia.trim()) {
      alert('Ingrese la referencia para este método de pago');
      return;
    }

    const nuevoPago: PagoParcial = {
      metodo: metodoActual,
      monto,
      referencia: referencia.trim() || undefined,
      ...(metodoActual === 'tarjeta' && { tipoTarjeta })
    };

    setPagos([...pagos, nuevoPago]);
    setMontoActual('');
    setReferencia('');
  };

  /** Eliminar método de pago */
  const eliminarPago = (index: number) => {
    setPagos(pagos.filter((_, i) => i !== index));
  };

  /** Completar pago */
  const completarPago = async () => {
    if (restante > 0.01) {
      alert('Debe completar el pago total');
      return;
    }

    setProcesando(true);

    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const datosPago: DatosPago = {
        total,
        pagos,
        cambio: cambio > 0 ? cambio : undefined,
        puntosSumados: Math.floor(total * 0.1) // 10% del total en puntos
      };

      onPagoCompletado(datosPago);
    } catch (error) {
      alert('Error al procesar el pago');
    } finally {
      setProcesando(false);
    }
  };

  /** Auto-llenar monto restante */
  useEffect(() => {
    if (restante > 0 && !montoActual) {
      setMontoActual(restante.toFixed(2));
    }
  }, [restante, montoActual]);

  /** Helper para mostrar información del pago */
  const getInfoPago = (pago: PagoParcial) => {
    let info = metodosPago[pago.metodo].nombre;
    if (pago.tipoTarjeta) {
      info += ` (${pago.tipoTarjeta === 'debito' ? 'Débito' : 'Crédito'})`;
    }
    return info;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    <i className="fas fa-credit-card mr-3"></i>
                    Métodos de Pago
                  </h2>
                  <p className="text-green-100">
                    Seleccione uno o varios métodos para completar su compra
                  </p>
                </div>
                <button
                  onClick={onVolver}
                  className="text-white hover:text-green-200 transition-colors duration-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                  disabled={procesando}
                >
                  <i className="fas fa-arrow-left text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Panel izquierdo - Resumen */}
              <div className="space-y-6">
                {/* Resumen de totales */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    <i className="fas fa-calculator mr-2"></i>
                    Resumen de Pago
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total a pagar:</span>
                      <span className="font-semibold text-green-700">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total pagado:</span>
                      <span className="font-semibold text-blue-600">${totalPagado.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-green-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {restante > 0 ? 'Restante:' : 'Cambio:'}
                        </span>
                        <span className={`font-bold text-lg ${restante > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${Math.abs(restante).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pagos agregados */}
                {pagos.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      <i className="fas fa-list mr-2"></i>
                      Pagos Agregados
                    </h4>
                    <div className="space-y-3">
                      {pagos.map((pago, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <div className="flex items-center">
                            <i className={`${metodosPago[pago.metodo].icono} ${metodosPago[pago.metodo].colorIcon} mr-3 text-lg`}></i>
                            <div>
                              <div className="font-medium text-gray-800">{getInfoPago(pago)}</div>
                              {pago.referencia && (
                                <div className="text-sm text-gray-500">Ref: {pago.referencia}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold mr-3 text-gray-800">${pago.monto.toFixed(2)}</span>
                            <button
                              onClick={() => eliminarPago(index)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                              disabled={procesando}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Panel derecho - Agregar métodos */}
              <div className="space-y-6">
                {/* Selección de método */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">
                    <i className="fas fa-plus-circle mr-2 text-green-600"></i>
                    Agregar Método de Pago
                  </h4>
                  
                  {/* Información de puntos si están disponibles */}
                  {cliente && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <i className="fas fa-star text-yellow-500 mr-2"></i>
                        <span className="font-semibold text-yellow-800">
                          Tienes {cliente.puntos_acumulados || 0} puntos disponibles
                        </span>
                      </div>
                      
                      {cargandoPuntos && (
                        <div className="text-sm text-yellow-600">
                          <i className="fas fa-spinner animate-spin mr-2"></i>
                          Calculando valor en bolívares...
                        </div>
                      )}
                      
                      {errorPuntos && (
                        <div className="text-sm text-red-600">
                          <i className="fas fa-exclamation-triangle mr-2"></i>
                          {errorPuntos}
                        </div>
                      )}
                      
                      {puntosInfo && !cargandoPuntos && !errorPuntos && (
                        <div className="text-sm text-yellow-700">
                          <div className="flex items-center justify-between">
                            <span>Valor total:</span>
                            <span className="font-semibold">{puntosInfo.valor_en_bolivares.toFixed(2)} Bs</span>
                          </div>
                          <div className="text-xs text-yellow-600 mt-1">
                            <div>• 1 punto = {puntosInfo.tasa_utilizada.monto_equivalencia} Bs</div>
                            <div>• Tasa vigente desde: {new Date(puntosInfo.tasa_utilizada.fecha_inicio).toLocaleDateString()}</div>
                          </div>
                          {puntosInfo.valor_en_bolivares >= restante && (
                            <div className="mt-2 text-green-700 font-medium">
                              <i className="fas fa-check-circle mr-1"></i>
                              ¡Puedes pagar toda la compra con puntos!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(metodosPago).map(([key, metodo]) => {
                      // Deshabilitar puntos si no están disponibles
                      const isDisabled = key === 'puntos' && !puedeUsarPuntos();
                      
                      return (
                      <button
                        key={key}
                        onClick={() => setMetodoActual(key as MetodoPago)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md relative ${
                          metodoActual === key
                              ? 'border-green-500 bg-green-50 shadow-md transform scale-105'
                              : isDisabled
                              ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                          }`}
                          disabled={procesando || isDisabled}
                        >
                          <i className={`${metodo.icono} text-2xl ${metodo.colorIcon} mb-2 block`}></i>
                          <div className="font-medium text-sm text-gray-800">{metodo.nombre}</div>
                          <div className="text-xs text-gray-500 mt-1">{metodo.descripcion}</div>
                          
                          {key === 'puntos' && isDisabled && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                              <span className="text-xs text-red-600 font-medium">No disponible</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selección de tipo de tarjeta */}
                {metodoActual === 'tarjeta' && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h5 className="font-medium text-blue-800 mb-3">
                      <i className="fas fa-credit-card mr-2"></i>
                      Tipo de Tarjeta
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setTipoTarjeta('debito')}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          tipoTarjeta === 'debito'
                            ? 'border-blue-500 bg-blue-100 text-blue-800'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                        disabled={procesando}
                      >
                        <i className="fas fa-credit-card text-blue-500 mb-1 block"></i>
                        <div className="text-sm font-medium">Débito</div>
                      </button>
                      <button
                        onClick={() => setTipoTarjeta('credito')}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          tipoTarjeta === 'credito'
                            ? 'border-blue-500 bg-blue-100 text-blue-800'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                        disabled={procesando}
                      >
                        <i className="fas fa-credit-card text-orange-500 mb-1 block"></i>
                        <div className="text-sm font-medium">Crédito</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Formulario de monto */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="space-y-4">
                    {metodoActual === 'puntos' && puntosInfo ? (
                      // Formulario especial para puntos
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-800 mb-3 flex items-center">
                          <i className="fas fa-star mr-2 text-yellow-500"></i>
                          Pago con Puntos
                        </h5>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Puntos disponibles:</span>
                              <div className="font-semibold text-yellow-700">
                                {puntosInfo.puntos_disponibles} puntos
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Valor en Bs:</span>
                              <div className="font-semibold text-yellow-700">
                                {puntosInfo.valor_en_bolivares.toFixed(2)} Bs
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Monto a pagar con puntos (en Bs)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">Bs</span>
                              <input
                                type="number"
                                value={montoActual}
                                onChange={(e) => setMontoActual(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-lg font-semibold"
                                placeholder="0.00"
                                min="0"
                                max={getMontoMaximoPuntos()}
                                step="0.01"
                                disabled={procesando}
                              />
                            </div>
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                              <button
                                onClick={() => setMontoActual(getMontoMaximoPuntos().toFixed(2))}
                                className="text-sm text-yellow-600 hover:text-yellow-800 transition-colors duration-200 font-medium hover:underline px-2 py-1 bg-yellow-100 rounded"
                                disabled={procesando}
                              >
                                💰 Usar máximo disponible ({getMontoMaximoPuntos().toFixed(2)} Bs)
                              </button>
                              
                              {restante <= puntosInfo.valor_en_bolivares && (
                                <button
                                  onClick={() => setMontoActual(restante.toFixed(2))}
                                  className="text-sm text-green-600 hover:text-green-800 transition-colors duration-200 font-medium hover:underline px-2 py-1 bg-green-100 rounded"
                                  disabled={procesando}
                                >
                                  🎯 Pagar todo el restante ({restante.toFixed(2)} Bs)
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Formulario normal para otros métodos
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto a pagar con {metodosPago[metodoActual].nombre}
                          {metodoActual === 'tarjeta' && ` (${tipoTarjeta === 'debito' ? 'Débito' : 'Crédito'})`}
                      </label>
                      <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                        <input
                          type="number"
                          value={montoActual}
                          onChange={(e) => setMontoActual(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg font-semibold"
                          placeholder="0.00"
                          min="0"
                          max={restante}
                          step="0.01"
                          disabled={procesando}
                        />
                      </div>
                      <button
                        onClick={() => setMontoActual(restante.toFixed(2))}
                          className="mt-2 text-sm text-green-600 hover:text-green-800 transition-colors duration-200 font-medium hover:underline"
                        disabled={procesando}
                      >
                          💡 Usar monto restante (${restante.toFixed(2)})
                      </button>
                    </div>
                    )}

                    {metodosPago[metodoActual].requiereReferencia && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Referencia/Número
                        </label>
                        <input
                          type="text"
                          value={referencia}
                          onChange={(e) => setReferencia(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          placeholder={metodoActual === 'tarjeta' ? 'Últimos 4 dígitos' : 'Número de cheque'}
                          disabled={procesando}
                        />
                      </div>
                    )}

                    <button
                      onClick={agregarPago}
                      className="w-full px-6 py-3 bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-semibold shadow-md hover:shadow-lg"
                      disabled={!montoActual || procesando}
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Agregar {metodosPago[metodoActual].nombre}
                      {metodoActual === 'tarjeta' && ` (${tipoTarjeta === 'debito' ? 'Débito' : 'Crédito'})`}
                    </button>
                  </div>
                </div>

                {/* Botón de completar pago */}
                {Math.abs(restante) < 0.01 && (
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <button
                    onClick={completarPago}
                      className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-xl hover:shadow-2xl"
                    disabled={procesando}
                  >
                    {procesando ? (
                      <>
                          <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Procesando Pago...
                      </>
                    ) : (
                      <>
                          <i className="fas fa-check-circle mr-3"></i>
                          🎉 Completar Pago
                      </>
                    )}
                  </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetodosPago;
