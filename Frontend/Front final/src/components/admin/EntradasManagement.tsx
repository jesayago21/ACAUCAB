import React, { useState, useEffect } from 'react';
import { eventService, type EstadisticasEntrada } from '../../services/eventService';

const EntradasManagement: React.FC = () => {
    const [stats, setStats] = useState<EstadisticasEntrada[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await eventService.getEstadisticasEntradas(fechaInicio, fechaFin);
            setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const handleFilter = () => {
        loadStats();
    };

    const clearFilters = () => {
        setFechaInicio('');
        setFechaFin('');
        // Reload stats without filters
        setTimeout(loadStats, 0);
    };

    const formatCurrency = (value: number | null) => {
        if (value === null || isNaN(value)) {
            return '$0.00';
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    
    const summary = {
        totalEventos: stats.length,
        totalEntradas: stats.reduce((sum, stat) => sum + Number(stat.entradas_vendidas), 0),
        totalIngresos: stats.reduce((sum, stat) => sum + Number(stat.ingresos_totales), 0),
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Entradas</h2>
                <p className="text-gray-600">Estadísticas de ventas de entradas por evento.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Eventos Analizados</h3>
                    <p className="text-2xl font-bold">{summary.totalEventos}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Entradas Vendidas</h3>
                    <p className="text-2xl font-bold">{summary.totalEntradas.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIngresos)}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow space-y-4 md:space-y-0 md:flex md:items-end md:justify-between">
                <div className="flex items-end space-x-4">
                    <div>
                        <label htmlFor="fecha_inicio" className="text-sm font-medium text-gray-700">Fecha Inicio</label>
                        <input
                            type="date"
                            id="fecha_inicio"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="fecha_fin" className="text-sm font-medium text-gray-700">Fecha Fin</label>
                        <input
                            type="date"
                            id="fecha_fin"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>
                <div className="flex space-x-2">
                     <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Aplicar Filtros
                    </button>
                    <button onClick={clearFilters} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
                        Limpiar
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p>Cargando datos...</p>
                </div>
            )}

            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}

            {!loading && !error && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Entradas Vendidas</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ingresos Totales</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stats.length > 0 ? (
                                    stats.map((stat) => (
                                        <tr key={stat.evento_id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.evento_nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(stat.fecha_evento)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.tipo_evento}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-800">{Number(stat.entradas_vendidas).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-700">{formatCurrency(Number(stat.ingresos_totales))}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-500">
                                            No se han vendido entradas para el período seleccionado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EntradasManagement; 