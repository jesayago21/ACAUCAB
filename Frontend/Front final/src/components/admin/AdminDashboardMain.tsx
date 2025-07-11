import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import RoleManagement from './RoleManagement';
import UserManagement from './UserManagement';
import PrivilegeManagement from './PrivilegeManagement';
import StatusManagement from './StatusManagement';
import VentasManagement from './VentasManagement';
import VentasWebManagement from './VentasWebManagement';
import VentasTiendaManagement from './VentasTiendaManagement';

import ReposicionManagement from './ReposicionManagement';
import ReportesManagement from './ReportesManagement';

// Nuevos módulos implementados
import EventosManagement from './EventosManagement';
import TiposEventoManagement from './TiposEventoManagement';
import DashboardAvanzado from './DashboardAvanzado';
import OfertasManagement from './OfertasManagement';
import ComprasManagement from './ComprasManagement';
import EntradasManagement from './EntradasManagement';
import AsistenciaManagement from './AsistenciaManagement';

import type { Usuario } from '../../types/auth';

/** Interfaz para los permisos del usuario */
interface Permission {
    clave?: number;
    nombre: string;
    descripcion?: string;
}



/** Props del componente */
interface AdminDashboardMainProps {
    user: Usuario;
    onLogout: () => void;
}

/** Componente principal del dashboard administrativo */
const AdminDashboardMain: React.FC<AdminDashboardMainProps> = ({ user, onLogout }) => {
    const [activeModule, setActiveModule] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    /** Función para verificar si el usuario tiene un permiso específico */
    const hasPermission = (permissionName: string): boolean => {
        return user.permisos.some(permiso => permiso.nombre === permissionName);
    };

    /** Renderizar el contenido del módulo activo */
    const renderModuleContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando...</p>
                    </div>
                </div>
            );
        }

        switch (activeModule) {
            case 'dashboard':
                return <DashboardOverview user={user} />;
            
            case 'dashboard-avanzado':
                return <DashboardAvanzado />;
            
            case 'usuarios':
                return <UserManagement user={user} />;
            
            case 'usuarios-lista':
                return <UserManagement user={user} />;
            
            case 'usuarios-crear':
                return <UserCreationForm user={user} />;
            
            case 'roles':
                return <RoleManagement user={user} />;
            
            case 'privilegios':
                return <PrivilegeManagement user={user} />;
            
            case 'estados-reposicion':
            case 'estados-compra':
            case 'estados-venta-online':
                return <StatusManagement user={user} moduleType={activeModule} />;
            
            // Módulos de inventario
            case 'almacen':
                return <ModulePlaceholder title="Gestión de Almacén" user={user} />;
            case 'inventario-tienda':
                return <ModulePlaceholder title="Inventario de Tienda" user={user} />;
            case 'reposicion':
                return <ReposicionManagement user={user} />;
            case 'reposiciones':
                return <ModulePlaceholder title="Gestión de Reposiciones" user={user} />;
            
            // Módulos de ventas (nuevos)
            case 'ventas':
                return <VentasManagement user={user} />;
            case 'ventas-web':
                return <VentasWebManagement 
                    user={user}
                    canView={true}
                    canCreate={true}
                    canUpdate={true}
                    canDelete={true}
                />;
            case 'ventas-tienda':
                return <VentasTiendaManagement 
                    user={user}
                    canView={true}
                    canCreate={true}
                    canUpdate={true}
                    canDelete={true}
                />;
            
            // Módulos de ventas (legacy)
            case 'ventas-fisicas':
                return <ModulePlaceholder title="Ventas Físicas" user={user} />;
            case 'ventas-online':
                return <ModulePlaceholder title="Ventas Online" user={user} />;
            case 'ventas-eventos':
                return <ModulePlaceholder title="Ventas en Eventos" user={user} />;
            
            // Módulos eliminados: compras-mayoristas, clientes, empleados, miembros
            
            // Módulos de eventos
            case 'eventos-lista':
                return <EventosManagement />;
            case 'tipos-evento':
                return <TiposEventoManagement />;
            case 'entradas':
                return <EntradasManagement />;
            case 'asistencia':
                return <AsistenciaManagement />;
            case 'inventario-eventos':
                return <ModulePlaceholder title="Inventario de Eventos" user={user} />;
            case 'ofertas':
                return <OfertasManagement />;
            case 'compras':
                return <ComprasManagement user={user} />;
            
            // Módulos de reportes
            case 'reportes':
                return <ReportesManagement user={user} />;
            
            default:
                return <div className="p-6 text-center text-gray-500">Módulo no encontrado</div>;
        }
    };

    /** Obtener el título del módulo activo */
    const getModuleTitle = () => {
        const moduleNames: { [key: string]: string } = {
            'dashboard': 'Dashboard Principal',
            'dashboard-avanzado': 'Dashboard Avanzado',
            'usuarios': 'Gestión de Usuarios',
            'usuarios-lista': 'Lista de Usuarios',
            'usuarios-crear': 'Crear Usuario',
            'roles': 'Gestión de Roles',
            'privilegios': 'Gestión de Privilegios',
            'estados-reposicion': 'Estados de Reposición',
            'estados-compra': 'Estados de Compra',
            'estados-venta-online': 'Estados de Venta Online',
            'almacen': 'Gestión de Almacén',
            'inventario-tienda': 'Inventario de Tienda',
            'reposicion': 'Gestión de Reposición',
            'reposiciones': 'Gestión de Reposiciones',
            'ventas': 'Gestión de Ventas',
            'ventas-web': 'Ventas Online',
            'ventas-tienda': 'Ventas en Tienda',
            'ventas-fisicas': 'Ventas Físicas',
            'ventas-online': 'Ventas Online',
            'ventas-eventos': 'Ventas en Eventos',

            'eventos-lista': 'Gestión de Eventos',
            'tipos-evento': 'Tipos de Evento',
            'entradas': 'Gestión de Entradas',
            'asistencia': 'Control de Asistencia',
            'inventario-eventos': 'Inventario de Eventos',
            'ofertas': 'Gestión de Ofertas',
            'compras': 'Gestión de Compras',
            'reportes': 'Gestión de Reportes'
        };
        return moduleNames[activeModule] || 'Módulo Desconocido';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Ahora es fijo */}
            <AdminSidebar
                user={user}
                activeModule={activeModule}
                onModuleChange={setActiveModule}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Contenido principal - Con margen para compensar el sidebar fijo */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                isSidebarCollapsed ? 'ml-16' : 'ml-64'
            }`}>
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {getModuleTitle()}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Sistema de Gestión ACAUCAB
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Información del usuario */}
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                    {user.username}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user.rol.nombre}
                                    {user.entidad && user.tipo_entidad === 'empleado' && (user.entidad as any).departamento && (
                                        <span> • {(user.entidad as any).departamento}</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Botón de logout */}
                            <button
                                onClick={onLogout}
                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                title="Cerrar sesión"
                            >
                                <span className="mr-2">🚪</span>
                                Salir
                            </button>
                        </div>
                    </div>
                </header>

                {/* Contenido del módulo */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-6">
                        {renderModuleContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

/** Componente de overview del dashboard */
const DashboardOverview: React.FC<{ user: Usuario }> = ({ user }) => {
    const [stats, setStats] = useState({
        totalUsuarios: 0,
        totalRoles: 0,
        totalPrivilegios: 0,
        modulosDisponibles: 0
    });

    useEffect(() => {
        // Simular carga de estadísticas
        setStats({
            totalUsuarios: 25,
            totalRoles: 4,
            totalPrivilegios: user.permisos.length,
            modulosDisponibles: 12
        });
    }, [user]);

    return (
        <div className="space-y-6">
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-3xl">👥</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsuarios}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-3xl">🔑</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Roles Activos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalRoles}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-3xl">🛡️</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Mis Privilegios</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalPrivilegios}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-3xl">📊</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Módulos Disponibles</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.modulosDisponibles}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información del usuario actual */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Sesión</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Usuario</p>
                        <p className="text-base text-gray-900">{user.username}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Rol</p>
                        <p className="text-base text-gray-900">{user.rol.nombre}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Tipo de Entidad</p>
                        <p className="text-base text-gray-900 capitalize">{user.tipo_entidad}</p>
                    </div>
                    {user.entidad && user.tipo_entidad === 'empleado' && (
                        <div>
                            <p className="text-sm font-medium text-gray-600">Departamento</p>
                            <p className="text-base text-gray-900">{(user.entidad as any).departamento || 'No asignado'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lista de permisos del usuario (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Permisos Activos (Debug)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {user.permisos.map((permiso, index) => (
                            <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {permiso.nombre}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/** Componente placeholder para módulos no implementados */
const ModulePlaceholder: React.FC<{ title: string; user: Usuario }> = ({ title, user }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">Este módulo está en desarrollo</p>
            <p className="text-sm text-gray-500">
                Tienes acceso a este módulo con el rol: <strong>{user.rol.nombre}</strong>
            </p>
        </div>
    );
};

/** Componente para crear usuarios */
const UserCreationForm: React.FC<{ user: Usuario }> = ({ user }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Crear Nuevo Usuario</h2>
            <p className="text-gray-600">Formulario de creación de usuarios en desarrollo...</p>
        </div>
    );
};

export default AdminDashboardMain; 