import React, { useState } from 'react';
import { identificarCliente, validarDocumentoVenezolano } from '../../services/clientService';
import type { Cliente } from '../../types/client';

interface IdentificacionClienteProps {
  onClienteIdentificado: (cliente: Cliente) => void;
  onClienteNoEncontrado: (cedula: string) => void;
  onError: (error: string) => void;
}

/** Componente para identificación de clientes por documento */
const IdentificacionCliente: React.FC<IdentificacionClienteProps> = ({
  onClienteIdentificado,
  onClienteNoEncontrado,
  onError
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
                <i className="fas fa-id-card text-white text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Identificación de Cliente
              </h2>
              <p className="text-green-100">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg font-mono tracking-wider"
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
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <i className="fas fa-info-circle text-blue-500 text-lg mt-0.5"></i>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">
                        ¿Primera vez comprando?
                      </h4>
                      <p className="text-sm text-blue-700">
                        Si no estás registrado, te ayudaremos a crear tu cuenta de forma rápida y sencilla.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botón de buscar */}
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl"
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
              </div>
            </form>

            {/* Footer con información de seguridad */}
            <div className="bg-gray-50 px-8 py-4">
              <div className="flex items-center text-xs text-gray-600">
                <i className="fas fa-shield-alt text-green-500 mr-2"></i>
                <span>
                  Tu información está protegida y se maneja de forma confidencial
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificacionCliente; 