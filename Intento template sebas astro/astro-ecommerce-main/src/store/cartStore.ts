import { atom } from 'nanostores';
import type { Beer, CartItem, CartState } from '../types/beer';

const initialState: CartState = {
  items: [],
  total: 0
};

export const cartStore = atom<CartState>(initialState);

export const addToCart = (beer: Beer) => {
  const currentState = cartStore.get();
  const existingItem = currentState.items.find((item: CartItem) => item.id === beer.id);

  if (existingItem) {
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
    const newItem: CartItem = { ...beer, quantity: 1 };
    const updatedItems = [...currentState.items, newItem];
    cartStore.set({
      items: updatedItems,
      total: calculateTotal(updatedItems)
    });
  }
};

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

export const removeFromCart = (id: string) => {
  const currentState = cartStore.get();
  const updatedItems = currentState.items.filter((item: CartItem) => item.id !== id);
  
  cartStore.set({
    items: updatedItems,
    total: calculateTotal(updatedItems)
  });
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const clearCart = () => {
  cartStore.set(initialState);
}; 