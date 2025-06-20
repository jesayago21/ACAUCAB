export interface Beer {
  id: string;
  thumb_src: string;
  thumb_alt: string;
  title: string;
  description: string;
  price: number;
  stock: number;
}

export interface CartItem extends Beer {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
} 