/** Componente de gestión de puntos de clientes */
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/auth';

interface PuntosManagementProps {
    user: Usuario;
    canView: boolean;
    canManage: boolean;
}

interface ClientePuntos {
    cliente_id: number;
    cliente_nombre: string;
    puntos_actuales: number;
    puntos_canjeados: number;
    puntos_ganados_total: number;
    ultima_actividad: string;
    nivel: string;
}

interface TransaccionPuntos {
    id: number;
    tipo: 'ganados' | 'canjeados';
    cantidad: number;
    fecha: string;
    concepto: string;
    cliente_nombre: string;
}

const PuntosManagement: React.FC<PuntosManagementProps> = ({
    user,
    canView,
    canManage
}) => {
    const [clientes, setClientes] = useState<ClientePuntos[]>([]);
    const [transacciones, setTransacciones] = useState<TransaccionPuntos[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'clientes' | 'transacciones'>('clientes');
    const [searchTerm, setSearchTerm] = useState('');

    /** Cargar datos iniciales */
    useEffect(() => {
        loadData();
    }, []);

    /** Cargar todos los datos */
    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadClientes(),
                loadTransacciones()
            ]);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setError('Error al cargar los datos de puntos');
        } finally {
            setLoading(false);
        }
    };

    /** Cargar datos de clientes con puntos */
    const loadClientes = async () => {
        try {
            // Datos mock hasta crear el endpoint
            const mockClientes: ClientePuntos[] = [
                {
                    cliente_id: 1,
                    cliente_nombre: 'Juan Pérez',
                    puntos_actuales: 245,
                    puntos_canjeados: 120,
                    puntos_ganados_total: 365,
                    ultima_actividad: '2024-01-15',
                    nivel: 'Bronce'
                },
                {
                    cliente_id: 2,
                    cliente_nombre: 'María García',
                    puntos_actuales: 567,
                    puntos_canjeados: 200,
                    puntos_ganados_total: 767,
                    ultima_actividad: '2024-01-14',
                    nivel: 'Plata'
                },
                {
                    cliente_id: 3,
                    cliente_nombre: 'Carlos López',
                    puntos_actuales: 1234,
                    puntos_canjeados: 500,
                    puntos_ganados_total: 1734,
                    ultima_actividad: '2024-01-13',
                    nivel: 'Oro'
                }
            ];
            setClientes(mockClientes);
        } catch (error) {
            throw error;
        }
    };

    /** Cargar transacciones de puntos */
    const loadTransacciones = async () => {
        try {
            // Datos mock hasta crear el endpoint
            const mockTransacciones: TransaccionPuntos[] = [
                {
                    id: 1,
                    tipo: 'ganados',
                    cantidad: 3,
                    fecha: '2024-01-15T10:30:00',
                    concepto: 'Compra en tienda - 3 productos',
                    cliente_nombre: 'Juan Pérez'
                },
                {
                    id: 2,
                    tipo: 'canjeados',
                    cantidad: 50,
                    fecha: '2024-01-14T15:20:00',
                    concepto: 'Canje por descuento 10%',
                    cliente_nombre: 'María García'
                },
                {
                    id: 3,
                    tipo: 'ganados',
                    cantidad: 6,
                    fecha: '2024-01-14T11:45:00',
                    concepto: 'Compra en tienda - 6 productos',
                    cliente_nombre: 'Carlos López'
                }
            ];
            setTransacciones(mockTransacciones);
        } catch (error) {
            throw error;
        }
    };

    /** Formatear fecha */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    /** Obtener color del nivel */
    const getNivelColor = (nivel: string) => {
        switch (nivel.toLowerCase()) {
            case 'bronce':
                return 'bg-orange-100 text-orange-800';
            case 'plata':
                return 'bg-gray-100 text-gray-800';
            case 'oro':
                return 'bg-yellow-100 text-yellow-800';
            case 'platino':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    /** Filtrar clientes por término de búsqueda */
    const filteredClientes = clientes.filter(cliente =>
        cliente.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /** Calcular estadísticas */
    const totalPuntosActivos = clientes.reduce((sum, c) => sum + c.puntos_actuales, 0);
    const totalPuntosCanjeados = clientes.reduce((sum, c) => sum + c.puntos_canjeados, 0);
    const clientesActivos = clientes.filter(c => 
        new Date(c.ultima_actividad) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            </div>
        );
    }

    if (!canView) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
                <p className="text-red-700">No tiene permisos para ver la gestión de puntos.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Puntos</h2>
                <p className="text-gray-600">Sistema de fidelización y canje de puntos</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">Módulo de gestión de puntos en desarrollo...</p>
            </div>
        </div>
    );
};

export default PuntosManagement; 