/** Componente para mostrar confirmación de pago exitoso */
import React from 'react';
import type { ClienteNatural, ClienteJuridico } from '../types/api';
import type { UseCarritoReturn } from '../hooks/useCarrito';

interface PantallaExitoProps {
  cliente: ClienteNatural | ClienteJuridico;
  carrito: UseCarritoReturn;
  onNuevaCompra: () => void;
  onSalir: () => void;
}

export default function PantallaExito({ 
  cliente, 
  carrito, 
  onNuevaCompra, 
  onSalir 
}: PantallaExitoProps) {
  
  /** Formatear precio */
  const formatearPrecio = (precio: number): string => {
    return precio.toLocaleString('es-VE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  /** Obtener nombre del cliente */
  const nombreCliente = cliente.tipo === 'natural' 
    ? `${cliente.primer_nombre} ${cliente.primer_apellido}`
    : cliente.razon_social;

  /** Generar número de factura simulado */
  const numeroFactura = `FAC-${Date.now().toString().slice(-8)}`;

  /** Manejar impresión */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-4 print:bg-white">
      <div className="printable-invoice max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Encabezado de Factura */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Factura</h1>
              <p className="text-gray-500">ACAUCAB Distribuidora</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Factura N°: <span className="font-semibold">{numeroFactura}</span></p>
              <p className="text-sm text-gray-600">Fecha: <span className="font-semibold">{new Date().toLocaleDateString('es-VE')}</span></p>
            </div>
          </div>
        </div>

        {/* Datos del Cliente */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-sm font-bold uppercase text-gray-500 mb-4">Facturar a</h2>
          <p className="font-semibold text-gray-800">{nombreCliente}</p>
          <p className="text-gray-600">{cliente.rif}</p>
          <p className="text-gray-600">{cliente.tipo === 'natural' ? cliente.direccion_habitacion : cliente.direccion_fiscal}</p>
        </div>

        {/* Tabla de Productos */}
        <div className="p-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 text-sm font-semibold text-gray-600">Descripción</th>
                <th className="py-2 text-sm font-semibold text-gray-600 text-center">Cant.</th>
                <th className="py-2 text-sm font-semibold text-gray-600 text-right">Precio Unit.</th>
                <th className="py-2 text-sm font-semibold text-gray-600 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrito.items.map((item) => (
                <tr key={item.producto.id} className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-medium text-gray-800">{item.producto.nombre}</p>
                    <p className="text-xs text-gray-500">{item.producto.nombre_presentacion}</p>
                  </td>
                  <td className="py-4 text-center text-gray-600">{item.cantidad}</td>
                  <td className="py-4 text-right text-gray-600">Bs. {formatearPrecio(item.precio_unitario)}</td>
                  <td className="py-4 text-right font-semibold text-gray-800">Bs. {formatearPrecio(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales y Puntos */}
        <div className="p-8 bg-gray-50">
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-800">Bs. {formatearPrecio(carrito.totalPrecio)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IVA (0%):</span>
                <span className="font-semibold text-gray-800">Bs. 0,00</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t-2 pt-3 mt-3 border-gray-200">
                <span className="text-gray-800">Total a Pagar:</span>
                <span className="text-[#3D4A3A]">Bs. {formatearPrecio(carrito.totalPrecio)}</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-lg font-semibold text-green-600">¡Ha ganado {carrito.puntosGanados} puntos con esta compra!</p>
            <p className="text-sm text-gray-600">Total de puntos disponibles: {cliente.puntos_acumulados}</p>
          </div>
        </div>

        {/* Footer de Factura */}
        <div className="p-8 text-center text-xs text-gray-500">
          <p>Gracias por su compra. Conserve esta factura para cualquier reclamo.</p>
          <p>ACAUCAB Distribuidora de Cervezas Artesanales</p>
        </div>
      </div>

      {/* Botones de Acción (No se imprimen) */}
      <div className="no-print max-w-2xl w-full mt-6 space-y-3">
        <button
          onClick={handlePrint}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-9A2 2 0 1112 5a2 2 0 015 2z" /></svg>
          <span>Imprimir Factura</span>
        </button>
        <button
          onClick={onNuevaCompra}
          className="w-full bg-[#3D4A3A] hover:bg-[#2C3631] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H16" /></svg>
          <span>Realizar Nueva Compra</span>
        </button>
        <button
          onClick={onSalir}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Finalizar Sesión</span>
        </button>
      </div>
    </div>
  );
} 