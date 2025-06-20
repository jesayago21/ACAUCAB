/**
 * @file Contiene la configuración de la API para el frontend.
 * @description Define la URL base, timeouts y todos los endpoints del backend.
 */

// Configuración de la API
export const API_CONFIG = {
  baseURL: import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.PUBLIC_API_TIMEOUT || '10000'),
  endpoints: {
    // Clientes
    identificarCliente: '/clientes/identificar',
    crearCliente: '/clients',
    obtenerLugares: '/clientes/lugares',
    obtenerLugaresPlanos: '/clientes/lugares/planos',
    obtenerMunicipios: (estadoId: number) => `/clientes/municipios/${estadoId}`,
    obtenerParroquias: (municipioId: number) => `/clientes/parroquias/${municipioId}`,
    // Puntos
    calcularValorPuntos: '/points/calculate',
    // Productos (Shop)
    productos: '/shop/products',
    ofertas: '/shop/offers',
    tiendas: '/shop/tiendas',
    metodosPago: '/shop/payment-methods',
    crearOrden: '/shop/order'
  }
};

// Headers por defecto para las peticiones
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Función para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
}; 