import React from 'react';
import type { Beer } from '../../types/beer';
import { addToCart } from '../../store/cartStore';

interface BeerProductProps extends Beer {
  onAddToCart?: (id: string) => void;
}

const BeerProduct: React.FC<BeerProductProps> = ({
  id,
  thumb_src,
  thumb_alt,
  title,
  description,
  price,
  stock,
  onAddToCart
}) => {
  const handleAddToCart = () => {
    const beer: Beer = {
      id,
      thumb_src,
      thumb_alt,
      title,
      description,
      price,
      stock
    };
    addToCart(beer);
    onAddToCart?.(id);
  };

  /** Determinar el estado del producto */
  const isOutOfStock = stock === 0;
  const isLowStock = stock <= 5 && stock > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden h-full flex flex-col">
      {/* Imagen del producto */}
      <div className="relative">
        <img
          src={thumb_src}
          className="w-full h-48 object-cover"
          alt={thumb_alt}
        />
        
        {/* Badges de estado */}
        {isLowStock && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              <i className="fas fa-exclamation-triangle mr-1"></i>
              ¡Últimas {stock}!
            </span>
          </div>
        )}
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              <i className="fas fa-times-circle mr-2"></i>
              AGOTADO
            </span>
          </div>
        )}

        {/* Overlay con precio destacado */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="text-white text-right">
            <span className="text-2xl font-bold">${price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Contenido del producto */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Título del producto */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm flex-grow mb-4 line-clamp-3">
          {description}
        </p>

        {/* Información de stock */}
        <div className="flex items-center mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <i className="fas fa-boxes mr-2"></i>
            <span>Stock: </span>
            <span className={`ml-1 font-semibold ${
              isOutOfStock ? 'text-red-500' : 
              isLowStock ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {stock} unidades
            </span>
          </div>
        </div>

        {/* Botón de acción */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 transform ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95'
          }`}
        >
          {isOutOfStock ? (
            <>
              <i className="fas fa-ban mr-2"></i>
              Producto Agotado
            </>
          ) : (
            <>
              <i className="fas fa-cart-plus mr-2"></i>
              Agregar al Carrito
            </>
          )}
        </button>


      </div>
    </div>
  );
};

export default BeerProduct; 