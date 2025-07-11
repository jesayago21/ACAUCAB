import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/auth';

/** Interfaces para el almacén */
interface ProductoAlmacen {
  almacen_id: number;
  presentacion_id: number;
  presentacion_nombre: string;
  precio: number;
  cerveza_nombre: string;
  tipo_cerveza: string;
  stock_actual: number;
  miembro_rif: number;
  miembro_nombre: string;
  nivel_stock: 'Crítico' | 'Bajo' | 'Normal' | 'Alto';
}

interface EstadisticasAlmacen {
  total_productos: number;
  productos_criticos: number;
  productos_bajos: number;
  valor_total_inventario: number;
  productos_sin_stock: number;
}

interface AlmacenManagementProps {
  user: Usuario;
  onClose?: () => void;
}

const API_BASE_URL = `${import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api`;

/** Componente principal de gestión de almacén */
export default function AlmacenManagement({ user, onClose }: AlmacenManagementProps) {
  const [productos, setProductos] = useState<ProductoAlmacen[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAlmacen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'productos' | 'estadisticas'>('productos');
  
  // Filtros y búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroNivel, setFiltroNivel] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');

  /** Verificar permisos del usuario */
  const hasPermission = (permission: string): boolean => {
    return user.permisos.some(p => p.nombre.toLowerCase().includes(permission.toLowerCase()));
  };

  const canView = hasPermission('consultar') || hasPermission('inventario') || user.rol.nombre === 'Administrador';
  const canManage = hasPermission('modificar') || hasPermission('inventario') || user.rol.nombre === 'Administrador';

  useEffect(() => {
    if (canView) {
      loadData();
    }
  }, [canView]);

  /** Función utilitaria para realizar peticiones a la API */
  const fetchAPI = async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    return response.json();
  };

  /** Cargar datos del almacén */
  const loadData = async () => {
    try {
      setLoading(true);
      const [productosData, inventarioData] = await Promise.all([
        fetchAPI('/compras/productos'),
        fetchAPI('/dashboard/inventario/actual')
      ]);
      
      setProductos(productosData.data || []);
      
      // Calcular estadísticas basadas en los productos
      if (productosData.data) {
        const stats = calculateEstadisticas(productosData.data);
        setEstadisticas(stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos del almacén');
    } finally {
      setLoading(false);
    }
  };

  /** Calcular estadísticas del almacén */
  const calculateEstadisticas = (productos: ProductoAlmacen[]): EstadisticasAlmacen => {
    return {
      total_productos: productos.length,
      productos_criticos: productos.filter(p => p.nivel_stock === 'Crítico').length,
      productos_bajos: productos.filter(p => p.nivel_stock === 'Bajo').length,
      productos_sin_stock: productos.filter(p => p.stock_actual === 0).length,
      valor_total_inventario: productos.reduce((sum, p) => sum + (p.precio * p.stock_actual), 0)
    };
  };

  /** Filtrar productos según criterios */
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = !busqueda || 
      producto.presentacion_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.cerveza_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.miembro_nombre.toLowerCase().includes(busqueda.toLowerCase());

    const coincideNivel = !filtroNivel || producto.nivel_stock === filtroNivel;
    const coincideTipo = !filtroTipo || producto.tipo_cerveza.toLowerCase().includes(filtroTipo.toLowerCase());

    return coincideBusqueda && coincideNivel && coincideTipo;
  });

  /** Obtener configuración de color según nivel de stock */
  const getStockLevelConfig = (nivel: string) => {
    switch (nivel) {
      case 'Crítico':
        return { color: 'bg-red-100 text-red-800', icon: '🚨' };
      case 'Bajo':
        return { color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' };
      case 'Normal':
        return { color: 'bg-green-100 text-green-800', icon: '✅' };
      case 'Alto':
        return { color: 'bg-blue-100 text-blue-800', icon: '📈' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: '❓' };
    }
  };

  /** Formatear moneda */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES'
    }).format(amount);
  };

  if (!canView) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
        <p className="text-red-700">No tiene permisos para ver la gestión de almacén.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Almacén Central</h2>
          <p className="text-gray-600">Control de inventario y stock de productos</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cerrar
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('productos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'productos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Productos ({productos.length})
          </button>
          <button
            onClick={() => setActiveTab('estadisticas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'estadisticas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Estadísticas
          </button>
        </nav>
      </div>

      {/* Contenido de tabs */}
      {activeTab === 'productos' && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar producto
                </label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre del producto, cerveza o miembro..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Stock
                </label>
                <select
                  value={filtroNivel}
                  onChange={(e) => setFiltroNivel(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todos los niveles</option>
                  <option value="Crítico">Crítico</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Normal">Normal</option>
                  <option value="Alto">Alto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cerveza
                </label>
                <input
                  type="text"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  placeholder="Tipo de cerveza..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miembro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Actual
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nivel
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productosFiltrados.map((producto) => {
                    const stockConfig = getStockLevelConfig(producto.nivel_stock);
                    return (
                      <tr key={producto.almacen_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {producto.presentacion_nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {producto.cerveza_nombre}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {producto.tipo_cerveza}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {producto.miembro_nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {producto.stock_actual.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(producto.precio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockConfig.color}`}>
                            <span className="mr-1">{stockConfig.icon}</span>
                            {producto.nivel_stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(producto.precio * producto.stock_actual)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {productosFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron productos que coincidan con los filtros.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab de Estadísticas */}
      {activeTab === 'estadisticas' && estadisticas && (
        <div className="space-y-6">
          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Productos</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.total_productos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl">🚨</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Stock Crítico</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticas.productos_criticos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                  <p className="text-2xl font-bold text-yellow-600">{estadisticas.productos_bajos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(estadisticas.valor_total_inventario)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de niveles de stock */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Distribución por Nivel de Stock</h3>
            <div className="space-y-4">
              {['Crítico', 'Bajo', 'Normal', 'Alto'].map(nivel => {
                const count = productos.filter(p => p.nivel_stock === nivel).length;
                const percentage = productos.length > 0 ? (count / productos.length) * 100 : 0;
                const config = getStockLevelConfig(nivel);
                
                return (
                  <div key={nivel} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-2">{config.icon}</span>
                      <span className="font-medium">{nivel}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${config.color.replace('text-', 'bg-').replace('100', '500')}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{count} productos ({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 