import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/services/userService';
import { User } from '@/types';

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};
