// src/features/find/hooks/useFollowingStatus.ts

import api from '@/api/axiosInstance';
import { getAcceptedFollowing } from '@/api/mypage/following';
import { useQuery } from '@tanstack/react-query';
import type { FollowingUser } from '../types';
import { extractFollowingIds } from '../utils/helpers';

/**
 * 수락된 팔로잉 목록 조회 Hook
 */
export function useAcceptedFollowing() {
  return useQuery<FollowingUser[], Error>({
    queryKey: ['following', 'ACCEPTED'],
    queryFn: getAcceptedFollowing,
    staleTime: 60_000,
    retry: 1,
  });
}

/**
 * 보낸 팔로우 요청 목록을 Set으로 반환하는 Hook
 */
export function useSentFollowRequestsSet() {
  const { data } = useQuery<any[]>({
    queryKey: ['follow-list', 'PENDING', 'sent'],
    queryFn: async () => {
      const params = { status: 'PENDING', isFollowers: 'false' };
      const res = await api.get('/api/v1/mypage/follows', { params });
      const data = res?.data;
      const arr: unknown = Array.isArray(data) ? data : ((data as any)?.data ?? []);
      return Array.isArray(arr) ? arr : [];
    },
    staleTime: 60_000,
  });

  const set = extractFollowingIds(data);
  return { set, data };
}
