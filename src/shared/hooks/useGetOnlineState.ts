import { useQuery } from '@tanstack/react-query';
import { getOnlineState } from '../api/onlineState';

export const useGetOnlineState = (userId: number) => {
  return useQuery({
    queryKey: ['onlineState', userId],
    queryFn: () => getOnlineState(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30초
    refetchInterval: 60 * 1000, // 60초마다 자동 새로고침
    refetchOnWindowFocus: true, // 창이 다시 활성화될 때마다 새로고침
    refetchOnReconnect: true, // 네트워크가 다시 연결될 때마다 새로고침
  });
};
