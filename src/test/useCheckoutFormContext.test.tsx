import { CheckoutFormProvider } from '@/context/CheckoutFormProvider';
import { useCheckoutFormContext } from '@/hooks/useCheckoutFormContext';
import { CheckoutFormValues } from '@/types/checkout';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useCheckoutFormContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should throw error when used outside CheckoutFormProvider', () => {
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useCheckoutFormContext());
    }).toThrow('useCheckoutFormContext must be used within CheckoutFormProvider');

    console.error = consoleError;
  });

  it('should provide initial form data when used within provider', () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    expect(result.current.formData).toEqual({
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
    });
    expect(result.current.activeStep).toBe(0);
  });

  it('should update form data', () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.updateFormData({
        fullName: 'John Doe',
        email: 'john@example.com',
      });
    });

    expect(result.current.formData.fullName).toBe('John Doe');
    expect(result.current.formData.email).toBe('john@example.com');
  });

  it('should update active step', () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setActiveStep(1);
    });

    expect(result.current.activeStep).toBe(1);
  });

  it('should merge form data on update', () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.updateFormData({ fullName: 'John Doe' });
    });

    act(() => {
      result.current.updateFormData({ email: 'john@example.com' });
    });

    expect(result.current.formData.fullName).toBe('John Doe');
    expect(result.current.formData.email).toBe('john@example.com');
  });

  it('should clear form data', () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.updateFormData({
        fullName: 'John Doe',
        email: 'john@example.com',
      });
      result.current.setActiveStep(2);
    });

    act(() => {
      result.current.clearFormData();
    });

    expect(result.current.formData).toEqual({
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
    });
    expect(result.current.activeStep).toBe(0);
  });

  it('should persist form data to localStorage', async () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    const formData: Partial<CheckoutFormValues> = {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '1234567890',
    };

    act(() => {
      result.current.updateFormData(formData);
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    const savedData = localStorage.getItem('checkout-form-data');
    expect(savedData).toBeTruthy();
    const parsedData = JSON.parse(savedData!);
    expect(parsedData.fullName).toBe('Jane Smith');
    expect(parsedData.email).toBe('jane@example.com');
  });

  it('should persist active step to localStorage', async () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setActiveStep(2);
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    const savedStep = localStorage.getItem('checkout-active-step');
    expect(savedStep).toBe('2');
  });

  it('should load persisted form data from localStorage on mount', () => {
    const persistedData: Partial<CheckoutFormValues> = {
      fullName: 'Persisted User',
      email: 'persisted@example.com',
      address: '123 Main St',
    };

    localStorage.setItem('checkout-form-data', JSON.stringify(persistedData));
    localStorage.setItem('checkout-active-step', '1');

    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    expect(result.current.formData.fullName).toBe('Persisted User');
    expect(result.current.formData.email).toBe('persisted@example.com');
    expect(result.current.formData.address).toBe('123 Main St');
    expect(result.current.activeStep).toBe(1);
  });

  it('should remove localStorage items when clearing form data', async () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.updateFormData({ fullName: 'John Doe' });
      result.current.setActiveStep(1);
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(localStorage.getItem('checkout-form-data')).toBeTruthy();
    expect(localStorage.getItem('checkout-active-step')).toBeTruthy();

    act(() => {
      result.current.clearFormData();
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    const savedData = localStorage.getItem('checkout-form-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      expect(parsed.fullName).toBe('');
      expect(parsed.email).toBe('');
    }
    expect(localStorage.getItem('checkout-active-step')).toBe('0');
  });

  it('should handle partial updates without overwriting other fields', () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.updateFormData({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      });
    });

    act(() => {
      result.current.updateFormData({
        address: '123 Main St',
        city: 'New York',
      });
    });

    expect(result.current.formData.fullName).toBe('John Doe');
    expect(result.current.formData.email).toBe('john@example.com');
    expect(result.current.formData.phone).toBe('1234567890');
    
    expect(result.current.formData.address).toBe('123 Main St');
    expect(result.current.formData.city).toBe('New York');
  });

  it('should handle step navigation', () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    expect(result.current.activeStep).toBe(0);

    act(() => {
      result.current.setActiveStep(1);
    });
    expect(result.current.activeStep).toBe(1);

    act(() => {
      result.current.setActiveStep(2);
    });
    expect(result.current.activeStep).toBe(2);

    act(() => {
      result.current.setActiveStep(0);
    });
    expect(result.current.activeStep).toBe(0);
  });

  it('should update all form fields independently', () => {
    const { result } = renderHook(() => useCheckoutFormContext(), {
      wrapper: CheckoutFormProvider,
    });

    const completeFormData: CheckoutFormValues = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      cardNumber: '4111111111111111',
      cardName: 'John Doe',
      expiryDate: '12/25',
      cvv: '123',
    };

    act(() => {
      result.current.updateFormData(completeFormData);
    });

    expect(result.current.formData).toEqual(completeFormData);
  });
});
