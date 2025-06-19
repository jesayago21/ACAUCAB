import { API_CONFIG, DEFAULT_HEADERS, buildApiUrl } from '../config/api';
import type { 
  IdentificarClienteRequest, 
  IdentificarClienteResponse,
  CrearClienteRequest,
  CrearClienteResponse,
  Lugar,
  Cliente,
  LugarJerarquico
} from '../types/client';

/**
 * Validar formato de documento venezolano (cédula o RIF).
 */
export const validarDocumentoVenezolano = (documento: string): boolean => {
  const regex = /^[VEJG]-?\d{7,9}$/i;
  return regex.test(documento);
};

/**
 * Extraer solo los números del documento para enviar al backend.
 */
export const extraerNumeroDocumento = (documento: string): number => {
  const numeroStr = documento.replace(/[^0-9]/g, '');
  return parseInt(numeroStr, 10);
};

/**
 * Servicio para identificar un cliente por su documento (cédula o RIF).
 */
export const identificarCliente = async (documento: string): Promise<IdentificarClienteResponse> => {
  if (!validarDocumentoVenezolano(documento)) {
    throw new Error('Formato de documento inválido.');
  }
  
  const requestData: IdentificarClienteRequest = { 
    documento: extraerNumeroDocumento(documento) 
  };

  const response = await fetch(buildApiUrl(API_CONFIG.endpoints.identificarCliente), {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { message: 'Cliente no encontrado', found: false, documento: requestData.documento };
    }
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
    throw new Error(errorData.message || `Error del servidor: ${response.status}`);
  }
  return response.json();
};

/**
 * Servicio para crear un nuevo cliente.
 */
export const crearCliente = async (datosCliente: CrearClienteRequest): Promise<CrearClienteResponse> => {
  const response = await fetch(buildApiUrl(API_CONFIG.endpoints.crearCliente), {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(datosCliente),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'No se pudo registrar el cliente.' }));
    throw new Error(errorData.message || `Error del servidor: ${response.status}`);
  }
  return response.json();
};

/**
 * Servicio para obtener la estructura jerárquica completa de lugares (estados, municipios, parroquias).
 */
export const obtenerLugaresJerarquicos = async (): Promise<LugarJerarquico> => {
  const response = await fetch(buildApiUrl(API_CONFIG.endpoints.obtenerLugares), {
    method: 'GET',
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Error del servidor al obtener lugares: ${response.status}`);
  }
  const data = await response.json();
  return data.lugares; // Asegurarse que el backend envuelva la respuesta en { lugares: [...] }
};

/**
 * Servicio para obtener lugares planos (compatibilidad)
 */
export const obtenerLugaresPlanos = async (): Promise<Lugar[]> => {
  try {
    const response = await fetch(`${API_CONFIG.endpoints.obtenerLugares}/planos`, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data: Lugar[] = await response.json();
    return data;

  } catch (error) {
    console.error('Error al obtener lugares planos:', error);
    throw error;
  }
};

/**
 * Servicio para obtener municipios por estado
 */
export const obtenerMunicipiosPorEstado = async (estadoId: number): Promise<Lugar[]> => {
  try {
    const endpoint = API_CONFIG.endpoints.obtenerMunicipios(estadoId);
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });
    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    throw error;
  }
};

/**
 * Servicio para obtener parroquias por municipio
 */
export const obtenerParroquiasPorMunicipio = async (municipioId: number): Promise<Lugar[]> => {
  try {
    const endpoint = API_CONFIG.endpoints.obtenerParroquias(municipioId);
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });
    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener parroquias:', error);
    throw error;
  }
};

/**
 * Validar códigos de área de teléfonos móviles en Venezuela.
 */
export const validarCodigoTelefono = (codigo: number): boolean => {
  const codigosValidos = [414, 416, 412, 424, 426, 212]; // Incluyendo CANTV y otros fijos si aplica
  return codigosValidos.includes(codigo);
};

/**
 * Validar que el número de teléfono tenga 7 dígitos.
 */
export const validarNumeroTelefono = (numero: number): boolean => {
  const numStr = numero.toString();
  return /^\d{7}$/.test(numStr);
};

/**
 * Validar el formato de una dirección de correo electrónico.
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validar formato de cédula venezolana
 */
export const validarCedula = (cedula: string): boolean => {
  const cedulaRegex = /^[VEve]-?\d{6,8}$/;
  return cedulaRegex.test(cedula);
};

/**
 * Validar formato de RIF venezolano
 */
export const validarRIF = (rif: string): boolean => {
  const rifRegex = /^[JGjg]-?\d{8,9}$/;
  return rifRegex.test(rif);
};

/**
 * Determinar tipo de cliente basado en el documento
 */
export const determinarTipoCliente = (documento: string): 'natural' | 'juridico' | null => {
  if (validarCedula(documento)) {
    return 'natural';
  }
  if (validarRIF(documento)) {
    return 'juridico';
  }
  return null;
};

// Exportar instancia singleton
export const clientService = {
  obtenerLugares: async (): Promise<Lugar[]> => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.endpoints.obtenerLugares), {
        method: 'GET',
        headers: DEFAULT_HEADERS
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener lugares:', error);
      throw new Error('Error de conexión con el servidor');
    }
  },
  validarCedula,
  validarRIF,
  determinarTipoCliente
}; 