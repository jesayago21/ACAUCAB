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
    const [newVenta, setNewVenta] = useState({
        monto_total: '',
        direccion_envio: '',
        fk_lugar: '',
        fk_tienda_online: '',
        fk_usuario: ''
    });

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
            // Por ahora datos mock hasta crear el endpoint
            const mockVentas: VentaOnline[] = [
                {
                    clave: 1,
                    fecha: '2024-01-15',
                    monto_total: 125.50,
                    direccion_envio: 'Av. Principal, Casa #123',
                    lugar_nombre: 'Caracas',
                    tienda_online_nombre: 'ACAUCAB Online',
                    usuario_nombre: 'Juan Pérez'
                },
                {
                    clave: 2,
                    fecha: '2024-01-14',
                    monto_total: 89.25,
                    direccion_envio: 'Calle Los Mangos, Edificio Torre Sur',
                    lugar_nombre: 'Valencia',
                    tienda_online_nombre: 'ACAUCAB Online',
                    usuario_nombre: 'María García'
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
        return new Intl.NumberFormat('es-VE', {
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
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Ventas Online</h2>
                    <p className="text-gray-600">Gestión de ventas a través de tienda online</p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                    >
                        <span className="mr-2">+</span>
                        Nueva Venta Online
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

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Total Ventas</p>
                            <p className="text-2xl font-bold text-gray-900">{ventas.length}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Monto Total</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatAmount(ventas.reduce((sum, venta) => sum + venta.monto_total, 0))}
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
                            <p className="text-sm font-medium text-gray-500">Hoy</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {ventas.filter(v => 
                                    new Date(v.fecha).toDateString() === new Date().toDateString()
                                ).length}
                            </p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Promedio</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {ventas.length > 0 
                                    ? formatAmount(ventas.reduce((sum, venta) => sum + venta.monto_total, 0) / ventas.length)
                                    : '$0.00'
                                }
                            </p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dirección
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {ventas.map((venta) => (
                                <tr key={venta.clave} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {venta.clave}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(venta.fecha)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                        {formatAmount(venta.monto_total)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                        {venta.direccion_envio}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {venta.usuario_nombre || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {canUpdate && (
                                            <button 
                                                className="text-blue-600 hover:text-blue-900"
                                                onClick={() => setEditingVenta(venta)}
                                            >
                                                Editar
                                            </button>
                                        )}
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
        </div>
    );
};

export default VentasWebManagement; 