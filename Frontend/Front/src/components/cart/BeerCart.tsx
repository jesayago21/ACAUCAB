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

  /** Calcular puntos de fidelidad totales */
  const totalFidelityPoints = items.reduce((sum, item) => sum + item.quantity, 0);

  /** Calcular cantidad total de productos */
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="mb-4">
          <i className="fas fa-shopping-cart text-gray-400 text-4xl"></i>
        </div>
        <h3 className="text-gray-600 font-medium mb-2">Tu carrito está vacío</h3>
        <p className="text-gray-500 text-sm">
          Agrega productos para comenzar tu compra
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header del carrito */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fas fa-shopping-cart mr-2 text-green-600"></i>
            Tu Carrito
          </h3>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      </div>

      {/* Items del carrito */}
      <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
        {items.map((item: CartItem) => (
          <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            {/* Imagen del producto (placeholder) */}
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-beer text-green-600"></i>
            </div>

            {/* Información del producto */}
            <div className="flex-grow min-w-0">
              <h4 className="text-sm font-medium text-gray-800 truncate">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500">
                ${item.price.toFixed(2)} c/u
              </p>
            </div>

            {/* Controles de cantidad */}
            <div className="flex items-center space-x-2">
              <button 
                className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
              >
                <i className="fas fa-minus text-xs text-gray-600"></i>
              </button>
              
              <span className="w-8 text-center text-sm font-medium text-gray-800">
                {item.quantity}
              </span>
              
              <button 
                className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <i className="fas fa-plus text-xs text-green-600"></i>
              </button>
            </div>

            {/* Precio total del item */}
            <div className="text-right min-w-0">
              <p className="text-sm font-semibold text-gray-800">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button 
                className="text-red-500 hover:text-red-700 transition-colors mt-1"
                onClick={() => removeFromCart(item.id)}
                title="Eliminar producto"
              >
                <i className="fas fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen del carrito */}
      <div className="p-4 border-t bg-gray-50">
        {/* Puntos de fidelidad */}
        <div className="flex items-center justify-between mb-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-500 mr-2"></i>
            <span className="text-sm font-medium text-yellow-800">
              Puntos de fidelidad
            </span>
          </div>
          <span className="text-sm font-bold text-yellow-800">
            +{totalFidelityPoints} puntos
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-800">Total:</span>
          <span className="text-xl font-bold text-green-600">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Botón de checkout (opcional) */}
        {showCheckoutButton && (
          <button 
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105"
            onClick={onCheckout}
          >
            <i className="fas fa-credit-card mr-2"></i>
            Proceder al Pago
          </button>
        )}
      </div>
    </div>
  );
};

export default BeerCart; 