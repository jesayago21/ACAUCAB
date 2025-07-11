import React, { useState, useEffect } from 'react';
import { eventService, type Evento, type Asistente } from '../../services/eventService';

const AsistenciaManagement: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [asistentes, setAsistentes] = useState<Asistente[]>([]);
    const [selectedEvento, setSelectedEvento] = useState<number | null>(null);
    const [loadingEventos, setLoadingEventos] = useState(true);
    const [loadingAsistentes, setLoadingAsistentes] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar la lista de eventos al montar el componente
    useEffect(() => {
        const loadEventos = async () => {
            try {
                setLoadingEventos(true);
                // Podríamos filtrar por eventos pasados o activos si se desea
                const data = await eventService.getEventos();
                setEventos(data);
            } catch (err) {
                setError('Error al cargar la lista de eventos.');
            } finally {
                setLoadingEventos(false);
            }
        };
        loadEventos();
    }, []);

    // Cargar asistentes cuando se selecciona un evento
    useEffect(() => {
        if (selectedEvento) {
            const loadAsistentes = async () => {
                try {
                    setLoadingAsistentes(true);
                    const data = await eventService.getAsistentes(selectedEvento);
                    setAsistentes(data);
                } catch (err) {
                    setError(`Error al cargar asistentes para el evento ${selectedEvento}.`);
                    setAsistentes([]);
                } finally {
                    setLoadingAsistentes(false);
                }
            };
            loadAsistentes();
        } else {
            setAsistentes([]);
        }
    }, [selectedEvento]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—'; // Se muestra un guión si no hay fecha de entrada.
        return new Date(dateString).toLocaleString('es-ES', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Consulta de Asistencia a Eventos</h2>
                <p className="text-gray-600">Selecciona un evento para ver la lista de asistentes.</p>
            </div>

            {/* Event Selector */}
            <div className="bg-white p-4 rounded-lg shadow">
                <label htmlFor="evento-selector" className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Evento
                </label>
                {loadingEventos ? (
                    <p>Cargando eventos...</p>
                ) : (
                    <select
                        id="evento-selector"
                        value={selectedEvento || ''}
                        onChange={(e) => setSelectedEvento(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">-- Por favor, elige un evento --</option>
                        {eventos.map(evento => (
                            <option key={evento.clave} value={evento.clave}>
                                {evento.nombre} ({new Date(evento.fecha_inicio).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}

            {selectedEvento && (
                loadingAsistentes ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p>Cargando asistentes...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre del Asistente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo Cliente</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hora de Entrada</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {asistentes.length > 0 ? (
                                        asistentes.map((asistente) => (
                                            <tr key={asistente.ticket_id}>
                                                <td className="px-6 py-4 whitespace-nownowrap text-sm font-medium text-gray-900">{asistente.cliente_nombre}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asistente.cliente_documento}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asistente.tipo_cliente}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    {formatDate(asistente.fecha_entrada)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-500">
                                                No se encontraron asistentes para este evento.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default AsistenciaManagement; 