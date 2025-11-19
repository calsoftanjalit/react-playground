import { StepErrorAlert } from '@/components/checkout/StepErrorAlert';
import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const renderStepErrorAlert = (props: Partial<React.ComponentProps<typeof StepErrorAlert>> = {}) => {
  return render(
    <MantineProvider>
      <StepErrorAlert {...props} />
    </MantineProvider>
  );
};

describe('StepErrorAlert', () => {
  describe('Rendering', () => {
    it('displays default error message', () => {
      renderStepErrorAlert();

      expect(
        screen.getByText('Please fix the highlighted fields before continuing.')
      ).toBeInTheDocument();
    });

    it('displays custom error message when provided', () => {
      const customMessage = 'Custom validation error occurred';
      renderStepErrorAlert({ message: customMessage });

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('renders alert icon', () => {
      const { container } = renderStepErrorAlert();

      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

    it('has correct alert styling', () => {
      const { container } = renderStepErrorAlert();

      const alertElement = container.querySelector('[role="alert"]');
      expect(alertElement).toBeInTheDocument();
    });
  });

  describe('Message Variations', () => {
    it('handles empty message string', () => {
      renderStepErrorAlert({ message: '' });

      const alert = screen.queryByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('handles long error messages', () => {
      const longMessage = 'This is a very long error message '.repeat(10);
      renderStepErrorAlert({ message: longMessage });

      expect(screen.getByText(/This is a very long error message/)).toBeInTheDocument();
    });

    it('handles messages with special characters', () => {
      const specialMessage = 'Error: Field "email" is invalid!';
      renderStepErrorAlert({ message: specialMessage });

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('handles multiline messages', () => {
      const multilineMessage = 'Line 1\nLine 2\nLine 3';
      renderStepErrorAlert({ message: multilineMessage });

      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
      expect(screen.getByText(/Line 2/)).toBeInTheDocument();
      expect(screen.getByText(/Line 3/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders without crashing when no props provided', () => {
      expect(() => renderStepErrorAlert()).not.toThrow();
    });

    it('updates message when prop changes', () => {
      const { rerender } = renderStepErrorAlert({ message: 'First message' });

      expect(screen.getByText('First message')).toBeInTheDocument();

      rerender(
        <MantineProvider>
          <StepErrorAlert message="Second message" />
        </MantineProvider>
      );

      expect(screen.getByText('Second message')).toBeInTheDocument();
      expect(screen.queryByText('First message')).not.toBeInTheDocument();
    });

    it('handles undefined message by using default', () => {
      renderStepErrorAlert({ message: undefined });

      expect(
        screen.getByText('Please fix the highlighted fields before continuing.')
      ).toBeInTheDocument();
    });
  });
});
