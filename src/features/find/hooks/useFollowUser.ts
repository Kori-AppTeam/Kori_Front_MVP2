// src/features/find/hooks/useFollowUser.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { postFollow } from '../api/follow';

/**
 * 팔로우 요청 Hook
 */
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => postFollow(userId),
    onSuccess: (res, userId) => {
      // 보낸 팔로우 요청 목록 캐시 업데이트
      queryClient.setQueryData<any[]>(['follow-list', 'PENDING', 'sent'], (old) => {
        if (!old) return [{ userId, id: userId }];
        // 중복 방지
        const exists = old.some((u) => Number(u.userId ?? u.id) === userId);
        if (exists) return old;
        return [...old, { userId, id: userId }];
      });

      queryClient.invalidateQueries({ queryKey: ['follow-list', 'PENDING', 'sent'] });

      Toast.show({ type: 'success', text1: res.message });
    },
    onError: (err: any) => {
      Toast.show({ type: 'error', text1: 'Follow failed' });
    },
  });
}
