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
  const metodosPago: { [key in MetodoPago]: { nombre: string; icono: string; color: string; descripcion: string; requiereReferencia: boolean } } = {
    efectivo: {
      nombre: 'Efectivo',
      icono: 'fas fa-money-bill-wave',
      color: 'text-green-500',
      descripcion: 'Pago en efectivo',
      requiereReferencia: false
    },
    tarjeta: {
      nombre: 'Tarjeta',
      icono: 'fas fa-credit-card',
      color: 'text-blue-500',
      descripcion: 'Débito o crédito',
      requiereReferencia: true
    },
    cheque: {
      nombre: 'Cheque',
      icono: 'fas fa-money-check',
      color: 'text-purple-500',
      descripcion: 'Cheque bancario',
      requiereReferencia: true
    },
    puntos: {
      nombre: 'Puntos',
      icono: 'fas fa-star',
      color: 'text-yellow-500',
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-down">
        {/* Header */}
        <div className="bg-primary px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                <i className="fas fa-credit-card mr-3"></i>
                Métodos de Pago
              </h2>
              <p className="text-gray-200">
                Seleccione uno o varios métodos para completar su compra
              </p>
            </div>
            <button
              onClick={onVolver}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors duration-200"
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
            <div className="bg-background rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-primary mb-4">
                <i className="fas fa-calculator mr-2"></i>
                Resumen de Pago
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total a pagar:</span>
                  <span className="font-semibold text-gray-800">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total pagado:</span>
                  <span className="font-semibold text-primary">${totalPagado.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {restante > 0 ? 'Restante:' : 'Cambio:'}
                    </span>
                    <span className={`font-bold text-lg ${restante > 0 ? 'text-red-600' : 'text-primary'}`}>
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
                    <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
                      <div className="flex items-center">
                        <i className={`${metodosPago[pago.metodo].icono} text-primary mr-3 text-lg`}></i>
                        <div>
                          <p className="font-semibold">{getInfoPago(pago)}</p>
                          {pago.referencia && <p className="text-xs text-gray-500">Ref: {pago.referencia}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-800">${pago.monto.toFixed(2)}</span>
                        <button onClick={() => eliminarPago(index)} className="text-red-500 hover:text-red-700">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel derecho - Controles de pago */}
          <div className="space-y-6">
            {/* Selector de método de pago */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Seleccione un método</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(metodosPago).map((key) => {
                  const metodo = metodosPago[key as MetodoPago];
                  return (
                    <button
                      key={key}
                      onClick={() => setMetodoActual(key as MetodoPago)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center text-center ${metodoActual === key ? 'border-primary bg-green-50' : 'border-gray-200 bg-white hover:border-primary'}`}
                      disabled={(key === 'puntos' && !puedeUsarPuntos()) || restante <= 0}
                    >
                      <i className={`${metodo.icono} text-2xl mb-2 ${metodoActual === key ? 'text-primary' : 'text-gray-500'}`}></i>
                      <span className={`font-semibold ${metodoActual === key ? 'text-primary' : 'text-gray-700'}`}>{metodo.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulario de monto y referencia */}
            <div className={`${restante <= 0 ? 'opacity-50' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">2. Ingrese los detalles</h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
                {/* Monto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto a Pagar</label>
                  <input
                    type="number"
                    value={montoActual}
                    onChange={(e) => setMontoActual(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                    placeholder="0.00"
                    disabled={restante <= 0}
                  />
                </div>
                
                {/* Referencia (si es necesaria) */}
                {metodosPago[metodoActual].requiereReferencia && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
                    <input
                      type="text"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Ej: 123456"
                      disabled={restante <= 0}
                    />
                  </div>
                )}

                <button
                  onClick={agregarPago}
                  className="w-full bg-accent hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all"
                  disabled={restante <= 0 || !montoActual}
                >
                  <i className="fas fa-plus-circle mr-2"></i>
                  Agregar Pago
                </button>
              </div>
            </div>
            
            {/* Botón de Completar Pago */}
            <div className="pt-6 border-t">
              <button
                onClick={completarPago}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg transition-all text-lg shadow-lg disabled:opacity-50"
                disabled={restante > 0.01 || procesando || pagos.length === 0}
              >
                {procesando ? 'Procesando...' : `Completar Pago ($${total.toFixed(2)})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetodosPago;
