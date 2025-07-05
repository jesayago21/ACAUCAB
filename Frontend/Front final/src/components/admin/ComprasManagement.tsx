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
    miembro_rif: number;
    miembro_nombre: string;
    estado_actual: string;
    fecha_estado: string;
    productos_cantidad: number;
    observaciones: string;
}

interface DetalleOrdenCompra {
    compra_clave: number;
    compra_fecha: string;
    compra_monto_total: number;
    miembro_rif: number;
    miembro_nombre: string;
    estado_actual: string;
    fecha_estado: string;
    detalle_clave: number;
    almacen_clave: number;
    presentacion_nombre: string;
    cerveza_nombre: string;
    cantidad: number;
    precio_unitario: number;
}

interface MiembroProveedor {
    rif: number;
    razon_social: string;
    denominacion_comercial: string;
    url_pagina_web: string;
    total_compras: number;
    ultimo_pedido: string;
}

interface ProductoCompra {
    almacen_id: number;
    presentacion_id: number;
    presentacion_nombre: string;
    precio: number;
    cerveza_nombre: string;
    tipo_cerveza: string;
    stock_actual: number;
    miembro_rif: number;
    miembro_nombre: string;
    nivel_stock: string;
}

interface EstadisticasCompras {
    total_ordenes: number;
    ordenes_pendientes: number;
    monto_total_mes: number;
    productos_total: number;
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

const API_BASE_URL = `${import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api`;

const ComprasManagement: React.FC<ComprasManagementProps> = ({ user }) => {
    const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
    const [miembros, setMiembros] = useState<MiembroProveedor[]>([]);
    const [productos, setProductos] = useState<ProductoCompra[]>([]);
    const [estadisticas, setEstadisticas] = useState<EstadisticasCompras | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrden, setSelectedOrden] = useState<DetalleOrdenCompra | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showDetalle, setShowDetalle] = useState(false);
    const [activeTab, setActiveTab] = useState<'ordenes' | 'crear' | 'productos' | 'estadisticas'>('ordenes');

    // Filtros
    const [filtros, setFiltros] = useState({
        estado_filtro: '',
        miembro_id: ''
    });

    // Form state
    const [formData, setFormData] = useState({
        miembro_rif: '',
        almacen_id: '',
        cantidad: '',
        precio_unitario: ''
    });

    /** Verificar permisos */
    const hasPermission = (permission: string): boolean => {
        return user.permisos.some(p => p.nombre.toLowerCase() === permission.toLowerCase());
    };

    const canView = hasPermission('consultar compra') || hasPermission('Consultar compra');
    const canCreate = hasPermission('crear compra') || hasPermission('Crear compra');
    const canUpdate = hasPermission('modificar compra') || hasPermission('Modificar compra');
    const canApprove = hasPermission('aprobar compra') || hasPermission('Aprobar compra');

    useEffect(() => {
        loadInitialData();
    }, []);

    const fetchAPI = async (endpoint: string, options?: RequestInit) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        return response.json();
    };

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [ordenesData, miembrosData, productosData, estadisticasData] = await Promise.all([
                fetchAPI('/compras'),
                fetchAPI('/compras/miembros-proveedores'),
                fetchAPI('/compras/productos'),
                fetchAPI('/compras/estadisticas')
            ]);
            
            setOrdenes(ordenesData.data || []);
            setMiembros(miembrosData.data || []);
            setProductos(productosData.data || []);
            setEstadisticas(estadisticasData.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filtros.estado_filtro) params.append('estado_filtro', filtros.estado_filtro);
            if (filtros.miembro_id) params.append('miembro_id', filtros.miembro_id);

            const data = await fetchAPI(`/compras?${params.toString()}`);
            setOrdenes(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al aplicar filtros');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            await fetchAPI('/compras', {
                method: 'POST',
                body: JSON.stringify({
                    miembro_rif: parseInt(formData.miembro_rif),
                    almacen_id: parseInt(formData.almacen_id),
                    cantidad: parseInt(formData.cantidad),
                    precio_unitario: parseFloat(formData.precio_unitario)
                }),
            });

            await loadInitialData();
            resetForm();
            setActiveTab('ordenes');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear orden de compra');
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstado = async (ordenId: number, nuevoEstado: string) => {
        try {
            setLoading(true);
            
            await fetchAPI(`/compras/${ordenId}/estado`, {
                method: 'PUT',
                body: JSON.stringify({ nuevo_estado: nuevoEstado }),
            });

            await loadInitialData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cambiar estado');
        } finally {
            setLoading(false);
        }
    };

    const verDetalle = async (ordenId: number) => {
        try {
            setLoading(true);
            const data = await fetchAPI(`/compras/${ordenId}`);
            setSelectedOrden(data.data);
            setShowDetalle(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar detalle');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            miembro_rif: '',
            almacen_id: '',
            cantidad: '',
            precio_unitario: ''
        });
        setShowForm(false);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'VES',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-VE');
    };

    const getEstadoColor = (estado: string) => {
        const colores = {
            'emitida': 'bg-blue-100 text-blue-800',
            'procesando': 'bg-yellow-100 text-yellow-800',
            'listo para entrega': 'bg-green-100 text-green-800',
            'entregado': 'bg-gray-100 text-gray-800'
        };
        return colores[estado as keyof typeof colores] || 'bg-gray-100 text-gray-800';
    };

    const getNivelStockColor = (nivel: string) => {
        const colores = {
            'Crítico': 'text-red-600',
            'Bajo': 'text-orange-600',
            'Normal': 'text-yellow-600',
            'Alto': 'text-green-600'
        };
        return colores[nivel as keyof typeof colores] || 'text-gray-600';
    };

    if (loading && ordenes.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
            {ordenes.filter(orden => orden.estado_actual === 'emitida' || orden.estado_actual === 'en_proceso').length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>Atención:</strong> Tienes {ordenes.filter(orden => orden.estado_actual === 'emitida' || orden.estado_actual === 'en_proceso').length} orden(es) que requieren acción inmediata.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Controles y filtros */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedOrden?.estado_actual}
                        onChange={(e) => cambiarEstado(selectedOrden?.compra_clave || 0, e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                        <option value="emitida">Emitida</option>
                        <option value="procesando">Procesando</option>
                        <option value="listo para entrega">Listo para Entrega</option>
                        <option value="entregado">Entregado</option>
                    </select>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setShowForm(true)}
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
                        onClick={() => setError(null)}
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
                            <p className="text-2xl font-bold text-yellow-600">{ordenes.filter(orden => orden.estado_actual === 'emitida' || orden.estado_actual === 'en_proceso').length}</p>
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
                                {formatCurrency(ordenes.reduce((sum, orden) => sum + orden.monto_total, 0))}
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

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('ordenes')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'ordenes'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Órdenes de Compra ({ordenes.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('crear')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'crear'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Nueva Orden
                    </button>
                    <button
                        onClick={() => setActiveTab('productos')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'productos'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Productos ({productos.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('estadisticas')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'estadisticas'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Estadísticas
                    </button>
                </nav>
            </div>

            {/* Contenido por Tab */}
            {activeTab === 'ordenes' && (
                <div className="space-y-4">
                    {/* Filtros */}
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estado
                                </label>
                                <select
                                    value={filtros.estado_filtro}
                                    onChange={(e) => setFiltros(prev => ({ ...prev, estado_filtro: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="emitida">Emitida</option>
                                    <option value="procesando">Procesando</option>
                                    <option value="listo para entrega">Listo para Entrega</option>
                                    <option value="entregado">Entregado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Proveedor
                                </label>
                                <select
                                    value={filtros.miembro_id}
                                    onChange={(e) => setFiltros(prev => ({ ...prev, miembro_id: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value="">Todos los proveedores</option>
                                    {miembros.map((miembro) => (
                                        <option key={miembro.rif} value={miembro.rif}>
                                            {miembro.razon_social}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={aplicarFiltros}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Órdenes */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Orden
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Proveedor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Monto
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
                                    {ordenes.map((orden) => (
                                        <tr key={orden.clave} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{orden.clave}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {orden.miembro_nombre}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        RIF: {orden.miembro_rif}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(orden.fecha)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(orden.monto_total)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(orden.estado_actual)}`}>
                                                    {orden.estado_actual}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => verDetalle(orden.clave)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Ver Detalle
                                                </button>
                                                {orden.estado_actual !== 'entregado' && (
                                                    <select
                                                        onChange={(e) => cambiarEstado(orden.clave, e.target.value)}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1"
                                                        defaultValue=""
                                                    >
                                                        <option value="">Cambiar Estado</option>
                                                        {orden.estado_actual === 'emitida' && (
                                                            <option value="procesando">Procesando</option>
                                                        )}
                                                        {orden.estado_actual === 'procesando' && (
                                                            <option value="listo para entrega">Listo para Entrega</option>
                                                        )}
                                                        {orden.estado_actual === 'listo para entrega' && (
                                                            <option value="entregado">Entregado</option>
                                                        )}
                                                    </select>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {ordenes.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No hay órdenes de compra
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'crear' && (
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Orden de Compra</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Proveedor *
                                </label>
                                <select
                                    required
                                    value={formData.miembro_rif}
                                    onChange={(e) => setFormData(prev => ({ ...prev, miembro_rif: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar proveedor</option>
                                    {miembros.map((miembro) => (
                                        <option key={miembro.rif} value={miembro.rif}>
                                            {miembro.razon_social} (RIF: {miembro.rif})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Producto *
                                </label>
                                <select
                                    required
                                    value={formData.almacen_id}
                                    onChange={(e) => {
                                        const producto = productos.find(p => p.almacen_id === parseInt(e.target.value));
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            almacen_id: e.target.value,
                                            precio_unitario: producto ? producto.precio.toString() : ''
                                        }));
                                    }}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar producto</option>
                                    {productos.map((producto) => (
                                        <option key={producto.almacen_id} value={producto.almacen_id}>
                                            {producto.cerveza_nombre} - {producto.presentacion_nombre} 
                                            (Stock: {producto.stock_actual} - {formatCurrency(producto.precio)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cantidad *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.cantidad}
                                    onChange={(e) => setFormData(prev => ({ ...prev, cantidad: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Cantidad a comprar"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Precio Unitario *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.precio_unitario}
                                    onChange={(e) => setFormData(prev => ({ ...prev, precio_unitario: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Precio por unidad"
                                />
                            </div>
                        </div>

                        {/* Preview del monto total */}
                        {formData.cantidad && formData.precio_unitario && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="text-sm font-medium text-blue-900">
                                    Monto Total: {formatCurrency(parseInt(formData.cantidad) * parseFloat(formData.precio_unitario))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creando...' : 'Crear Orden'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'productos' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock Actual
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nivel Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Proveedor
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {productos.map((producto) => (
                                    <tr key={producto.almacen_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {producto.presentacion_nombre}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {producto.cerveza_nombre}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {producto.tipo_cerveza}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(producto.precio)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {producto.stock_actual}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${getNivelStockColor(producto.nivel_stock)}`}>
                                                {producto.nivel_stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {producto.miembro_nombre}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'estadisticas' && estadisticas && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Total Órdenes</p>
                                <p className="text-2xl font-bold text-gray-900">{estadisticas.total_ordenes}</p>
                            </div>
                            <div className="ml-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    📋
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Órdenes Pendientes</p>
                                <p className="text-2xl font-bold text-orange-600">{estadisticas.ordenes_pendientes}</p>
                            </div>
                            <div className="ml-4">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    ⏳
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Monto Total Mes</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(estadisticas.monto_total_mes)}
                                </p>
                            </div>
                            <div className="ml-4">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    💰
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Productos Total</p>
                                <p className="text-2xl font-bold text-purple-600">{estadisticas.productos_total}</p>
                            </div>
                            <div className="ml-4">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    📦
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Detalle */}
            {showDetalle && selectedOrden && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Detalle Orden #{selectedOrden.compra_clave}
                                </h3>
                                <button
                                    onClick={() => setShowDetalle(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Fecha:</label>
                                        <p className="text-sm text-gray-900">{formatDate(selectedOrden.compra_fecha)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Estado:</label>
                                        <p className="text-sm text-gray-900">{selectedOrden.estado_actual}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Proveedor:</label>
                                        <p className="text-sm text-gray-900">{selectedOrden.miembro_nombre}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Monto Total:</label>
                                        <p className="text-sm text-gray-900">{formatCurrency(selectedOrden.compra_monto_total)}</p>
                                    </div>
                                </div>

                                {/* Aquí se mostrarían los detalles de productos */}
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Productos:</h4>
                                    <div className="text-center py-4 text-gray-500">
                                        Detalle de productos en desarrollo...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComprasManagement; 