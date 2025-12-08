export const AUTH_STORAGE_KEY = 'auth_user';
export const AUTH_TOKEN_KEY = 'auth_token';

export const MOCK_USERS = [
  {
    id: 1,
    username: 'emilys',
    password: 'emilyspass',
    email: 'emily.johnson@example.com',
    firstName: 'Emily',
    lastName: 'Johnson',
    image: 'https://dummyjson.com/icon/emilys/128',
  },
  {
    id: 2,
    username: 'michaelw',
    password: 'michaelwpass',
    email: 'michael.williams@example.com',
    firstName: 'Michael',
    lastName: 'Williams',
    image: 'https://dummyjson.com/icon/michaelw/128',
  },
  {
    id: 3,
    username: 'sophiab',
    password: 'sophiabpass',
    email: 'sophia.brown@example.com',
    firstName: 'Sophia',
    lastName: 'Brown',
    image: 'https://dummyjson.com/icon/sophiab/128',
  },
] as const;

export const AUTH_ROUTES = {
  LOGIN: '/login',
  PROFILE: '/profile',
  ORDERS: '/orders',
} as const;
