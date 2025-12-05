import type { Order, CreateOrderRequest, OrderItem } from '@/types/order';
import { getFromStorage, setInStorage } from '@/utils/storage';

const ORDERS_STORAGE_KEY = 'user_orders';

const getAllOrders = (): Order[] => {
  return getFromStorage<Order[]>(ORDERS_STORAGE_KEY) || [];
};

const saveOrders = (orders: Order[]): void => {
  setInStorage(ORDERS_STORAGE_KEY, orders);
};

/**
 * Get user-specific orders
 * @param userId - User ID
 * @returns Array of user's orders
 */
export const getUserOrders = (userId: number): Order[] => {
  const allOrders = getAllOrders();
  return allOrders.filter(order => order.userId === userId);
};

/**
 * Create a new order
 * @param request - Order creation request
 * @returns Created order
 */
export const createOrder = (request: CreateOrderRequest): Order => {
  const allOrders = getAllOrders();

  const orderId = `ORD-${Date.now()}-${request.userId}`;

  const orderItems: OrderItem[] = request.items.map(item => ({
    id: item.id,
    title: item.title,
    price: item.discountedPrice || item.price,
    quantity: item.quantity,
    thumbnail: item.thumbnail,
  }));

  const newOrder: Order = {
    id: orderId,
    userId: request.userId,
    date: new Date().toISOString(),
    total: request.total,
    status: 'delivered',
    items: orderItems,
  };

  const updatedOrders = [...allOrders, newOrder];
  saveOrders(updatedOrders);

  return newOrder;
};

/**
 * Get order by ID
 * @param orderId - Order ID
 * @returns Order or undefined
 */
export const getOrderById = (orderId: string): Order | undefined => {
  const allOrders = getAllOrders();
  return allOrders.find(order => order.id === orderId);
};

export const clearUserOrders = (userId: number): void => {
  const allOrders = getAllOrders();
  const filteredOrders = allOrders.filter(order => order.userId !== userId);
  saveOrders(filteredOrders);
};
