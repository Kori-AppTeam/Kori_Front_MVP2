// src/features/find/hooks/useCancelFollowRequest.ts

import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { cancelFollowRequest } from '../api/follow';

/**
 * 팔로우 요청 취소 Hook
 */
export function useCancelFollowRequest(options?: UseMutationOptions<unknown, unknown, number>) {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, number>({
    mutationFn: cancelFollowRequest,
    onSuccess: (res, userId, ctx, mutation) => {
      // 팔로우 요청 목록 캐시 업데이트
      queryClient.setQueryData<any[]>(['follow-list', 'PENDING', 'sent'], (old) =>
        Array.isArray(old) ? old.filter((u) => Number(u.userId ?? u.id) !== userId) : old,
      );

      queryClient.invalidateQueries({ queryKey: ['follow-list', 'PENDING', 'sent'] });

      options?.onSuccess?.(res, userId, ctx, mutation);
    },
    onError: options?.onError,
  });
}
