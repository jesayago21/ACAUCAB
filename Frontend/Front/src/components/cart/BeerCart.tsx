import React from 'react';
import { useStore } from '@nanostores/react';
import { cartStore, updateQuantity, removeFromCart } from '../../store/cartStore';
import type { CartItem, CartState } from '../../types/beer';

interface BeerCartProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

const BeerCart: React.FC<BeerCartProps> = ({
  showCheckoutButton = false,
  onCheckout
}) => {
  const cartState = useStore<CartState>(cartStore);
  const { items, total } = cartState;

  // Calcular puntos de fidelidad totales
  // Asumiendo 1 punto por cada unidad de producto
  const totalFidelityPoints = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calcular cantidad total de productos
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // --- Estado de carrito vacío ---
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
        <div className="mb-6 text-gray-400">
          <i className="fas fa-shopping-cart text-5xl"></i> {/* Icono más grande */}
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Tu carrito está vacío</h3>
        <p className="text-gray-500 text-base leading-relaxed">
          Parece que aún no has agregado ninguna cerveza. ¡Explora nuestro catálogo y llena tu carrito!
        </p>
        {/* Podrías añadir un botón aquí para ir a la tienda */}
        {/*
        <button className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Ir de compras
        </button>
        */}
      </div>
    );
  }

  // --- Contenido del carrito con productos ---
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Encabezado del carrito */}
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <i className="fas fa-shopping-basket mr-3 text-green-600"></i> {/* Icono cambiado */}
            Tu Carrito
          </h3>
          <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full animate-pulse-once"> {/* Efecto de pulso suave */}
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      </div>

      {/* Lista de Items del carrito */}
      <div className="p-5 space-y-4 max-h-96 overflow-y-auto custom-scrollbar"> {/* Altura máxima y scrollbar personalizado */}
        {items.map((item: CartItem) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            {/* Imagen del producto (placeholder) - Si tienes una URL de imagen real, úsala aquí */}
            <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-green-300 rounded-lg flex items-center justify-center flex-shrink-0 shadow-inner">
              {/* Reemplazar con <img src={item.imageUrl} alt={item.title} /> si tienes URLs */}
              <i className="fas fa-beer text-green-700 text-2xl"></i>
            </div>

            {/* Información del producto */}
            <div className="flex-grow min-w-0">
              <h4 className="text-base font-semibold text-gray-800 truncate mb-1">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600">
                ${item.price.toFixed(2)} c/u
              </p>
            </div>

            {/* Controles de cantidad */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} // No permitir cantidad 0 con el botón de menos
                aria-label={`Reducir cantidad de ${item.title}`}
              >
                <i className="fas fa-minus text-sm text-gray-700"></i>
              </button>

              <span className="w-10 text-center text-base font-semibold text-gray-800">
                {item.quantity}
              </span>

              <button
                className="w-8 h-8 rounded-full bg-green-200 hover:bg-green-300 active:bg-green-400 flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label={`Aumentar cantidad de ${item.title}`}
              >
                <i className="fas fa-plus text-sm text-green-700"></i>
              </button>
            </div>

            {/* Precio total del item y botón de eliminar */}
            <div className="text-right flex flex-col items-end flex-shrink-0">
              <p className="text-base font-bold text-gray-900 mb-1">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                className="text-red-500 hover:text-red-700 transition-colors duration-150 text-sm flex items-center gap-1"
                onClick={() => removeFromCart(item.id)}
                title={`Eliminar ${item.title} del carrito`}
                aria-label={`Eliminar ${item.title}`}
              >
                <i className="fas fa-trash-alt text-xs"></i>
                <span>Eliminar</span> {/* Texto para mayor claridad */}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen del carrito */}
      <div className="p-5 border-t border-gray-200 bg-gray-50">
        {/* Puntos de fidelidad */}
        <div className="flex items-center justify-between mb-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300 shadow-sm">
          <div className="flex items-center gap-2">
            <i className="fas fa-star text-yellow-500 text-lg"></i>
            <span className="text-sm font-medium text-yellow-800">
              Puntos de Fidelidad
            </span>
          </div>
          <span className="text-base font-bold text-yellow-800">
            +{totalFidelityPoints} puntos
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-xl font-bold text-gray-900">Total:</span>
          <span className="text-3xl font-extrabold text-green-700">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Botón de checkout (opcional) */}
        {showCheckoutButton && (
          <button
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-xl shadow-lg
                       hover:from-green-700 hover:to-green-800 hover:shadow-xl
                       transition-all duration-300 transform hover:scale-102
                       focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            onClick={onCheckout}
          >
            <i className="fas fa-credit-card mr-3"></i>
            Proceder al Pago
          </button>
        )}
      </div>
    </div>
  );
};

export default BeerCart;