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
interface RoleManagementProps {
    user: User;
}

/** Interfaz para los roles */
interface Role {
    clave: number;
    nombre: string;
}

/** Interfaz para los privilegios */
interface Privilege {
    clave: number;
    nombre: string;
    descripcion?: string;
}

/** Componente de gestión de roles */
const RoleManagement: React.FC<RoleManagementProps> = ({ user }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [privileges, setPrivileges] = useState<Privilege[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [rolePrivileges, setRolePrivileges] = useState<Privilege[]>([]);

    /** Verificar si el usuario tiene un permiso específico */
    const hasPermission = (permissionName: string): boolean => {
        return user.permisos.some(permiso => permiso.nombre === permissionName);
    };

    /** Cargar roles desde la API */
    const loadRoles = async () => {
        try {
            const response = await fetch('/api/roles');
            if (response.ok) {
                const data = await response.json();
                setRoles(data);
            } else {
                setError('Error al cargar los roles');
            }
        } catch (err) {
            setError('Error de conexión al cargar roles');
        }
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
        }
    };

    /** Cargar privilegios de un rol específico */
    const loadRolePrivileges = async (roleId: number) => {
        try {
            const response = await fetch(`/api/roles/${roleId}/privileges`);
            if (response.ok) {
                const data = await response.json();
                setRolePrivileges(data);
            } else {
                setRolePrivileges([]);
            }
        } catch (err) {
            setRolePrivileges([]);
        }
    };

    /** Efecto inicial para cargar datos */
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([loadRoles(), loadPrivileges()]);
            setLoading(false);
        };

        loadData();
    }, []);

    /** Efecto para cargar privilegios cuando se selecciona un rol */
    useEffect(() => {
        if (selectedRole) {
            loadRolePrivileges(selectedRole.clave);
        } else {
            setRolePrivileges([]);
        }
    }, [selectedRole]);

    /** Crear un nuevo rol */
    const handleCreateRole = async (roleName: string) => {
        try {
            const response = await fetch('/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: roleName }),
            });

            if (response.ok) {
                await loadRoles();
                setShowCreateModal(false);
            } else {
                setError('Error al crear el rol');
            }
        } catch (err) {
            setError('Error de conexión al crear rol');
        }
    };

    /** Verificar permisos de acceso */
    if (!hasPermission('consultar rol') && !hasPermission('gestionar roles privilegios')) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
                <p className="text-gray-600">No tienes permisos para acceder a la gestión de roles</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando roles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Roles</h2>
                    <p className="text-gray-600">Administra los roles del sistema y sus privilegios</p>
                </div>
                {hasPermission('crear rol') && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Crear Rol
                    </button>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de roles */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Roles del Sistema</h3>
                    <div className="space-y-2">
                        {roles.map((role) => (
                            <div
                                key={role.clave}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                    selectedRole?.clave === role.clave
                                        ? 'bg-blue-50 border-blue-200'
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                }`}
                                onClick={() => setSelectedRole(role)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{role.nombre}</h4>
                                        <p className="text-sm text-gray-500">ID: {role.clave}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {selectedRole?.clave === role.clave && (
                                            <span className="text-blue-600">✓</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privilegios del rol seleccionado */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Privilegios del Rol
                        {selectedRole && (
                            <span className="text-blue-600 ml-2">({selectedRole.nombre})</span>
                        )}
                    </h3>
                    
                    {selectedRole ? (
                        <div className="space-y-3">
                            {rolePrivileges.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 mb-3">
                                        Este rol tiene {rolePrivileges.length} privilegios asignados:
                                    </p>
                                    {rolePrivileges.map((privilege) => (
                                        <div
                                            key={privilege.clave}
                                            className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded"
                                        >
                                            <div>
                                                <span className="font-medium text-green-800">
                                                    {privilege.nombre}
                                                </span>
                                                {privilege.descripcion && (
                                                    <p className="text-xs text-green-600 mt-1">
                                                        {privilege.descripcion}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-green-600">✓</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">📝</div>
                                    <p className="text-gray-500">Este rol no tiene privilegios asignados</p>
                                </div>
                            )}
                            
                            {hasPermission('gestionar roles privilegios') && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                        onClick={() => {
                                            // TODO: Implementar modal de asignación de privilegios
                                            alert('Funcionalidad de asignación de privilegios en desarrollo');
                                        }}
                                    >
                                        🔧 Gestionar Privilegios
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">👈</div>
                            <p className="text-gray-500">Selecciona un rol para ver sus privilegios</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de creación de rol */}
            {showCreateModal && (
                <CreateRoleModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateRole}
                />
            )}
        </div>
    );
};

/** Modal para crear un nuevo rol */
const CreateRoleModal: React.FC<{
    onClose: () => void;
    onSubmit: (roleName: string) => void;
}> = ({ onClose, onSubmit }) => {
    const [roleName, setRoleName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (roleName.trim()) {
            onSubmit(roleName.trim());
            setRoleName('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Rol</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Rol
                        </label>
                        <input
                            type="text"
                            id="roleName"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Supervisor de Ventas"
                            required
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                        >
                            Crear Rol
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoleManagement; 