import { useCallback, useEffect, useState } from 'react';
import type { CheckoutFormValues, StepState } from '@/types/checkout';
import type { UseCheckoutFormStepsProps } from '@/types/hooks';
import { useCheckoutFormContext } from '@/hooks/useCheckoutFormContext';
import { useAuthStore } from '@/hooks/useAuthStore';
import { submitOrder } from '@/services/checkoutService';

export const useCheckoutFormSteps = ({
  form,
  stepConfigs,
  cartItems,
  totalPrice,
  onSubmitSuccess,
}: UseCheckoutFormStepsProps) => {
  const {
    activeStep: savedActiveStep,
    setActiveStep: saveActiveStep,
    clearFormData,
  } = useCheckoutFormContext();
  
  const { user } = useAuthStore();

  const [activeStep, setActiveStep] = useState(savedActiveStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<Record<number, StepState>>(() =>
    stepConfigs.reduce(
      (acc, _step, index) => {
        acc[index] = 'idle';
        return acc;
      },
      {} as Record<number, StepState>
    )
  );

  useEffect(() => {
    setStepStatuses((prev) => {
      let hasUpdates = false;
      const next = { ...prev };

      stepConfigs.forEach((step, index) => {
        const hasFieldErrors = step.fields.some((field) => Boolean(form.errors[field]));
        if (!hasFieldErrors && next[index] === 'error') {
          next[index] = 'idle';
          hasUpdates = true;
        }
      });

      return hasUpdates ? next : prev;
    });
  }, [form.errors, stepConfigs]);

  const updateStepStatus = useCallback((stepIndex: number, status: StepState) => {
    setStepStatuses((prev) => ({ ...prev, [stepIndex]: status }));
  }, []);

  const validateStep = useCallback(
    (stepIndex: number) => {
      const step = stepConfigs[stepIndex];
      if (!step) {
        return true;
      }

      const validationResults = step.fields.map((field) => form.validateField(field));
      const hasError = validationResults.some((result) => result.hasError);

      if (hasError) {
        updateStepStatus(stepIndex, 'error');
        return false;
      }

      updateStepStatus(stepIndex, 'completed');
      return true;
    },
    [form, stepConfigs, updateStepStatus]
  );

  const handleNextStep = useCallback(() => {
    const isValid = validateStep(activeStep);
    if (!isValid) {
      return;
    }

    const nextStep = Math.min(activeStep + 1, stepConfigs.length - 1);
    setActiveStep(nextStep);
    saveActiveStep(nextStep);
  }, [activeStep, stepConfigs.length, validateStep, saveActiveStep]);

  const handlePreviousStep = useCallback(() => {
    const prevStep = Math.max(activeStep - 1, 0);
    setActiveStep(prevStep);
    saveActiveStep(prevStep);
  }, [activeStep, saveActiveStep]);

  const canNavigateToStep = useCallback(
    (targetStep: number) => {
      if (targetStep <= activeStep) {
        return true;
      }

      return stepConfigs
        .slice(0, targetStep)
        .every((_step, index) => stepStatuses[index] === 'completed');
    },
    [activeStep, stepConfigs, stepStatuses]
  );

  const handleStepChange = useCallback(
    (stepIndex: number) => {
      if (canNavigateToStep(stepIndex)) {
        updateStepStatus(
          stepIndex,
          stepStatuses[stepIndex] === 'error' ? 'idle' : stepStatuses[stepIndex]
        );
        setActiveStep(stepIndex);
        saveActiveStep(stepIndex);
      }
    },
    [canNavigateToStep, stepStatuses, updateStepStatus, saveActiveStep]
  );

  const handleFinalSubmit = useCallback(
    async (values: CheckoutFormValues) => {
      setIsSubmitting(true);
      try {
        const orderSummary = await submitOrder(values, cartItems, totalPrice, user?.id);
        clearFormData();
        onSubmitSuccess(orderSummary);
      } catch (error) {
        console.error('Order submission failed:', error);
        updateStepStatus(stepConfigs.length - 1, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [cartItems, totalPrice, user, clearFormData, onSubmitSuccess, stepConfigs.length, updateStepStatus]
  );

  const handleFormSubmit = useCallback(
    (values: CheckoutFormValues) => {
      const lastStepIndex = stepConfigs.length - 1;

      if (activeStep < lastStepIndex) {
        const isCurrentStepValid = validateStep(activeStep);
        if (isCurrentStepValid) {
          const nextStep = Math.min(activeStep + 1, lastStepIndex);
          setActiveStep(nextStep);
          saveActiveStep(nextStep);
        }
        return;
      }

      const isFinalStepValid = validateStep(lastStepIndex);
      if (!isFinalStepValid) {
        setActiveStep(lastStepIndex);
        saveActiveStep(lastStepIndex);
        return;
      }

      void handleFinalSubmit(values);
    },
    [activeStep, stepConfigs.length, validateStep, saveActiveStep, handleFinalSubmit]
  );

  const getStepColor = useCallback(
    (stepIndex: number, primaryColor: string) => {
      const status = stepStatuses[stepIndex];
      if (status === 'error') {
        return 'red';
      }
      if (status === 'completed') {
        return primaryColor;
      }
      return primaryColor;
    },
    [stepStatuses]
  );

  return {
    activeStep,
    isSubmitting,
    stepStatuses,
    handleNextStep,
    handlePreviousStep,
    handleStepChange,
    handleFormSubmit,
    getStepColor,
  };
};
