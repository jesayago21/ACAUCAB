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

        // Gestión de productos - usar permisos básicos
        case 'productos':
        case 'cervezas':
            return hasPermission(user, 'Consultar cerveza');
        case 'recetas':
            return hasPermission(user, 'Consultar receta');
        case 'presentaciones':
            return hasPermission(user, 'Consultar presentacion');
        case 'tipos-cerveza':
            return hasPermission(user, 'Consultar tipo_cerveza');
        case 'caracteristicas':
            return hasPermission(user, 'Consultar caracteristica');
        case 'ingredientes':
            return hasPermission(user, 'Consultar ingrediente');

        // Gestión de inventario - usar permisos básicos
        case 'inventario':
        case 'almacen':
            return hasPermission(user, 'Consultar almacen');
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
        case 'puntos':
            return hasPermission(user, 'Consultar cliente'); // Los puntos están relacionados con clientes

        // Gestión de compras - usar permisos básicos
        case 'compras':
        case 'estados-compra':
            return hasPermission(user, 'Consultar compra');

        // Gestión de eventos y ofertas - usar permisos básicos
        case 'eventos-ofertas':
        case 'eventos':
            return hasPermission(user, 'Consultar evento');
        case 'tipos-evento':
            return hasPermission(user, 'Consultar tipo_evento');
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
            id: 'productos',
            name: 'Productos',
            icon: '🍺',
            children: [
                { id: 'cervezas', name: 'Cervezas', icon: '🍻' },
                { id: 'recetas', name: 'Recetas', icon: '📝' },
                { id: 'presentaciones', name: 'Presentaciones', icon: '📦' },
                { id: 'tipos-cerveza', name: 'Tipos de Cerveza', icon: '🏷️' },
                { id: 'caracteristicas', name: 'Características', icon: '⭐' },
                { id: 'ingredientes', name: 'Ingredientes', icon: '🌾' }
            ]
        },
        {
            id: 'inventario',
            name: 'Inventario y Operaciones',
            icon: '📦',
            children: [
                { id: 'almacen', name: 'Almacén', icon: '🏪' },
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
                { id: 'puntos', name: 'Gestión de Puntos', icon: '⭐' }
            ]
        },

        {
            id: 'eventos-ofertas',
            name: 'Eventos y Ofertas',
            icon: '🎊',
            children: [
                { id: 'eventos', name: 'Eventos', icon: '📅' },
                { id: 'tipos-evento', name: 'Tipos de Evento', icon: '🎭' },
                { id: 'ofertas', name: 'Ofertas', icon: '🏷️' }
            ]
        },
        {
            id: 'compras',
            name: 'Compras',
            icon: '🛒',
            children: [
                { id: 'compras', name: 'Órdenes de Compra', icon: '📋' },
                { id: 'estados-compra', name: 'Estados de Compra', icon: '📊' }
            ]
        },
        {
            id: 'reportes',
            name: 'Reportes',
            icon: '📈',
            children: [
                { id: 'reportes-ventas', name: 'Reportes de Ventas', icon: '💹' },
                { id: 'reportes-inventario', name: 'Reportes de Inventario', icon: '📊' },
                { id: 'reportes-financieros', name: 'Reportes Financieros', icon: '💰' }
            ]
        },
        {
            id: 'pagos',
            name: 'Pagos',
            icon: '💳',
            children: [
                { id: 'pagos', name: 'Gestión de Pagos', icon: '💸' }
            ]
        }
    ];

    /** Filtrar módulos según permisos del usuario */
    const visibleModules = menuModules.map(module => ({
        ...module,
        children: module.children.filter(child => canAccessModule(user, child.id))
    })).filter(module => 
        canAccessModule(user, module.id) || module.children.length > 0
    );

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
                            {module.children.length > 0 && (module.id === 'productos' || module.id === 'inventario' || module.id === 'ventas' || module.id === 'compras' || module.id === 'eventos-ofertas') ? (
                                // Módulos padre que no son clickeables
                                <div className={`w-full flex items-center p-3 rounded-lg text-gray-400 cursor-default ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                                    <span className="text-lg">{module.icon}</span>
                                    {!isCollapsed && (
                                        <span className="ml-3 font-medium">{module.name}</span>
                                    )}
                                </div>
                            ) : (
                                // Módulos clickeables (dashboard, usuarios, reportes, pagos, etc.)
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