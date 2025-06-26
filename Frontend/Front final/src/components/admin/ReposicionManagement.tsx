/** 
 * Componente de gestión de reposición de inventario
 * 
 * NOTA IMPORTANTE: La detección automática de reposición (cuando stock ≤ 20 unidades)
 * se maneja mediante triggers en la base de datos, NO desde el frontend.
 * Este componente solo muestra y gestiona las reposiciones ya creadas.
 */
import React, { useState, useEffect, useCallback } from 'react';
import type { Usuario } from '../../types/auth';
import { reposicionService, type Reposicion, type EstadoReposicion, type EstadisticasReposiciones } from '../../services/reposicionService';

interface ReposicionManagementProps {
    user: Usuario;
}

type EstadoReposicionType = 'procesando' | 'listo para entrega' | 'entregado';

const estadosConfig: Record<string, { color: string; label: string }> = {
    'procesando': { color: 'bg-yellow-100 text-yellow-800', label: 'Procesando' },
    'listo para entrega': { color: 'bg-blue-100 text-blue-800', label: 'Listo para Entrega' },
    'entregado': { color: 'bg-green-100 text-green-800', label: 'Completado' },
    'default': { color: 'bg-gray-100 text-gray-800', label: 'Desconocido' }
};

const ReposicionManagement: React.FC<ReposicionManagementProps> = ({ user }) => {
    const [reposiciones, setReposiciones] = useState<Reposicion[]>([]);
    const [estadosDisponibles, setEstadosDisponibles] = useState<EstadoReposicion[]>([]);
    const [estadisticas, setEstadisticas] = useState<EstadisticasReposiciones | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedEstado, setSelectedEstado] = useState<string>('todas');
    const [showDetails, setShowDetails] = useState<number | null>(null);
    const [showNotification, setShowNotification] = useState<string>('');
    
    /** Verificar permisos */
    const hasPermission = useCallback((permission: string): boolean => {
        return user.permisos.some(p => p.nombre.toLowerCase() === permission.toLowerCase());
    }, [user.permisos]);

    const canView = hasPermission('consultar reposicion');
    const canManage = hasPermission('modificar reposicion');
    const canCreate = hasPermission('crear reposicion');

    /** 
     * El rol 'Administrador' también tiene permisos por defecto en el backend,
     * pero la solicitud es restringir la acción explícitamente al Jefe de Pasillo en esta vista.
     */
    const isJefeDePasillo = user.rol.nombre === 'Jefe de Pasillo';
    const isAdmin = user.rol.nombre === 'Administrador';

    const loadData = useCallback(async () => {
        if (!canView) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError('');
            
            const [reposicionesRes, estadosRes, estadisticasRes] = await Promise.all([
                reposicionService.getAllReposiciones(),
                reposicionService.getEstadosReposicion(),
                reposicionService.getEstadisticasReposiciones()
            ]);

            if (reposicionesRes.success) setReposiciones(reposicionesRes.data);
            else setError(prev => prev + ' Error al cargar reposiciones.');

            if (estadosRes.success) setEstadosDisponibles(estadosRes.data);
            else setError(prev => prev + ' Error al cargar estados.');
            
            if (estadisticasRes.success) setEstadisticas(estadisticasRes.data);
            else setError(prev => prev + ' Error al cargar estadísticas.');

        } catch (err: any) {
            console.error('Error cargando datos de reposición:', err);
            setError(err.message || 'Ocurrió un error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    }, [canView]);
    
    /** Cargar datos iniciales */
    useEffect(() => {
        loadData();
    }, [loadData]);


    /** Cambiar estado de reposición */
    const handleCambiarEstado = async (reposicionId: number, nuevoEstadoId: number, comentario?: string) => {
        // Validación estricta: solo el Jefe de Pasillo puede realizar esta acción desde la UI.
        if (!isJefeDePasillo) {
            setError("Acción denegada: Solo un Jefe de Pasillo puede modificar el estado.");
            return;
        }

        try {
            const response = await reposicionService.updateEstadoReposicion(reposicionId, nuevoEstadoId, comentario);
            if (response.success) {
                setShowNotification('Estado actualizado correctamente');
                setTimeout(() => setShowNotification(''), 3000);
                await loadData(); // Recargar todos los datos
            } else {
                // Esto puede capturar errores controlados desde el backend que no lanzan una excepción
                setError((response as any).message || 'Error al actualizar el estado');
            }
        } catch (error: any) {
            console.error('Error al cambiar estado:', error);
            // Manejar errores específicos como el de token inválido
            if (error.message && error.message.toLowerCase().includes('no autenticado')) {
                setError('Su sesión puede haber expirado. Por favor, inicie sesión nuevamente.');
            } else {
                setError(error.message || 'Error desconocido al actualizar el estado');
            }
        }
    };

    /** Obtener el siguiente estado en el flujo */
    const getNextEstado = (estadoActual: string): EstadoReposicion | null => {
        const flujo: EstadoReposicionType[] = ['procesando', 'listo para entrega', 'entregado'];
        const indiceActual = flujo.indexOf(estadoActual as EstadoReposicionType);
        
        if (indiceActual >= 0 && indiceActual < flujo.length - 1) {
            const siguienteEstadoNombre = flujo[indiceActual + 1];
            return estadosDisponibles.find(e => e.estado.toLowerCase() === siguienteEstadoNombre) || null;
        }
        return null;
    };

    /** Formatear fecha y hora */
    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /** Filtrar reposiciones */
    const filteredReposiciones = reposiciones.filter(rep => {
        const estadoMatch = selectedEstado === 'todas' || (rep.estado_actual && rep.estado_actual.toLowerCase() === selectedEstado.toLowerCase());
        return estadoMatch;
    });

    /** Ver detalles de reposición */
    const handleVerDetalles = (reposicionId: number) => {
        setShowDetails(showDetails === reposicionId ? null : reposicionId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="ml-4 text-gray-500">Cargando datos...</p>
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

    // El backend valida permisos, pero esta es una primera barrera en la UI.
    if (!isJefeDePasillo && !isAdmin) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-yellow-900 mb-2">Vista de Solo Lectura</h2>
                <p className="text-yellow-700">No tiene permisos para gestionar reposiciones. Solo puede visualizar la información.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {/* Notificación de éxito */}
            {showNotification && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                    <p className="font-bold">Éxito</p>
                    <p>{showNotification}</p>
                </div>
            )}

            {/* Mensaje de error general */}
            {error && (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Reposición</h1>
                        <p className="text-purple-100 mt-2">
                            Control de inventario y reposición automática de productos
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <svg className="w-16 h-16 text-purple-200 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-2xl font-bold text-purple-600">{estadisticas?.total_reposiciones ?? '...'}</p>
                    <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-2xl font-bold text-yellow-500">{estadisticas?.pendientes ?? '...'}</p>
                    <p className="text-sm text-gray-500">Pendientes</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-2xl font-bold text-green-500">{estadisticas?.completadas ?? '...'}</p>
                    <p className="text-sm text-gray-500">Completadas</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-2xl font-bold text-red-500">{estadisticas?.criticas ?? '...'}</p>
                    <p className="text-sm text-gray-500">Críticas</p>
                </div>
            </div>
            
            {/* Controles y filtros */}
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <label htmlFor="estado-filter" className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
                    <select
                        id="estado-filter"
                        value={selectedEstado}
                        onChange={(e) => setSelectedEstado(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    >
                        <option value="todas">Todas</option>
                        {estadosDisponibles.map(e => (
                             <option key={e.clave} value={e.estado.toLowerCase()}>{e.estado.charAt(0).toUpperCase() + e.estado.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabla de Reposiciones */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tienda</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Solicitud</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Urgencia</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReposiciones.map((rep) => {
                                const estadoActualKey = rep.estado_actual ? rep.estado_actual.toLowerCase() : 'default';
                                const estadoCfg = estadosConfig[estadoActualKey] || estadosConfig.default;
                                const urgenciaColor = {
                                    'Crítico': 'bg-red-500',
                                    'Urgente': 'bg-yellow-500',
                                    'Moderado': 'bg-orange-500',
                                    'Normal': 'bg-green-500',
                                }[rep.urgencia];
                                
                                const siguienteEstado = getNextEstado(rep.estado_actual ? rep.estado_actual.toLowerCase() : '');

                                return (
                                    <React.Fragment key={rep.clave}>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{rep.producto_nombre}</div>
                                                <div className="text-sm text-gray-500">{rep.presentacion_nombre}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{rep.tienda_nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(rep.fecha)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoCfg.color}`}>
                                                    {estadoCfg.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center">
                                                    <div className={`h-4 w-4 rounded-full ${urgenciaColor}`} title={rep.urgencia}></div>
                                                    <span className="ml-2 text-sm text-gray-700">{rep.urgencia}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {isJefeDePasillo && siguienteEstado && (rep.estado_actual ? rep.estado_actual.toLowerCase() : '') !== 'entregado' && (
                                                    <button
                                                        onClick={() => handleCambiarEstado(rep.clave, siguienteEstado.clave, `Cambiado a ${siguienteEstado.estado}`)}
                                                        className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md shadow-sm transition-colors"
                                                        title={`Marcar como ${siguienteEstado.estado}`}
                                                    >
                                                      → {siguienteEstado.estado.charAt(0).toUpperCase() + siguienteEstado.estado.slice(1)}
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleVerDetalles(rep.clave)} 
                                                    className="text-purple-600 hover:text-purple-900 ml-4"
                                                >
                                                    Ver Detalles
                                                </button>
                                            </td>
                                        </tr>
                                        {showDetails === rep.clave && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={6} className="px-6 py-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                        <div>
                                                            <p className="font-semibold text-gray-700">Detalles del Producto</p>
                                                            <p><span className="text-gray-500">Stock Actual:</span> {rep.stock_actual} uds.</p>
                                                            <p><span className="text-gray-500">Cantidad Solicitada:</span> {rep.cantidad} uds.</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-700">Responsables</p>
                                                            <p><span className="text-gray-500">Jefe de Pasillo:</span> {rep.jefe_pasillo || 'N/A'}</p>
                                                            <p><span className="text-gray-500">Usuario Creador:</span> {rep.usuario_responsable}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-700">Seguimiento</p>
                                                            <p><span className="text-gray-500">Última Actualización:</span> {formatDateTime(rep.fecha_ultimo_cambio)}</p>
                                                            <p><span className="text-gray-500">Comentario:</span> {rep.comentario_ultimo || 'Sin comentarios'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                     {filteredReposiciones.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reposiciones</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No se encontraron reposiciones que coincidan con el filtro seleccionado.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReposicionManagement; 