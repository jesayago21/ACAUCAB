/** Componente de gestión de ventas en tienda física */
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/auth';

interface VentasTiendaManagementProps {
    user: Usuario;
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

interface VentaTienda {
    clave: number;
    fecha: string;
    total_venta: number;
    tienda_fisica_nombre: string;
    cliente_nombre: string;
    productos_cantidad: number;
    metodo_pago: string;
    puntos_otorgados: number;
}

interface DetalleVenta {
    clave: number;
    cantidad: number;
    precio_unitario: number;
    producto_nombre: string;
    subtotal: number;
}

interface VentaCompleta {
    venta: VentaTienda;
    cliente: any;
    detalle: DetalleVenta[];
    pagos: any[];
    resumen: {
        total_productos: number;
        total_items: number;
        total_venta: number;
        total_pagado: number;
        puntos_otorgados: number;
    };
}

const VentasTiendaManagement: React.FC<VentasTiendaManagementProps> = ({
    user,
    canView,
    canCreate,
    canUpdate,
    canDelete
}) => {
    const [ventas, setVentas] = useState<VentaTienda[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedVenta, setSelectedVenta] = useState<number | null>(null);
    const [ventaDetalle, setVentaDetalle] = useState<VentaCompleta | null>(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showEstadisticas, setShowEstadisticas] = useState(true);

    /** Cargar datos iniciales */
    useEffect(() => {
        loadVentas();
    }, []);

    /** Cargar ventas de tienda física */
    const loadVentas = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch('http://localhost:5000/api/shop/ventas-tienda');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cargar las ventas desde la API');
            }
            const result = await response.json();
            if (result.success) {
                const mappedVentas = result.data.map((v: any) => ({
                    clave: v.clave_venta,
                    fecha: v.fecha_venta,
                    total_venta: Number(v.monto_total_venta),
                    tienda_fisica_nombre: v.nombre_tienda,
                    cliente_nombre: v.nombre_cliente,
                    productos_cantidad: Number(v.cantidad_productos),
                    metodo_pago: v.metodo_pago_principal,
                    puntos_otorgados: Math.floor(Number(v.monto_total_venta) / 10)
                }));
                setVentas(mappedVentas);
            } else {
                throw new Error(result.message || 'La API no devolvió una respuesta exitosa');
            }
        } catch (error: any) {
            setError(`Error al cargar las ventas de tienda: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    /** Cargar detalle de venta */
    const loadVentaDetalle = async (ventaId: number) => {
        // Limpiar estado anterior y mostrar loading
        setVentaDetalle(null);
        setLoadingDetalle(true);
        setSelectedVenta(ventaId);
        setError('');

        try {
            const response = await fetch(`http://localhost:5000/api/shop/venta-completa/${ventaId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cargar el detalle desde la API');
            }
            
            const result = await response.json();
            
            if (result.success && result.data) {
                const ventaCompleta = result.data;

                // Calcular resumen en el frontend
                const detalleItems = ventaCompleta.detalle || [];
                const pagosItems = ventaCompleta.pagos || [];
                const resumenCalculado = {
                    total_productos: detalleItems.length,
                    total_items: detalleItems.reduce((acc, item) => acc + (item.cantidad || 0), 0),
                    total_venta: Number(ventaCompleta.venta?.total_venta || 0),
                    total_pagado: pagosItems.reduce((acc, pago) => acc + Number(pago.monto || 0), 0),
                    puntos_otorgados: Math.floor(Number(ventaCompleta.venta?.total_venta || 0) / 10)
                };

                const mappedDetalle: VentaCompleta = {
                    venta: ventaCompleta.venta,
                    cliente: ventaCompleta.cliente,
                    detalle: detalleItems.map(d => ({...d, subtotal: (d.cantidad || 0) * (d.precio_unitario || 0)})),
                    pagos: pagosItems,
                    resumen: resumenCalculado,
                };

                setVentaDetalle(mappedDetalle);
            } else {
                throw new Error(result.message || 'La API no devolvió una respuesta exitosa');
            }
        } catch (error: any) {
            setError(`Error al cargar el detalle de la venta: ${error.message}`);
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
        const matchesSearch = venta.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            venta.clave.toString().includes(searchTerm);
        const matchesDate = !filterDate || venta.fecha.startsWith(filterDate);
        return matchesSearch && matchesDate;
    });

    /** Calcular estadísticas */
    const stats = {
        totalVentas: ventas.length,
        ventasHoy: ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString()).length,
        montoTotal: ventas.reduce((sum, v) => sum + v.total_venta, 0),
        puntosOtorgados: ventas.reduce((sum, v) => sum + v.puntos_otorgados, 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!canView) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
                <p className="text-red-700">No tiene permisos para ver las ventas en tienda.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Ventas en Tienda Física</h2>
                <p className="text-gray-600">Gestión de ventas presenciales con sistema de puntos</p>
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
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <p className="text-sm font-medium text-gray-500">Puntos Otorgados</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.puntosOtorgados}</p>
                            </div>
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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
                        className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    <button
                        onClick={() => setShowEstadisticas(!showEstadisticas)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        {showEstadisticas ? 'Ocultar' : 'Mostrar'} Estadísticas
                    </button>
                </div>
                {canCreate && (
                    <button  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                        <span className="mr-2">+</span>
                        Nueva Venta
                    </button>
                )}
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
                        Listado de Ventas - Tienda Física ID 1
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
                                    Productos
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Método Pago
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Puntos
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
                                            {venta.cliente_nombre}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {venta.productos_cantidad} producto(s)
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatAmount(venta.total_venta)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <span className={`h-2.5 w-2.5 rounded-full mr-2 ${
                                                (venta.metodo_pago || '').includes('Tarjeta') ? 'bg-blue-500' :
                                                (venta.metodo_pago || '').includes('Efectivo') ? 'bg-green-500' :
                                                (venta.metodo_pago || '').includes('Puntos') ? 'bg-yellow-500' :
                                                'bg-gray-400'
                                            }`}></span>
                                            {venta.metodo_pago || 'No definido'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {venta.puntos_otorgados > 0 ? (
                                            <span className="text-yellow-600 font-medium">
                                                +{venta.puntos_otorgados} ⭐
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => loadVentaDetalle(venta.clave)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Ver Detalle
                                        </button>
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
                                        Detalle de Venta #{selectedVenta.toString().padStart(6, '0')}
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
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
                                                <span className="text-gray-600">RIF:</span>
                                                <span className="ml-2 font-medium">{ventaDetalle.cliente.rif}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Tipo:</span>
                                                <span className="ml-2 font-medium capitalize">{ventaDetalle.cliente.tipo}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Puntos Acumulados:</span>
                                                <span className="ml-2 font-medium text-yellow-600">{ventaDetalle.cliente.puntos_acumulados} ⭐</span>
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
                                                <span className="text-green-600">{formatAmount(ventaDetalle.resumen.total_venta)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Puntos Otorgados:</span>
                                                <span className="font-medium text-yellow-600">+{ventaDetalle.resumen.puntos_otorgados} ⭐</span>
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

export default VentasTiendaManagement; 