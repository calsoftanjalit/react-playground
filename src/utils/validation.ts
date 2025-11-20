import { FIELD_LENGTH, VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '@/constants/checkout';
import { hasLength, isEmail, isNotEmpty, matches } from '@mantine/form';

export const createNameValidator = (
  fieldLabel: string,
  minLength: number = FIELD_LENGTH.MIN_NAME
) => {
  return (value: string) => {
    const notEmpty = isNotEmpty(`${fieldLabel} is required`)(value);
    if (notEmpty) return notEmpty;

    const lengthCheck = hasLength(
      { min: minLength },
      VALIDATION_MESSAGES.FIELD_TOO_SHORT(fieldLabel, minLength)
    )(value);
    if (lengthCheck) return lengthCheck;

    const validChars = matches(
      VALIDATION_PATTERNS.NAME,
      VALIDATION_MESSAGES.NAME_INVALID_CHARS
    )(value);
    if (validChars) return validChars;

    if (VALIDATION_PATTERNS.ONLY_NUMBERS.test(value)) {
      return VALIDATION_MESSAGES.NAME_ONLY_NUMBERS;
    }

    return null;
  };
};

export const emailValidator = isEmail(VALIDATION_MESSAGES.EMAIL_INVALID);

export const phoneValidator = (value: string) => {
  const notEmpty = isNotEmpty('Phone number is required')(value);
  if (notEmpty) return notEmpty;

  const cleaned = value.replace(/[\s\-()]/g, '');
  return matches(VALIDATION_PATTERNS.PHONE, VALIDATION_MESSAGES.PHONE_INVALID)(cleaned);
};


export const addressValidator = (value: string) => {
  const notEmpty = isNotEmpty('Address is required')(value);
  if (notEmpty) return notEmpty;

  const lengthCheck = hasLength(
    { min: FIELD_LENGTH.MIN_ADDRESS },
    VALIDATION_MESSAGES.ADDRESS_TOO_SHORT
  )(value);
  if (lengthCheck) return lengthCheck;

  if (!VALIDATION_PATTERNS.HAS_LETTER.test(value)) {
    return VALIDATION_MESSAGES.ADDRESS_NO_LETTER;
  }

  return null;
};

export const zipCodeValidator = (value: string) => {
  const notEmpty = isNotEmpty('ZIP code is required')(value);
  if (notEmpty) return notEmpty;

  return matches(VALIDATION_PATTERNS.ZIP_CODE, VALIDATION_MESSAGES.ZIP_CODE_INVALID)(value);
};

export const cvvValidator = (value: string) => {
  const notEmpty = isNotEmpty('CVV is required')(value);
  if (notEmpty) return notEmpty;

  return matches(VALIDATION_PATTERNS.CVV, VALIDATION_MESSAGES.CVV_INVALID)(value);
};

export const validateCardNumber = (value: string): string | null => {
  const cleanedValue = value.replace(/\s/g, '');
  return VALIDATION_PATTERNS.CARD_NUMBER.test(cleanedValue)
    ? null
    : VALIDATION_MESSAGES.CARD_NUMBER_INVALID;
};

export const validateExpiryDate = (value: string): string | null => {
  if (!VALIDATION_PATTERNS.EXPIRY_DATE.test(value)) {
    return VALIDATION_MESSAGES.EXPIRY_DATE_INVALID;
  }

  const [month, year] = value.split('/').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (month < 1 || month > 12) {
    return 'Invalid month (must be 01-12)';
  }

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }

  return null;
};

