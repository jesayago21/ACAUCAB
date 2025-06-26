import { authStorage } from './authService';

const API_BASE_URL = 'http://localhost:5000/api';

export interface Reposicion {
  clave: number;
  fk_almacen: number;
  fk_inventario_tienda: number;
  fk_usuario: number;
  cantidad: number;
  fecha: string;
  estado_actual: string;
  fecha_ultimo_cambio: string;
  comentario_ultimo: string;
  producto_nombre: string;
  presentacion_nombre: string;
  stock_actual: number;
  tienda_nombre: string;
  usuario_responsable: string;
  jefe_pasillo: string;
  urgencia: 'Crítico' | 'Urgente' | 'Moderado' | 'Normal';
}

export interface EstadoReposicion {
  clave: number;
  estado: string;
  aplicable_a: string;
}

export interface EstadisticasReposiciones {
  total_reposiciones: number;
  pendientes: number;
  en_proceso: number;
  completadas: number;
  criticas: number;
  promedio_tiempo_procesamiento: string;
}

export interface JefePasillo {
  usuario_id: number;
  username: string;
  nombre_completo: string;
  telefono: string;
  email: string;
}

class ReposicionService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const token = authStorage.getToken();
    
    // Si la acción requiere autenticación y no hay token, rechazar la petición inmediatamente.
    if (!token && options.method && options.method !== 'GET') {
        throw new Error('No autenticado o token inválido.');
    }

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido en la respuesta del servidor' }));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      // Si la respuesta no tiene contenido (ej. 204 No Content), devolver un objeto vacío
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      } else {
        return {} as T;
      }

    } catch (error) {
      console.error(`Error en la petición a ${endpoint}:`, error);
      throw error;
    }
  }

  // Obtener todas las reposiciones
  async getAllReposiciones(): Promise<{ success: boolean; data: Reposicion[]; total: number }> {
    return this.request<{ success: boolean; data: Reposicion[]; total: number }>('/reposiciones');
  }

  // Obtener reposiciones por tienda
  async getReposicionesByTienda(tiendaId: number): Promise<{ success: boolean; data: Reposicion[]; total: number }> {
    return this.request<{ success: boolean; data: Reposicion[]; total: number }>(`/reposiciones/tienda/${tiendaId}`);
  }

  // Obtener una reposición específica
  async getReposicionById(id: number): Promise<{ success: boolean; data: Reposicion }> {
    return this.request<{ success: boolean; data: Reposicion }>(`/reposiciones/${id}`);
  }

  // Actualizar estado de reposición
  async updateEstadoReposicion(
    id: number, 
    estadoId: number, 
    comentario?: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/reposiciones/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estadoId, comentario }),
    });
  }

  // Crear reposición manual
  async createReposicionManual(
    inventarioTiendaId: number,
    cantidad: number,
    comentario?: string
  ): Promise<{ success: boolean; message: string; data: { reposicionId: number } }> {
    return this.request<{ success: boolean; message: string; data: { reposicionId: number } }>('/reposiciones/manual', {
      method: 'POST',
      body: JSON.stringify({ inventarioTiendaId, cantidad, comentario }),
    });
  }

  // Obtener jefes de pasillo por tienda
  async getJefesPasilloPorTienda(tiendaId: number): Promise<{ success: boolean; data: JefePasillo[] }> {
    return this.request<{ success: boolean; data: JefePasillo[] }>(`/reposiciones/tienda/${tiendaId}/jefes-pasillo`);
  }

  // Obtener estadísticas de reposiciones
  async getEstadisticasReposiciones(tiendaId?: number): Promise<{ success: boolean; data: EstadisticasReposiciones }> {
    const queryParam = tiendaId ? `?tiendaId=${tiendaId}` : '';
    return this.request<{ success: boolean; data: EstadisticasReposiciones }>(`/reposiciones/estadisticas/resumen${queryParam}`);
  }

  // Obtener estados disponibles para reposiciones
  async getEstadosReposicion(): Promise<{ success: boolean; data: EstadoReposicion[] }> {
    return this.request<{ success: boolean; data: EstadoReposicion[] }>('/reposiciones/estados/disponibles');
  }
}

export const reposicionService = new ReposicionService(); 