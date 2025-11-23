// src/features/find/hooks/useRecommendedFriends.ts

import { useQuery } from '@tanstack/react-query';
import { getRecommendedFriends } from '../api/recommend';
import type { FriendItem } from '../types';
import { toFriendItem } from '../utils/helpers';

/**
 * 추천 친구 목록 조회 Hook
 * @param limit 조회할 친구 수 (기본값: 20)
 */
export function useRecommendedFriends(limit: number = 20) {
  return useQuery<FriendItem[]>({
    queryKey: ['find', 'recommend', limit],
    queryFn: async () => {
      const data = await getRecommendedFriends(limit);
      return data.map(toFriendItem);
    },
    staleTime: 60_000,
  });
}
