import React, { useState } from 'react';
import { clientService } from '../../services/clientService';
import type { Cliente } from '../../types/client';

interface IdentificacionClienteProps {
  onClienteIdentificado: (cliente: Cliente) => void;
  onClienteNoEncontrado: (documento: string) => void;
  onError: (error: string) => void;
}

const IdentificacionCliente: React.FC<IdentificacionClienteProps> = ({
  onClienteIdentificado,
  onClienteNoEncontrado,
  onError
}) => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState<'cedula' | 'rif' | null>(null);

  const validarFormato = (valor: string) => {
    const valorLimpio = valor.toUpperCase().replace(/\s+/g, '');
    
    if (clientService.validarCedula(valorLimpio)) {
      setTipoDocumento('cedula');
      return true;
    }
    
    if (clientService.validarRIF(valorLimpio)) {
      setTipoDocumento('rif');
      return true;
    }
    
    setTipoDocumento(null);
    return false;
  };

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setDocumento(valor);
    validarFormato(valor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documento.trim()) {
      onError('Por favor ingrese su documento de identificación');
      return;
    }

    const documentoLimpio = documento.toUpperCase().replace(/\s+/g, '');
    
    if (!validarFormato(documentoLimpio)) {
      onError('Formato de documento inválido. Use el formato: V12345678 o J123456789');
      return;
    }

    setCargando(true);

    try {
      const numeroDocumento = clientService.extraerNumeroDocumento(documentoLimpio);
      const respuesta = await clientService.identificarCliente(numeroDocumento);

      if (respuesta.found && respuesta.cliente) {
        onClienteIdentificado(respuesta.cliente);
      } else {
        onClienteNoEncontrado(documentoLimpio);
      }
    } catch (error) {
      console.error('Error al identificar cliente:', error);
      onError(error instanceof Error ? error.message : 'Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  const getPlaceholder = () => {
    return 'Ej: V12345678 o J123456789';
  };

  const getDocumentoInfo = () => {
    if (!tipoDocumento) return null;
    
    return (
      <div className="mt-2 text-sm">
        {tipoDocumento === 'cedula' ? (
          <div className="flex items-center text-green-600">
            <i className="fas fa-user mr-2"></i>
            Cliente Natural (Persona)
          </div>
        ) : (
          <div className="flex items-center text-blue-600">
            <i className="fas fa-building mr-2"></i>
            Cliente Jurídico (Empresa)
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <i className="fas fa-id-card text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Identificación de Cliente
              </h2>
              <p className="text-green-100">
                Ingrese su cédula o RIF para continuar
              </p>
            </div>

            {/* Formulario */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label 
                    htmlFor="documento" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Documento de Identidad
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="documento"
                      value={documento}
                      onChange={handleDocumentoChange}
                      placeholder={getPlaceholder()}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-lg ${
                        tipoDocumento 
                          ? 'border-green-300 bg-green-50' 
                          : documento && !tipoDocumento 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                      }`}
                      disabled={cargando}
                      autoComplete="off"
                      maxLength={12}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {tipoDocumento && (
                        <i className={`fas ${
                          tipoDocumento === 'cedula' ? 'fa-user text-green-500' : 'fa-building text-blue-500'
                        }`}></i>
                      )}
                    </div>
                  </div>
                  
                  {getDocumentoInfo()}
                  
                  {documento && !tipoDocumento && (
                    <div className="mt-2 text-sm text-red-600 flex items-center">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      Formato inválido. Use V12345678 para personas o J123456789 para empresas.
                    </div>
                  )}
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={cargando || !tipoDocumento}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 transform ${
                    cargando || !tipoDocumento
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {cargando ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Verificando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <i className="fas fa-search mr-2"></i>
                      Identificar Cliente
                    </div>
                  )}
                </button>
              </form>

              {/* Información de ayuda */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                  Formatos aceptados
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Personas:</strong> V12345678 o E12345678</li>
                  <li>• <strong>Empresas:</strong> J123456789 o G123456789</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificacionCliente; 