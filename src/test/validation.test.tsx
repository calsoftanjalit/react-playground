import {
    addressValidator,
    createNameValidator,
    cvvValidator,
    emailValidator,
    phoneValidator,
    validateCardNumber,
    validateExpiryDate,
    zipCodeValidator,
} from '@/utils/validation';
import { describe, expect, it } from 'vitest';

describe('validation utilities', () => {
  describe('createNameValidator', () => {
    const nameValidator = createNameValidator('Name');

    it('should return null for valid name', () => {
      expect(nameValidator('John Doe')).toBeNull();
      expect(nameValidator("O'Brien")).toBeNull();
      expect(nameValidator('Mary-Jane')).toBeNull();
    });

    it('should return error for empty name', () => {
      expect(nameValidator('')).toBeTruthy();
    });

    it('should return error for name that is too short', () => {
      expect(nameValidator('A')).toBeTruthy();
    });

    it('should return error for name with invalid characters', () => {
      const result = nameValidator('John123');
      expect(result).toBeTruthy();
      expect(result).toContain('letters, spaces, hyphens, and apostrophes');
    });

    it('should return null for valid name with special characters', () => {
      const result = nameValidator("Mary-Jane O'Brien");
      expect(result).toBeNull();
    });

    it('should return error for name with only numbers', () => {
      const result = nameValidator('12345');
      expect(result).toBeTruthy();
    });

    it('should use custom field label', () => {
      const customValidator = createNameValidator('First Name');
      const result = customValidator('');
      expect(result).toContain('First Name');
    });

    it('should use custom min length', () => {
      const customValidator = createNameValidator('Name', 5);
      const result = customValidator('John');
      expect(result).toContain('at least 5');
    });
  });

  describe('emailValidator', () => {
    it('should return null for valid email', () => {
      expect(emailValidator('test@example.com')).toBeNull();
      expect(emailValidator('user.name@domain.co.uk')).toBeNull();
    });

    it('should return error for invalid email', () => {
      expect(emailValidator('invalid')).toBeTruthy();
      expect(emailValidator('test@')).toBeTruthy();
      expect(emailValidator('@domain.com')).toBeTruthy();
    });
  });

  describe('phoneValidator', () => {
    it('should return null for valid phone number', () => {
      expect(phoneValidator('1234567890')).toBeNull();
      expect(phoneValidator('123-456-7890')).toBeNull();
      expect(phoneValidator('(123) 456-7890')).toBeNull();
    });

    it('should return error for empty phone', () => {
      expect(phoneValidator('')).toBeTruthy();
    });

    it('should return error for phone with less than 10 digits', () => {
      expect(phoneValidator('123456789')).toBeTruthy();
      expect(phoneValidator('12345')).toBeTruthy();
    });
  });

  describe('addressValidator', () => {
    it('should return null for valid address', () => {
      expect(addressValidator('123 Main Street')).toBeNull();
      expect(addressValidator('456 Oak Avenue, Apt 2B')).toBeNull();
    });

    it('should return error for empty address', () => {
      expect(addressValidator('')).toBeTruthy();
    });

    it('should return error for address that is too short', () => {
      const result = addressValidator('123');
      expect(result).toBeTruthy();
      expect(result).toContain('at least 5');
    });

    it('should return error for address with no letters', () => {
      const result = addressValidator('12345');
      expect(result).toBe('Address must contain at least one letter');
    });
  });

  describe('zipCodeValidator', () => {
    it('should return null for valid ZIP code', () => {
      expect(zipCodeValidator('12345')).toBeNull();
      expect(zipCodeValidator('123456')).toBeNull();
    });

    it('should return error for empty ZIP code', () => {
      expect(zipCodeValidator('')).toBeTruthy();
    });

    it('should return error for invalid ZIP code', () => {
      expect(zipCodeValidator('1234')).toBeTruthy();
      expect(zipCodeValidator('abcde')).toBeTruthy();
    });
  });

  describe('cvvValidator', () => {
    it('should return null for valid CVV', () => {
      expect(cvvValidator('123')).toBeNull();
      expect(cvvValidator('1234')).toBeNull();
    });

    it('should return error for empty CVV', () => {
      expect(cvvValidator('')).toBeTruthy();
    });

    it('should return error for invalid CVV', () => {
      expect(cvvValidator('12')).toBeTruthy();
      expect(cvvValidator('12345')).toBeTruthy();
      expect(cvvValidator('abc')).toBeTruthy();
    });
  });

  describe('validateCardNumber', () => {
    it('should return null for valid card number', () => {
      expect(validateCardNumber('1234567890123456')).toBeNull();
      expect(validateCardNumber('1234 5678 9012 3456')).toBeNull();
    });

    it('should return error for invalid card number', () => {
      expect(validateCardNumber('123456789012345')).toBeTruthy();
      expect(validateCardNumber('12345678901234567')).toBeTruthy();
      expect(validateCardNumber('abcd1234efgh5678')).toBeTruthy();
    });
  });

  describe('validateExpiryDate', () => {
    it('should return null for valid future expiry date', () => {
      const futureYear = (new Date().getFullYear() + 5) % 100;
      const futureYearStr = futureYear.toString().padStart(2, '0');
      expect(validateExpiryDate(`12/${futureYearStr}`)).toBeNull();
    });

    it('should return error for invalid format', () => {
      expect(validateExpiryDate('13/25')).toBeTruthy();
      expect(validateExpiryDate('1/25')).toBeTruthy();
      expect(validateExpiryDate('12/2025')).toBeTruthy();
    });

    it('should return error for invalid month greater than 12', () => {
      const futureYear = (new Date().getFullYear() + 1) % 100;
      const futureYearStr = futureYear.toString().padStart(2, '0');
      const result = validateExpiryDate(`13/${futureYearStr}`);
      expect(result).toBe('Expiry date must be in MM/YY format');
    });

    it('should return error for month 00', () => {
      const futureYear = (new Date().getFullYear() + 1) % 100;
      const futureYearStr = futureYear.toString().padStart(2, '0');
      const result = validateExpiryDate(`00/${futureYearStr}`);
      expect(result).toBe('Expiry date must be in MM/YY format');
    });

    it('should return error for expired card', () => {
      const result = validateExpiryDate('01/20');
      expect(result).toBe('Card has expired');
    });

    it('should return error for card expiring this year in past month', () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (currentMonth > 1) {
        const pastMonth = (currentMonth - 1).toString().padStart(2, '0');
        const yearStr = currentYear.toString().padStart(2, '0');
        const result = validateExpiryDate(`${pastMonth}/${yearStr}`);
        expect(result).toBe('Card has expired');
      }
    });

    it('should accept current month and year', () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      const monthStr = currentMonth.toString().padStart(2, '0');
      const yearStr = currentYear.toString().padStart(2, '0');
      
      expect(validateExpiryDate(`${monthStr}/${yearStr}`)).toBeNull();
    });
  });
});
