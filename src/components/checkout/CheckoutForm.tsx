import { STEP_TITLES, UI_CONSTANTS } from '@/constants';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { useCheckoutFormContext } from '@/hooks/useCheckoutFormContext';
import { submitOrder } from '@/services/checkoutService';
import { CheckoutFormProps, CheckoutFormValues } from '@/types/checkout';
import {
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Stack,
  Stepper,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCreditCard,
  IconHome,
  IconIdBadge,
} from '@tabler/icons-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { PaymentInfoSection } from './PaymentInfoSection';
import { PersonalInfoSection } from './PersonalInfoSection';
import { ShippingAddressSection } from './ShippingAddressSection';

type StepState = 'idle' | 'completed' | 'error';

export const CheckoutForm: FC<CheckoutFormProps> = ({ cartItems, onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    activeStep: savedActiveStep,
    setActiveStep: saveActiveStep,
    clearFormData,
  } = useCheckoutFormContext();
  const [activeStep, setActiveStep] = useState(savedActiveStep);
  const form = useCheckoutForm();
  const theme = useMantineTheme();

  const stepConfigs = useMemo(
    () => [
      {
        key: 'personal',
        label: STEP_TITLES.personal,
        description: 'Contact details',
        fields: ['fullName', 'email', 'phone'] as Array<keyof CheckoutFormValues>,
        icon: IconIdBadge,
        render: () => <PersonalInfoSection form={form} />,
      },
      {
        key: 'shipping',
        label: STEP_TITLES.shipping,
        description: 'Delivery address',
        fields: ['address', 'city', 'state', 'zipCode', 'country'] as Array<
          keyof CheckoutFormValues
        >,
        icon: IconHome,
        render: () => <ShippingAddressSection form={form} />,
      },
      {
        key: 'payment',
        label: STEP_TITLES.payment,
        description: 'Payment details',
        fields: ['cardNumber', 'cardName', 'expiryDate', 'cvv'] as Array<keyof CheckoutFormValues>,
        icon: IconCreditCard,
        render: () => <PaymentInfoSection form={form} />,
      },
    ],
    [form]
  );

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

  const updateStepStatus = (stepIndex: number, status: StepState) => {
    setStepStatuses((prev) => ({ ...prev, [stepIndex]: status }));
  };

  const validateStep = (stepIndex: number) => {
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
  };

  const handleNextStep = () => {
    const isValid = validateStep(activeStep);
    if (!isValid) {
      return;
    }

    const nextStep = Math.min(activeStep + 1, stepConfigs.length - 1);
    setActiveStep(nextStep);
    saveActiveStep(nextStep);
  };

  const handlePreviousStep = () => {
    const prevStep = Math.max(activeStep - 1, 0);
    setActiveStep(prevStep);
    saveActiveStep(prevStep);
  };

  const canNavigateToStep = (targetStep: number) => {
    if (targetStep <= activeStep) {
      return true;
    }

    return stepConfigs
      .slice(0, targetStep)
      .every((_step, index) => stepStatuses[index] === 'completed');
  };

  const handleStepChange = (stepIndex: number) => {
    if (canNavigateToStep(stepIndex)) {
      updateStepStatus(
        stepIndex,
        stepStatuses[stepIndex] === 'error' ? 'idle' : stepStatuses[stepIndex]
      );
      setActiveStep(stepIndex);
      saveActiveStep(stepIndex);
    }
  };

  const handleFinalSubmit = async (values: CheckoutFormValues) => {
    setIsSubmitting(true);
    try {
      const orderSummary = await submitOrder(values, cartItems);
      clearFormData();
      onSubmitSuccess(orderSummary);
    } catch (error) {
      console.error('Order submission failed:', error);
      updateStepStatus(stepConfigs.length - 1, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (values: CheckoutFormValues) => {
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
  };

  const renderStepControls = (stepIndex: number) => {
    const isLastStep = stepIndex === stepConfigs.length - 1;

    return (
      <Group justify="space-between">
        <Box>
          {stepIndex > 0 && (
            <Button
              type="button"
              variant="default"
              leftSection={<IconArrowLeft size={UI_CONSTANTS.ICON_SIZES.SM} />}
              onClick={handlePreviousStep}
            >
              Back
            </Button>
          )}
        </Box>
        <Group>
          {!isLastStep && (
            <Button
              type="button"
              rightSection={<IconArrowRight size={UI_CONSTANTS.ICON_SIZES.SM} />}
              onClick={handleNextStep}
            >
              Continue
            </Button>
          )}
          {isLastStep && (
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
              loaderProps={{ size: 'sm', color: 'white' }}
            >
              {isSubmitting ? 'Processing...' : 'Complete Order'}
            </Button>
          )}
        </Group>
      </Group>
    );
  };

  const getStepColor = (stepIndex: number) => {
    const status = stepStatuses[stepIndex];
    if (status === 'error') {
      return 'red';
    }
    if (status === 'completed') {
      return theme.primaryColor;
    }
    return theme.primaryColor;
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)} noValidate>
      <Stack gap="xl">
        <Stepper
          active={activeStep}
          onStepClick={handleStepChange}
          color={theme.primaryColor}
          allowNextStepsSelect={false}
          size="sm"
        >
          {stepConfigs.map((step, index) => {
            const IconComponent = step.icon;
            const status = stepStatuses[index];
            const isError = status === 'error';
            const StepIcon = isError ? IconAlertCircle : IconComponent;

            return (
              <Stepper.Step
                key={step.key}
                label={step.label}
                description={step.description}
                color={getStepColor(index)}
                icon={<StepIcon size={UI_CONSTANTS.ICON_SIZES.SM} stroke={UI_CONSTANTS.ICON_STROKE.BOLD} />}
                completedIcon={<IconCheck size={UI_CONSTANTS.ICON_SIZES.XS} stroke={UI_CONSTANTS.ICON_STROKE.BOLD} />}
                loading={isSubmitting && index === stepConfigs.length - 1}
                aria-invalid={isError || undefined}
              >
                <Stack gap="lg">
                  {step.render()}
                  <Stack gap="sm">
                    <Group justify="space-between" align="center">
                      <Text size="sm" c="dimmed">
                        Step {index + 1} of {stepConfigs.length}
                      </Text>
                      {stepStatuses[index] === 'completed' && (
                        <Badge color={theme.primaryColor} variant="light">
                          Validated
                        </Badge>
                      )}
                    </Group>
                    {stepStatuses[index] === 'error' && (
                      <Alert
                        variant="light"
                        color="red"
                        radius="md"
                        icon={<IconAlertCircle size={UI_CONSTANTS.ICON_SIZES.SM} />}
                      >
                        Please fix the highlighted fields before continuing.
                      </Alert>
                    )}
                    {renderStepControls(index)}
                  </Stack>
                </Stack>
              </Stepper.Step>
            );
          })}
        </Stepper>
      </Stack>
    </form>
  );
};
