import { API_CONFIG } from '../config/api';

/** Interfaz para la tasa de cambio */
export interface TasaCambio {
  clave: number;
  moneda: 'USD' | 'EUR' | 'COP' | 'PEN' | 'BOB' | 'PUNTOS';
  monto_equivalencia: number;
  fecha_inicio: string;
  fecha_fin?: string;
}

/** Interfaz para información de puntos del cliente */
export interface PuntosCliente {
  puntos_disponibles: number;
  valor_en_bolivares: number;
  tasa_utilizada: TasaCambio;
}

/**
 * Obtener la tasa de cambio actual de PUNTOS (conversión directa puntos → Bs)
 */
export const obtenerTasaCambioPuntos = async (): Promise<TasaCambio> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/api/shop/tasa-cambio-puntos`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.tasa) {
      throw new Error('No se pudo obtener la tasa de cambio de puntos');
    }

    return data.tasa;

  } catch (error) {
    console.error('Error al obtener tasa de cambio de puntos:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Error al conectar con el servidor de tasas'
    );
  }
};

/**
 * Obtener la tasa de cambio actual del USD (para otras conversiones)
 */
export const obtenerTasaCambioActual = async (): Promise<TasaCambio> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/api/shop/tasa-cambio-actual`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.tasa) {
      throw new Error('No se pudo obtener la tasa de cambio actual');
    }

    return data.tasa;

  } catch (error) {
    console.error('Error al obtener tasa de cambio:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Error al conectar con el servidor de tasas'
    );
  }
};

/**
 * Calcular el valor en bolívares de los puntos del cliente
 * Usa conversión directa: puntos × tasa_equivalencia = Bs
 */
export const calcularValorPuntos = async (puntosDisponibles: number): Promise<PuntosCliente> => {
  try {
    const tasa = await obtenerTasaCambioPuntos();
    
    // Conversión directa: 1 punto = X bolívares según la tasa
    const valorEnBolivares = puntosDisponibles * tasa.monto_equivalencia;

    return {
      puntos_disponibles: puntosDisponibles,
      valor_en_bolivares: Math.round(valorEnBolivares * 100) / 100, // Redondear a 2 decimales
      tasa_utilizada: tasa
    };

  } catch (error) {
    console.error('Error al calcular valor de puntos:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Error al calcular el valor de los puntos'
    );
  }
};

/**
 * Validar si los puntos son suficientes para una compra
 */
export const validarPuntosSuficientes = (
  puntosDisponibles: number, 
  montoCompra: number, 
  tasaPuntos: number
): boolean => {
  const valorEnBolivares = puntosDisponibles * tasaPuntos;
  return valorEnBolivares >= montoCompra;
};

/**
 * Calcular cuántos puntos se necesitan para una compra
 */
export const calcularPuntosNecesarios = (
  montoCompra: number, 
  tasaPuntos: number
): number => {
  const puntosNecesarios = Math.ceil(montoCompra / tasaPuntos);
  return puntosNecesarios;
}; 