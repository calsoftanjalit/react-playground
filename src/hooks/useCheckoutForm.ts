import { FIELD_LENGTH } from '@/constants/checkout';
import { CheckoutFormValues } from '@/types/checkout';
import {
  addressValidator,
  createNameValidator,
  cvvValidator,
  emailValidator,
  phoneValidator,
  validateCardNumber,
  validateExpiryDate,
  zipCodeValidator,
} from '@/utils/validation';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useCheckoutFormContext } from './useCheckoutFormContext';

export const useCheckoutForm = () => {
  const { formData, updateFormData } = useCheckoutFormContext();

  const form = useForm<CheckoutFormValues>({
    mode: 'controlled',
    initialValues: {
      fullName: formData.fullName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      zipCode: formData.zipCode || '',
      country: formData.country || '',
      cardNumber: formData.cardNumber || '',
      cardName: formData.cardName || '',
      expiryDate: formData.expiryDate || '',
      cvv: formData.cvv || '',
    },
    validate: {
      fullName: createNameValidator('Full name', FIELD_LENGTH.MIN_NAME),
      email: emailValidator,
      phone: phoneValidator,
      address: addressValidator,
      city: createNameValidator('City', FIELD_LENGTH.MIN_CITY),
      state: createNameValidator('State', FIELD_LENGTH.MIN_STATE),
      zipCode: zipCodeValidator,
      country: createNameValidator('Country', FIELD_LENGTH.MIN_COUNTRY),
      cardNumber: validateCardNumber,
      cardName: createNameValidator('Name on card', FIELD_LENGTH.MIN_NAME),
      expiryDate: validateExpiryDate,
      cvv: cvvValidator,
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    updateFormData(form.values);
  }, [form.values, updateFormData]);

  return form;
};
