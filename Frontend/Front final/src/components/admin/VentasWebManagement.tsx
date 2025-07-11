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

interface EstadoVenta {
    clave: number;
    estado: string;
}

interface DetalleVentaOnline {
    clave: number;
    cantidad: number;
    precio_unitario: number;
    producto_nombre: string;
    subtotal: number;
}

interface VentaOnlineCompleta {
    venta: VentaOnline & {
        nombre_cliente: string;
        cliente_tipo: 'natural' | 'juridico' | null;
        rif: string | null;
        ci: string | null;
        email: string | null;
        puntos_acumulados: number | null;
    };
    detalle: DetalleVentaOnline[];
    pagos: any[];
    resumen: {
        total_productos: number;
        total_items: number;
        total_venta: number;
        total_pagado: number;
        puntos_otorgados: number;
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
    const [estados, setEstados] = useState<EstadoVenta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingVenta, setEditingVenta] = useState<VentaOnline | null>(null);
    const [selectedVenta, setSelectedVenta] = useState<number | null>(null);
    const [ventaDetalle, setVentaDetalle] = useState<VentaOnlineCompleta | null>(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [newVenta, setNewVenta] = useState({
        monto_total: '',
        direccion_envio: '',
        fk_lugar: '',
        fk_tienda_online: '',
        fk_usuario: ''
    });

    // --- CÁLCULOS PARA EL RESUMEN ---
    const totalVentas = ventas.reduce((acc, venta) => acc + venta.monto_total, 0);
    const promedioVenta = ventas.length > 0 ? totalVentas / ventas.length : 0;
    // --- FIN DE CÁLCULOS ---

    /** Cargar datos iniciales */
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadVentas(),
                loadEstados()
            ]);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    /** Cargar ventas online */
    const loadVentas = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/ecommerce/ventas');
            if (!response.ok) {
                throw new Error('Error al cargar las ventas desde la API');
            }
            const result = await response.json();
            if (result.success) {
                // Mapeo de los datos del backend a la interfaz del frontend
                const mappedVentas = result.data.map((v: any) => ({
                    clave: v.clave_venta,
                    fecha: v.fecha_venta,
                    monto_total: Number(v.monto_total_venta), // Aseguramos que sea un número
                    usuario_nombre: v.nombre_cliente,
                    estado: v.estado_actual,
                    direccion_envio: '',
                    lugar_nombre: '',
                    tienda_online_nombre: ''
                }));
                setVentas(mappedVentas);
            } else {
                throw new Error(result.message || 'Error en la respuesta de la API');
            }
        } catch (error) {
            console.error('Error cargando ventas:', error);
            setError('Error al cargar las ventas online');
        } finally {
            setLoading(false);
        }
    };

    /** Cargar estados de venta */
    const loadEstados = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/estados?tipo=venta_online');
            if (!response.ok) throw new Error('Error al cargar estados');
            
            const data = await response.json();
            setEstados(data);
        } catch (error) {
            console.error('Error cargando estados:', error);
            // No es crítico si no se pueden cargar los estados
        }
    };

    /** Cargar detalle de venta online */
    const loadVentaDetalle = async (ventaId: number) => {
        try {
            setLoadingDetalle(true);
            setSelectedVenta(ventaId);
            
            const response = await fetch(`http://localhost:5000/api/ecommerce/ventas/${ventaId}`);
            if (!response.ok) {
                throw new Error('Error al cargar el detalle de la venta desde la API');
            }
            
            const result = await response.json();

            if (result.success && result.venta) {
                const ventaCompleta = result.venta;

                // Manejo seguro de arrays que pueden ser nulos
                const detalleItems = ventaCompleta.detalle || [];
                const pagoItems = ventaCompleta.pagos || [];

                // Se calcula el resumen en el frontend para evitar errores
                const resumenCalculado = {
                    total_productos: detalleItems.length,
                    total_items: detalleItems.reduce((acc, item) => acc + (item.cantidad || 0), 0),
                    total_venta: Number(ventaCompleta.venta.monto_total || 0),
                    total_pagado: pagoItems.reduce((acc, pago) => acc + Number(pago.monto || 0), 0),
                    puntos_otorgados: Math.floor(Number(ventaCompleta.venta.monto_total || 0) / 10)
                };

                const mappedDetalle: VentaOnlineCompleta = {
                    venta: {
                        ...ventaCompleta.venta,
                        monto_total: Number(ventaCompleta.venta.monto_total),
                    },
                    detalle: detalleItems.map((d: any) => ({ ...d, subtotal: (d.cantidad || 0) * (d.precio_unitario || 0) })),
                    pagos: pagoItems,
                    resumen: resumenCalculado,
                };

                setVentaDetalle(mappedDetalle);
            } else {
                throw new Error(result.message || 'La API no devolvió una respuesta exitosa o no contenía datos de la venta');
            }
        } catch (error) {
            console.error('Error cargando detalle de venta:', error);
            setError('Error al cargar el detalle de la venta');
        } finally {
            setLoadingDetalle(false);
        }
    };

    /** Crear nueva venta */
    const handleCreateVenta = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/ventas-online', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newVenta,
                    monto_total: parseFloat(newVenta.monto_total),
                    fk_lugar: parseInt(newVenta.fk_lugar),
                    fk_tienda_online: parseInt(newVenta.fk_tienda_online),
                    fk_usuario: parseInt(newVenta.fk_usuario)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear venta');
            }

            await loadVentas();
            setShowCreateForm(false);
            setNewVenta({
                monto_total: '',
                direccion_envio: '',
                fk_lugar: '',
                fk_tienda_online: '',
                fk_usuario: ''
            });
            setError('');
        } catch (error: any) {
            setError(error.message);
        }
    };

    /** Editar venta */
    const handleUpdateVenta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVenta) return;

        try {
            const response = await fetch(`http://localhost:5000/api/ventas-online/${editingVenta.clave}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    monto_total: editingVenta.monto_total,
                    direccion_envio: editingVenta.direccion_envio
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar venta');
            }

            await loadVentas();
            setEditingVenta(null);
            setError('');
        } catch (error: any) {
            setError(error.message);
        }
    };

    /** Eliminar venta */
    const handleDeleteVenta = async (ventaId: number) => {
        if (!confirm('¿Está seguro de que desea eliminar esta venta?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/ventas-online/${ventaId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar venta');
            }

            await loadVentas();
            setError('');
        } catch (error: any) {
            setError(error.message);
        }
    };

    /** Formatear fecha */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    /** Formatear monto */
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Ventas Online</h2>
                    <p className="text-gray-600">Gestión de ventas a través de tienda online</p>
                </div>
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                    <button onClick={() => setError('')} className="mt-2 text-red-600 hover:text-red-800 underline">
                        Cerrar
                    </button>
                </div>
            )}

            {/* --- RESUMEN DE VENTAS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500">Total de Ventas</h3>
                    <p className="text-2xl font-bold text-gray-900">{ventas.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500">Monto Total</h3>
                    <p className="text-2xl font-bold text-green-600">{formatAmount(totalVentas)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500">Promedio por Venta</h3>
                    <p className="text-2xl font-bold text-purple-600">{formatAmount(promedioVenta)}</p>
                </div>
            </div>

            {/* Formulario de creación */}
            {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-lg font-semibold mb-4">Nueva Venta Online</h3>
                    <form onSubmit={handleCreateVenta} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Monto Total
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={newVenta.monto_total}
                                    onChange={(e) => setNewVenta({...newVenta, monto_total: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Dirección de Envío
                                </label>
                                <input
                                    type="text"
                                    value={newVenta.direccion_envio}
                                    onChange={(e) => setNewVenta({...newVenta, direccion_envio: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Dirección completa"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Crear Venta
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabla de ventas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {ventas.map((venta) => (
                                <tr key={venta.clave} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta.clave}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(venta.fecha)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatAmount(venta.monto_total)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.usuario_nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            venta.estado === 'Entregado' ? 'bg-green-100 text-green-800' :
                                            venta.estado === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                                            venta.estado === 'Cancelado' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {venta.estado || 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => loadVentaDetalle(venta.clave)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Ver Detalle
                                        </button>
                                        {canDelete && (
                                            <button 
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDeleteVenta(venta.clave)}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {ventas.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No se encontraron ventas online.</p>
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
                                                <span className="ml-2 font-medium">{ventaDetalle.venta.nombre_cliente || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Documento:</span>
                                                <span className="ml-2 font-medium">
                                                    {ventaDetalle.venta.cliente_tipo === 'natural' 
                                                        ? `CI: ${ventaDetalle.venta.ci || 'N/A'}` 
                                                        : `RIF: ${ventaDetalle.venta.rif || 'N/A'}`}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Email:</span>
                                                <span className="ml-2 font-medium">{ventaDetalle.venta.email || 'No registrado'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Puntos Acumulados:</span>
                                                <span className="ml-2 font-medium text-yellow-600">{ventaDetalle.venta.puntos_acumulados || 0} ⭐</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información de envío */}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Información de Envío</h4>
                                        <div className="text-sm">
                                            <p>
                                                <span className="text-gray-600">Dirección:</span>
                                                <span className="ml-2 font-medium">{ventaDetalle.venta.direccion_envio}</span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Ciudad:</span>
                                                <span className="ml-2 font-medium">{ventaDetalle.venta.lugar_nombre}</span>
                                            </p>
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
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Información de Pago</h4>
                                        {ventaDetalle.pagos.map((pago) => (
                                            <div key={pago.clave} className="text-sm">
                                                <p>
                                                    <span className="text-gray-600">Método:</span>
                                                    <span className="ml-2 font-medium">{pago.metodo_tipo}</span>
                                                </p>
                                                <p>
                                                    <span className="text-gray-600">Moneda:</span>
                                                    <span className="ml-2 font-medium">{pago.moneda}</span>
                                                </p>
                                                {pago.banco && (
                                                    <p>
                                                        <span className="text-gray-600">Banco:</span>
                                                        <span className="ml-2 font-medium">{pago.banco}</span>
                                                    </p>
                                                )}
                                                {pago.numero_tarjeta && (
                                                    <p>
                                                        <span className="text-gray-600">Tarjeta:</span>
                                                        <span className="ml-2 font-medium">{pago.numero_tarjeta}</span>
                                                    </p>
                                                )}
                                                <p>
                                                    <span className="text-gray-600">Monto:</span>
                                                    <span className="ml-2 font-medium">{formatAmount(pago.monto_total)}</span>
                                                </p>
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
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Items:</span>
                                                <span className="font-medium">{ventaDetalle.resumen.total_items}</span>
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
                                            onClick={() => window.print()}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors print:hidden"
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