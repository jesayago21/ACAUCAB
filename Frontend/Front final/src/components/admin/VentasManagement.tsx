/** Componente principal de gestión de ventas con indicadores clave */
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/auth';
import { dashboardService, type DashboardCompleto } from '../../services/dashboardService';

interface VentasManagementProps {
    user: Usuario;
}

const VentasManagement: React.FC<VentasManagementProps> = ({ user }) => {
    const [dashboard, setDashboard] = useState<DashboardCompleto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fechaInicio, setFechaInicio] = useState(() => {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - 30);
        return fecha.toISOString().split('T')[0];
    });
    const [fechaFin, setFechaFin] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getDashboardCompleto(fechaInicio, fechaFin);
            setDashboard(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar indicadores de ventas');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltroFechas = () => {
        loadDashboard();
    };

    const safeFormatCurrency = (value: any) => {
        const num = parseFloat(value);
        if (isNaN(num)) return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(0);
        return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(num);
    };

    const formatPercentage = (value: any) => {
        const num = parseFloat(value);
        if (isNaN(num)) return '0.0%';
        return `${num.toFixed(1)}%`;
    };

    const getGrowthColor = (value: number) => {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getGrowthIcon = (value: number) => {
        if (value > 0) return '↗️';
        if (value < 0) return '↘️';
        return '➡️';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="text-center py-8 text-gray-500">
                No hay datos disponibles para el período seleccionado.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow border">
                 <div className="flex items-end space-x-4">
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                         <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2"/>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                         <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2"/>
                     </div>
                     <button onClick={aplicarFiltroFechas} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                         Aplicar Filtros
                     </button>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Ventas Totales por Tienda */}
                {dashboard.indicadores_ventas.ventas_totales?.map((venta) => (
                    <div key={venta.tipo_venta} className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Ventas {venta.tipo_venta === 'tienda_fisica' ? 'Tienda Física' : 'Online'}</p>
                                <p className="text-2xl font-bold text-gray-900">{safeFormatCurrency(venta.monto_total)}</p>
                                <p className="text-sm text-gray-500">{venta.cantidad_ventas} transacciones</p>
                            </div>
                            <div className="text-2xl">{venta.tipo_venta === 'tienda_fisica' ? '🏪' : '🌐'}</div>
                        </div>
                    </div>
                ))}

                {/* Crecimiento de Ventas */}
                {dashboard.indicadores_ventas.crecimiento_ventas && (
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <p className="text-sm font-medium text-gray-600">Crecimiento de Ventas</p>
                        <p className={`text-2xl font-bold ${getGrowthColor(dashboard.indicadores_ventas.crecimiento_ventas.porcentaje_crecimiento)}`}>
                            {getGrowthIcon(dashboard.indicadores_ventas.crecimiento_ventas.porcentaje_crecimiento)}
                            {formatPercentage(dashboard.indicadores_ventas.crecimiento_ventas.porcentaje_crecimiento)}
                        </p>
                        <p className="text-sm text-gray-500">vs período anterior</p>
                    </div>
                )}

                {/* Ticket Promedio */}
                {dashboard.indicadores_ventas.ticket_promedio?.find(t => t.tipo_venta === 'total') && (
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <p className="text-sm font-medium text-gray-600">Ticket Promedio (VMP)</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {safeFormatCurrency(dashboard.indicadores_ventas.ticket_promedio.find(t => t.tipo_venta === 'total')?.ticket_promedio || 0)}
                        </p>
                    </div>
                )}

                 {/* Volumen de Unidades Vendidas */}
                {dashboard.indicadores_ventas.volumen_unidades && (
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <p className="text-sm font-medium text-gray-600">Volumen de Unidades Vendidas</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {dashboard.indicadores_ventas.volumen_unidades.reduce((total, item) => total + item.unidades_vendidas, 0).toLocaleString()}
                        </p>
                    </div>
                )}
            </div>

            {/* Ventas por Estilo de Cerveza */}
            {dashboard.indicadores_ventas.ventas_por_estilo && (
                <div className="bg-white p-6 rounded-lg shadow border col-span-1 md:col-span-2 lg:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Estilo de Cerveza</h3>
                     <div className="space-y-4">
                        {dashboard.indicadores_ventas.ventas_por_estilo.slice(0, 5).map((estilo) => (
                            <div key={estilo.estilo_cerveza} className="flex items-center">
                                <span className="w-32 text-sm font-medium text-gray-600">{estilo.estilo_cerveza}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-5">
                                    <div
                                        className="bg-blue-600 h-5 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold"
                                        style={{ width: `${estilo.porcentaje_del_total}%` }}
                                    >
                                       {formatPercentage(estilo.porcentaje_del_total)}
                                    </div>
                                </div>
                                <span className="w-28 text-right text-sm font-semibold text-gray-800 ml-2">{safeFormatCurrency(estilo.monto_total)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VentasManagement; 