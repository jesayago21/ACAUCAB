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

    /** Cargar datos iniciales */
    useEffect(() => {
        loadVentas();
    }, []);

    /** Cargar ventas de tienda física */
    const loadVentas = async () => {
        try {
            setLoading(true);
            // Datos mock hasta crear el endpoint
            const mockVentas: VentaTienda[] = [
                {
                    clave: 1,
                    fecha: '2024-01-15T10:30:00',
                    total_venta: 67.50,
                    tienda_fisica_nombre: 'ACAUCAB Caracas Centro',
                    cliente_nombre: 'Carlos López',
                    productos_cantidad: 3,
                    metodo_pago: 'Tarjeta de crédito',
                    puntos_otorgados: 3
                }
            ];
            setVentas(mockVentas);
        } catch (error) {
            setError('Error al cargar las ventas de tienda');
        } finally {
            setLoading(false);
        }
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Ventas en Tienda Física</h2>
                <p className="text-gray-600">Gestión de ventas presenciales con sistema de puntos</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">Módulo de ventas en tienda física en desarrollo...</p>
            </div>
        </div>
    );
};

export default VentasTiendaManagement; 