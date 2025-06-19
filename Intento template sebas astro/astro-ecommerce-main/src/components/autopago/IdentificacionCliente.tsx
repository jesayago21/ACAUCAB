import React, { useState } from 'react';
import type { Cliente, IdentificacionProps } from '../../types/autopago';

/** Componente para identificación del cliente por cédula o RIF */
const IdentificacionCliente: React.FC<IdentificacionProps> = ({ 
  onClienteIdentificado, 
  onClienteNoEncontrado,
  onError 
}) => {
  const [cedulaRif, setCedulaRif] = useState('');
  const [cargando, setCargando] = useState(false);

  /** Función para validar cédula o RIF venezolano */
  const validarCedulaRif = (valor: string): boolean => {
    // Eliminar espacios y guiones
    const limpio = valor.replace(/[\s-]/g, '');
    
    // Validar formato básico (V, E, J, G seguido de números)
    const regex = /^[VEJG]\d{7,9}$/i;
    return regex.test(limpio);
  };

  /** Manejo del envío del formulario */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cedulaRif.trim()) {
      onError('Por favor ingrese la cédula o RIF');
      return;
    }

    if (!validarCedulaRif(cedulaRif)) {
      onError('Formato inválido. Use V12345678, E12345678, J123456789 o G20012345678');
      return;
    }

    setCargando(true);

    try {
      // Simular búsqueda del cliente en base de datos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular que algunos clientes existen y otros no
      const clienteExiste = Math.random() > 0.5; // 50% de probabilidad
      
      if (clienteExiste) {
        /** Cliente encontrado en la base de datos */
        const cliente: Cliente = {
          cedula_rif: cedulaRif.toUpperCase(),
          nombre: `Juan ${cedulaRif.slice(-4)}`,
          apellido: 'Pérez',
          email: `cliente${cedulaRif.slice(-4)}@email.com`,
          telefono: '+58 414 123 4567'
        };

        onClienteIdentificado(cliente);
      } else {
        /** Cliente no encontrado - debe registrarse */
        onClienteNoEncontrado(cedulaRif.toUpperCase());
      }
    } catch (error) {
      onError('Error al buscar el cliente. Intente nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <i className="fas fa-user-circle text-white text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Identificación del Cliente
                </h2>
                <p className="text-green-100">
                  Ingrese su cédula de identidad o RIF para continuar
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="cedulaRif" className="block text-sm font-medium text-gray-700 mb-2">
                    Cédula o RIF *
                  </label>
                  <input
                    type="text"
                    id="cedulaRif"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-center text-xl font-semibold"
                    placeholder="V12345678"
                    value={cedulaRif}
                    onChange={(e) => setCedulaRif(e.target.value.toUpperCase())}
                    disabled={cargando}
                    maxLength={12}
                    style={{ letterSpacing: '2px' }}
                  />
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Formatos válidos: V, E, J o G seguido de números
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  disabled={cargando || !cedulaRif.trim()}
                >
                  {cargando ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Buscando Cliente...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search mr-2"></i>
                      Buscar Cliente
                    </>
                  )}
                </button>
              </form>

              {/* Ejemplos de formato */}
              <div className="mt-8 bg-green-50 rounded-xl p-6">
                <h4 className="font-semibold text-green-800 mb-3">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Ejemplos de formato válido:
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-user text-green-600 text-xs"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-green-800">Venezolanos:</div>
                      <div className="text-green-600">V12345678</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-globe text-green-600 text-xs"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-green-800">Extranjeros:</div>
                      <div className="text-green-600">E12345678</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-building text-green-600 text-xs"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-green-800">Jurídico:</div>
                      <div className="text-green-600">J123456789</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-landmark text-green-600 text-xs"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-green-800">Gobierno:</div>
                      <div className="text-green-600">G20012345678</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de privacidad */}
              <div className="mt-6 bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-800 mb-3">
                  <i className="fas fa-shield-alt mr-2"></i>
                  Información de Privacidad
                </h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start">
                    <i className="fas fa-check text-blue-500 mr-2 mt-0.5 text-xs"></i>
                    <span>Si es cliente registrado, se cargarán automáticamente sus datos</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-blue-500 mr-2 mt-0.5 text-xs"></i>
                    <span>Si es nuevo, podrá registrarse de forma rápida y segura</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-blue-500 mr-2 mt-0.5 text-xs"></i>
                    <span>Sus datos están protegidos según las normativas vigentes</span>
                  </li>
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