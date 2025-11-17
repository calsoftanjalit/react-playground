import { CheckoutFormContext } from '@/context/checkoutFormStore';
import { useContext } from 'react';

export const useCheckoutFormContext = () => {
  const context = useContext(CheckoutFormContext);
  if (!context) {
    throw new Error('useCheckoutFormContext must be used within CheckoutFormProvider');
  }
  return context;
};
