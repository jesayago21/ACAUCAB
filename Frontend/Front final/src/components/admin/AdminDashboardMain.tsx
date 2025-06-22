import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import RoleManagement from './RoleManagement';
import UserManagement from './UserManagement';
import PrivilegeManagement from './PrivilegeManagement';
import StatusManagement from './StatusManagement';
import type { Usuario } from '../../types/auth';

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
            
            // Módulos de productos
            case 'cervezas':
                return <ModulePlaceholder title="Gestión de Cervezas" user={user} />;
            case 'recetas':
                return <ModulePlaceholder title="Gestión de Recetas" user={user} />;
            case 'presentaciones':
                return <ModulePlaceholder title="Gestión de Presentaciones" user={user} />;
            
            // Módulos de inventario
            case 'almacen':
                return <ModulePlaceholder title="Gestión de Almacén" user={user} />;
            case 'inventario-tienda':
                return <ModulePlaceholder title="Inventario de Tienda" user={user} />;
            case 'reposiciones':
                return <ModulePlaceholder title="Gestión de Reposiciones" user={user} />;
            
            // Módulos de ventas
            case 'ventas-fisicas':
                return <ModulePlaceholder title="Ventas Físicas" user={user} />;
            case 'ventas-online':
                return <ModulePlaceholder title="Ventas Online" user={user} />;
            case 'ventas-eventos':
                return <ModulePlaceholder title="Ventas en Eventos" user={user} />;
            
            // Módulos de compras
            case 'compras':
                return <ModulePlaceholder title="Órdenes de Compra" user={user} />;
            
            // Módulos de personas
            case 'clientes':
                return <ModulePlaceholder title="Gestión de Clientes" user={user} />;
            case 'empleados':
                return <ModulePlaceholder title="Gestión de Empleados" user={user} />;
            case 'miembros':
                return <ModulePlaceholder title="Gestión de Miembros" user={user} />;
            
            // Módulos de eventos y ofertas
            case 'eventos':
                return <ModulePlaceholder title="Gestión de Eventos" user={user} />;
            case 'ofertas':
                return <ModulePlaceholder title="Gestión de Ofertas" user={user} />;
            
            // Módulos de reportes
            case 'reportes-ventas':
                return <ModulePlaceholder title="Reportes de Ventas" user={user} />;
            case 'reportes-inventario':
                return <ModulePlaceholder title="Reportes de Inventario" user={user} />;
            case 'reportes-financieros':
                return <ModulePlaceholder title="Reportes Financieros" user={user} />;
            
            // Módulos de pagos
            case 'pagos':
                return <ModulePlaceholder title="Gestión de Pagos" user={user} />;
            
            default:
                return <div className="p-6 text-center text-gray-500">Módulo no encontrado</div>;
        }
    };

    /** Obtener el título del módulo activo */
    const getModuleTitle = () => {
        const moduleNames: { [key: string]: string } = {
            'dashboard': 'Dashboard Principal',
            'usuarios-lista': 'Lista de Usuarios',
            'usuarios-crear': 'Crear Usuario',
            'roles': 'Gestión de Roles',
            'privilegios': 'Gestión de Privilegios',
            'estados-reposicion': 'Estados de Reposición',
            'estados-compra': 'Estados de Compra',
            'estados-venta-online': 'Estados de Venta Online',
            'cervezas': 'Gestión de Cervezas',
            'recetas': 'Gestión de Recetas',
            'presentaciones': 'Gestión de Presentaciones',
            'almacen': 'Gestión de Almacén',
            'inventario-tienda': 'Inventario de Tienda',
            'reposiciones': 'Gestión de Reposiciones',
            'ventas-fisicas': 'Ventas Físicas',
            'ventas-online': 'Ventas Online',
            'ventas-eventos': 'Ventas en Eventos',
            'compras': 'Órdenes de Compra',
            'clientes': 'Gestión de Clientes',
            'empleados': 'Gestión de Empleados',
            'miembros': 'Gestión de Miembros',
            'eventos': 'Gestión de Eventos',
            'ofertas': 'Gestión de Ofertas',
            'reportes-ventas': 'Reportes de Ventas',
            'reportes-inventario': 'Reportes de Inventario',
            'reportes-financieros': 'Reportes Financieros',
            'pagos': 'Gestión de Pagos'
        };
        return moduleNames[activeModule] || 'Módulo Desconocido';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar
                user={user}
                activeModule={activeModule}
                onModuleChange={setActiveModule}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
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
                                    {user.entidad && user.tipo_entidad === 'empleado' && user.entidad.departamento && (
                                        <span> • {user.entidad.departamento}</span>
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
                            <p className="text-base text-gray-900">{user.entidad.departamento || 'No asignado'}</p>
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
const ModulePlaceholder: React.FC<{ title: string; user: User }> = ({ title, user }) => {
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
const UserCreationForm: React.FC<{ user: User }> = ({ user }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Crear Nuevo Usuario</h2>
            <p className="text-gray-600">Formulario de creación de usuarios en desarrollo...</p>
        </div>
    );
};

export default AdminDashboardMain; 