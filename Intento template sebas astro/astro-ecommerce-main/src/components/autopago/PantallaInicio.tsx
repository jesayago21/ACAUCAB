import React from 'react';

/** Propiedades del componente PantallaInicio */
interface PantallaInicioProps {
  onIniciarCompra: () => void;
}

/** Pantalla inicial del sistema de autopago */
const PantallaInicio: React.FC<PantallaInicioProps> = ({ onIniciarCompra }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-600 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 lg:p-12 text-center">
            {/* Logo y título principal */}
            <div className="mb-10">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full mb-4">
                  <i className="fas fa-store text-white text-3xl"></i>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                AUTOPAGO 
                <span className="text-green-600">ACAUCAB</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Sistema de compra autoguiada para tienda física
              </p>
            </div>

            {/* Características del sistema */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <i className="fas fa-bolt text-green-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Rápido y Fácil</h3>
                <p className="text-gray-600">
                  Identifícate, selecciona productos y paga en pocos pasos
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <i className="fas fa-shield-alt text-green-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Seguro</h3>
                <p className="text-gray-600">
                  Transacciones protegidas con múltiples métodos de pago
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <i className="fas fa-clock text-green-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Disponible 24/7</h3>
                <p className="text-gray-600">
                  Compra cuando quieras, el sistema siempre está activo
                </p>
              </div>
            </div>

            {/* Botón de inicio */}
            <div className="mb-8">
              <button
                onClick={onIniciarCompra}
                className="inline-flex items-center px-12 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <i className="fas fa-shopping-cart mr-3"></i>
                EMPEZAR COMPRA
              </button>
            </div>

            {/* Instrucciones del proceso */}
            <div className="bg-green-50 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle text-green-600 text-xl mt-1"></i>
                </div>
                <div className="ml-4 text-left">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">Proceso de compra:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                      <span className="text-green-700 font-medium">Identifícate</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                      <span className="text-green-700 font-medium">Agrega productos</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                      <span className="text-green-700 font-medium">Revisa tu carrito</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                      <span className="text-green-700 font-medium">Realiza el pago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Métodos de pago disponibles */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                <i className="fas fa-credit-card mr-2 text-green-600"></i>
                Métodos de Pago Disponibles
              </h4>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-money-bill-wave text-green-500 mr-2"></i>
                  <span>Efectivo</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-credit-card text-blue-500 mr-2"></i>
                  <span>Tarjeta</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-money-check text-purple-500 mr-2"></i>
                  <span>Cheque</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-star text-yellow-500 mr-2"></i>
                  <span>Puntos</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-500 flex items-center justify-center">
                <i className="fas fa-headset mr-2"></i>
                ¿Necesitas ayuda? Solicita asistencia a nuestro personal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PantallaInicio; 