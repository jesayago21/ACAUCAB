/** Servicios para gestión de eventos */

const API_BASE_URL = `${import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api`;

// Tipos para eventos
export interface TipoEvento {
  clave: number;
  nombre: string;
  descripcion: string;
}

export interface Evento {
  clave: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  direccion: string;
  precio_entrada?: number;
  tipo_evento: string;
  lugar: string;
  cantidad_subeventos: number;
  cantidad_asistentes: number;
  ingresos_totales: number;
  evento_padre_id?: number;
  evento_padre_nombre?: string;
}

export interface Asistente {
  ticket_id: number;
  asistencia_id: number | null;
  cliente_id: number;
  cliente_nombre: string;
  cliente_documento: number;
  fecha_entrada: string;
  tipo_cliente: string;
}

export interface Invitado {
  invitado_id: number;
  rif: number;
  nombre_completo: string;
  tipo_invitado: string;
  fecha_entrada?: string;
  fecha_salida?: string;
}

export interface EstadisticasEntrada {
  evento_id: number;
  evento_nombre: string;
  fecha_evento: string;
  tipo_evento: string;
  entradas_vendidas: number;
  ingresos_totales: number;
}


/** Función utilitaria para realizar peticiones */
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
  }

  return response.json();
}

export const eventService = {
  // =============================================
  // TIPOS DE EVENTOS
  // =============================================
  
  async getTiposEvento(): Promise<TipoEvento[]> {
    const data = await fetchAPI('/eventos/tipos');
    return data.data || [];
  },

  async createTipoEvento(tipo: Omit<TipoEvento, 'clave'>): Promise<TipoEvento> {
    const data = await fetchAPI('/eventos/tipos', {
      method: 'POST',
      body: JSON.stringify(tipo),
    });
    return data.data;
  },

  async updateTipoEvento(id: number, tipo: Omit<TipoEvento, 'clave'>): Promise<TipoEvento> {
    const data = await fetchAPI(`/eventos/tipos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tipo),
    });
    return data.data;
  },

  async deleteTipoEvento(id: number): Promise<void> {
    await fetchAPI(`/eventos/tipos/${id}`, {
      method: 'DELETE',
    });
  },

  // =============================================
  // EVENTOS PRINCIPALES
  // =============================================

  async getEventos(filtros?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    lugar_id?: number;
    tipo?: string;
  }): Promise<Evento[]> {
    const params = new URLSearchParams();
    if (filtros?.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros?.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros?.lugar_id) params.append('lugar_id', filtros.lugar_id.toString());
    if (filtros?.tipo) params.append('tipo', filtros.tipo);

    const data = await fetchAPI(`/eventos?${params.toString()}`);
    return data.data || [];
  },

  async getEventoById(id: number): Promise<Evento> {
    const data = await fetchAPI(`/eventos/${id}`);
    return data.data;
  },

  async createEvento(evento: Omit<Evento, 'clave' | 'cantidad_subeventos' | 'cantidad_asistentes' | 'ingresos_totales' | 'tipo_evento' | 'lugar'> & {
    fk_lugar: number;
    fk_tipo_evento: number;
    fk_evento?: number;
  }): Promise<{ id: number }> {
    const data = await fetchAPI('/eventos', {
      method: 'POST',
      body: JSON.stringify(evento),
    });
    return data.data;
  },

  async updateEvento(id: number, evento: Partial<Evento> & {
    fk_lugar?: number;
    fk_tipo_evento?: number;
    fk_evento?: number;
  }): Promise<void> {
    await fetchAPI(`/eventos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(evento),
    });
  },

  async deleteEvento(id: number): Promise<void> {
    await fetchAPI(`/eventos/${id}`, {
      method: 'DELETE',
    });
  },

  async getEventosActivos(): Promise<Evento[]> {
    const data = await fetchAPI('/eventos/activos');
    return data.data || [];
  },

  async getEventosProximos(dias: number = 30): Promise<Evento[]> {
    const data = await fetchAPI(`/eventos/proximos?dias=${dias}`);
    return data.data || [];
  },

  // =============================================
  // SUB-EVENTOS
  // =============================================

  async getSubeventos(eventoId: number): Promise<Evento[]> {
    const data = await fetchAPI(`/eventos/${eventoId}/subeventos`);
    return data.data || [];
  },

  async createSubevento(eventoId: number, subevento: Omit<Evento, 'clave' | 'cantidad_subeventos' | 'cantidad_asistentes' | 'ingresos_totales'> & {
    fk_lugar: number;
    fk_tipo_evento: number;
  }): Promise<{ id: number }> {
    const data = await fetchAPI(`/eventos/${eventoId}/subeventos`, {
      method: 'POST',
      body: JSON.stringify(subevento),
    });
    return data.data;
  },

  async updateSubevento(id: number, subevento: Partial<Evento> & {
    fk_lugar?: number;
    fk_tipo_evento?: number;
  }): Promise<void> {
    await fetchAPI(`/eventos/subeventos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subevento),
    });
  },

  async deleteSubevento(id: number): Promise<void> {
    await fetchAPI(`/eventos/subeventos/${id}`, {
      method: 'DELETE',
    });
  },

  // =============================================
  // INVENTARIO DE EVENTOS
  // =============================================

  async getInventarioEvento(eventoId: number): Promise<any[]> { // Changed from InventarioEvento[] to any[]
    const data = await fetchAPI(`/eventos/${eventoId}/inventario`);
    return data.data || [];
  },

  async updateInventarioEvento(eventoId: number, presentacionId: number, cantidad: number): Promise<void> {
    await fetchAPI(`/eventos/${eventoId}/inventario`, {
      method: 'PUT',
      body: JSON.stringify({
        presentacion_id: presentacionId,
        cantidad: cantidad,
      }),
    });
  },

  async transferirInventarioEvento(eventoId: number, almacenId: number, cantidad: number): Promise<void> {
    await fetchAPI(`/eventos/${eventoId}/inventario/transferir`, {
      method: 'POST',
      body: JSON.stringify({
        almacen_id: almacenId,
        cantidad: cantidad,
      }),
    });
  },

  // =============================================
  // ASISTENCIA Y PARTICIPANTES
  // =============================================

  async getAsistentes(eventoId: number): Promise<Asistente[]> {
    const data = await fetchAPI(`/eventos/${eventoId}/asistentes`);
    return data.data || [];
  },

  async venderEntrada(eventoId: number, clienteId: number, pagos: Array<{
    metodo_pago_id: number;
    monto: number;
    tasa_cambio_id: number;
  }>): Promise<{ venta_id: number }> {
    const data = await fetchAPI(`/eventos/${eventoId}/entradas`, {
      method: 'POST',
      body: JSON.stringify({
        cliente_id: clienteId,
        pagos: pagos,
      }),
    });
    return data.data;
  },

  async getInvitados(eventoId: number): Promise<Invitado[]> {
    const data = await fetchAPI(`/eventos/${eventoId}/invitados`);
    return data.data || [];
  },

  async agregarInvitado(eventoId: number, invitado: {
    ci: number;
    rif: number;
    primer_nombre: string;
    primer_apellido: string;
    tipo_invitado_id: number;
  }): Promise<{ invitado_id: number }> {
    const data = await fetchAPI(`/eventos/${eventoId}/invitados`, {
      method: 'POST',
      body: JSON.stringify(invitado),
    });
    return data.data;
  },
  
  // =============================================
  // ESTADÍSTICAS Y REPORTES
  // =============================================

  async getEstadisticasEntradas(fecha_inicio?: string, fecha_fin?: string): Promise<EstadisticasEntrada[]> {
    const params = new URLSearchParams();
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    
    const data = await fetchAPI(`/eventos/estadisticas/entradas?${params.toString()}`);
    return data.data || [];
  },

  async getVentasByEventoId(eventoId: number): Promise<{ success: boolean, data: any[] }> {
    try {
      const response = await fetchAPI(`/eventos/${eventoId}/ventas`);
      return response; // La respuesta ya tiene el formato { success, data }
    } catch (error) {
      console.error('Error al obtener las ventas del evento:', error);
      throw error;
    }
  },
}; 