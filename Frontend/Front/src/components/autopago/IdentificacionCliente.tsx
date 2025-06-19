import React, { useState } from 'react';
import { identificarCliente, validarDocumentoVenezolano } from '../../services/clientService';
import type { Cliente } from '../../types/client';

interface IdentificacionClienteProps {
  onClienteIdentificado: (cliente: Cliente) => void;
  onClienteNoEncontrado: (cedula: string) => void;
  onError: (error: string) => void;
  onIrARegistro: () => void;
}

/** Componente para identificación de clientes por documento */
const IdentificacionCliente: React.FC<IdentificacionClienteProps> = ({
  onClienteIdentificado,
  onClienteNoEncontrado,
  onError,
  onIrARegistro
}) => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);

  /** Manejar envío del formulario */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documento.trim()) {
      onError('Por favor ingrese su documento de identidad');
      return;
    }

    if (!validarDocumentoVenezolano(documento)) {
      onError('Formato de documento inválido. Use V-12345678, E-12345678, J-123456789 o G-123456789');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await identificarCliente(documento);
      
      if (respuesta.found && respuesta.cliente) {
        onClienteIdentificado(respuesta.cliente);
      } else {
        onClienteNoEncontrado(documento);
      }
    } catch (error) {
      console.error('Error al identificar cliente:', error);
      onError(error instanceof Error ? error.message : 'Error al buscar cliente');
    } finally {
      setCargando(false);
    }
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
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-down">
        {/* Header */}
        <div className="bg-primary p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
            <i className="fas fa-id-card text-white text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Identificación de Cliente
          </h2>
          <p className="text-gray-200">
            Ingrese su cédula o RIF para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Campo de documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cédula de Identidad o RIF *
              </label>
              <input
                type="text"
                value={documento}
                onChange={(e) => handleDocumentoChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-lg font-mono tracking-wider"
                placeholder="V-12345678"
                maxLength={12}
                required
                disabled={cargando}
                autoComplete="off"
              />
              <div className="mt-2 text-xs text-gray-500">
                <p className="mb-1"><strong>Ejemplos válidos:</strong></p>
                <div className="grid grid-cols-2 gap-1">
                  <span>• V-12345678 (Venezolano)</span>
                  <span>• E-12345678 (Extranjero)</span>
                  <span>• J-123456789 (Jurídico)</span>
                  <span>• G-123456789 (Gobierno)</span>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle text-primary text-lg mt-0.5"></i>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-800 mb-1">
                    ¿Primera vez comprando?
                  </h4>
                  <p className="text-sm text-gray-700">
                    Si no estás registrado, te ayudaremos a crear tu cuenta de forma rápida y sencilla.
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de buscar */}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-primary hover:bg-primary-hover text-white text-lg font-bold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl"
              disabled={cargando || !documento.trim()}
            >
              {cargando ? (
                <>
                  <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Buscando cliente...
                </>
              ) : (
                <>
                  <i className="fas fa-search mr-3"></i>
                  Buscar Cliente
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            {/* Botón de registro directo */}
            <button
              type="button"
              onClick={onIrARegistro}
              className="w-full px-6 py-4 bg-accent hover:bg-green-500 text-white text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              disabled={cargando}
            >
              <i className="fas fa-user-plus mr-3"></i>
              Registrarse como Nuevo Cliente
            </button>

            {/* Información para nuevos usuarios */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-center">
                <i className="fas fa-gift text-blue-500 text-xl mb-2"></i>
                <h4 className="text-sm font-semibold text-blue-800 mb-1">
                  ¡Beneficios para nuevos clientes!
                </h4>
                <p className="text-xs text-blue-700">
                  Registrate y obtén puntos en cada compra, ofertas exclusivas y más beneficios.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer con información de seguridad */}
        <div className="bg-gray-50 px-8 py-4 border-t">
          <div className="flex items-center text-xs text-gray-600">
            <i className="fas fa-shield-alt text-primary mr-2"></i>
            <span>
              Tu información está protegida y se maneja de forma confidencial
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificacionCliente; 