import { CheckoutFormValues } from '@/types/checkout';
import { createContext } from 'react';

export interface CheckoutFormContextType {
  formData: Partial<CheckoutFormValues>;
  activeStep: number;
  updateFormData: (data: Partial<CheckoutFormValues>) => void;
  setActiveStep: (step: number) => void;
  clearFormData: () => void;
}

export const CheckoutFormContext = createContext<CheckoutFormContextType | undefined>(undefined);
