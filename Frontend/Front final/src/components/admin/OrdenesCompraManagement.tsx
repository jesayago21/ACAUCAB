import React, { useState, useEffect } from 'react';

/** Interfaces para órdenes de compra */
interface OrdenCompra {
  compra_clave: number;
  compra_fecha: string;
  compra_monto_total: number;
  miembro_rif: number;
  miembro_nombre: string;
  estado_actual: string;
  fecha_estado: string;
  productos_count: number;
}

interface DetalleOrdenCompra {
  clave: number;
  fecha: string;
  monto_total: number;
  miembro: {
    rif: number;
    nombre: string;
  };
  estado_actual: string;
  fecha_estado: string;
  detalles: DetalleProducto[];
}

interface DetalleProducto {
  clave: number;
  almacen_clave: number;
  presentacion_nombre: string;
  cerveza_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

interface ProductoParaCompra {
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

interface Miembro {
  rif: number;
  razon_social: string;
}

interface EstadisticasCompras {
  total_ordenes: number;
  ordenes_pendientes: number;
  monto_total_mes: number;
  proveedor_top: string;
}

interface OrdenesCompraManagementProps {
  onClose?: () => void;
}

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api';

/** Componente para gestión completa de órdenes de compra */
export default function OrdenesCompraManagement({ onClose }: OrdenesCompraManagementProps) {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [productosParaCompra, setProductosParaCompra] = useState<ProductoParaCompra[]>([]);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasCompras | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ordenes' | 'crear' | 'estadisticas'>('ordenes');
  const [selectedOrden, setSelectedOrden] = useState<DetalleOrdenCompra | null>(null);
  const [showDetalle, setShowDetalle] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState({
    estado_filtro: '',
    miembro_id: '',
    limite: '50',
    offset: '0'
  });

  // Form state para crear orden
  const [formData, setFormData] = useState({
    miembro_rif: '',
    almacen_id: '',
    cantidad: '',
    precio_unitario: ''
  });

  // Estados disponibles
  const estadosDisponibles = [
    'emitida',
    'procesando', 
    'listo para entrega',
    'entregado'
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  /** Cargar datos iniciales */
  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadOrdenes(),
        loadProductosParaCompra(),
        loadMiembros(),
        loadEstadisticas()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  /** Cargar órdenes de compra */
  const loadOrdenes = async () => {
    try {
      const params = new URLSearchParams();
      if (filtros.estado_filtro) params.append('estado_filtro', filtros.estado_filtro);
      if (filtros.miembro_id) params.append('miembro_id', filtros.miembro_id);
      params.append('limite', filtros.limite);
      params.append('offset', filtros.offset);

      const response = await fetch(`${API_BASE_URL}/compras/ordenes?${params.toString()}`);
      if (!response.ok) throw new Error('Error al cargar órdenes');
      
      const data = await response.json();
      setOrdenes(data.data || []);
    } catch (err) {
      console.error('Error loading ordenes:', err);
      throw err;
    }
  };

  /** Cargar productos disponibles para compra */
  const loadProductosParaCompra = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/compras/productos`);
      if (!response.ok) throw new Error('Error al cargar productos');
      
      const data = await response.json();
      setProductosParaCompra(data.data || []);
    } catch (err) {
      console.error('Error loading productos:', err);
      throw err;
    }
  };

  /** Cargar miembros proveedores */
  const loadMiembros = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/compras/miembros`);
      if (!response.ok) throw new Error('Error al cargar proveedores');
      
      const data = await response.json();
      setMiembros(data.data || []);
    } catch (err) {
      console.error('Error loading miembros:', err);
      // Para desarrollo, usar datos mock
      setMiembros([
        { rif: 123456789, razon_social: 'Cervecería Nacional' },
        { rif: 987654321, razon_social: 'Maltas del Sur' }
      ]);
    }
  };

  /** Cargar estadísticas */
  const loadEstadisticas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/compras/estadisticas`);
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      
      const data = await response.json();
      setEstadisticas(data.data || null);
    } catch (err) {
      console.error('Error loading estadisticas:', err);
      // Para desarrollo, usar datos mock
      setEstadisticas({
        total_ordenes: 0,
        ordenes_pendientes: 0,
        monto_total_mes: 0,
        proveedor_top: 'N/A'
      });
    }
  };

  /** Crear nueva orden de compra */
  const handleCrearOrden = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/compras/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          miembro_rif: parseInt(formData.miembro_rif),
          almacen_id: parseInt(formData.almacen_id),
          cantidad: parseInt(formData.cantidad),
          precio_unitario: parseFloat(formData.precio_unitario)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear orden');
      }

      await loadOrdenes();
      await loadEstadisticas();
      resetForm();
      setActiveTab('ordenes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear orden');
    } finally {
      setLoading(false);
    }
  };

  /** Ver detalle de orden */
  const verDetalleOrden = async (ordenId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/compras/ordenes/${ordenId}`);
      if (!response.ok) throw new Error('Error al cargar detalle');
      
      const data = await response.json();
      setSelectedOrden(data.data);
      setShowDetalle(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalle');
    } finally {
      setLoading(false);
    }
  };

  /** Cambiar estado de orden */
  const cambiarEstadoOrden = async (ordenId: number, nuevoEstado: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/compras/ordenes/${ordenId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevo_estado: nuevoEstado }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar estado');
      }

      await loadOrdenes();
      await loadEstadisticas();
      setShowDetalle(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado');
    } finally {
      setLoading(false);
    }
  };

  /** Resetear formulario */
  const resetForm = () => {
    setFormData({
      miembro_rif: '',
      almacen_id: '',
      cantidad: '',
      precio_unitario: ''
    });
  };

  /** Aplicar filtros */
  const aplicarFiltros = async () => {
    await loadOrdenes();
  };

  /** Obtener configuración de estado */
  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'emitida':
        return { color: 'bg-blue-100 text-blue-800', icon: '📋' };
      case 'procesando':
        return { color: 'bg-yellow-100 text-yellow-800', icon: '⚙️' };
      case 'listo para entrega':
        return { color: 'bg-green-100 text-green-800', icon: '📦' };
      case 'entregado':
        return { color: 'bg-gray-100 text-gray-800', icon: '✅' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: '❓' };
    }
  };

  /** Obtener configuración de nivel de stock */
  const getNivelStockConfig = (nivel: string) => {
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

  if (loading && ordenes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Órdenes de Compra</h2>
          <p className="text-gray-600">Administra órdenes de compra y proveedores</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('crear')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nueva Orden
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📋</span>
              <div>
                <p className="text-sm text-gray-600">Total Órdenes</p>
                <p className="text-xl font-bold">{estadisticas.total_ordenes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⏳</span>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-xl font-bold text-yellow-600">{estadisticas.ordenes_pendientes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <span className="text-2xl mr-3">💰</span>
              <div>
                <p className="text-sm text-gray-600">Monto del Mes</p>
                <p className="text-xl font-bold text-green-600">
                  {new Intl.NumberFormat('es-VE', {
                    style: 'currency',
                    currency: 'VES'
                  }).format(estadisticas.monto_total_mes)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🏆</span>
              <div>
                <p className="text-sm text-gray-600">Top Proveedor</p>
                <p className="text-lg font-bold text-blue-600">{estadisticas.proveedor_top}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('ordenes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ordenes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Órdenes ({ordenes.length})
          </button>
          <button
            onClick={() => setActiveTab('crear')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'crear'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Crear Orden
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
      {activeTab === 'ordenes' && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filtros.estado_filtro}
                  onChange={(e) => setFiltros(prev => ({ ...prev, estado_filtro: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todos los estados</option>
                  {estadosDisponibles.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor
                </label>
                <select
                  value={filtros.miembro_id}
                  onChange={(e) => setFiltros(prev => ({ ...prev, miembro_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todos los proveedores</option>
                  {miembros.map((miembro) => (
                    <option key={miembro.rif} value={miembro.rif}>
                      {miembro.razon_social}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={aplicarFiltros}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Lista de órdenes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orden
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ordenes.map((orden) => {
                    const estadoConfig = getEstadoConfig(orden.estado_actual);
                    return (
                      <tr key={orden.compra_clave} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{orden.compra_clave}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {orden.miembro_nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              RIF: {orden.miembro_rif}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(orden.compra_fecha).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {new Intl.NumberFormat('es-VE', {
                            style: 'currency',
                            currency: 'VES'
                          }).format(orden.compra_monto_total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoConfig.color}`}>
                            <span className="mr-1">{estadoConfig.icon}</span>
                            {orden.estado_actual}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {orden.productos_count || 1} productos
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => verDetalleOrden(orden.compra_clave)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ver Detalle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {ordenes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron órdenes que coincidan con los filtros.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab de Crear Orden */}
      {activeTab === 'crear' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Crear Nueva Orden de Compra
          </h3>
          
          <form onSubmit={handleCrearOrden} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor *
                </label>
                <select
                  required
                  value={formData.miembro_rif}
                  onChange={(e) => setFormData(prev => ({ ...prev, miembro_rif: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Seleccionar proveedor</option>
                  {miembros.map((miembro) => (
                    <option key={miembro.rif} value={miembro.rif}>
                      {miembro.razon_social}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto *
                </label>
                <select
                  required
                  value={formData.almacen_id}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, almacen_id: e.target.value }));
                    // Auto-llenar precio del producto seleccionado
                    const producto = productosParaCompra.find(p => p.almacen_id.toString() === e.target.value);
                    if (producto) {
                      setFormData(prev => ({ ...prev, precio_unitario: producto.precio.toString() }));
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Seleccionar producto</option>
                  {productosParaCompra.map((producto) => {
                    const nivelConfig = getNivelStockConfig(producto.nivel_stock);
                    return (
                      <option key={producto.almacen_id} value={producto.almacen_id}>
                        {producto.presentacion_nombre} - {producto.cerveza_nombre} (Stock: {producto.stock_actual})
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.cantidad}
                  onChange={(e) => setFormData(prev => ({ ...prev, cantidad: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Cantidad a solicitar"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Unitario *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.precio_unitario}
                  onChange={(e) => setFormData(prev => ({ ...prev, precio_unitario: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Resumen del pedido */}
            {formData.cantidad && formData.precio_unitario && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Resumen del Pedido</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Cantidad:</span>
                    <span>{formData.cantidad} unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio unitario:</span>
                    <span>{new Intl.NumberFormat('es-VE', {
                      style: 'currency',
                      currency: 'VES'
                    }).format(parseFloat(formData.precio_unitario))}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">
                      {new Intl.NumberFormat('es-VE', {
                        style: 'currency',
                        currency: 'VES'
                      }).format(parseInt(formData.cantidad) * parseFloat(formData.precio_unitario))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab('ordenes');
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Orden'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab de Estadísticas */}
      {activeTab === 'estadisticas' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Estadísticas Detalladas
          </h3>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <span className="text-4xl mb-4 block">📊</span>
            <p className="text-yellow-700 font-medium">Estadísticas detalladas en desarrollo</p>
            <p className="text-sm text-yellow-600 mt-1">
              Próximamente: gráficos de tendencias, análisis de proveedores, reportes de costos.
            </p>
          </div>
        </div>
      )}

      {/* Modal de Detalle de Orden */}
      {showDetalle && selectedOrden && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalle de Orden #{selectedOrden.clave}
                </h3>
                <button
                  onClick={() => setShowDetalle(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Información de la orden */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Información General</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Fecha:</strong> {new Date(selectedOrden.fecha).toLocaleDateString()}</div>
                    <div><strong>Proveedor:</strong> {selectedOrden.miembro.nombre}</div>
                    <div><strong>RIF:</strong> {selectedOrden.miembro.rif}</div>
                    <div><strong>Monto Total:</strong> {new Intl.NumberFormat('es-VE', {
                      style: 'currency',
                      currency: 'VES'
                    }).format(selectedOrden.monto_total)}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Estado Actual</h4>
                  <div className="space-y-3">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoConfig(selectedOrden.estado_actual).color}`}>
                        <span className="mr-1">{getEstadoConfig(selectedOrden.estado_actual).icon}</span>
                        {selectedOrden.estado_actual}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Actualizado: {new Date(selectedOrden.fecha_estado).toLocaleString()}
                    </div>
                    
                    {selectedOrden.estado_actual !== 'entregado' && (
                      <div className="space-x-2">
                        {estadosDisponibles.map((estado) => {
                          if (estado !== selectedOrden.estado_actual) {
                            return (
                              <button
                                key={estado}
                                onClick={() => cambiarEstadoOrden(selectedOrden.clave, estado)}
                                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                              >
                                Cambiar a {estado}
                              </button>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Productos de la orden */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Productos</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Producto
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Cerveza
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Cantidad
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Precio Unit.
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrden.detalles.map((detalle) => (
                        <tr key={detalle.clave}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {detalle.presentacion_nombre}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {detalle.cerveza_nombre}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {detalle.cantidad}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {new Intl.NumberFormat('es-VE', {
                              style: 'currency',
                              currency: 'VES'
                            }).format(detalle.precio_unitario)}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-green-600">
                            {new Intl.NumberFormat('es-VE', {
                              style: 'currency',
                              currency: 'VES'
                            }).format(detalle.cantidad * detalle.precio_unitario)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 