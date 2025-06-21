/** Componente de formulario de login para administración */
import React, { useState } from 'react';
import type { LoginCredentials, LoginResponse } from '../../types/auth';

interface LoginFormProps {
  onLoginSuccess: (response: LoginResponse) => void;
  onVolver: () => void;
  isLoading?: boolean;
}

export default function LoginForm({ 
  onLoginSuccess, 
  onVolver, 
  isLoading = false 
}: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setError('El email es requerido');
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
      const { login } = await import('../../services/authService');
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
          permisos: response.user.permisos.length
        });
        
        onLoginSuccess(response);
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
    alert('Funcionalidad de registro no implementada aún.');
  };

  /** Manejar "Registrarse como miembro" */
  const handleRegisterMember = () => {
    alert('Funcionalidad de registro de miembros no implementada aún.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botón de volver */}
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al Autopago
          </button>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-gray-600 text-sm">
              Acceso al sistema administrativo ACAUCAB
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div>
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                disabled={isSubmitting}
                autoComplete="username"
              />
            </div>

            {/* Campo Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
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

            {/* Opciones adicionales */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-gray-600">Recordarme</span>
              </label>
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                disabled={isSubmitting}
              >
                Olvidé la contraseña
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
              disabled={isSubmitting || isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting || isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Enlaces de registro */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-gray-600 text-sm">
              ¿No tienes una cuenta?{' '}
              <button
                onClick={handleRegister}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                disabled={isSubmitting}
              >
                Regístrate
              </button>
            </p>
            
            <p className="text-gray-600 text-sm">
              ¿Deseas ser un aliado comercial?{' '}
              <button
                onClick={handleRegisterMember}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                disabled={isSubmitting}
              >
                Regístrate como miembro
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 