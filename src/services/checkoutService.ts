import type { CartItem } from '@/types/cart';
import type { CheckoutFormValues, OrderSummary } from '@/types/checkout';
import { formatFullAddress, formatOrderDate, generateOrderId } from '@/utils';
import { createOrder } from '@/services/orderService';

export const generateOrderSummary = (
  values: CheckoutFormValues,
  cartItems: CartItem[],
  totalPrice: number
): OrderSummary => {
  return {
    orderId: generateOrderId(),
    fullName: values.fullName,
    email: values.email,
    address: formatFullAddress(
      values.address,
      values.city,
      values.state,
      values.zipCode,
      values.country
    ),
    totalAmount: totalPrice,
    orderDate: formatOrderDate(new Date()),
    items: cartItems.map((item) => ({
      id: item.id,
      name: item.title,
      quantity: item.quantity,
      price: item.price,
      discountedPrice: item.discountedPrice,
      image: item.thumbnail || '',
    })),
  };
};

export const submitOrder = (
  values: CheckoutFormValues,
  cartItems: CartItem[],
  totalPrice: number,
  userId?: number,
  delay: number = 1500
): Promise<OrderSummary> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderSummary = generateOrderSummary(values, cartItems, totalPrice);
      
      if (userId) {
        createOrder({
          userId,
          items: cartItems,
          total: totalPrice,
        });
      }
      
      resolve(orderSummary);
    }, delay);
  });
};
