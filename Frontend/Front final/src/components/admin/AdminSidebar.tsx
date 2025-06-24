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
            return true;

        // Gestión de usuarios - requiere permisos de usuario o dashboard admin
        case 'usuarios':
            return hasPermission(user, 'Consultar usuario') || 
                   hasPermission(user, 'Consultar empleado') ||
                   hasPermission(user, 'Consultar miembro') ||
                   hasPermission(user, 'Consultar cliente') ||
                   hasPermission(user, 'ver dashboard admin') ||
                   hasPermission(user, 'Crear usuario') ||
                   hasPermission(user, 'Modificar usuario') ||
                   hasPermission(user, 'Eliminar usuario');
        case 'roles':
            return hasPermission(user, 'Consultar rol') || 
                   hasPermission(user, 'Crear rol') ||
                   hasPermission(user, 'Modificar rol') ||
                   hasPermission(user, 'Eliminar rol') ||
                   hasPermission(user, 'gestionar roles privilegios');
        case 'privilegios':
            return hasPermission(user, 'Consultar privilegio') || 
                   hasPermission(user, 'gestionar roles privilegios');

        // Gestión de productos
        case 'cervezas':
            return hasPermission(user, 'consultar cerveza');
        case 'recetas':
            return hasPermission(user, 'consultar receta');
        case 'presentaciones':
            return hasPermission(user, 'consultar presentacion');
        case 'tipos-cerveza':
            return hasPermission(user, 'consultar tipo cerveza');
        case 'caracteristicas':
            return hasPermission(user, 'consultar caracteristica');
        case 'ingredientes':
            return hasPermission(user, 'consultar ingrediente');

        // Gestión de inventario
        case 'almacen':
            return hasPermission(user, 'consultar almacen');
        case 'inventario-tienda':
            return hasPermission(user, 'consultar inventario');
        case 'reposiciones':
            return hasPermission(user, 'consultar reposicion');
        case 'estados-reposicion':
            return hasPermission(user, 'gestionar estados reposicion');

        // Gestión de ventas (nuevos módulos)
        case 'ventas':
            return hasPermission(user, 'consultar venta_tienda_fisica') ||
                   hasPermission(user, 'Consultar venta_tienda_fisica') ||
                   hasPermission(user, 'consultar venta_online') ||
                   hasPermission(user, 'Consultar venta_online') ||
                   hasPermission(user, 'consultar venta_evento') ||
                   hasPermission(user, 'Consultar venta_evento') ||
                   hasPermission(user, 'consultar puntos') ||
                   hasPermission(user, 'Consultar puntos');
        case 'ventas-web':
            return hasPermission(user, 'consultar venta_online') || hasPermission(user, 'Consultar venta_online');
        case 'ventas-tienda':
            return hasPermission(user, 'consultar venta_tienda_fisica') || hasPermission(user, 'Consultar venta_tienda_fisica');
        case 'puntos':
            return hasPermission(user, 'consultar puntos') || hasPermission(user, 'Consultar puntos');

        // Gestión de compras (nuevo módulo)
        case 'compras-mayoristas':
            return hasPermission(user, 'consultar compra') || hasPermission(user, 'Consultar compra');

        // Gestión de reposición (nuevo módulo como hijo de inventario)
        case 'reposicion':
            return hasPermission(user, 'consultar reposicion') || hasPermission(user, 'Consultar reposicion');

        // Módulos legacy (mantener por compatibilidad)
        case 'ventas-fisicas':
            return hasPermission(user, 'consultar venta tienda fisica');
        case 'ventas-online':
            return hasPermission(user, 'consultar venta online');
        case 'ventas-eventos':
            return hasPermission(user, 'consultar venta evento');
        case 'estados-venta-online':
            return hasPermission(user, 'gestionar estados venta online');
        case 'compras':
            return hasPermission(user, 'Consultar compra');
        case 'estados-compra':
            return hasPermission(user, 'gestionar estados compra');

        // Gestión de clientes y miembros
        case 'personas':
        case 'clientes':
            return hasPermission(user, 'Consultar cliente');
        case 'empleados':
            return hasPermission(user, 'Consultar empleado');
        case 'miembros':
            return hasPermission(user, 'Consultar miembro');

        // Gestión de eventos y ofertas
        case 'eventos':
            return hasPermission(user, 'consultar evento');
        case 'ofertas':
            return hasPermission(user, 'consultar oferta');

        // Reportes
        case 'reportes-ventas':
            return hasPermission(user, 'ver reportes ventas');
        case 'reportes-inventario':
            return hasPermission(user, 'ver reportes inventario');
        case 'reportes-financieros':
            return hasPermission(user, 'ver reportes financieros');
        case 'reportes':
            // Temporalmente permitir acceso a reportes para todos los usuarios autenticados
            return true;
            /* Cuando se creen los permisos, usar:
            return hasPermission(user, 'ver reportes ventas') ||
                   hasPermission(user, 'ver reportes inventario') ||
                   hasPermission(user, 'ver reportes financieros') ||
                   hasPermission(user, 'consultar reporte') ||
                   hasPermission(user, 'Consultar reporte');
            */

        // Gestión de pagos
        case 'pagos':
            return hasPermission(user, 'consultar pago');

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
            children: []
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
            name: 'Inventario',
            icon: '📦',
            children: [
                { id: 'almacen', name: 'Almacén', icon: '🏪' },
                { id: 'inventario-tienda', name: 'Inventario Tienda', icon: '🏬' },
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
            id: 'compras-mayoristas',
            name: 'Compras Mayoristas',
            icon: '🛒',
            children: []
        },
        {
            id: 'personas',
            name: 'Personas',
            icon: '👤',
            children: [
                { id: 'clientes', name: 'Clientes', icon: '👨‍💼' },
                { id: 'empleados', name: 'Empleados', icon: '👷' },
                { id: 'miembros', name: 'Miembros', icon: '🤝' }
            ]
        },
        {
            id: 'eventos-ofertas',
            name: 'Eventos y Ofertas',
            icon: '🎊',
            children: [
                { id: 'eventos', name: 'Eventos', icon: '📅' },
                { id: 'ofertas', name: 'Ofertas', icon: '🏷️' }
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
        <div className={`bg-gray-900 text-white h-full transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
        }`}>
            {/* Header del sidebar */}
            <div className="p-4 border-b border-gray-700">
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

            {/* Información del usuario */}
            {!isCollapsed && (
                <div className="p-4 border-b border-gray-700">
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

            {/* Navegación */}
            <nav className="flex-1 overflow-y-auto">
                <div className="p-2">
                    {visibleModules.map(module => (
                        <div key={module.id} className="mb-2">
                            {/* Módulo principal */}
                            {module.children.length > 0 && (module.id === 'personas' || module.id === 'productos' || module.id === 'inventario' || module.id === 'ventas' || module.id === 'compras' || module.id === 'eventos-ofertas') ? (
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

            {/* Footer con información de permisos (solo en modo debug) */}
            {!isCollapsed && process.env.NODE_ENV === 'development' && (
                <div className="p-2 border-t border-gray-700 text-xs text-gray-500">
                    <div>Permisos: {user.permisos.length}</div>
                    <div>Módulos visibles: {visibleModules.length}</div>
                </div>
            )}
        </div>
    );
};

export default AdminSidebar; 