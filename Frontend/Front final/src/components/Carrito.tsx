/** Componente para mostrar y gestionar el carrito de compras */
import React from 'react';
import type { UseCarritoReturn } from '../hooks/useCarrito';

interface CarritoProps {
  carrito: UseCarritoReturn;
  onProcederPago: () => void;
}

export default function Carrito({ carrito, onProcederPago }: CarritoProps) {
  const { items, totalItems, totalPrecio, puntosGanados, actualizarCantidad, removerItem } = carrito;

  /** Formatear número con separadores de miles */
  const formatearPrecio = (precio: number): string => {
    return precio.toLocaleString('es-VE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  /** Obtener ID único del producto */
  const obtenerIdProducto = (producto: any): number => {
    return producto.clave || producto.id || 0;
  };

  /** Manejar cambio de cantidad */
  const handleCantidadChange = (productoId: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      removerItem(productoId);
    } else {
      actualizarCantidad(productoId, nuevaCantidad);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-fit sticky top-4">
      {/* Header del carrito */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2C2C2C] flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H16" />
            </svg>
            Mi Carrito
          </h2>
          {totalItems > 0 && (
            <span className="bg-[#3D4A3A] text-white text-xs font-bold px-2 py-1 rounded-full">
              {totalItems}
            </span>
          )}
        </div>
      </div>

      {/* Contenido del carrito */}
      <div className="p-4">
        {items.length === 0 ? (
          /* Carrito vacío */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H16" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
            <p className="text-gray-400 text-xs mt-1">Agrega productos para comenzar</p>
          </div>
        ) : (
          /* Lista de items */
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {items.map((item) => {
              const productoId = obtenerIdProducto(item.producto);
              const stockDisponible = item.producto.stock_disponible || item.producto.cantidad_disponible || 0;
              const precioOriginal = item.producto.precio_original || item.producto.precio || 0;
              
              return (
                <div key={productoId} className="border border-gray-200 rounded-lg p-3">
                  {/* Información del producto */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#2C2C2C] line-clamp-2">
                        {item.producto.nombre_cerveza || item.producto.nombre}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.producto.tipo_cerveza} • {item.producto.grado_alcohol}% Alc.
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.producto.cantidad_unidades === 1 ? 'Unidad' : `Pack de ${item.producto.cantidad_unidades}`}
                      </p>
                    </div>
                    
                    {/* Botón eliminar */}
                    <button
                      onClick={() => removerItem(productoId)}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                      title="Eliminar del carrito"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Precio unitario */}
                  <div className="mb-3">
                    {item.producto.tiene_oferta && item.producto.porcentaje_descuento ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-[#D9534F]">
                          Bs. {formatearPrecio(item.precio_unitario)}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          Bs. {formatearPrecio(precioOriginal)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-[#3D4A3A]">
                        Bs. {formatearPrecio(item.precio_unitario)}
                      </span>
                    )}
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCantidadChange(productoId, item.cantidad - 1)}
                        className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <span className="text-sm font-medium min-w-[20px] text-center">
                        {item.cantidad}
                      </span>
                      
                      <button
                        onClick={() => handleCantidadChange(productoId, item.cantidad + 1)}
                        disabled={item.cantidad >= stockDisponible}
                        className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-sm font-semibold text-[#2C2C2C]">
                      Bs. {formatearPrecio(item.subtotal)}
                    </div>
                  </div>

                  {/* Advertencia de stock */}
                  {item.cantidad >= stockDisponible && stockDisponible > 0 && (
                    <p className="text-xs text-yellow-600 mt-2">
                      ⚠️ Stock máximo disponible
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resumen y botón de proceder al pago */}
      {items.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Puntos a ganar */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-sm font-medium text-green-800">Puntos a ganar:</span>
              </div>
              <span className="text-sm font-bold text-green-800">
                {puntosGanados} puntos
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              1 punto por cada producto
            </p>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Subtotal ({totalItems} items):</span>
              <span className="text-sm font-medium">Bs. {formatearPrecio(totalPrecio)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-[#2C2C2C]">Total a Pagar:</span>
              <span className="text-xl font-bold text-[#3D4A3A]">
                Bs. {formatearPrecio(totalPrecio)}
              </span>
            </div>
          </div>

          {/* Botón proceder al pago */}
          <button
            onClick={() => {
              console.log('🔥 BOTÓN CARRITO - PROCEDER AL PAGO CLICKEADO');
              console.log('📋 CARRITO.TSX - Estado del carrito:', {
                itemsLength: items.length,
                totalItems: totalItems,
                carritoItemsLength: carrito.items.length,
                carritoTotalItems: carrito.totalItems,
                items: items.map(item => ({
                  nombre: item.producto.nombre_cerveza,
                  clave: item.producto.clave,
                  cantidad: item.cantidad,
                  subtotal: item.subtotal
                })),
                carritoItems: carrito.items.map(item => ({
                  nombre: item.producto.nombre_cerveza,
                  clave: item.producto.clave,
                  cantidad: item.cantidad,
                  subtotal: item.subtotal
                }))
              });
              
              if (items.length === 0) {
                console.error('❌ CARRITO.TSX - CARRITO VACÍO - No se puede proceder');
                alert('El carrito está vacío. Agrega productos antes de proceder al pago.');
                return;
              }
              
              console.log('✅ CARRITO.TSX - Carrito válido, llamando onProcederPago...');
              onProcederPago();
            }}
            disabled={items.length === 0}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
              items.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#3D4A3A] hover:bg-[#2C3631] text-white transform hover:scale-105'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>{items.length === 0 ? 'Carrito Vacío' : 'Proceder al Pago'}</span>
          </button>
        </div>
      )}
    </div>
  );
} 