/** Componente principal de gestión de ventas */
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/auth';
import VentasWebManagement from './VentasWebManagement';
import VentasTiendaManagement from './VentasTiendaManagement';
import PuntosManagement from './PuntosManagement';
import { dashboardService, type DashboardCompleto } from '../../services/dashboardService';

interface VentasManagementProps {
    user: Usuario;
}

type VentasSubmodule = 'web' | 'tienda' | 'puntos';

const VentasManagement: React.FC<VentasManagementProps> = ({ user }) => {
    const [activeSubmodule, setActiveSubmodule] = useState<VentasSubmodule>('web');
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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'VES',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
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

    /** Verificar si el usuario tiene un permiso específico */
    const hasPermission = (permission: string): boolean => {
        return user.permisos.some(p => p.nombre.toLowerCase() === permission.toLowerCase());
    };

    /** Verificar permisos generales de ventas */
    const canViewVentas = hasPermission('consultar venta_tienda_fisica') || 
                         hasPermission('Consultar venta_tienda_fisica') ||
                         hasPermission('consultar venta_online') || 
                         hasPermission('Consultar venta_online') ||
                         hasPermission('consultar venta_evento') || 
                         hasPermission('Consultar venta_evento');
    const canCreateVentas = hasPermission('crear venta_tienda_fisica') || 
                           hasPermission('crear venta_online') ||
                           hasPermission('crear venta_evento');
    const canUpdateVentas = hasPermission('modificar venta_tienda_fisica') || 
                           hasPermission('modificar venta_online') ||
                           hasPermission('modificar venta_evento');
    const canDeleteVentas = hasPermission('eliminar venta_tienda_fisica') || 
                           hasPermission('eliminar venta_online') ||
                           hasPermission('eliminar venta_evento');

    /** Verificar permisos específicos de puntos */
    const canViewPuntos = hasPermission('consultar puntos') || hasPermission('Consultar puntos');
    const canManagePuntos = hasPermission('modificar puntos') || hasPermission('Modificar puntos');

    if (!canViewVentas) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
                <p className="text-red-700">No tiene permisos para ver la gestión de ventas.</p>
            </div>
        );
    }

    /** Navegación entre submódulos */
    const renderSubmoduleNavigation = () => (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <nav className="flex space-x-4">
                <button
                    onClick={() => setActiveSubmodule('web')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeSubmodule === 'web'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                    <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                        Ventas Online
                    </span>
                </button>

                <button
                    onClick={() => setActiveSubmodule('tienda')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeSubmodule === 'tienda'
                            ? 'bg-green-600 text-white'
                            : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                >
                    <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Ventas Tienda
                    </span>
                </button>

                {canViewPuntos && (
                    <button
                        onClick={() => setActiveSubmodule('puntos')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeSubmodule === 'puntos'
                                ? 'bg-yellow-600 text-white'
                                : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                    >
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Gestión Puntos
                        </span>
                    </button>
                )}
            </nav>
        </div>
    );

    /** Renderizar el submódulo activo */
    const renderActiveSubmodule = () => {
        switch (activeSubmodule) {
            case 'web':
                return (
                    <VentasWebManagement 
                        user={user}
                        canView={canViewVentas}
                        canCreate={canCreateVentas}
                        canUpdate={canUpdateVentas}
                        canDelete={canDeleteVentas}
                    />
                );
            case 'tienda':
                return (
                    <VentasTiendaManagement 
                        user={user}
                        canView={canViewVentas}
                        canCreate={canCreateVentas}
                        canUpdate={canUpdateVentas}
                        canDelete={canDeleteVentas}
                    />
                );
            case 'puntos':
                return (
                    <PuntosManagement 
                        user={user}
                        canView={canViewPuntos}
                        canManage={canManagePuntos}
                    />
                );
            default:
                return null;
        }
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
                No hay datos disponibles
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header principal */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Ventas</h1>
                        <p className="text-blue-100 mt-2">
                            Administración completa del sistema de ventas ACAUCAB
                        </p>
                        <p className="text-blue-200 text-sm mt-1">
                            Período: {new Date(fechaInicio).toLocaleDateString()} - {new Date(fechaFin).toLocaleDateString()}
                            ({dashboard.periodo.dias_periodo} días)
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Filtros de Fecha */}
            <div className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-end space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha Inicio
                        </label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha Fin
                        </label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                    <button
                        onClick={aplicarFiltroFechas}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Actualizar Indicadores
                    </button>
                </div>
            </div>

            {/* Navegación de submódulos */}
            {renderSubmoduleNavigation()}

            {/* Contenido del submódulo activo */}
            <div className="min-h-[600px]">
                {renderActiveSubmodule()}
            </div>

            {/* Indicadores Principales de Ventas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Ventas Totales por Tienda */}
                {dashboard.indicadores_ventas.ventas_totales.map((venta) => (
                    <div key={venta.tipo_venta} className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">
                                    Ventas {venta.tipo_venta === 'tienda_fisica' ? 'Tienda Física' : 
                                            venta.tipo_venta === 'online' ? 'Tienda Online' : 
                                            venta.tipo_venta.charAt(0).toUpperCase() + venta.tipo_venta.slice(1)}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(venta.monto_total)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {venta.cantidad_ventas} transacciones
                                </p>
                            </div>
                            <div className="ml-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    {venta.tipo_venta === 'tienda_fisica' ? '🏪' : 
                                     venta.tipo_venta === 'online' ? '🌐' : '🎪'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Crecimiento de Ventas */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">Crecimiento de Ventas</p>
                            <p className={`text-2xl font-bold ${getGrowthColor(dashboard.indicadores_ventas.crecimiento_ventas.porcentaje_crecimiento)}`}>
                                {getGrowthIcon(dashboard.indicadores_ventas.crecimiento_ventas.porcentaje_crecimiento)}
                                {formatPercentage(dashboard.indicadores_ventas.crecimiento_ventas.porcentaje_crecimiento)}
                            </p>
                            <p className="text-sm text-gray-500">
                                vs período anterior
                            </p>
                                                         <p className="text-xs text-gray-400 mt-1">
                                 {formatCurrency(dashboard.indicadores_ventas.crecimiento_ventas.ventas_periodo_actual)} vs {formatCurrency(dashboard.indicadores_ventas.crecimiento_ventas.ventas_periodo_anterior)}
                             </p>
                        </div>
                        <div className="ml-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                📈
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ticket Promedio */}
                {dashboard.indicadores_ventas.ticket_promedio.find(t => t.tipo_venta === 'total') && (
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Ticket Promedio (VMP)</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(dashboard.indicadores_ventas.ticket_promedio.find(t => t.tipo_venta === 'total')?.ticket_promedio || 0)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {dashboard.indicadores_ventas.ticket_promedio.find(t => t.tipo_venta === 'total')?.cantidad_items_promedio.toFixed(1)} items/venta
                                </p>
                            </div>
                            <div className="ml-4">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    🛒
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Detalle de Tickets Promedio por Canal */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Promedio por Canal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dashboard.indicadores_ventas.ticket_promedio.filter(t => t.tipo_venta !== 'total').map((ticket) => (
                        <div key={ticket.tipo_venta} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {ticket.tipo_venta === 'tienda_fisica' ? 'Tienda Física' : 
                                         ticket.tipo_venta === 'online' ? 'Online' : 
                                         ticket.tipo_venta.charAt(0).toUpperCase() + ticket.tipo_venta.slice(1)}
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {formatCurrency(ticket.ticket_promedio)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {ticket.cantidad_items_promedio.toFixed(1)} items/venta
                                    </p>
                                </div>
                                <div className="text-2xl">
                                    {ticket.tipo_venta === 'tienda_fisica' ? '🏪' : 
                                     ticket.tipo_venta === 'online' ? '🌐' : '🎪'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Volumen de Unidades Vendidas */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Volumen de Unidades Vendidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total de unidades */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Total de Unidades</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {dashboard.indicadores_ventas.ventas_por_estilo.reduce((total, estilo) => total + estilo.cantidad_vendida, 0).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Todas las presentaciones
                                </p>
                            </div>
                            <div className="ml-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    📦
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unidades por canal */}
                    <div className="space-y-3">
                        {dashboard.indicadores_ventas.ventas_por_canal.map((canal) => (
                            <div key={canal.canal} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">
                                        {canal.canal === 'Tienda Física' ? '🏪' : 
                                         canal.canal === 'Online' ? '🌐' : '🎪'}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">{canal.canal}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-900">
                                        {canal.cantidad_ventas} ventas
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatPercentage(canal.porcentaje_del_total)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ventas por Estilo de Cerveza */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Estilo de Cerveza</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico de barras */}
                    <div className="space-y-4">
                        {dashboard.indicadores_ventas.ventas_por_estilo.slice(0, 8).map((estilo) => (
                            <div key={estilo.estilo_cerveza} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-900">{estilo.estilo_cerveza}</span>
                                        <span className="text-sm text-gray-500">{formatPercentage(estilo.porcentaje_del_total)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full"
                                            style={{ width: `${estilo.porcentaje_del_total}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="ml-4 text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatCurrency(estilo.monto_total)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {estilo.cantidad_vendida.toLocaleString()} unidades
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabla detallada */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estilo
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unidades
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Monto
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        %
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dashboard.indicadores_ventas.ventas_por_estilo.map((estilo) => (
                                    <tr key={estilo.estilo_cerveza} className="hover:bg-gray-50">
                                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {estilo.estilo_cerveza}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {estilo.cantidad_vendida.toLocaleString()}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(estilo.monto_total)}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatPercentage(estilo.porcentaje_del_total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Tendencia de Ventas */}
            {dashboard.indicadores_ventas.tendencia_ventas.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ventas Diarias</h3>
                    <div className="overflow-x-auto">
                        <div className="flex space-x-1 min-w-full pb-4">
                            {dashboard.indicadores_ventas.tendencia_ventas.map((dia) => (
                                <div key={dia.fecha_venta} className="flex-shrink-0 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="text-xs text-gray-600 mb-1">
                                            {formatCurrency(dia.total_ventas)}
                                        </div>
                                        <div
                                            className="w-6 bg-blue-600 rounded-t"
                                            style={{
                                                height: `${Math.max(20, (dia.total_ventas / Math.max(...dashboard.indicadores_ventas.tendencia_ventas.map(d => d.total_ventas))) * 120)}px`
                                            }}
                                        ></div>
                                        <div className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-top-left">
                                            {new Date(dia.fecha_venta).toLocaleDateString('es-VE', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VentasManagement; 