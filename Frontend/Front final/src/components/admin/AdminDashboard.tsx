/** Dashboard administrativo con validación de usuario */
import React from 'react';
import AdminDashboardMain from './AdminDashboardMain';
import type { Usuario } from '../../types/auth';

interface AdminDashboardProps {
  usuario: Usuario | null;
  onLogout: () => void;
}

export default function AdminDashboard({ usuario, onLogout }: AdminDashboardProps) {
  /** Validar que el usuario existe y tiene los datos mínimos necesarios */
  if (!usuario) {
    console.error('❌ Usuario no definido en AdminDashboard');
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-900 mb-2">Error de Sesión</h2>
          <p className="text-red-700 mb-4">No se pudo cargar la información del usuario.</p>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  /** Validar que el usuario tiene los campos mínimos necesarios */
  if (!usuario.username || !usuario.rol || !usuario.permisos) {
    console.error('❌ Datos de usuario incompletos:', { 
      hasUsername: !!usuario.username,
      hasRol: !!usuario.rol,
      hasPermisos: !!usuario.permisos 
    });
    
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-xl font-bold text-yellow-900 mb-2">Datos Incompletos</h2>
          <p className="text-yellow-700 mb-4">La información del usuario está incompleta.</p>
          <button
            onClick={onLogout}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Iniciar Sesión Nuevamente
          </button>
        </div>
      </div>
    );
  }

  /** Renderizar el dashboard principal si todo está bien */
  return (
    <AdminDashboardMain 
      user={usuario} 
      onLogout={onLogout} 
    />
  );
} 