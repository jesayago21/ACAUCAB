import React, { useState, useEffect } from 'react';
import { 
  crearCliente, 
  obtenerMunicipiosPorEstado, 
  obtenerParroquiasPorMunicipio,
  obtenerLugaresJerarquicos,
  validarCodigoTelefono,
  validarNumeroTelefono,
  validarEmail,
  extraerNumeroDocumento
} from '../../services/clientService';
import type { 
  Cliente, 
  TipoCliente, 
  Lugar, 
  CrearClienteRequest,
  LugarEstado,
  LugarMunicipio,
  LugarParroquia,
  Telefono,
  PersonaContacto 
} from '../../types/client';

interface RegistroClienteProps {
  cedulaRif: string;
  onClienteRegistrado: (cliente: Cliente) => void;
  onVolver: () => void;
  onError: (error: string) => void;
}

/** Componente para registro de nuevos clientes con funcionalidad completa */
const RegistroCliente: React.FC<RegistroClienteProps> = ({ 
  cedulaRif, 
  onClienteRegistrado, 
  onVolver,
  onError 
}) => {
  const [cargando, setCargando] = useState(false);
  const [tipoCliente, setTipoCliente] = useState<TipoCliente>('natural');
  
  // Estados para lugares
  const [estados, setEstados] = useState<LugarEstado[]>([]);
  const [municipiosHabitacion, setMunicipiosHabitacion] = useState<LugarMunicipio[]>([]);
  const [parroquiasHabitacion, setParroquiasHabitacion] = useState<LugarParroquia[]>([]);
  const [municipiosFiscal, setMunicipiosFiscal] = useState<LugarMunicipio[]>([]);
  const [parroquiasFiscal, setParroquiasFiscal] = useState<LugarParroquia[]>([]);
  const [municipiosFisico, setMunicipiosFisico] = useState<LugarMunicipio[]>([]);
  const [parroquiasFisico, setParroquiasFisico] = useState<LugarParroquia[]>([]);
  
  // Estados para ubicación
  const [estadoHabitacion, setEstadoHabitacion] = useState<number | null>(null);
  const [municipioHabitacion, setMunicipioHabitacion] = useState<number | null>(null);
  const [parroquiaHabitacion, setParroquiaHabitacion] = useState<number | null>(null);
  const [estadoFiscal, setEstadoFiscal] = useState<number | null>(null);
  const [municipioFiscal, setMunicipioFiscal] = useState<number | null>(null);
  const [parroquiaFiscal, setParroquiaFiscal] = useState<number | null>(null);
  const [estadoFisico, setEstadoFisico] = useState<number | null>(null);
  const [municipioFisico, setMunicipioFisico] = useState<number | null>(null);
  const [parroquiaFisico, setParroquiaFisico] = useState<number | null>(null);

  // Estados para datos generales
  const [correo, setCorreo] = useState('');
  const [telefonos, setTelefonos] = useState<Telefono[]>([{ codigo: 414, numero: 0 }]);
  
  // Estados para cliente natural
  const [datosNatural, setDatosNatural] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    direccion_habitacion: ''
  });

  // Estados para cliente jurídico
  const [datosJuridico, setDatosJuridico] = useState({
    razon_social: '',
    denominacion_comercial: '',
    url_pagina_web: 'https://',
    capital_disponible: 0,
    direccion_fiscal: '',
    direccion_fisica: ''
  });

  // Estados para personas de contacto (clientes jurídicos)
  const [personasContacto, setPersonasContacto] = useState<PersonaContacto[]>([]);

  /** Cargar datos iniciales */
  useEffect(() => {
    // Determinar tipo de cliente basado en el documento
    const tipo = cedulaRif.toUpperCase().startsWith('J') || cedulaRif.toUpperCase().startsWith('G') 
      ? 'juridico' : 'natural';
    setTipoCliente(tipo);
    
    // Cargar lugares
    cargarLugares();
  }, [cedulaRif]);

  /** Cargar estructura jerárquica de lugares */
  const cargarLugares = async () => {
    try {
      const lugaresData = await obtenerLugaresJerarquicos();
      setEstados(lugaresData.estados);
    } catch (error) {
      console.error('Error al cargar lugares:', error);
      onError('Error al cargar la información de lugares');
    }
  };

  /** Manejar cambio de estado para habitación */
  const handleEstadoHabitacionChange = async (estadoId: number) => {
    setEstadoHabitacion(estadoId);
    setMunicipioHabitacion(null);
    setParroquiaHabitacion(null);
    
    const estado = estados.find(e => e.clave === estadoId);
    if (estado) {
      setMunicipiosHabitacion(estado.municipios);
      setParroquiasHabitacion([]);
    }
  };

  /** Manejar cambio de municipio para habitación */
  const handleMunicipioHabitacionChange = (municipioId: number) => {
    setMunicipioHabitacion(municipioId);
    setParroquiaHabitacion(null);
    
    const municipio = municipiosHabitacion.find(m => m.clave === municipioId);
    if (municipio) {
      setParroquiasHabitacion(municipio.parroquias);
    }
  };

  /** Handlers similares para direcciones fiscal y física */
  const handleEstadoFiscalChange = async (estadoId: number) => {
    setEstadoFiscal(estadoId);
    setMunicipioFiscal(null);
    setParroquiaFiscal(null);
    
    const estado = estados.find(e => e.clave === estadoId);
    if (estado) {
      setMunicipiosFiscal(estado.municipios);
      setParroquiasFiscal([]);
    }
  };

  const handleMunicipioFiscalChange = (municipioId: number) => {
    setMunicipioFiscal(municipioId);
    setParroquiaFiscal(null);
    
    const municipio = municipiosFiscal.find(m => m.clave === municipioId);
    if (municipio) {
      setParroquiasFiscal(municipio.parroquias);
    }
  };

  const handleEstadoFisicoChange = async (estadoId: number) => {
    setEstadoFisico(estadoId);
    setMunicipioFisico(null);
    setParroquiaFisico(null);
    
    const estado = estados.find(e => e.clave === estadoId);
    if (estado) {
      setMunicipiosFisico(estado.municipios);
      setParroquiasFisico([]);
    }
  };

  const handleMunicipioFisicoChange = (municipioId: number) => {
    setMunicipioFisico(municipioId);
    setParroquiaFisico(null);
    
    const municipio = municipiosFisico.find(m => m.clave === municipioId);
    if (municipio) {
      setParroquiasFisico(municipio.parroquias);
    }
  };

  /** Agregar teléfono */
  const agregarTelefono = () => {
    setTelefonos([...telefonos, { codigo: 414, numero: 0 }]);
  };

  /** Eliminar teléfono */
  const eliminarTelefono = (index: number) => {
    if (telefonos.length > 1) {
      setTelefonos(telefonos.filter((_, i) => i !== index));
    }
  };

  /** Actualizar teléfono */
  const actualizarTelefono = (index: number, campo: keyof Telefono, valor: number) => {
    const nuevos = [...telefonos];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setTelefonos(nuevos);
  };

  /** Agregar persona de contacto */
  const agregarPersonaContacto = () => {
    setPersonasContacto([...personasContacto, {
      primer_nombre: '',
      primer_apellido: '',
      correo: { direccion_email: '' },
      telefono: { codigo: 414, numero: 0 }
    }]);
  };

  /** Eliminar persona de contacto */
  const eliminarPersonaContacto = (index: number) => {
    setPersonasContacto(personasContacto.filter((_, i) => i !== index));
  };

  /** Actualizar persona de contacto */
  const actualizarPersonaContacto = (index: number, campo: string, valor: any) => {
    const nuevas = [...personasContacto];
    if (campo === 'correo') {
      nuevas[index].correo.direccion_email = valor;
    } else if (campo.startsWith('telefono.')) {
      const campoTel = campo.split('.')[1] as keyof Telefono;
      nuevas[index].telefono[campoTel] = valor;
    } else {
      (nuevas[index] as any)[campo] = valor;
    }
    setPersonasContacto(nuevas);
  };

  /** Validar formulario */
  const validarFormulario = (): boolean => {
    // Validar correo
    if (!validarEmail(correo)) {
      onError('Formato de correo electrónico inválido');
      return false;
    }

    // Validar teléfonos
    for (let i = 0; i < telefonos.length; i++) {
      const tel = telefonos[i];
      if (!validarCodigoTelefono(tel.codigo)) {
        onError(`Código de teléfono ${i + 1} inválido`);
        return false;
      }
      if (!validarNumeroTelefono(tel.numero)) {
        onError(`Número de teléfono ${i + 1} debe tener 7 dígitos`);
      return false;
      }
    }

    if (tipoCliente === 'natural') {
      if (!datosNatural.primer_nombre || !datosNatural.primer_apellido || !datosNatural.direccion_habitacion) {
        onError('Complete todos los campos obligatorios');
        return false;
      }
      if (!parroquiaHabitacion) {
        onError('Seleccione la parroquia de habitación');
        return false;
      }
    } else {
      if (!datosJuridico.razon_social || !datosJuridico.denominacion_comercial || 
          !datosJuridico.direccion_fiscal || !datosJuridico.direccion_fisica) {
        onError('Complete todos los campos obligatorios');
        return false;
      }
      if (!parroquiaFiscal || !parroquiaFisico) {
        onError('Seleccione las parroquias fiscal y física');
        return false;
      }
      if (!datosJuridico.url_pagina_web.startsWith('http')) {
        onError('La URL debe comenzar con http:// o https://');
        return false;
      }

      // Validar personas de contacto
      for (let i = 0; i < personasContacto.length; i++) {
        const persona = personasContacto[i];
        if (!persona.primer_nombre || !persona.primer_apellido) {
          onError(`Complete los datos de la persona de contacto ${i + 1}`);
          return false;
        }
        if (!validarEmail(persona.correo.direccion_email)) {
          onError(`Correo de persona de contacto ${i + 1} inválido`);
      return false;
    }
        if (!validarCodigoTelefono(persona.telefono.codigo) || !validarNumeroTelefono(persona.telefono.numero)) {
          onError(`Teléfono de persona de contacto ${i + 1} inválido`);
      return false;
        }
      }
    }

    return true;
  };

  /** Manejar envío del formulario */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCargando(true);

    try {
      const numeroDocumento = extraerNumeroDocumento(cedulaRif);
      
      let datosCliente: CrearClienteRequest;

      if (tipoCliente === 'natural') {
        datosCliente = {
          tipo: 'natural',
          ci: numeroDocumento,
          rif: numeroDocumento,
          ...datosNatural,
          fk_direccion_habitacion: parroquiaHabitacion!,
          correo: { direccion_email: correo },
          telefonos
        };
      } else {
        datosCliente = {
          tipo: 'juridico',
          rif: numeroDocumento,
          ...datosJuridico,
          fk_direccion_fiscal: parroquiaFiscal!,
          fk_direccion_fisica: parroquiaFisico!,
          correo: { direccion_email: correo },
          telefonos,
          personas_contacto: personasContacto
        };
      }

      const respuesta = await crearCliente(datosCliente);
      onClienteRegistrado(respuesta.cliente as Cliente);

    } catch (error) {
      console.error('Error al registrar cliente:', error);
      onError(error instanceof Error ? error.message : 'Error al registrar cliente');
    } finally {
      setCargando(false);
    }
  };

  /** Renderizar selector de ubicación */
  const renderSelectorUbicacion = (
    titulo: string,
    estado: number | null,
    municipio: number | null,
    parroquia: number | null,
    municipios: LugarMunicipio[],
    parroquias: LugarParroquia[],
    onEstadoChange: (id: number) => void,
    onMunicipioChange: (id: number) => void,
    onParroquiaChange: (id: number) => void
  ) => (
    <div className="space-y-3">
      <h5 className="font-medium text-gray-800">{titulo}</h5>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Estado</label>
          <select
            value={estado || ''}
            onChange={(e) => onEstadoChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Seleccionar...</option>
            {estados.map(est => (
              <option key={est.clave} value={est.clave}>{est.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Municipio</label>
          <select
            value={municipio || ''}
            onChange={(e) => onMunicipioChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={!estado}
            required
          >
            <option value="">Seleccionar...</option>
            {municipios.map(mun => (
              <option key={mun.clave} value={mun.clave}>{mun.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Parroquia</label>
          <select
            value={parroquia || ''}
            onChange={(e) => onParroquiaChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={!municipio}
            required
          >
            <option value="">Seleccionar...</option>
            {parroquias.map(par => (
              <option key={par.clave} value={par.clave}>{par.nombre}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  /** Renderizar formulario de cliente natural */
  const renderFormularioNatural = () => (
    <div className="space-y-6">
      {/* Datos personales */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-4">
          <i className="fas fa-user mr-2"></i>
          Datos Personales
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primer Nombre *
            </label>
            <input
              type="text"
              required
              value={datosNatural.primer_nombre}
              onChange={(e) => setDatosNatural(prev => ({ ...prev, primer_nombre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Juan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segundo Nombre
            </label>
            <input
              type="text"
              value={datosNatural.segundo_nombre}
              onChange={(e) => setDatosNatural(prev => ({ ...prev, segundo_nombre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Carlos"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primer Apellido *
            </label>
            <input
              type="text"
              required
              value={datosNatural.primer_apellido}
              onChange={(e) => setDatosNatural(prev => ({ ...prev, primer_apellido: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Pérez"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segundo Apellido
            </label>
            <input
              type="text"
              value={datosNatural.segundo_apellido}
              onChange={(e) => setDatosNatural(prev => ({ ...prev, segundo_apellido: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="González"
            />
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-4">
          <i className="fas fa-home mr-2"></i>
          Dirección de Habitación
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección Completa *
            </label>
            <textarea
              required
              value={datosNatural.direccion_habitacion}
              onChange={(e) => setDatosNatural(prev => ({ ...prev, direccion_habitacion: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Av. Libertador, Torre ABC, Piso 5, Apt. 12"
              rows={3}
            />
          </div>
          {renderSelectorUbicacion(
            "Ubicación",
            estadoHabitacion,
            municipioHabitacion,
            parroquiaHabitacion,
            municipiosHabitacion,
            parroquiasHabitacion,
            handleEstadoHabitacionChange,
            handleMunicipioHabitacionChange,
            (id) => setParroquiaHabitacion(id)
          )}
        </div>
      </div>
    </div>
  );

  /** Renderizar formulario de cliente jurídico */
  const renderFormularioJuridico = () => (
    <div className="space-y-6">
      {/* Datos de la empresa */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-4">
          <i className="fas fa-building mr-2"></i>
          Datos de la Empresa
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razón Social *
            </label>
            <input
              type="text"
              required
              value={datosJuridico.razon_social}
              onChange={(e) => setDatosJuridico(prev => ({ ...prev, razon_social: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Empresa XYZ C.A."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Denominación Comercial *
            </label>
            <input
              type="text"
              required
              value={datosJuridico.denominacion_comercial}
              onChange={(e) => setDatosJuridico(prev => ({ ...prev, denominacion_comercial: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="XYZ Store"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Página Web *
            </label>
            <input
              type="url"
              required
              value={datosJuridico.url_pagina_web}
              onChange={(e) => setDatosJuridico(prev => ({ ...prev, url_pagina_web: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="https://www.empresa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capital Disponible *
            </label>
            <input
              type="number"
              required
              min="0"
              value={datosJuridico.capital_disponible}
              onChange={(e) => setDatosJuridico(prev => ({ ...prev, capital_disponible: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="100000"
            />
          </div>
        </div>
      </div>

      {/* Direcciones */}
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-4">
          <i className="fas fa-map-marker-alt mr-2"></i>
          Direcciones
        </h4>
        <div className="space-y-6">
          {/* Dirección Fiscal */}
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección Fiscal *
              </label>
              <textarea
                required
                value={datosJuridico.direccion_fiscal}
                onChange={(e) => setDatosJuridico(prev => ({ ...prev, direccion_fiscal: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Torre Empresarial, Piso 10, Oficina 1001"
                rows={2}
              />
            </div>
            {renderSelectorUbicacion(
              "Ubicación Fiscal",
              estadoFiscal,
              municipioFiscal,
              parroquiaFiscal,
              municipiosFiscal,
              parroquiasFiscal,
              handleEstadoFiscalChange,
              handleMunicipioFiscalChange,
              (id) => setParroquiaFiscal(id)
            )}
          </div>

          {/* Dirección Física */}
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección Física *
              </label>
              <textarea
                required
                value={datosJuridico.direccion_fisica}
                onChange={(e) => setDatosJuridico(prev => ({ ...prev, direccion_fisica: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Centro Comercial ABC, Local 123"
                rows={2}
              />
            </div>
            {renderSelectorUbicacion(
              "Ubicación Física",
              estadoFisico,
              municipioFisico,
              parroquiaFisico,
              municipiosFisico,
              parroquiasFisico,
              handleEstadoFisicoChange,
              handleMunicipioFisicoChange,
              (id) => setParroquiaFisico(id)
            )}
          </div>
        </div>
      </div>

      {/* Personas de Contacto */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-yellow-800">
            <i className="fas fa-users mr-2"></i>
            Personas de Contacto
          </h4>
          <button
            type="button"
            onClick={agregarPersonaContacto}
            className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <i className="fas fa-plus mr-1"></i>
            Agregar
          </button>
        </div>
        
        {personasContacto.length === 0 ? (
          <p className="text-yellow-700 text-sm italic">
            No hay personas de contacto agregadas (opcional)
          </p>
        ) : (
          <div className="space-y-4">
            {personasContacto.map((persona, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-800">Persona {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => eliminarPersonaContacto(index)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Primer Nombre</label>
                    <input
                      type="text"
                      value={persona.primer_nombre}
                      onChange={(e) => actualizarPersonaContacto(index, 'primer_nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="María"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Primer Apellido</label>
                    <input
                      type="text"
                      value={persona.primer_apellido}
                      onChange={(e) => actualizarPersonaContacto(index, 'primer_apellido', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="González"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={persona.correo.direccion_email}
                      onChange={(e) => actualizarPersonaContacto(index, 'correo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="maria@empresa.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                    <div className="flex gap-2">
                      <select
                        value={persona.telefono.codigo}
                        onChange={(e) => actualizarPersonaContacto(index, 'telefono.codigo', Number(e.target.value))}
                        className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value={414}>0414</option>
                        <option value={416}>0416</option>
                        <option value={412}>0412</option>
                        <option value={424}>0424</option>
                        <option value={426}>0426</option>
                      </select>
                      <input
                        type="number"
                        value={persona.telefono.numero || ''}
                        onChange={(e) => actualizarPersonaContacto(index, 'telefono.numero', Number(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="1234567"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    <i className="fas fa-user-plus mr-3"></i>
                    Registro de Cliente {tipoCliente === 'natural' ? 'Natural' : 'Jurídico'}
                  </h2>
                  <p className="text-blue-100">
                    Documento: {cedulaRif}
                  </p>
                </div>
                <button
                  onClick={onVolver}
                  className="text-white hover:text-blue-200 transition-colors duration-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                  disabled={cargando}
                >
                  <i className="fas fa-arrow-left text-2xl"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {/* Información de contacto general */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  <i className="fas fa-envelope mr-2"></i>
                  Información de Contacto
                </h4>
                
                {/* Correo electrónico */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="cliente@ejemplo.com"
                  />
                </div>

                {/* Teléfonos */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Teléfonos *
                  </label>
                    <button
                      type="button"
                      onClick={agregarTelefono}
                      className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <i className="fas fa-plus mr-1"></i>
                      Agregar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {telefonos.map((telefono, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <select
                          value={telefono.codigo}
                          onChange={(e) => actualizarTelefono(index, 'codigo', Number(e.target.value))}
                          className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value={414}>0414</option>
                          <option value={416}>0416</option>
                          <option value={412}>0412</option>
                          <option value={424}>0424</option>
                          <option value={426}>0426</option>
                        </select>
                  <input
                          type="number"
                          value={telefono.numero || ''}
                          onChange={(e) => actualizarTelefono(index, 'numero', Number(e.target.value))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="1234567"
                    required
                  />
                  <input
                          type="number"
                          value={telefono.extension || ''}
                          onChange={(e) => actualizarTelefono(index, 'extension', Number(e.target.value))}
                          className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Ext"
                        />
                        {telefonos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => eliminarTelefono(index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                </div>
                </div>
              </div>

              {/* Formulario específico según tipo de cliente */}
              {tipoCliente === 'natural' ? renderFormularioNatural() : renderFormularioJuridico()}

              {/* Botones de acción */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onVolver}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  disabled={cargando}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-bold shadow-lg hover:shadow-xl"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-check mr-2"></i>
                      Registrar Cliente
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroCliente;
