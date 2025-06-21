import React, { useState, useEffect } from 'react';

/** Interfaz para los permisos del usuario */
interface Permission {
    clave?: number;
    nombre: string;
    descripcion?: string;
}

/** Interfaz para el usuario */
interface User {
    id: number;
    username: string;
    tipo_entidad: string;
    rol: {
        id: number;
        nombre: string;
    };
    permisos: Permission[];
    entidad?: any;
}

/** Props del componente */
interface StatusManagementProps {
    user: User;
    moduleType: 'estados-reposicion' | 'estados-compra' | 'estados-venta-online';
}

/** Interfaz para los elementos con estado */
interface StatusItem {
    id: number;
    nombre: string;
    estado_actual: string;
    fecha_creacion: string;
    usuario_responsable?: string;
    acciones_disponibles: string[];
}

/** Componente de gestión de estados */
const StatusManagement: React.FC<StatusManagementProps> = ({ user, moduleType }) => {
    const [items, setItems] = useState<StatusItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<StatusItem | null>(null);

    /** Verificar si el usuario tiene un permiso específico */
    const hasPermission = (permissionName: string): boolean => {
        return user.permisos.some(permiso => permiso.nombre === permissionName);
    };

    /** Obtener configuración según el tipo de módulo */
    const getModuleConfig = () => {
        switch (moduleType) {
            case 'estados-reposicion':
                return {
                    title: 'Estados de Reposición',
                    description: 'Gestiona los estados de las reposiciones de inventario',
                    icon: '🔄',
                    permissionBase: 'reposicion',
                    specialPermission: 'gestionar estados reposicion',
                    apiEndpoint: '/api/reposiciones',
                    estados: ['Pendiente', 'Aprobada', 'En Proceso', 'Completada', 'Cancelada'],
                    acciones: ['Aprobar', 'Procesar', 'Completar', 'Cancelar']
                };
            case 'estados-compra':
                return {
                    title: 'Estados de Compra',
                    description: 'Gestiona los estados de las órdenes de compra',
                    icon: '🛒',
                    permissionBase: 'compra',
                    specialPermission: 'gestionar estados compra',
                    apiEndpoint: '/api/compras',
                    estados: ['Borrador', 'Enviada', 'Aprobada', 'Recibida', 'Cancelada'],
                    acciones: ['Enviar', 'Aprobar', 'Marcar Recibida', 'Cancelar']
                };
            case 'estados-venta-online':
                return {
                    title: 'Estados de Venta Online',
                    description: 'Gestiona los estados de las ventas online',
                    icon: '💻',
                    permissionBase: 'venta online',
                    specialPermission: 'gestionar estados venta online',
                    apiEndpoint: '/api/ventas-online',
                    estados: ['Pendiente', 'Procesando', 'Despachada', 'Entregada', 'Cancelada'],
                    acciones: ['Procesar', 'Despachar', 'Marcar Entregada', 'Cancelar']
                };
            default:
                return null;
        }
    };

    const config = getModuleConfig();

    /** Cargar elementos desde la API (simulado) */
    const loadItems = async () => {
        try {
            // Simulación de datos ya que no tenemos API real aún
            const mockData: StatusItem[] = [
                {
                    id: 1,
                    nombre: `${config?.title.split(' ')[0]} #001`,
                    estado_actual: config?.estados[0] || 'Pendiente',
                    fecha_creacion: '2024-01-15',
                    usuario_responsable: 'admin',
                    acciones_disponibles: config?.acciones.slice(0, 2) || []
                },
                {
                    id: 2,
                    nombre: `${config?.title.split(' ')[0]} #002`,
                    estado_actual: config?.estados[1] || 'En Proceso',
                    fecha_creacion: '2024-01-14',
                    usuario_responsable: 'supervisor',
                    acciones_disponibles: config?.acciones.slice(1, 3) || []
                },
                {
                    id: 3,
                    nombre: `${config?.title.split(' ')[0]} #003`,
                    estado_actual: config?.estados[2] || 'Completada',
                    fecha_creacion: '2024-01-13',
                    usuario_responsable: 'empleado',
                    acciones_disponibles: []
                }
            ];
            
            setItems(mockData);
        } catch (err) {
            setError('Error al cargar los elementos');
        } finally {
            setLoading(false);
        }
    };

    /** Efecto inicial para cargar datos */
    useEffect(() => {
        loadItems();
    }, [moduleType]);

    /** Ejecutar acción sobre un elemento */
    const executeAction = async (itemId: number, action: string) => {
        try {
            // Simulación de ejecución de acción
            const updatedItems = items.map(item => {
                if (item.id === itemId) {
                    const newState = getNextState(item.estado_actual, action);
                    return {
                        ...item,
                        estado_actual: newState,
                        acciones_disponibles: getAvailableActions(newState)
                    };
                }
                return item;
            });
            
            setItems(updatedItems);
            setSelectedItem(null);
            
            // Mostrar mensaje de éxito
            alert(`Acción "${action}" ejecutada correctamente`);
        } catch (err) {
            setError(`Error al ejecutar la acción: ${action}`);
        }
    };

    /** Obtener el siguiente estado basado en la acción */
    const getNextState = (currentState: string, action: string): string => {
        const stateTransitions: { [key: string]: { [action: string]: string } } = {
            'Pendiente': {
                'Aprobar': 'Aprobada',
                'Enviar': 'Enviada',
                'Procesar': 'Procesando',
                'Cancelar': 'Cancelada'
            },
            'Aprobada': {
                'Procesar': 'En Proceso',
                'Despachar': 'Despachada'
            },
            'En Proceso': {
                'Completar': 'Completada'
            },
            'Procesando': {
                'Despachar': 'Despachada'
            },
            'Despachada': {
                'Marcar Entregada': 'Entregada'
            },
            'Enviada': {
                'Aprobar': 'Aprobada',
                'Marcar Recibida': 'Recibida'
            }
        };
        
        return stateTransitions[currentState]?.[action] || currentState;
    };

    /** Obtener acciones disponibles para un estado */
    const getAvailableActions = (state: string): string[] => {
        const actionsByState: { [key: string]: string[] } = {
            'Pendiente': ['Aprobar', 'Cancelar'],
            'Aprobada': ['Procesar'],
            'En Proceso': ['Completar'],
            'Procesando': ['Despachar'],
            'Despachada': ['Marcar Entregada'],
            'Enviada': ['Aprobar', 'Marcar Recibida']
        };
        
        return actionsByState[state] || [];
    };

    /** Obtener color del estado */
    const getStateColor = (state: string): string => {
        const colors: { [key: string]: string } = {
            'Pendiente': 'bg-yellow-100 text-yellow-800',
            'Borrador': 'bg-gray-100 text-gray-800',
            'Enviada': 'bg-blue-100 text-blue-800',
            'Aprobada': 'bg-green-100 text-green-800',
            'En Proceso': 'bg-blue-100 text-blue-800',
            'Procesando': 'bg-blue-100 text-blue-800',
            'Despachada': 'bg-purple-100 text-purple-800',
            'Completada': 'bg-green-100 text-green-800',
            'Entregada': 'bg-green-100 text-green-800',
            'Recibida': 'bg-green-100 text-green-800',
            'Cancelada': 'bg-red-100 text-red-800'
        };
        
        return colors[state] || 'bg-gray-100 text-gray-800';
    };

    if (!config) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Módulo No Válido</h2>
                <p className="text-gray-600">El tipo de módulo especificado no es válido</p>
            </div>
        );
    }

    /** Verificar permisos de acceso */
    if (!hasPermission(`consultar ${config.permissionBase}`) && !hasPermission(config.specialPermission)) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
                <p className="text-gray-600">No tienes permisos para acceder a {config.title.toLowerCase()}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando {config.title.toLowerCase()}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="mr-3 text-3xl">{config.icon}</span>
                        {config.title}
                    </h2>
                    <p className="text-gray-600">{config.description}</p>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {config.estados.map((estado, index) => {
                    const count = items.filter(item => item.estado_actual === estado).length;
                    return (
                        <div key={estado} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="text-2xl font-bold text-blue-600">{count}</div>
                            <div className="text-sm text-gray-600">{estado}</div>
                        </div>
                    );
                })}
            </div>

            {/* Lista de elementos */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Elementos ({items.length})
                    </h3>
                </div>

                {items.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <div key={item.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h4 className="text-lg font-medium text-gray-900">
                                                {item.nombre}
                                            </h4>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(item.estado_actual)}`}>
                                                {item.estado_actual}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                            <span>Creado: {item.fecha_creacion}</span>
                                            {item.usuario_responsable && (
                                                <span>Responsable: {item.usuario_responsable}</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {item.acciones_disponibles.length > 0 && hasPermission(config.specialPermission) && (
                                        <div className="flex space-x-2">
                                            {item.acciones_disponibles.map((action) => (
                                                <button
                                                    key={action}
                                                    onClick={() => executeAction(item.id, action)}
                                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                >
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">{config.icon}</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay elementos</h3>
                        <p className="text-gray-500">No se encontraron elementos para gestionar</p>
                    </div>
                )}
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <span className="text-blue-600 text-xl">ℹ️</span>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                            Información sobre {config.title}
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc list-inside space-y-1">
                                <li>Los estados se gestionan automáticamente según las acciones ejecutadas</li>
                                <li>Solo usuarios con permisos especiales pueden cambiar estados</li>
                                <li>Cada cambio de estado queda registrado en el historial</li>
                                <li>Las acciones disponibles dependen del estado actual</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusManagement;
