import type { CartItem } from './cart';
import type { CheckoutFormValues, OrderSummary } from './checkout';
import type { UseFormReturnType } from '@mantine/form';

export interface StepConfig {
  key: string;
  fields: Array<keyof CheckoutFormValues>;
}

export interface UseCheckoutFormStepsProps {
  form: UseFormReturnType<CheckoutFormValues>;
  stepConfigs: StepConfig[];
  cartItems: CartItem[];
  totalPrice: number;
  onSubmitSuccess: (orderSummary: OrderSummary) => void;
}

export interface UseOrderSummaryCardProps {
  orderSummary: OrderSummary;
}
