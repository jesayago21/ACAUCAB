/**
 * Servicio para operaciones específicas del ecommerce
 */

import { authStorage } from './authService';

const API_BASE_URL = 'http://localhost:5000/api/ecommerce';

/**
 * Obtener productos del almacén central para ecommerce
 */
export const obtenerProductosEcommerce = async (params?: {
  busqueda?: string;
  tipo_cerveza?: string;
  solo_con_oferta?: boolean;
  limite?: number;
  offset?: number;
}) => {
  try {
    const url = new URL(`${API_BASE_URL}/productos`);
    
    if (params?.busqueda) url.searchParams.append('busqueda', params.busqueda);
    if (params?.tipo_cerveza) url.searchParams.append('tipo_cerveza', params.tipo_cerveza);
    if (params?.solo_con_oferta) url.searchParams.append('solo_con_oferta', 'true');
    if (params?.limite) url.searchParams.append('limite', params.limite.toString());
    if (params?.offset) url.searchParams.append('offset', params.offset.toString());

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error obteniendo productos');
    }

    return data;
  } catch (error) {
    console.error('Error en obtenerProductosEcommerce:', error);
    throw error;
  }
};

/**
 * Obtener métodos de pago válidos para ecommerce (solo tarjetas de crédito y puntos)
 */
export const obtenerMetodosPagoEcommerce = async (clienteId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ecommerce/metodos-pago/${clienteId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error obteniendo métodos de pago');
    }

    return data.metodos_pago || [];
  } catch (error) {
    console.error('Error en obtenerMetodosPagoEcommerce:', error);
    throw error;
  }
};

/**
 * Validar stock disponible en almacén central
 */
export const validarStockEcommerce = async (items: any[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/validar-stock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error validando stock');
    }

    return data;
  } catch (error) {
    console.error('Error en validarStockEcommerce:', error);
    throw error;
  }
};

/**
 * Calcular costo de envío
 */
export const calcularCostoEnvio = async (lugarId: number, montoTotal: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calcular-envio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lugar_id: lugarId,
        monto_total: montoTotal
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error calculando costo de envío');
    }

    return data.costo_envio;
  } catch (error) {
    console.error('Error en calcularCostoEnvio:', error);
    throw error;
  }
};

/**
 * Crear venta online
 */
export const crearVentaOnline = async (ventaData: {
  usuario_id: number;
  items: any[];
  metodos_pago: any[];
  direccion_envio: string;
  lugar_id?: number;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ventas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ventaData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error creando venta online');
    }

    return data;
  } catch (error) {
    console.error('Error en crearVentaOnline:', error);
    throw error;
  }
};

/**
 * Obtener ofertas activas
 */
export const obtenerOfertasActivas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ofertas`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error obteniendo ofertas');
    }

    return data.ofertas || [];
  } catch (error) {
    console.error('Error en obtenerOfertasActivas:', error);
    throw error;
  }
};

/**
 * Obtener tracking de un pedido
 */
export const obtenerTrackingPedido = async (ventaId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracking/${ventaId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error obteniendo tracking');
    }

    return data.tracking || [];
  } catch (error) {
    console.error('Error en obtenerTrackingPedido:', error);
    throw error;
  }
};

/**
 * Obtener venta online completa
 */
export const obtenerVentaOnlineCompleta = async (ventaId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ventas/${ventaId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error obteniendo venta');
    }

    return data.venta;
  } catch (error) {
    console.error('Error en obtenerVentaOnlineCompleta:', error);
    throw error;
  }
};

export const ecommerceService = {
  obtenerProductosEcommerce,
  obtenerMetodosPagoEcommerce,
  validarStockEcommerce,
  calcularCostoEnvio,
  crearVentaOnline,
  obtenerOfertasActivas,
  obtenerTrackingPedido,
  obtenerVentaOnlineCompleta
}; 