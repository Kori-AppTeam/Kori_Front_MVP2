// src/features/find/hooks/useFindFriends.ts

import type { FriendItem } from '../types';
import { extractFollowingIds } from '../utils/helpers';
import { useAcceptedFollowing, useSentFollowRequestsSet } from './useFollowingStatus';
import { useRecommendedFriends } from './useRecommendedFriends';

/**
 * 추천 친구 목록을 조회하고 필터링하는 Hook
 *
 * 필터링 조건:
 * - 본인 제외
 * - 이미 팔로잉 중인 사용자 제외
 * - 팔로우 요청을 보낸 사용자 제외
 */
export function useFindFriends(limit: number = 20, myId?: number) {
  const { data: rawFriends, isLoading, isFetching, refetch } = useRecommendedFriends(limit);
  const { data: accepted } = useAcceptedFollowing();
  const { set: sentSet } = useSentFollowRequestsSet();

  // Compute following set
  const followingSet = extractFollowingIds(accepted);

  // Filter friend list
  const friends: FriendItem[] = (rawFriends ?? []).filter((u) => {
    const id = u.userId;
    if (!Number.isFinite(id)) return false;
    if (myId && id === myId) return false;
    if (followingSet.has(id)) return false;
    if (sentSet.has(id)) return false;
    return true;
  });

  return {
    friends,
    isLoading,
    isFetching,
    refetch,
  };
}
