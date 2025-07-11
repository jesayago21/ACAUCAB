/** Servicios para gestión de compras */
import type { 
  OrdenCompra, 
  DetalleOrdenCompra, 
  EstadisticasCompras,
  MiembroProveedor,
  EstadoCompra,
  ProductoCompra,
  HistorialEstado
} from '../types/api';

// Configuración de la API
const API_BASE_URL = `${import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api`;

/** Función utilitaria para realizar peticiones */
async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout: La operación tardó demasiado tiempo');
    }
    throw error;
  }
}

/** Función utilitaria para manejo de errores en fetch */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Error HTTP: ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      switch (response.status) {
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 400:
          errorMessage = 'Solicitud inválida';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        case 503:
          errorMessage = 'Servicio no disponible';
          break;
      }
    }
    
    throw new Error(errorMessage);
  }
  
  try {
    return await response.json();
  } catch {
    throw new Error('Error al procesar la respuesta del servidor');
  }
}

/** Servicios para Compras */
export const comprasService = {
  /** Obtener todas las órdenes de compra */
  async getOrdenesCompra(filtros?: {
    estado_filtro?: string;
    miembro_id?: number;
    limite?: number;
    offset?: number;
  }): Promise<OrdenCompra[]> {
    const params = new URLSearchParams();
    if (filtros?.estado_filtro) params.append('estado_filtro', filtros.estado_filtro);
    if (filtros?.miembro_id) params.append('miembro_id', filtros.miembro_id.toString());
    if (filtros?.limite) params.append('limite', filtros.limite.toString());
    if (filtros?.offset) params.append('offset', filtros.offset.toString());

    const response = await fetchWithTimeout(`${API_BASE_URL}/compras?${params.toString()}`);
    const data = await handleResponse<{success: boolean, data: OrdenCompra[]}>(response);
    return data.data;
  },

  /** Obtener detalle de una orden de compra específica */
  async getDetalleOrdenCompra(id: number): Promise<DetalleOrdenCompra> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/compras/${id}`);
    const data = await handleResponse<{success: boolean, data: DetalleOrdenCompra}>(response);
    return data.data;
  },

  /** Crear nueva orden de compra */
  async createOrdenCompra(orden: {
    miembro_rif: number;
    almacen_id: number;
    cantidad: number;
    precio_unitario: number;
  }): Promise<{compra_id: number}> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/compras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orden),
    });
    const data = await handleResponse<{success: boolean, data: {compra_id: number}}>(response);
    return data.data;
  },

  /** Cambiar estado de una orden de compra */
  async cambiarEstadoOrdenCompra(id: number, nuevo_estado: string): Promise<void> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/compras/${id}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nuevo_estado }),
    });
    await handleResponse<{success: boolean}>(response);
  },

  /** Obtener estadísticas de compras */
  async getEstadisticasCompras(): Promise<EstadisticasCompras> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/compras/estadisticas`);
    const data = await handleResponse<{success: boolean, data: EstadisticasCompras}>(response);
    return data.data;
  },

  /** Obtener miembros proveedores */
  async getMiembrosProveedores(): Promise<MiembroProveedor[]> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/compras/miembros-proveedores`);
    const data = await handleResponse<{success: boolean, data: MiembroProveedor[]}>(response);
    return data.data;
  },

  /** Obtener estados disponibles para compras */
  async getEstadosCompra(): Promise<EstadoCompra[]> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/compras/estados`);
    const data = await handleResponse<{success: boolean, data: EstadoCompra[]}>(response);
    return data.data;
  },

  /** Obtener productos disponibles para compra */
  async getProductosParaCompra(): Promise<ProductoCompra[]> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/compras/productos`);
    const data = await handleResponse<{success: boolean, data: ProductoCompra[]}>(response);
    return data.data;
  },

  /** Obtener historial de estados de una orden de compra */
  async getHistorialEstados(id: number): Promise<HistorialEstado[]> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/compras/${id}/historial`);
    const data = await handleResponse<{success: boolean, data: HistorialEstado[]}>(response);
    return data.data;
  }
}; 