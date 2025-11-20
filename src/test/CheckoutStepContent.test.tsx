import { CheckoutStepContent } from '@/components/checkout/CheckoutStepContent';
import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const renderCheckoutStepContent = (
  props: Partial<React.ComponentProps<typeof CheckoutStepContent>> = {}
) => {
  const defaultProps = {
    stepIndex: 0,
    totalSteps: 3,
    stepStatus: 'idle' as const,
    primaryColor: 'blue',
    children: <div>Test Content</div>,
    navigationButtons: <div>Navigation Buttons</div>,
  };

  return render(
    <MantineProvider>
      <CheckoutStepContent {...defaultProps} {...props} />
    </MantineProvider>
  );
};

describe('CheckoutStepContent', () => {
  describe('Rendering', () => {
    it('renders children content', () => {
      renderCheckoutStepContent();

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders navigation buttons', () => {
      renderCheckoutStepContent();

      expect(screen.getByText('Navigation Buttons')).toBeInTheDocument();
    });

    it('renders step progress component', () => {
      renderCheckoutStepContent({ stepIndex: 0, totalSteps: 3 });

      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    });

    it('renders all sections in correct layout', () => {
      renderCheckoutStepContent();

      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
      expect(screen.getByText('Navigation Buttons')).toBeInTheDocument();
    });
  });

  describe('Step Status - Idle', () => {
    it('does not show validated badge when status is idle', () => {
      renderCheckoutStepContent({ stepStatus: 'idle' });

      expect(screen.queryByText('Validated')).not.toBeInTheDocument();
    });

    it('does not show error alert when status is idle', () => {
      renderCheckoutStepContent({ stepStatus: 'idle' });

      expect(
        screen.queryByText('Please fix the highlighted fields before continuing.')
      ).not.toBeInTheDocument();
    });
  });

  describe('Step Status - Completed', () => {
    it('shows validated badge when status is completed', () => {
      renderCheckoutStepContent({ stepStatus: 'completed' });

      expect(screen.getByText('Validated')).toBeInTheDocument();
    });

    it('does not show error alert when status is completed', () => {
      renderCheckoutStepContent({ stepStatus: 'completed' });

      expect(
        screen.queryByText('Please fix the highlighted fields before continuing.')
      ).not.toBeInTheDocument();
    });
  });

  describe('Step Status - Error', () => {
    it('shows error alert when status is error', () => {
      renderCheckoutStepContent({ stepStatus: 'error' });

      expect(
        screen.getByText('Please fix the highlighted fields before continuing.')
      ).toBeInTheDocument();
    });

    it('does not show validated badge when status is error', () => {
      renderCheckoutStepContent({ stepStatus: 'error' });

      expect(screen.queryByText('Validated')).not.toBeInTheDocument();
    });

    it('renders error alert with proper styling', () => {
      const { container } = renderCheckoutStepContent({ stepStatus: 'error' });

      const alertElement = container.querySelector('[role="alert"]');
      expect(alertElement).toBeInTheDocument();
    });
  });

  describe('Step Progress', () => {
    it('displays correct step number for first step', () => {
      renderCheckoutStepContent({ stepIndex: 0, totalSteps: 3 });

      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    });

    it('displays correct step number for middle step', () => {
      renderCheckoutStepContent({ stepIndex: 1, totalSteps: 3 });

      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    });

    it('displays correct step number for last step', () => {
      renderCheckoutStepContent({ stepIndex: 2, totalSteps: 3 });

      expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
    });

    it('handles multi-step forms correctly', () => {
      renderCheckoutStepContent({ stepIndex: 4, totalSteps: 5 });

      expect(screen.getByText('Step 5 of 5')).toBeInTheDocument();
    });
  });

  describe('Children Rendering', () => {
    it('renders complex children components', () => {
      const complexChildren = (
        <div>
          <h2>Form Section</h2>
          <input type="text" placeholder="Name" />
          <button type="button">Submit</button>
        </div>
      );

      renderCheckoutStepContent({ children: complexChildren });

      expect(screen.getByText('Form Section')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('renders multiple child elements', () => {
      const multipleChildren = (
        <>
          <div>Section 1</div>
          <div>Section 2</div>
          <div>Section 3</div>
        </>
      );

      renderCheckoutStepContent({ children: multipleChildren });

      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Section 3')).toBeInTheDocument();
    });

    it('renders text content as children', () => {
      renderCheckoutStepContent({ children: 'Simple text content' });

      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });
  });

  describe('Navigation Buttons Rendering', () => {
    it('renders custom navigation buttons', () => {
      const customButtons = (
        <div>
          <button type="button">Custom Back</button>
          <button type="button">Custom Next</button>
        </div>
      );

      renderCheckoutStepContent({ navigationButtons: customButtons });

      expect(screen.getByRole('button', { name: /custom back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /custom next/i })).toBeInTheDocument();
    });

    it('renders complex button layouts', () => {
      const complexButtons = (
        <div>
          <button type="button">Save Draft</button>
          <button type="button">Back</button>
          <button type="submit">Submit</button>
        </div>
      );

      renderCheckoutStepContent({ navigationButtons: complexButtons });

      expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
  });

  describe('Primary Color', () => {
    it('passes primary color to StepProgress', () => {
      renderCheckoutStepContent({ stepStatus: 'completed', primaryColor: 'green' });

      expect(screen.getByText('Validated')).toBeInTheDocument();
    });

    it('handles different color values', () => {
      const colors = ['blue', 'red', 'green', 'purple'];

      colors.forEach((color) => {
        const { unmount } = renderCheckoutStepContent({
          stepStatus: 'completed',
          primaryColor: color,
        });
        expect(screen.getByText('Validated')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('State Transitions', () => {
    it('transitions from idle to completed', () => {
      const { rerender } = renderCheckoutStepContent({ stepStatus: 'idle' });

      expect(screen.queryByText('Validated')).not.toBeInTheDocument();

      rerender(
        <MantineProvider>
          <CheckoutStepContent
            stepIndex={0}
            totalSteps={3}
            stepStatus="completed"
            primaryColor="blue"
            children={<div>Test Content</div>}
            navigationButtons={<div>Navigation Buttons</div>}
          />
        </MantineProvider>
      );

      expect(screen.getByText('Validated')).toBeInTheDocument();
    });

    it('transitions from idle to error', () => {
      const { rerender } = renderCheckoutStepContent({ stepStatus: 'idle' });

      expect(
        screen.queryByText('Please fix the highlighted fields before continuing.')
      ).not.toBeInTheDocument();

      rerender(
        <MantineProvider>
          <CheckoutStepContent
            stepIndex={0}
            totalSteps={3}
            stepStatus="error"
            primaryColor="blue"
            children={<div>Test Content</div>}
            navigationButtons={<div>Navigation Buttons</div>}
          />
        </MantineProvider>
      );

      expect(
        screen.getByText('Please fix the highlighted fields before continuing.')
      ).toBeInTheDocument();
    });

    it('transitions from error to completed', () => {
      const { rerender } = renderCheckoutStepContent({ stepStatus: 'error' });

      expect(
        screen.getByText('Please fix the highlighted fields before continuing.')
      ).toBeInTheDocument();

      rerender(
        <MantineProvider>
          <CheckoutStepContent
            stepIndex={0}
            totalSteps={3}
            stepStatus="completed"
            primaryColor="blue"
            children={<div>Test Content</div>}
            navigationButtons={<div>Navigation Buttons</div>}
          />
        </MantineProvider>
      );

      expect(
        screen.queryByText('Please fix the highlighted fields before continuing.')
      ).not.toBeInTheDocument();
      expect(screen.getByText('Validated')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single-step form', () => {
      renderCheckoutStepContent({ stepIndex: 0, totalSteps: 1 });

      expect(screen.getByText('Step 1 of 1')).toBeInTheDocument();
    });

    it('handles empty children gracefully', () => {
      renderCheckoutStepContent({ children: null });

      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
      expect(screen.getByText('Navigation Buttons')).toBeInTheDocument();
    });

    it('renders without errors when all props provided', () => {
      expect(() => renderCheckoutStepContent()).not.toThrow();
    });
  });
});
