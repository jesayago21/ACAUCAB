/** Tipos para el sistema de autenticación */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Permiso {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Rol {
  id: number;
  nombre: string;
}

export interface EntidadEmpleado {
  tipo: 'empleado';
  id: number;
  nombre: string;
  cargo?: string;
  departamento?: string;
  tienda?: string;
}

export interface EntidadMiembro {
  tipo: 'miembro';
  id: number;
  razon_social: string;
  denominacion_comercial?: string;
}

export interface EntidadCliente {
  tipo: 'cliente';
  id: number;
  tipo_cliente: 'natural' | 'juridico';
  nombre: string;
  puntos_acumulados: number;
}

export type Entidad = EntidadEmpleado | EntidadMiembro | EntidadCliente;

export interface Usuario {
  id: number;
  username: string;
  rol: Rol;
  entidad: Entidad;
  tipo_entidad: 'empleado' | 'miembro' | 'cliente';
  permisos: Permiso[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: Usuario;
}

export interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => void;
  tienePermiso: (nombrePermiso: string) => boolean;
  isLoading: boolean;
}

export interface VerificarPermisoRequest {
  usuario_id: number;
  permiso_nombre: string;
}

export interface VerificarPermisoResponse {
  success: boolean;
  tiene_permiso: boolean;
  message: string;
} 