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

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000';

/**
 * Validar formato de documento venezolano
 */
export const validarDocumentoVenezolano = (documento: string): boolean => {
  // Verificar que empiece con V, E, J, G seguido de números
  const regex = /^[VEJG]-?\d{6,9}$/i;
  return regex.test(documento);
};

/**
 * Extraer solo los números del documento
 */
export const extraerNumeroDocumento = (documento: string): number => {
  const numeroStr = documento.replace(/[VEJG-]/gi, '');
  return parseInt(numeroStr, 10);
};

/**
 * Servicio para identificar cliente por documento
 */
export const identificarCliente = async (documento: string): Promise<IdentificarClienteResponse> => {
  try {
    if (!validarDocumentoVenezolano(documento)) {
      throw new Error('Formato de documento inválido. Use V-12345678, E-12345678, J-123456789 o G-123456789');
    }

    const numeroDocumento = extraerNumeroDocumento(documento);
    
    const requestData: IdentificarClienteRequest = {
      documento: numeroDocumento
    };

    const response = await fetch(`${API_BASE_URL}/api/clientes/identificar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        const errorData = await response.json();
        return {
          message: errorData.message,
          found: false,
          documento: numeroDocumento
        };
      }
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data: IdentificarClienteResponse = await response.json();
    return data;

  } catch (error) {
    console.error('Error al identificar cliente:', error);
    throw error;
  }
};

/**
 * Servicio para crear nuevo cliente
 */
export const crearCliente = async (datosCliente: CrearClienteRequest): Promise<CrearClienteResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clientes/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosCliente),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const data: CrearClienteResponse = await response.json();
    return data;

  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw error;
  }
};

/**
 * Servicio para obtener estructura jerárquica de lugares
 */
export const obtenerLugaresJerarquicos = async (): Promise<LugarJerarquico> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clientes/lugares`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    return data.lugares;

  } catch (error) {
    console.error('Error al obtener lugares:', error);
    throw error;
  }
};

/**
 * Servicio para obtener lugares planos (compatibilidad)
 */
export const obtenerLugaresPlanos = async (): Promise<Lugar[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clientes/lugares/planos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_BASE_URL}/api/clientes/municipios/${estadoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data: Lugar[] = await response.json();
    return data;

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
    const response = await fetch(`${API_BASE_URL}/api/clientes/parroquias/${municipioId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data: Lugar[] = await response.json();
    return data;

  } catch (error) {
    console.error('Error al obtener parroquias:', error);
    throw error;
  }
};

/**
 * Validar códigos de teléfono venezolanos
 */
export const validarCodigoTelefono = (codigo: number): boolean => {
  const codigosValidos = [414, 416, 412, 424, 426];
  return codigosValidos.includes(codigo);
};

/**
 * Validar número de teléfono (7 dígitos)
 */
export const validarNumeroTelefono = (numero: number): boolean => {
  return numero >= 1000000 && numero <= 9999999;
};

/**
 * Validar formato de email
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.com$/;
  return regex.test(email);
};

class ClientService {
  
  /**
   * Obtener lista de lugares para direcciones
   */
  async obtenerLugares(): Promise<Lugar[]> {
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
  }

  /**
   * Validar formato de cédula venezolana
   */
  validarCedula(cedula: string): boolean {
    const cedulaRegex = /^[VEve]-?\d{6,8}$/;
    return cedulaRegex.test(cedula);
  }

  /**
   * Validar formato de RIF venezolano
   */
  validarRIF(rif: string): boolean {
    const rifRegex = /^[JGjg]-?\d{8,9}$/;
    return rifRegex.test(rif);
  }

  /**
   * Determinar tipo de cliente basado en el documento
   */
  determinarTipoCliente(documento: string): 'natural' | 'juridico' | null {
    if (this.validarCedula(documento)) {
      return 'natural';
    }
    if (this.validarRIF(documento)) {
      return 'juridico';
    }
    return null;
  }
}

// Exportar instancia singleton
export const clientService = new ClientService(); 