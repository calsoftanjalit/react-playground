import { QueryClient } from "@tanstack/react-query";

const STALE_TIME = 3
// const CACHE_TIME = 5
const RETRY = 0

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: RETRY,
      refetchOnWindowFocus: false, // Don’t refetch automatically when window refocuses
      staleTime: 1000 * 60 * STALE_TIME
    },
  },
})

export default queryClient;

