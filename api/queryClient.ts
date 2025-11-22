import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { 
      retry: 1, 
      staleTime: 5_000, // 5초로 단축 (더 빠른 데이터 갱신)
      refetchOnWindowFocus: true, // 앱이 포그라운드로 돌아올 때 refetch
      refetchOnMount: true, // 컴포넌트 마운트 시 refetch
    },
    mutations: { retry: 0 },
  },
});

export default queryClient;
