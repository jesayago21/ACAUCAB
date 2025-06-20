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
  const [paso, setPaso] = useState(1); // Para navegación por pasos
  
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
  const [documento, setDocumento] = useState(cedulaRif || '');
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

  /** Formatear documento mientras se escribe */
  const handleDocumentoChange = (value: string) => {
    // Remover caracteres no válidos
    let formatted = value.toUpperCase().replace(/[^VEJG0-9-]/g, '');
    
    // Agregar guión automáticamente si no existe
    if (formatted.length > 1 && !formatted.includes('-')) {
      formatted = formatted.charAt(0) + '-' + formatted.slice(1);
    }
    
    setDocumento(formatted);
    
    // Determinar tipo de cliente automáticamente
    const nuevoTipo = formatted.toUpperCase().startsWith('J') || formatted.toUpperCase().startsWith('G') 
      ? 'juridico' : 'natural';
    if (nuevoTipo !== tipoCliente) {
      setTipoCliente(nuevoTipo);
    }
  };

  /** Validar formulario */
  const validarFormulario = (): boolean => {
    // Validar correo
    if (!validarEmail(correo)) {
      onError('El formato del correo electrónico es inválido.');
      return false;
    }

    // Validar teléfonos
    for (const tel of telefonos) {
      if (!validarCodigoTelefono(tel.codigo) || !validarNumeroTelefono(tel.numero)) {
        onError('Hay un número de teléfono inválido.');
        return false;
      }
    }

    // Aquí irían más validaciones según los campos requeridos
    if (tipoCliente === 'natural') {
      if (!datosNatural.primer_nombre || !datosNatural.primer_apellido || !datosNatural.direccion_habitacion || !parroquiaHabitacion) {
        onError('Por favor, complete todos los campos obligatorios para la persona natural.');
        return false;
      }
    } else {
      if (!datosJuridico.razon_social || !datosJuridico.denominacion_comercial || !datosJuridico.direccion_fiscal || !parroquiaFiscal || !datosJuridico.direccion_fisica || !parroquiaFisico) {
        onError('Por favor, complete todos los campos obligatorios para la persona jurídica.');
        return false;
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

    const numeroDocumento = extraerNumeroDocumento(documento);

    const requestData: CrearClienteRequest = {
      tipo: tipoCliente,
      documento: numeroDocumento,
      correo_electronico: correo,
      telefonos: telefonos,
      primer_nombre: datosNatural.primer_nombre || undefined,
      segundo_nombre: datosNatural.segundo_nombre || undefined,
      primer_apellido: datosNatural.primer_apellido || undefined,
      segundo_apellido: datosNatural.segundo_apellido || undefined,
      direccion: datosNatural.direccion_habitacion || undefined,
      fk_lugar: parroquiaHabitacion || 0,
      razon_social: datosJuridico.razon_social || undefined,
      denominacion_comercial: datosJuridico.denominacion_comercial || undefined,
      pagina_web: datosJuridico.url_pagina_web || undefined,
      capital: datosJuridico.capital_disponible || undefined,
      direccion_fiscal: datosJuridico.direccion_fiscal || undefined,
      fk_lugar_fiscal: parroquiaFiscal || undefined,
      direccion_fisica: datosJuridico.direccion_fisica || undefined,
      fk_lugar_fisico: parroquiaFisico || undefined,
      personas_contacto: personasContacto.length > 0 ? personasContacto : undefined,
    };

    try {
      const response = await crearCliente(requestData);
      onClienteRegistrado(response.cliente as Cliente);
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      onError(error instanceof Error ? error.message : 'No se pudo registrar el cliente.');
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
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
      <h4 className="font-semibold text-lg text-gray-800">{titulo}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={estado ?? ''}
            onChange={(e) => onEstadoChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            disabled={cargando}
          >
            <option value="" disabled>Seleccione un estado</option>
            {estados.map(e => <option key={e.clave} value={e.clave}>{e.nombre}</option>)}
          </select>
        </div>

        {/* Municipio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
          <select
            value={municipio ?? ''}
            onChange={(e) => onMunicipioChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            disabled={!estado || cargando}
          >
            <option value="" disabled>Seleccione un municipio</option>
            {municipios.map(m => <option key={m.clave} value={m.clave}>{m.nombre}</option>)}
          </select>
        </div>

        {/* Parroquia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parroquia</label>
          <select
            value={parroquia ?? ''}
            onChange={(e) => onParroquiaChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            disabled={!municipio || cargando}
          >
            <option value="" disabled>Seleccione una parroquia</option>
            {parroquias.map(p => <option key={p.clave} value={p.clave}>{p.nombre}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  /** Renderizar formulario de cliente natural */
  const renderFormularioNatural = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Nombres y Apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="primer_nombre" placeholder="Primer Nombre *" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
        <input name="segundo_nombre" placeholder="Segundo Nombre" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
        <input name="primer_apellido" placeholder="Primer Apellido *" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
        <input name="segundo_apellido" placeholder="Segundo Apellido" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
      </div>
      
      {/* Ubicación Habitación */}
      {renderSelectorUbicacion(
        "Dirección de Habitación",
        estadoHabitacion, municipioHabitacion, parroquiaHabitacion,
        municipiosHabitacion, parroquiasHabitacion,
        handleEstadoHabitacionChange, handleMunicipioHabitacionChange, (id) => setParroquiaHabitacion(id)
      )}

      {/* Dirección Detallada */}
      <textarea placeholder="Dirección detallada (Calle, Avenida, Casa, etc.) *" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" rows={3}></textarea>
    </div>
  );

  /** Renderizar formulario de cliente jurídico */
  const renderFormularioJuridico = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Razón Social y Denominación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="razon_social" placeholder="Razón Social *" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
        <input name="denominacion_comercial" placeholder="Denominación Comercial (Nombre de la tienda)" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
      </div>

      {/* Página Web y Capital */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="url" name="url_pagina_web" placeholder="Página Web (https://ejemplo.com)" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
        <input type="number" name="capital_disponible" placeholder="Capital Disponible ($)" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
      </div>

      {/* Direcciones Fiscal y Física */}
      {renderSelectorUbicacion(
        "Dirección Fiscal",
        estadoFiscal, municipioFiscal, parroquiaFiscal,
        municipiosFiscal, parroquiasFiscal,
        handleEstadoFiscalChange, handleMunicipioFiscalChange, (id) => setParroquiaFiscal(id)
      )}
      <textarea placeholder="Dirección fiscal detallada *" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" rows={3}></textarea>

      {renderSelectorUbicacion(
        "Dirección Física de la Tienda",
        estadoFisico, municipioFisico, parroquiaFisico,
        municipiosFisico, parroquiasFisico,
        handleEstadoFisicoChange, handleMunicipioFisicoChange, (id) => setParroquiaFisico(id)
      )}
      <textarea placeholder="Dirección física detallada *" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" rows={3}></textarea>

      {/* Personas de Contacto */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h4 className="font-semibold text-lg text-gray-800 mb-4">Personas de Contacto</h4>
        {personasContacto.map((p, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg relative">
            <input placeholder="Nombre y Apellido" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
            <input type="email" placeholder="Correo Electrónico" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
            <input type="tel" placeholder="Teléfono" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
            <button onClick={() => eliminarPersonaContacto(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <i className="fas fa-times-circle"></i>
            </button>
          </div>
        ))}
        <button onClick={agregarPersonaContacto} className="text-primary hover:underline font-semibold">
          <i className="fas fa-plus-circle mr-2"></i>Añadir Contacto
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-down">
        {/* Header */}
        <div className="bg-primary p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Registro de Nuevo Cliente</h2>
            <p className="text-gray-200">Completa los datos para crear tu cuenta</p>
          </div>
          <button onClick={onVolver} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full">
            <i className="fas fa-arrow-left text-xl"></i>
          </button>
        </div>

        <div className="p-8">
          {/* Tabs para tipo de cliente */}
          <div className="flex justify-center border-b mb-6">
            <button 
              onClick={() => setTipoCliente('natural')}
              className={`px-6 py-3 font-semibold ${tipoCliente === 'natural' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
            >
              Persona Natural
            </button>
            <button 
              onClick={() => setTipoCliente('juridico')}
              className={`px-6 py-3 font-semibold ${tipoCliente === 'juridico' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
            >
              Persona Jurídica
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {tipoCliente === 'natural' ? renderFormularioNatural() : renderFormularioJuridico()}
            
            {/* Botón de Registro */}
            <div className="pt-6 border-t">
              <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-all" disabled={cargando}>
                {cargando ? 'Registrando...' : 'Completar Registro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroCliente;
