import type { User } from '@types';


// this is just a example API endpoint

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};