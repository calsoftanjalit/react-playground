import { StepProgress } from '@/components/checkout/StepProgress';
import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const renderStepProgress = (props: Partial<React.ComponentProps<typeof StepProgress>> = {}) => {
  const defaultProps = {
    currentStep: 1,
    totalSteps: 3,
    isCompleted: false,
    primaryColor: 'blue',
  };

  return render(
    <MantineProvider>
      <StepProgress {...defaultProps} {...props} />
    </MantineProvider>
  );
};

describe('StepProgress', () => {
  describe('Rendering', () => {
    it('displays current step and total steps', () => {
      renderStepProgress({ currentStep: 1, totalSteps: 3 });

      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    });

    it('updates step text when props change', () => {
      const { rerender } = renderStepProgress({ currentStep: 2, totalSteps: 4 });

      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();

      rerender(
        <MantineProvider>
          <StepProgress currentStep={3} totalSteps={4} isCompleted={false} primaryColor="blue" />
        </MantineProvider>
      );

      expect(screen.getByText('Step 3 of 4')).toBeInTheDocument();
    });

    it('shows validated badge when step is completed', () => {
      renderStepProgress({ isCompleted: true });

      expect(screen.getByText('Validated')).toBeInTheDocument();
    });

    it('does not show validated badge when step is not completed', () => {
      renderStepProgress({ isCompleted: false });

      expect(screen.queryByText('Validated')).not.toBeInTheDocument();
    });

    it('displays first step correctly', () => {
      renderStepProgress({ currentStep: 1, totalSteps: 5 });

      expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
    });

    it('displays last step correctly', () => {
      renderStepProgress({ currentStep: 5, totalSteps: 5 });

      expect(screen.getByText('Step 5 of 5')).toBeInTheDocument();
    });

    it('handles single step scenario', () => {
      renderStepProgress({ currentStep: 1, totalSteps: 1 });

      expect(screen.getByText('Step 1 of 1')).toBeInTheDocument();
    });
  });

  describe('Badge Color', () => {
    it('applies primary color to validated badge', () => {
      renderStepProgress({ isCompleted: true, primaryColor: 'green' });

      const badge = screen.getByText('Validated');
      expect(badge).toBeInTheDocument();
    });

    it('shows badge with different primary colors', () => {
      const colors = ['blue', 'green', 'red', 'purple'];

      colors.forEach((color) => {
        const { unmount } = renderStepProgress({ isCompleted: true, primaryColor: color });
        expect(screen.getByText('Validated')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles large step numbers', () => {
      renderStepProgress({ currentStep: 99, totalSteps: 100 });

      expect(screen.getByText('Step 99 of 100')).toBeInTheDocument();
    });

    it('handles step progression', () => {
      const { rerender } = renderStepProgress({ currentStep: 1, totalSteps: 3, isCompleted: false });

      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
      expect(screen.queryByText('Validated')).not.toBeInTheDocument();

      rerender(
        <MantineProvider>
          <StepProgress currentStep={1} totalSteps={3} isCompleted={true} primaryColor="blue" />
        </MantineProvider>
      );

      expect(screen.getByText('Validated')).toBeInTheDocument();

      rerender(
        <MantineProvider>
          <StepProgress currentStep={2} totalSteps={3} isCompleted={false} primaryColor="blue" />
        </MantineProvider>
      );

      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
      expect(screen.queryByText('Validated')).not.toBeInTheDocument();
    });
  });
});
