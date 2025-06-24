/** Componente principal de gestión de ventas */
import React, { useState } from 'react';
import type { Usuario } from '../../types/auth';
import VentasWebManagement from './VentasWebManagement';
import VentasTiendaManagement from './VentasTiendaManagement';
import PuntosManagement from './PuntosManagement';

interface VentasManagementProps {
    user: Usuario;
}

type VentasSubmodule = 'web' | 'tienda' | 'puntos';

const VentasManagement: React.FC<VentasManagementProps> = ({ user }) => {
    const [activeSubmodule, setActiveSubmodule] = useState<VentasSubmodule>('web');

    /** Verificar si el usuario tiene un permiso específico */
    const hasPermission = (permission: string): boolean => {
        return user.permisos.some(p => p.nombre.toLowerCase() === permission.toLowerCase());
    };

    /** Verificar permisos generales de ventas */
    const canViewVentas = hasPermission('consultar venta_tienda_fisica') || 
                         hasPermission('Consultar venta_tienda_fisica') ||
                         hasPermission('consultar venta_online') || 
                         hasPermission('Consultar venta_online') ||
                         hasPermission('consultar venta_evento') || 
                         hasPermission('Consultar venta_evento');
    const canCreateVentas = hasPermission('crear venta_tienda_fisica') || 
                           hasPermission('crear venta_online') ||
                           hasPermission('crear venta_evento');
    const canUpdateVentas = hasPermission('modificar venta_tienda_fisica') || 
                           hasPermission('modificar venta_online') ||
                           hasPermission('modificar venta_evento');
    const canDeleteVentas = hasPermission('eliminar venta_tienda_fisica') || 
                           hasPermission('eliminar venta_online') ||
                           hasPermission('eliminar venta_evento');

    /** Verificar permisos específicos de puntos */
    const canViewPuntos = hasPermission('consultar puntos') || hasPermission('Consultar puntos');
    const canManagePuntos = hasPermission('modificar puntos') || hasPermission('Modificar puntos');

    if (!canViewVentas) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
                <p className="text-red-700">No tiene permisos para ver la gestión de ventas.</p>
            </div>
        );
    }

    /** Navegación entre submódulos */
    const renderSubmoduleNavigation = () => (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <nav className="flex space-x-4">
                <button
                    onClick={() => setActiveSubmodule('web')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeSubmodule === 'web'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                    <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                        Ventas Online
                    </span>
                </button>

                <button
                    onClick={() => setActiveSubmodule('tienda')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeSubmodule === 'tienda'
                            ? 'bg-green-600 text-white'
                            : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                >
                    <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Ventas Tienda
                    </span>
                </button>

                {canViewPuntos && (
                    <button
                        onClick={() => setActiveSubmodule('puntos')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeSubmodule === 'puntos'
                                ? 'bg-yellow-600 text-white'
                                : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                    >
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Gestión Puntos
                        </span>
                    </button>
                )}
            </nav>
        </div>
    );

    /** Renderizar el submódulo activo */
    const renderActiveSubmodule = () => {
        switch (activeSubmodule) {
            case 'web':
                return (
                    <VentasWebManagement 
                        user={user}
                        canView={canViewVentas}
                        canCreate={canCreateVentas}
                        canUpdate={canUpdateVentas}
                        canDelete={canDeleteVentas}
                    />
                );
            case 'tienda':
                return (
                    <VentasTiendaManagement 
                        user={user}
                        canView={canViewVentas}
                        canCreate={canCreateVentas}
                        canUpdate={canUpdateVentas}
                        canDelete={canDeleteVentas}
                    />
                );
            case 'puntos':
                return (
                    <PuntosManagement 
                        user={user}
                        canView={canViewPuntos}
                        canManage={canManagePuntos}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header principal */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Ventas</h1>
                        <p className="text-blue-100 mt-2">
                            Administración completa del sistema de ventas ACAUCAB
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Navegación de submódulos */}
            {renderSubmoduleNavigation()}

            {/* Contenido del submódulo activo */}
            <div className="min-h-[600px]">
                {renderActiveSubmodule()}
            </div>
        </div>
    );
};

export default VentasManagement; 