/** Componente de gestión de compras mayoristas y órdenes de compra */
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/auth';

interface ComprasManagementProps {
    user: Usuario;
}

interface OrdenCompra {
    clave: number;
    fecha: string;
    monto_total: number;
    proveedor_nombre: string;
    estado: string;
    productos_cantidad: number;
    fecha_entrega_estimada?: string;
    observaciones?: string;
}

type EstadoOrden = 'emitida' | 'aprobada' | 'rechazada' | 'en_proceso' | 'mercancia_recibida' | 'pagada' | 'completada';

const estadosConfig = {
    emitida: { color: 'bg-blue-100 text-blue-800', label: 'Emitida' },
    aprobada: { color: 'bg-green-100 text-green-800', label: 'Aprobada' },
    rechazada: { color: 'bg-red-100 text-red-800', label: 'Rechazada' },
    en_proceso: { color: 'bg-yellow-100 text-yellow-800', label: 'En Proceso' },
    mercancia_recibida: { color: 'bg-purple-100 text-purple-800', label: 'Mercancía Recibida' },
    pagada: { color: 'bg-indigo-100 text-indigo-800', label: 'Pagada' },
    completada: { color: 'bg-gray-100 text-gray-800', label: 'Completada' }
};

const ComprasManagement: React.FC<ComprasManagementProps> = ({ user }) => {
    const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedEstado, setSelectedEstado] = useState<string>('todas');
    const [showCreateForm, setShowCreateForm] = useState(false);


    /** Verificar permisos */
    const hasPermission = (permission: string): boolean => {
        if (!user.permisos || !Array.isArray(user.permisos)) return false;
        return user.permisos.some(p => p.nombre.toLowerCase() === permission.toLowerCase());
    };

    const canView = hasPermission('consultar compra') || hasPermission('Consultar compra');
    const canCreate = hasPermission('crear compra') || hasPermission('Crear compra');
    const canUpdate = hasPermission('modificar compra') || hasPermission('Modificar compra');
    const canApprove = hasPermission('aprobar compra') || hasPermission('Aprobar compra');

    useEffect(() => {
        setLoading(false);
    }, []);

    /** Cargar órdenes de compra */
    const loadOrdenes = async () => {
        try {
            setLoading(true);
            // Datos mock hasta crear el endpoint
            const mockOrdenes: OrdenCompra[] = [
                {
                    clave: 1,
                    fecha: '2024-01-15',
                    monto_total: 15750.00,
                    proveedor_nombre: 'Cervecería Artesanal Los Andes',
                    estado: 'en_proceso',
                    productos_cantidad: 10000,
                    fecha_entrega_estimada: '2024-01-22',
                    observaciones: 'Urgente para reposición de almacén principal'
                },
                {
                    clave: 2,
                    fecha: '2024-01-14',
                    monto_total: 8900.00,
                    proveedor_nombre: 'Distribuidora Cervecera Nacional',
                    estado: 'aprobada',
                    productos_cantidad: 5000,
                    fecha_entrega_estimada: '2024-01-21'
                },
                {
                    clave: 3,
                    fecha: '2024-01-13',
                    monto_total: 12300.50,
                    proveedor_nombre: 'Cerveza Premium S.A.',
                    estado: 'emitida',
                    productos_cantidad: 7500
                }
            ];
            setOrdenes(mockOrdenes);
        } catch (error) {
            console.error('Error cargando órdenes:', error);
            setError('Error al cargar las órdenes de compra');
        } finally {
            setLoading(false);
        }
    };

    /** Aprobar orden de compra */
    const handleAprobarOrden = async (ordenId: number) => {
        if (!confirm('¿Está seguro de que desea aprobar esta orden de compra?')) {
            return;
        }

        try {
            // Simular API call
            setOrdenes(prev => prev.map(orden => 
                orden.clave === ordenId 
                    ? { ...orden, estado: 'aprobada' }
                    : orden
            ));
        } catch (error) {
            setError('Error al aprobar la orden');
        }
    };

    /** Rechazar orden de compra */
    const handleRechazarOrden = async (ordenId: number) => {
        const motivo = prompt('Ingrese el motivo del rechazo:');
        if (!motivo) return;

        try {
            // Simular API call
            setOrdenes(prev => prev.map(orden => 
                orden.clave === ordenId 
                    ? { ...orden, estado: 'rechazada', observaciones: `Rechazada: ${motivo}` }
                    : orden
            ));
        } catch (error) {
            setError('Error al rechazar la orden');
        }
    };

    /** Cambiar estado de la orden */
    const handleCambiarEstado = async (ordenId: number, nuevoEstado: EstadoOrden) => {
        try {
            // Simular API call
            setOrdenes(prev => prev.map(orden => 
                orden.clave === ordenId 
                    ? { ...orden, estado: nuevoEstado }
                    : orden
            ));
        } catch (error) {
            setError('Error al cambiar el estado de la orden');
        }
    };

    /** Formatear fecha */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    /** Formatear monto */
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    /** Filtrar órdenes por estado */
    const filteredOrdenes = selectedEstado === 'todas' 
        ? ordenes 
        : ordenes.filter(orden => orden.estado === selectedEstado);

    /** Órdenes pendientes de acción */
    const ordenesPendientes = ordenes.filter(orden => 
        orden.estado === 'emitida' || orden.estado === 'en_proceso'
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (!canView) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
                <p className="text-red-700">No tiene permisos para ver la gestión de compras.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Compras</h1>
                        <p className="text-orange-100 mt-2">
                            Órdenes de compra mayoristas y gestión de proveedores
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <svg className="w-16 h-16 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Alertas de órdenes pendientes */}
            {ordenesPendientes.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>Atención:</strong> Tienes {ordenesPendientes.length} orden(es) que requieren acción inmediata.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Controles y filtros */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedEstado}
                        onChange={(e) => setSelectedEstado(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                        <option value="todas">Todas las órdenes</option>
                        <option value="emitida">Emitidas</option>
                        <option value="aprobada">Aprobadas</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="mercancia_recibida">Mercancía Recibida</option>
                        <option value="pagada">Pagadas</option>
                        <option value="completada">Completadas</option>
                        <option value="rechazada">Rechazadas</option>
                    </select>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                    >
                        <span className="mr-2">+</span>
                        Nueva Orden de Compra
                    </button>
                )}
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => setError('')}
                        className="mt-2 text-red-600 hover:text-red-800 underline"
                    >
                        Cerrar
                    </button>
                </div>
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Total Órdenes</p>
                            <p className="text-2xl font-bold text-gray-900">{ordenes.length}</p>
                        </div>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Pendientes</p>
                            <p className="text-2xl font-bold text-yellow-600">{ordenesPendientes.length}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Monto Total</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatAmount(ordenes.reduce((sum, orden) => sum + orden.monto_total, 0))}
                            </p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Productos Total</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {ordenes.reduce((sum, orden) => sum + orden.productos_cantidad, 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de órdenes */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Órdenes de Compra {selectedEstado !== 'todas' && `- ${estadosConfig[selectedEstado as EstadoOrden]?.label}`}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Orden #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Proveedor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Productos
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Entrega Est.
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrdenes.map((orden) => (
                                <tr key={orden.clave} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        OC-{orden.clave.toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(orden.fecha)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                        {orden.proveedor_nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {orden.productos_cantidad.toLocaleString()} unidades
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                        {formatAmount(orden.monto_total)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadosConfig[orden.estado as EstadoOrden]?.color}`}>
                                            {estadosConfig[orden.estado as EstadoOrden]?.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {orden.fecha_entrega_estimada ? formatDate(orden.fecha_entrega_estimada) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900">
                                            Ver Detalles
                                        </button>
                                        {canApprove && orden.estado === 'emitida' && (
                                            <>
                                                <button 
                                                    onClick={() => handleAprobarOrden(orden.clave)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Aprobar
                                                </button>
                                                <button 
                                                    onClick={() => handleRechazarOrden(orden.clave)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Rechazar
                                                </button>
                                            </>
                                        )}
                                        {canUpdate && orden.estado !== 'completada' && orden.estado !== 'rechazada' && (
                                            <button className="text-orange-600 hover:text-orange-900">
                                                Actualizar Estado
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrdenes.length === 0 && (
                        <div className="text-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay órdenes</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {selectedEstado === 'todas' 
                                    ? 'No se han encontrado órdenes de compra.'
                                    : `No hay órdenes con estado "${estadosConfig[selectedEstado as EstadoOrden]?.label}".`
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComprasManagement; 