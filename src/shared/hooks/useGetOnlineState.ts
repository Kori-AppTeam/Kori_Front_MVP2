import { useQuery } from '@tanstack/react-query';
import { getOnlineState } from '../api/onlineState';

export const useGetOnlineState = (userId: number) => {
  return useQuery({
    queryKey: ['onlineState', userId],
    queryFn: () => getOnlineState(userId),
    enabled: !!userId,
    staleTime: 5 * 60_000, // 5분
  });
};
