import { PaymentInfoSection } from '@/components/checkout/PaymentInfoSection';
import { CheckoutFormValues } from '@/types/checkout';
import { MantineProvider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

const TestWrapper = ({ initialValues = {} }: { initialValues?: Partial<CheckoutFormValues> }) => {
  const form = useForm<CheckoutFormValues>({
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
      ...initialValues,
    },
  });

  return (
    <MantineProvider>
      <PaymentInfoSection form={form} />
    </MantineProvider>
  );
};

describe('PaymentInfoSection', () => {
  it('should render all payment info fields', () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name on card/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
  });

  it('should show required asterisks on all fields', () => {
    render(<TestWrapper />);
    const requiredFields = screen.getAllByText('*');
    expect(requiredFields.length).toBeGreaterThanOrEqual(4);
  });

  it('should display placeholder text for all fields', () => {
    render(<TestWrapper />);

    expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('123')).toBeInTheDocument();
  });

  it('should format card number with spaces', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const cardInput = screen.getByLabelText(/card number/i);
    await user.type(cardInput, '1234567890123456');

    expect(cardInput).toHaveValue('1234 5678 9012 3456');
  });

  it('should enforce card number max length', () => {
    render(<TestWrapper />);
    const cardInput = screen.getByLabelText(/card number/i);
    expect(cardInput).toHaveAttribute('maxLength', '19');
  });

  it('should accept name on card', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const nameInput = screen.getByLabelText(/name on card/i);
    await user.type(nameInput, 'Jane Smith');

    expect(nameInput).toHaveValue('Jane Smith');
  });

  it('should format expiry date with slash', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const expiryInput = screen.getByLabelText(/expiry date/i);
    await user.type(expiryInput, '1225');

    expect(expiryInput).toHaveValue('12/25');
  });

  it('should enforce expiry date max length', () => {
    render(<TestWrapper />);
    const expiryInput = screen.getByLabelText(/expiry date/i);
    expect(expiryInput).toHaveAttribute('maxLength', '5');
  });

  it('should accept CVV input', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const cvvInput = screen.getByLabelText(/cvv/i);
    await user.type(cvvInput, '123');

    expect(cvvInput).toHaveValue('123');
  });

  it('should mask CVV input', () => {
    render(<TestWrapper />);
    const cvvInput = screen.getByLabelText(/cvv/i);
    expect(cvvInput).toHaveAttribute('type', 'password');
  });

  it('should enforce CVV max length', () => {
    render(<TestWrapper />);
    const cvvInput = screen.getByLabelText(/cvv/i);
    expect(cvvInput).toHaveAttribute('maxLength', '4');
  });

  it('should display initial values when provided', () => {
    render(
      <TestWrapper
        initialValues={{
          cardNumber: '4111 1111 1111 1111',
          cardName: 'Test User',
          expiryDate: '12/25',
          cvv: '123',
        }}
      />
    );

    expect(screen.getByLabelText(/card number/i)).toHaveValue('4111 1111 1111 1111');
    expect(screen.getByLabelText(/name on card/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/expiry date/i)).toHaveValue('12/25');
    expect(screen.getByLabelText(/cvv/i)).toHaveValue('123');
  });

  it('should render icons for each field', () => {
    const { container } = render(<TestWrapper />);
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBeGreaterThanOrEqual(4);
  });

  it('should clear field values', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper
        initialValues={{
          cardNumber: '1234 5678 9012 3456',
          cardName: 'Test Name',
        }}
      />
    );

    const cardInput = screen.getByLabelText(/card number/i);
    const nameInput = screen.getByLabelText(/name on card/i);

    await user.clear(cardInput);
    await user.clear(nameInput);

    expect(cardInput).toHaveValue('');
    expect(nameInput).toHaveValue('');
  });

  it('should handle complete payment info entry', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    await user.type(screen.getByLabelText(/card number/i), '4111111111111111');
    await user.type(screen.getByLabelText(/name on card/i), 'John Doe');
    await user.type(screen.getByLabelText(/expiry date/i), '1225');
    await user.type(screen.getByLabelText(/cvv/i), '123');

    expect(screen.getByLabelText(/card number/i)).toHaveValue('4111 1111 1111 1111');
    expect(screen.getByLabelText(/name on card/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/expiry date/i)).toHaveValue('12/25');
    expect(screen.getByLabelText(/cvv/i)).toHaveValue('123');
  });

  it('should handle card number with partial input', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const cardInput = screen.getByLabelText(/card number/i);
    await user.type(cardInput, '4111');

    expect(cardInput).toHaveValue('4111');
  });

  it('should handle expiry date with single digit month', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const expiryInput = screen.getByLabelText(/expiry date/i);
    await user.type(expiryInput, '525');

    expect(expiryInput).toHaveValue('52/5');
  });

  it('should handle 4-digit CVV for Amex cards', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const cvvInput = screen.getByLabelText(/cvv/i);
    await user.type(cvvInput, '1234');

    expect(cvvInput).toHaveValue('1234');
  });

  it('should handle name with special characters', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const nameInput = screen.getByLabelText(/name on card/i);
    await user.type(nameInput, "O'Brien-Smith Jr.");

    expect(nameInput).toHaveValue("O'Brien-Smith Jr.");
  });

  it('should prevent typing non-numeric characters in card number', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const cardInput = screen.getByLabelText(/card number/i) as HTMLInputElement;
    await user.type(cardInput, '4111abc1111');

    expect(cardInput.value).toBe('4111 abc1 111');
  });

  it('should handle expiry date edge cases', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const expiryInput = screen.getByLabelText(/expiry date/i);
    
    await user.type(expiryInput, '12');
    expect(expiryInput).toHaveValue('12/');
    
    await user.clear(expiryInput);
    await user.type(expiryInput, '0125');
    expect(expiryInput).toHaveValue('01/25');
  });
});
