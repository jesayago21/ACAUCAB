/** Componente para identificación de clientes con verificación manual */
import React, { useState } from 'react';
import { clienteService, validacionService } from '../services/api';
import type { ClienteNatural, ClienteJuridico } from '../types/api';

interface IdentificacionClienteProps {
  onClienteExistente: (cliente: ClienteNatural | ClienteJuridico) => void;
  onClienteNoExiste: (documento: string, tipoDocumento: 'V' | 'J') => void;
}

export default function IdentificacionCliente({ 
  onClienteExistente, 
  onClienteNoExiste 
}: IdentificacionClienteProps) {
  const [tipoDocumento, setTipoDocumento] = useState<'V' | 'J'>('V');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [estado, setEstado] = useState<'idle' | 'verificando' | 'encontrado' | 'no_encontrado' | 'error'>('idle');
  const [cliente, setCliente] = useState<ClienteNatural | ClienteJuridico | null>(null);
  const [mensaje, setMensaje] = useState('');

  /** Obtener el documento completo formateado */
  const getDocumentoCompleto = () => {
    if (!numeroDocumento) return '';
    return `${tipoDocumento}-${numeroDocumento}`;
  };

  /** Validar documento según el tipo */
  const validarDocumento = () => {
    if (!numeroDocumento.trim()) {
      setMensaje('Debe ingresar un número de documento');
      return false;
    }

    const numero = numeroDocumento.replace(/\D/g, ''); // Solo números
    
    if (tipoDocumento === 'V') {
      if (numero.length < 6 || numero.length > 9) {
        setMensaje('La cédula debe tener entre 6 y 9 dígitos');
        return false;
      }
    } else {
      if (numero.length < 8 || numero.length > 9) {
        setMensaje('El RIF debe tener entre 8 y 9 dígitos');
        return false;
      }
    }

    return true;
  };

  /** Función para verificar cliente */
  const verificarCliente = async () => {
    if (!validarDocumento()) {
      setEstado('error');
      return;
    }

    setEstado('verificando');
    setMensaje('Verificando...');
    setCliente(null);

    try {
      const numeroLimpio = numeroDocumento.replace(/\D/g, '');
      const resultado = await clienteService.verificarClientePorTipo(tipoDocumento, numeroLimpio);
      
      if (resultado.found && resultado.cliente) {
        setEstado('encontrado');
        setCliente(resultado.cliente);
        const nombre = resultado.cliente.tipo === 'natural' 
          ? `${resultado.cliente.primer_nombre} ${resultado.cliente.primer_apellido}`
          : resultado.cliente.razon_social;
        setMensaje(`¡Bienvenido, ${nombre}!`);
      } else {
        setEstado('no_encontrado');
        setCliente(null);
        setMensaje(`Cliente ${tipoDocumento === 'V' ? 'natural' : 'jurídico'} no registrado. ¿Desea registrarse?`);
      }
    } catch (error) {
      // Si es un 404 (cliente no encontrado), mostrar opción de registro
      if (error instanceof Error && error.message.includes('404')) {
        setEstado('no_encontrado');
        setCliente(null);
        setMensaje(`Cliente ${tipoDocumento === 'V' ? 'natural' : 'jurídico'} no registrado. ¿Desea registrarse?`);
      } else {
        setEstado('error');
        setCliente(null);
        setMensaje('Error al verificar el cliente. Intente nuevamente.');
      }
      console.error('Error verificando cliente:', error);
    }
  };

  /** Manejar cambio en el número de documento */
  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\D/g, ''); // Solo números
    setNumeroDocumento(valor);
    
    // Resetear estado cuando el usuario modifica el input
    if (estado !== 'verificando') {
      setEstado('idle');
      setMensaje('');
    }
  };

  /** Manejar tecla Enter */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && numeroDocumento.trim() && estado !== 'verificando') {
      verificarCliente();
    }
  };

  /** Manejar botón Continuar */
  const handleContinuar = () => {
    if (cliente) {
      onClienteExistente(cliente);
    }
  };

  /** Manejar botón Registrarse */
  const handleRegistrarse = () => {
    const numeroLimpio = numeroDocumento.replace(/\D/g, '');
    onClienteNoExiste(numeroLimpio, tipoDocumento);
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#3D4A3A] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">Identificación de Cliente</h1>
          <p className="text-gray-600">Seleccione su tipo de documento e ingrese el número</p>
        </div>

        {/* Selector de tipo de documento */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2C2C2C] mb-3">
            Tipo de Documento
          </label>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setTipoDocumento('V')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 border-2 ${
                tipoDocumento === 'V'
                  ? 'bg-[#3D4A3A] text-white border-[#3D4A3A] shadow-lg'
                  : 'bg-white text-[#3D4A3A] border-[#3D4A3A] hover:bg-[#3D4A3A] hover:text-white'
              }`}
            >
              V - Venezolano
            </button>
            <button
              type="button"
              onClick={() => setTipoDocumento('J')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 border-2 ${
                tipoDocumento === 'J'
                  ? 'bg-[#3D4A3A] text-white border-[#3D4A3A] shadow-lg'
                  : 'bg-white text-[#3D4A3A] border-[#3D4A3A] hover:bg-[#3D4A3A] hover:text-white'
              }`}
            >
              J - Jurídico
            </button>
          </div>
        </div>

        {/* Input de número de documento */}
        <div className="mb-6">
          <label htmlFor="numero" className="block text-sm font-medium text-[#2C2C2C] mb-2">
            Número de {tipoDocumento === 'V' ? 'Cédula' : 'RIF'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-lg font-medium">{tipoDocumento}-</span>
            </div>
            <input
              type="text"
              id="numero"
              value={numeroDocumento}
              onChange={handleNumeroChange}
              onKeyPress={handleKeyPress}
              placeholder={tipoDocumento === 'V' ? '12345678' : '123456789'}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0] focus:border-transparent transition-all duration-300 text-lg"
              maxLength={9}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Documento completo: <span className="font-medium">{getDocumentoCompleto() || `${tipoDocumento}-`}</span>
          </p>
        </div>

        {/* Botón de verificar */}
        {estado === 'idle' && numeroDocumento.trim() && (
          <button
            type="button"
            onClick={verificarCliente}
            className="w-full bg-[#A1B5A0] hover:bg-[#8FA48E] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 mb-4 shadow-lg"
          >
            Verificar Cliente
          </button>
        )}

        {/* Indicador de estado */}
        {estado !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ${
            estado === 'verificando' ? 'bg-blue-50 border border-blue-200' :
            estado === 'encontrado' ? 'bg-green-50 border border-green-200' :
            estado === 'no_encontrado' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {estado === 'verificando' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              )}
              {estado === 'encontrado' && (
                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {estado === 'no_encontrado' && (
                <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {estado === 'error' && (
                <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className={`font-medium ${
                estado === 'verificando' ? 'text-blue-800' :
                estado === 'encontrado' ? 'text-green-800' :
                estado === 'no_encontrado' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                {mensaje}
              </p>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-3">
          {estado === 'encontrado' && (
            <button
              type="button"
              onClick={handleContinuar}
              className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Continuar con la Compra
            </button>
          )}
          
          {estado === 'no_encontrado' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleRegistrarse}
                className="w-full bg-[#A1B5A0] hover:bg-[#8FA48E] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Registrarse Ahora
              </button>
              <button
                type="button"
                onClick={() => {
                  setEstado('idle');
                  setNumeroDocumento('');
                  setMensaje('');
                }}
                className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Verificar Otro Documento
              </button>
            </div>
          )}

          {estado === 'error' && (
            <button
              type="button"
              onClick={() => {
                setEstado('idle');
                setMensaje('');
              }}
              className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Intentar Nuevamente
            </button>
          )}
        </div>

        {/* Footer informativo */}
        <div className="mt-8 text-center text-sm text-gray-500">
          
          <p className="mt-1">Sistema de Autopago ACAUCAB</p>
        </div>
      </div>
    </div>
  );
} 