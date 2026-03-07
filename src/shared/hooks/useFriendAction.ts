import { useCreateOneToOneRoom } from '@/src/features/chat/room/hooks/useCreateOneToOneRoom';
import { User } from '../types/user';
import {
  useAcceptFollowUserMutation,
  useCancelFollowUserMutation,
  useDeclineFollowUserMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from './useFollowQuery';

export const useFriendAction = () => {
  const followUserMutation = useFollowUserMutation();
  const unfollowUserMutation = useUnfollowUserMutation();
  const cancelFollowUserMutation = useCancelFollowUserMutation();
  const acceptFollowUserMutation = useAcceptFollowUserMutation();
  const declineFollowUserMutation = useDeclineFollowUserMutation();
  const createChatRoom = useCreateOneToOneRoom();

  const handleFollow = (userData: User | undefined | null) => {
    if (!userData) return;
    followUserMutation.mutate(userData.userId);
  };

  const handleUnfollow = (userData: User | undefined | null) => {
    if (!userData) return;
    unfollowUserMutation.mutate(userData.userId);
  };

  const handleCancelFollow = (userData: User | undefined | null) => {
    if (!userData) return;
    cancelFollowUserMutation.mutate(userData.userId);
  };

  const handleAcceptFollow = (userData: User | undefined | null) => {
    if (!userData) return;
    acceptFollowUserMutation.mutate(userData.userId);
  };

  const handleDeclineFollow = (userData: User | undefined | null) => {
    if (!userData) return;
    declineFollowUserMutation.mutate(userData.userId);
  };

  const handleChat = (
    userData: User | undefined | null,
    routeType?: 'push' | 'replace',
    dissMissCount?: number,
    onClose?: () => void,
  ) => {
    if (!userData) return;
    createChatRoom.mutate({
      otherUserId: userData.userId,
      userName: `${userData.firstname} ${userData.lastname}`,
      routeType: routeType,
      dissMissCount: dissMissCount,
      closeProfile: onClose,
    });
  };

  // 채팅 제외, 친구 상태에 따른 버튼 액션 반환
  const getFollowAction = (userData: User | undefined | null) => {
    if (userData?.followStatus === 'FRIEND')
      return { secondary: { label: 'Following', onPress: () => handleUnfollow(userData) } };
    if (userData?.followStatus === 'FOLLOWING')
      return { secondary: { label: 'Requested', onPress: () => handleCancelFollow(userData) } };
    if (userData?.followStatus === 'FOLLOWED')
      return {
        primary: { label: 'Accept', onPress: () => handleAcceptFollow(userData) },
        decline: { label: 'Decline', onPress: () => handleDeclineFollow(userData) },
      };

    // 기본값 (아무 관계 아닐 때)
    return { primary: { label: 'Follow', onPress: () => handleFollow(userData) } };
  };

  return {
    handleFollow,
    handleUnfollow,
    handleCancelFollow,
    handleAcceptFollow,
    handleChat,
    getFollowAction,
  };
};
