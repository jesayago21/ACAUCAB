import { atom } from 'nanostores';
import type { Beer, CartItem, CartState } from '../types/beer';

/** Estado inicial del carrito */
const initialState: CartState = {
  items: [],
  total: 0
};

/** Store principal del carrito usando nanostores */
export const cartStore = atom<CartState>(initialState);

/** Agregar producto al carrito */
export const addToCart = (beer: Beer) => {
  const currentState = cartStore.get();
  const existingItem = currentState.items.find((item: CartItem) => item.id === beer.id);

  if (existingItem) {
    // Si el producto ya existe, incrementar cantidad
    const updatedItems = currentState.items.map((item: CartItem) =>
      item.id === beer.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    cartStore.set({
      items: updatedItems,
      total: calculateTotal(updatedItems)
    });
  } else {
    // Si es nuevo producto, agregarlo con cantidad 1
    const newItem: CartItem = { ...beer, quantity: 1 };
    const updatedItems = [...currentState.items, newItem];
    cartStore.set({
      items: updatedItems,
      total: calculateTotal(updatedItems)
    });
  }
};

/** Actualizar cantidad de un producto específico */
export const updateQuantity = (id: string, quantity: number) => {
  const currentState = cartStore.get();
  
  if (quantity === 0) {
    removeFromCart(id);
    return;
  }

  const updatedItems = currentState.items.map((item: CartItem) =>
    item.id === id ? { ...item, quantity } : item
  );

  cartStore.set({
    items: updatedItems,
    total: calculateTotal(updatedItems)
  });
};

/** Remover producto del carrito */
export const removeFromCart = (id: string) => {
  const currentState = cartStore.get();
  const updatedItems = currentState.items.filter((item: CartItem) => item.id !== id);
  
  cartStore.set({
    items: updatedItems,
    total: calculateTotal(updatedItems)
  });
};

/** Calcular total del carrito */
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

/** Limpiar carrito completamente */
export const clearCart = () => {
  cartStore.set(initialState);
}; 