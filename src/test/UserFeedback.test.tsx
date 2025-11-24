import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import UserFeedBack from '@/components/miscellaneous/UserFeedBack';

vi.mock('@/utils/reviewStorage', () => ({
  saveLocalReview: vi.fn(),
}));

vi.mock('@/services/apis/queryClient', () => ({
  default: {
    invalidateQueries: vi.fn(),
  },
}));

const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => mockUUID,
  },
});

const renderWithProvider = (component: React.ReactElement) => {
  return render(<MantineProvider>{component}</MantineProvider>);
};

describe('UserFeedBack Component', () => {
  const mockProductId = 123;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Rate Product button', () => {
    renderWithProvider(<UserFeedBack productId={mockProductId} />);
    expect(screen.getByRole('button', { name: /rate product/i })).toBeInTheDocument();
  });

  it('should open modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<UserFeedBack productId={mockProductId} />);

    await user.click(screen.getByRole('button', { name: /rate product/i }));
    expect(screen.getByText(/share your experience/i)).toBeInTheDocument();
  });

  it('should show validation error for short name', async () => {
    const user = userEvent.setup();
    renderWithProvider(<UserFeedBack productId={mockProductId} />);

    await user.click(screen.getByRole('button', { name: /rate product/i }));
    await user.type(screen.getByLabelText(/your name/i), 'A');

    const buttons = screen.getAllByRole('button');
    const submitButton = buttons.find((btn) => btn.textContent?.includes('Submit Review'));
    if (submitButton) await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is too short/i)).toBeInTheDocument();
    });
  });
});
