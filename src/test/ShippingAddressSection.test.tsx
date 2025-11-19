import { ShippingAddressSection } from '@/components/checkout/ShippingAddressSection';
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
      <ShippingAddressSection form={form} />
    </MantineProvider>
  );
};

describe('ShippingAddressSection', () => {
  it('should render all shipping address fields', () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state\/province/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip\/postal code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('should show required asterisks on all fields', () => {
    render(<TestWrapper />);
    const requiredFields = screen.getAllByText('*');
    expect(requiredFields.length).toBeGreaterThanOrEqual(5);
  });

  it('should display placeholder text for all fields', () => {
    render(<TestWrapper />);

    expect(screen.getByPlaceholderText('123 Main Street')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New York')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('NY')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('10001')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('United States')).toBeInTheDocument();
  });

  it('should accept user input for street address', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const addressInput = screen.getByLabelText(/street address/i);
    await user.type(addressInput, '456 Oak Avenue');

    expect(addressInput).toHaveValue('456 Oak Avenue');
  });

  it('should accept user input for city', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const cityInput = screen.getByLabelText(/city/i);
    await user.type(cityInput, 'San Francisco');

    expect(cityInput).toHaveValue('San Francisco');
  });

  it('should accept user input for state', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const stateInput = screen.getByLabelText(/state\/province/i);
    await user.type(stateInput, 'CA');

    expect(stateInput).toHaveValue('CA');
  });

  it('should accept user input for zip code', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const zipInput = screen.getByLabelText(/zip\/postal code/i);
    await user.type(zipInput, '94102');

    expect(zipInput).toHaveValue('94102');
  });

  it('should accept user input for country', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const countryInput = screen.getByLabelText(/country/i);
    await user.type(countryInput, 'Canada');

    expect(countryInput).toHaveValue('Canada');
  });

  it('should display initial values when provided', () => {
    render(
      <TestWrapper
        initialValues={{
          address: '789 Pine Street',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA',
        }}
      />
    );

    expect(screen.getByLabelText(/street address/i)).toHaveValue('789 Pine Street');
    expect(screen.getByLabelText(/city/i)).toHaveValue('Boston');
    expect(screen.getByLabelText(/state\/province/i)).toHaveValue('MA');
    expect(screen.getByLabelText(/zip\/postal code/i)).toHaveValue('02101');
    expect(screen.getByLabelText(/country/i)).toHaveValue('USA');
  });

  it('should render icons for each field', () => {
    const { container } = render(<TestWrapper />);
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBeGreaterThanOrEqual(5);
  });

  it('should clear field values', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper
        initialValues={{
          address: 'Test Address',
          city: 'Test City',
        }}
      />
    );

    const addressInput = screen.getByLabelText(/street address/i);
    const cityInput = screen.getByLabelText(/city/i);

    expect(addressInput).toHaveValue('Test Address');
    expect(cityInput).toHaveValue('Test City');

    await user.clear(addressInput);
    await user.clear(cityInput);

    expect(addressInput).toHaveValue('');
    expect(cityInput).toHaveValue('');
  });

  it('should handle complete address entry', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    await user.type(screen.getByLabelText(/street address/i), '123 Main St');
    await user.type(screen.getByLabelText(/city/i), 'Los Angeles');
    await user.type(screen.getByLabelText(/state\/province/i), 'CA');
    await user.type(screen.getByLabelText(/zip\/postal code/i), '90001');
    await user.type(screen.getByLabelText(/country/i), 'United States');

    expect(screen.getByLabelText(/street address/i)).toHaveValue('123 Main St');
    expect(screen.getByLabelText(/city/i)).toHaveValue('Los Angeles');
    expect(screen.getByLabelText(/state\/province/i)).toHaveValue('CA');
    expect(screen.getByLabelText(/zip\/postal code/i)).toHaveValue('90001');
    expect(screen.getByLabelText(/country/i)).toHaveValue('United States');
  });

  it('should handle international addresses', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    await user.type(screen.getByLabelText(/street address/i), '10 Downing Street');
    await user.type(screen.getByLabelText(/city/i), 'London');
    await user.type(screen.getByLabelText(/state\/province/i), 'England');
    await user.type(screen.getByLabelText(/zip\/postal code/i), 'SW1A 2AA');
    await user.type(screen.getByLabelText(/country/i), 'United Kingdom');

    expect(screen.getByLabelText(/street address/i)).toHaveValue('10 Downing Street');
    expect(screen.getByLabelText(/city/i)).toHaveValue('London');
    expect(screen.getByLabelText(/state\/province/i)).toHaveValue('England');
    expect(screen.getByLabelText(/zip\/postal code/i)).toHaveValue('SW1A 2AA');
    expect(screen.getByLabelText(/country/i)).toHaveValue('United Kingdom');
  });

  it('should handle addresses with special characters', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const addressInput = screen.getByLabelText(/street address/i);
    await user.type(addressInput, "123 O'Brien St, Apt #5");

    expect(addressInput).toHaveValue("123 O'Brien St, Apt #5");
  });
});
