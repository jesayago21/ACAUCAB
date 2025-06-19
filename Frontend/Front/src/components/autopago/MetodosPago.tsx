import React, { useState, useEffect } from 'react';
import type { PagoProps, PagoParcial, MetodoPago, DatosPago } from '../../types/autopago';

/** Componente para gestión de métodos de pago múltiples */
const MetodosPago: React.FC<PagoProps> = ({ total, onPagoCompletado, onVolver }) => {
  const [pagos, setPagos] = useState<PagoParcial[]>([]);
  const [metodoActual, setMetodoActual] = useState<MetodoPago>('efectivo');
  const [montoActual, setMontoActual] = useState<string>('');
  const [referencia, setReferencia] = useState<string>('');
  const [procesando, setProcesando] = useState(false);

  /** Calcular totales */
  const totalPagado = pagos.reduce((sum, pago) => sum + pago.monto, 0);
  const restante = total - totalPagado;
  const cambio = restante < 0 ? Math.abs(restante) : 0;

  /** Datos de los métodos de pago */
  const metodosPago = {
    efectivo: {
      nombre: 'Efectivo',
      icono: 'fas fa-money-bill-wave',
      color: 'green',
      descripcion: 'Pago en efectivo',
      requiereReferencia: false
    },
    tarjeta: {
      nombre: 'Tarjeta',
      icono: 'fas fa-credit-card',
      color: 'blue',
      descripcion: 'Débito o crédito',
      requiereReferencia: true
    },
    cheque: {
      nombre: 'Cheque',
      icono: 'fas fa-money-check',
      color: 'indigo',
      descripcion: 'Cheque bancario',
      requiereReferencia: true
    },
    puntos: {
      nombre: 'Puntos',
      icono: 'fas fa-star',
      color: 'yellow',
      descripcion: 'Puntos de fidelidad',
      requiereReferencia: false
    }
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
      referencia: referencia.trim() || undefined
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
                  className="text-white hover:text-green-200 transition-colors"
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
                <div className="bg-green-50 rounded-xl p-6">
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
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      <i className="fas fa-list mr-2"></i>
                      Pagos Agregados
                    </h4>
                    <div className="space-y-3">
                      {pagos.map((pago, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div className="flex items-center">
                            <i className={`${metodosPago[pago.metodo].icono} text-${metodosPago[pago.metodo].color}-500 mr-3`}></i>
                            <div>
                              <div className="font-medium">{metodosPago[pago.metodo].nombre}</div>
                              {pago.referencia && (
                                <div className="text-sm text-gray-500">Ref: {pago.referencia}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold mr-3">${pago.monto.toFixed(2)}</span>
                            <button
                              onClick={() => eliminarPago(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
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
                    <i className="fas fa-plus-circle mr-2"></i>
                    Agregar Método de Pago
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(metodosPago).map(([key, metodo]) => (
                      <button
                        key={key}
                        onClick={() => setMetodoActual(key as MetodoPago)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          metodoActual === key
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        disabled={procesando}
                      >
                        <i className={`${metodo.icono} text-2xl text-green-500 mb-2`}></i>
                        <div className="font-medium text-sm">{metodo.nombre}</div>
                        <div className="text-xs text-gray-500">{metodo.descripcion}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formulario de monto */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto a pagar con {metodosPago[metodoActual].nombre}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={montoActual}
                          onChange={(e) => setMontoActual(e.target.value)}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="0.00"
                          min="0"
                          max={restante}
                          step="0.01"
                          disabled={procesando}
                        />
                      </div>
                      <button
                        onClick={() => setMontoActual(restante.toFixed(2))}
                        className="mt-2 text-sm text-green-600 hover:text-green-800 transition-colors"
                        disabled={procesando}
                      >
                        Usar monto restante (${restante.toFixed(2)})
                      </button>
                    </div>

                    {metodosPago[metodoActual].requiereReferencia && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Referencia/Número
                        </label>
                        <input
                          type="text"
                          value={referencia}
                          onChange={(e) => setReferencia(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder={metodoActual === 'tarjeta' ? 'Últimos 4 dígitos' : 'Número de cheque'}
                          disabled={procesando}
                        />
                      </div>
                    )}

                    <button
                      onClick={agregarPago}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
                      disabled={!montoActual || procesando}
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Agregar {metodosPago[metodoActual].nombre}
                    </button>
                  </div>
                </div>

                {/* Botón de completar pago */}
                {Math.abs(restante) < 0.01 && (
                  <button
                    onClick={completarPago}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                    disabled={procesando}
                  >
                    {procesando ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle mr-2"></i>
                        Completar Pago
                      </>
                    )}
                  </button>
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
