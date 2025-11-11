import { QueryClient, QueryKey } from '@tanstack/react-query';
import { STALE_TIME } from '@/constants/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false, // Don’t refetch automatically when window refocuses
      staleTime: 1000 * 60 * STALE_TIME,
    },
  },
});

export const invalidateQuery = (key: QueryKey) => {
  queryClient.invalidateQueries({ queryKey: key });
};

export default queryClient;
