/** Componente de gestión de compras mayoristas y órdenes de compra */
import { useState, useEffect } from 'react';
import { comprasService } from '../../services/comprasService';
import type { OrdenCompra, DetalleOrdenCompra, EstadisticasCompras, MiembroProveedor, EstadoCompra, ProductoCompra } from '../../types/api';

interface ComprasManagementProps {
  onClose?: () => void;
}

export default function ComprasManagement({ onClose }: ComprasManagementProps) {
    const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
    const [estadisticas, setEstadisticas] = useState<EstadisticasCompras | null>(null);
  const [miembrosProveedores, setMiembrosProveedores] = useState<MiembroProveedor[]>([]);
  const [estadosCompra, setEstadosCompra] = useState<EstadoCompra[]>([]);
  const [productosCompra, setProductosCompra] = useState<ProductoCompra[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ordenes' | 'estadisticas' | 'nueva-orden'>('ordenes');
    const [selectedOrden, setSelectedOrden] = useState<DetalleOrdenCompra | null>(null);
    const [showDetalle, setShowDetalle] = useState(false);

    const [filtros, setFiltros] = useState({
        estado_filtro: '',
        miembro_id: ''
    });

  // Form state para nueva orden
    const [formData, setFormData] = useState({
        miembro_rif: '',
        almacen_id: '',
        cantidad: '',
        precio_unitario: ''
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
      const [ordenesData, estadisticasData, miembrosData, estadosData, productosData] = await Promise.all([
        comprasService.getOrdenesCompra(),
        comprasService.getEstadisticasCompras(),
        comprasService.getMiembrosProveedores(),
        comprasService.getEstadosCompra(),
        comprasService.getProductosParaCompra()
      ]);
      
      setOrdenes(ordenesData);
      setEstadisticas(estadisticasData);
      setMiembrosProveedores(miembrosData);
      setEstadosCompra(estadosData);
      setProductosCompra(productosData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = async () => {
        try {
            setLoading(true);
      const filtrosApi = {
        estado_filtro: filtros.estado_filtro || undefined,
        miembro_id: filtros.miembro_id ? parseInt(filtros.miembro_id) : undefined,
      };

      const filtrosLimpios = Object.fromEntries(
        Object.entries(filtrosApi).filter(([, value]) => value != null && value !== '')
      ) as { [key: string]: any };

      const ordenesData = await comprasService.getOrdenesCompra(filtrosLimpios);
      setOrdenes(ordenesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al aplicar filtros');
        } finally {
            setLoading(false);
        }
    };

  const handleFiltroChange = (key: string, value: string) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const verDetalle = async (ordenId: number) => {
        try {
            setLoading(true);
      const detalle = await comprasService.getDetalleOrdenCompra(ordenId);
      setSelectedOrden(detalle);
      setShowDetalle(true);
        } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalle');
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstado = async (ordenId: number, nuevoEstado: string) => {
        try {
            setLoading(true);
      await comprasService.cambiarEstadoOrdenCompra(ordenId, nuevoEstado);
            await loadInitialData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cambiar estado');
        } finally {
            setLoading(false);
        }
    };

  const handleSubmitNuevaOrden = async (e: React.FormEvent) => {
    e.preventDefault();
        try {
            setLoading(true);
      
      const ordenData = {
        miembro_rif: parseInt(formData.miembro_rif),
        almacen_id: parseInt(formData.almacen_id),
        cantidad: parseInt(formData.cantidad),
        precio_unitario: parseFloat(formData.precio_unitario)
      };

      await comprasService.createOrdenCompra(ordenData);
      await loadInitialData();
      resetForm();
      setActiveTab('ordenes');
        } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear orden de compra');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            miembro_rif: '',
            almacen_id: '',
            cantidad: '',
            precio_unitario: ''
        });
    };

    if (loading && ordenes.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Compras</h2>
          <p className="text-gray-600">Administra órdenes de compra y proveedores</p>
                    </div>
        <div className="flex space-x-2">
                    <button
            onClick={() => setActiveTab('nueva-orden')}
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
                        Órdenes de Compra ({ordenes.length})
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
          <button
            onClick={() => setActiveTab('nueva-orden')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'nueva-orden'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Nueva Orden
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
                  onChange={(e) => handleFiltroChange('estado_filtro', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value="">Todos los estados</option>
                  {estadosCompra.map((estado) => (
                    <option key={estado.clave} value={estado.estado}>
                      {estado.estado}
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
                  onChange={(e) => handleFiltroChange('miembro_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value="">Todos los proveedores</option>
                  {miembrosProveedores.map((miembro) => (
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

                    {/* Lista de Órdenes */}
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
                                            Monto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ordenes.map((orden) => (
                                        <tr key={orden.clave} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                                                #{orden.clave}
                        </div>
                        <div className="text-sm text-gray-500">
                          {orden.cantidad_detalles} productos
                        </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {orden.miembro_nombre}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                          RIF: {orden.miembro_rif}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(orden.fecha).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Intl.NumberFormat('es-VE', {
                          style: 'currency',
                          currency: 'VES'
                        }).format(orden.monto_total)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          orden.estado_actual === 'entregado' ? 'bg-green-100 text-green-800' :
                          orden.estado_actual === 'procesando' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                                                    {orden.estado_actual}
                                                </span>
                                            </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                                                <button
                                                    onClick={() => verDetalle(orden.clave)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Ver Detalle
                                                </button>
                                                {orden.estado_actual !== 'entregado' && (
                                                    <select
                                                        onChange={(e) => cambiarEstado(orden.clave, e.target.value)}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="">Cambiar estado</option>
                              {estadosCompra
                                .filter(estado => estado.estado !== orden.estado_actual)
                                .map((estado) => (
                                  <option key={estado.clave} value={estado.estado}>
                                    {estado.estado}
                                  </option>
                                ))}
                                                    </select>
                                                )}
                        </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
          </div>
                            </div>
                        )}

      {/* Tab de Estadísticas */}
      {activeTab === 'estadisticas' && estadisticas && (
        <div className="space-y-6">
          {/* Resumen general */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900">Total Órdenes</h3>
              <p className="text-3xl font-bold text-blue-600">{estadisticas.total_ordenes}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900">Monto Total</h3>
              <p className="text-3xl font-bold text-green-600">
                {new Intl.NumberFormat('es-VE', {
                  style: 'currency',
                  currency: 'VES'
                }).format(estadisticas.total_monto)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900">Promedio por Orden</h3>
              <p className="text-3xl font-bold text-purple-600">
                {new Intl.NumberFormat('es-VE', {
                  style: 'currency',
                  currency: 'VES'
                }).format(estadisticas.promedio_por_orden)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900">Pendientes</h3>
              <p className="text-3xl font-bold text-orange-600">{estadisticas.ordenes_pendientes}</p>
            </div>
          </div>

          {/* Top proveedores */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Top Proveedores</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Órdenes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {estadisticas.top_proveedores.map((proveedor) => (
                    <tr key={proveedor.miembro_rif}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {proveedor.miembro_nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          RIF: {proveedor.miembro_rif}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {proveedor.total_ordenes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Intl.NumberFormat('es-VE', {
                          style: 'currency',
                          currency: 'VES'
                        }).format(proveedor.total_monto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                    </div>
                </div>
            )}

      {/* Tab de Nueva Orden */}
      {activeTab === 'nueva-orden' && (
                <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Orden de Compra</h3>
                    
          <form onSubmit={handleSubmitNuevaOrden} className="space-y-4">
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
                  {miembrosProveedores.map((miembro) => (
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
                  onChange={(e) => setFormData(prev => ({ ...prev, almacen_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value="">Seleccionar producto</option>
                  {productosCompra.map((producto) => (
                                        <option key={producto.almacen_id} value={producto.almacen_id}>
                      {producto.presentacion_nombre} - {producto.cerveza_nombre}
                                        </option>
                                    ))}
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
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Precio Unitario *
                                </label>
                                <input
                                    type="number"
                                    required
                  min="0.01"
                                    step="0.01"
                                    value={formData.precio_unitario}
                                    onChange={(e) => setFormData(prev => ({ ...prev, precio_unitario: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                type="button"
                onClick={() => setActiveTab('ordenes')}
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

      {/* Modal de Detalle */}
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
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                    <p className="text-sm text-gray-900">{selectedOrden.miembro.nombre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                    <p className="text-sm text-gray-900">{new Date(selectedOrden.fecha).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <p className="text-sm text-gray-900">{selectedOrden.estado_actual}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Productos</label>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio Unitario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrden.detalles.map((detalle) => (
                          <tr key={detalle.clave}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                {detalle.presentacion_nombre}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                {detalle.cerveza_nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {detalle.cantidad}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Intl.NumberFormat('es-VE', {
                                style: 'currency',
                                currency: 'VES'
                              }).format(detalle.precio_unitario)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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

                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    Total: {new Intl.NumberFormat('es-VE', {
                      style: 'currency',
                      currency: 'VES'
                    }).format(selectedOrden.monto_total)}
                  </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 