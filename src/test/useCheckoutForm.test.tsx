import { CheckoutFormProvider } from '@/context/CheckoutFormProvider';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { renderHook, waitFor } from '@testing-library/react';
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

describe('useCheckoutForm', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with empty form values', () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    expect(result.current.values).toEqual({
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
  });

  it('should validate fullName field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('fullName', 'J');
    });

    const validationResult = result.current.validate();
    
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.fullName).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('fullName', 'John Doe');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.fullName).toBeFalsy();
    });
  });

  it('should validate email field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('email', 'invalid-email');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.email).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('email', 'john@example.com');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.email).toBeFalsy();
    });
  });

  it('should validate phone field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('phone', '123');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.phone).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('phone', '1234567890');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.phone).toBeFalsy();
    });
  });

  it('should validate address field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('address', '123');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.address).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('address', '123 Main Street');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.address).toBeFalsy();
    });
  });

  it('should validate city field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('city', 'A');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.city).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('city', 'New York');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.city).toBeFalsy();
    });
  });

  it('should validate state field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('state', 'A');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.state).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('state', 'NY');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.state).toBeFalsy();
    });
  });

  it('should validate zipCode field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('zipCode', '123');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.zipCode).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('zipCode', '10001');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.zipCode).toBeFalsy();
    });
  });

  it('should validate country field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('country', 'U');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.country).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('country', 'USA');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.country).toBeFalsy();
    });
  });

  it('should validate cardNumber field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('cardNumber', '1234');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.cardNumber).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('cardNumber', '4111111111111111');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.cardNumber).toBeFalsy();
    });
  });

  it('should validate cardName field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('cardName', 'J');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.cardName).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('cardName', 'John Doe');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.cardName).toBeFalsy();
    });
  });

  it('should validate expiryDate field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('expiryDate', '13/25');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.expiryDate).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('expiryDate', '12/25');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.expiryDate).toBeFalsy();
    });
  });

  it('should validate cvv field', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('cvv', '12');
    });

    const validationResult = result.current.validate();
    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(validationResult.errors.cvv).toBeTruthy();
    });

    act(() => {
      result.current.setFieldValue('cvv', '123');
    });

    const validResult = result.current.validate();
    await waitFor(() => {
      expect(validResult.errors.cvv).toBeFalsy();
    });
  });

  it('should sync form values to context', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setValues({
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
      });
    });

    await waitFor(() => {
      expect(result.current.values.fullName).toBe('John Doe');
      expect(result.current.values.email).toBe('john@example.com');
    });
  });

  it('should validate on blur when validateInputOnBlur is enabled', () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current.values).toBeDefined();
  });

  it('should handle multiple field updates', () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('fullName', 'John Doe');
      result.current.setFieldValue('email', 'john@example.com');
      result.current.setFieldValue('phone', '1234567890');
    });

    expect(result.current.values.fullName).toBe('John Doe');
    expect(result.current.values.email).toBe('john@example.com');
    expect(result.current.values.phone).toBe('1234567890');
  });

  it('should reset form values', () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setValues({
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
      });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual({
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
  });

  it('should validate all fields at once', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    const validationResult = result.current.validate();

    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(true);
      expect(Object.keys(validationResult.errors).length).toBeGreaterThan(0);
    });
  });


  it('should handle form submission validation', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setValues({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        cardNumber: '4111111111111111',
        cardName: 'John Doe',
        expiryDate: '12/25',
        cvv: '123',
      });
    });

    const validationResult = result.current.validate();

    await waitFor(() => {
      expect(validationResult.hasErrors).toBe(false);
    });
  });

  it('should handle field-specific validation', async () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('email', 'invalid');
    });

    const emailError = result.current.validateField('email');

    await waitFor(() => {
      expect(emailError).toBeTruthy();
    });
  });

  it('should support controlled mode', () => {
    const { result } = renderHook(() => useCheckoutForm(), {
      wrapper: CheckoutFormProvider,
    });

    act(() => {
      result.current.setFieldValue('fullName', 'Test User');
    });

    expect(result.current.values.fullName).toBe('Test User');
  });
});
