/** Componente principal de la aplicación de autopago */
import React, { useState, useEffect } from 'react';
import { useCarrito } from '../hooks/useCarrito';
import IdentificacionCliente from './IdentificacionCliente';
import RegistroCliente from './RegistroCliente';
import VistaPrincipalCompra from './VistaPrincipalCompra';
import MetodosPago from './MetodosPago';
import PantallaExito from './PantallaExito';

import type { ClienteNatural, ClienteJuridico } from '../types/api';
import type { Usuario, LoginResponse } from '../types/auth';
import LoginForm from './admin/LoginForm';
import AdminDashboard from './admin/AdminDashboard';
import { authStorage } from '../services/authService';

/** Estados posibles de la aplicación */
type EstadoApp = 
  | 'bienvenida'
  | 'identificacion' 
  | 'registro' 
  | 'compra' 
  | 'pago' 
  | 'exitoso'
  | 'login'
  | 'admin';

/** Componente de pantalla de bienvenida */
function PantallaBienvenida({ onIniciar, onMostrarLogin }: { onIniciar: () => void; onMostrarLogin: () => void }) {
  return (
    <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-4 relative">
      {/* Botón de login discreto en esquina superior derecha */}
      <button
        onClick={onMostrarLogin}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 opacity-50 hover:opacity-100"
        title="Acceso administrativo"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Logo/Marca */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#3D4A3A] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#3D4A3A] mb-2">ACAUCAB</h1>
          <p className="text-lg text-[#A1B5A0] font-medium">Sistema de Autopago</p>
          <p className="text-sm text-gray-600">Distribuidora de Cervezas Artesanales</p>
        </div>

        {/* Descripción */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#2C2C2C] mb-4">
            ¡Bienvenido al Sistema de Autopago!
          </h2>
          <p className="text-gray-600 mb-4">
            Realice su compra de manera rápida y sencilla. 
            Explore nuestro catálogo de cervezas artesanales y complete su pago de forma segura.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-green-800 mb-2">Características:</h3>
            <ul className="text-xs text-green-700 space-y-1 text-left">
              <li>✓ Catálogo completo de productos</li>
              <li>✓ Múltiples métodos de pago</li>
              <li>✓ Sistema de puntos de fidelidad</li>
              <li>✓ Proceso rápido y seguro</li>
            </ul>
          </div>
        </div>

        {/* Botón de inicio */}
        <button
          onClick={onIniciar}
          className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center space-x-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Iniciar Compra</span>
        </button>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Toque la pantalla para comenzar</p>
          <p className="mt-1">Sistema operativo 24/7</p>
        </div>
      </div>
    </div>
  );
}

export default function AutopagoApp() {
  const [estado, setEstado] = useState<EstadoApp>('bienvenida');
  const [cliente, setCliente] = useState<ClienteNatural | ClienteJuridico | null>(null);
  const [documentoRegistro, setDocumentoRegistro] = useState<{numero: string, tipo: 'V' | 'J'} | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const carrito = useCarrito();

  /** Verificar sesión activa al cargar */
  useEffect(() => {
    const usuarioGuardado = authStorage.getUser();
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
      setEstado('admin');
    }
  }, []);

  /** Manejar inicio de la aplicación */
  const handleIniciarApp = () => {
    setEstado('identificacion');
  };

  /** Manejar cliente existente encontrado */
  const handleClienteExistente = (clienteData: ClienteNatural | ClienteJuridico) => {
    setCliente(clienteData);
    setEstado('compra');
  };

  /** Manejar necesidad de registro */
  const handleNecesitaRegistro = (documento: string, tipoDocumento: 'V' | 'J') => {
    setDocumentoRegistro({ numero: documento, tipo: tipoDocumento });
    setEstado('registro');
  };

  /** Manejar registro exitoso */
  const handleRegistroExitoso = (clienteData: ClienteNatural | ClienteJuridico) => {
    setCliente(clienteData);
    setEstado('compra');
  };

  /** Manejar proceder al pago */
  const handleProcederPago = () => {
    if (carrito.items.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }
    setEstado('pago');
  };

  /** Manejar pago exitoso */
  const handlePagoExitoso = async (clienteActualizado?: ClienteNatural | ClienteJuridico) => {
    // Si recibimos un cliente actualizado, usarlo directamente
    if (clienteActualizado) {
      setCliente(clienteActualizado);
    } else if (cliente && cliente.clave) {
      // Si no recibimos cliente actualizado, intentar obtenerlo del servidor
      try {
        const { clienteService } = await import('../services/api');
        const puntosActualizados = await clienteService.obtenerPuntosCliente(cliente.clave);
        
        // Actualizar el estado del cliente con los nuevos puntos
        setCliente(prevCliente => {
          if (!prevCliente) return null;
          return {
            ...prevCliente,
            puntos_acumulados: puntosActualizados.puntos_disponibles
          };
        });
      } catch (error) {
        console.error('Error actualizando puntos del cliente:', error);
        // Continuar sin actualizar puntos si hay error
      }
    }
    
    setEstado('exitoso');
  };

  /** Manejar nueva compra */
  const handleNuevaCompra = () => {
    carrito.limpiarCarrito();
    setEstado('compra');
  };

  /** Manejar salir/reiniciar */
  const handleSalir = () => {
    carrito.limpiarCarrito();
    setCliente(null);
    setEstado('bienvenida');
  };

  /** Manejar mostrar login */
  const handleMostrarLogin = () => {
    setEstado('login');
  };

  /** Manejar login exitoso */
  const handleLoginExitoso = (response: LoginResponse) => {
    if (response.user) {
      setUsuario(response.user);
      authStorage.saveUser(response.user);
      setEstado('admin');
    }
  };

  /** Manejar logout */
  const handleLogout = () => {
    setUsuario(null);
    authStorage.removeUser();
    setEstado('bienvenida');
  };

  /** Manejar volver desde login */
  const handleVolverDesdeLogin = () => {
    setEstado('bienvenida');
  };

  /** Manejar volver a pantalla anterior */
  const handleVolver = () => {
    switch (estado) {
      case 'identificacion':
        setEstado('bienvenida');
        break;
      case 'registro':
        setEstado('identificacion');
        break;
      case 'compra':
        setEstado('identificacion');
        setCliente(null);
        carrito.limpiarCarrito();
        break;
      case 'pago':
        setEstado('compra');
        break;
      default:
        setEstado('bienvenida');
    }
  };

  /** Renderizar componente según estado actual */
  const renderizarPantalla = () => {
    switch (estado) {
      case 'bienvenida':
        return (
          <PantallaBienvenida 
            onIniciar={handleIniciarApp} 
            onMostrarLogin={handleMostrarLogin}
          />
        );

      case 'identificacion':
        return (
          <IdentificacionCliente
            onClienteExistente={handleClienteExistente}
            onClienteNoExiste={handleNecesitaRegistro}
          />
        );

      case 'registro':
        return (
          <RegistroCliente
            onRegistroExitoso={handleRegistroExitoso}
            onVolver={handleVolver}
            documentoData={documentoRegistro || undefined}
          />
        );

      case 'compra':
        if (!cliente) {
          setEstado('identificacion');
          return null;
        }
        return (
          <VistaPrincipalCompra
            cliente={cliente}
            carrito={carrito}
            onProcederPago={handleProcederPago}
            onVolver={handleVolver}
          />
        );

      case 'pago':
        if (!cliente) {
          setEstado('identificacion');
          return null;
        }
        return (
          <MetodosPago
            cliente={cliente}
            carrito={carrito}
            onPagoExitoso={handlePagoExitoso}
            onVolver={handleVolver}
          />
        );

      case 'exitoso':
        if (!cliente) {
          setEstado('bienvenida');
          return null;
        }
        return (
          <PantallaExito
            cliente={cliente}
            carrito={carrito}
            onNuevaCompra={handleNuevaCompra}
            onSalir={handleSalir}
          />
        );

      case 'login':
        return (
          <LoginForm
            onLoginSuccess={handleLoginExitoso}
            onVolver={handleVolverDesdeLogin}
          />
        );

      case 'admin':
        if (!usuario) {
          setEstado('bienvenida');
          return null;
        }
        return (
          <AdminDashboard
            usuario={usuario}
            onLogout={handleLogout}
          />
        );

      default:
        return (
          <PantallaBienvenida 
            onIniciar={handleIniciarApp} 
            onMostrarLogin={handleMostrarLogin}
          />
        );
    }
  };

  return (
    <div className="autopago-app">
      {renderizarPantalla()}
      
      {/* Indicador de desarrollo (solo visible en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          Estado: {estado} | Cliente: {cliente ? 'Sí' : 'No'} | Carrito: {carrito.totalItems}
        </div>
      )}
    </div>
  );
} 