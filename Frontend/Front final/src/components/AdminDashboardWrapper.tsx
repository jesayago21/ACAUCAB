/** Wrapper para el AdminDashboard que maneja la autenticación */
import React, { useState, useEffect } from 'react';
import AdminDashboard from './admin/AdminDashboard';
import { authStorage } from '../services/authService';
import type { Usuario } from '../types/auth';

export default function AdminDashboardWrapper() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Verificar sesión activa al cargar */
  useEffect(() => {
    const usuarioGuardado = authStorage.getUser();
    
    if (!usuarioGuardado) {
      // Si no hay usuario, redirigir al login
      window.location.href = '/login';
      return;
    }

    // Verificar que el usuario no es un cliente
    if (usuarioGuardado.tipo_entidad === 'cliente') {
      // Si es cliente, redirigir al catálogo
      window.location.href = '/catalogo';
      return;
    }

    setUsuario(usuarioGuardado);
    setIsLoading(false);
  }, []);

  /** Manejar logout */
  const handleLogout = () => {
    setUsuario(null);
    authStorage.removeUser();
    window.location.href = '/home';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel administrativo...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No se pudo cargar la información del usuario</p>
          <a 
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      usuario={usuario}
      onLogout={handleLogout}
    />
  );
} 