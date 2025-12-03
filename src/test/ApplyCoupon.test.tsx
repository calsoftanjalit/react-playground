import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import ApplyCoupon from '@/components/checkout/ApplyCoupon';

const renderWithMantine = (ui: React.ReactNode) => render(<MantineProvider>{ui}</MantineProvider>);

describe('ApplyCoupon Component', () => {
  let mockApplyCoupon: ReturnType<typeof vi.fn>;
  let mockRemoveCoupon: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockApplyCoupon = vi.fn<(code: string) => { isValid: boolean; message: string }>();
    mockRemoveCoupon = vi.fn<() => void>();
  });

  it('renders CTA button when no coupon is applied', () => {
    renderWithMantine(<ApplyCoupon onApplyCoupon={mockApplyCoupon} appliedCoupon={null} />);

    expect(screen.getByText('Have a Coupon Code?')).toBeInTheDocument();
  });

  it('opens modal when CTA button is clicked', () => {
    renderWithMantine(<ApplyCoupon onApplyCoupon={mockApplyCoupon} appliedCoupon={null} />);

    fireEvent.click(screen.getByText('Have a Coupon Code?'));

    // search inside portal
    const modal = within(document.body);
    expect(modal.getByText('Apply Coupon Code')).toBeInTheDocument();
  });

  it('updates coupon input value', () => {
    renderWithMantine(<ApplyCoupon onApplyCoupon={mockApplyCoupon} appliedCoupon={null} />);

    fireEvent.click(screen.getByText('Have a Coupon Code?'));

    const modal = within(document.body);
    const input = modal.getByPlaceholderText('Enter your coupon code');

    fireEvent.change(input, { target: { value: 'SAVE10' } });

    expect((input as HTMLInputElement).value).toBe('SAVE10');
  });

  it('calls onApplyCoupon and shows validation message', () => {
    mockApplyCoupon.mockReturnValue({
      isValid: true,
      message: 'Coupon Applied Successfully',
    });

    renderWithMantine(
      <ApplyCoupon
        onApplyCoupon={mockApplyCoupon}
        appliedCoupon={null}
        onRemoveCoupon={mockRemoveCoupon}
      />
    );

    fireEvent.click(screen.getByText('Have a Coupon Code?'));

    const modal = within(document.body);
    const input = modal.getByPlaceholderText('Enter your coupon code');

    fireEvent.change(input, { target: { value: 'SAVE10' } });

    fireEvent.click(modal.getByText('Apply Coupon'));

    expect(mockApplyCoupon).toHaveBeenCalledWith('SAVE10');
    expect(modal.getByText('Coupon Applied Successfully')).toBeInTheDocument();
  });

  it('renders applied coupon UI when coupon is already applied', () => {
    renderWithMantine(
      <ApplyCoupon onApplyCoupon={mockApplyCoupon} appliedCoupon={{ code: 'SAVE10' }} />
    );

    expect(screen.getByText('Coupon Applied: SAVE10')).toBeInTheDocument();
  });

  it('calls onRemoveCoupon when remove button is clicked', () => {
    renderWithMantine(
      <ApplyCoupon
        onApplyCoupon={mockApplyCoupon}
        appliedCoupon={{ code: 'SAVE10' }}
        onRemoveCoupon={mockRemoveCoupon}
      />
    );

    fireEvent.click(screen.getByText('Remove'));

    expect(mockRemoveCoupon).toHaveBeenCalled();
  });
});
