import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../api/userProfile';

/** 쿼리 키 */
export const USER_PROFILE_QK = (userId: number) => ['chat', 'userProfile', userId] as const;

/** 사용자 프로필 조회 Query */
export const useUserProfileQuery = (userId: number | null) => {
  return useQuery({
    queryKey: USER_PROFILE_QK(userId!),
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
    staleTime: 0,
    gcTime: 10 * 60_000, // 10분
  });
};
