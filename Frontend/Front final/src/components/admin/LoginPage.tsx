/** Página completa de login administrativo */
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import AdminDashboard from './AdminDashboard';
import { authStorage } from '../../services/authService';
import type { Usuario, LoginResponse } from '../../types/auth';

export default function LoginPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Verificar sesión activa al cargar */
  useEffect(() => {
    const usuarioGuardado = authStorage.getUser();
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
    setIsLoading(false);
  }, []);

  /** Manejar login exitoso */
  const handleLoginSuccess = (response: LoginResponse) => {
    if (response.user && response.token) {
      setUsuario(response.user);
      // La autenticación (guardado de datos) ya se maneja en el servicio de login
      // No es necesario volver a guardar aquí.
    }
  };

  /** Manejar logout */
  const handleLogout = () => {
    setUsuario(null);
    authStorage.clearAuthData();
  };

  /** Manejar volver al autopago */
  const handleVolver = () => {
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (usuario) {
    return (
      <AdminDashboard
        usuario={usuario}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <LoginForm
      onLoginSuccess={handleLoginSuccess}
      onVolver={handleVolver}
      isLoading={isLoading}
    />
  );
} 