import type { User } from '../types';

export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const api = {
  users: {
    list: async (): Promise<User[]> => {
      const response = await fetch(`${API_BASE_URL}/users?_limit=5`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  },
};