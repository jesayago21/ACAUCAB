/** Vista principal de compra con productos y carrito */
import React, { useState, useEffect } from 'react';
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

  /** Cargar productos al montar el componente */
  useEffect(() => {
    cargarProductos();
  }, []);

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
    buscarProductosDebounced(valor);
  };

  /** Manejar cambio de filtro de tipo */
  const handleFiltroTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setFiltroTipo(valor);
    cargarProductos({ busqueda, tipo: valor });
  };

  /** Limpiar filtros */
  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroTipo('');
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
                    type="text"
                    placeholder="Buscar cervezas..."
                    value={busqueda}
                    onChange={handleBusquedaChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0] focus:border-transparent"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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
                    onClick={limpiarFiltros}
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
                      onClick={limpiarFiltros}
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