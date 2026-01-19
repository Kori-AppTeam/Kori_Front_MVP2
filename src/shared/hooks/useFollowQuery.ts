import {
  acceptFollowUser,
  cancelFollowUser,
  declineFollowUser,
  followUser,
  unfollowUser,
} from '@/src/shared/api/follow';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USER_PROFILE_QK } from './useUserProfileQuery';

/** 팔로우 Mutation */
export const useFollowUserMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => followUser(userId),
    onSuccess: (_, userId) => {
      // 해당 사용자 프로필 캐시 무효화
      qc.invalidateQueries({ queryKey: USER_PROFILE_QK(userId) });
      // 팔로우 요청 목록 캐시 무효화
      qc.invalidateQueries({ queryKey: ['follow-list', 'PENDING', 'sent'] });
    },
  });
};

/** 언팔로우 Mutation */
export const useUnfollowUserMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => unfollowUser(userId),
    onSuccess: (_, userId) => {
      // 해당 사용자 프로필 캐시 무효화
      qc.invalidateQueries({ queryKey: USER_PROFILE_QK(userId) });
      // 친구 목록 캐시 무효화
      qc.invalidateQueries({ queryKey: ['following', 'ACCEPTED'] });
    },
  });
};

/** 팔로우 취소 Mutation */
export const useCancelFollowUserMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => cancelFollowUser(userId),
    onSuccess: (_, userId) => {
      // 해당 사용자 프로필 캐시 무효화
      qc.invalidateQueries({ queryKey: USER_PROFILE_QK(userId) });
      // 팔로우 요청 목록 캐시 무효화
      qc.invalidateQueries({ queryKey: ['follow-list', 'PENDING', 'sent'] });
    },
  });
};

/** 팔로우 수락 Mutation */
export const useAcceptFollowUserMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => acceptFollowUser(userId),
    onSuccess: async (_, userId) => {
      // 해당 사용자 프로필 캐시 무효화
      // 팔로우 요청 목록 캐시 무효화, 친구 목록 캐시 무효화
      await Promise.all([
        qc.invalidateQueries({ queryKey: USER_PROFILE_QK(userId) }),
        qc.invalidateQueries({ queryKey: ['follow-list', 'PENDING', 'received'] }),
        qc.invalidateQueries({ queryKey: ['following', 'ACCEPTED'] }),
      ]);
    },
  });
};

/** 팔로우 거절 Mutation */
export const useDeclineFollowUserMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => declineFollowUser(userId),
    onSuccess: async (_, userId) => {
      // 해당 사용자 프로필 캐시 무효화
      // 팔로우 요청 목록 캐시 무효화
      await Promise.all([
        qc.invalidateQueries({ queryKey: USER_PROFILE_QK(userId) }),
        qc.invalidateQueries({ queryKey: ['follow-list', 'PENDING', 'received'] }),
      ]);
    },
  });
};
