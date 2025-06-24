/** 
 * Componente de gestión de reposición de inventario
 * 
 * NOTA IMPORTANTE: La detección automática de reposición (cuando stock ≤ 100 unidades)
 * se maneja mediante triggers en la base de datos, NO desde el frontend.
 * Este componente solo muestra y gestiona las reposiciones ya creadas.
 */
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/auth';

interface ReposicionManagementProps {
    user: Usuario;
}

interface Reposicion {
    clave: number;
    fk_almacen: number;
    fk_inventario_tienda: number;
    fk_usuario: number;
    cantidad: number;
    fecha: string;
    estado: 'pendiente' | 'aprobada' | 'en_proceso' | 'completada' | 'rechazada';
    producto_nombre: string;
    stock_actual: number;
    usuario_nombre: string;
}

type EstadoReposicion = 'pendiente' | 'aprobada' | 'rechazada' | 'en_proceso' | 'completada';

const estadosConfig = {
    pendiente: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
    aprobada: { color: 'bg-blue-100 text-blue-800', label: 'Aprobada' },
    rechazada: { color: 'bg-red-100 text-red-800', label: 'Rechazada' },
    en_proceso: { color: 'bg-orange-100 text-orange-800', label: 'En Proceso' },
    completada: { color: 'bg-green-100 text-green-800', label: 'Completada' }
};

const ReposicionManagement: React.FC<ReposicionManagementProps> = ({ user }) => {
    const [reposiciones, setReposiciones] = useState<Reposicion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedEstado, setSelectedEstado] = useState<string>('pendiente');
    const [showDetails, setShowDetails] = useState<number | null>(null);

    /** Verificar permisos */
    const hasPermission = (permission: string): boolean => {
        return user.permisos.some(p => p.nombre.toLowerCase() === permission.toLowerCase());
    };

    const canView = hasPermission('consultar reposicion') || hasPermission('Consultar reposicion');
    const canManage = hasPermission('modificar reposicion') || hasPermission('Modificar reposicion');
    const canCreate = hasPermission('crear reposicion') || hasPermission('Crear reposicion');

    /** Cargar datos iniciales */
    useEffect(() => {
        loadReposiciones();
    }, []);

    /** Cargar reposiciones */
    const loadReposiciones = async () => {
        try {
            setLoading(true);
            // Por ahora usar datos mock - SOLO TIENDA FÍSICA ID 1
            const mockReposiciones: Reposicion[] = [
                {
                    clave: 1,
                    fk_almacen: 1,
                    fk_inventario_tienda: 1,
                    fk_usuario: 1,
                    cantidad: 100,
                    fecha: '2024-01-15T10:30:00',
                    estado: 'pendiente',
                    producto_nombre: 'Cerveza Artesanal IPA - Six Pack',
                    stock_actual: 85,
                    usuario_nombre: 'Usuario 1'
                },
                {
                    clave: 2,
                    fk_almacen: 1,
                    fk_inventario_tienda: 1,
                    fk_usuario: 1,
                    cantidad: 200,
                    fecha: '2024-01-14T15:45:00',
                    estado: 'aprobada',
                    producto_nombre: 'Cerveza Lager Premium - Unidad',
                    stock_actual: 45,
                    usuario_nombre: 'Usuario 2'
                },
                {
                    clave: 3,
                    fk_almacen: 1,
                    fk_inventario_tienda: 1,
                    fk_usuario: 1,
                    cantidad: 150,
                    fecha: '2024-01-13T09:20:00',
                    estado: 'en_proceso',
                    producto_nombre: 'Cerveza Stout Oscura - Six Pack',
                    stock_actual: 20,
                    usuario_nombre: 'Usuario 3'
                }
            ];
            
            // Filtrar solo reposiciones de la tienda física ID 1
            setReposiciones(mockReposiciones);
            
        } catch (error) {
            console.error('Error cargando reposiciones:', error);
            setError('Error al cargar las reposiciones');
        } finally {
            setLoading(false);
        }
    };

    /** Aceptar reposición */
    const handleAceptarReposicion = async (reposicionId: number) => {
        try {
            setReposiciones(prev => prev.map(rep => 
                rep.clave === reposicionId 
                    ? { ...rep, estado: 'aprobada', usuario_nombre: user.username }
                    : rep
            ));
        } catch (error) {
            setError('Error al aceptar la reposición');
        }
    };

    /** Iniciar proceso de reposición */
    const handleIniciarProceso = async (reposicionId: number) => {
        try {
            setReposiciones(prev => prev.map(rep => 
                rep.clave === reposicionId 
                    ? { ...rep, estado: 'en_proceso' }
                    : rep
            ));
        } catch (error) {
            setError('Error al iniciar el proceso');
        }
    };

    /** Completar reposición */
    const handleCompletarReposicion = async (reposicionId: number) => {
        try {
            setReposiciones(prev => prev.map(rep => 
                rep.clave === reposicionId 
                    ? { ...rep, estado: 'completada' }
                    : rep
            ));
        } catch (error) {
            setError('Error al completar la reposición');
        }
    };

    /** Formatear fecha y hora */
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /** Calcular urgencia basada en stock disponible */
    const calcularUrgencia = (disponible: number, requerida: number): string => {
        const porcentaje = (disponible / requerida) * 100;
        if (porcentaje <= 20) return 'Crítico';
        if (porcentaje <= 40) return 'Urgente';
        if (porcentaje <= 70) return 'Moderado';
        return 'Normal';
    };

    /** Filtrar reposiciones */
    const filteredReposiciones = reposiciones.filter(rep => {
        const estadoMatch = selectedEstado === 'todas' || rep.estado === selectedEstado;
        return estadoMatch;
    });

    /** Estadísticas */
    const reposicionesPendientes = reposiciones.filter(r => r.estado === 'pendiente').length;
    const reposicionesUrgentes = reposiciones.filter(r => (r.stock_actual / r.cantidad) <= 0.2).length;
    const reposicionesCompletadas = reposiciones.filter(r => r.estado === 'completada').length;

    /** Ver detalles de reposición */
    const handleVerDetalles = (reposicionId: number) => {
        setShowDetails(showDetails === reposicionId ? null : reposicionId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!canView) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
                <p className="text-red-700">No tiene permisos para ver la gestión de reposición.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Reposición</h1>
                        <p className="text-purple-100 mt-2">
                            Control de inventario y reposición automática de productos
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <svg className="w-16 h-16 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Reposición más reciente pendiente */}
            {reposicionesPendientes > 0 && (() => {
                const reposicionMasReciente = reposiciones
                    .filter(r => r.estado === 'pendiente')
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
                
                if (!reposicionMasReciente) return null;
                
                return (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">
                                    ⚡ Reposición Urgente Pendiente
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-lg">
                                        <span className="font-medium">Producto:</span> {reposicionMasReciente.producto_nombre}
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <p>
                                            <span className="font-medium">Stock actual:</span> {reposicionMasReciente.stock_actual} unidades
                                        </p>
                                        <p>
                                            <span className="font-medium">Necesita:</span> {reposicionMasReciente.cantidad} unidades
                                        </p>
                                    </div>
                                    <p className="text-sm opacity-90">
                                        Solicitado hace {Math.floor((Date.now() - new Date(reposicionMasReciente.fecha).getTime()) / (1000 * 60 * 60))} horas
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-5xl mb-2">
                                    {(reposicionMasReciente.stock_actual / reposicionMasReciente.cantidad) <= 0.2 
                                        ? '🚨' 
                                        : '⚠️'}
                                </div>
                                {canManage && (
                                    <button
                                        onClick={() => handleAceptarReposicion(reposicionMasReciente.clave)}
                                        className="bg-white text-orange-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Procesar Ahora
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Alertas críticas */}
            {reposicionesUrgentes > 0 && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                <strong>¡Atención Urgente!</strong> Hay {reposicionesUrgentes} reposición(es) que requieren atención inmediata.
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
                        className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                        <option value="todas">Todos los estados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="aprobada">Aprobadas</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="completada">Completadas</option>
                        <option value="rechazada">Rechazadas</option>
                    </select>
                </div>
                {canCreate && (
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                        <span className="mr-2">+</span>
                        Nueva Reposición Manual
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
                            <p className="text-sm font-medium text-gray-500">Pendientes</p>
                            <p className="text-2xl font-bold text-yellow-600">{reposicionesPendientes}</p>
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
                            <p className="text-sm font-medium text-gray-500">Urgentes</p>
                            <p className="text-2xl font-bold text-red-600">{reposicionesUrgentes}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Completadas</p>
                            <p className="text-2xl font-bold text-green-600">{reposicionesCompletadas}</p>
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
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-purple-600">{reposiciones.length}</p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de reposiciones */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Reposiciones de Inventario
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Solicitud
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Responsable
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReposiciones.map((reposicion) => (
                                <React.Fragment key={reposicion.clave}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            <div>
                                                <div className="font-medium">{reposicion.producto_nombre}</div>
                                                <div className="text-xs text-gray-500">
                                                    Necesita: {reposicion.cantidad} unidades
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <div className="text-sm font-medium">{reposicion.stock_actual} disponibles</div>
                                                    <div className="text-xs text-gray-500">
                                                        {calcularUrgencia(reposicion.stock_actual, reposicion.cantidad)}
                                                    </div>
                                                </div>
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${
                                                            (reposicion.stock_actual / reposicion.cantidad) <= 0.2 
                                                                ? 'bg-red-600'
                                                                : (reposicion.stock_actual / reposicion.cantidad) <= 0.4 
                                                                    ? 'bg-orange-600'
                                                                    : 'bg-yellow-600'
                                                        }`}
                                                        style={{ 
                                                            width: `${Math.min((reposicion.stock_actual / reposicion.cantidad) * 100, 100)}%` 
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadosConfig[reposicion.estado as EstadoReposicion]?.color}`}>
                                                {estadosConfig[reposicion.estado as EstadoReposicion]?.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDateTime(reposicion.fecha)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {reposicion.usuario_nombre || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {canManage && reposicion.estado === 'pendiente' && (
                                                <button 
                                                    onClick={() => handleAceptarReposicion(reposicion.clave)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Aceptar
                                                </button>
                                            )}
                                            {canManage && reposicion.estado === 'aprobada' && (
                                                <button 
                                                    onClick={() => handleIniciarProceso(reposicion.clave)}
                                                    className="text-orange-600 hover:text-orange-900"
                                                >
                                                    Iniciar
                                                </button>
                                            )}
                                            {canManage && reposicion.estado === 'en_proceso' && (
                                                <button 
                                                    onClick={() => handleCompletarReposicion(reposicion.clave)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Completar
                                                </button>
                                            )}
                                            <button className="text-purple-600 hover:text-purple-900" onClick={() => handleVerDetalles(reposicion.clave)}>
                                                Ver Detalles
                                            </button>
                                        </td>
                                    </tr>
                                    {showDetails === reposicion.clave && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-gray-900">Detalles de Reposición #{reposicion.clave}</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>

                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Cantidad Solicitada:</span> {reposicion.cantidad} unidades
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Usuario Responsable:</span> {reposicion.usuario_nombre}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Fecha de Solicitud:</span> {formatDateTime(reposicion.fecha)}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Estado Actual:</span> {estadosConfig[reposicion.estado]?.label}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <p className="text-sm text-gray-600 font-medium mb-2">Nota:</p>
                                                        <p className="text-sm text-gray-600">
                                                            Esta reposición corresponde a la Tienda Física ID 1. La detección automática 
                                                            se activa cuando el stock cae por debajo de 100 unidades.
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                    {filteredReposiciones.length === 0 && (
                        <div className="text-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reposiciones</h3>
                            <p className="mt-1 text-sm text-gray-500">No se encontraron reposiciones con los filtros seleccionados.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReposicionManagement; 