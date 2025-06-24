/** Servicios para comunicación con la API del backend */
import type { 
  ClienteVerificacion, 
  ClienteNatural, 
  ClienteJuridico, 
  Producto, 
  Lugar, 
  TasaCambio, 
  PuntosCliente,
  Venta,
  ItemCarrito,
  MetodoPago
} from '../types/api';

// Configuración de la API usando variables de entorno
const API_BASE_URL = `${import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api`;
const API_TIMEOUT = parseInt(import.meta.env.PUBLIC_API_TIMEOUT || '20000');
const IS_DEVELOPMENT = import.meta.env.PUBLIC_NODE_ENV === 'development';

/** Función utilitaria para realizar peticiones con timeout */
async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

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
      // Si no se puede parsear el JSON, usar mensaje por defecto
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
    
    // Log en desarrollo
    if (IS_DEVELOPMENT) {
      console.error(`API Error [${response.status}]:`, errorMessage);
    }
    
    throw new Error(errorMessage);
  }
  
  try {
    return await response.json();
  } catch {
    throw new Error('Error al procesar la respuesta del servidor');
  }
}

/** Función para debouncing de búsquedas */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
}

/** Servicios para Clientes */
export const clienteService = {
  /** Identificar cliente por documento (CI/RIF) usando el endpoint correcto */
  async verificarCliente(documento: string): Promise<ClienteVerificacion> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/clientes/identificar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documento: parseInt(documento) }),
    });
    return handleResponse<ClienteVerificacion>(response);
  },

  /** Crear un nuevo cliente natural */
  async crearClienteNatural(cliente: Omit<ClienteNatural, 'clave' | 'puntos_acumulados'>): Promise<ClienteNatural> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/clientes/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...cliente, tipo: 'natural' }),
    });
    const data = await handleResponse<{cliente: ClienteNatural}>(response);
    return data.cliente;
  },

  /** Crear un nuevo cliente jurídico */
  async crearClienteJuridico(cliente: Omit<ClienteJuridico, 'clave' | 'puntos_acumulados'>): Promise<ClienteJuridico> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/clientes/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...cliente, tipo: 'juridico' }),
    });
    const data = await handleResponse<{cliente: ClienteJuridico}>(response);
    return data.cliente;
  },

  /** Obtener puntos disponibles de un cliente */
  async obtenerPuntosCliente(clienteId: number): Promise<PuntosCliente> {
    // Este endpoint no existe en las rutas, pero mantengo la estructura para futuro
    const response = await fetchWithTimeout(`${API_BASE_URL}/clientes/${clienteId}/puntos`);
    const data = await handleResponse<{cliente: {clave: number, puntos_acumulados: number}}>(response);
    
    // Convertir a formato PuntosCliente
    return {
      puntos_disponibles: data.cliente.puntos_acumulados,
      valor_en_bolivares: data.cliente.puntos_acumulados * 1, // Tasa 1:1 como fallback
      tasa_cambio: 1
    };
  },

  /** Obtener métodos de pago favoritos del cliente */
  async obtenerMetodosFavoritos(clienteId: number): Promise<any[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/shop/cliente/${clienteId}/metodos-favoritos`);
      const data = await handleResponse<{success: boolean, metodos: any[]}>(response);
      
      if (data.success && data.metodos) {
        // Formatear los datos para el frontend
        return data.metodos.map((metodo: any) => ({
          id: metodo.id,
          banco: metodo.banco,
          numero_tarjeta: metodo.numero_tarjeta ? 
            `**** **** **** ${metodo.numero_tarjeta.slice(-4)}` : 
            '**** **** **** ****',
          fecha_vencimiento: metodo.fecha_vencimiento,
          tipo: metodo.tipo
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error obteniendo métodos favoritos:', error);
      return [];
    }
  }
};

/** Servicios para Productos */
export const productoService = {
  /** Obtener lista de productos con filtros opcionales */
  async obtenerProductos(filtros?: {
    busqueda?: string;
    tipo?: string;
    limite?: number;
    offset?: number;
  }): Promise<Producto[]> {
    const params = new URLSearchParams();
    // Siempre filtrar por tienda física ID 1
    params.append('tienda_id', '1');
    
    if (filtros?.busqueda) params.append('busqueda', filtros.busqueda);
    if (filtros?.tipo) params.append('tipo', filtros.tipo);
    if (filtros?.limite) params.append('limite', filtros.limite.toString());
    if (filtros?.offset) params.append('offset', filtros.offset.toString());

    const response = await fetchWithTimeout(`${API_BASE_URL}/shop/products?${params.toString()}`);
    const data = await handleResponse<{productos: Producto[]}>(response);
    
    const timestamp = Date.now();
    
    // Mapear las propiedades para compatibilidad con componentes existentes
    return data.productos.map((producto, index) => ({
      ...producto,
      id: producto.clave,
      id_presentacion: producto.clave,
      nombre: `${producto.nombre_cerveza} - ${producto.nombre_presentacion}`,
      precio_original: parseFloat(producto.precio.toFixed(2)),
      precio_oferta: producto.tiene_oferta && producto.porcentaje_descuento 
        ? parseFloat((producto.precio * (1 - producto.porcentaje_descuento / 100)).toFixed(2))
        : null,
      stock_disponible: producto.cantidad_disponible,
      // Generar unique_key verdaderamente único
      unique_key: `producto-${producto.clave}-${producto.ean_13}-${timestamp}-${index}`
    }));
  },

  /** Obtener ofertas activas */
  async obtenerOfertas(): Promise<Producto[]> {
    const params = new URLSearchParams();
    // Siempre filtrar por tienda física ID 1
    params.append('tienda_id', '1');
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/shop/offers?${params.toString()}`);
    const data = await handleResponse<{productos: Producto[]}>(response);
    
    const timestamp = Date.now();
    
    // Mapear las propiedades para compatibilidad con componentes existentes
    return data.productos.map((producto, index) => ({
      ...producto,
      id: producto.clave,
      id_presentacion: producto.clave,
      nombre: `${producto.nombre_cerveza} - ${producto.nombre_presentacion}`,
      precio_original: parseFloat(producto.precio.toFixed(2)),
      precio_oferta: producto.tiene_oferta && producto.porcentaje_descuento 
        ? parseFloat((producto.precio * (1 - producto.porcentaje_descuento / 100)).toFixed(2))
        : null,
      stock_disponible: producto.cantidad_disponible,
      // Generar unique_key verdaderamente único para ofertas
      unique_key: `oferta-${producto.clave}-${producto.ean_13}-${timestamp}-${index}`
    }));
  },

  /** Buscar producto específico por EAN */
  async buscarProductoPorEAN(ean: string): Promise<Producto | null> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/shop/products/ean/${ean}?tienda_id=1`);
      const data = await handleResponse<{success: boolean, producto: any}>(response);
      
      if (!data.success || !data.producto) {
        return null;
      }

      const producto = data.producto;
      const timestamp = Date.now();
      
      // Mapear las propiedades para compatibilidad con componentes existentes
      return {
        ...producto,
        id: producto.clave,
        id_presentacion: producto.clave,
        nombre: `${producto.nombre_cerveza} - ${producto.nombre_presentacion}`,
        precio_original: parseFloat(producto.precio.toFixed(2)),
        precio_oferta: producto.tiene_oferta && producto.porcentaje_descuento 
          ? parseFloat((producto.precio * (1 - producto.porcentaje_descuento / 100)).toFixed(2))
          : null,
        stock_disponible: producto.cantidad_disponible,
        unique_key: `ean-${producto.clave}-${producto.ean_13}-${timestamp}`
      };
    } catch (error) {
      console.error('Error buscando producto por EAN:', error);
      return null;
    }
  }
};

/** Servicios para Lugares */
export const lugarService = {
  /** Obtener lista de estados */
  async obtenerEstados(): Promise<Lugar[]> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/clientes/lugares`);
    const data = await handleResponse<{lugares: {estados: Lugar[]}}>(response);
    return data.lugares.estados;
  },

  /** Obtener municipios de un estado */
  async obtenerMunicipios(estadoId: number): Promise<Lugar[]> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/clientes/municipios/${estadoId}`);
    return handleResponse<Lugar[]>(response);
  },

  /** Obtener parroquias de un municipio */
  async obtenerParroquias(municipioId: number): Promise<Lugar[]> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/clientes/parroquias/${municipioId}`);
    return handleResponse<Lugar[]>(response);
  }
};

/** Servicios para Tasas de Cambio */
export const tasaCambioService = {
  /** Obtener tasa de cambio de puntos */
  async obtenerTasaCambioPuntos(): Promise<TasaCambio> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/shop/tasa-cambio-actual`);
    const data = await handleResponse<{tasa: any}>(response);
    // Mapear campos para compatibilidad
    return {
      ...data.tasa,
      tasa: data.tasa.monto_equivalencia,
      fecha: data.tasa.fecha_inicio
    };
  },

  /** Obtener tasa de cambio por moneda específica */
  async obtenerTasaCambio(moneda: 'USD' | 'EUR' | 'VES' | 'PUNTOS'): Promise<TasaCambio> {
    if (moneda === 'PUNTOS') {
      return this.obtenerTasaCambioPuntos();
    }
    
    // Para otras monedas, usar el endpoint consolidado
    const todasLasTasas = await this.obtenerTodasLasTasas();
    const tasa = todasLasTasas[moneda];
    
    if (!tasa) {
      throw new Error(`Tasa de cambio no disponible para ${moneda}`);
    }
    
    return tasa;
  },

  /** Obtener todas las tasas de cambio actuales */
  async obtenerTodasLasTasas(): Promise<{ [moneda: string]: TasaCambio }> {
    try {
      console.log('🔍 Intentando obtener todas las tasas desde:', `${API_BASE_URL}/shop/tasas-cambio`);
      const response = await fetchWithTimeout(`${API_BASE_URL}/shop/tasas-cambio`);
      console.log('📡 Respuesta recibida:', response.status, response.ok);
      
      const data = await handleResponse<{success: boolean, tasas: any, tasas_array: any[]}>(response);
      console.log('📊 Datos parseados:', data);
      
      if (data.success && data.tasas) {
        // Mapear cada tasa para compatibilidad
        const tasasFormateadas: { [moneda: string]: TasaCambio } = {};
        
        Object.keys(data.tasas).forEach(moneda => {
          const tasa = data.tasas[moneda];
          tasasFormateadas[moneda] = {
            ...tasa,
            tasa: tasa.monto_equivalencia,
            fecha: tasa.fecha_inicio
          };
        });
        
        console.log('✅ Tasas formateadas exitosamente:', tasasFormateadas);
        return tasasFormateadas;
      }
      
      console.log('⚠️ Data.success es false o no hay tasas, usando fallback...');
      // Fallback básico
      const puntos = await this.obtenerTasaCambioPuntos();
      
      return {
        'PUNTOS': puntos,
        'VES': { clave: 1, moneda: 'VES', monto_equivalencia: 1, tasa: 1, fecha: new Date().toISOString(), fecha_inicio: new Date().toISOString() }
      };
    } catch (error) {
      console.error('❌ Error obteniendo todas las tasas:', error);
      
      // Fallback a método anterior
      try {
        console.log('🔄 Intentando fallback con método de puntos...');
        const puntos = await this.obtenerTasaCambioPuntos();
        
        console.log('✅ Fallback exitoso');
        return {
          'PUNTOS': puntos,
          'VES': { clave: 1, moneda: 'VES', monto_equivalencia: 1, tasa: 1, fecha: new Date().toISOString(), fecha_inicio: new Date().toISOString() }
        };
      } catch (fallbackError) {
        console.error('❌ Error en fallback de tasas:', fallbackError);
        return {};
      }
    }
  }
};

/** Servicios para Ventas */
export const ventaService = {
  /** Crear una nueva venta en tienda física */
  async crearVentaFisica(venta: {
    cliente_id: number;
    tienda_id: number;
    items: Array<{
      producto_id: number;
      cantidad: number;
      precio_unitario: number;
    }>;
    metodos_pago: Array<{
      tipo: string;
      monto: number;
      detalles?: any;
    }>;
    total_venta: number;
  }): Promise<{ success: boolean; venta_id: number; message: string }> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/shop/venta-fisica`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venta),
    });
    return handleResponse<{ success: boolean; venta_id: number; message: string }>(response);
  },

  /** Crear una nueva venta online (método legacy) */
  async crearVenta(venta: Omit<Venta, 'clave' | 'fecha'>): Promise<Venta> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/shop/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venta),
    });
    return handleResponse<Venta>(response);
  }
};

/** Servicio de conectividad */
export const conectividadService = {
  /** Verificar si el backend está disponible */
  async verificarConectividad(): Promise<{ status: string; message: string; timestamp: string }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`);
      return handleResponse<{ status: string; message: string; timestamp: string }>(response);
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.error('Error de conectividad con el backend:', error);
      }
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'No se pudo conectar con el servidor'
      );
    }
  },

  /** Obtener información del servidor */
  async obtenerInfoServidor(): Promise<{ version: string; environment: string; uptime: number }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/info`);
      return handleResponse<{ version: string; environment: string; uptime: number }>(response);
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.error('Error obteniendo información del servidor:', error);
      }
      throw new Error('No se pudo obtener información del servidor');
    }
  }
};

/** Utilitarias para validación */
export const validacionService = {
  /** Validar formato de RIF venezolano */
  validarRIF(rif: string): boolean {
    const rifRegex = /^[VEJGvejg]-?\d{8,9}$/;
    return rifRegex.test(rif);
  },

  /** Validar formato de cédula venezolana */
  validarCI(ci: string): boolean {
    const ciRegex = /^[VEve]-?\d{7,8}$/;
    return ciRegex.test(ci);
  },

  /** Validar formato de email */
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /** Formatear documento (añadir guión) */
  formatearDocumento(documento: string): string {
    // Remover caracteres no alfanuméricos excepto guiones
    let limpio = documento.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
    
    // Si no tiene guión, añadirlo después de la primera letra
    if (!limpio.includes('-') && limpio.length > 1) {
      limpio = limpio.charAt(0) + '-' + limpio.slice(1);
    }
    
    return limpio;
  },

  /** Validar número de teléfono venezolano */
  validarTelefono(codigo: string, numero: string): boolean {
    const codigosValidos = ['0414', '0412', '0416', '0424', '0426'];
    const numeroRegex = /^\d{7}$/;
    
    return codigosValidos.includes(codigo) && numeroRegex.test(numero);
  }
}; 