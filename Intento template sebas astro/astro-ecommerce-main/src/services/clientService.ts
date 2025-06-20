import { API_CONFIG, DEFAULT_HEADERS, buildApiUrl } from '../config/api';
import type { 
  IdentificarClienteRequest, 
  IdentificarClienteResponse,
  CrearClienteRequest,
  CrearClienteResponse,
  Lugar 
} from '../types/client';

class ClientService {
  
  /**
   * Identificar cliente por documento (cédula o RIF)
   */
  async identificarCliente(documento: number): Promise<IdentificarClienteResponse> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.endpoints.identificarCliente), {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ documento } as IdentificarClienteRequest)
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Cliente no encontrado - esto es esperado
          return await response.json();
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al identificar cliente:', error);
      throw new Error('Error de conexión con el servidor');
    }
  }

  /**
   * Crear nuevo cliente
   */
  async crearCliente(datosCliente: CrearClienteRequest): Promise<CrearClienteResponse> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.endpoints.crearCliente), {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(datosCliente)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear cliente:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
    }
  }

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
   * Extraer número de documento (sin prefijo)
   */
  extraerNumeroDocumento(documento: string): number {
    const numeroLimpio = documento.replace(/^[VEJGvejg]-?/, '');
    return parseInt(numeroLimpio, 10);
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