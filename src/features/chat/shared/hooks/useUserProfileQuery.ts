import { CHAT_ROOMS_QUERY_KEY } from '@/src/features/chat/list/hooks/useChatRooms';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOneToOneRoom, fetchUserProfile, followUser, unfollowUser } from '../api';

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
    mutationFn: followUser,
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
    mutationFn: unfollowUser,
    onSuccess: (_, userId) => {
      // 해당 사용자 프로필 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: USER_PROFILE_QK(userId),
      });
    },
  });
};

/** 1:1 채팅방 생성 Mutation */
export const useCreateOneToOneRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOneToOneRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_QUERY_KEY });
    },
  });
};
