/** Componente para registro de nuevos clientes */
import React, { useState, useEffect } from 'react';
import { clienteService, lugarService, validacionService } from '../services/api';
import type { ClienteNatural, ClienteJuridico, Lugar, Telefono, PersonaContacto } from '../types/api';

interface RegistroClienteProps {
  onRegistroExitoso: (cliente: ClienteNatural | ClienteJuridico) => void;
  onVolver: () => void;
  documentoData?: {
    numero: string;
    tipo: 'V' | 'J';
  };
}

type TipoCliente = 'natural' | 'juridico';

export default function RegistroCliente({ onRegistroExitoso, onVolver, documentoData }: RegistroClienteProps) {
  const [paso, setPaso] = useState<'seleccion' | 'formulario'>(documentoData ? 'formulario' : 'seleccion');
  const [tipoCliente, setTipoCliente] = useState<TipoCliente>(documentoData?.tipo === 'V' ? 'natural' : 'juridico');
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Estados para lugares
  const [estados, setEstados] = useState<Lugar[]>([]);
  const [municipios, setMunicipios] = useState<Lugar[]>([]);
  const [parroquias, setParroquias] = useState<Lugar[]>([]);

  // Datos del formulario
  const [formData, setFormData] = useState({
    // Comunes
    rif: documentoData?.tipo === 'J' ? documentoData.numero : '',
    email: '',
    telefonos: [{ codigo: '0414' as const, numero: '', extension: '' }],
    fk_lugar: 0,
    estado_id: 0,
    municipio_id: 0,
    
    // Natural
    ci: documentoData?.tipo === 'V' ? documentoData.numero : '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    direccion_habitacion: '',
    
    // Jurídico
    razon_social: '',
    denominacion_comercial: '',
    url_pagina_web: '',
    capital_disponible: 0,
    direccion_fiscal: '',
    direccion_fisica: '',
    personas_contacto: [{ nombre: '', email: '', telefono: { codigo: '0414' as const, numero: '', extension: '' } }]
  });

  /** Cargar estados al montar el componente */
  useEffect(() => {
    cargarEstados();
  }, []);

  const cargarEstados = async () => {
    try {
      const estadosData = await lugarService.obtenerEstados();
      setEstados(estadosData);
    } catch (error) {
      console.error('Error cargando estados:', error);
    }
  };

  const cargarMunicipios = async (estadoId: number) => {
    try {
      const municipiosData = await lugarService.obtenerMunicipios(estadoId);
      setMunicipios(municipiosData);
      setParroquias([]);
      setFormData(prev => ({ ...prev, municipio_id: 0, fk_lugar: 0 }));
    } catch (error) {
      console.error('Error cargando municipios:', error);
    }
  };

  const cargarParroquias = async (municipioId: number) => {
    try {
      const parroquiasData = await lugarService.obtenerParroquias(municipioId);
      setParroquias(parroquiasData);
      setFormData(prev => ({ ...prev, fk_lugar: 0 }));
    } catch (error) {
      console.error('Error cargando parroquias:', error);
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    // Validaciones comunes
    if (!validacionService.validarRIF(formData.rif)) {
      nuevosErrores.rif = 'RIF inválido';
    }
    if (!validacionService.validarEmail(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }
    if (formData.fk_lugar === 0) {
      nuevosErrores.lugar = 'Debe seleccionar la parroquia';
    }

    // Validar teléfonos
    formData.telefonos.forEach((tel, index) => {
      if (!validacionService.validarTelefono(tel.codigo, tel.numero)) {
        nuevosErrores[`telefono_${index}`] = 'Teléfono inválido';
      }
    });

    if (tipoCliente === 'natural') {
      if (!validacionService.validarCI(formData.ci)) {
        nuevosErrores.ci = 'Cédula inválida';
      }
      if (!formData.primer_nombre.trim()) {
        nuevosErrores.primer_nombre = 'Primer nombre requerido';
      }
      if (!formData.primer_apellido.trim()) {
        nuevosErrores.primer_apellido = 'Primer apellido requerido';
      }
      if (!formData.direccion_habitacion.trim()) {
        nuevosErrores.direccion_habitacion = 'Dirección requerida';
      }
    } else {
      if (!formData.razon_social.trim()) {
        nuevosErrores.razon_social = 'Razón social requerida';
      }
      if (!formData.denominacion_comercial.trim()) {
        nuevosErrores.denominacion_comercial = 'Denominación comercial requerida';
      }
      if (!formData.url_pagina_web.trim() || !formData.url_pagina_web.startsWith('http')) {
        nuevosErrores.url_pagina_web = 'URL inválida';
      }
      if (formData.capital_disponible <= 0) {
        nuevosErrores.capital_disponible = 'Capital debe ser mayor a 0';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setCargando(true);
    try {
      let cliente;
      
      if (tipoCliente === 'natural') {
        const clienteNatural: Omit<ClienteNatural, 'clave' | 'puntos_acumulados'> = {
          tipo: 'natural',
          rif: formData.rif,
          ci: formData.ci,
          primer_nombre: formData.primer_nombre,
          segundo_nombre: formData.segundo_nombre || undefined,
          primer_apellido: formData.primer_apellido,
          segundo_apellido: formData.segundo_apellido || undefined,
          direccion_habitacion: formData.direccion_habitacion,
          email: formData.email,
          telefonos: formData.telefonos,
          fk_lugar: formData.fk_lugar
        };
        cliente = await clienteService.crearClienteNatural(clienteNatural);
      } else {
        const clienteJuridico: Omit<ClienteJuridico, 'clave' | 'puntos_acumulados'> = {
          tipo: 'juridico',
          rif: formData.rif,
          razon_social: formData.razon_social,
          denominacion_comercial: formData.denominacion_comercial,
          url_pagina_web: formData.url_pagina_web,
          capital_disponible: formData.capital_disponible,
          direccion_fiscal: formData.direccion_fiscal,
          direccion_fisica: formData.direccion_fisica,
          email: formData.email,
          telefonos: formData.telefonos,
          fk_lugar: formData.fk_lugar,
          personas_contacto: formData.personas_contacto
        };
        cliente = await clienteService.crearClienteJuridico(clienteJuridico);
      }
      
      onRegistroExitoso(cliente);
    } catch (error) {
      console.error('Error registrando cliente:', error);
      setErrores({ general: 'Error al registrar cliente. Intente nuevamente.' });
    } finally {
      setCargando(false);
    }
  };

  if (paso === 'seleccion') {
    return (
      <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#2C2C2C] mb-4">Tipo de Cliente</h1>
            <p className="text-gray-600">¿Qué tipo de cliente desea registrar?</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setTipoCliente('natural');
                setPaso('formulario');
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-[#A1B5A0] hover:bg-green-50 transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-[#A1B5A0] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#2C2C2C] mb-2">Persona Natural</h3>
                <p className="text-sm text-gray-600">Cliente individual</p>
              </div>
            </button>

            <button
              onClick={() => {
                setTipoCliente('juridico');
                setPaso('formulario');
              }}
              className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-[#A1B5A0] hover:bg-green-50 transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-[#3D4A3A] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#2C2C2C] mb-2">Persona Jurídica</h3>
                <p className="text-sm text-gray-600">Empresa u organización</p>
              </div>
            </button>
          </div>

          <button
            onClick={onVolver}
            className="w-full mt-6 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">
            Registro de {tipoCliente === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}
          </h1>
          <p className="text-gray-600">Complete los siguientes datos</p>
          {documentoData && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Documento prellenado: {documentoData.tipo}-{documentoData.numero}
              </p>
            </div>
          )}
        </div>

        {errores.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{errores.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos comunes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">RIF *</label>
              <input
                type="text"
                value={formData.rif}
                onChange={(e) => setFormData(prev => ({ ...prev, rif: validacionService.formatearDocumento(e.target.value) }))}
                disabled={!!(documentoData?.tipo === 'J')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${
                  documentoData?.tipo === 'J' ? 'bg-gray-100' : ''
                } ${errores.rif ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="J-12345678"
              />
              {errores.rif && <p className="text-red-500 text-sm mt-1">{errores.rif}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${errores.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email}</p>}
            </div>
          </div>

          {/* Campos específicos para persona natural */}
          {tipoCliente === 'natural' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Cédula *</label>
                  <input
                    type="text"
                    value={formData.ci}
                    onChange={(e) => setFormData(prev => ({ ...prev, ci: validacionService.formatearDocumento(e.target.value) }))}
                    disabled={!!(documentoData?.tipo === 'V')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${
                      documentoData?.tipo === 'V' ? 'bg-gray-100' : ''
                    } ${errores.ci ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="V-12345678"
                  />
                  {errores.ci && <p className="text-red-500 text-sm mt-1">{errores.ci}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Primer Nombre *</label>
                  <input
                    type="text"
                    value={formData.primer_nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, primer_nombre: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${errores.primer_nombre ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errores.primer_nombre && <p className="text-red-500 text-sm mt-1">{errores.primer_nombre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Segundo Nombre</label>
                  <input
                    type="text"
                    value={formData.segundo_nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, segundo_nombre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Primer Apellido *</label>
                  <input
                    type="text"
                    value={formData.primer_apellido}
                    onChange={(e) => setFormData(prev => ({ ...prev, primer_apellido: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${errores.primer_apellido ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errores.primer_apellido && <p className="text-red-500 text-sm mt-1">{errores.primer_apellido}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Segundo Apellido</label>
                  <input
                    type="text"
                    value={formData.segundo_apellido}
                    onChange={(e) => setFormData(prev => ({ ...prev, segundo_apellido: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Dirección de Habitación *</label>
                <textarea
                  value={formData.direccion_habitacion}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion_habitacion: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${errores.direccion_habitacion ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                />
                {errores.direccion_habitacion && <p className="text-red-500 text-sm mt-1">{errores.direccion_habitacion}</p>}
              </div>
            </div>
          )}

          {/* Campos específicos para persona jurídica */}
          {tipoCliente === 'juridico' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Razón Social *</label>
                  <input
                    type="text"
                    value={formData.razon_social}
                    onChange={(e) => setFormData(prev => ({ ...prev, razon_social: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${errores.razon_social ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errores.razon_social && <p className="text-red-500 text-sm mt-1">{errores.razon_social}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Denominación Comercial *</label>
                  <input
                    type="text"
                    value={formData.denominacion_comercial}
                    onChange={(e) => setFormData(prev => ({ ...prev, denominacion_comercial: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${errores.denominacion_comercial ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errores.denominacion_comercial && <p className="text-red-500 text-sm mt-1">{errores.denominacion_comercial}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">URL Página Web *</label>
                  <input
                    type="url"
                    value={formData.url_pagina_web}
                    onChange={(e) => setFormData(prev => ({ ...prev, url_pagina_web: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${errores.url_pagina_web ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="https://ejemplo.com"
                  />
                  {errores.url_pagina_web && <p className="text-red-500 text-sm mt-1">{errores.url_pagina_web}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Capital Disponible (Bs.) *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capital_disponible}
                    onChange={(e) => setFormData(prev => ({ ...prev, capital_disponible: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${errores.capital_disponible ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errores.capital_disponible && <p className="text-red-500 text-sm mt-1">{errores.capital_disponible}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Dirección Fiscal *</label>
                <textarea
                  value={formData.direccion_fiscal}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion_fiscal: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Dirección Física *</label>
                <textarea
                  value={formData.direccion_fisica}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion_fisica: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Selección de lugar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2C2C2C]">Ubicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Estado *</label>
                <select
                  value={formData.estado_id}
                  onChange={(e) => {
                    const estadoId = parseInt(e.target.value);
                    setFormData(prev => ({ ...prev, estado_id: estadoId }));
                    if (estadoId > 0) cargarMunicipios(estadoId);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                >
                  <option value={0}>Seleccionar estado</option>
                  {estados.map(estado => (
                    <option key={estado.clave} value={estado.clave}>{estado.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Municipio *</label>
                <select
                  value={formData.municipio_id}
                  onChange={(e) => {
                    const municipioId = parseInt(e.target.value);
                    setFormData(prev => ({ ...prev, municipio_id: municipioId }));
                    if (municipioId > 0) cargarParroquias(municipioId);
                  }}
                  disabled={municipios.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0] disabled:bg-gray-100"
                >
                  <option value={0}>Seleccionar municipio</option>
                  {municipios.map(municipio => (
                    <option key={municipio.clave} value={municipio.clave}>{municipio.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Parroquia *</label>
                <select
                  value={formData.fk_lugar}
                  onChange={(e) => setFormData(prev => ({ ...prev, fk_lugar: parseInt(e.target.value) }))}
                  disabled={parroquias.length === 0}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] disabled:bg-gray-100 ${errores.lugar ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value={0}>Seleccionar parroquia</option>
                  {parroquias.map(parroquia => (
                    <option key={parroquia.clave} value={parroquia.clave}>{parroquia.nombre}</option>
                  ))}
                </select>
                {errores.lugar && <p className="text-red-500 text-sm mt-1">{errores.lugar}</p>}
              </div>
            </div>
          </div>

          {/* Teléfonos */}
          <div>
            <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Teléfonos</h3>
            {formData.telefonos.map((telefono, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                <select
                  value={telefono.codigo}
                  onChange={(e) => {
                    const nuevosTelefonos = [...formData.telefonos];
                    nuevosTelefonos[index].codigo = e.target.value as any;
                    setFormData(prev => ({ ...prev, telefonos: nuevosTelefonos }));
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                >
                  <option value="0414">0414</option>
                  <option value="0412">0412</option>
                  <option value="0416">0416</option>
                  <option value="0424">0424</option>
                  <option value="0426">0426</option>
                </select>
                <input
                  type="text"
                  placeholder="1234567"
                  maxLength={7}
                  value={telefono.numero}
                  onChange={(e) => {
                    const nuevosTelefonos = [...formData.telefonos];
                    nuevosTelefonos[index].numero = e.target.value.replace(/\D/g, '');
                    setFormData(prev => ({ ...prev, telefonos: nuevosTelefonos }));
                  }}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A1B5A0] ${errores[`telefono_${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                />
                <input
                  type="text"
                  placeholder="Ext (opcional)"
                  maxLength={3}
                  value={telefono.extension}
                  onChange={(e) => {
                    const nuevosTelefonos = [...formData.telefonos];
                    nuevosTelefonos[index].extension = e.target.value;
                    setFormData(prev => ({ ...prev, telefonos: nuevosTelefonos }));
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
                />
                {formData.telefonos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const nuevosTelefonos = formData.telefonos.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, telefonos: nuevosTelefonos }));
                    }}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                )}
                {errores[`telefono_${index}`] && (
                  <p className="text-red-500 text-sm col-span-4">{errores[`telefono_${index}`]}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  telefonos: [...prev.telefonos, { codigo: '0414', numero: '', extension: '' }]
                }));
              }}
              className="mt-2 px-4 py-2 bg-[#A1B5A0] text-white rounded-lg hover:bg-[#8FA48E] transition-colors"
            >
              Agregar Teléfono
            </button>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => setPaso('seleccion')}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {cargando ? 'Registrando...' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 