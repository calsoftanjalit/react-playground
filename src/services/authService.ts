import type { LoginCredentials, LoginResponse, AuthUser, MockUser } from '@/types/auth';
import { MOCK_USERS } from '@/constants/auth';

const MOCK_API_DELAY = 800;

const simulateDelay = (ms: number = MOCK_API_DELAY): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const toAuthUser = (user: MockUser): AuthUser => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  image: user.image,
});

/**
 * Mock login API call
 * @param credentials - Username and password
 * @returns Promise with user data and token
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  await simulateDelay();

  const user = MOCK_USERS.find(
    u => u.username === credentials.username && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid username or password');
  }

  const token = `mock_jwt_token_${user.id}_${Date.now()}`;

  return {
    user: toAuthUser(user),
    token,
  };
};

export const logout = async (): Promise<void> => {
  await simulateDelay(300);
};

/**
 * Mock verify token API call
 * @param token - JWT token to verify
 * @returns Promise with user data if token is valid
 */
export const verifyToken = async (token: string): Promise<AuthUser | null> => {
  await simulateDelay(500);

  if (!token.startsWith('mock_jwt_token_')) {
    return null;
  }

  const parts = token.split('_');
  const userId = Number.parseInt(parts[3], 10);

  const user = MOCK_USERS.find(u => u.id === userId);

  if (!user) {
    return null;
  }

  return toAuthUser(user);
};
