/** Dashboard administrativo principal */
import React from 'react';
import type { Usuario } from '../../types/auth';

interface AdminDashboardProps {
  usuario: Usuario;
  onLogout: () => void;
}

export default function AdminDashboard({ usuario, onLogout }: AdminDashboardProps) {
  /** Obtener saludo según la hora */
  const obtenerSaludo = (): string => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  /** Obtener color del badge según el tipo de entidad */
  const getEntityBadgeColor = (tipo: string): string => {
    switch (tipo) {
      case 'empleado': return 'bg-blue-100 text-blue-800';
      case 'miembro': return 'bg-green-100 text-green-800';
      case 'cliente': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /** Renderizar información específica de la entidad */
  const renderEntityInfo = () => {
    switch (usuario.entidad.tipo) {
      case 'empleado':
        return (
          <div className="space-y-2">
            <p><span className="font-medium">Cargo:</span> {usuario.entidad.cargo || 'No asignado'}</p>
            <p><span className="font-medium">Departamento:</span> {usuario.entidad.departamento || 'No asignado'}</p>
            <p><span className="font-medium">Tienda:</span> {usuario.entidad.tienda || 'No asignada'}</p>
          </div>
        );
      
      case 'miembro':
        return (
          <div className="space-y-2">
            <p><span className="font-medium">Razón Social:</span> {usuario.entidad.razon_social}</p>
            {usuario.entidad.denominacion_comercial && (
              <p><span className="font-medium">Denominación:</span> {usuario.entidad.denominacion_comercial}</p>
            )}
          </div>
        );
      
      case 'cliente':
        return (
          <div className="space-y-2">
            <p><span className="font-medium">Tipo:</span> {usuario.entidad.tipo_cliente === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}</p>
            <p><span className="font-medium">Puntos:</span> {usuario.entidad.puntos_acumulados} pts</p>
          </div>
        );
      
      default:
        return <p className="text-gray-500">Información no disponible</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {usuario.entidad.tipo === 'miembro' 
                      ? usuario.entidad.razon_social.charAt(0).toUpperCase()
                      : usuario.entidad.nombre.charAt(0).toUpperCase()
                    }
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Panel Administrativo ACAUCAB
                  </h1>
                  <p className="text-sm text-gray-500">
                    {obtenerSaludo()}, {usuario.entidad.tipo === 'miembro' 
                      ? usuario.entidad.razon_social
                      : usuario.entidad.nombre
                    }
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Información del usuario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información del Usuario
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Usuario</p>
                  <p className="text-base text-gray-900">{usuario.username}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Rol</p>
                  <p className="text-base text-gray-900">{usuario.rol.nombre}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Entidad</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEntityBadgeColor(usuario.tipo_entidad)}`}>
                    {usuario.tipo_entidad.charAt(0).toUpperCase() + usuario.tipo_entidad.slice(1)}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Detalles</p>
                  {renderEntityInfo()}
                </div>
              </div>
            </div>
          </div>

          {/* Permisos del usuario */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Permisos Asignados ({usuario.permisos.length})
              </h2>
              
              {usuario.permisos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {usuario.permisos.map((permiso) => (
                    <div 
                      key={permiso.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">
                        {permiso.nombre}
                      </h3>
                      {permiso.descripcion && (
                        <p className="text-sm text-gray-600">
                          {permiso.descripcion}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-gray-500">No hay permisos asignados a este usuario</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                  </svg>
                  <p className="text-sm text-gray-600">Ver Reportes</p>
                </div>
              </button>
              
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <p className="text-sm text-gray-600">Gestionar Usuarios</p>
                </div>
              </button>
              
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-sm text-gray-600">Inventario</p>
                </div>
              </button>
              
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm text-gray-600">Configuración</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 