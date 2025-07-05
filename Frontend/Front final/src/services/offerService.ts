/** Servicios para gestión de ofertas */

const API_BASE_URL = `${import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api`;

// Tipos para ofertas
export interface OfertaActiva {
  oferta_id: number;
  presentacion_id: number;
  presentacion_nombre: string;
  cerveza_nombre: string;
  precio_original: number;
  porcentaje_descuento: number;
  precio_oferta: number;
  fecha_inicio: string;
  fecha_fin: string;
  dias_restantes: number;
}

export interface ProductoElegible {
  presentacion_id: number;
  presentacion_nombre: string;
  precio: number;
  cerveza_nombre: string;
  tipo_cerveza: string;
  miembro: string;
  ultima_oferta_fin: string;
  puede_tener_oferta: boolean;
}

export interface HistorialOferta {
  oferta_id: number;
  porcentaje_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  ventas_durante_oferta: number;
  ingresos_durante_oferta: number;
}

export interface EstadisticasOfertas {
  total_ofertas: number;
  ofertas_activas: number;
  ofertas_finalizadas: number;
  descuento_promedio: number;
  ventas_totales_ofertas: number;
  ingresos_totales_ofertas: number;
}

export interface CrearOfertaRequest {
  presentacion_id: number;
  porcentaje_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
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

export const offerService = {
  // =============================================
  // GESTIÓN DE OFERTAS
  // =============================================

  /** Obtener ofertas activas */
  async getOfertasActivas(): Promise<OfertaActiva[]> {
    const data = await fetchAPI('/ofertas/activas');
    return data.data || [];
  },

  /** Crear nueva oferta */
  async createOferta(oferta: CrearOfertaRequest): Promise<{ oferta_id: number }> {
    const data = await fetchAPI('/ofertas', {
      method: 'POST',
      body: JSON.stringify(oferta),
    });
    return data.data;
  },

  /** Eliminar oferta */
  async deleteOferta(ofertaId: number): Promise<void> {
    await fetchAPI(`/ofertas/${ofertaId}`, {
      method: 'DELETE',
    });
  },

  /** Validar si se puede crear una oferta para una presentación */
  async validarPeriodoOferta(presentacionId: number, fechaInicio: string): Promise<{
    puede_crear_oferta: boolean;
    mensaje: string;
  }> {
    const params = new URLSearchParams({
      presentacion_id: presentacionId.toString(),
      fecha_inicio: fechaInicio,
    });

    const data = await fetchAPI(`/ofertas/validar-periodo?${params.toString()}`);
    return data.data;
  },

  /** Obtener productos elegibles para ofertas */
  async getProductosElegibles(): Promise<ProductoElegible[]> {
    const data = await fetchAPI('/ofertas/productos-elegibles');
    return data.data || [];
  },

  /** Obtener estadísticas de ofertas */
  async getEstadisticasOfertas(fechaInicio?: string, fechaFin?: string): Promise<EstadisticasOfertas> {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fecha_inicio', fechaInicio);
    if (fechaFin) params.append('fecha_fin', fechaFin);

    const data = await fetchAPI(`/ofertas/estadisticas?${params.toString()}`);
    return data.data;
  },

  /** Obtener historial de ofertas de una presentación */
  async getHistorialOfertas(presentacionId: number): Promise<HistorialOferta[]> {
    const data = await fetchAPI(`/ofertas/historial/${presentacionId}`);
    return data.data || [];
  },

  // =============================================
  // UTILIDADES
  // =============================================

  /** Calcular precio con descuento */
  calcularPrecioOferta(precioOriginal: number, porcentajeDescuento: number): number {
    return precioOriginal * (1 - porcentajeDescuento / 100);
  },

  /** Calcular ahorro */
  calcularAhorro(precioOriginal: number, porcentajeDescuento: number): number {
    return precioOriginal * (porcentajeDescuento / 100);
  },

  /** Validar porcentaje de descuento */
  validarPorcentajeDescuento(porcentaje: number): boolean {
    return porcentaje > 0 && porcentaje < 100;
  },

  /** Validar fechas de oferta */
  validarFechasOferta(fechaInicio: string, fechaFin: string): {
    valido: boolean;
    error?: string;
  } {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const hoy = new Date();
    
    if (inicio >= fin) {
      return {
        valido: false,
        error: 'La fecha de inicio debe ser anterior a la fecha de fin',
      };
    }

    if (inicio < hoy) {
      return {
        valido: false,
        error: 'La fecha de inicio no puede ser anterior a hoy',
      };
    }

    const duracionMaxima = 30 * 24 * 60 * 60 * 1000; // 30 días en milisegundos
    if (fin.getTime() - inicio.getTime() > duracionMaxima) {
      return {
        valido: false,
        error: 'La oferta no puede durar más de 30 días',
      };
    }

    return { valido: true };
  },

  /** Formatear estado de oferta */
  formatearEstadoOferta(estado: string): string {
    const estados = {
      programada: 'Programada',
      activa: 'Activa',
      finalizada: 'Finalizada',
    };
    return estados[estado as keyof typeof estados] || estado;
  },

  /** Obtener color del estado */
  getColorEstado(estado: string): string {
    const colores = {
      programada: 'text-blue-600 bg-blue-100',
      activa: 'text-green-600 bg-green-100',
      finalizada: 'text-gray-600 bg-gray-100',
    };
    return colores[estado as keyof typeof colores] || 'text-gray-600 bg-gray-100';
  },

  /** Calcular días restantes */
  calcularDiasRestantes(fechaFin: string): number {
    const fin = new Date(fechaFin);
    const hoy = new Date();
    const diferencia = fin.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  },

  /** Formatear número como moneda */
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2,
    }).format(valor);
  },

  /** Formatear porcentaje */
  formatearPorcentaje(valor: number): string {
    return `${valor}%`;
  },

  /** Formatear fecha */
  formatearFecha(fecha: string): string {
    return new Intl.DateTimeFormat('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(fecha));
  },
}; 