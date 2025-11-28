// src/features/find/hooks/useFollowUser.ts

import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { postFollow } from '../api/follow';

/**
 * 팔로우 요청 Hook
 */
export function useFollowUser() {
  return useMutation({
    mutationFn: (userId: number) => postFollow(userId),
    onSuccess: (res) => {
      Toast.show({ type: 'success', text1: res.message });
    },
    onError: (err: any) => {
      Toast.show({ type: 'error', text1: 'Follow failed' });
    },
  });
}
