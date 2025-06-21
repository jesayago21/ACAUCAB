/** Servicio de autenticación para comunicación con la API */
import type { 
  LoginCredentials, 
  LoginResponse, 
  VerificarPermisoRequest, 
  VerificarPermisoResponse,
  Usuario 
} from '../types/auth';

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000';
const API_TIMEOUT = parseInt(import.meta.env.PUBLIC_API_TIMEOUT || '10000');

/** Configuración base para fetch */
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  signal: AbortSignal.timeout(API_TIMEOUT)
};

/** Realizar login */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      ...fetchConfig,
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    return data;

  } catch (error) {
    console.error('Error en login:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        return {
          success: false,
          message: 'Tiempo de espera agotado. Verifique su conexión.'
        };
      }
      
      return {
        success: false,
        message: `Error de conexión: ${error.message}`
      };
    }

    return {
      success: false,
      message: 'Error desconocido durante el login'
    };
  }
};

/** Verificar si un usuario tiene un permiso específico */
export const verificarPermiso = async (request: VerificarPermisoRequest): Promise<VerificarPermisoResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verificar-permiso`, {
      ...fetchConfig,
      method: 'POST',
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data: VerificarPermisoResponse = await response.json();
    return data;

  } catch (error) {
    console.error('Error verificando permiso:', error);
    
    return {
      success: false,
      tiene_permiso: false,
      message: 'Error al verificar permiso'
    };
  }
};

/** Obtener perfil completo del usuario */
export const obtenerPerfilUsuario = async (usuarioId: number): Promise<{ success: boolean; user?: Usuario; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/perfil/${usuarioId}`, {
      ...fetchConfig,
      method: 'GET'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    
    return {
      success: false,
      message: 'Error al obtener perfil del usuario'
    };
  }
};

/** Utilities para localStorage */
export const authStorage = {
  /** Guardar usuario en localStorage */
  saveUser: (user: Usuario): void => {
    try {
      localStorage.setItem('acaucab_user', JSON.stringify(user));
    } catch (error) {
      console.error('Error guardando usuario en localStorage:', error);
    }
  },

  /** Obtener usuario de localStorage */
  getUser: (): Usuario | null => {
    try {
      const userData = localStorage.getItem('acaucab_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error obteniendo usuario de localStorage:', error);
      return null;
    }
  },

  /** Remover usuario de localStorage */
  removeUser: (): void => {
    try {
      localStorage.removeItem('acaucab_user');
    } catch (error) {
      console.error('Error removiendo usuario de localStorage:', error);
    }
  },

  /** Verificar si hay una sesión activa */
  hasActiveSession: (): boolean => {
    return authStorage.getUser() !== null;
  }
}; 