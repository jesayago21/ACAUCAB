export type TipoCliente = 'natural' | 'juridico';

export interface ClienteBase {
  clave?: number;
  rif: number;
  puntos_acumulados?: number;
  tipo: TipoCliente;
}

/** Estructura para teléfonos */
export interface Telefono {
  clave?: number;
  codigo: number; // 0414, 0416, etc.
  numero: number;
  extension?: number;
}

/** Estructura para correos electrónicos */
export interface CorreoElectronico {
  clave?: number;
  direccion_email: string;
}

/** Estructura para personas de contacto (solo clientes jurídicos) */
export interface PersonaContacto {
  clave?: number;
  primer_nombre: string;
  primer_apellido: string;
  correo: CorreoElectronico;
  telefono: Telefono;
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
  // Contacto
  correo: CorreoElectronico;
  telefonos: Telefono[];
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
  // Contacto
  correo: CorreoElectronico;
  telefonos: Telefono[];
  personas_contacto: PersonaContacto[];
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

/** Estructura jerárquica de lugares */
export interface LugarJerarquico {
  estados: LugarEstado[];
}

export interface LugarEstado extends Lugar {
  tipo: 'estado';
  municipios: LugarMunicipio[];
}

export interface LugarMunicipio extends Lugar {
  tipo: 'municipio';
  parroquias: LugarParroquia[];
}

export interface LugarParroquia extends Lugar {
  tipo: 'parroquia';
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