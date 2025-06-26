/** Componente de gestión de ventas online */
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/auth';

interface VentasWebManagementProps {
    user: Usuario;
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

interface VentaOnline {
    clave: number;
    fecha: string;
    monto_total: number;
    direccion_envio: string;
    lugar_nombre: string;
    tienda_online_nombre: string;
    usuario_nombre: string;
    estado?: string;
}

interface DetalleVentaOnline {
    clave: number;
    cantidad: number;
    precio_unitario: number;
    producto_nombre: string;
    subtotal: number;
}

interface VentaOnlineCompleta {
    venta: VentaOnline;
    cliente: any;
    detalle: DetalleVentaOnline[];
    pagos: any[];
    resumen: {
        total_productos: number;
        total_items: number;
        total_venta: number;
        total_pagado: number;
    };
}

const VentasWebManagement: React.FC<VentasWebManagementProps> = ({
    user,
    canView,
    canCreate,
    canUpdate,
    canDelete
}) => {
    const [ventas, setVentas] = useState<VentaOnline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedVenta, setSelectedVenta] = useState<number | null>(null);
    const [ventaDetalle, setVentaDetalle] = useState<VentaOnlineCompleta | null>(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showEstadisticas, setShowEstadisticas] = useState(true);

    /** Cargar datos iniciales */
    useEffect(() => {
        loadVentas();
    }, []);

    /** Cargar ventas online */
    const loadVentas = async () => {
        try {
            setLoading(true);
            // Datos mock hasta crear el endpoint real
            const mockVentas: VentaOnline[] = [
                {
                    clave: 1,
                    fecha: '2024-01-15T10:30:00',
                    monto_total: 125.50,
                    direccion_envio: 'Av. Principal, Casa #123',
                    lugar_nombre: 'Caracas',
                    tienda_online_nombre: 'ACAUCAB Online',
                    usuario_nombre: 'Juan Pérez',
                    estado: 'Entregado'
                },
                {
                    clave: 2,
                    fecha: '2024-01-14T15:20:00',
                    monto_total: 89.25,
                    direccion_envio: 'Calle Los Mangos, Edificio Torre Sur',
                    lugar_nombre: 'Valencia',
                    tienda_online_nombre: 'ACAUCAB Online',
                    usuario_nombre: 'María García',
                    estado: 'En proceso'
                },
                {
                    clave: 3,
                    fecha: '2024-01-13T09:15:00',
                    monto_total: 200.00,
                    direccion_envio: 'Centro Comercial Los Próceres, Local 45',
                    lugar_nombre: 'Caracas',
                    tienda_online_nombre: 'ACAUCAB Online',
                    usuario_nombre: 'Carlos Rodríguez',
                    estado: 'Pendiente'
                }
            ];
            setVentas(mockVentas);
        } catch (error) {
            console.error('Error cargando ventas:', error);
            setError('Error al cargar las ventas online');
        } finally {
            setLoading(false);
        }
    };

    /** Cargar detalle de venta */
    const loadVentaDetalle = async (ventaId: number) => {
        try {
            setLoadingDetalle(true);
            
            // Mock data para el detalle - en producción esto vendría del endpoint
            const mockDetalle: VentaOnlineCompleta = {
                venta: ventas.find(v => v.clave === ventaId)!,
                cliente: {
                    clave: 1,
                    rif: 'V-12345678',
                    tipo: 'natural',
                    primer_nombre: 'Juan',
                    primer_apellido: 'Pérez',
                    puntos_acumulados: 85
                },
                detalle: [
                    {
                        clave: 1,
                        cantidad: 2,
                        precio_unitario: 25.00,
                        producto_nombre: 'Cerveza IPA Six Pack',
                        subtotal: 50.00
                    },
                    {
                        clave: 2,
                        cantidad: 3,
                        precio_unitario: 25.17,
                        producto_nombre: 'Cerveza Lager Premium',
                        subtotal: 75.50
                    }
                ],
                pagos: [
                    {
                        clave: 1,
                        fecha_pago: '2024-01-15',
                        monto_total: 125.50,
                        metodo_pago: {
                            tipo: 'Pago móvil',
                            moneda: 'USD',
                            banco: 'Banco de Venezuela'
                        }
                    }
                ],
                resumen: {
                    total_productos: 5,
                    total_items: 2,
                    total_venta: 125.50,
                    total_pagado: 125.50
                }
            };
            
            setVentaDetalle(mockDetalle);
            setSelectedVenta(ventaId);
        } catch (error) {
            setError('Error al cargar el detalle de la venta');
        } finally {
            setLoadingDetalle(false);
        }
    };

    /** Formatear monto */
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    /** Formatear fecha */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /** Filtrar ventas */
    const filteredVentas = ventas.filter(venta => {
        const matchesSearch = venta.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            venta.clave.toString().includes(searchTerm);
        const matchesDate = !filterDate || venta.fecha.startsWith(filterDate);
        return matchesSearch && matchesDate;
    });

    /** Calcular estadísticas */
    const stats = {
        totalVentas: ventas.length,
        ventasHoy: ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString()).length,
        montoTotal: ventas.reduce((sum, v) => sum + v.monto_total, 0),
        promedioVenta: ventas.length > 0 ? ventas.reduce((sum, v) => sum + v.monto_total, 0) / ventas.length : 0
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!canView) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
                <p className="text-red-700">No tiene permisos para ver las ventas online.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Ventas Online</h2>
                <p className="text-gray-600">Gestión de ventas a través de tienda online</p>
            </div>

            {/* Estadísticas */}
            {showEstadisticas && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Total Ventas</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalVentas}</p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Ventas Hoy</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.ventasHoy}</p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Monto Total</p>
                                <p className="text-2xl font-bold text-green-600">{formatAmount(stats.montoTotal)}</p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Promedio</p>
                                <p className="text-2xl font-bold text-purple-600">{formatAmount(stats.promedioVenta)}</p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Controles */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Buscar por cliente o #venta..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => setShowEstadisticas(!showEstadisticas)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        {showEstadisticas ? 'Ocultar' : 'Mostrar'} Estadísticas
                    </button>
                </div>
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Tabla de ventas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Listado de Ventas Online
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    #Venta
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha/Hora
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dirección
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredVentas.map((venta) => (
                                <tr key={venta.clave} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{venta.clave.toString().padStart(6, '0')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(venta.fecha)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {venta.usuario_nombre}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                        {venta.direccion_envio}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatAmount(venta.monto_total)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            venta.estado === 'Entregado' 
                                                ? 'bg-green-100 text-green-800'
                                                : venta.estado === 'En proceso'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {venta.estado || 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => loadVentaDetalle(venta.clave)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Ver Detalle
                                        </button>
                                        {canDelete && (
                                            <button 
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => {
                                                    if (confirm('¿Está seguro de que desea eliminar esta venta?')) {
                                                        console.log(`Eliminar venta ${venta.clave}`);
                                                    }
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredVentas.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No se encontraron ventas con los filtros aplicados</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de detalle de venta */}
            {selectedVenta && ventaDetalle && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 print:!bg-transparent print:!p-0 print:!items-start">
                    {/* Estilos para impresión */}
                    <style>{`
                        @media print {
                            body * { visibility: hidden !important; }
                            .modal-factura, .modal-factura * { visibility: visible !important; }
                            .modal-factura { position: absolute !important; left: 0; top: 0; width: 100vw !important; min-height: 100vh !important; background: white !important; box-shadow: none !important; z-index: 9999 !important; }
                        }
                    `}</style>
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-factura">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Detalle de Venta Online #{selectedVenta.toString().padStart(6, '0')}
                                    </h3>
                                    <p className="text-gray-600">
                                        {formatDate(ventaDetalle.venta.fecha)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedVenta(null);
                                        setVentaDetalle(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 print:hidden"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {loadingDetalle ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Información del cliente */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Información del Cliente</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Nombre:</span>
                                                <span className="ml-2 font-medium">{ventaDetalle.cliente.primer_nombre} {ventaDetalle.cliente.primer_apellido}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">RIF/CI:</span>
                                                <span className="ml-2 font-medium">{ventaDetalle.cliente.rif}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Tipo:</span>
                                                <span className="ml-2 font-medium capitalize">{ventaDetalle.cliente.tipo}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Dirección de Envío:</span>
                                                <span className="ml-2 font-medium">{ventaDetalle.venta.direccion_envio}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Productos */}
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Productos Vendidos</h4>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">P.Unitario</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {ventaDetalle.detalle.map((item) => (
                                                    <tr key={item.clave}>
                                                        <td className="px-4 py-2 text-sm">{item.producto_nombre}</td>
                                                        <td className="px-4 py-2 text-sm text-center">{item.cantidad}</td>
                                                        <td className="px-4 py-2 text-sm text-right">{formatAmount(item.precio_unitario)}</td>
                                                        <td className="px-4 py-2 text-sm text-right font-medium">{formatAmount(item.subtotal)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagos */}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Información de Pago</h4>
                                        {ventaDetalle.pagos.map((pago) => (
                                            <div key={pago.clave} className="text-sm">
                                                <p>
                                                    <span className="text-gray-600">Método:</span>
                                                    <span className="ml-2 font-medium">{pago.metodo_pago.tipo}</span>
                                                </p>
                                                <p>
                                                    <span className="text-gray-600">Moneda:</span>
                                                    <span className="ml-2 font-medium">{pago.metodo_pago.moneda}</span>
                                                </p>
                                                {pago.metodo_pago.banco && (
                                                    <p>
                                                        <span className="text-gray-600">Banco:</span>
                                                        <span className="ml-2 font-medium">{pago.metodo_pago.banco}</span>
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Resumen */}
                                    <div className="border-t pt-4">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Productos:</span>
                                                <span className="font-medium">{ventaDetalle.resumen.total_productos}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Total Venta:</span>
                                                <span className="text-blue-600">{formatAmount(ventaDetalle.resumen.total_venta)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t">
                                        <button
                                            onClick={() => {
                                                setSelectedVenta(null);
                                                setVentaDetalle(null);
                                            }}
                                            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors print:hidden"
                                        >
                                            Cerrar
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors print:hidden"
                                            onClick={() => window.print()}
                                        >
                                            Imprimir Factura
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VentasWebManagement; 