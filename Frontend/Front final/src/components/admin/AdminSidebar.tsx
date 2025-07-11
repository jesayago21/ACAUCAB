import React from 'react';

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

/** Props del componente AdminSidebar */
interface AdminSidebarProps {
    user: User;
    activeModule: string;
    onModuleChange: (module: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

/** Función para verificar si el usuario tiene un permiso específico */
const hasPermission = (user: User, permissionName: string): boolean => {
    return user.permisos.some(permiso => permiso.nombre === permissionName);
};

/** Función para verificar si el usuario puede acceder a un módulo */
const canAccessModule = (user: User, module: string): boolean => {
    switch (module) {
        // Dashboard principal - todos pueden acceder
        case 'dashboard':
        case 'dashboard-avanzado':
            return true;

        // Gestión de usuarios - usar permisos básicos
        case 'usuarios':
            return hasPermission(user, 'Consultar usuario');
        case 'roles':
            return hasPermission(user, 'Consultar rol');
        case 'privilegios':
            return hasPermission(user, 'Consultar privilegio');

        // Gestión de inventario - usar permisos básicos
        case 'inventario':
            return true; // El módulo padre siempre debe ser visible si tiene hijos
        case 'almacen':
            return hasPermission(user, 'Consultar almacen');
        case 'inventario-tienda':
            return hasPermission(user, 'Consultar inventario_tienda');
        case 'reposicion':
        case 'reposiciones':
        case 'estados-reposicion':
            return hasPermission(user, 'Consultar reposicion') || user.rol.nombre === 'Jefe de Pasillo';

        // Gestión de ventas - usar permisos básicos
        case 'ventas':
            return hasPermission(user, 'Consultar venta_tienda_fisica') ||
                   hasPermission(user, 'Consultar venta_online') ||
                   hasPermission(user, 'Consultar venta_evento');
        case 'ventas-web':
        case 'ventas-online':
            return hasPermission(user, 'Consultar venta_online');
        case 'ventas-tienda':
        case 'ventas-fisicas':
            return hasPermission(user, 'Consultar venta_tienda_fisica');
        case 'ventas-eventos':
            return hasPermission(user, 'Consultar venta_evento');

        // Gestión de compras - usar permisos básicos
        case 'compras':
        case 'estados-compra':
            const canAccessCompras = hasPermission(user, 'Consultar compra') || hasPermission(user, 'consultar compra');
            console.log('Verificando acceso a compras:', {
                module: module,
                userPermisos: user.permisos.map(p => p.nombre),
                hasPermission: canAccessCompras
            });
            return canAccessCompras;

        // Gestión de eventos - usar permisos básicos
        case 'eventos':
        case 'eventos-lista':
            return hasPermission(user, 'Consultar evento');
        case 'tipos-evento':
            return hasPermission(user, 'Consultar tipo_evento');
        case 'entradas':
            return hasPermission(user, 'Consultar venta_entrada');
        case 'asistencia':
            return hasPermission(user, 'Consultar asistencia');
        case 'inventario-eventos':
            return hasPermission(user, 'Consultar inventario_evento');
        case 'ofertas':
            return hasPermission(user, 'Consultar oferta');

        // Reportes - permitir a todos por ahora
        case 'reportes':
        case 'reportes-ventas':
        case 'reportes-inventario':
        case 'reportes-financieros':
            return true; // Temporalmente permitir a todos

        // Gestión de pagos - usar permisos básicos
        case 'pagos':
            return hasPermission(user, 'Consultar pago');

        default:
            return false;
    }
};

/** Componente AdminSidebar */
const AdminSidebar: React.FC<AdminSidebarProps> = ({
    user,
    activeModule,
    onModuleChange,
    isCollapsed,
    onToggleCollapse
}) => {
    /** Estructura de módulos del menú */
    const menuModules = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: '📊',
            children: [
                { id: 'dashboard-avanzado', name: 'Dashboard Avanzado', icon: '📈' }
            ]
        },
        {
            id: 'usuarios',
            name: 'Gestión de Usuarios',
            icon: '👥',
            children: [
                { id: 'roles', name: 'Roles', icon: '🔑' },
                { id: 'privilegios', name: 'Privilegios', icon: '🛡️' }
            ]
        },
        {
            id: 'inventario',
            name: 'Inventario y Operaciones',
            icon: '📦',
            children: [
                { id: 'compras', name: 'Órdenes de Compra', icon: '📋' },
                { id: 'inventario-tienda', name: 'Inventario de Tienda', icon: '🏪' },
                { id: 'almacen', name: 'Almacén', icon: '🏢' },
                { id: 'reposicion', name: 'Reposición', icon: '🔄' },
                { id: 'estados-reposicion', name: 'Estados de Reposición', icon: '📊' }
            ]
        },
        {
            id: 'ventas',
            name: 'Gestión de Ventas',
            icon: '💰',
            children: [
                { id: 'ventas-web', name: 'Ventas Online', icon: '🌐' },
                { id: 'ventas-tienda', name: 'Ventas Tienda', icon: '🏪' },
                { id: 'ofertas', name: 'Ofertas', icon: '🏷️' }
            ]
        },
        {
            id: 'eventos',
            name: 'Eventos',
            icon: '🎊',
            children: [
                { id: 'eventos-lista', name: 'Eventos', icon: '📅' },
                { id: 'tipos-evento', name: 'Tipos de Evento', icon: '🎭' },
                { id: 'entradas', name: 'Entradas', icon: '🎫' },
                { id: 'asistencia', name: 'Asistencia', icon: '✅' },
                { id: 'ventas-eventos', name: 'Ventas de Eventos', icon: '💰' },
                { id: 'inventario-eventos', name: 'Inventario de Eventos', icon: '📦' }
            ]
        },
        {
            id: 'reportes',
            name: 'Reportes',
            icon: '📈',
            children: []
        }
    ];

    /** Filtrar módulos según permisos del usuario */
    const visibleModules = menuModules.map(module => ({
        ...module,
        children: module.children.filter(child => canAccessModule(user, child.id))
    })).filter(module => 
        canAccessModule(user, module.id) || module.children.length > 0
    );

    console.log('Módulos visibles:', {
        allModules: menuModules,
        visibleModules: visibleModules,
        userPermisos: user.permisos.map(p => p.nombre)
    });

    return (
        <div className={`bg-gray-900 text-white h-screen fixed left-0 top-0 z-50 transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
        }`}>
            {/* Header del sidebar - Fijo */}
            <div className="p-4 border-b border-gray-700 bg-gray-900">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                        <span className="text-2xl">🍺</span>
                        {!isCollapsed && (
                            <span className="ml-2 font-bold text-lg">ACAUCAB</span>
                        )}
                    </div>
                    <button
                        onClick={onToggleCollapse}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
                    >
                        <span className="text-lg">
                            {isCollapsed ? '→' : '←'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Información del usuario - Fija */}
            {!isCollapsed && (
                <div className="p-4 border-b border-gray-700 bg-gray-900">
                    <div className="text-sm">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-gray-400">{user.rol.nombre}</div>
                        {user.entidad && (
                            <div className="text-gray-500 text-xs mt-1">
                                {user.tipo_entidad === 'empleado' && user.entidad.departamento && (
                                    <span>{user.entidad.departamento}</span>
                                )}
                                {user.tipo_entidad === 'miembro' && (
                                    <span>{user.entidad.razon_social}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Navegación - Con scroll interno */}
            <nav className="flex-1 overflow-y-auto sidebar-scroll" style={{ height: 'calc(100vh - 140px)' }}>
                <div className="p-2">
                    {visibleModules.map(module => (
                        <div key={module.id} className="mb-2">
                            {/* Módulo principal */}
                            {module.children.length > 0 && (module.id === 'inventario' || module.id === 'eventos' || module.id === 'usuarios' || module.id === 'ventas') ? (
                                // Módulos padre que no son clickeables
                                <div className={`w-full flex items-center p-3 rounded-lg text-gray-400 cursor-default ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                                    <span className="text-lg">{module.icon}</span>
                                    {!isCollapsed && (
                                        <span className="ml-3 font-medium">{module.name}</span>
                                    )}
                                </div>
                            ) : (
                                // Módulos clickeables (dashboard, usuarios, reportes, pagos, ventas, etc.)
                            <button
                                onClick={() => onModuleChange(module.id)}
                                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                                    activeModule === module.id
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-700 text-gray-300'
                                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                                title={isCollapsed ? module.name : ''}
                            >
                                <span className="text-lg">{module.icon}</span>
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium">{module.name}</span>
                                )}
                            </button>
                            )}

                            {/* Submódulos */}
                            {!isCollapsed && module.children.length > 0 && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {module.children.map(child => (
                                        <button
                                            key={child.id}
                                            onClick={() => onModuleChange(child.id)}
                                            className={`w-full flex items-center p-2 rounded transition-colors text-sm ${
                                                activeModule === child.id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'hover:bg-gray-700 text-gray-400'
                                            }`}
                                        >
                                            <span className="mr-2">{child.icon}</span>
                                            <span>{child.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </nav>

            {/* Footer con información de permisos (solo en modo debug) - Fijo */}
            {!isCollapsed && process.env.NODE_ENV === 'development' && (
                <div className="p-2 border-t border-gray-700 text-xs text-gray-500 bg-gray-900">
                    <div>Permisos: {user.permisos.length}</div>
                    <div>Módulos visibles: {visibleModules.length}</div>
                </div>
            )}
        </div>
    );
};

export default AdminSidebar; 