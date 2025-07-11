import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';

/** Interfaces para inventario de eventos */
interface InventarioEvento {
  inventario_id: number;
  presentacion_id: number;
  presentacion_nombre: string;
  cerveza_nombre: string;
  tipo_cerveza: string;
  cantidad_unidades: number;
  precio: number;
  ean_13: string;
  miembro_nombre: string;
}

interface ProductoAlmacen {
  almacen_id: number;
  presentacion_id: number;
  presentacion_nombre: string;
  cerveza_nombre: string;
  tipo_cerveza: string;
  cantidad_disponible: number;
  precio: number;
  miembro_nombre: string;
}

interface InventarioEventosManagementProps {
  eventoId: number;
  eventoNombre: string;
  onClose: () => void;
}

/** Componente para gestión de inventario específico de eventos */
export default function InventarioEventosManagement({ 
  eventoId, 
  eventoNombre, 
  onClose 
}: InventarioEventosManagementProps) {
  const [inventario, setInventario] = useState<InventarioEvento[]>([]);
  const [productosAlmacen, setProductosAlmacen] = useState<ProductoAlmacen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inventario' | 'transferir' | 'asignar'>('inventario');

  // Estados para transferencias
  const [transferenciaData, setTransferenciaData] = useState({
    almacen_id: '',
    cantidad: ''
  });

  // Estados para asignación directa
  const [asignacionData, setAsignacionData] = useState({
    presentacion_id: '',
    cantidad: ''
  });

  // Búsqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    loadData();
  }, [eventoId]);

  /** Cargar inventario del evento y productos del almacén */
  const loadData = async () => {
    try {
      setLoading(true);
      const [inventarioData] = await Promise.all([
        eventService.getInventarioEvento(eventoId)
      ]);
      
      setInventario(inventarioData);
      
      // TODO: Implementar obtener productos del almacén
      // Por ahora simulamos datos del almacén
      setProductosAlmacen([]);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  /** Transferir inventario del almacén al evento */
  const handleTransferirInventario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      await eventService.transferirInventarioEvento(
        eventoId,
        parseInt(transferenciaData.almacen_id),
        parseInt(transferenciaData.cantidad)
      );
      
      await loadData();
      setTransferenciaData({ almacen_id: '', cantidad: '' });
      setActiveTab('inventario');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al transferir inventario');
    } finally {
      setLoading(false);
    }
  };

  /** Actualizar cantidad en inventario del evento */
  const handleActualizarCantidad = async (presentacionId: number, nuevaCantidad: number) => {
    try {
      setLoading(true);
      
      await eventService.updateInventarioEvento(eventoId, presentacionId, nuevaCantidad);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar inventario');
    } finally {
      setLoading(false);
    }
  };

  /** Filtrar inventario por búsqueda */
  const inventarioFiltrado = inventario.filter(item => {
    const coincideBusqueda = !busqueda || 
      item.presentacion_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.cerveza_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.miembro_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.ean_13.includes(busqueda);

    const coincideTipo = !filtroTipo || item.tipo_cerveza === filtroTipo;

    return coincideBusqueda && coincideTipo;
  });

  /** Obtener configuración de nivel de stock */
  const getNivelStock = (cantidad: number) => {
    if (cantidad === 0) {
      return { 
        nivel: 'Agotado', 
        color: 'bg-red-100 text-red-800',
        icon: '🚫'
      };
    } else if (cantidad <= 10) {
      return { 
        nivel: 'Crítico', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: '⚠️'
      };
    } else if (cantidad <= 25) {
      return { 
        nivel: 'Bajo', 
        color: 'bg-orange-100 text-orange-800',
        icon: '📉'
      };
    } else {
      return { 
        nivel: 'Normal', 
        color: 'bg-green-100 text-green-800',
        icon: '✅'
      };
    }
  };

  /** Calcular estadísticas del inventario */
  const estadisticas = {
    total_productos: inventario.length,
    productos_agotados: inventario.filter(i => i.cantidad_unidades === 0).length,
    productos_criticos: inventario.filter(i => i.cantidad_unidades > 0 && i.cantidad_unidades <= 10).length,
    valor_total: inventario.reduce((sum, item) => sum + (item.cantidad_unidades * item.precio), 0),
    unidades_totales: inventario.reduce((sum, item) => sum + item.cantidad_unidades, 0)
  };

  /** Obtener tipos únicos de cerveza */
  const tiposCerveza = [...new Set(inventario.map(item => item.tipo_cerveza))];

  if (loading && inventario.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Gestión de Inventario
          </h3>
          <p className="text-gray-600">
            Evento: {eventoNombre}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Estadísticas del inventario */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📦</span>
            <div>
              <p className="text-sm text-gray-600">Total Productos</p>
              <p className="text-xl font-bold">{estadisticas.total_productos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🚫</span>
            <div>
              <p className="text-sm text-gray-600">Agotados</p>
              <p className="text-xl font-bold text-red-600">{estadisticas.productos_agotados}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <p className="text-sm text-gray-600">Stock Crítico</p>
              <p className="text-xl font-bold text-yellow-600">{estadisticas.productos_criticos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📊</span>
            <div>
              <p className="text-sm text-gray-600">Unidades Totales</p>
              <p className="text-xl font-bold text-blue-600">{estadisticas.unidades_totales.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">💰</span>
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-xl font-bold text-green-600">
                {new Intl.NumberFormat('es-VE', {
                  style: 'currency',
                  currency: 'VES'
                }).format(estadisticas.valor_total)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('inventario')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventario'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Inventario Actual ({inventario.length})
          </button>
          <button
            onClick={() => setActiveTab('transferir')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transferir'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transferir desde Almacén
          </button>
          <button
            onClick={() => setActiveTab('asignar')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'asignar'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Asignar Inventario
          </button>
        </nav>
      </div>

      {/* Contenido de tabs */}
      {activeTab === 'inventario' && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h4 className="text-lg font-semibold mb-4">Filtros</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar producto
                </label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre, cerveza, miembro o EAN..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cerveza
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todos los tipos</option>
                  {tiposCerveza.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lista de inventario */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cerveza
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventarioFiltrado.map((item) => {
                    const nivelStock = getNivelStock(item.cantidad_unidades);
                    return (
                      <tr key={item.inventario_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.presentacion_nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              EAN: {item.ean_13}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.miembro_nombre}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.cerveza_nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.tipo_cerveza}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${nivelStock.color}`}>
                              <span className="mr-1">{nivelStock.icon}</span>
                              {item.cantidad_unidades} unidades
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Intl.NumberFormat('es-VE', {
                            style: 'currency',
                            currency: 'VES'
                          }).format(item.precio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {new Intl.NumberFormat('es-VE', {
                            style: 'currency',
                            currency: 'VES'
                          }).format(item.cantidad_unidades * item.precio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              const nueva = prompt(`Nueva cantidad para ${item.presentacion_nombre}:`, item.cantidad_unidades.toString());
                              if (nueva !== null && !isNaN(parseInt(nueva))) {
                                handleActualizarCantidad(item.presentacion_id, parseInt(nueva));
                              }
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ajustar Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {inventarioFiltrado.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {inventario.length === 0 ? 
                  'No hay productos asignados a este evento.' :
                  'No se encontraron productos que coincidan con los filtros.'
                }
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab de Transferir desde Almacén */}
      {activeTab === 'transferir' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Transferir Inventario desde Almacén
          </h4>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-6">
            <span className="text-4xl mb-4 block">🏪➡️📦</span>
            <p className="text-blue-700 font-medium">Transferencia de almacén en desarrollo</p>
            <p className="text-sm text-blue-600 mt-1">
              Próximamente podrás transferir productos directamente desde el almacén central al evento.
            </p>
          </div>

          <form onSubmit={handleTransferirInventario} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto del Almacén *
                </label>
                <select
                  required
                  value={transferenciaData.almacen_id}
                  onChange={(e) => setTransferenciaData(prev => ({ ...prev, almacen_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled
                >
                  <option value="">Seleccionar producto</option>
                  {/* TODO: Cargar productos del almacén */}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad a Transferir *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={transferenciaData.cantidad}
                  onChange={(e) => setTransferenciaData(prev => ({ ...prev, cantidad: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Cantidad"
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('inventario')}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={true}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                Transferir Inventario
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab de Asignar Inventario */}
      {activeTab === 'asignar' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Asignar Inventario Directamente
          </h4>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <span className="text-4xl mb-4 block">➕📦</span>
            <p className="text-green-700 font-medium">Asignación directa en desarrollo</p>
            <p className="text-sm text-green-600 mt-1">
              Aquí podrás asignar inventario directamente al evento sin necesidad de transferencia desde almacén.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 