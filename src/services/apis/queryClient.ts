import { QueryClient, QueryKey } from "@tanstack/react-query";

const STALE_TIME = 3
const RETRY = false

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: RETRY,
      refetchOnWindowFocus: false, // Don’t refetch automatically when window refocuses
      staleTime: 1000 * 60 * STALE_TIME
    },
  },
})

export const invalidateQuery = (key: QueryKey) => {
  queryClient.invalidateQueries({ queryKey: key });
};

export default queryClient;

