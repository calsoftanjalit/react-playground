import { CheckoutFormValues } from '@/types/checkout';
import { getFromStorage, setInStorage } from '@/utils/storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckoutFormContext } from './checkoutFormStore';

const CHECKOUT_FORM_STORAGE_KEY = 'checkout-form-data';
const CHECKOUT_STEP_STORAGE_KEY = 'checkout-active-step';

const INITIAL_FORM_DATA: Partial<CheckoutFormValues> = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: '',
};

interface CheckoutFormProviderProps {
  children: React.ReactNode;
}

export const CheckoutFormProvider: React.FC<CheckoutFormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<Partial<CheckoutFormValues>>(INITIAL_FORM_DATA);
  const [activeStep, setActiveStepState] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedFormData = getFromStorage<Partial<CheckoutFormValues>>(CHECKOUT_FORM_STORAGE_KEY);
    const savedActiveStep = getFromStorage<number>(CHECKOUT_STEP_STORAGE_KEY);

    if (savedFormData) {
      setFormData(savedFormData);
    }
    if (savedActiveStep !== null && savedActiveStep !== undefined) {
      setActiveStepState(savedActiveStep);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setInStorage(CHECKOUT_FORM_STORAGE_KEY, formData);
    }
  }, [formData, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setInStorage(CHECKOUT_STEP_STORAGE_KEY, activeStep);
    }
  }, [activeStep, isLoading]);

  const updateFormData = useCallback((data: Partial<CheckoutFormValues>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const setActiveStep = useCallback((step: number) => {
    setActiveStepState(step);
  }, []);

  const clearFormData = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setActiveStepState(0);
    localStorage.removeItem(CHECKOUT_FORM_STORAGE_KEY);
    localStorage.removeItem(CHECKOUT_STEP_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      formData,
      activeStep,
      updateFormData,
      setActiveStep,
      clearFormData,
    }),
    [formData, activeStep, updateFormData, setActiveStep, clearFormData]
  );

  return <CheckoutFormContext.Provider value={value}>{children}</CheckoutFormContext.Provider>;
};
