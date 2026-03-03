import { useCreateOneToOneRoom } from '@/src/features/chat/room/hooks/useCreateOneToOneRoom';
import { User } from '../types/user';
import {
  useAcceptFollowUserMutation,
  useCancelFollowUserMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from './useFollowQuery';

export const useFriendAction = (userData: User | undefined) => {
  const followUserMutation = useFollowUserMutation();
  const unfollowUserMutation = useUnfollowUserMutation();
  const cancelFollowUserMutation = useCancelFollowUserMutation();
  const acceptFollowUserMutation = useAcceptFollowUserMutation();
  const createChatRoom = useCreateOneToOneRoom();

  const handleFollow = () => {
    if (!userData) return;
    followUserMutation.mutate(userData.userId);
  };

  const handleUnfollow = () => {
    if (!userData) return;
    unfollowUserMutation.mutate(userData.userId);
  };

  const handleCancelFollow = () => {
    if (!userData) return;
    cancelFollowUserMutation.mutate(userData.userId);
  };

  const handleAcceptFollow = () => {
    if (!userData) return;
    acceptFollowUserMutation.mutate(userData.userId);
  };

  const handleChat = (routeType: 'push' | 'replace', dissMissCount: number, onClose?: () => void) => {
    if (!userData) return;
    createChatRoom.mutate({
      otherUserId: userData.userId,
      userName: `${userData.firstname} ${userData.lastname}`,
      routeType: routeType,
      dissMissCount: dissMissCount,
      closeProfile: onClose,
    });
  };

  const getFollowAction = () => {
    if (userData?.followStatus === 'FRIEND') return { decline: { label: 'Unfollow', onPress: handleUnfollow } };
    if (userData?.followStatus === 'FOLLOWING') return { secondary: { label: 'Pending', onPress: handleCancelFollow } };
    if (userData?.followStatus === 'FOLLOWED') return { primary: { label: 'Accept', onPress: handleAcceptFollow } };

    // 기본값 (아무 관계 아닐 때)
    return { primary: { label: 'Follow', onPress: handleFollow } };
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
