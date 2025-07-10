import { useState, useEffect } from 'react';
import { eventService, type Evento, type TipoEvento } from '../../services/eventService';
import type { Lugar } from '../../services/api';

interface SubeventosManagementProps {
  eventoPadre: Evento;
  tiposEvento: TipoEvento[];
  lugares: Lugar[];
  onClose: () => void;
  onUpdate: () => void; // Para refrescar la lista de eventos principal
}

export default function SubeventosManagement({ eventoPadre, tiposEvento, lugares, onClose, onUpdate }: SubeventosManagementProps) {
  const [subeventos, setSubeventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_inicio: eventoPadre.fecha_inicio.split('T')[0],
    fecha_fin: eventoPadre.fecha_fin.split('T')[0],
    direccion: eventoPadre.direccion,
    precio_entrada: '',
    fk_lugar: '',
    fk_tipo_evento: '',
  });

  useEffect(() => {
    loadSubeventos();
  }, [eventoPadre.clave]);

  const loadSubeventos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getSubeventos(eventoPadre.clave);
      setSubeventos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar sub-eventos');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      fecha_inicio: eventoPadre.fecha_inicio.split('T')[0],
      fecha_fin: eventoPadre.fecha_fin.split('T')[0],
      direccion: eventoPadre.direccion,
      precio_entrada: '',
      fk_lugar: '',
      fk_tipo_evento: '',
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(formData.fecha_inicio) < new Date(eventoPadre.fecha_inicio.split('T')[0]) || new Date(formData.fecha_fin) > new Date(eventoPadre.fecha_fin.split('T')[0])) {
        setError('Las fechas del sub-evento deben estar dentro del rango de fechas del evento padre.');
        return;
    }

    try {
      setLoading(true);
      const subeventoData = {
        ...formData,
        precio_entrada: formData.precio_entrada ? parseInt(formData.precio_entrada) : 0,
        fk_lugar: parseInt(formData.fk_lugar),
        fk_tipo_evento: parseInt(formData.fk_tipo_evento),
        fk_evento: eventoPadre.clave,
      };

      await eventService.createEvento(subeventoData);
      
      resetForm();
      await loadSubeventos();
      onUpdate(); // Actualizar el componente padre
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear sub-evento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subeventoId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este sub-evento?')) return;
    try {
      setLoading(true);
      await eventService.deleteEvento(subeventoId);
      await loadSubeventos();
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar sub-evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Lista de Subeventos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h4 className="font-semibold">Actividades Asignadas</h4>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
          >
            + Asignar Actividad
          </button>
        </div>
        {loading ? (
          <p className="p-4 text-center text-gray-500">Cargando actividades...</p>
        ) : subeventos.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No hay actividades asignadas a este evento.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fechas</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subeventos.map(sub => (
                <tr key={sub.clave}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{sub.nombre}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{sub.tipo_evento}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {new Date(sub.fecha_inicio).toLocaleDateString()} - {new Date(sub.fecha_fin).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(sub.clave)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Formulario para nuevo subevento (Modal o inline) */}
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner border">
          <h4 className="font-semibold mb-3">Asignar Nueva Actividad</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre Actividad *</label>
                    <input type="text" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Actividad *</label>
                    <select required value={formData.fk_tipo_evento} onChange={e => setFormData({...formData, fk_tipo_evento: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="">Seleccionar tipo</option>
                        {tiposEvento.map(t => <option key={t.clave} value={t.clave}>{t.nombre}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha Inicio *</label>
                    <input type="date" required value={formData.fecha_inicio} min={eventoPadre.fecha_inicio.split('T')[0]} max={formData.fecha_fin} onChange={e => setFormData({...formData, fecha_inicio: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha Fin *</label>
                    <input type="date" required value={formData.fecha_fin} min={formData.fecha_inicio} max={eventoPadre.fecha_fin.split('T')[0]} onChange={e => setFormData({...formData, fecha_fin: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Lugar *</label>
                    <select required value={formData.fk_lugar} onChange={e => setFormData({...formData, fk_lugar: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="">Seleccionar lugar</option>
                        {lugares.map(l => <option key={l.clave} value={l.clave}>{l.nombre}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Precio Entrada (opcional)</label>
                    <input type="number" value={formData.precio_entrada} onChange={e => setFormData({...formData, precio_entrada: e.target.value})} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"/>
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <textarea value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} rows={2} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"/>
             </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50">
                {loading ? 'Guardando...' : 'Guardar Actividad'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 