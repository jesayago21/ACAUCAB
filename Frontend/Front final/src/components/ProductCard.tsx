/** Componente para mostrar tarjetas de productos con lógica de ofertas */
import React, { useState } from 'react';
import type { Producto } from '../types/api';

interface ProductCardProps {
  producto: Producto;
  onAgregarCarrito: (producto: Producto, cantidad: number) => void;
  cantidadEnCarrito?: number;
}

export default function ProductCard({ 
  producto, 
  onAgregarCarrito, 
  cantidadEnCarrito = 0 
}: ProductCardProps) {
  const [cantidad, setCantidad] = useState(1);
  const [imagenError, setImagenError] = useState(false);
  const [expandido, setExpandido] = useState(false);

  // Precargar las imágenes por defecto para asegurar que estén disponibles
  React.useEffect(() => {
    const preloadImg1 = new Image();
    const preloadImg2 = new Image();
    
    preloadImg1.onload = () => console.log('✅ Imagen por defecto unit cargada');
    preloadImg1.onerror = () => console.error('❌ Error cargando imagen por defecto unit');
    preloadImg1.src = '/images/products/beer-unit-default.jpg';
    
    preloadImg2.onload = () => console.log('✅ Imagen por defecto sixpack cargada');
    preloadImg2.onerror = () => console.error('❌ Error cargando imagen por defecto sixpack');
    preloadImg2.src = '/images/products/beer-sixpack-default.jpeg';
  }, []);

  // Obtener stock disponible con fallback
  const stockDisponible = producto.stock_disponible || producto.cantidad_disponible || 0;

  /** Obtener la ruta de la imagen con lógica de fallback limpia */
  const obtenerRutaImagen = (): string => {
    try {
      if (imagenError) {
        // Fallback: usar imágenes por defecto sin comillas extra
        return producto.cantidad_unidades === 6 
          ? '/images/products/beer-sixpack-default.jpeg'
          : '/images/products/beer-unit-default.jpg';
      }
      
      // Verificar si tenemos un ID válido
      const productId = producto.clave || producto.id;
      if (!productId) {
        return '/images/products/beer-unit-default.jpg';
      }
      
      // Usar la clave/id de la presentación para el nombre de archivo
      return `/images/products/beer-${productId}.jpg`;
    } catch (error) {
      console.error('Error en obtenerRutaImagen:', error);
      return '/images/products/beer-unit-default.jpg';
    }
  };

  /** Calcular precio con descuento usando los datos del backend */
  const tieneOferta = producto.tiene_oferta && producto.porcentaje_descuento && producto.porcentaje_descuento > 0;
  
  // Conversión segura del precio a número (maneja tanto string como number de BD)
  const precioNumerico = (() => {
    if (typeof producto.precio === 'string') {
      return parseFloat(producto.precio) || 0;
    }
    if (typeof producto.precio === 'number') {
      return producto.precio;
    }
    return 0;
  })();
  
  const precioOriginal = precioNumerico;
  const precioOferta = tieneOferta 
    ? precioNumerico * (1 - producto.porcentaje_descuento! / 100)
    : precioNumerico;
  const porcentajeDescuento = producto.porcentaje_descuento || 0;

  /** Manejar cambio de cantidad */
  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaCantidad = parseInt(e.target.value) || 1;
    setCantidad(Math.max(1, Math.min(nuevaCantidad, stockDisponible)));
  };

  /** Manejar agregar al carrito */
  const handleAgregarCarrito = () => {
    console.log('🛒 Agregando al carrito:', {
      producto: producto.nombre_cerveza,
      clave: producto.clave,
      cantidad: cantidad,
      stockDisponible: stockDisponible
    });
    onAgregarCarrito(producto, cantidad);
    setCantidad(1); // Resetear cantidad después de agregar
  };

  /** Toggle información expandida */
  const toggleExpandido = () => {
    setExpandido(!expandido);
  };

  try {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Imagen del producto - Clickeable para expandir */}
        <div 
          className="relative w-full h-80 bg-white overflow-hidden rounded-t-lg cursor-pointer group"
          onClick={toggleExpandido}
          style={{ height: '12rem' }}
        >
          <img
            key={obtenerRutaImagen()}
            alt={`Cerveza ${producto.nombre_cerveza}`}
            src={obtenerRutaImagen()}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 p-2"
            style={{
              maxWidth: '90%', 
              maxHeight: '90%',
              margin: 'auto',
              position: 'absolute',
              top: '0',
              bottom: '0',
              left: '0',
              right: '0'
            }}
            onError={(e) => {
              if (!imagenError) {
                setImagenError(true);
                const target = e.target as HTMLImageElement;
                // Determinar la imagen fallback directamente
                const fallbackSrc = producto.cantidad_unidades === 6 
                  ? '/images/products/beer-sixpack-default.jpeg'
                  : '/images/products/beer-unit-default.jpg';
                // Forzar el cambio inmediato de src
                target.src = fallbackSrc;
              }
            }}
            loading="lazy"
          />
          
          {/* Badge de oferta */}
          {tieneOferta && (
            <div className="absolute top-2 right-2 bg-[#D9534F] text-white px-2 py-1 rounded-full text-sm font-bold">
              -{porcentajeDescuento}%
            </div>
          )}
          
          {/* Badge de stock bajo */}
          {stockDisponible <= 5 && stockDisponible > 0 && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
              ¡{stockDisponible}!
            </div>
          )}
          
          {/* Badge de agotado */}
          {stockDisponible === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <span className="text-white font-bold text-lg">AGOTADO</span>
            </div>
          )}

          {/* Indicador de click para expandir */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Nombre y presentación */}
          <div className="mb-3 flex-grow">
            <h3 className="text-lg font-semibold text-[#2C2C2C] mb-1 line-clamp-2" style={{ minHeight: '3.5rem' }}>
              {producto.nombre_cerveza}
            </h3>
            <p className="text-sm text-gray-600">
              {producto.nombre_presentacion}
            </p>
          </div>

          {/* Precios */}
          <div className="mb-3">
            {tieneOferta ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-[#D9534F]">
                    Bs. {precioOferta.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 line-through">
                    Bs. {precioOriginal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Ahorra Bs. {(precioOriginal - precioOferta).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-xl font-bold text-[#3D4A3A]">
                Bs. {precioOriginal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Cantidad en carrito (si aplica) */}
          {cantidadEnCarrito > 0 && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ {cantidadEnCarrito} en el carrito
              </p>
            </div>
          )}

          {/* Controles de cantidad y botón */}
          {stockDisponible > 0 ? (
            <div className="space-y-3">
              {/* Selector de cantidad */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-[#2C2C2C]">
                  Cantidad:
                </label>
                <input
                  type="number"
                  min="1"
                  max={stockDisponible}
                  value={cantidad}
                  onChange={handleCantidadChange}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-[#A1B5A0] focus:border-transparent"
                />
                <span className="text-xs text-gray-500">
                  (máx. {stockDisponible})
                </span>
              </div>

              {/* Botón agregar al carrito */}
              <button
                onClick={handleAgregarCarrito}
                className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H16" />
                </svg>
                <span>Agregar al Carrito</span>
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Sin Stock
            </button>
          )}
        </div>

        {/* Información expandida */}
        {expandido && (
          <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
            {/* Información detallada */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Tipo:</span>
                <p className="text-gray-600">{producto.tipo_cerveza}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Alcohol:</span>
                <p className="text-gray-600">{producto.grado_alcohol}%</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Cervecería:</span>
                <p className="text-gray-600">{producto.miembro}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Stock:</span>
                <p className="text-gray-600">{stockDisponible} disponibles</p>
              </div>
            </div>

            {/* Ubicación en tienda */}
            <div>
              <span className="font-medium text-gray-700">Ubicación:</span>
              <p className="text-gray-600">{producto.lugar_tienda}</p>
            </div>

            {/* EAN */}
            <div>
              <span className="font-medium text-gray-700">Código:</span>
              <p className="text-gray-600 font-mono text-xs">{producto.ean_13}</p>
            </div>

            {/* Información de oferta si aplica */}
            {tieneOferta && (
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">Oferta especial</span>
                  <span className="text-sm text-red-600">
                    Ahorra Bs. {(precioOriginal - precioOferta).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                {producto.fecha_fin_oferta && (
                  <p className="text-xs text-red-600 mt-1">
                    Válida hasta: {new Date(producto.fecha_fin_oferta).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {/* Botón para cerrar */}
            <button
              onClick={toggleExpandido}
              className="w-full text-center text-gray-500 hover:text-gray-700 text-sm py-1"
            >
              Cerrar información ↑
            </button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error renderizando ProductCard:', error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-800">Error cargando producto</h3>
        <p className="text-xs text-red-600 mt-1">
          {producto.nombre_cerveza || 'Producto sin nombre'}
        </p>
      </div>
    );
  }
} 