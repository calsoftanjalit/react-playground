export const formatPrice = (value: number): string => {
  return value.toFixed(2);
};

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

export const formatCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
};

export const formatFullAddress = (
  address: string,
  city: string,
  state: string,
  zipCode: string,
  country: string
): string => {
  return `${address}, ${city}, ${state} ${zipCode}, ${country}`;
};

export const formatOrderDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

