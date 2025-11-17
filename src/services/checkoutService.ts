import { CartItem } from '@/types/cart';
import { CheckoutFormValues, OrderSummary } from '@/types/checkout';
import { formatFullAddress, formatOrderDate, generateOrderId } from '@/utils';

export const generateOrderSummary = (
  values: CheckoutFormValues,
  cartItems: CartItem[]
): OrderSummary => {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
    totalAmount,
    orderDate: formatOrderDate(new Date()),
    items: cartItems.map((item) => ({
      id: item.id,
      name: item.title,
      quantity: item.quantity,
      price: item.price,
      image: item.thumbnail || '',
    })),
  };
};

export const submitOrder = (
  values: CheckoutFormValues,
  cartItems: CartItem[],
  delay: number = 1500
): Promise<OrderSummary> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderSummary = generateOrderSummary(values, cartItems);
      resolve(orderSummary);
    }, delay);
  });
};
