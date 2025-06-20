/** Componente para mostrar confirmación de pago exitoso */
import React from 'react';
import type { ClienteNatural, ClienteJuridico } from '../types/api';
import type { UseCarritoReturn } from '../hooks/useCarrito';

interface PantallaExitoProps {
  cliente: ClienteNatural | ClienteJuridico;
  carrito: UseCarritoReturn;
  onNuevaCompra: () => void;
  onSalir: () => void;
}

export default function PantallaExito({ 
  cliente, 
  carrito, 
  onNuevaCompra, 
  onSalir 
}: PantallaExitoProps) {
  
  /** Formatear precio */
  const formatearPrecio = (precio: number): string => {
    return precio.toLocaleString('es-VE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  /** Obtener nombre del cliente */
  const nombreCliente = cliente.tipo === 'natural' 
    ? `${cliente.primer_nombre} ${cliente.primer_apellido}`
    : cliente.razon_social;

  /** Generar número de referencia simulado */
  const numeroReferencia = `ACB-${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header de éxito */}
        <div className="bg-green-600 text-white p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">¡Pago Exitoso!</h1>
          <p className="text-green-100">Su transacción se ha procesado correctamente</p>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información del cliente */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#2C2C2C] mb-1">
              Gracias, {nombreCliente}
            </h2>
            <p className="text-sm text-gray-600">
              Cliente {cliente.tipo === 'natural' ? 'Natural' : 'Jurídico'} • {cliente.rif}
            </p>
          </div>

          {/* Detalles de la transacción */}
          <div className="border-t border-b border-gray-200 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Número de referencia:</span>
              <span className="font-semibold text-[#2C2C2C]">{numeroReferencia}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fecha y hora:</span>
              <span className="font-semibold text-[#2C2C2C]">
                {new Date().toLocaleString('es-VE', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Artículos:</span>
              <span className="font-semibold text-[#2C2C2C]">
                {carrito.totalItems} producto{carrito.totalItems !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total pagado:</span>
              <span className="text-xl font-bold text-[#3D4A3A]">
                Bs. {formatearPrecio(carrito.totalPrecio)}
              </span>
            </div>
          </div>

          {/* Puntos ganados */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <div className="text-center">
                <p className="text-sm font-semibold text-green-800">
                  ¡Ha ganado {carrito.puntosGanados} puntos!
                </p>
                <p className="text-xs text-green-600">
                  Podrá usarlos en su próxima compra
                </p>
              </div>
            </div>
          </div>

          {/* Resumen de productos */}
          <div>
            <h3 className="text-sm font-semibold text-[#2C2C2C] mb-3">Productos adquiridos:</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {carrito.items.map((item) => (
                <div key={item.producto.id} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-[#2C2C2C] line-clamp-1">
                      {item.producto.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.cantidad} x Bs. {formatearPrecio(item.precio_unitario)}
                    </p>
                  </div>
                  <span className="font-semibold text-[#2C2C2C]">
                    Bs. {formatearPrecio(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800 font-medium mb-1">
              Información importante
            </p>
            <p className="text-xs text-blue-700">
              Conserve este comprobante para cualquier reclamo o devolución.
              Los productos serán preparados para retirar en mostrador.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={onNuevaCompra}
              className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H16" />
              </svg>
              <span>Realizar Nueva Compra</span>
            </button>

            <button
              onClick={onSalir}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Finalizar Sesión</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>ACAUCAB - Distribuidora de Cervezas Artesanales</p>
            <p>¡Gracias por su preferencia!</p>
          </div>
        </div>
      </div>
    </div>
  );
} 