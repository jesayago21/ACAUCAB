// Configuración de la API
export const API_CONFIG = {
  baseURL: import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000',
  timeout: parseInt(import.meta.env.PUBLIC_API_TIMEOUT || '10000'),
  endpoints: {
    // Clientes
    identificarCliente: '/api/clientes/identificar',
    crearCliente: '/api/clientes/crear',
    obtenerLugares: '/api/clientes/lugares',
    // Shop
    productos: '/api/shop/products',
    ofertas: '/api/shop/offers',
    tiendas: '/api/shop/tiendas',
    metodosPago: '/api/shop/payment-methods',
    crearOrden: '/api/shop/order'
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