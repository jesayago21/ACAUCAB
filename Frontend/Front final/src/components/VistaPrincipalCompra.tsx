/** Vista principal de compra con productos y carrito */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { productoService, debounce } from '../services/api';
import { useCarrito } from '../hooks/useCarrito';
import ProductCard from './ProductCard';
import Carrito from './Carrito';
import type { Producto, ClienteNatural, ClienteJuridico } from '../types/api';

interface VistaPrincipalCompraProps {
  cliente: ClienteNatural | ClienteJuridico;
  carrito: ReturnType<typeof useCarrito>;
  onProcederPago: () => void;
  onVolver: () => void;
}

export default function VistaPrincipalCompra({ 
  cliente, 
  carrito,
  onProcederPago, 
  onVolver 
}: VistaPrincipalCompraProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [tiposDisponibles, setTiposDisponibles] = useState<string[]>([]);
  
  // Estados para detección de escáner
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const [lastKeystroke, setLastKeystroke] = useState(0);
  const [scannerDetected, setScannerDetected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Cargar productos al montar el componente */
  useEffect(() => {
    cargarProductos();
  }, []);

  /** Detectar escáner de código de barras */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      const timeDiff = now - lastKeystroke;
      
      // Si el tiempo entre teclas es muy corto (< 50ms), probablemente sea un escáner
      if (timeDiff < 50 && barcodeBuffer.length > 0) {
        setScannerDetected(true);
      }
      
      setLastKeystroke(now);
      
      // Si es Enter y tenemos datos en el buffer
      if (e.key === 'Enter' && barcodeBuffer.length > 0) {
        e.preventDefault();
        handleBarcodeScanned(barcodeBuffer);
        setBarcodeBuffer('');
        setScannerDetected(false);
        return;
      }
      
      // Si es un número, agregarlo al buffer
      if (/\d/.test(e.key)) {
        setBarcodeBuffer(prev => prev + e.key);
        
        // Limpiar buffer después de 1 segundo de inactividad
        setTimeout(() => {
          if (Date.now() - lastKeystroke > 1000) {
            setBarcodeBuffer('');
            setScannerDetected(false);
          }
        }, 1000);
      }
    };

    // Solo agregar el listener si estamos en la página de carrito
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [barcodeBuffer, lastKeystroke]);

  /** Manejar código escaneado */
  const handleBarcodeScanned = async (ean: string) => {
    console.log('🔍 Código escaneado:', ean);
    
    try {
      // Buscar producto específicamente por EAN usando el nuevo endpoint
      const producto = await productoService.buscarProductoPorEAN(ean);
      
      if (producto) {
        carrito.agregarItem(producto, 1);
        
        // Mostrar notificación visual de éxito
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
        notification.innerHTML = `
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>✅ ${producto.nombre_cerveza} agregado al carrito</span>
          </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 3000);
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error procesando código escaneado:', error);
      
      // Mostrar notificación de error
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <span>❌ Producto con código ${ean} no encontrado</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  /** Cargar productos con filtros */
  const cargarProductos = async (filtros?: { busqueda?: string; tipo?: string }) => {
    try {
      setCargando(true);
      setError(null);
      
      const productosData = await productoService.obtenerProductos({
        busqueda: filtros?.busqueda || busqueda,
        tipo: filtros?.tipo || filtroTipo,
        limite: 50
      });
      
      setProductos(productosData);
      
      // Extraer tipos únicos para filtros
      const tipos = [...new Set(productosData.map(p => p.tipo_cerveza))];
      setTiposDisponibles(tipos);
      
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar los productos. Intente nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  /** Función de búsqueda con debounce */
  const buscarProductosDebounced = debounce((termino: string) => {
    cargarProductos({ busqueda: termino, tipo: filtroTipo });
  }, 500);

  /** Manejar cambio de búsqueda */
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusqueda(valor);
    
    // Si la búsqueda está vacía, cargar inmediatamente todos los productos
    if (valor.trim() === '') {
      cargarProductos({ busqueda: '', tipo: filtroTipo });
    } else {
      buscarProductosDebounced(valor);
    }
  };

  /** Manejar cambio de filtro de tipo */
  const handleFiltroTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setFiltroTipo(valor);
    cargarProductos({ busqueda, tipo: valor });
  };

  /** Manejar click en "Limpiar Filtros" */
  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setFiltroTipo('');
    // Llamar a cargarProductos sin argumentos para traer todo
    cargarProductos({ busqueda: '', tipo: '' });
  };

  /** Obtener nombre del cliente para mostrar */
  const nombreCliente = cliente.tipo === 'natural' 
    ? `${cliente.primer_nombre} ${cliente.primer_apellido}`
    : cliente.razon_social;

  return (
    <div className="min-h-screen bg-[#F4EFE6]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Info del cliente */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onVolver}
                className="p-2 text-gray-600 hover:text-[#3D4A3A] transition-colors"
                title="Volver"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-[#2C2C2C]">¡Bienvenido, {nombreCliente}!</h1>
                <p className="text-sm text-gray-600">
                  Cliente {cliente.tipo === 'natural' ? 'Natural' : 'Jurídico'} • {cliente.rif}
                </p>
                {cliente.puntos_acumulados !== undefined && cliente.puntos_acumulados > 0 && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    🎯 {cliente.puntos_acumulados} puntos disponibles
                  </p>
                )}
              </div>
            </div>

            {/* Logo/Marca */}
            <div className="text-right">
              <h2 className="text-lg font-bold text-[#3D4A3A]">ACAUCAB</h2>
              <p className="text-xs text-gray-600">Sistema de Autopago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de escáner activo */}
      {scannerDetected && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 7v2h1v8H3v2h2V7H3zm16 0v12h2v-2h-1V9h1V7h-2zm-6-4H8v2h5V3zm5 0v2h3v2h2V3h-5zM6 3H3v2h2v2h2V3H6zm0 16v2h3v2h2v-2H6v-2z"/>
            </svg>
            <span className="font-medium">Escáner detectado: {barcodeBuffer}</span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Área de productos (75% en desktop) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Barra de búsqueda y filtros */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Búsqueda */}
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar cervezas por nombre o código EAN..."
                    value={busqueda}
                    onChange={handleBusquedaChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] focus:border-transparent transition-all ${
                      scannerDetected 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300'
                    }`}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  
                  {/* Indicador de escáner detectado */}
                  {scannerDetected && (
                    <div className="absolute right-2 top-2.5">
                      <div className="flex items-center space-x-1 text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 7v2h1v8H3v2h2V7H3zm16 0v12h2v-2h-1V9h1V7h-2zm-6-4H8v2h5V3zm5 0v2h3v2h2V3h-5zM6 3H3v2h2v2h2V3H6zm0 16v2h3v2h2v-2H6v-2z"/>
                        </svg>
                        <span className="text-xs font-medium">Escáner</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filtro por tipo */}
                <div className="md:w-48">
                  <select
                    value={filtroTipo}
                    onChange={handleFiltroTipoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0] focus:border-transparent"
                  >
                    <option value="">Todos los tipos</option>
                    {tiposDisponibles.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                {/* Botón limpiar filtros */}
                {(busqueda || filtroTipo) && (
                  <button
                    onClick={handleLimpiarFiltros}
                    className="px-4 py-2 text-gray-600 hover:text-[#3D4A3A] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Información de resultados */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                  {productos.length} producto{productos.length !== 1 ? 's' : ''} 
                  {busqueda && ` para "${busqueda}"`}
                  {filtroTipo && ` en ${filtroTipo}`}
                </span>
                
                {carrito.totalItems > 0 && (
                  <span className="text-[#3D4A3A] font-medium">
                    {carrito.totalItems} artículo{carrito.totalItems !== 1 ? 's' : ''} en el carrito
                  </span>
                )}
              </div>
            </div>

            {/* Grid de productos */}
            <div className="space-y-4">
              {cargando ? (
                /* Loading state */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                      <div className="h-48 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                /* Error state */
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar productos</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => cargarProductos()}
                    className="bg-[#3D4A3A] hover:bg-[#2C3631] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              ) : productos.length === 0 ? (
                /* Empty state */
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
                  <p className="text-gray-600 mb-4">
                    {busqueda || filtroTipo 
                      ? 'Intenta con otros términos de búsqueda o filtros.'
                      : 'No hay productos disponibles en este momento.'
                    }
                  </p>
                  {(busqueda || filtroTipo) && (
                    <button
                      onClick={handleLimpiarFiltros}
                      className="text-[#3D4A3A] hover:text-[#2C3631] font-medium"
                    >
                      Ver todos los productos
                    </button>
                  )}
                </div>
              ) : (
                /* Productos */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productos.map((producto) => {
                    const productoId = producto.clave || producto.id || 0;
                    const uniqueKey = producto.unique_key || `producto-${productoId}-${Date.now()}-${Math.random()}`;
                    
                    try {
                      return (
                        <ProductCard
                          key={uniqueKey}
                          producto={producto}
                          onAgregarCarrito={carrito.agregarItem}
                          cantidadEnCarrito={carrito.obtenerItem(productoId)?.cantidad || 0}
                        />
                      );
                    } catch (error) {
                      console.error('Error renderizando ProductCard:', error, producto);
                      return (
                        <div key={uniqueKey} className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-red-800">Error cargando producto</h3>
                          <p className="text-xs text-red-600 mt-1">
                            {producto.nombre_cerveza || 'Producto sin nombre'}
                          </p>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Carrito lateral (25% en desktop) */}
          <div className="lg:col-span-1">
            <Carrito
              carrito={carrito}
              onProcederPago={onProcederPago}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 