import type { CartItem } from './cart';

export interface Order {
  id: string;
  userId: number;
  date: string;
  total: number;
  status: 'delivered';
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail?: string;
}

export interface CreateOrderRequest {
  userId: number;
  items: CartItem[];
  total: number;
}
