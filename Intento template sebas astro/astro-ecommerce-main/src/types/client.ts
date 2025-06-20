export type TipoCliente = 'natural' | 'juridico';

export interface ClienteBase {
  clave?: number;
  rif: number;
  puntos_acumulados?: number;
  tipo: TipoCliente;
}

export interface ClienteNatural extends ClienteBase {
  tipo: 'natural';
  ci: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  direccion_habitacion: string;
  fk_direccion_habitacion?: number;
  // Campos calculados del backend
  documento?: number;
  nombre?: string;
  apellido?: string;
  direccion?: string;
  lugar?: string;
}

export interface ClienteJuridico extends ClienteBase {
  tipo: 'juridico';
  razon_social: string;
  denominacion_comercial: string;
  url_pagina_web: string;
  capital_disponible: number;
  direccion_fiscal: string;
  direccion_fisica: string;
  fk_direccion_fiscal?: number;
  fk_direccion_fisica?: number;
  // Campos calculados del backend
  documento?: number;
  lugar_fiscal?: string;
  lugar_fisico?: string;
}

export type Cliente = ClienteNatural | ClienteJuridico;

export interface Lugar {
  clave: number;
  nombre: string;
  tipo: 'estado' | 'municipio' | 'parroquia';
  fk_lugar?: number;
}

export interface IdentificarClienteRequest {
  documento: number;
}

export interface IdentificarClienteResponse {
  message: string;
  found: boolean;
  cliente?: Cliente;
  documento?: number;
}

export interface CrearClienteRequest {
  tipo: TipoCliente;
  [key: string]: any; // Para los campos específicos de cada tipo
}

export interface CrearClienteResponse {
  message: string;
  cliente: Partial<Cliente>;
} 