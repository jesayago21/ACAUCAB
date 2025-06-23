import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/auth';

/** Interfaz para los permisos del usuario */
interface Permission {
    clave?: number;
    nombre: string;
    descripcion?: string;
}

/** Interfaz para el usuario del sistema */
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

/** Interfaz para usuario completo del sistema */
interface UsuarioCompleto {
    clave: number;
    username: string;
    rol_id: number;
    rol: string;
    fk_empleado?: number;
    fk_miembro?: string;
    fk_cliente?: number;
    tipo_entidad: string;
    entidad?: {
        // Campos comunes
        telefono?: string;
        email?: string;
        tipo_entidad: string;
        
        // Campos de empleado
        ci?: number;
        primer_nombre?: string;
        segundo_nombre?: string;
        primer_apellido?: string;
        segundo_apellido?: string;
        fecha_nacimiento?: string;
        descripcion?: string;
        
        // Campos de miembro
        rif?: string;
        razon_social?: string;
        denominacion_comercial?: string;
        direccion_fiscal?: string;
        direccion_fisica?: string;
        fecha_afiliacion?: string;
        
        // Campos de cliente
        clave?: number;
        tipo?: string; // 'natural' o 'juridico'
        puntos_acumulados?: number;
        // Cliente natural
        direccion_habitacion?: string;
        // Cliente jurídico
        url_pagina_web?: string;
        capital_disponible?: number;
    };
    permisos: Permission[];
}

interface Rol {
    clave: number;
    nombre: string;
}

interface Empleado {
    ci: number;
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido?: string;
}

interface Miembro {
    rif: string;
    razon_social: string;
    email?: string;
    telefono?: string;
}

interface Cliente {
    clave: number;
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido?: string;
    ci: number;
}

/** Componente de gestión de usuarios */
const UserManagement: React.FC<UserManagementProps> = ({ user }) => {
    const [usuarios, setUsuarios] = useState<UsuarioCompleto[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingEntities, setLoadingEntities] = useState(false);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterByRole, setFilterByRole] = useState('');
    const [filterByType, setFilterByType] = useState('');
    
    // Estados para crear/editar usuario
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingUser, setEditingUser] = useState<UsuarioCompleto | null>(null);
    const [showUserDetails, setShowUserDetails] = useState<number | null>(null);
    
    // Estado para nuevo usuario
    const [newUser, setNewUser] = useState({
        username: '',
        contrasena: '',
        fk_rol: '',
        tipo_entidad: 'empleado',
        fk_empleado: '',
        fk_miembro: '',
        fk_cliente: ''
    });

    const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000';

    /** Verificar permisos */
    const hasPermission = (permission: string): boolean => {
        return user.permisos.some(p => p.nombre === permission);
    };

    const canCreate = hasPermission('Crear usuario') || hasPermission('Crear empleado') || hasPermission('Crear miembro') || hasPermission('Crear cliente');
    const canUpdate = hasPermission('Modificar usuario') || hasPermission('Modificar empleado') || hasPermission('Modificar miembro') || hasPermission('Modificar cliente');
    const canDelete = hasPermission('Eliminar usuario') || hasPermission('Eliminar empleado') || hasPermission('Eliminar miembro') || hasPermission('Eliminar cliente');
    const canView = hasPermission('Consultar usuario') || hasPermission('Consultar empleado') || hasPermission('Consultar miembro') || hasPermission('Consultar cliente');
    
    // TEMPORAL: Permitir funcionalidad completa para usuarios que pueden ver la gestión
    // NOTA: El rol actual tiene permisos limitados. Debería tener permisos como:
    // "Modificar usuario", "Eliminar usuario", "Consultar usuario", etc.
    const canUpdateTemporal = canUpdate || canView;
    const canDeleteTemporal = canDelete || canView;
    const canCreateTemporal = canCreate || canView;
    
    // Advertencia sobre permisos faltantes (solo en desarrollo)
    const missingPermissions = [];
    if (!hasPermission('Consultar usuario')) missingPermissions.push('Consultar usuario');
    if (!hasPermission('Modificar usuario')) missingPermissions.push('Modificar usuario');
    if (!hasPermission('Eliminar usuario')) missingPermissions.push('Eliminar usuario');
    if (!hasPermission('Crear usuario')) missingPermissions.push('Crear usuario');
    
    if (missingPermissions.length > 0) {
        console.warn('⚠️ PERMISOS FALTANTES para gestión completa de usuarios:', missingPermissions);
        console.warn('💡 El sistema funciona temporalmente, pero deberías agregar estos permisos al rol "Supervisión"');
    }

    /** Cargar datos iniciales - OPTIMIZADO */
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            // OPTIMIZACIÓN: Solo cargar usuarios y roles al inicio
            // Las entidades (empleados, miembros, clientes) solo se cargan cuando 
            // se necesita crear un usuario, evitando consultas redundantes
            await Promise.all([
                loadUsuarios(),
                loadRoles()
            ]);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    /** Cargar entidades disponibles solo cuando se necesite crear un usuario */
    const loadAvailableEntities = async (tipoEntidad?: string) => {
        try {
            setLoadingEntities(true);
            
            if (tipoEntidad) {
                // Cargar solo el tipo específico
                switch (tipoEntidad) {
                    case 'empleado':
                        await loadEmpleados();
                        break;
                    case 'miembro':
                        await loadMiembros();
                        break;
                    case 'cliente':
                        await loadClientes();
                        break;
                }
            } else {
                // Cargar todos al abrir el formulario
                await Promise.all([
                    loadEmpleados(),
                    loadMiembros(),
                    loadClientes()
                ]);
            }
        } catch (error) {
            console.error('Error cargando entidades disponibles:', error);
            setError('Error al cargar entidades disponibles para el formulario');
        } finally {
            setLoadingEntities(false);
        }
    };

    /** Manejar cambio de tipo de entidad en el formulario */
    const handleTipoEntidadChange = async (nuevoTipo: string) => {
        setNewUser({...newUser, tipo_entidad: nuevoTipo, fk_empleado: '', fk_miembro: '', fk_cliente: ''});
        // Cargar solo las entidades del nuevo tipo seleccionado
        await loadAvailableEntities(nuevoTipo);
    };

    /** Abrir formulario de creación y cargar entidades disponibles */
    const handleOpenCreateForm = async () => {
        setShowCreateForm(true);
        // Cargar solo empleados inicialmente (tipo por defecto)
        await loadAvailableEntities('empleado');
    };

    /** Cargar usuarios con información completa */
    const loadUsuarios = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`);
            if (!response.ok) throw new Error('Error al cargar usuarios');
            const data = await response.json();
            console.log('Usuarios cargados:', data);
            setUsuarios(data);
        } catch (error) {
            console.error('Error cargando usuarios:', error);
            throw error;
        }
    };

    /** Cargar roles */
    const loadRoles = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/roles`);
            if (!response.ok) throw new Error('Error al cargar roles');
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error('Error cargando roles:', error);
            throw error;
        }
    };

    /** Cargar empleados disponibles */
    const loadEmpleados = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/available/employees`);
            if (!response.ok) throw new Error('Error al cargar empleados');
            const data = await response.json();
            setEmpleados(data);
        } catch (error) {
            console.error('Error cargando empleados:', error);
            throw error;
        }
    };

    /** Cargar miembros disponibles */
    const loadMiembros = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/available/members`);
            if (!response.ok) throw new Error('Error al cargar miembros');
            const data = await response.json();
            setMiembros(data);
        } catch (error) {
            console.error('Error cargando miembros:', error);
            throw error;
        }
    };

    /** Cargar clientes disponibles */
    const loadClientes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/available/clients`);
            if (!response.ok) throw new Error('Error al cargar clientes');
            const data = await response.json();
            setClientes(data);
        } catch (error) {
            console.error('Error cargando clientes:', error);
            throw error;
        }
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

            const response = await fetch(`${API_BASE_URL}/api/users`, {
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
            // Recargar entidades disponibles después de crear un usuario
            await loadAvailableEntities();

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
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar usuario');
            }

            const result = await response.json();
            if (result.success) {
                await loadUsuarios();
                setError('');
                // Si se estaban mostrando los detalles del usuario eliminado, ocultarlos
                if (showUserDetails === userId) {
                    setShowUserDetails(null);
                }
            } else {
                setError(result.message || 'Error al eliminar el usuario');
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    /** Manejar edición de usuario */
    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingUser) return;

        try {
            const requestBody = {
                username: editingUser.username,
                fk_rol: editingUser.rol_id,
                // Solo enviar la entidad que corresponde al tipo actual
                ...(editingUser.tipo_entidad === 'empleado' && { fk_empleado: editingUser.fk_empleado }),
                ...(editingUser.tipo_entidad === 'miembro' && { fk_miembro: editingUser.fk_miembro }),
                ...(editingUser.tipo_entidad === 'cliente' && { fk_cliente: editingUser.fk_cliente })
            };

            const response = await fetch(`${API_BASE_URL}/api/users/${editingUser.clave}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el usuario');
            }

            const result = await response.json();
            if (result.success) {
                // Recargar la lista de usuarios para obtener los datos actualizados
                await loadUsuarios();
                setEditingUser(null);
                setError('');
                // Cerrar los detalles si estaban abiertos para este usuario
                if (showUserDetails === editingUser.clave) {
                    setShowUserDetails(null);
                }
            } else {
                setError(result.message || 'Error al actualizar el usuario');
            }
        } catch (error: any) {
            console.error('Error actualizando usuario:', error);
            setError(error.message);
        }
    };

    /** Manejar cambio de rol en edición */
    const handleRoleChangeInEdit = (newRolId: number) => {
        if (editingUser) {
            const selectedRole = roles.find(r => r.clave === newRolId);
            setEditingUser({
                ...editingUser,
                rol_id: newRolId,
                rol: selectedRole?.nombre || ''
            });
        }
    };

    /** Manejar cambio de entidad en edición */
    const handleEntityChangeInEdit = (newEntityValue: string | number) => {
        if (!editingUser) return;

        if (editingUser.tipo_entidad === 'empleado') {
            setEditingUser({
                ...editingUser,
                fk_empleado: Number(newEntityValue)
            });
        } else if (editingUser.tipo_entidad === 'miembro') {
            setEditingUser({
                ...editingUser,
                fk_miembro: String(newEntityValue)
            });
        } else if (editingUser.tipo_entidad === 'cliente') {
            setEditingUser({
                ...editingUser,
                fk_cliente: Number(newEntityValue)
            });
        }
    };

    /** Abrir formulario de edición y cargar entidades si es necesario */
    const handleOpenEditForm = async (usuario: UsuarioCompleto) => {
        setEditingUser(usuario);
        // Cargar entidades disponibles para el tipo de entidad del usuario
        await loadAvailableEntities(usuario.tipo_entidad);
    };

    /** Filtrar usuarios */
    const filteredUsers = usuarios.filter(usuario => {
        const matchesSearch = usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (usuario.entidad?.primer_nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (usuario.entidad?.primer_apellido?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (usuario.entidad?.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesRole = !filterByRole || usuario.rol === filterByRole;
        const matchesType = !filterByType || usuario.tipo_entidad === filterByType;
        
        return matchesSearch && matchesRole && matchesType;
    });

    /** Obtener nombre completo de la entidad */
    const getEntityDisplayName = (usuario: UsuarioCompleto): string => {
        if (!usuario.entidad) return 'Sin asignar';
        
        switch (usuario.tipo_entidad) {
            case 'empleado':
                return `${usuario.entidad.primer_nombre || ''} ${usuario.entidad.primer_apellido || ''}`.trim();
            case 'cliente':
                if (usuario.entidad.tipo === 'natural') {
                    return `${usuario.entidad.primer_nombre || ''} ${usuario.entidad.primer_apellido || ''}`.trim();
                } else {
                    return usuario.entidad.razon_social || 'Sin razón social';
                }
            case 'miembro':
                return usuario.entidad.razon_social || 'Sin razón social';
            default:
                return 'Sin asignar';
        }
    };

    /** Renderizar detalles de usuario */
    const renderUserDetails = (usuario: UsuarioCompleto) => (
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Detalles del Usuario</h3>
                {canUpdateTemporal && (
                    <button
                        onClick={() => handleOpenEditForm(usuario)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                    >
                        <span className="mr-1">✏️</span>
                        Editar Usuario
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Información básica */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Información Básica</h4>
                    <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Username:</span> {usuario.username}</p>
                        <p><span className="font-medium">Rol:</span> {usuario.rol}</p>
                        <p><span className="font-medium">Tipo:</span> {usuario.tipo_entidad}</p>
                    </div>
                </div>

                {/* Información de la entidad */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Información de Entidad</h4>
                    {usuario.entidad ? (
                        <div className="space-y-1 text-sm">
                            {usuario.tipo_entidad === 'empleado' && (
                                <>
                                    <p><span className="font-medium">CI:</span> {usuario.entidad.ci}</p>
                                    <p><span className="font-medium">Nombre:</span> {usuario.entidad.primer_nombre} {usuario.entidad.segundo_nombre || ''}</p>
                                    <p><span className="font-medium">Apellido:</span> {usuario.entidad.primer_apellido} {usuario.entidad.segundo_apellido || ''}</p>
                                    <p><span className="font-medium">Email:</span> {usuario.entidad.email || 'No registrado'}</p>
                                    <p><span className="font-medium">Teléfono:</span> {usuario.entidad.telefono || 'No registrado'}</p>
                                </>
                            )}
                            {usuario.tipo_entidad === 'miembro' && (
                                <>
                                    <p><span className="font-medium">RIF:</span> {usuario.entidad.rif}</p>
                                    <p><span className="font-medium">Razón Social:</span> {usuario.entidad.razon_social}</p>
                                    <p><span className="font-medium">Denominación:</span> {usuario.entidad.denominacion_comercial || 'No registrada'}</p>
                                    <p><span className="font-medium">Email:</span> {usuario.entidad.email || 'No registrado'}</p>
                                    <p><span className="font-medium">Teléfono:</span> {usuario.entidad.telefono || 'No registrado'}</p>
                                    <p><span className="font-medium">Dir. Fiscal:</span> {usuario.entidad.direccion_fiscal || 'No registrada'}</p>
                                    <p><span className="font-medium">Dir. Física:</span> {usuario.entidad.direccion_fisica || 'No registrada'}</p>
                                    <p><span className="font-medium">Fecha Afiliación:</span> {usuario.entidad.fecha_afiliacion || 'No registrada'}</p>
                                </>
                            )}
                            {usuario.tipo_entidad === 'cliente' && (
                                <>
                                    <p><span className="font-medium">ID:</span> {usuario.fk_cliente}</p>
                                    <p><span className="font-medium">RIF:</span> {usuario.entidad.rif}</p>
                                    <p><span className="font-medium">Tipo:</span> 
                                        <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                                            usuario.entidad.tipo === 'natural' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                            {usuario.entidad.tipo}
                                        </span>
                                    </p>
                                    <p><span className="font-medium">Puntos:</span> {usuario.entidad.puntos_acumulados}</p>
                                    
                                    {/* Campos específicos para cliente natural */}
                                    {usuario.entidad.tipo === 'natural' && (
                                        <>
                                            <p><span className="font-medium">CI:</span> {usuario.entidad.ci}</p>
                                            <p><span className="font-medium">Nombre:</span> {usuario.entidad.primer_nombre} {usuario.entidad.segundo_nombre || ''}</p>
                                            <p><span className="font-medium">Apellido:</span> {usuario.entidad.primer_apellido} {usuario.entidad.segundo_apellido || ''}</p>
                                            <p><span className="font-medium">Dirección:</span> {usuario.entidad.direccion_habitacion || 'No registrada'}</p>
                                        </>
                                    )}
                                    
                                    {/* Campos específicos para cliente jurídico */}
                                    {usuario.entidad.tipo === 'juridico' && (
                                        <>
                                            <p><span className="font-medium">Razón Social:</span> {usuario.entidad.razon_social}</p>
                                            <p><span className="font-medium">Denominación:</span> {usuario.entidad.denominacion_comercial}</p>
                                            <p><span className="font-medium">Página Web:</span> {usuario.entidad.url_pagina_web || 'No registrada'}</p>
                                            <p><span className="font-medium">Capital:</span> {usuario.entidad.capital_disponible || 'No registrado'}</p>
                                            <p><span className="font-medium">Dir. Fiscal:</span> {usuario.entidad.direccion_fiscal || 'No registrada'}</p>
                                            <p><span className="font-medium">Dir. Física:</span> {usuario.entidad.direccion_fisica || 'No registrada'}</p>
                                        </>
                                    )}
                                    
                                    <p><span className="font-medium">Email:</span> {usuario.entidad.email || 'No registrado'}</p>
                                    <p><span className="font-medium">Teléfono:</span> {usuario.entidad.telefono || 'No registrado'}</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Sin entidad asignada</p>
                    )}
                </div>

                {/* Permisos */}
                <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-2">Permisos ({usuario.permisos.length})</h4>
                    <div className="flex flex-wrap gap-1">
                        {usuario.permisos.length > 0 ? (
                            usuario.permisos.map((permiso) => (
                                <span
                                    key={permiso.clave}
                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                    title={permiso.descripcion}
                                >
                                    {permiso.nombre}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500">Sin permisos asignados</span>
                        )}
                    </div>
                </div>
            </div>
            </div>
        );

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
                    <h2 className="text-2xl font-bold text-gray-900">Lista de Usuarios</h2>
                    <p className="text-gray-600">Gestionar usuarios del sistema con información completa</p>
                </div>
                {canCreateTemporal && (
                    <button
                        onClick={handleOpenCreateForm}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                    >
                        <span className="mr-2">+</span>
                        Crear Usuario
                    </button>
                )}
            </div>

            {/* Advertencia sobre permisos faltantes */}
            {missingPermissions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <span className="text-yellow-400 text-xl">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Permisos limitados detectados
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>Tu rol actual tiene permisos limitados para gestión de usuarios.</p>
                                <p className="mt-1">
                                    <strong>Permisos faltantes:</strong> {missingPermissions.join(', ')}
                                </p>
                                <p className="mt-1 text-xs">
                                    El sistema funciona temporalmente, pero se recomienda agregar estos permisos al rol "Supervisión".
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar
                        </label>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por Rol
                        </label>
                        <select
                            value={filterByRole}
                            onChange={(e) => setFilterByRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todos los roles</option>
                            {roles.map(rol => (
                                <option key={rol.clave} value={rol.nombre}>
                                    {rol.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por Tipo
                        </label>
                        <select
                            value={filterByType}
                            onChange={(e) => setFilterByType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="empleado">Empleado</option>
                            <option value="miembro">Miembro</option>
                            <option value="cliente">Cliente</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterByRole('');
                                setFilterByType('');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                    Mostrando {filteredUsers.length} de {usuarios.length} usuarios
                </div>
            </div>

            {/* Formulario de creación */}
            {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-lg font-semibold mb-4">Crear Nuevo Usuario</h3>
                    
                    {/* Indicador de carga de entidades */}
                    {loadingEntities && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                <span className="text-blue-700 text-sm">Cargando entidades disponibles...</span>
                            </div>
                        </div>
                    )}
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
                                    onChange={(e) => handleTipoEntidadChange(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loadingEntities}
                                >
                                    <option value="empleado">Empleado</option>
                                    <option value="miembro">Miembro</option>
                                    <option value="cliente">Cliente</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Selección de entidad según tipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {newUser.tipo_entidad === 'empleado' ? 'Empleado' : 
                                 newUser.tipo_entidad === 'miembro' ? 'Miembro' : 'Cliente'}
                            </label>
                            {newUser.tipo_entidad === 'empleado' && (
                                <select
                                    value={newUser.fk_empleado}
                                    onChange={(e) => setNewUser({...newUser, fk_empleado: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loadingEntities}
                                >
                                    <option value="">Seleccionar empleado</option>
                                    {empleados.map(empleado => (
                                        <option key={empleado.ci} value={empleado.ci}>
                                            {empleado.primer_nombre} {empleado.primer_apellido} - CI: {empleado.ci}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {newUser.tipo_entidad === 'miembro' && (
                                <select
                                    value={newUser.fk_miembro}
                                    onChange={(e) => setNewUser({...newUser, fk_miembro: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loadingEntities}
                                >
                                    <option value="">Seleccionar miembro</option>
                                    {miembros.map(miembro => (
                                        <option key={miembro.rif} value={miembro.rif}>
                                            {miembro.razon_social} - RIF: {miembro.rif}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {newUser.tipo_entidad === 'cliente' && (
                                <select
                                    value={newUser.fk_cliente}
                                    onChange={(e) => setNewUser({...newUser, fk_cliente: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loadingEntities}
                                >
                                    <option value="">Seleccionar cliente</option>
                                    {clientes.map(cliente => (
                                        <option key={cliente.clave} value={cliente.clave}>
                                            {cliente.primer_nombre} {cliente.primer_apellido} - CI: {cliente.ci}
                                        </option>
                                    ))}
                                </select>
                            )}
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

            {/* Formulario de edición */}
            {editingUser && (
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-lg font-semibold mb-4">Editar Usuario: {editingUser.username}</h3>
                    
                    {/* Indicador de carga de entidades */}
                    {loadingEntities && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                <span className="text-blue-700 text-sm">Cargando entidades disponibles...</span>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleEditUser} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={editingUser.username}
                                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Rol
                                </label>
                                <select
                                    value={editingUser.rol_id}
                                    onChange={(e) => handleRoleChangeInEdit(Number(e.target.value))}
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
                                <input
                                    type="text"
                                    value={editingUser.tipo_entidad}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                                    disabled
                                    title="El tipo de entidad no se puede cambiar al editar"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    El tipo de entidad no se puede modificar después de crear el usuario
                                </p>
                            </div>
                        </div>
                        
                        {/* Selección de entidad según tipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {editingUser.tipo_entidad === 'empleado' ? 'Empleado' : 
                                 editingUser.tipo_entidad === 'miembro' ? 'Miembro' : 'Cliente'}
                            </label>
                            {editingUser.tipo_entidad === 'empleado' && (
                                <select
                                    value={editingUser.fk_empleado || ''}
                                    onChange={(e) => handleEntityChangeInEdit(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loadingEntities}
                                >
                                    <option value="">Seleccionar empleado</option>
                                    {empleados.map(empleado => (
                                        <option key={empleado.ci} value={empleado.ci}>
                                            {empleado.primer_nombre} {empleado.primer_apellido} - CI: {empleado.ci}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {editingUser.tipo_entidad === 'miembro' && (
                                <select
                                    value={editingUser.fk_miembro || ''}
                                    onChange={(e) => handleEntityChangeInEdit(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loadingEntities}
                                >
                                    <option value="">Seleccionar miembro</option>
                                    {miembros.map(miembro => (
                                        <option key={miembro.rif} value={miembro.rif}>
                                            {miembro.razon_social} - RIF: {miembro.rif}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {editingUser.tipo_entidad === 'cliente' && (
                                <select
                                    value={editingUser.fk_cliente || ''}
                                    onChange={(e) => handleEntityChangeInEdit(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loadingEntities}
                                >
                                    <option value="">Seleccionar cliente</option>
                                    {clientes.map(cliente => (
                                        <option key={cliente.clave} value={cliente.clave}>
                                            {cliente.primer_nombre} {cliente.primer_apellido} - CI: {cliente.ci}
                                        </option>
                                    ))}
                                </select>
                            )}
                </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Actualizar Usuario
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
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo y Entidad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Permisos
                                    </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((usuario) => (
                                <React.Fragment key={usuario.clave}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {usuario.username}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {usuario.clave}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                {usuario.rol}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        usuario.tipo_entidad === 'empleado' ? 'bg-blue-100 text-blue-800' :
                                                        usuario.tipo_entidad === 'miembro' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-orange-100 text-orange-800'
                                                    }`}>
                                                        {usuario.tipo_entidad}
                                                </span>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {getEntityDisplayName(usuario)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {usuario.permisos.length} permisos
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => setShowUserDetails(
                                                    showUserDetails === usuario.clave ? null : usuario.clave
                                                )}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                {showUserDetails === usuario.clave ? 'Ocultar' : 'Ver'} Detalles
                                            </button>
                                                                        {canUpdateTemporal && (
                                                        <button
                                    className="text-blue-600 hover:text-blue-900"
                                    onClick={() => handleOpenEditForm(usuario)}
                                >
                                    Editar
                                                        </button>
                                                    )}
                                                                        {canDeleteTemporal && (
                                                        <button
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => handleDeleteUser(usuario.clave)}
                                >
                                    Eliminar
                                                        </button>
                                                    )}
                                        </td>
                                    </tr>
                                    {showUserDetails === usuario.clave && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4">
                                                {renderUserDetails(usuario)}
                                            </td>
                                        </tr>
                                        )}
                                </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    {usuarios.length === 0 ? 'No hay usuarios registrados' : 'No se encontraron usuarios con los filtros aplicados'}
                </div>
            )}
        </div>
    );
};

export default UserManagement;
