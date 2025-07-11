import React, { useState, useEffect } from 'react';
import { eventService, type Invitado } from '../../services/eventService';

/** Interfaces específicas para invitados */
interface TipoInvitado {
  clave: number;
  nombre: string;
}

interface InvitadosManagementProps {
  eventoId: number;
  eventoNombre: string;
  onClose: () => void;
}

/** Componente para gestión de invitados en eventos */
export default function InvitadosManagement({ 
  eventoId, 
  eventoNombre, 
  onClose 
}: InvitadosManagementProps) {
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [tiposInvitado, setTiposInvitado] = useState<TipoInvitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedInvitado, setSelectedInvitado] = useState<Invitado | null>(null);
  const [activeTab, setActiveTab] = useState<'lista' | 'agregar' | 'registro'>('lista');

  // Form state
  const [formData, setFormData] = useState({
    ci: '',
    rif: '',
    primer_nombre: '',
    primer_apellido: '',
    tipo_invitado_id: ''
  });

  // Busqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    loadData();
  }, [eventoId]);

  /** Cargar datos de invitados y tipos */
  const loadData = async () => {
    try {
      setLoading(true);
      const [invitadosData] = await Promise.all([
        eventService.getInvitados(eventoId)
      ]);
      
      setInvitados(invitadosData);
      
      // Simular tipos de invitado hasta que estén en el backend
      setTiposInvitado([
        { clave: 1, nombre: 'VIP' },
        { clave: 2, nombre: 'Prensa' },
        { clave: 3, nombre: 'Invitado Especial' },
        { clave: 4, nombre: 'Staff' },
        { clave: 5, nombre: 'Proveedor' }
      ]);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar invitados');
    } finally {
      setLoading(false);
    }
  };

  /** Manejar envío del formulario */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const invitadoData = {
        ci: parseInt(formData.ci),
        rif: parseInt(formData.rif),
        primer_nombre: formData.primer_nombre,
        primer_apellido: formData.primer_apellido,
        tipo_invitado_id: parseInt(formData.tipo_invitado_id)
      };

      await eventService.agregarInvitado(eventoId, invitadoData);
      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar invitado');
    } finally {
      setLoading(false);
    }
  };

  /** Resetear formulario */
  const resetForm = () => {
    setFormData({
      ci: '',
      rif: '',
      primer_nombre: '',
      primer_apellido: '',
      tipo_invitado_id: ''
    });
    setActiveTab('lista');
  };

  /** Registrar entrada de invitado */
  const registrarEntrada = async (invitado: Invitado) => {
    try {
      // Por ahora solo mostrar confirmación hasta que esté implementado en el backend
      if (confirm(`¿Registrar entrada de ${invitado.nombre_completo}?`)) {
        alert('Funcionalidad de registro de entrada en desarrollo...');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar entrada');
    }
  };

  /** Registrar salida de invitado */
  const registrarSalida = async (invitado: Invitado) => {
    try {
      if (confirm(`¿Registrar salida de ${invitado.nombre_completo}?`)) {
        alert('Funcionalidad de registro de salida en desarrollo...');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar salida');
    }
  };

  /** Filtrar invitados */
  const invitadosFiltrados = invitados.filter(invitado => {
    const coincideBusqueda = !busqueda || 
      invitado.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
      invitado.rif.toString().includes(busqueda);

    const coincideTipo = !filtroTipo || invitado.tipo_invitado === filtroTipo;

    return coincideBusqueda && coincideTipo;
  });

  /** Obtener configuración de estado de asistencia */
  const getEstadoAsistencia = (invitado: Invitado) => {
    if (invitado.fecha_salida) {
      return { 
        estado: 'Salió', 
        color: 'bg-gray-100 text-gray-800',
        icon: '👋'
      };
    } else if (invitado.fecha_entrada) {
      return { 
        estado: 'Presente', 
        color: 'bg-green-100 text-green-800',
        icon: '✅'
      };
    } else {
      return { 
        estado: 'Pendiente', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: '⏳'
      };
    }
  };

  /** Formatear fecha/hora */
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  if (loading && invitados.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Gestión de Invitados
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

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">👥</span>
            <div>
              <p className="text-sm text-gray-600">Total Invitados</p>
              <p className="text-xl font-bold">{invitados.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <div>
              <p className="text-sm text-gray-600">Presentes</p>
              <p className="text-xl font-bold text-green-600">
                {invitados.filter(i => i.fecha_entrada && !i.fecha_salida).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⏳</span>
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-xl font-bold text-yellow-600">
                {invitados.filter(i => !i.fecha_entrada).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <span className="text-2xl mr-3">👋</span>
            <div>
              <p className="text-sm text-gray-600">Han Salido</p>
              <p className="text-xl font-bold text-gray-600">
                {invitados.filter(i => i.fecha_salida).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('lista')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lista'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lista de Invitados ({invitados.length})
          </button>
          <button
            onClick={() => setActiveTab('agregar')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'agregar'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Agregar Invitado
          </button>
          <button
            onClick={() => setActiveTab('registro')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'registro'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Control de Acceso
          </button>
        </nav>
      </div>

      {/* Contenido de tabs */}
      {activeTab === 'lista' && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h4 className="text-lg font-semibold mb-4">Filtros</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar invitado
                </label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre o RIF..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Invitado
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todos los tipos</option>
                  {tiposInvitado.map((tipo) => (
                    <option key={tipo.clave} value={tipo.nombre}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lista de invitados */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invitado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salida
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invitadosFiltrados.map((invitado) => {
                    const estadoAsistencia = getEstadoAsistencia(invitado);
                    return (
                      <tr key={invitado.invitado_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {invitado.nombre_completo}
                            </div>
                            <div className="text-sm text-gray-500">
                              RIF: {invitado.rif}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invitado.tipo_invitado}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoAsistencia.color}`}>
                            <span className="mr-1">{estadoAsistencia.icon}</span>
                            {estadoAsistencia.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(invitado.fecha_entrada)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(invitado.fecha_salida)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {!invitado.fecha_entrada && (
                            <button
                              onClick={() => registrarEntrada(invitado)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Registrar Entrada
                            </button>
                          )}
                          {invitado.fecha_entrada && !invitado.fecha_salida && (
                            <button
                              onClick={() => registrarSalida(invitado)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Registrar Salida
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {invitadosFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron invitados que coincidan con los filtros.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab de Agregar Invitado */}
      {activeTab === 'agregar' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Agregar Nuevo Invitado
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula de Identidad *
                </label>
                <input
                  type="number"
                  required
                  value={formData.ci}
                  onChange={(e) => setFormData(prev => ({ ...prev, ci: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ej: 12345678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RIF *
                </label>
                <input
                  type="number"
                  required
                  value={formData.rif}
                  onChange={(e) => setFormData(prev => ({ ...prev, rif: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ej: 123456789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primer Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.primer_nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, primer_nombre: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Nombre"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primer Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={formData.primer_apellido}
                  onChange={(e) => setFormData(prev => ({ ...prev, primer_apellido: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Apellido"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Invitado *
                </label>
                <select
                  required
                  value={formData.tipo_invitado_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo_invitado_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposInvitado.map((tipo) => (
                    <option key={tipo.clave} value={tipo.clave}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
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
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Agregar Invitado'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab de Control de Acceso */}
      {activeTab === 'registro' && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Control de Acceso Rápido
          </h4>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <span className="text-4xl mb-4 block">🎫</span>
            <p className="text-blue-700 font-medium">Control de acceso en desarrollo</p>
            <p className="text-sm text-blue-600 mt-1">
              Aquí podrás registrar entradas y salidas de forma rápida mediante código de barras o búsqueda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 