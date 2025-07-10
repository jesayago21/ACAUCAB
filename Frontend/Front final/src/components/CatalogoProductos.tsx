/** Componente principal del catálogo de productos */
import React, { useState, useEffect } from 'react';
import { useCarrito } from '../hooks/useCarrito';
import VistaPrincipalCompra from './VistaPrincipalCompra';
import MetodosPagoEcommerce from './MetodosPagoEcommerce';
import PantallaExito from './PantallaExito';
import { authStorage } from '../services/authService';
import { ecommerceService, clienteService } from '../services/api';
import type { ClienteNatural, ClienteJuridico } from '../types/api';
import type { Usuario } from '../types/auth';

type EstadoCatalogo = 'catalogo' | 'pago' | 'exitoso';

export default function CatalogoProductos() {
  const [estado, setEstado] = useState<EstadoCatalogo>('catalogo');
  const [cliente, setCliente] = useState<ClienteNatural | ClienteJuridico | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const carrito = useCarrito();

  /** Cargar datos del usuario y cliente al iniciar */
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const usuarioGuardado = authStorage.getUser();
        
        if (!usuarioGuardado) {
          // Si no hay usuario, redirigir al login
          window.location.href = '/login';
          return;
        }

        setUsuario(usuarioGuardado);

        // Si el usuario es un cliente, cargar sus datos completos
        if (usuarioGuardado.tipo_entidad === 'cliente' && usuarioGuardado.entidad) {
          // La entidad del cliente tiene la información completa
          const entidadCliente = usuarioGuardado.entidad as any;
          if (entidadCliente.clave) {
            // Crear objeto cliente con los datos de la entidad
            const clienteData = entidadCliente as any;
            
            setCliente(clienteData);
          }
        } else if (usuarioGuardado.tipo_entidad !== 'cliente') {
          // Si no es cliente, redirigir al admin
          window.location.href = '/admin';
          return;
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosUsuario();
  }, []);

  /** Manejar logout */
  const handleLogout = () => {
    authStorage.removeUser();
    carrito.limpiarCarrito();
    window.location.href = '/home';
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
    if (clienteActualizado) {
      setCliente(clienteActualizado);
    } else if (cliente && cliente.clave) {
      try {
        const puntosActualizados = await clienteService.obtenerPuntosCliente(cliente.clave);
        setCliente(prevCliente => {
          if (!prevCliente) return null;
          return {
            ...prevCliente,
            puntos_acumulados: puntosActualizados.puntos_disponibles
          };
        });
      } catch (error) {
        console.error('Error actualizando puntos del cliente:', error);
      }
    }
    
    setEstado('exitoso');
  };

  /** Manejar nueva compra */
  const handleNuevaCompra = () => {
    carrito.limpiarCarrito();
    setEstado('catalogo');
  };

  /** Manejar volver */
  const handleVolver = () => {
    if (estado === 'pago') {
      setEstado('catalogo');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D4A3A] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Error al cargar los datos del cliente</p>
          <button
            onClick={handleLogout}
            className="bg-[#3D4A3A] hover:bg-[#2C3631] text-white px-4 py-2 rounded-lg transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header siempre visible */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/home" className="flex items-center">
                <div className="w-10 h-10 bg-[#3D4A3A] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h1 className="ml-3 text-xl font-bold text-[#3D4A3A]">ACAUCAB</h1>
              </a>
            </div>

            {/* Usuario info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {cliente.tipo === 'natural' 
                    ? `${cliente.primer_nombre} ${cliente.primer_apellido}`
                    : cliente.razon_social
                  }
                </p>
                <p className="text-xs text-gray-500">
                  {cliente.puntos_acumulados || 0} puntos
                </p>
              </div>
              
              {/* Carrito resumen */}
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {carrito.totalItems} items
                </span>
              </div>

              {/* Botón logout */}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 transition"
                title="Cerrar sesión"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1">
        {estado === 'catalogo' && (
          <VistaPrincipalCompra
            cliente={cliente}
            carrito={carrito}
            onProcederPago={handleProcederPago}
            onVolver={() => window.location.href = '/home'}
          />
        )}

        {estado === 'pago' && usuario && (
          <MetodosPagoEcommerce
            cliente={cliente}
            usuario_id={usuario.id}
            carrito={carrito}
            onPagoExitoso={() => handlePagoExitoso()}
            onVolver={handleVolver}
          />
        )}

        {estado === 'exitoso' && (
          <PantallaExito
            cliente={cliente}
            carrito={carrito}
            onNuevaCompra={handleNuevaCompra}
            onSalir={handleLogout}
          />
        )}
      </main>
    </div>
  );
} 