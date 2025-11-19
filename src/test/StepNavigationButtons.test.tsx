import { StepNavigationButtons } from '@/components/checkout/StepNavigationButtons';
import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const renderStepNavigationButtons = (
  props: Partial<React.ComponentProps<typeof StepNavigationButtons>> = {}
) => {
  const defaultProps = {
    stepIndex: 0,
    totalSteps: 3,
    isSubmitting: false,
    onPrevious: vi.fn(),
    onNext: vi.fn(),
  };

  return render(
    <MantineProvider>
      <StepNavigationButtons {...defaultProps} {...props} />
    </MantineProvider>
  );
};

describe('StepNavigationButtons', () => {
  describe('First Step', () => {
    it('does not show Back button on first step', () => {
      renderStepNavigationButtons({ stepIndex: 0 });

      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    });

    it('shows Continue button on first step', () => {
      renderStepNavigationButtons({ stepIndex: 0 });

      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('calls onNext when Continue button is clicked', async () => {
      const onNext = vi.fn();
      const user = userEvent.setup();

      renderStepNavigationButtons({ stepIndex: 0, onNext });

      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Middle Steps', () => {
    it('shows both Back and Continue buttons on middle step', () => {
      renderStepNavigationButtons({ stepIndex: 1, totalSteps: 3 });

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('calls onPrevious when Back button is clicked', async () => {
      const onPrevious = vi.fn();
      const user = userEvent.setup();

      renderStepNavigationButtons({ stepIndex: 1, onPrevious });

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(onPrevious).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when Continue button is clicked', async () => {
      const onNext = vi.fn();
      const user = userEvent.setup();

      renderStepNavigationButtons({ stepIndex: 1, onNext });

      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Last Step', () => {
    it('shows Back button on last step', () => {
      renderStepNavigationButtons({ stepIndex: 2, totalSteps: 3 });

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('shows Complete Order button instead of Continue on last step', () => {
      renderStepNavigationButtons({ stepIndex: 2, totalSteps: 3 });

      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /complete order/i })).toBeInTheDocument();
    });

    it('Complete Order button has submit type', () => {
      renderStepNavigationButtons({ stepIndex: 2, totalSteps: 3 });

      const submitButton = screen.getByRole('button', { name: /complete order/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('disables Complete Order button when submitting', () => {
      renderStepNavigationButtons({ stepIndex: 2, totalSteps: 3, isSubmitting: true });

      const submitButton = screen.getByRole('button', { name: /processing/i });
      expect(submitButton).toBeDisabled();
    });

    it('shows Processing text when submitting', () => {
      renderStepNavigationButtons({ stepIndex: 2, totalSteps: 3, isSubmitting: true });

      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('shows Complete Order text when not submitting', () => {
      renderStepNavigationButtons({ stepIndex: 2, totalSteps: 3, isSubmitting: false });

      expect(screen.getByText('Complete Order')).toBeInTheDocument();
    });
  });

  describe('Button Types', () => {
    it('Back button has button type', () => {
      renderStepNavigationButtons({ stepIndex: 1 });

      const backButton = screen.getByRole('button', { name: /back/i });
      expect(backButton).toHaveAttribute('type', 'button');
    });

    it('Continue button has button type', () => {
      renderStepNavigationButtons({ stepIndex: 0 });

      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(continueButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Multiple Steps Scenario', () => {
    it('handles 5-step form correctly', () => {
      const { rerender } = renderStepNavigationButtons({ stepIndex: 0, totalSteps: 5 });

      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();

      rerender(
        <MantineProvider>
          <StepNavigationButtons
            stepIndex={2}
            totalSteps={5}
            isSubmitting={false}
            onPrevious={vi.fn()}
            onNext={vi.fn()}
          />
        </MantineProvider>
      );

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();

      rerender(
        <MantineProvider>
          <StepNavigationButtons
            stepIndex={4}
            totalSteps={5}
            isSubmitting={false}
            onPrevious={vi.fn()}
            onNext={vi.fn()}
          />
        </MantineProvider>
      );

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /complete order/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single-step form', () => {
      renderStepNavigationButtons({ stepIndex: 0, totalSteps: 1 });

      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /complete order/i })).toBeInTheDocument();
    });

    it('does not call handlers when buttons are disabled', async () => {
      const onNext = vi.fn();
      const user = userEvent.setup();

      renderStepNavigationButtons({ stepIndex: 2, totalSteps: 3, isSubmitting: true, onNext });

      const submitButton = screen.getByRole('button', { name: /processing/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    it('renders icons with buttons', () => {
      const { container } = renderStepNavigationButtons({ stepIndex: 1, totalSteps: 3 });

      const svgElements = container.querySelectorAll('svg');
      expect(svgElements.length).toBeGreaterThan(0);
    });
  });

  describe('Callback Invocations', () => {
    it('does not call onPrevious when Continue is clicked', async () => {
      const onPrevious = vi.fn();
      const onNext = vi.fn();
      const user = userEvent.setup();

      renderStepNavigationButtons({ stepIndex: 1, onPrevious, onNext });

      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      expect(onNext).toHaveBeenCalledTimes(1);
      expect(onPrevious).not.toHaveBeenCalled();
    });

    it('does not call onNext when Back is clicked', async () => {
      const onPrevious = vi.fn();
      const onNext = vi.fn();
      const user = userEvent.setup();

      renderStepNavigationButtons({ stepIndex: 1, onPrevious, onNext });

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(onPrevious).toHaveBeenCalledTimes(1);
      expect(onNext).not.toHaveBeenCalled();
    });
  });
});
