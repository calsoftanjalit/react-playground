import { UseFormReturnType } from '@mantine/form';
import { CartItem } from './cart';

export interface PricingBreakdown {
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
}

export interface CheckoutCart {
  items: CartItem[];
  pricing: PricingBreakdown;
}

export interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface OrderSummary {
  orderId: string;
  fullName: string;
  email: string;
  address: string;
  totalAmount: number;
  orderDate: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

export interface CheckoutFormProps {
  cartItems: CartItem[];
  onSubmitSuccess: (orderSummary: OrderSummary) => void;
}

export interface OrderSuccessProps {
  orderSummary: OrderSummary;
}

export interface PersonalInfoSectionProps {
  form: UseFormReturnType<CheckoutFormValues>;
}

export interface ShippingAddressSectionProps {
  form: UseFormReturnType<CheckoutFormValues>;
}

export interface PaymentInfoSectionProps {
  form: UseFormReturnType<CheckoutFormValues>;
}
