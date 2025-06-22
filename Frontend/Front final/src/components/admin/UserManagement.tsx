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
interface UserManagementProps {
    user: Usuario;
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

interface UsuarioCompleto {
    clave: number;
    username: string;
    rol: string;
    fk_empleado?: number;
    fk_miembro?: number;
    fk_cliente?: number;
    tipo_entidad?: string;
}

interface Rol {
    clave: number;
    nombre: string;
}

interface Empleado {
    ci: number;
    primer_nombre: string;
    primer_apellido: string;
}

interface Miembro {
    rif: string;
    razon_social: string;
}

interface Cliente {
    clave: number;
    primer_nombre: string;
    primer_apellido: string;
}

/** Componente de gestión de usuarios */
const UserManagement: React.FC<UserManagementProps> = ({ user }) => {
    const [usuarios, setUsuarios] = useState<UsuarioCompleto[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Estados para formularios
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingUser, setEditingUser] = useState<UsuarioCompleto | null>(null);
    const [newUser, setNewUser] = useState({
        username: '',
        contrasena: '',
        fk_rol: '',
        tipo_entidad: 'empleado',
        fk_empleado: '',
        fk_miembro: '',
        fk_cliente: ''
    });

    /** Verificar permisos */
    const hasPermission = (permission: string): boolean => {
        return user.permisos.some(p => p.nombre === permission);
    };

    const canCreate = hasPermission('Crear usuario') || hasPermission('Crear empleado') || hasPermission('Crear miembro') || hasPermission('Crear cliente');
    const canUpdate = hasPermission('Modificar usuario') || hasPermission('Modificar empleado') || hasPermission('Modificar miembro') || hasPermission('Modificar cliente');
    const canDelete = hasPermission('Eliminar usuario') || hasPermission('Eliminar empleado') || hasPermission('Eliminar miembro') || hasPermission('Eliminar cliente');
    const canView = hasPermission('Consultar usuario') || hasPermission('Consultar empleado') || hasPermission('Consultar miembro') || hasPermission('Consultar cliente');

    /** Cargar datos iniciales */
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadUsuarios(),
                loadRoles(),
                loadEmpleados(),
                loadMiembros(),
                loadClientes()
            ]);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const loadUsuarios = async () => {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Error al cargar usuarios');
        const data = await response.json();
        setUsuarios(data);
    };

    const loadRoles = async () => {
        const response = await fetch('/api/roles');
        if (!response.ok) throw new Error('Error al cargar roles');
        const data = await response.json();
        setRoles(data);
    };

    const loadEmpleados = async () => {
        // Simular carga de empleados - reemplazar con endpoint real
        setEmpleados([
            { ci: 12345678, primer_nombre: 'Juan', primer_apellido: 'Pérez' },
            { ci: 87654321, primer_nombre: 'María', primer_apellido: 'González' }
        ]);
    };

    const loadMiembros = async () => {
        // Simular carga de miembros - reemplazar con endpoint real
        setMiembros([
            { rif: 'J-123456789', razon_social: 'Empresa ABC' },
            { rif: 'J-987654321', razon_social: 'Corporación XYZ' }
        ]);
    };

    const loadClientes = async () => {
        // Simular carga de clientes - reemplazar con endpoint real
        setClientes([
            { clave: 1, primer_nombre: 'Ana', primer_apellido: 'Rodríguez' },
            { clave: 2, primer_nombre: 'Carlos', primer_apellido: 'Martín' }
        ]);
    };

    /** Crear usuario */
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const userData = {
                username: newUser.username,
                contrasena: newUser.contrasena,
                fk_rol: parseInt(newUser.fk_rol),
                fk_empleado: newUser.tipo_entidad === 'empleado' ? parseInt(newUser.fk_empleado) || null : null,
                fk_miembro: newUser.tipo_entidad === 'miembro' ? newUser.fk_miembro || null : null,
                fk_cliente: newUser.tipo_entidad === 'cliente' ? parseInt(newUser.fk_cliente) || null : null
            };

            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear usuario');
            }

            await loadUsuarios();
            setShowCreateForm(false);
            setNewUser({
                username: '',
                contrasena: '',
                fk_rol: '',
                tipo_entidad: 'empleado',
                fk_empleado: '',
                fk_miembro: '',
                fk_cliente: ''
            });

        } catch (error: any) {
            setError(error.message);
        }
    };

    /** Eliminar usuario */
    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar usuario');
            }

            await loadUsuarios();
        } catch (error: any) {
            setError(error.message);
        }
    };

    /** Renderizar opciones según tipo de entidad */
    const renderEntityOptions = () => {
        switch (newUser.tipo_entidad) {
            case 'empleado':
                return (
                    <select
                        value={newUser.fk_empleado}
                        onChange={(e) => setNewUser({...newUser, fk_empleado: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar empleado</option>
                        {empleados.map(emp => (
                            <option key={emp.ci} value={emp.ci}>
                                {emp.primer_nombre} {emp.primer_apellido} - CI: {emp.ci}
                            </option>
                        ))}
                    </select>
                );
            case 'miembro':
                return (
                    <select
                        value={newUser.fk_miembro}
                        onChange={(e) => setNewUser({...newUser, fk_miembro: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar miembro</option>
                        {miembros.map(miembro => (
                            <option key={miembro.rif} value={miembro.rif}>
                                {miembro.razon_social} - RIF: {miembro.rif}
                            </option>
                        ))}
                    </select>
                );
            case 'cliente':
                return (
                    <select
                        value={newUser.fk_cliente}
                        onChange={(e) => setNewUser({...newUser, fk_cliente: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.clave} value={cliente.clave}>
                                {cliente.primer_nombre} {cliente.primer_apellido} - ID: {cliente.clave}
                            </option>
                        ))}
                    </select>
                );
            default:
                return null;
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
                <p className="text-red-700">No tiene permisos para ver la gestión de usuarios.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                    <p className="text-gray-600">Administrar usuarios del sistema</p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                    >
                        <span className="mr-2">+</span>
                        Crear Usuario
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
                        Dismiss
                    </button>
                </div>
            )}

            {/* Formulario de creación */}
            {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-lg font-semibold mb-4">Crear Nuevo Usuario</h3>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={newUser.contrasena}
                                    onChange={(e) => setNewUser({...newUser, contrasena: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Rol
                                </label>
                                <select
                                    value={newUser.fk_rol}
                                    onChange={(e) => setNewUser({...newUser, fk_rol: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Seleccionar rol</option>
                                    {roles.map(rol => (
                                        <option key={rol.clave} value={rol.clave}>
                                            {rol.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tipo de Entidad
                                </label>
                                <select
                                    value={newUser.tipo_entidad}
                                    onChange={(e) => setNewUser({...newUser, tipo_entidad: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="empleado">Empleado</option>
                                    <option value="miembro">Miembro</option>
                                    <option value="cliente">Cliente</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {newUser.tipo_entidad === 'empleado' ? 'Empleado' : 
                                 newUser.tipo_entidad === 'miembro' ? 'Miembro' : 'Cliente'}
                            </label>
                            {renderEntityOptions()}
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
                                Crear Usuario
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabla de usuarios */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {usuarios.map((usuario) => (
                                <tr key={usuario.clave} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {usuario.clave}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {usuario.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {usuario.rol}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                            {usuario.fk_empleado ? 'Empleado' : 
                                             usuario.fk_miembro ? 'Miembro' : 
                                             usuario.fk_cliente ? 'Cliente' : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {canUpdate && (
                                            <button 
                                                className="text-blue-600 hover:text-blue-900"
                                                onClick={() => setEditingUser(usuario)}
                                            >
                                                Editar
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button 
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDeleteUser(usuario.clave)}
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

            {usuarios.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No hay usuarios registrados
                </div>
            )}
        </div>
    );
};

export default UserManagement;
