import React, { useState, useEffect } from 'react';
import { dashboardService, type DashboardCompleto } from '../../services/dashboardService';

const DashboardAvanzado: React.FC = () => {
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

    const safeFormatCurrency = (value: any) => {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(0);
        }
        return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(num);
    };

    const formatPercentage = (value: any) => {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return '0.0%';
        }
        return `${num.toFixed(1)}%`;
    };

    const formatDecimal = (value: any) => {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return '0.0';
        }
        return num.toFixed(1);
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

            {dashboard.indicadores_ventas.ventas_totales && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        {safeFormatCurrency(venta.monto_total)}
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
                    {dashboard.indicadores_ventas.crecimiento_ventas && (
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
                                </div>
                                <div className="ml-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        📈
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {dashboard.indicadores_ventas.ticket_promedio?.find(t => t.tipo_venta === 'total') && (
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">Ticket Promedio (VMP)</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {safeFormatCurrency(dashboard.indicadores_ventas.ticket_promedio.find(t => t.tipo_venta === 'total')?.ticket_promedio || 0)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDecimal(dashboard.indicadores_ventas.ticket_promedio.find(t => t.tipo_venta === 'total')?.cantidad_items_promedio)} items/venta
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
            )}
            
            {dashboard.indicadores_ventas.ticket_promedio && (
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Promedio por Canal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {dashboard.indicadores_ventas.ticket_promedio.filter(t => t.tipo_venta !== 'total').map((ticket) => (
                            <div key={`ticket-${ticket.tipo_venta}`} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {ticket.tipo_venta === 'tienda_fisica' ? 'Tienda Física' : 
                                             ticket.tipo_venta === 'online' ? 'Online' : 
                                             ticket.tipo_venta.charAt(0).toUpperCase() + ticket.tipo_venta.slice(1)}
                                        </p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {safeFormatCurrency(ticket.ticket_promedio)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDecimal(ticket.cantidad_items_promedio)} items/venta
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
            )}

            {dashboard.indicadores_ventas.volumen_unidades && (
                 <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Volumen de Unidades Vendidas</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Total de Unidades</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {dashboard.indicadores_ventas.volumen_unidades.reduce((total, item) => total + item.unidades_vendidas, 0).toLocaleString()}
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
                </div>
            )}

            {/* Tendencia de Ventas */}
            {dashboard.indicadores_ventas.tendencia_ventas && dashboard.indicadores_ventas.tendencia_ventas.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow border col-span-1 md:col-span-2 lg:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ventas Diarias</h3>
                    <div className="overflow-x-auto">
                        <div className="flex items-end space-x-1 min-w-full pb-4 pt-4">
                            {dashboard.indicadores_ventas.tendencia_ventas.map((dia) => {
                                const ventasNumericas = dashboard.indicadores_ventas.tendencia_ventas.map(d => parseFloat(d.total_ventas as any) || 0);
                                const maxVentas = Math.max(...ventasNumericas);
                                const valorActual = parseFloat(dia.total_ventas as any) || 0;
                                const altura = maxVentas > 0 ? (valorActual / maxVentas) * 120 : 0;

                                return (
                                    <div key={`tendencia-${dia.fecha_venta}`} className="flex-shrink-0 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="text-xs text-gray-600 mb-1">
                                                {safeFormatCurrency(dia.total_ventas)}
                                            </div>
                                            <div
                                                className="w-6 bg-blue-600 rounded-t"
                                                style={{ height: `${Math.max(10, altura)}px` }}
                                                title={safeFormatCurrency(dia.total_ventas)}
                                            ></div>
                                            <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-center">
                                                {new Date(dia.fecha_venta).toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Ventas por Estilo de Cerveza */}
            {dashboard.indicadores_ventas.ventas_por_estilo && (
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Estilo de Cerveza</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Gráfico de barras */}
                        <div className="space-y-4">
                            {dashboard.indicadores_ventas.ventas_por_estilo.slice(0, 8).map((estilo) => (
                                <div key={`bar-${estilo.estilo_cerveza}`} className="flex items-center justify-between">
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
                                            {safeFormatCurrency(estilo.monto_total)}
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
                                            % de ganancias totales
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dashboard.indicadores_ventas.ventas_por_estilo.map((estilo) => (
                                        <tr key={`table-row-${estilo.estilo_cerveza}`} className="hover:bg-gray-50">
                                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {estilo.estilo_cerveza}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {estilo.cantidad_vendida.toLocaleString()}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {safeFormatCurrency(estilo.monto_total)}
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
            )}

            {/* Ventas por Canal */}
            {dashboard.indicadores_ventas.ventas_por_canal && (
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Canal de Distribución</h3>
                    <div className="space-y-4">
                        {dashboard.indicadores_ventas.ventas_por_canal.map((canal) => (
                            <div key={`canal-${canal.canal}`} className="flex items-center">
                                <span className="w-24 text-sm font-medium text-gray-600">{canal.canal}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-green-500 h-4 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold"
                                        style={{ width: `${canal.porcentaje_del_total}%` }}
                                    >
                                       {formatPercentage(canal.porcentaje_del_total)}
                                    </div>
                                </div>
                                <span className="w-28 text-right text-sm font-semibold text-gray-800 ml-2">{safeFormatCurrency(canal.monto_total)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reporte de Inventario Actual */}
            {dashboard.indicadores_inventario && dashboard.indicadores_inventario.inventario_actual && (
                <div className="bg-white p-6 rounded-lg shadow border col-span-1 md:col-span-2 lg:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporte de Inventario Actual</h3>
                    <div className="overflow-x-auto max-h-96">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Inventario</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dashboard.indicadores_inventario.inventario_actual.map((item, index) => (
                                    <tr key={`inv-${item.presentacion_id}-${index}`}>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.presentacion_nombre}</div>
                                            <div className="text-sm text-gray-500">{item.cerveza_nombre}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.tipo_cerveza}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{item.stock_actual.toLocaleString()}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{safeFormatCurrency(item.valor_inventario)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.estado_stock === 'En Stock' ? 'bg-green-100 text-green-800' :
                                                item.estado_stock === 'Bajo Stock' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {item.estado_stock}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardAvanzado; 