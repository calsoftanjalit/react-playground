import { useCheckoutFormSteps } from '@/hooks/useCheckoutFormSteps';
import { CartItem } from '@/types/cart';
import { CheckoutFormValues, OrderSummary } from '@/types/checkout';
import { useForm } from '@mantine/form';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSetActiveStep = vi.fn();
const mockClearFormData = vi.fn();

vi.mock('@/hooks/useCheckoutFormContext', () => ({
  useCheckoutFormContext: () => ({
    activeStep: 0,
    setActiveStep: mockSetActiveStep,
    clearFormData: mockClearFormData,
  }),
}));

vi.mock('@/services/checkoutService', () => ({
  submitOrder: vi.fn(),
}));

const mockCartItems: CartItem[] = [
  {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    quantity: 2,
    thumbnail: 'https://example.com/image.jpg',
  },
];

const mockStepConfigs = [
  {
    key: 'personal',
    fields: ['fullName', 'email', 'phone'] as Array<keyof CheckoutFormValues>,
  },
  {
    key: 'shipping',
    fields: ['address', 'city', 'state', 'zipCode', 'country'] as Array<keyof CheckoutFormValues>,
  },
  {
    key: 'payment',
    fields: ['cardNumber', 'cardName', 'expiryDate', 'cvv'] as Array<keyof CheckoutFormValues>,
  },
];

describe('useCheckoutFormSteps', () => {
  let form: ReturnType<typeof useForm<CheckoutFormValues>>;
  let onSubmitSuccess: (orderSummary: OrderSummary) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetActiveStep.mockClear();
    mockClearFormData.mockClear();
    onSubmitSuccess = vi.fn();
    
    const { result } = renderHook(() =>
      useForm<CheckoutFormValues>({
        initialValues: {
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
        },
        validate: {
          fullName: (value) => (!value ? 'Full name is required' : null),
          email: (value) => (!value || !value.includes('@') ? 'Valid email is required' : null),
          phone: (value) => (!value ? 'Phone is required' : null),
          address: (value) => (!value ? 'Address is required' : null),
          city: (value) => (!value ? 'City is required' : null),
          state: (value) => (!value ? 'State is required' : null),
          zipCode: (value) => (!value ? 'Zip code is required' : null),
          country: (value) => (!value ? 'Country is required' : null),
          cardNumber: (value) => (!value || value.length < 16 ? 'Valid card number is required' : null),
          cardName: (value) => (!value ? 'Name on card is required' : null),
          expiryDate: (value) => (!value || !value.includes('/') ? 'Valid expiry date is required' : null),
          cvv: (value) => (!value || value.length < 3 ? 'Valid CVV is required' : null),
        },
      })
    );
    form = result.current;
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() =>
      useCheckoutFormSteps({
        form,
        stepConfigs: mockStepConfigs,
        cartItems: mockCartItems,
        totalPrice: 199.98,
        onSubmitSuccess,
      })
    );

    expect(result.current.activeStep).toBe(0);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.stepStatuses).toEqual({
      0: 'idle',
      1: 'idle',
      2: 'idle',
    });
  });

  describe('Step Navigation', () => {
    it('does not advance to next step when validation fails', () => {
      const { result } = renderHook(() =>
        useCheckoutFormSteps({
          form,
          stepConfigs: mockStepConfigs,
          cartItems: mockCartItems,
          totalPrice: 199.98,
          onSubmitSuccess,
        })
      );

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.activeStep).toBe(0);
      expect(result.current.stepStatuses[0]).toBe('error');
    });

    it('advances to next step when validation passes', () => {
      form.setValues({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      });

      const { result } = renderHook(() =>
        useCheckoutFormSteps({
          form,
          stepConfigs: mockStepConfigs,
          cartItems: mockCartItems,
          totalPrice: 199.98,
          onSubmitSuccess,
        })
      );

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.activeStep).toBe(1);
      expect(result.current.stepStatuses[0]).toBe('completed');
    });

    it('goes back to previous step', () => {
      form.setValues({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      });

      const { result } = renderHook(() =>
        useCheckoutFormSteps({
          form,
          stepConfigs: mockStepConfigs,
          cartItems: mockCartItems,
          totalPrice: 199.98,
          onSubmitSuccess,
        })
      );

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.activeStep).toBe(1);

      act(() => {
        result.current.handlePreviousStep();
      });

      expect(result.current.activeStep).toBe(0);
    });

    it('allows direct navigation to completed steps', () => {
      form.setValues({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '12345',
        country: 'USA',
      });

      const { result } = renderHook(() =>
        useCheckoutFormSteps({
          form,
          stepConfigs: mockStepConfigs,
          cartItems: mockCartItems,
          totalPrice: 199.98,
          onSubmitSuccess,
        })
      );

      act(() => {
        result.current.handleNextStep();
      });
      expect(result.current.activeStep).toBe(1);

      act(() => {
        result.current.handleNextStep();
      });
      expect(result.current.activeStep).toBe(2);

      act(() => {
        result.current.handleStepChange(0);
      });
      expect(result.current.activeStep).toBe(0);
    });
  });

  describe('Form Submission', () => {
    it('submits form when all steps are valid', async () => {
      const { submitOrder } = await import('@/services/checkoutService');
      const mockOrder: OrderSummary = {
        orderId: 'ORDER123',
        fullName: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St, New York, NY 12345, USA',
        totalAmount: 199.98,
        orderDate: '2024-01-01',
        items: [],
      };
      
      vi.mocked(submitOrder).mockResolvedValue(mockOrder);

      form.setValues({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '12345',
        country: 'USA',
        cardNumber: '4242424242424242',
        cardName: 'John Doe',
        expiryDate: '12/30',
        cvv: '123',
      });

      const { result } = renderHook(() =>
        useCheckoutFormSteps({
          form,
          stepConfigs: mockStepConfigs,
          cartItems: mockCartItems,
          totalPrice: 199.98,
          onSubmitSuccess,
        })
      );

      await act(async () => {
        result.current.handleNextStep();
      });

      await act(async () => {
        result.current.handleNextStep();
      });

      await act(async () => {
        await result.current.handleFormSubmit(form.values as CheckoutFormValues);
      });

      await waitFor(() => {
        expect(submitOrder).toHaveBeenCalledWith(form.values, mockCartItems, 199.98);
        expect(onSubmitSuccess).toHaveBeenCalledWith(mockOrder);
      });
    });

    it('sets submitting state during submission', async () => {
      const { submitOrder } = await import('@/services/checkoutService');
      vi.mocked(submitOrder).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      form.setValues({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '12345',
        country: 'USA',
        cardNumber: '4242424242424242',
        cardName: 'John Doe',
        expiryDate: '12/30',
        cvv: '123',
      });

      const { result } = renderHook(() =>
        useCheckoutFormSteps({
          form,
          stepConfigs: mockStepConfigs,
          cartItems: mockCartItems,
          totalPrice: 199.98,
          onSubmitSuccess,
        })
      );

      await act(async () => {
        result.current.handleNextStep();
      });
      await act(async () => {
        result.current.handleNextStep();
      });

      await act(async () => {
        void result.current.handleFormSubmit(form.values as CheckoutFormValues);
      });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(false);
      });
    });

    it('handles submission errors', async () => {
      const { submitOrder } = await import('@/services/checkoutService');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(submitOrder).mockRejectedValue(new Error('Payment failed'));

      form.setValues({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '12345',
        country: 'USA',
        cardNumber: '4242424242424242',
        cardName: 'John Doe',
        expiryDate: '12/30',
        cvv: '123',
      });

      const { result } = renderHook(() =>
        useCheckoutFormSteps({
          form,
          stepConfigs: mockStepConfigs,
          cartItems: mockCartItems,
          totalPrice: 199.98,
          onSubmitSuccess,
        })
      );

      await act(async () => {
        result.current.handleNextStep();
      });
      await act(async () => {
        result.current.handleNextStep();
      });

      await act(async () => {
        await result.current.handleFormSubmit(form.values as CheckoutFormValues);
      });

      await waitFor(() => {
        expect(result.current.stepStatuses[2]).toBe('error');
        expect(result.current.isSubmitting).toBe(false);
        expect(onSubmitSuccess).not.toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Step Status', () => {
    it('returns correct step color based on status', () => {
      const { result } = renderHook(() =>
        useCheckoutFormSteps({
          form,
          stepConfigs: mockStepConfigs,
          cartItems: mockCartItems,
          totalPrice: 199.98,
          onSubmitSuccess,
        })
      );

      expect(result.current.getStepColor(0, 'blue')).toBe('blue');

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.getStepColor(0, 'blue')).toBe('red');
    });
  });
});
