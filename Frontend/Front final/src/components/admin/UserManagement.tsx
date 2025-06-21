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
interface UserManagementProps {
    user: User;
}

/** Interfaz para los usuarios del sistema */
interface SystemUser {
    clave: number;
    username: string;
    rol: string;
    fk_empleado?: number;
    fk_miembro?: number;
    fk_cliente?: number;
}

/** Componente de gestión de usuarios */
const UserManagement: React.FC<UserManagementProps> = ({ user }) => {
    const [users, setUsers] = useState<SystemUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /** Verificar si el usuario tiene un permiso específico */
    const hasPermission = (permissionName: string): boolean => {
        return user.permisos.some(permiso => permiso.nombre === permissionName);
    };

    /** Cargar usuarios desde la API */
    const loadUsers = async () => {
        try {
            const response = await fetch('/api/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                setError('Error al cargar los usuarios');
            }
        } catch (err) {
            setError('Error de conexión al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    /** Efecto inicial para cargar datos */
    useEffect(() => {
        loadUsers();
    }, []);

    /** Verificar permisos de acceso */
    if (!hasPermission('consultar usuario') && !hasPermission('ver dashboard admin')) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
                <p className="text-gray-600">No tienes permisos para acceder a la gestión de usuarios</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                    <p className="text-gray-600">Administra los usuarios del sistema</p>
                </div>
                {hasPermission('crear usuario') && (
                    <button
                        onClick={() => {
                            // TODO: Implementar navegación a crear usuario
                            alert('Navegación a crear usuario en desarrollo');
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Crear Usuario
                    </button>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Lista de usuarios */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Usuarios del Sistema ({users.length})
                    </h3>
                </div>

                {users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo de Entidad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID Entidad
                                    </th>
                                    {(hasPermission('modificar usuario') || hasPermission('eliminar usuario')) && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((systemUser) => (
                                    <tr key={systemUser.clave} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {systemUser.username.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {systemUser.username}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {systemUser.clave}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {systemUser.rol}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {systemUser.fk_empleado ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    👷 Empleado
                                                </span>
                                            ) : systemUser.fk_miembro ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    🤝 Miembro
                                                </span>
                                            ) : systemUser.fk_cliente ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    👨‍💼 Cliente
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">No definido</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {systemUser.fk_empleado || systemUser.fk_miembro || systemUser.fk_cliente || '-'}
                                        </td>
                                        {(hasPermission('modificar usuario') || hasPermission('eliminar usuario')) && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {hasPermission('modificar usuario') && (
                                                        <button
                                                            onClick={() => {
                                                                // TODO: Implementar edición de usuario
                                                                alert(`Editar usuario: ${systemUser.username}`);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                    )}
                                                    {hasPermission('eliminar usuario') && (
                                                        <button
                                                            onClick={() => {
                                                                // TODO: Implementar eliminación de usuario
                                                                if (confirm(`¿Estás seguro de eliminar el usuario ${systemUser.username}?`)) {
                                                                    alert(`Eliminar usuario: ${systemUser.username}`);
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                        >
                                                            🗑️ Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">👥</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
                        <p className="text-gray-500">No se encontraron usuarios en el sistema</p>
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
                            Información sobre Usuarios
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc list-inside space-y-1">
                                <li>Los usuarios pueden ser empleados, miembros o clientes</li>
                                <li>Cada usuario tiene un rol que define sus permisos</li>
                                <li>Los permisos se gestionan a través de los roles</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
