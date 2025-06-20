import React from 'react';

interface SeleccionTipoClienteProps {
  cedulaRif: string;
  onTipoSeleccionado: (tipo: 'natural' | 'juridico') => void;
  onVolver: () => void;
}

/** Componente para seleccionar el tipo de cliente a registrar */
const SeleccionTipoCliente: React.FC<SeleccionTipoClienteProps> = ({
  cedulaRif,
  onTipoSeleccionado,
  onVolver
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-down">
        {/* Header */}
        <div className="bg-primary px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                <i className="fas fa-user-plus mr-3"></i>
                Registro de Cliente
              </h2>
              <p className="text-gray-200">
                Documento: {cedulaRif}
              </p>
            </div>
            <button
              onClick={onVolver}
              className="text-white hover:text-gray-300 transition-colors duration-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              <i className="fas fa-arrow-left text-2xl"></i>
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Mensaje explicativo */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Selecciona el tipo de cliente
            </h3>
            <p className="text-gray-600">
              Elige la opción que mejor describe tu situación para continuar con el registro
            </p>
          </div>

          {/* Opciones de tipo de cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente Natural */}
            <div 
              onClick={() => onTipoSeleccionado('natural')}
              className="group cursor-pointer bg-background border-2 border-secondary rounded-xl p-6 hover:border-primary hover:bg-green-100 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 group-hover:bg-secondary rounded-full mb-4 transition-colors duration-300">
                  <i className="fas fa-user text-primary text-2xl"></i>
                </div>
                <h4 className="text-lg font-bold text-primary mb-3">
                  Cliente Natural
                </h4>
                <p className="text-green-800 text-sm mb-4">
                  Para personas naturales con cédula de identidad venezolana o extranjera
                </p>
                <div className="text-xs text-primary space-y-1">
                  <div className="flex items-center justify-center">
                    <i className="fas fa-check mr-2"></i>
                    <span>Cédula V o E</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-check mr-2"></i>
                    <span>RIF personal</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-check mr-2"></i>
                    <span>Dirección habitación</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cliente Jurídico */}
            <div 
              onClick={() => onTipoSeleccionado('juridico')}
              className="group cursor-pointer bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-primary hover:bg-green-100 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 group-hover:bg-secondary rounded-full mb-4 transition-colors duration-300">
                  <i className="fas fa-building text-gray-600 group-hover:text-primary text-2xl"></i>
                </div>
                <h4 className="text-lg font-bold text-gray-800 group-hover:text-primary mb-3">
                  Cliente Jurídico
                </h4>
                <p className="text-gray-700 group-hover:text-green-800 text-sm mb-4">
                  Para empresas, organizaciones y entidades jurídicas
                </p>
                <div className="text-xs text-gray-600 group-hover:text-primary space-y-1">
                  <div className="flex items-center justify-center">
                    <i className="fas fa-check mr-2"></i>
                    <span>RIF J o G</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-check mr-2"></i>
                    <span>Razón social</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-check mr-2"></i>
                    <span>Direcciones fiscal y física</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-8 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-lightbulb text-yellow-500 text-lg mt-0.5"></i>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  Información importante
                </h4>
                <p className="text-sm text-yellow-700">
                  Ambos tipos de cliente requieren tener un RIF válido. Si no tienes RIF, 
                  puedes obtenerlo en el SENIAT o en línea a través de su portal web.
                </p>
              </div>
            </div>
          </div>

          {/* Botón de volver */}
          <div className="flex justify-center mt-8">
            <button
              onClick={onVolver}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium transform hover:scale-105"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Volver a Identificación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeleccionTipoCliente; 