import { useState, useEffect } from 'react';
import { dashboardService, type DashboardCompleto } from '../../services/dashboardService';

interface DashboardAvanzadoProps {
  onClose?: () => void;
}

export default function DashboardAvanzado({ onClose }: DashboardAvanzadoProps) {
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
      setError(err instanceof Error ? err.message : 'Error al cargar dashboard');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltroFechas = () => {
    loadDashboard();
  };

  const formatCurrency = (value: any) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2,
    }).format(isNaN(num) ? 0 : num);
  };

  const formatPercentage = (value: any) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.0%';
    return `${num.toFixed(1)}%`;
  };

  const getGrowthColor = (value: any) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'text-gray-600';
    if (num > 0) return 'text-green-600';
    if (num < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (value: any) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '➡️';
    if (num > 0) return '↗️';
    if (num < 0) return '↘️';
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
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Avanzado</h2>
          <p className="text-gray-600">
            Período: {new Date(fechaInicio).toLocaleDateString()} - {new Date(fechaFin).toLocaleDateString()}
            ({dashboard.periodo.dias_periodo} días)
          </p>
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
            Actualizar
          </button>
        </div>
      </div>

      {/* Indicadores Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ventas Totales */}
        {dashboard.indicadores_ventas.ventas_totales.map((venta) => (
          <div key={venta.tipo_venta} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 capitalize">
                  Ventas {venta.tipo_venta}
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
                  💰
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Crecimiento */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Crecimiento</p>
              <p className={`text-2xl font-bold ${getGrowthColor(dashboard.indicadores_ventas.crecimiento_ventas.porcentaje_crecimiento)}`}>
                {getGrowthIcon(dashboard.indicadores_ventas.crecimiento_ventas.porcentaje_crecimiento)}
                {formatPercentage(dashboard.indicadores_ventas.crecimiento_ventas.porcentaje_crecimiento)}
              </p>
              <p className="text-sm text-gray-500">
                vs período anterior
              </p>
            </div>
          </div>
        </div>

        {/* Ticket Promedio */}
        {dashboard.indicadores_ventas.ticket_promedio.find(t => t.tipo_venta === 'total') && (
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboard.indicadores_ventas.ticket_promedio.find(t => t.tipo_venta === 'total')?.ticket_promedio || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  {parseFloat(String(dashboard.indicadores_ventas.ticket_promedio.find(t => t.tipo_venta === 'total')?.cantidad_items_promedio) || '0').toFixed(1)} items/venta
                </p>
              </div>
              <div className="ml-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  🛒
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasa de Retención */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Retención de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(dashboard.indicadores_clientes.tasa_retencion.tasa_retencion)}
              </p>
              <p className="text-sm text-gray-500">
                {dashboard.indicadores_clientes.tasa_retencion.clientes_retenidos} de {dashboard.indicadores_clientes.tasa_retencion.clientes_inicio_periodo}
              </p>
            </div>
            <div className="ml-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                👥
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y Tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por Estilo de Cerveza */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Estilo de Cerveza</h3>
          <div className="space-y-3">
            {dashboard.indicadores_ventas.ventas_por_estilo.slice(0, 5).map((estilo) => (
              <div key={estilo.estilo_cerveza} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{estilo.estilo_cerveza}</span>
                    <span className="text-sm text-gray-500">{formatPercentage(estilo.porcentaje_del_total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${estilo.porcentaje_del_total}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(estilo.monto_total)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {estilo.cantidad_vendida} unidades
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clientes Nuevos vs Recurrentes */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes Nuevos vs Recurrentes</h3>
          <div className="space-y-4">
            {dashboard.indicadores_clientes.clientes_nuevos_vs_recurrentes.map((tipo) => (
              <div key={tipo.tipo_cliente} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${tipo.tipo_cliente === 'nuevo' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {tipo.tipo_cliente === 'nuevo' ? 'Nuevos' : 'Recurrentes'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {tipo.cantidad}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage(tipo.porcentaje)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ventas por Canal */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Canal</h3>
          <div className="space-y-3">
            {dashboard.indicadores_ventas.ventas_por_canal.map((canal) => (
              <div key={canal.canal} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{canal.canal}</span>
                    <span className="text-sm text-gray-500">{formatPercentage(canal.porcentaje_del_total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${canal.porcentaje_del_total}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(canal.monto_total)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {canal.cantidad_ventas} ventas
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores de Inventario */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores de Inventario</h3>
          <div className="space-y-4">
            {dashboard.indicadores_inventario.rotacion_inventario.map((rotacion) => (
              <div key={rotacion.tipo_inventario} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {rotacion.tipo_inventario}
                  </span>
                  <span className="text-sm text-gray-500">
                    {parseFloat(String(rotacion.rotacion_inventario) || '0').toFixed(2)}x rotación
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <span>Valor Promedio:</span>
                    <div className="font-medium">{formatCurrency(rotacion.valor_promedio_inventario)}</div>
                  </div>
                  <div>
                    <span>Días Inventario:</span>
                    <div className="font-medium">{rotacion.dias_inventario} días</div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Tasa de Ruptura */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Tasa de Ruptura de Stock</h4>
              {dashboard.indicadores_inventario.tasa_ruptura_stock.map((ruptura) => (
                <div key={ruptura.tipo_inventario} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{ruptura.tipo_inventario}:</span>
                  <span className={`text-sm font-medium ${ruptura.tasa_ruptura > 10 ? 'text-red-600' : ruptura.tasa_ruptura > 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {formatPercentage(ruptura.tasa_ruptura)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tendencia de Ventas */}
      {dashboard.indicadores_ventas.tendencia_ventas.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ventas</h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-2 min-w-full">
              {dashboard.indicadores_ventas.tendencia_ventas.map((dia) => (
                <div key={dia.fecha_venta} className="flex-shrink-0 text-center">
                  <div
                    className="w-8 bg-blue-600 rounded-t"
                    style={{
                      height: `${Math.max(20, (parseFloat(String(dia.total_ventas) || '0') / Math.max(1, ...dashboard.indicadores_ventas.tendencia_ventas.map(d => parseFloat(String(d.total_ventas) || '0')))) * 100)}px`
                    }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-top-left">
                    {new Date(dia.fecha_venta).toLocaleDateString('es-VE', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mejores Productos */}
      {dashboard.indicadores_ventas.mejores_productos && dashboard.indicadores_ventas.mejores_productos.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Mejores Productos por Ingresos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboard.indicadores_ventas.mejores_productos.map((producto) => (
                  <tr key={producto.producto_nombre} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {producto.producto_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {producto.productor_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {producto.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {producto.unidades_vendidas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(producto.ingresos_generados)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPercentage(producto.porcentaje_del_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventario Actual */}
      {dashboard.indicadores_inventario.inventario_actual && dashboard.indicadores_inventario.inventario_actual.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Estado Actual del Inventario</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presentación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboard.indicadores_inventario.inventario_actual.slice(0, 10).map((item) => (
                  <tr key={`${item.tipo_inventario}-${item.presentacion_id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.cerveza_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.presentacion_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.tipo_cerveza}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.stock_actual}
                      {item.stock_actual <= 20 && (
                        <span className="ml-2 text-red-500" title="Stock bajo">⚠️</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.valor_inventario)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.estado_stock === 'Sin Stock' ? 'bg-red-100 text-red-800' :
                        item.estado_stock === 'Stock Bajo' ? 'bg-yellow-100 text-yellow-800' :
                        item.estado_stock === 'Stock Normal' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
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

      {/* Top Empleados */}
      {dashboard.indicadores_operaciones.ventas_por_empleado.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Empleados por Ventas</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tienda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ventas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboard.indicadores_operaciones.ventas_por_empleado.slice(0, 10).map((empleado) => (
                  <tr key={empleado.empleado_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {empleado.empleado_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {empleado.cargo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {empleado.tienda}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {empleado.cantidad_ventas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(empleado.monto_total_ventas)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(empleado.ticket_promedio)}
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
} 