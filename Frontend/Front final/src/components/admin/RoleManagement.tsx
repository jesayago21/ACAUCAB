import React, { useState, useEffect } from 'react';
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
interface RoleManagementProps {
    user: Usuario;
}

/** Interfaz para los roles */
interface Rol {
    clave: number;
    nombre: string;
}

/** Interfaz para los privilegios */
interface Privilegio {
    clave: number;
    nombre: string;
    descripcion?: string;
}

/** Interfaz para los módulos de privilegios */
interface PrivilegioModulo {
    module: string;
    displayName: string;
    privileges: Privilegio[];
}

/** Componente de gestión de roles */
const RoleManagement: React.FC<RoleManagementProps> = ({ user }) => {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [privilegios, setPrivilegios] = useState<Privilegio[]>([]);
    const [privilegiosModulos, setPrivilegiosModulos] = useState<PrivilegioModulo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Estados para formularios
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingRole, setEditingRole] = useState<Rol | null>(null);
    const [showPrivilegeModal, setShowPrivilegeModal] = useState(false);
    const [selectedRoleForPrivileges, setSelectedRoleForPrivileges] = useState<Rol | null>(null);
    const [rolePrivileges, setRolePrivileges] = useState<number[]>([]);
    const [newRole, setNewRole] = useState({
        nombre: ''
    });

    /** Verificar permisos */
    const hasPermission = (permission: string): boolean => {
        return user.permisos.some(p => p.nombre === permission);
    };

    const canCreate = hasPermission('Crear rol');
    const canUpdate = hasPermission('Modificar rol');
    const canDelete = hasPermission('Eliminar rol');
    const canView = hasPermission('Consultar rol');
    const canManagePrivileges = hasPermission('Consultar privilegio') && canUpdate;

    /** Cargar datos iniciales */
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadRoles(),
                loadPrivilegios()
            ]);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        const response = await fetch('http://localhost:5000/api/roles');
        if (!response.ok) throw new Error('Error al cargar roles');
                const data = await response.json();
                setRoles(data);
    };

    const loadPrivilegios = async () => {
        const response = await fetch('http://localhost:5000/api/privileges');
        if (!response.ok) throw new Error('Error al cargar privilegios');
        const data = await response.json();
        setPrivilegios(data);
        
        // Agrupar privilegios por módulo
        groupPrivilegesByModule(data);
    };

    /** Agrupar privilegios por módulo */
    const groupPrivilegesByModule = (privileges: Privilegio[]) => {
        const modules: { [key: string]: PrivilegioModulo } = {};
        
        privileges.forEach(privilege => {
            // Extraer el módulo del nombre del privilegio
            const parts = privilege.nombre.split(' ');
            const action = parts[0]; // crear, consultar, modificar, eliminar
            const module = parts.slice(1).join(' '); // nombre del módulo
            
            if (!modules[module]) {
                modules[module] = {
                    module: module,
                    displayName: module.replace(/\b\w/g, l => l.toUpperCase()),
                    privileges: []
                };
            }
            
            modules[module].privileges.push({
                ...privilege,
                action: action
            } as any);
        });
        
        const moduleArray = Object.values(modules).sort((a, b) => 
            a.displayName.localeCompare(b.displayName)
        );
        
        setPrivilegiosModulos(moduleArray);
    };

    /** Crear rol */
    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRole)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear rol');
            }

            await loadRoles();
            setShowCreateForm(false);
            setNewRole({ nombre: '' });

        } catch (error: any) {
            setError(error.message);
        }
    };

    /** Eliminar rol */
    const handleDeleteRole = async (roleId: number) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este rol?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/roles/${roleId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar rol');
            }

            await loadRoles();
        } catch (error: any) {
            setError(error.message);
        }
    };

    /** Abrir modal de gestión de privilegios */
    const handleManagePrivileges = async (role: Rol) => {
        try {
            setSelectedRoleForPrivileges(role);
            
            // Cargar privilegios actuales del rol
            const response = await fetch(`http://localhost:5000/api/privileges/${role.clave}`);
            if (!response.ok) throw new Error('Error al cargar privilegios del rol');
            
            const rolePrivilegesData = await response.json();
            const privilegeIds = rolePrivilegesData.map((p: Privilegio) => p.clave);
            setRolePrivileges(privilegeIds);
            setShowPrivilegeModal(true);
            
        } catch (error: any) {
            setError(error.message);
        }
    };

    /** Guardar privilegios del rol */
    const handleSaveRolePrivileges = async () => {
        if (!selectedRoleForPrivileges) return;

        try {
            const response = await fetch(`http://localhost:5000/api/roles/${selectedRoleForPrivileges.clave}/assign-privileges`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    privilegiosClave: rolePrivileges
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al asignar privilegios');
            }

            setShowPrivilegeModal(false);
            setSelectedRoleForPrivileges(null);
            setRolePrivileges([]);

        } catch (error: any) {
            setError(error.message);
        }
    };

    /** Manejar cambio de privilegio */
    const handlePrivilegeChange = (privilegeId: number, checked: boolean) => {
        if (checked) {
            setRolePrivileges([...rolePrivileges, privilegeId]);
        } else {
            setRolePrivileges(rolePrivileges.filter(id => id !== privilegeId));
        }
    };

    /** Seleccionar/deseleccionar todos los privilegios de un módulo */
    const handleModuleToggle = (module: PrivilegioModulo, selectAll: boolean) => {
        const modulePrivilegeIds = module.privileges.map(p => p.clave);
        
        if (selectAll) {
            const newIds = [...rolePrivileges, ...modulePrivilegeIds.filter(id => !rolePrivileges.includes(id))];
            setRolePrivileges(newIds);
        } else {
            setRolePrivileges(rolePrivileges.filter(id => !modulePrivilegeIds.includes(id)));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!canView) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
                <p className="text-red-700">No tiene permisos para ver la gestión de roles.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Roles</h2>
                    <p className="text-gray-600">Administrar roles y sus privilegios</p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                    >
                        <span className="mr-2">+</span>
                        Crear Rol
                    </button>
                )}
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => setError('')}
                        className="mt-2 text-red-600 hover:text-red-800 underline"
                    >
                        Cerrar
                    </button>
                </div>
            )}

            {/* Formulario de creación */}
            {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-lg font-semibold mb-4">Crear Nuevo Rol</h3>
                    <form onSubmit={handleCreateRole} className="space-y-4">
                                    <div>
                            <label className="block text-sm font-medium text-gray-700">
                            Nombre del Rol
                        </label>
                        <input
                            type="text"
                                value={newRole.nombre}
                                onChange={(e) => setNewRole({...newRole, nombre: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ej: Supervisor de Ventas"
                            required
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Crear Rol
                        </button>
                    </div>
                </form>
            </div>
            )}

            {/* Tabla de roles */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre del Rol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {roles.map((rol) => (
                                <tr key={rol.clave} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {rol.clave}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {rol.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {canManagePrivileges && (
                                            <button 
                                                className="text-green-600 hover:text-green-900"
                                                onClick={() => handleManagePrivileges(rol)}
                                            >
                                                Privilegios
                                            </button>
                                        )}
                                        {canUpdate && (
                                            <button 
                                                className="text-blue-600 hover:text-blue-900"
                                                onClick={() => setEditingRole(rol)}
                                            >
                                                Editar
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button 
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDeleteRole(rol.clave)}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {roles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No hay roles registrados
                </div>
            )}

            {/* Modal de gestión de privilegios */}
            {showPrivilegeModal && selectedRoleForPrivileges && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Privilegios para: {selectedRoleForPrivileges.nombre}
                            </h3>
                            <button
                                onClick={() => setShowPrivilegeModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {privilegiosModulos.map((module) => {
                                const modulePrivilegeIds = module.privileges.map(p => p.clave);
                                const selectedCount = modulePrivilegeIds.filter(id => rolePrivileges.includes(id)).length;
                                const isAllSelected = selectedCount === modulePrivilegeIds.length;
                                const isPartiallySelected = selectedCount > 0 && selectedCount < modulePrivilegeIds.length;

                                return (
                                    <div key={module.module} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-gray-900">{module.displayName}</h4>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleModuleToggle(module, !isAllSelected)}
                                                    className={`px-3 py-1 text-sm rounded ${
                                                        isAllSelected 
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                                >
                                                    {isAllSelected ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                                                </button>
                                                <span className="text-sm text-gray-500">
                                                    ({selectedCount}/{modulePrivilegeIds.length})
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {module.privileges.map((privilege) => (
                                                <label key={privilege.clave} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={rolePrivileges.includes(privilege.clave)}
                                                        onChange={(e) => handlePrivilegeChange(privilege.clave, e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{privilege.nombre}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowPrivilegeModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveRolePrivileges}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Guardar Privilegios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManagement; 