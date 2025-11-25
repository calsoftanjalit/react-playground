import { QueryClient, QueryKey } from '@tanstack/react-query';
import { STALE_TIME } from '@/constants/api';
import { showToast } from '@/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false, // Don’t refetch automatically when window refocuses
      staleTime: 1000 * 60 * STALE_TIME,
      throwOnError: (error) => {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        showToast({
          type: 'error',
          title: 'Error',
          message,
        });
        return true; // important — allow React Query to throw the error
      },
    },
  },
});

export const invalidateQuery = (key: QueryKey) => {
  queryClient.invalidateQueries({ queryKey: key });
};

export default queryClient;
