// src/features/find/hooks/useRecommendedFriends.ts

import { User } from '@/src/shared/types/user';
import { useQuery } from '@tanstack/react-query';
import { getRecommendedFriends } from '../api/friendRecommend';

/**
 * 추천 친구 목록 조회 Hook
 * @param limit 조회할 친구 수 (기본값: 20)
 */
export function useRecommendedFriends(limit: number = 20) {
  return useQuery<User[]>({
    queryKey: ['find', 'recommend', limit],
    queryFn: async () => {
      const data = await getRecommendedFriends(limit);
      return data;
    },
    staleTime: 60_000,
  });
}
