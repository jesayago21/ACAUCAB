import React, { useState } from 'react';
import type { Cliente, RegistroClienteProps } from '../../types/autopago';

/** Componente para registro de nuevos clientes */
const RegistroCliente: React.FC<RegistroClienteProps> = ({ 
  cedulaRif, 
  onClienteRegistrado, 
  onVolver,
  onError 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [guardando, setGuardando] = useState(false);

  /** Manejo de cambios en el formulario */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /** Validación del formulario */
  const validarFormulario = (): boolean => {
    if (!formData.nombre.trim()) {
      onError('El nombre es obligatorio');
      return false;
    }
    if (!formData.apellido.trim()) {
      onError('El apellido es obligatorio');
      return false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      onError('El email no tiene un formato válido');
      return false;
    }
    if (formData.telefono && !/^[\d\s\-\+\(\)]{8,15}$/.test(formData.telefono)) {
      onError('El teléfono no tiene un formato válido');
      return false;
    }
    return true;
  };

  /** Manejo del envío del formulario */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setGuardando(true);

    try {
      // Simular guardado en base de datos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      /** Nuevo cliente registrado */
      const nuevoCliente: Cliente = {
        cedula_rif: cedulaRif,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim() || undefined,
        telefono: formData.telefono.trim() || undefined,
        direccion: formData.direccion.trim() || undefined,
        fechaRegistro: new Date()
      };

      onClienteRegistrado(nuevoCliente);
    } catch (error) {
      onError('Error al registrar el cliente. Intente nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    <i className="fas fa-user-plus mr-3"></i>
                    Registro de Cliente
                  </h2>
                  <p className="text-green-100">
                    Complete sus datos para continuar con la compra
                  </p>
                </div>
                <button
                  onClick={onVolver}
                  className="text-white hover:text-green-200 transition-colors"
                  disabled={guardando}
                >
                  <i className="fas fa-times text-2xl"></i>
                </button>
              </div>
            </div>

            {/* Información de cédula */}
            <div className="px-8 py-4 bg-green-50 border-b">
              <div className="flex items-center">
                <i className="fas fa-id-card text-green-600 mr-3"></i>
                <span className="text-green-800 font-semibold">Cédula/RIF: {cedulaRif}</span>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Ingrese su nombre"
                    disabled={guardando}
                    required
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Ingrese su apellido"
                    disabled={guardando}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="ejemplo@email.com"
                    disabled={guardando}
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="+58 414 123 4567"
                    disabled={guardando}
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="mt-6">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <textarea
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Dirección completa (opcional)"
                  disabled={guardando}
                />
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  type="button"
                  onClick={onVolver}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={guardando}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Volver
                </button>
                
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  disabled={guardando || !formData.nombre.trim() || !formData.apellido.trim()}
                >
                  {guardando ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-check mr-2"></i>
                      Registrar y Continuar
                    </>
                  )}
                </button>
              </div>

              {/* Información adicional */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h6 className="font-semibold text-green-800 mb-2">
                  <i className="fas fa-info-circle mr-2"></i>
                  Información de Privacidad
                </h6>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Sus datos están protegidos según la LOPD</li>
                  <li>• Solo se usan para mejorar su experiencia de compra</li>
                  <li>• Puede actualizar su información en cualquier momento</li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroCliente;
