/** Componente de login centralizado para el ecommerce */
import React, { useState, useEffect } from 'react';
import { authStorage } from '../services/authService';
import type { LoginCredentials, LoginResponse, Usuario } from '../types/auth';

export default function CentralizedLogin() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /** Verificar sesión activa al cargar */
  useEffect(() => {
    const usuarioGuardado = authStorage.getUser();
    if (usuarioGuardado) {
      // Redirigir según tipo de usuario
      redirectUser(usuarioGuardado);
    }
    setIsLoading(false);
  }, []);

  /** Redirigir usuario según su tipo */
  const redirectUser = (user: Usuario) => {
    if (user.tipo_entidad === 'cliente') {
      window.location.href = '/catalogo';
    } else if (user.tipo_entidad === 'empleado' || user.tipo_entidad === 'miembro') {
      window.location.href = '/admin';
    } else {
      // Por defecto al catálogo
      window.location.href = '/catalogo';
    }
  };

  /** Manejar cambios en los inputs */
  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error al empezar a escribir
    if (error) {
      setError('');
    }
  };

  /** Manejar envío del formulario */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!credentials.username.trim()) {
      setError('El usuario es requerido');
      return;
    }
    
    if (!credentials.password.trim()) {
      setError('La contraseña es requerida');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Importar dinámicamente el servicio para evitar problemas de SSR
      const { login } = await import('../services/authService');
      const response = await login(credentials);
      
      console.log('🔍 Respuesta del login:', response);
      
      if (response.success && response.user) {
        // Validar que el usuario tiene los datos mínimos necesarios
        if (!response.user.username || !response.user.rol || !response.user.permisos) {
          console.error('❌ Datos de usuario incompletos recibidos:', response.user);
          setError('Los datos del usuario están incompletos. Contacte al administrador.');
          return;
        }
        
        console.log('✅ Login exitoso, usuario válido:', {
          username: response.user.username,
          rol: response.user.rol.nombre,
          tipo_entidad: response.user.tipo_entidad,
          permisos: response.user.permisos.length
        });
        
        // Guardar usuario y redirigir
        authStorage.saveUser(response.user);
        redirectUser(response.user);
      } else {
        setError(response.message || 'Error durante el login');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('No se pudo conectar')) {
          setError('No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.');
        } else {
          setError('Error de conexión. Verifique su red.');
        }
      } else {
        setError('Error desconocido durante el login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Manejar "Olvidé la contraseña" */
  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña no implementada aún.');
  };

  /** Manejar "Registrarse" */
  const handleRegister = () => {
    // Redirigir a la página de registro del autopago
    window.location.href = '/#registro';
  };

  /** Manejar "Registrarse como miembro" */
  const handleRegisterMember = () => {
    alert('Para registrarse como miembro, contacte a nuestro equipo de ventas.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D4A3A] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <a href="/home" className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#3D4A3A] rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </a>
          <h1 className="text-3xl font-bold text-[#3D4A3A]">ACAUCAB</h1>
          <p className="text-gray-600 mt-1">Sistema de Cervezas Artesanales</p>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenido
            </h2>
            <p className="text-gray-600 text-sm">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                placeholder="Ingrese su usuario"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D4A3A] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                disabled={isSubmitting}
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Campo Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D4A3A] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415M14.12 14.12L9.878 9.878" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#3D4A3A] border-gray-300 rounded focus:ring-[#3D4A3A]"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-gray-600">Recordarme</span>
              </label>
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#3D4A3A] hover:text-[#2C3631] transition-colors"
                disabled={isSubmitting}
              >
                ¿Olvidó su contraseña?
              </button>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O</span>
            </div>
          </div>

          {/* Enlaces de registro */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleRegister}
              className="w-full border-2 border-[#3D4A3A] text-[#3D4A3A] hover:bg-[#3D4A3A] hover:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              disabled={isSubmitting}
            >
              Registrarse como Cliente
            </button>
            
            <p className="text-center text-gray-600 text-sm">
              ¿Deseas ser un aliado comercial?{' '}
              <button
                onClick={handleRegisterMember}
                className="text-[#3D4A3A] hover:text-[#2C3631] font-medium transition-colors"
                disabled={isSubmitting}
              >
                Contáctanos
              </button>
            </p>
          </div>
        </div>

        {/* Links adicionales */}
        <div className="mt-6 text-center">
          <a href="/home" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
} 