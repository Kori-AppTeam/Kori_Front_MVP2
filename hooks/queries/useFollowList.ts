import api from '@/api/axiosInstance';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export type FollowStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type Tab = 'sent' | 'received';

export type FollowUserItem = {
  userId: number;
  firstname: string;
  lastname: string;
  gender: string;
  birthday: number;
  country: string;
  introduction: string;
  purpose: string;
  email: string;
  language: string[];
  hobby: string[];
  imageKey: string;
};

export function useSentFollowRequestsSet() {
  const q = useFollowList('PENDING', 'sent'); // 보낸 요청 목록
  const set = useMemo(() => new Set((q.data ?? []).map((u) => Number(u.userId)).filter(Number.isFinite)), [q.data]);
  return { ...q, set }; // q.set 으로 사용
}

export function useFollowList(status: FollowStatus, tab: Tab) {
  const isFollowers = tab === 'received';

  return useQuery<FollowUserItem[]>({
    queryKey: ['follow-list', status, tab] as const,
    queryFn: async () => {
      const params = { status, isFollowers: isFollowers ? 'true' : 'false' };
      const res = await api.get('/api/v1/mypage/follows', { params });
      return res.data;
    },
    staleTime: 15_000,
    placeholderData: keepPreviousData,
  });
}
