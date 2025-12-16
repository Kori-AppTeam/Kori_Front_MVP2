import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, followUser, unfollowUser } from '../api/userProfile';

/** 쿼리 키 */
export const USER_PROFILE_QK = (userId: number) => ['chat', 'userProfile', userId] as const;

/** 사용자 프로필 조회 Query */
export const useUserProfileQuery = (userId: number | null) => {
  return useQuery({
    queryKey: USER_PROFILE_QK(userId!),
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60_000, // 5분
    gcTime: 10 * 60_000, // 10분
  });
};

/** 팔로우 Mutation */
export const useFollowUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => followUser(userId),
    onSuccess: (_, userId) => {
      // 해당 사용자 프로필 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: USER_PROFILE_QK(userId),
      });
    },
  });
};

/** 언팔로우 Mutation */
export const useUnfollowUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => unfollowUser(userId),
    onSuccess: (_, userId) => {
      // 해당 사용자 프로필 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: USER_PROFILE_QK(userId),
      });
    },
  });
};
