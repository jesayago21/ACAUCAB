/** Tipos para la API del sistema de autopago */

export interface Telefono {
  codigo: '0414' | '0412' | '0416' | '0424' | '0426';
  numero: string;
  extension?: string;
}

export interface PersonaContacto {
  nombre: string;
  email: string;
  telefono: Telefono;
}

export interface ClienteBase {
  clave?: number;
  rif: string;
  email?: string;
  telefonos: Telefono[];
  fk_lugar: number; // ID de la Parroquia
  documento?: number;
  correo?: string | null;
  puntos_acumulados?: number;
  tipo: 'natural' | 'juridico';
}

export interface ClienteNatural extends ClienteBase {
  tipo: 'natural';
  ci: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  direccion_habitacion: string;
  nombre?: string;
  apellido?: string;
  direccion?: string;
  lugar?: string;
  lugar_habitacion?: string;
  fk_direccion_habitacion: number;
}

export interface ClienteJuridico extends ClienteBase {
  tipo: 'juridico';
  razon_social: string;
  denominacion_comercial: string;
  url_pagina_web: string;
  capital_disponible: number;
  direccion_fiscal: string;
  direccion_fisica: string;
  fk_direccion_fiscal: number;
  fk_direccion_fisica: number;
}

export interface Producto {
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
  porcentaje_descuento?: number | null;
  fecha_inicio_oferta?: string | null;
  fecha_fin_oferta?: string | null;
  
  // Propiedades derivadas para compatibilidad
  id?: number;
  id_presentacion?: number;
  nombre?: string;
  precio_original?: number;
  precio_oferta?: number | null;
  stock_disponible?: number;
  unique_key?: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Lugar {
  clave: number;
  nombre: string;
  tipo: 'estado' | 'municipio' | 'parroquia';
  fk_lugar?: number;
}

export interface TasaCambio {
  clave: number;
  moneda: 'USD' | 'EUR' | 'VES' | 'PUNTOS';
  monto_equivalencia: number;
  tasa?: number; // Campo derivado para compatibilidad
  fecha_inicio: string;
  fecha_fin?: string | null;
  fecha?: string; // Campo derivado para compatibilidad
}

export interface MetodoPago {
  clave: number;
  tipo: 'Efectivo' | 'Cheque' | 'Tarjeta de credito' | 'Tarjeta de debito' | 'Puntos';
  moneda: 'USD' | 'EUR' | 'VES' | 'PUNTOS';
  monto: number;
  detalles?: {
    numero_tarjeta?: string;
    numero_cheque?: string;
    banco?: string;
    fecha_vencimiento?: string;
  };
}

export interface Venta {
  clave: number;
  fecha: string;
  total_venta: number;
  items: ItemCarrito[];
  metodos_pago: MetodoPago[];
  cliente_id: number;
  puntos_ganados: number;
}

export interface ClienteVerificacion {
  found: boolean;
  cliente?: ClienteNatural | ClienteJuridico;
  message: string;
}

export interface PuntosCliente {
  puntos_disponibles: number;
  valor_en_bolivares: number;
  tasa_cambio: number;
}

// =============================================
// TIPOS PARA GESTIÓN DE COMPRAS
// =============================================

export interface OrdenCompra {
  clave: number;
  fecha: string;
  monto_total: number;
  miembro_rif: number;
  miembro_nombre: string;
  estado_actual: string;
  fecha_estado: string;
  cantidad_detalles: number;
}

export interface DetalleOrdenCompra {
  clave: number;
  fecha: string;
  monto_total: number;
  miembro: {
    rif: number;
    nombre: string;
  };
  estado_actual: string;
  fecha_estado: string;
  detalles: Array<{
    clave: number;
    almacen_clave: number;
    presentacion_nombre: string;
    cerveza_nombre: string;
    cantidad: number;
    precio_unitario: number;
  }>;
}

export interface EstadisticasCompras {
  total_ordenes: number;
  total_monto: number;
  promedio_por_orden: number;
  ordenes_pendientes: number;
  ordenes_procesando: number;
  ordenes_completadas: number;
  top_proveedores: Array<{
    miembro_rif: number;
    miembro_nombre: string;
    total_ordenes: number;
    total_monto: number;
  }>;
}

export interface MiembroProveedor {
  rif: number;
  razon_social: string;
  denominacion_comercial: string;
  total_ordenes: number;
  total_monto: number;
  ultima_orden: string;
}

export interface EstadoCompra {
  clave: number;
  estado: string;
  aplicable_a: string;
  descripcion?: string;
}

export interface ProductoCompra {
  almacen_id: number;
  presentacion_id: number;
  presentacion_nombre: string;
  precio: number;
  cerveza_nombre: string;
  tipo_cerveza: string;
  stock_actual: number;
  miembro_rif: number;
  miembro_nombre: string;
  nivel_stock: 'Crítico' | 'Bajo' | 'Normal' | 'Alto';
}

export interface HistorialEstado {
  fecha: string;
  estado: string;
  comentario?: string;
  tipo_entidad: string;
} 