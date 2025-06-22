import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/auth';

/** Componente de gestión de privilegios */
interface PrivilegeManagementProps {
  user: Usuario;
}

interface Privilegio {
  clave: number;
  nombre: string;
  descripcion?: string;
}

interface PrivilegioModulo {
  module: string;
  displayName: string;
  privileges: Privilegio[];
}

const PrivilegeManagement: React.FC<PrivilegeManagementProps> = ({ user }) => {
    const [privilegios, setPrivilegios] = useState<Privilegio[]>([]);
    const [privilegiosModulos, setPrivilegiosModulos] = useState<PrivilegioModulo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState<string>('all');

    /** Verificar permisos */
    const hasPermission = (permission: string): boolean => {
        return user.permisos.some((p: any) => p.nombre === permission);
    };

    const canView = hasPermission('Consultar privilegio');

    /** Cargar datos iniciales */
    useEffect(() => {
        loadPrivilegios();
    }, []);

    const loadPrivilegios = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/privileges');
            if (!response.ok) throw new Error('Error al cargar privilegios');
            
            const data = await response.json();
            setPrivilegios(data);
            
            // Agrupar privilegios por módulo
            groupPrivilegesByModule(data);
        } catch (error) {
            console.error('Error cargando privilegios:', error);
            setError('Error al cargar los privilegios');
        } finally {
            setLoading(false);
        }
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

    /** Filtrar privilegios según búsqueda y módulo seleccionado */
    const getFilteredPrivileges = () => {
        let filtered = privilegios;

        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filtrar por módulo
        if (selectedModule !== 'all') {
            filtered = filtered.filter(p => 
                p.nombre.toLowerCase().includes(selectedModule.toLowerCase())
            );
        }

        return filtered;
    };

    /** Obtener color del badge según la acción */
    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'crear':
                return 'bg-green-100 text-green-800';
            case 'consultar':
                return 'bg-blue-100 text-blue-800';
            case 'modificar':
                return 'bg-yellow-100 text-yellow-800';
            case 'eliminar':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    /** Obtener ícono según la acción */
    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'crear':
                return '➕';
            case 'consultar':
                return '👁️';
            case 'modificar':
                return '✏️';
            case 'eliminar':
                return '🗑️';
            default:
                return '🔧';
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
                <p className="text-red-700">No tiene permisos para ver la gestión de privilegios.</p>
            </div>
        );
    }

    const filteredPrivileges = getFilteredPrivileges();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Privilegios</h2>
                    <p className="text-gray-600">Consultar privilegios disponibles en el sistema</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <span className="font-semibold">{privilegios.length}</span> privilegios totales
                    </p>
                </div>
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

            {/* Filtros */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-lg font-semibold mb-4">Filtros de Búsqueda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar por nombre o descripción
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: usuario, crear, consultar..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrar por módulo
                        </label>
                        <select
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos los módulos</option>
                            {privilegiosModulos.map(module => (
                                <option key={module.module} value={module.module}>
                                    {module.displayName} ({module.privileges.length})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Estadísticas de filtro */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Mostrando <span className="font-semibold">{filteredPrivileges.length}</span> de{' '}
                        <span className="font-semibold">{privilegios.length}</span> privilegios
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                Limpiar búsqueda
                            </button>
                        )}
                    </p>
                </div>
            </div>

            {/* Vista por módulos */}
            <div className="space-y-6">
                {selectedModule === 'all' ? (
                    // Mostrar todos los módulos
                    privilegiosModulos.map((module) => {
                        const modulePrivileges = module.privileges.filter(p => 
                            !searchTerm || 
                            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
                        );

                        if (modulePrivileges.length === 0) return null;

                        return (
                            <div key={module.module} className="bg-white rounded-lg shadow-md border">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {module.displayName}
                                        </h3>
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                            {modulePrivileges.length} privilegios
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {modulePrivileges.map((privilege) => {
                                            const action = privilege.nombre.split(' ')[0];
                                            return (
                                                <div key={privilege.clave} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getActionIcon(action)}</span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(action)}`}>
                                                                {action}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">#{privilege.clave}</span>
                                                    </div>
                                                    <h4 className="font-medium text-gray-900 mb-1">
                                                        {privilege.nombre}
                                                    </h4>
                                                    {privilege.descripcion && (
                                                        <p className="text-sm text-gray-600">
                                                            {privilege.descripcion}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    // Mostrar tabla de privilegios filtrados
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acción
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Descripción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPrivileges.map((privilege) => {
                                        const action = privilege.nombre.split(' ')[0];
                                        return (
                                            <tr key={privilege.clave} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {privilege.clave}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg">{getActionIcon(action)}</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(action)}`}>
                                                            {action}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {privilege.nombre}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {privilege.descripcion || 'Sin descripción'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {filteredPrivileges.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron privilegios</h3>
                    <p className="text-gray-500">
                        {searchTerm || selectedModule !== 'all' 
                            ? 'Prueba con otros términos de búsqueda o filtros'
                            : 'No hay privilegios registrados en el sistema'
                        }
                    </p>
                </div>
            )}

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <span className="text-blue-600 text-xl">ℹ️</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                            Información sobre Privilegios
                        </h3>
                        <div className="text-sm text-blue-700 space-y-1">
                            <p>• Los privilegios definen las acciones que pueden realizar los usuarios</p>
                            <p>• Cada privilegio está asociado a un módulo específico del sistema</p>
                            <p>• Los privilegios se asignan a roles, no directamente a usuarios</p>
                            <p>• Existen 4 tipos principales de acciones: Crear, Consultar, Modificar, Eliminar</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivilegeManagement;
