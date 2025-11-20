import { PersonalInfoSection } from '@/components/checkout/PersonalInfoSection';
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
      <PersonalInfoSection form={form} />
    </MantineProvider>
  );
};

describe('PersonalInfoSection', () => {
  it('should render all personal info fields', () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it('should show required asterisks on all fields', () => {
    render(<TestWrapper />);

    const requiredFields = screen.getAllByText('*');
    expect(requiredFields.length).toBeGreaterThanOrEqual(3);
  });

  it('should display placeholder text', () => {
    render(<TestWrapper />);

    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('(555) 123-4567')).toBeInTheDocument();
  });

  it('should accept user input for full name', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, 'Jane Smith');

    expect(nameInput).toHaveValue('Jane Smith');
  });

  it('should accept user input for email', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'jane@example.com');

    expect(emailInput).toHaveValue('jane@example.com');
  });

  it('should accept user input for phone', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.type(phoneInput, '5551234567');

    expect(phoneInput).toHaveValue('5551234567');
  });

  it('should display initial values when provided', () => {
    render(
      <TestWrapper
        initialValues={{
          fullName: 'Initial Name',
          email: 'initial@test.com',
          phone: '1234567890',
        }}
      />
    );

    expect(screen.getByLabelText(/full name/i)).toHaveValue('Initial Name');
    expect(screen.getByLabelText(/email/i)).toHaveValue('initial@test.com');
    expect(screen.getByLabelText(/phone number/i)).toHaveValue('1234567890');
  });

  it('should have email input with type email', () => {
    render(<TestWrapper />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('should render icons for each field', () => {
    const { container } = render(<TestWrapper />);
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBeGreaterThanOrEqual(3);
  });

  it('should clear field value', async () => {
    const user = userEvent.setup();
    render(<TestWrapper initialValues={{ fullName: 'Test Name' }} />);

    const nameInput = screen.getByLabelText(/full name/i);
    expect(nameInput).toHaveValue('Test Name');

    await user.clear(nameInput);
    expect(nameInput).toHaveValue('');
  });

  it('should handle multiple field updates', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@test.com');
    await user.type(phoneInput, '1234567890');

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@test.com');
    expect(phoneInput).toHaveValue('1234567890');
  });
});
