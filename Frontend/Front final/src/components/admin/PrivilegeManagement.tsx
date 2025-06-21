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
interface PrivilegeManagementProps {
    user: User;
}

/** Interfaz para los privilegios del sistema */
interface SystemPrivilege {
    clave: number;
    nombre: string;
    descripcion?: string;
}

/** Componente de gestión de privilegios */
const PrivilegeManagement: React.FC<PrivilegeManagementProps> = ({ user }) => {
    const [privileges, setPrivileges] = useState<SystemPrivilege[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    /** Verificar si el usuario tiene un permiso específico */
    const hasPermission = (permissionName: string): boolean => {
        return user.permisos.some(permiso => permiso.nombre === permissionName);
    };

    /** Cargar privilegios desde la API */
    const loadPrivileges = async () => {
        try {
            const response = await fetch('/api/privileges');
            if (response.ok) {
                const data = await response.json();
                setPrivileges(data);
            } else {
                setError('Error al cargar los privilegios');
            }
        } catch (err) {
            setError('Error de conexión al cargar privilegios');
        } finally {
            setLoading(false);
        }
    };

    /** Efecto inicial para cargar datos */
    useEffect(() => {
        loadPrivileges();
    }, []);

    /** Filtrar privilegios según búsqueda y categoría */
    const filteredPrivileges = privileges.filter(privilege => {
        const matchesSearch = privilege.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (privilege.descripcion && privilege.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (selectedCategory === 'all') return matchesSearch;
        
        // Categorizar privilegios por tipo de operación
        const categories = {
            'crear': privilege.nombre.startsWith('crear'),
            'consultar': privilege.nombre.startsWith('consultar'),
            'modificar': privilege.nombre.startsWith('modificar'),
            'eliminar': privilege.nombre.startsWith('eliminar'),
            'especiales': !privilege.nombre.startsWith('crear') && 
                         !privilege.nombre.startsWith('consultar') && 
                         !privilege.nombre.startsWith('modificar') && 
                         !privilege.nombre.startsWith('eliminar')
        };
        
        return matchesSearch && categories[selectedCategory as keyof typeof categories];
    });

    /** Obtener categorías de privilegios */
    const getPrivilegeCategories = () => {
        const categories = {
            'all': 'Todos',
            'crear': 'Crear',
            'consultar': 'Consultar',
            'modificar': 'Modificar',
            'eliminar': 'Eliminar',
            'especiales': 'Especiales'
        };
        return categories;
    };

    /** Verificar permisos de acceso */
    if (!hasPermission('consultar privilegio') && !hasPermission('gestionar roles privilegios')) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
                <p className="text-gray-600">No tienes permisos para acceder a la gestión de privilegios</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando privilegios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Privilegios</h2>
                    <p className="text-gray-600">Consulta los privilegios disponibles en el sistema</p>
                </div>
                {hasPermission('crear privilegio') && (
                    <button
                        onClick={() => {
                            // TODO: Implementar creación de privilegios
                            alert('Creación de privilegios en desarrollo');
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Crear Privilegio
                    </button>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Filtros */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Búsqueda */}
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar Privilegios
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Buscar por nombre o descripción..."
                        />
                    </div>

                    {/* Categorías */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.entries(getPrivilegeCategories()).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">{privileges.length}</div>
                    <div className="text-sm text-gray-600">Total Privilegios</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-green-600">{filteredPrivileges.length}</div>
                    <div className="text-sm text-gray-600">Filtrados</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-purple-600">{user.permisos.length}</div>
                    <div className="text-sm text-gray-600">Mis Privilegios</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                        {privileges.filter(p => !p.nombre.startsWith('crear') && 
                                                !p.nombre.startsWith('consultar') && 
                                                !p.nombre.startsWith('modificar') && 
                                                !p.nombre.startsWith('eliminar')).length}
                    </div>
                    <div className="text-sm text-gray-600">Especiales</div>
                </div>
            </div>

            {/* Lista de privilegios */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Privilegios del Sistema ({filteredPrivileges.length})
                    </h3>
                </div>

                {filteredPrivileges.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {filteredPrivileges.map((privilege) => {
                            const isUserPrivilege = user.permisos.some(p => p.nombre === privilege.nombre);
                            return (
                                <div key={privilege.clave} className={`p-6 ${isUserPrivilege ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <h4 className="text-lg font-medium text-gray-900">
                                                    {privilege.nombre}
                                                </h4>
                                                {isUserPrivilege && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ✓ Tienes este privilegio
                                                    </span>
                                                )}
                                            </div>
                                            {privilege.descripcion && (
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {privilege.descripcion}
                                                </p>
                                            )}
                                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                                <span>ID: {privilege.clave}</span>
                                                <span>
                                                    Tipo: {
                                                        privilege.nombre.startsWith('crear') ? 'Crear' :
                                                        privilege.nombre.startsWith('consultar') ? 'Consultar' :
                                                        privilege.nombre.startsWith('modificar') ? 'Modificar' :
                                                        privilege.nombre.startsWith('eliminar') ? 'Eliminar' :
                                                        'Especial'
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {hasPermission('modificar privilegio') && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        // TODO: Implementar edición de privilegio
                                                        alert(`Editar privilegio: ${privilege.nombre}`);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                >
                                                    ✏️ Editar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron privilegios</h3>
                        <p className="text-gray-500">
                            {searchTerm || selectedCategory !== 'all' 
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'No hay privilegios disponibles'}
                        </p>
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
                            Información sobre Privilegios
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Atómicos:</strong> Privilegios básicos por tabla (crear, consultar, modificar, eliminar)</li>
                                <li><strong>Especiales:</strong> Privilegios derivados automáticamente de combinaciones de atómicos</li>
                                <li><strong>Roles:</strong> Los privilegios se asignan a través de roles</li>
                                <li><strong>Dinámicos:</strong> Los permisos especiales se calculan en tiempo real</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivilegeManagement;
