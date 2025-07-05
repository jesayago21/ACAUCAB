import { useState, useEffect } from 'react';
import { offerService, type OfertaActiva, type ProductoElegible, type EstadisticasOfertas } from '../../services/offerService';

interface OfertasManagementProps {
  onClose?: () => void;
}

export default function OfertasManagement({ onClose }: OfertasManagementProps) {
  const [ofertas, setOfertas] = useState<OfertaActiva[]>([]);
  const [productosElegibles, setProductosElegibles] = useState<ProductoElegible[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasOfertas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'ofertas' | 'crear' | 'estadisticas'>('ofertas');

  // Form state
  const [formData, setFormData] = useState({
    presentacion_id: '',
    porcentaje_descuento: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [ofertasData, productosData, estadisticasData] = await Promise.all([
        offerService.getOfertasActivas(),
        offerService.getProductosElegibles(),
        offerService.getEstadisticasOfertas()
      ]);
      
      setOfertas(ofertasData);
      setProductosElegibles(productosData);
      setEstadisticas(estadisticasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validar fechas
      const validacion = offerService.validarFechasOferta(formData.fecha_inicio, formData.fecha_fin);
      if (!validacion.valido) {
        setError(validacion.error || 'Error en las fechas');
        return;
      }

      // Validar porcentaje
      const porcentaje = parseInt(formData.porcentaje_descuento);
      if (!offerService.validarPorcentajeDescuento(porcentaje)) {
        setError('El porcentaje debe estar entre 1 y 99');
        return;
      }

      // Validar período de 30 días
      const validacionPeriodo = await offerService.validarPeriodoOferta(
        parseInt(formData.presentacion_id),
        formData.fecha_inicio
      );
      
      if (!validacionPeriodo.puede_crear_oferta) {
        setError(validacionPeriodo.mensaje);
        return;
      }

      await offerService.createOferta({
        presentacion_id: parseInt(formData.presentacion_id),
        porcentaje_descuento: porcentaje,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin
      });

      await loadInitialData();
      resetForm();
      setActiveTab('ofertas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear oferta');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ofertaId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta oferta?')) return;
    
    try {
      setLoading(true);
      await offerService.deleteOferta(ofertaId);
      await loadInitialData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar oferta');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      presentacion_id: '',
      porcentaje_descuento: '',
      fecha_inicio: '',
      fecha_fin: ''
    });
    setShowForm(false);
  };

  const calcularPrecioOferta = (precioOriginal: number, porcentaje: number) => {
    return offerService.calcularPrecioOferta(precioOriginal, porcentaje);
  };

  if (loading && ofertas.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Ofertas</h2>
          <p className="text-gray-600">Administra ofertas y promociones de productos</p>
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
          <button
            onClick={() => setError(null)}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('ofertas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ofertas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ofertas Activas ({ofertas.length})
          </button>
          <button
            onClick={() => setActiveTab('crear')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'crear'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Crear Oferta
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

      {/* Contenido por Tab */}
      {activeTab === 'ofertas' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Original
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descuento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Oferta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vigencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días Restantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ofertas.map((oferta) => (
                  <tr key={oferta.oferta_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {oferta.presentacion_nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {oferta.cerveza_nombre}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {offerService.formatearMoneda(oferta.precio_original)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        -{offerService.formatearPorcentaje(oferta.porcentaje_descuento)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {offerService.formatearMoneda(oferta.precio_oferta)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Inicio: {offerService.formatearFecha(oferta.fecha_inicio)}</div>
                        <div>Fin: {offerService.formatearFecha(oferta.fecha_fin)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        oferta.dias_restantes <= 3 
                          ? 'bg-red-100 text-red-800'
                          : oferta.dias_restantes <= 7
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {oferta.dias_restantes} días
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(oferta.oferta_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {ofertas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay ofertas activas
            </div>
          )}
        </div>
      )}

      {activeTab === 'crear' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nueva Oferta</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto *
                </label>
                <select
                  required
                  value={formData.presentacion_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, presentacion_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar producto</option>
                  {productosElegibles.filter(p => p.puede_tener_oferta).map((producto) => (
                    <option key={producto.presentacion_id} value={producto.presentacion_id}>
                      {producto.cerveza_nombre} - {producto.presentacion_nombre} 
                      ({offerService.formatearMoneda(producto.precio)})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Solo productos elegibles (sin ofertas en los últimos 30 días)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentaje de Descuento *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="99"
                  value={formData.porcentaje_descuento}
                  onChange={(e) => setFormData(prev => ({ ...prev, porcentaje_descuento: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 15"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Entre 1% y 99%
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio *
                </label>
                <input
                  type="date"
                  required
                  value={formData.fecha_inicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin *
                </label>
                <input
                  type="date"
                  required
                  value={formData.fecha_fin}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_fin: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={formData.fecha_inicio || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Preview de la oferta */}
            {formData.presentacion_id && formData.porcentaje_descuento && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Vista Previa de la Oferta</h4>
                {(() => {
                  const producto = productosElegibles.find(p => p.presentacion_id === parseInt(formData.presentacion_id));
                  const porcentaje = parseInt(formData.porcentaje_descuento);
                  if (producto && porcentaje) {
                    const precioOferta = calcularPrecioOferta(producto.precio, porcentaje);
                    const ahorro = offerService.calcularAhorro(producto.precio, porcentaje);
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Precio Original:</span>
                          <div className="font-medium line-through text-gray-500">
                            {offerService.formatearMoneda(producto.precio)}
                          </div>
                        </div>
                        <div>
                          <span className="text-blue-700">Precio con Oferta:</span>
                          <div className="font-medium text-green-600">
                            {offerService.formatearMoneda(precioOferta)}
                          </div>
                        </div>
                        <div>
                          <span className="text-blue-700">Ahorro:</span>
                          <div className="font-medium text-red-600">
                            {offerService.formatearMoneda(ahorro)} ({offerService.formatearPorcentaje(porcentaje)})
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Oferta'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'estadisticas' && estadisticas && (
        <div className="space-y-6">
          {/* Estadísticas Generales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total de Ofertas</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.total_ofertas}</p>
                </div>
                <div className="ml-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    🏷️
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Ofertas Activas</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.ofertas_activas}</p>
                </div>
                <div className="ml-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    ✅
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Descuento Promedio</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {offerService.formatearPorcentaje(estadisticas.descuento_promedio)}
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    💯
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Ventas con Ofertas</p>
                  <p className="text-2xl font-bold text-purple-600">{estadisticas.ventas_totales_ofertas}</p>
                </div>
                <div className="ml-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    📊
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Ingresos con Ofertas</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {offerService.formatearMoneda(estadisticas.ingresos_totales_ofertas)}
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    💰
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Ofertas Finalizadas</p>
                  <p className="text-2xl font-bold text-gray-600">{estadisticas.ofertas_finalizadas}</p>
                </div>
                <div className="ml-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    ⏰
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Productos No Elegibles */}
          {productosElegibles.filter(p => !p.puede_tener_oferta).length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Productos No Elegibles para Ofertas
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Estos productos no pueden tener ofertas porque han tenido una oferta en los últimos 30 días:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Última Oferta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Días Restantes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productosElegibles.filter(p => !p.puede_tener_oferta).map((producto) => {
                      const diasRestantes = 30 - Math.floor((Date.now() - new Date(producto.ultima_oferta_fin).getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <tr key={producto.presentacion_id}>
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
                            {offerService.formatearFecha(producto.ultima_oferta_fin)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {Math.max(0, diasRestantes)} días
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 