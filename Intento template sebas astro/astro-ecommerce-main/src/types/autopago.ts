/** Tipos para el sistema de autopago en tienda física */

export interface Cliente {
  cedula_rif: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fechaRegistro?: Date;
}

/** Estados del flujo de autopago */
export type EstadoAutopago = 'inicio' | 'identificacion' | 'registro' | 'compra' | 'carrito' | 'pago' | 'confirmacion';

/** Métodos de pago disponibles */
export type MetodoPago = 'efectivo' | 'tarjeta' | 'cheque' | 'puntos';

/** Datos de un pago parcial */
export interface PagoParcial {
  metodo: MetodoPago;
  monto: number;
  referencia?: string; /** Para tarjetas, cheques, etc. */
}

/** Datos completos del pago */
export interface DatosPago {
  total: number;
  pagos: PagoParcial[];
  cambio?: number;
  puntosSumados?: number;
}

/** Datos de la transacción de autopago */
export interface TransaccionAutopago {
  id: string;
  cliente: Cliente;
  fecha: Date;
  total: number;
  pago: DatosPago;
  estado: EstadoAutopago;
}

/** Propiedades para el componente de identificación */
export interface IdentificacionProps {
  onClienteIdentificado: (cliente: Cliente) => void;
  onClienteNoEncontrado: (cedula: string) => void;
  onError: (mensaje: string) => void;
}

/** Propiedades para el componente de registro */
export interface RegistroClienteProps {
  cedulaRif: string;
  onClienteRegistrado: (cliente: Cliente) => void;
  onVolver: () => void;
  onError: (mensaje: string) => void;
}

/** Propiedades para el componente de pago */
export interface PagoProps {
  total: number;
  onPagoCompletado: (datosPago: DatosPago) => void;
  onVolver: () => void;
}

/** Propiedades para el flujo de autopago */
export interface AutopagoFlowProps {
  onEstadoCambiado: (estado: EstadoAutopago) => void;
  cliente?: Cliente;
} 