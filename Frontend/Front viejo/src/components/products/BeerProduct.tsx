import React from 'react';
import { addToCart } from '../../store/cartStore';
import type { Beer } from '../../types/beer';

interface BeerProductProps extends Beer {
  onAddToCart?: () => void;
  original_price?: number;
  tiene_oferta?: boolean;
  porcentaje_descuento?: number;
}

/** Componente para mostrar un producto de cerveza con ofertas */
const BeerProduct: React.FC<BeerProductProps> = ({
  id,
  thumb_src,
  thumb_alt,
  title,
  description,
  price,
  original_price,
  stock,
  tiene_oferta = false,
  porcentaje_descuento,
  onAddToCart
}) => {
  const isOutOfStock = stock <= 0;

  /** Manejar clic en agregar al carrito */
  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart({
        id,
        title,
        price,
        thumb_src,
        thumb_alt,
        description,
        stock
      });
      onAddToCart?.();
    }
  };

  /** Renderizar badge de oferta */
  const renderOfertaBadge = () => {
    if (!tiene_oferta || !porcentaje_descuento) return null;

    return (
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          -{porcentaje_descuento}%
        </div>
      </div>
    );
  };

  /** Renderizar precios */
  const renderPrecios = () => {
    return (
      <div className="mb-4">
        {tiene_oferta && original_price ? (
          <div className="space-y-1">
            {/* Precio original tachado */}
            <div className="text-gray-500 text-sm">
              <span className="line-through font-medium">${original_price.toFixed(2)}</span>
            </div>
            {/* Precio en oferta en rojo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-red-600">
                ${price.toFixed(2)}
              </span>
              <span className="text-green-600 text-sm font-medium">
                ¡Ahorra ${(original_price - price).toFixed(2)}!
              </span>
            </div>
          </div>
        ) : (
          <div className="text-2xl font-bold text-green-600">
            ${price.toFixed(2)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Contenedor de imagen con badge de oferta */}
      <div className="relative overflow-hidden">
        {renderOfertaBadge()}
        <img
          src={thumb_src}
          alt={thumb_alt}
          className="w-full h-32 object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            // Fallback a imagen por defecto si no se encuentra la imagen
            const target = e.target as HTMLImageElement;
            if (target.src.includes('beer-sixpack')) {
              target.src = '/images/products/beer-sixpack-default.jpeg';
            } else {
              target.src = '/images/products/beer-unit-default.jpg';
            }
          }}
        />
        {/* Overlay en estado agotado */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
            <div className="text-white text-center">
              <i className="fas fa-ban text-2xl mb-2"></i>
              <p className="font-semibold text-sm">Agotado</p>
            </div>
          </div>
        )}
      </div>

      {/* Contenido del producto */}
      <div className="p-4">
        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>

        {/* Precios */}
        {renderPrecios()}

        {/* Stock disponible */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            Stock: {stock} unidades
          </span>
          {stock <= 5 && stock > 0 && (
            <span className="text-orange-500 text-sm font-medium">
              <i className="fas fa-exclamation-triangle mr-1"></i>
              ¡Últimas unidades!
            </span>
          )}
        </div>

        {/* Botón de acción */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 transform ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 shadow-md hover:shadow-lg active:scale-95'
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