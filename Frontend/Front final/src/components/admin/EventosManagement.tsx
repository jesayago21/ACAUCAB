import { useState, useEffect } from 'react';
import { eventService, type Evento, type TipoEvento } from '../../services/eventService';
import { lugarService, type Lugar } from '../../services/api';
import SubeventosManagement from './SubeventosManagement';
import LugaresSelector from './LugaresSelector';
import InvitadosManagement from './InvitadosManagement';
import InventarioEventosManagement from './InventarioEventosManagement';

interface EventosManagementProps {
  onClose?: () => void;
}

export default function EventosManagement({ onClose }: EventosManagementProps) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [tiposEvento, setTiposEvento] = useState<TipoEvento[]>([]);
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [showSubeventos, setShowSubeventos] = useState(false);
  const [showInvitados, setShowInvitados] = useState(false);
  const [showInventario, setShowInventario] = useState(false);
  const [activeTab, setActiveTab] = useState<'eventos' | 'crear' | 'invitados' | 'inventario'>('eventos');
  
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    tipo: '',
    lugar_id: ''
  });

  // Form state mejorado
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    hora_inicio: '',
    direccion: '',
    precio_entrada: '',
    fk_lugar: '',
    fk_tipo_evento: '',
    fk_evento: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const filtrosApi = {
        fecha_inicio: filtros.fecha_inicio || undefined,
        fecha_fin: filtros.fecha_fin || undefined,
        tipo: filtros.tipo || undefined,
        lugar_id: filtros.lugar_id ? parseInt(filtros.lugar_id, 10) : undefined,
      };
      const filtrosLimpios = Object.fromEntries(
        Object.entries(filtrosApi).filter(([, value]) => value != null && value !== '')
      ) as { [key: string]: any };

      const [eventosData, tiposData, lugaresData] = await Promise.all([
        eventService.getEventos(filtrosLimpios),
        eventService.getTiposEvento(),
        lugarService.obtenerEstados()
      ]);
      
      setEventos(eventosData);
      setTiposEvento(tiposData);
      setLugares(lugaresData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (key: string, value: string) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const aplicarFiltros = async () => {
    try {
      setLoading(true);
      const filtrosApi = {
        fecha_inicio: filtros.fecha_inicio || undefined,
        fecha_fin: filtros.fecha_fin || undefined,
        tipo: filtros.tipo || undefined,
        lugar_id: filtros.lugar_id ? parseInt(filtros.lugar_id, 10) : undefined,
      };

      const filtrosLimpios = Object.fromEntries(
        Object.entries(filtrosApi).filter(([, value]) => value != null && value !== '')
      ) as { [key: string]: any };

      const eventosData = await eventService.getEventos(filtrosLimpios);
      setEventos(eventosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aplicar filtros');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const eventoData = {
        ...formData,
        precio_entrada: formData.precio_entrada ? parseInt(formData.precio_entrada) : undefined,
        fk_lugar: parseInt(formData.fk_lugar),
        fk_tipo_evento: parseInt(formData.fk_tipo_evento),
        fk_evento: formData.fk_evento ? parseInt(formData.fk_evento) : undefined
      };

      if (editingEvent) {
        await eventService.updateEvento(editingEvent.clave, eventoData);
      } else {
        await eventService.createEvento(eventoData);
      }

      await loadInitialData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (evento: Evento) => {
    setEditingEvent(evento);

    const tipoEvento = tiposEvento.find(t => t.nombre === evento.tipo_evento);
    const lugar = lugares.find(l => l.nombre === evento.lugar);

    const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toISOString().split('T')[0];
      } catch {
        return '';
      }
    };

    const formatTime = (dateString: string) => {
      try {
        return new Date(dateString).toISOString().split('T')[1]?.substring(0, 5) || '';
      } catch {
        return '';
      }
    };
    
    setFormData({
      nombre: evento.nombre,
      fecha_inicio: formatDate(evento.fecha_inicio),
      fecha_fin: formatDate(evento.fecha_fin),
      hora_inicio: formatTime(evento.fecha_inicio),
      direccion: evento.direccion,
      precio_entrada: evento.precio_entrada?.toString() || '',
      fk_lugar: lugar ? lugar.clave.toString() : '',
      fk_tipo_evento: tipoEvento ? tipoEvento.clave.toString() : '',
      fk_evento: evento.evento_padre_id?.toString() || ''
    });
    setActiveTab('crear');
  };

  const handleDelete = async (eventoId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
    
    try {
      setLoading(true);
      await eventService.deleteEvento(eventoId);
      await loadInitialData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar evento');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      fecha_inicio: '',
      fecha_fin: '',
      hora_inicio: '',
      direccion: '',
      precio_entrada: '',
      fk_lugar: '',
      fk_tipo_evento: '',
      fk_evento: ''
    });
    setEditingEvent(null);
    setActiveTab('eventos');
  };

  const verSubeventos = (evento: Evento) => {
    setSelectedEvent(evento);
    setShowSubeventos(true);
  };

  const verInvitados = (evento: Evento) => {
    setSelectedEvent(evento);
    setShowInvitados(true);
  };

  const verInventario = (evento: Evento) => {
    setSelectedEvent(evento);
    setShowInventario(true);
  };

  /** Manejar cambio de lugar con el selector jerárquico */
  const handleLugarChange = (lugarId: number | null, lugar?: Lugar) => {
    setFormData(prev => ({
      ...prev,
      fk_lugar: lugarId ? lugarId.toString() : ''
    }));
  };

  if (loading && eventos.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Eventos</h2>
          <p className="text-gray-600">Administra eventos, sub-eventos, invitados e inventarios</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('crear')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nuevo Evento
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
            onClick={() => setActiveTab('eventos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'eventos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Eventos ({eventos.length})
          </button>
          <button
            onClick={() => setActiveTab('crear')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'crear'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {editingEvent ? 'Editar Evento' : 'Crear Evento'}
          </button>
        </nav>
      </div>

      {/* Contenido de tabs */}
      {activeTab === 'eventos' && (
        <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fecha_inicio}
              onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.fecha_fin}
              onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Evento
            </label>
            <select
              value={filtros.tipo}
              onChange={(e) => handleFiltroChange('tipo', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todos los tipos</option>
              {tiposEvento.map((tipo) => (
                <option key={tipo.clave} value={tipo.nombre}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lugar
            </label>
            <select
              value={filtros.lugar_id}
              onChange={(e) => handleFiltroChange('lugar_id', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todos los lugares</option>
              {lugares.map((lugar) => (
                <option key={lugar.clave} value={lugar.clave}>
                  {lugar.nombre}
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

      {/* Lista de Eventos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lugar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actividades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asistentes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventos.map((evento) => (
                <tr key={evento.clave} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {evento.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {evento.direccion}
                      </div>
                          {evento.precio_entrada && (
                            <div className="text-sm text-green-600">
                              Entrada: {new Intl.NumberFormat('es-VE', {
                                style: 'currency',
                                currency: 'VES'
                              }).format(evento.precio_entrada)}
                            </div>
                          )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>Inicio: {new Date(evento.fecha_inicio).toLocaleDateString()}</div>
                      <div>Fin: {new Date(evento.fecha_fin).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {evento.tipo_evento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {evento.lugar}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {evento.cantidad_subeventos}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {evento.cantidad_asistentes}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('es-VE', {
                      style: 'currency',
                      currency: 'VES'
                    }).format(evento.ingresos_totales)}
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-1">
                          <div className="flex space-x-2">
                    <button
                      onClick={() => verSubeventos(evento)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Actividades
                    </button>
                            <button
                              onClick={() => verInvitados(evento)}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              Invitados
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => verInventario(evento)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Inventario
                            </button>
                    <button
                      onClick={() => handleEdit(evento)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(evento.clave)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                          </div>
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

      {/* Tab de Crear/Editar Evento */}
      {activeTab === 'crear' && (
        <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio Entrada
                    </label>
                    <input
                      type="number"
                      value={formData.precio_entrada}
                      onChange={(e) => setFormData(prev => ({ ...prev, precio_entrada: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Evento *
                    </label>
                    <select
                      required
                      value={formData.fk_tipo_evento}
                      onChange={(e) => setFormData(prev => ({ ...prev, fk_tipo_evento: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Seleccionar tipo</option>
                      {tiposEvento.map((tipo) => (
                        <option key={tipo.clave} value={tipo.clave}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
              <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lugar *
                    </label>
                <LugaresSelector
                  value={formData.fk_lugar ? parseInt(formData.fk_lugar) : undefined}
                  onChange={handleLugarChange}
                  placeholder="Seleccionar lugar del evento"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evento Padre (opcional)
                </label>
                    <select
                  value={formData.fk_evento}
                  onChange={(e) => setFormData(prev => ({ ...prev, fk_evento: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                  <option value="">Evento principal</option>
                  {eventos.filter(e => !e.evento_padre_id).map((evento) => (
                    <option key={evento.clave} value={evento.clave}>
                      {evento.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                  </label>
                  <textarea
                    required
                    value={formData.direccion}
                    onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>

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
                    {loading ? 'Guardando...' : (editingEvent ? 'Actualizar' : 'Crear')}
                  </button>
                </div>
              </form>
        </div>
      )}

      {/* Modal de Sub-eventos */}
      {showSubeventos && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Actividades de: {selectedEvent.nombre}
                </h3>
                <button
                  onClick={() => setShowSubeventos(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <SubeventosManagement
                eventoPadre={selectedEvent}
                tiposEvento={tiposEvento}
                lugares={lugares}
                onClose={() => setShowSubeventos(false)}
                onUpdate={loadInitialData}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Invitados */}
      {showInvitados && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Invitados de: {selectedEvent.nombre}
                </h3>
                <button
                  onClick={() => setShowInvitados(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <InvitadosManagement
                eventoId={selectedEvent.clave}
                eventoNombre={selectedEvent.nombre}
                onClose={() => setShowInvitados(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Inventario */}
      {showInventario && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Inventario de: {selectedEvent.nombre}
                </h3>
                <button
                  onClick={() => setShowInventario(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <InventarioEventosManagement
                eventoId={selectedEvent.clave}
                eventoNombre={selectedEvent.nombre}
                onClose={() => setShowInventario(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 