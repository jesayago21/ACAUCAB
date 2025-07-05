/** Servicios para dashboard y analíticas */

const API_BASE_URL = `${import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api`;

// Tipos para dashboard
export interface IndicadorVentas {
  tipo_venta: string;
  cantidad_ventas: number;
  monto_total: number;
  promedio_venta: number;
}

export interface CrecimientoVentas {
  ventas_periodo_actual: number;
  ventas_periodo_anterior: number;
  diferencia_absoluta: number;
  porcentaje_crecimiento: number;
}

export interface TicketPromedio {
  tipo_venta: string;
  ticket_promedio: number;
  cantidad_items_promedio: number;
}

export interface VolumenUnidades {
  tipo_presentacion: string;
  unidades_vendidas: number;
  litros_vendidos: number;
}

export interface VentasPorEstilo {
  estilo_cerveza: string;
  cantidad_vendida: number;
  monto_total: number;
  porcentaje_del_total: number;
}

export interface ClientesNuevosVsRecurrentes {
  tipo_cliente: string;
  cantidad: number;
  porcentaje: number;
}

export interface TasaRetencion {
  clientes_inicio_periodo: number;
  clientes_fin_periodo: number;
  clientes_retenidos: number;
  tasa_retencion: number;
}

export interface RotacionInventario {
  tipo_inventario: string;
  valor_promedio_inventario: number;
  costo_productos_vendidos: number;
  rotacion_inventario: number;
  dias_inventario: number;
}

export interface TasaRuptura {
  tipo_inventario: string;
  total_productos: number;
  productos_sin_stock: number;
  tasa_ruptura: number;
}

export interface VentasPorEmpleado {
  empleado_id: number;
  empleado_nombre: string;
  cargo: string;
  tienda: string;
  cantidad_ventas: number;
  monto_total_ventas: number;
  ticket_promedio: number;
}

export interface VentasPorCanal {
  canal: string;
  cantidad_ventas: number;
  monto_total: number;
  porcentaje_del_total: number;
}

export interface InventarioActual {
  tipo_inventario: string;
  presentacion_id: number;
  presentacion_nombre: string;
  cerveza_nombre: string;
  tipo_cerveza: string;
  stock_actual: number;
  valor_inventario: number;
  estado_stock: string;
}

export interface TendenciaVentas {
  fecha_venta: string;
  total_ventas: number;
}

export interface DashboardCompleto {
  periodo: {
    fecha_inicio: string;
    fecha_fin: string;
    dias_periodo: number;
  };
  indicadores_ventas: {
    ventas_totales: IndicadorVentas[];
    crecimiento_ventas: CrecimientoVentas;
    ticket_promedio: TicketPromedio[];
    volumen_unidades: VolumenUnidades[];
    ventas_por_estilo: VentasPorEstilo[];
    ventas_por_canal: VentasPorCanal[];
    tendencia_ventas: TendenciaVentas[];
  };
  indicadores_clientes: {
    clientes_nuevos_vs_recurrentes: ClientesNuevosVsRecurrentes[];
    tasa_retencion: TasaRetencion;
  };
  indicadores_inventario: {
    rotacion_inventario: RotacionInventario[];
    tasa_ruptura_stock: TasaRuptura[];
  };
  indicadores_operaciones: {
    ventas_por_empleado: VentasPorEmpleado[];
  };
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

export const dashboardService = {
  // =============================================
  // INDICADORES DE VENTAS
  // =============================================

  async getVentasTotales(fechaInicio: string, fechaFin: string, tipoTienda?: string): Promise<IndicadorVentas[]> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });
    
    if (tipoTienda) {
      params.append('tipo_tienda', tipoTienda);
    }

    const data = await fetchAPI(`/dashboard/ventas/totales?${params.toString()}`);
    return data.data || [];
  },

  async getCrecimientoVentas(
    fechaInicioActual: string,
    fechaFinActual: string,
    fechaInicioAnterior: string,
    fechaFinAnterior: string
  ): Promise<CrecimientoVentas> {
    const params = new URLSearchParams({
      fecha_inicio_actual: fechaInicioActual,
      fecha_fin_actual: fechaFinActual,
      fecha_inicio_anterior: fechaInicioAnterior,
      fecha_fin_anterior: fechaFinAnterior,
    });

    const data = await fetchAPI(`/dashboard/ventas/crecimiento?${params.toString()}`);
    return data.data;
  },

  async getTicketPromedio(fechaInicio: string, fechaFin: string): Promise<TicketPromedio[]> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    const data = await fetchAPI(`/dashboard/ventas/ticket-promedio?${params.toString()}`);
    return data.data || [];
  },

  async getVolumenUnidadesVendidas(fechaInicio: string, fechaFin: string): Promise<VolumenUnidades[]> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    const data = await fetchAPI(`/dashboard/ventas/volumen-unidades?${params.toString()}`);
    return data.data || [];
  },

  async getVentasPorEstiloCerveza(fechaInicio: string, fechaFin: string): Promise<VentasPorEstilo[]> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    const data = await fetchAPI(`/dashboard/ventas/por-estilo?${params.toString()}`);
    return data.data || [];
  },

  async getVentasPorCanal(fechaInicio: string, fechaFin: string): Promise<VentasPorCanal[]> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    const data = await fetchAPI(`/dashboard/ventas/por-canal?${params.toString()}`);
    return data.data || [];
  },

  async getTendenciaVentas(fechaInicio: string, fechaFin: string): Promise<TendenciaVentas[]> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    const data = await fetchAPI(`/dashboard/ventas/tendencia?${params.toString()}`);
    return data.data || [];
  },

  async getVentasPorEmpleado(fechaInicio: string, fechaFin: string): Promise<VentasPorEmpleado[]> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    const data = await fetchAPI(`/dashboard/ventas/por-empleado?${params.toString()}`);
    return data.data || [];
  },

  // =============================================
  // INDICADORES DE CLIENTES
  // =============================================

  async getClientesNuevosVsRecurrentes(fechaInicio: string, fechaFin: string): Promise<ClientesNuevosVsRecurrentes[]> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    const data = await fetchAPI(`/dashboard/clientes/nuevos-vs-recurrentes?${params.toString()}`);
    return data.data || [];
  },

  async getTasaRetencionClientes(fechaInicio: string, fechaFin: string): Promise<TasaRetencion> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    const data = await fetchAPI(`/dashboard/clientes/tasa-retencion?${params.toString()}`);
    return data.data;
  },

  // =============================================
  // INDICADORES DE INVENTARIO
  // =============================================

  async getRotacionInventario(fechaInicio: string, fechaFin: string): Promise<RotacionInventario[]> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    const data = await fetchAPI(`/dashboard/inventario/rotacion?${params.toString()}`);
    return data.data || [];
  },

  async getTasaRupturaStock(): Promise<TasaRuptura[]> {
    const data = await fetchAPI('/dashboard/inventario/ruptura-stock');
    return data.data || [];
  },

  async getInventarioActual(): Promise<InventarioActual[]> {
    const data = await fetchAPI('/dashboard/inventario/actual');
    return data.data || [];
  },

  // =============================================
  // DASHBOARD COMPLETO
  // =============================================

  async getDashboardCompleto(fechaInicio: string, fechaFin: string): Promise<DashboardCompleto> {
    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    const data = await fetchAPI(`/dashboard/completo?${params.toString()}`);
    return data.data;
  },

  // =============================================
  // UTILIDADES
  // =============================================

  /** Formatear números para mostrar en dashboard */
  formatNumber(value: number, type: 'currency' | 'percentage' | 'integer' | 'decimal' = 'integer'): string {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('es-VE', {
          style: 'currency',
          currency: 'VES',
          minimumFractionDigits: 2,
        }).format(value);
      
      case 'percentage':
        return new Intl.NumberFormat('es-VE', {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        }).format(value / 100);
      
      case 'decimal':
        return new Intl.NumberFormat('es-VE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      
      default:
        return new Intl.NumberFormat('es-VE').format(value);
    }
  },

  /** Formatear fechas para el dashboard */
  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  },

  /** Calcular variación porcentual */
  calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  },

  /** Obtener color para indicadores según valor */
  getIndicatorColor(value: number, type: 'growth' | 'percentage' | 'stock'): string {
    switch (type) {
      case 'growth':
        if (value > 10) return 'text-green-600';
        if (value > 0) return 'text-yellow-600';
        return 'text-red-600';
      
      case 'percentage':
        if (value > 80) return 'text-green-600';
        if (value > 60) return 'text-yellow-600';
        return 'text-red-600';
      
      case 'stock':
        if (value > 50) return 'text-green-600';
        if (value > 20) return 'text-yellow-600';
        return 'text-red-600';
      
      default:
        return 'text-gray-600';
    }
  },
}; 