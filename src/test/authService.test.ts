import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login, logout, verifyToken } from '@/services/authService';
import { MOCK_USERS } from '@/constants/auth';

describe('authService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('login', () => {
    it('should return user and token for valid credentials', async () => {
      const validUser = MOCK_USERS[0];
      const credentials = {
        username: validUser.username,
        password: validUser.password,
      };

      const promise = login(credentials);
      
      await vi.advanceTimersByTimeAsync(1000);
      
      const response = await promise;

      expect(response.user).toEqual({
        id: validUser.id,
        email: validUser.email,
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        username: validUser.username,
        image: validUser.image,
      });
      expect(response.token).toBeDefined();
      expect(response.token).toContain(`mock_jwt_token_${validUser.id}_`);
    });

    it('should throw error for invalid credentials', async () => {
      vi.useRealTimers();
      const credentials = {
        username: 'invaliduser',
        password: 'wrongpassword',
      };

      await expect(login(credentials)).rejects.toThrow('Invalid username or password');
      
      vi.useFakeTimers();
    });
  });

  describe('verifyToken', () => {
    it('should return user for valid token', async () => {
      const validUser = MOCK_USERS[0];
      const token = `mock_jwt_token_${validUser.id}_${Date.now()}`;

      const promise = verifyToken(token);
      
      await vi.advanceTimersByTimeAsync(1000);
      
      const user = await promise;

      expect(user).toEqual({
        id: validUser.id,
        email: validUser.email,
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        username: validUser.username,
        image: validUser.image,
      });
    });

    it('should return null for invalid token format', async () => {
      const token = 'invalid_token_format';

      const promise = verifyToken(token);
      
      await vi.advanceTimersByTimeAsync(1000);
      
      const user = await promise;

      expect(user).toBeNull();
    });

    it('should return null for non-existent user id in token', async () => {
      const token = `mock_jwt_token_99999_${Date.now()}`;

      const promise = verifyToken(token);
      

      await vi.advanceTimersByTimeAsync(1000);
      
      const user = await promise;

      expect(user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should resolve successfully', async () => {
      const promise = logout();
      
      await vi.advanceTimersByTimeAsync(1000);
      
      await expect(promise).resolves.toBeUndefined();
    });
  });
});
