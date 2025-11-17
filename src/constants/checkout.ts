export const VALIDATION_PATTERNS = {
  EMAIL: /^\S+@\S+\.\S+$/,
  PHONE: /^[0-9]{10,}$/,
  NAME: /^[a-zA-Z\s'-]+$/,
  ZIP_CODE: /^[0-9]{5,}$/,
  CARD_NUMBER: /^[0-9]{16}$/,
  EXPIRY_DATE: /^(0[1-9]|1[0-2])\/[0-9]{2}$/,
  CVV: /^[0-9]{3,4}$/,
  ONLY_NUMBERS: /^\d+$/,
  HAS_LETTER: /[a-zA-Z]/,
} as const;

export const FIELD_LENGTH = {
  MIN_NAME: 2,
  MIN_ADDRESS: 5,
  MIN_CITY: 2,
  MIN_STATE: 2,
  MIN_COUNTRY: 2,
} as const;

export const VALIDATION_MESSAGES = {
  NAME_INVALID_CHARS: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  NAME_ONLY_NUMBERS: 'Name cannot be only numbers',

  ADDRESS_TOO_SHORT: 'Address must be at least 5 characters',
  ADDRESS_NO_LETTER: 'Address must contain at least one letter',

  EMAIL_INVALID: 'Invalid email address',
  PHONE_INVALID: 'Phone number must be at least 10 digits',

  CARD_NUMBER_INVALID: 'Card number must be 16 digits',
  EXPIRY_DATE_INVALID: 'Expiry date must be in MM/YY format',
  CVV_INVALID: 'CVV must be 3 or 4 digits',

  ZIP_CODE_INVALID: 'Invalid ZIP code',
  FIELD_TOO_SHORT: (field: string, min: number) => `${field} must be at least ${min} characters`,
} as const;

export const ORDER_CONSTANTS = {
  TAX_RATE: 0.09,
  SHIPPING_COST: 10,
  FREE_SHIPPING_THRESHOLD: 100,
  CURRENCY_SYMBOL: '$',
} as const;

export const UI_CONSTANTS = {
  ICON_SIZES: {
    XS: 14,
    SM: 16,
    MD: 18,
    LG: 20,
    XL: 24,
    XXL: 56,
  },
  ICON_STROKE: {
    NORMAL: 2,
    BOLD: 2.5,
    EXTRA_BOLD: 3,
  },
  COLORS: {
    SUCCESS: 'var(--mantine-color-green-6)',
    SUCCESS_TEXT: 'green',
    ERROR: 'var(--mantine-color-red-6)',
    PRIMARY: 'var(--mantine-color-blue-6)',
    WHITE: 'white',
  },
} as const;

export const STEP_TITLES = {
  personal: 'Personal Information',
  shipping: 'Shipping Address',
  payment: 'Payment Information',
} as const;

export const CHECKOUT_STEPS = {
  PERSONAL: 'personal',
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
} as const;

