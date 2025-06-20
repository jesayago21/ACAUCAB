import { API_CONFIG } from '../config/api';

/** Interfaz para productos del backend */
export interface ProductoTienda {
  clave: number;
  ean_13: string;
  nombre_presentacion: string;
  cantidad_unidades: number;
  precio: number;
  nombre_cerveza: string;
  grado_alcohol: number;
  tipo_cerveza: string;
  miembro: string;
  cantidad_disponible: number;
  lugar_tienda: string;
  tienda_fisica: string;
  tiene_oferta: boolean;
  porcentaje_descuento?: number;
  fecha_inicio_oferta?: string;
  fecha_fin_oferta?: string;
}

/** Interfaz para el producto adaptado al frontend */
export interface ProductoAdaptado {
  id: string;
  thumb_src: string;
  thumb_alt: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  stock: number;
  tiene_oferta: boolean;
  porcentaje_descuento?: number;
  ean_13: string;
  cantidad_unidades: number;
  grado_alcohol: number;
  tipo_cerveza: string;
  miembro: string;
}

/**
 * Obtener imagen del producto basada en su ID y cantidad de unidades
 */
const obtenerImagenProducto = (id: number, cantidadUnidades: number): string => {
  // Primero intentar con la imagen específica del producto
  const imagenEspecifica = `/images/products/beer-${id}.jpg`;
  
  // Si no existe, usar imagen por defecto según cantidad
  if (cantidadUnidades === 6) {
    return `/images/products/beer-sixpack-default.jpeg`;
  } else {
    return `/images/products/beer-unit-default.jpg`;
  }
  
  // TODO: En el futuro podrías verificar si la imagen existe antes de devolver la por defecto
  return imagenEspecifica;
};

/**
 * Calcular precio con descuento si aplica
 */
const calcularPrecioConDescuento = (precio: number, porcentajeDescuento?: number): number => {
  if (!porcentajeDescuento) return precio;
  return precio * (1 - porcentajeDescuento / 100);
};

/**
 * Adaptar producto del backend al formato del frontend
 */
const adaptarProducto = (producto: ProductoTienda): ProductoAdaptado => {
  const precioOriginal = producto.precio;
  const precioFinal = producto.tiene_oferta 
    ? calcularPrecioConDescuento(producto.precio, producto.porcentaje_descuento)
    : producto.precio;

  return {
    id: `presentacion-${producto.clave}`,
    thumb_src: obtenerImagenProducto(producto.clave, producto.cantidad_unidades),
    thumb_alt: `${producto.nombre_cerveza} - ${producto.nombre_presentacion}`,
    title: `${producto.nombre_cerveza} - ${producto.nombre_presentacion}`,
    description: `${producto.tipo_cerveza} • ${producto.grado_alcohol}% Alc. • ${producto.miembro} • ${producto.cantidad_unidades === 1 ? 'Unidad' : `Pack de ${producto.cantidad_unidades}`}`,
    price: precioFinal,
    original_price: producto.tiene_oferta ? precioOriginal : undefined,
    stock: producto.cantidad_disponible,
    tiene_oferta: producto.tiene_oferta,
    porcentaje_descuento: producto.porcentaje_descuento,
    ean_13: producto.ean_13,
    cantidad_unidades: producto.cantidad_unidades,
    grado_alcohol: producto.grado_alcohol,
    tipo_cerveza: producto.tipo_cerveza,
    miembro: producto.miembro
  };
};

/**
 * Obtener productos disponibles de la tienda
 */
export const obtenerProductosDisponibles = async (tiendaId?: number): Promise<ProductoAdaptado[]> => {
  try {
    const url = new URL(`${API_CONFIG.baseURL}/api/shop/products`);
    if (tiendaId) {
      url.searchParams.append('tienda_id', tiendaId.toString());
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !Array.isArray(data.productos)) {
      throw new Error('Formato de respuesta inválido del servidor');
    }

    // Adaptar productos al formato del frontend
    return data.productos.map(adaptarProducto);

  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Error al conectar con el servidor de productos'
    );
  }
};

/**
 * Filtrar productos por criterios
 */
export const filtrarProductos = (
  productos: ProductoAdaptado[], 
  filtros: {
    busqueda?: string;
    tipoTerveza?: string;
    soloOfertas?: boolean;
    cantidadUnidades?: number;
  }
): ProductoAdaptado[] => {
  return productos.filter(producto => {
    // Filtro por búsqueda
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      const coincide = 
        producto.title.toLowerCase().includes(busqueda) ||
        producto.description.toLowerCase().includes(busqueda) ||
        producto.tipo_cerveza.toLowerCase().includes(busqueda) ||
        producto.miembro.toLowerCase().includes(busqueda);
      if (!coincide) return false;
    }

    // Filtro por tipo de cerveza
    if (filtros.tipoTerveza && producto.tipo_cerveza !== filtros.tipoTerveza) {
      return false;
    }

    // Filtro solo ofertas
    if (filtros.soloOfertas && !producto.tiene_oferta) {
      return false;
    }

    // Filtro por cantidad de unidades
    if (filtros.cantidadUnidades && producto.cantidad_unidades !== filtros.cantidadUnidades) {
      return false;
    }

    return true;
  });
}; 