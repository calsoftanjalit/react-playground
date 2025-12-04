import { Stack, Stepper, useMantineTheme } from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconCircleCheck,
  IconCreditCard,
  IconEye,
  IconTruck,
} from '@tabler/icons-react';
import { FC, useMemo } from 'react';
import { STEP_TITLES, UI_CONSTANTS } from '@/constants';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { useCheckoutFormSteps } from '@/hooks/useCheckoutFormSteps';
import { CheckoutFormProps, CheckoutFormValues } from '@/types/checkout';
import { CheckoutStepContent } from './CheckoutStepContent';
import { ConfirmationSection } from './ConfirmationSection';
import { PaymentInfoSection } from './PaymentInfoSection';
import { ReviewSection } from './ReviewSection';
import { ShippingInfoSection } from './ShippingInfoSection';
import { StepNavigationButtons } from './StepNavigationButtons';

export const CheckoutForm: FC<CheckoutFormProps> = ({ cartItems, totalPrice, onSubmitSuccess }) => {
  const form = useCheckoutForm();
  const theme = useMantineTheme();

  const stepConfigs = useMemo(
    () => [
      {
        key: 'shipping',
        label: STEP_TITLES.shipping,
        fields: ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'] as Array<keyof CheckoutFormValues>,
        icon: IconTruck,
        render: () => <ShippingInfoSection form={form} />,
      },
      {
        key: 'payment',
        label: STEP_TITLES.payment,
        fields: ['cardNumber', 'cardName', 'expiryDate', 'cvv'] as Array<keyof CheckoutFormValues>,
        icon: IconCreditCard,
        render: () => <PaymentInfoSection form={form} />,
      },
      {
        key: 'review',
        label: STEP_TITLES.review,
        fields: [] as Array<keyof CheckoutFormValues>,
        icon: IconEye,
        render: () => <ReviewSection form={form} />,
      },
      {
        key: 'confirmation',
        label: STEP_TITLES.confirmation,
        fields: [] as Array<keyof CheckoutFormValues>,
        icon: IconCircleCheck,
        render: () => <ConfirmationSection form={form} totalPrice={totalPrice} />,
      },
    ],
    [form, totalPrice]
  );

  const {
    activeStep,
    isSubmitting,
    stepStatuses,
    handleNextStep,
    handlePreviousStep,
    handleStepChange,
    handleFormSubmit,
    getStepColor,
  } = useCheckoutFormSteps({
    form,
    stepConfigs,
    cartItems,
    totalPrice,
    onSubmitSuccess,
  });

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
                color={getStepColor(index, theme.primaryColor)}
                icon={<StepIcon size={UI_CONSTANTS.ICON_SIZES.SM} stroke={UI_CONSTANTS.ICON_STROKE.BOLD} />}
                completedIcon={<IconCheck size={UI_CONSTANTS.ICON_SIZES.XS} stroke={UI_CONSTANTS.ICON_STROKE.BOLD} />}
                loading={isSubmitting && index === stepConfigs.length - 1}
                aria-invalid={isError || undefined}
              >
                <CheckoutStepContent
                  stepIndex={index}
                  totalSteps={stepConfigs.length}
                  stepStatus={stepStatuses[index]}
                  primaryColor={theme.primaryColor}
                  navigationButtons={
                    <StepNavigationButtons
                      stepIndex={index}
                      totalSteps={stepConfigs.length}
                      isSubmitting={isSubmitting}
                      onPrevious={handlePreviousStep}
                      onNext={handleNextStep}
                    />
                  }
                >
                  {step.render()}
                </CheckoutStepContent>
              </Stepper.Step>
            );
          })}
        </Stepper>
      </Stack>
    </form>
  );
};
