import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
