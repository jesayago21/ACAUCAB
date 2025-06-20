import React, { useState, useEffect } from 'react';
import { clientService } from '../../services/clientService';
import type { Cliente, TipoCliente, Lugar, CrearClienteRequest } from '../../types/client';

interface RegistroClienteProps {
  cedulaRif: string;
  onClienteRegistrado: (cliente: Cliente) => void;
  onVolver: () => void;
  onError: (error: string) => void;
}

const RegistroCliente: React.FC<RegistroClienteProps> = ({
  cedulaRif,
  onClienteRegistrado,
  onVolver,
  onError
}) => {
  const [cargando, setCargando] = useState(false);
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [tipoCliente, setTipoCliente] = useState<TipoCliente | null>(null);
  
  // Estados para cliente natural
  const [datosNatural, setDatosNatural] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    direccion_habitacion: '',
    fk_direccion_habitacion: 1
  });

  // Estados para cliente jurídico
  const [datosJuridico, setDatosJuridico] = useState({
    razon_social: '',
    denominacion_comercial: '',
    url_pagina_web: '',
    capital_disponible: 0,
    direccion_fiscal: '',
    direccion_fisica: '',
    fk_direccion_fiscal: 1,
    fk_direccion_fisica: 1
  });

  useEffect(() => {
    // Determinar tipo de cliente y extraer número
    const tipo = clientService.determinarTipoCliente(cedulaRif);
    setTipoCliente(tipo);
    
    // Cargar lugares
    cargarLugares();
  }, [cedulaRif]);

  const cargarLugares = async () => {
    try {
      const lugaresData = await clientService.obtenerLugares();
      setLugares(lugaresData);
    } catch (error) {
      console.error('Error al cargar lugares:', error);
      onError('Error al cargar la información de lugares');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const numeroDocumento = clientService.extraerNumeroDocumento(cedulaRif);
      
      let datosCliente: CrearClienteRequest;

      if (tipoCliente === 'natural') {
        // Validar campos requeridos para cliente natural
        if (!datosNatural.primer_nombre || !datosNatural.primer_apellido || !datosNatural.direccion_habitacion) {
          onError('Por favor complete todos los campos obligatorios');
          return;
        }

        datosCliente = {
          tipo: 'natural',
          ci: numeroDocumento,
          rif: numeroDocumento, // En este caso, usamos el mismo número
          ...datosNatural
        };
      } else if (tipoCliente === 'juridico') {
        // Validar campos requeridos para cliente jurídico
        if (!datosJuridico.razon_social || !datosJuridico.denominacion_comercial || 
            !datosJuridico.url_pagina_web || !datosJuridico.direccion_fiscal || 
            !datosJuridico.direccion_fisica) {
          onError('Por favor complete todos los campos obligatorios');
          return;
        }

        // Validar URL
        if (!datosJuridico.url_pagina_web.startsWith('http')) {
          onError('La URL debe comenzar con http:// o https://');
          return;
        }

        datosCliente = {
          tipo: 'juridico',
          rif: numeroDocumento,
          ...datosJuridico
        };
      } else {
        onError('Tipo de cliente no válido');
        return;
      }

      const respuesta = await clientService.crearCliente(datosCliente);
      
      // Construir cliente para respuesta
      const clienteCreado: Cliente = {
        clave: respuesta.cliente.clave,
        tipo: tipoCliente,
        documento: numeroDocumento,
        puntos_acumulados: 0,
        ...(tipoCliente === 'natural' ? {
          nombre: datosNatural.primer_nombre,
          apellido: datosNatural.primer_apellido,
          ci: numeroDocumento,
          rif: numeroDocumento,
          primer_nombre: datosNatural.primer_nombre,
          segundo_nombre: datosNatural.segundo_nombre,
          primer_apellido: datosNatural.primer_apellido,
          segundo_apellido: datosNatural.segundo_apellido,
          direccion_habitacion: datosNatural.direccion_habitacion,
          fk_direccion_habitacion: datosNatural.fk_direccion_habitacion
        } : {
          rif: numeroDocumento,
          razon_social: datosJuridico.razon_social,
          denominacion_comercial: datosJuridico.denominacion_comercial,
          url_pagina_web: datosJuridico.url_pagina_web,
          capital_disponible: datosJuridico.capital_disponible,
          direccion_fiscal: datosJuridico.direccion_fiscal,
          direccion_fisica: datosJuridico.direccion_fisica,
          fk_direccion_fiscal: datosJuridico.fk_direccion_fiscal,
          fk_direccion_fisica: datosJuridico.fk_direccion_fisica
        })
      } as Cliente;

      onClienteRegistrado(clienteCreado);

    } catch (error) {
      console.error('Error al registrar cliente:', error);
      onError(error instanceof Error ? error.message : 'Error al registrar cliente');
    } finally {
      setCargando(false);
    }
  };

  const renderFormularioNatural = () => (
    <div className="space-y-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección de Habitación *
        </label>
        <textarea
          required
          value={datosNatural.direccion_habitacion}
          onChange={(e) => setDatosNatural(prev => ({ ...prev, direccion_habitacion: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Av. Libertador, Torre XYZ, Piso 5, Apto 10"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lugar
        </label>
        <select
          value={datosNatural.fk_direccion_habitacion}
          onChange={(e) => setDatosNatural(prev => ({ ...prev, fk_direccion_habitacion: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          {lugares.map(lugar => (
            <option key={lugar.clave} value={lugar.clave}>
              {lugar.nombre} ({lugar.tipo})
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderFormularioJuridico = () => (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Página Web *
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
            onChange={(e) => setDatosJuridico(prev => ({ ...prev, capital_disponible: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="100000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección Fiscal *
        </label>
        <textarea
          required
          value={datosJuridico.direccion_fiscal}
          onChange={(e) => setDatosJuridico(prev => ({ ...prev, direccion_fiscal: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Torre Empresarial, Piso 20, Oficina 2001"
          rows={2}
        />
      </div>

      <div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lugar Fiscal
          </label>
          <select
            value={datosJuridico.fk_direccion_fiscal}
            onChange={(e) => setDatosJuridico(prev => ({ ...prev, fk_direccion_fiscal: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {lugares.map(lugar => (
              <option key={lugar.clave} value={lugar.clave}>
                {lugar.nombre} ({lugar.tipo})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lugar Físico
          </label>
          <select
            value={datosJuridico.fk_direccion_fisica}
            onChange={(e) => setDatosJuridico(prev => ({ ...prev, fk_direccion_fisica: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {lugares.map(lugar => (
              <option key={lugar.clave} value={lugar.clave}>
                {lugar.nombre} ({lugar.tipo})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  if (!tipoCliente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Documento inválido
              </h2>
              <p className="text-gray-600 mb-6">
                No se pudo determinar el tipo de cliente para el documento: {cedulaRif}
              </p>
              <button
                onClick={onVolver}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Volver a intentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <i className={`fas ${tipoCliente === 'natural' ? 'fa-user-plus' : 'fa-building'} text-white text-2xl`}></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Registro de Cliente {tipoCliente === 'natural' ? 'Natural' : 'Jurídico'}
              </h2>
              <p className="text-blue-100">
                Documento: {cedulaRif}
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6">
              {tipoCliente === 'natural' ? renderFormularioNatural() : renderFormularioJuridico()}

              {/* Botones */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={onVolver}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={cargando}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
                >
                  {cargando ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
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
