// PantallaInicio.tsx

import React from 'react';

// --- SUB-COMPONENTES REUTILIZABLES ---

// Componente para cada característica (Rápido, Seguro, 24/7)
const FeatureCard = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
  <div className="text-center p-6 border border-secondary rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary hover:-translate-y-1">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-background rounded-full mb-5">
      <i className={`fas ${icon} text-primary text-2xl`}></i>
    </div>
    <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">
      {children}
    </p>
  </div>
);

// Componente para cada paso del proceso de compra
const ProcessStep = ({ number, text }: { number: number; text: string }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <span className="text-primary font-medium">{text}</span>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

interface PantallaInicioProps {
  onIniciarCompra: () => void;
}

const PantallaInicio: React.FC<PantallaInicioProps> = ({ onIniciarCompra }) => {
  // Datos para los componentes, haciendo el JSX más limpio
  const features = [
    { icon: 'fa-bolt', title: 'Rápido y Fácil', description: 'Identifícate, selecciona productos y paga en pocos pasos.' },
    { icon: 'fa-shield-alt', title: 'Seguro', description: 'Transacciones protegidas con múltiples métodos de pago.' },
    { icon: 'fa-clock', title: 'Disponible 24/7', description: 'Compra cuando quieras, el sistema siempre está activo.' },
  ];

  const steps = [
    { number: 1, text: 'Identifícate' },
    { number: 2, text: 'Agrega productos' },
    { number: 3, text: 'Revisa tu carrito' },
    { number: 4, text: 'Realiza el pago' },
  ];

  return (
    // El fondo se controla desde la página de Astro, como acordamos.
    // Este div asegura que el contenido no exceda un ancho máximo y esté centrado.
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in">
        <div className="p-8 sm:p-12 md:p-16">
          
          {/* Encabezado */}
          <header className="text-center mb-12">
            <div className="inline-block bg-gradient-to-br from-secondary to-primary p-2 rounded-full mb-6">
              <div className="bg-white p-4 rounded-full">
                <i className="fas fa-store text-primary text-4xl"></i>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
              Autopago <span className="text-primary">ACAUCAB</span>
            </h1>
            <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
              Bienvenido al sistema de compra autoguiada para nuestra tienda.
            </p>
          </header>

          {/* Sección de Características */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title}>
                {feature.description}
              </FeatureCard>
            ))}
          </section>

          {/* Botón Principal (Call to Action) */}
          <section className="text-center mb-16">
            <button
              onClick={onIniciarCompra}
              className="px-16 py-4 bg-primary text-white text-xl font-bold rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-accent"
            >
              <i className="fas fa-shopping-cart mr-3"></i>
              Comenzar Compra
            </button>
          </section>

          {/* Guía del Proceso y Métodos de Pago */}
          <section className="bg-background rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Columna Izquierda: Proceso */}
              <div>
                <h4 className="text-xl font-bold text-primary mb-6 flex items-center">
                  <i className="fas fa-shoe-prints mr-3 transform -rotate-45"></i>
                  Sigue estos 4 sencillos pasos
                </h4>
                <div className="space-y-4">
                  {steps.map(step => <ProcessStep key={step.number} {...step} />)}
                </div>
              </div>

              {/* Columna Derecha: Métodos de Pago */}
              <div>
                 <h4 className="text-xl font-bold text-primary mb-6 flex items-center">
                  <i className="fas fa-credit-card mr-3"></i>
                  Aceptamos
                </h4>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-700">
                    <span className="font-medium">Efectivo</span>
                    <span className="font-medium">Tarjeta de Débito/Crédito</span>
                    <span className="font-medium">Pago Móvil</span>
                    <span className="font-medium">Puntos Acumulados</span>
                </div>
              </div>

            </div>
          </section>

        </div>
        
        {/* Footer */}
        <footer className="bg-gray-50 text-center p-6 border-t border-gray-200">
          <p className="text-gray-600">
            <i className="fas fa-headset mr-2 text-accent"></i>
            ¿Necesitas ayuda? Solicita asistencia a nuestro personal.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PantallaInicio;