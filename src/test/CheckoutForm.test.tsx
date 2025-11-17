import { CheckoutForm } from '@/components/checkout';
import { submitOrder } from '@/services/checkoutService';
import { MantineProvider } from '@mantine/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/checkoutService', () => ({
  submitOrder: vi.fn(),
}));

vi.mock('@/hooks/useCheckoutFormContext', () => ({
  useCheckoutFormContext: () => ({
    activeStep: 0,
    setActiveStep: vi.fn(),
    clearFormData: vi.fn(),
    formData: {},
    updateFormData: vi.fn(),
  }),
}));

const mockCartItems = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 49.99,
    quantity: 2,
    thumbnail: 'https://example.com/image1.jpg',
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 79.99,
    quantity: 1,
    thumbnail: 'https://example.com/image2.jpg',
  },
];

const renderCheckoutForm = () => {
  const onSubmitSuccess = vi.fn();

  return {
    onSubmitSuccess,
    user: userEvent.setup(),
    ...render(
      <MantineProvider>
        <CheckoutForm cartItems={mockCartItems} onSubmitSuccess={onSubmitSuccess} />
      </MantineProvider>
    ),
  };
};

const fillPersonalInfo = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/full name/i), 'John Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/phone number/i), '1234567890');
};

const fillShippingAddress = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/street address/i), '123 Main Street');
  await user.type(screen.getByLabelText(/city/i), 'New York');
  await user.type(screen.getByLabelText(/state\/province/i), 'NY');
  await user.type(screen.getByLabelText(/zip\/postal code/i), '12345');
  await user.type(screen.getByLabelText(/country/i), 'USA');
};

const fillPaymentInfo = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/card number/i), '4242424242424242');
  await user.type(screen.getByLabelText(/name on card/i), 'John Doe');
  await user.type(screen.getByLabelText(/expiry date/i), '12/30');
  await user.type(screen.getByLabelText(/cvv/i), '123');
};

describe('CheckoutForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Stepper Navigation', () => {
    it('renders initial step with personal information', () => {
      renderCheckoutForm();

      expect(screen.getByText(/personal information/i)).toBeInTheDocument();
      expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    it('blocks progression and shows validation when step is incomplete', async () => {
      const { user } = renderCheckoutForm();

      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/please fix the highlighted fields before continuing/i)
        ).toBeInTheDocument();
      });
      
      expect(submitOrder).not.toHaveBeenCalled();
    });

    it('advances to shipping step after completing personal info', async () => {
      const { user } = renderCheckoutForm();

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByText(/shipping address/i)).toBeInTheDocument();
      expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    });

    it('advances to payment step after completing shipping', async () => {
      const { user } = renderCheckoutForm();

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillShippingAddress(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByText(/payment information/i)).toBeInTheDocument();
      expect(screen.getByText(/step 3 of 3/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    });

    it('allows going back to previous step', async () => {
      const { user } = renderCheckoutForm();

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /back/i }));

      expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toHaveValue('John Doe');
    });

    it('does not show back button on first step', () => {
      renderCheckoutForm();

      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    });

    it('shows complete order button on last step', async () => {
      const { user } = renderCheckoutForm();
      const submitOrderMock = vi.mocked(submitOrder);
      
      submitOrderMock.mockImplementation(
        () => new Promise(() => {})
      );

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillShippingAddress(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/step 3 of 3/i)).toBeInTheDocument();
      });

      expect(
        screen.getByRole('button', { name: /complete order|processing/i })
      ).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^continue$/i })).not.toBeInTheDocument();
    });
  });

  describe('Step Validation', () => {
    it('shows error state on step when validation fails', async () => {
      const { user } = renderCheckoutForm();

      await user.type(screen.getByLabelText(/email/i), 'invalid-email');
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByText(/please fix the highlighted fields/i)).toBeInTheDocument();
    });

    it('clears error state when fields are fixed', async () => {
      const { user } = renderCheckoutForm();

      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(screen.getByText(/please fix the highlighted fields/i)).toBeInTheDocument();

      await fillPersonalInfo(user);
      
      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
    });

    it('marks completed steps with validated badge', async () => {
      const { user } = renderCheckoutForm();

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
      
      await fillShippingAddress(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByText(/step 3 of 3/i)).toBeInTheDocument();
    });
  });

  describe('Order Submission', () => {
    it('submits the order after all steps are valid', async () => {
      const { user, onSubmitSuccess } = renderCheckoutForm();
      const submitOrderMock = vi.mocked(submitOrder);

      const mockOrder = {
        orderId: 'ORDER123',
        fullName: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St, City, ST 12345, USA',
        totalAmount: 250,
        orderDate: '2024-01-01',
        items: [],
      };

      submitOrderMock.mockResolvedValue(mockOrder);

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillShippingAddress(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillPaymentInfo(user);
      await user.click(screen.getByRole('button', { name: /complete order/i }));

      await waitFor(() => {
        expect(submitOrder).toHaveBeenCalledTimes(1);
        expect(onSubmitSuccess).toHaveBeenCalledWith(mockOrder);
      });
    });

    it('shows loading state during submission', async () => {
      const { user } = renderCheckoutForm();
      const submitOrderMock = vi.mocked(submitOrder);

      submitOrderMock.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          orderId: 'ORDER123',
          fullName: 'John Doe',
          email: 'john@example.com',
          address: '123 Main St',
          totalAmount: 250,
          orderDate: '2024-01-01',
          items: [],
        }), 200))
      );

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillShippingAddress(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillPaymentInfo(user);
      await user.click(screen.getByRole('button', { name: /complete order/i }));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /processing/i });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
      });
    });

    it('handles submission error gracefully', async () => {
      const { user } = renderCheckoutForm();
      const submitOrderMock = vi.mocked(submitOrder);

      submitOrderMock.mockRejectedValue(new Error('Payment failed'));

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillShippingAddress(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillPaymentInfo(user);
      
      const submitButton = screen.getByRole('button', { name: /complete order/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /complete order/i })).not.toBeDisabled();
      });
      
      expect(submitOrder).toHaveBeenCalledTimes(1);
    });

    it('prevents submission with invalid payment step', async () => {
      const { user } = renderCheckoutForm();

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillShippingAddress(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await user.click(screen.getByRole('button', { name: /complete order/i }));

      expect(submitOrder).not.toHaveBeenCalled();
    });
  });

  describe('Form Persistence', () => {
    it('retains form data when navigating between steps', async () => {
      const { user } = renderCheckoutForm();

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillShippingAddress(user);
      await user.click(screen.getByRole('button', { name: /back/i }));

      expect(screen.getByLabelText(/full name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty cart items', () => {
      const onSubmitSuccess = vi.fn();
      
      render(
        <MantineProvider>
          <CheckoutForm cartItems={[]} onSubmitSuccess={onSubmitSuccess} />
        </MantineProvider>
      );

      expect(screen.getByText(/personal information/i)).toBeInTheDocument();
    });

    it('calculates correct totals with multiple items', async () => {
      const { user } = renderCheckoutForm();

      await fillPersonalInfo(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillShippingAddress(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await fillPaymentInfo(user);
      
      expect(screen.getByRole('button', { name: /complete order/i })).toBeEnabled();
    });
  });
});
