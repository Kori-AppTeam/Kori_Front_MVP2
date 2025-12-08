import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { UserProfileData } from '../type';
import {
  useCreateOneToOneRoomMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useUserProfileQuery,
} from './useUserProfileQuery';

export interface UserProfileState {
  selectedUser: UserProfileData | null;
  isVisible: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface UserProfileActions {
  fetchProfile: (userId: number) => Promise<void>;
  closeProfile: () => void;
  followUser: () => Promise<void>;
  unfollowUser: () => Promise<void>;
  startChat: () => Promise<void>;
}

export interface UserProfileHook {
  state: UserProfileState;
  actions: UserProfileActions;
}

export const useUserProfile = (): UserProfileHook => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  // React Query hooks
  const { data: selectedUser, isLoading, error } = useUserProfileQuery(selectedUserId);
  const followMutation = useFollowUserMutation();
  const unfollowMutation = useUnfollowUserMutation();
  const createRoomMutation = useCreateOneToOneRoomMutation();

  /** 사용자 프로필 가져오기
   * @param userId 가져올 사용자 ID
   */
  const fetchProfile = useCallback(async (userId: number) => {
    setSelectedUserId(userId);
    setIsVisible(true);
  }, []);

  /** 프로필 모달 닫기 */
  const closeProfile = useCallback(() => {
    setIsVisible(false);
    setSelectedUserId(null);
  }, []);

  /** 사용자 팔로우 */
  const followUser = useCallback(async () => {
    if (!selectedUser) {
      Alert.alert('Error', 'No user selected');
      return;
    }

    // userId 추출 및 검증
    const userId = selectedUser.userId || selectedUser.id;
    const numericUserId = Number(userId);

    if (!numericUserId || isNaN(numericUserId)) {
      console.error('Invalid userId:', userId);
      Alert.alert('Error', 'Invalid user ID');
      return;
    }

    try {
      console.log('Following userId:', numericUserId);
      await followMutation.mutateAsync(numericUserId);
      Alert.alert('Follow', 'Follow request sent!');
    } catch (error) {
      console.error('팔로우 실패:', error);
      Alert.alert('Follow Error', 'Failed to send follow request.');
    }
  }, [selectedUser, followMutation]);

  /** 사용자 언팔로우 */
  const unfollowUser = useCallback(async () => {
    if (!selectedUser) {
      Alert.alert('Error', 'No user selected');
      return;
    }

    const userId = selectedUser.userId || selectedUser.id;
    const numericUserId = Number(userId);

    if (!numericUserId) {
      Alert.alert('Error', 'Invalid user ID');
      return;
    }

    try {
      await unfollowMutation.mutateAsync(numericUserId);
      Alert.alert('Unfollow', 'Unfollowed successfully.');
    } catch (error) {
      console.error('언팔로우 실패:', error);
      Alert.alert('Unfollow Error', 'Failed to unfollow user.');
    }
  }, [selectedUser, unfollowMutation]);

  /** 1:1 채팅 시작 */
  const startChat = useCallback(async () => {
    if (!selectedUser) {
      Alert.alert('Error', 'No user selected');
      return;
    }

    const userId = selectedUser.userId || selectedUser.id;
    const numericUserId = Number(userId);

    if (!numericUserId) {
      Alert.alert('Error', 'Invalid user ID');
      return;
    }

    try {
      const newRoom = await createRoomMutation.mutateAsync(numericUserId);
      const roomId = newRoom?.id;

      if (!roomId) {
        throw new Error('Chat room ID not found');
      }

      // 프로필 모달 닫기
      closeProfile();

      // 새 채팅방으로 이동
      router.replace({
        pathname: CHAT_ROUTE(roomId),
        params: { roomName: encodeURIComponent(selectedUser.firstname + ' ' + selectedUser.lastname) },
      });
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      Alert.alert('Chat Error', 'Failed to start chat.');
    }
  }, [selectedUser, router, closeProfile, createRoomMutation]);

  const state: UserProfileState = {
    selectedUser: selectedUser || null,
    isVisible,
    isLoading: isLoading || followMutation.isPending || unfollowMutation.isPending || createRoomMutation.isPending,
    error: error as Error | null,
  };

  return {
    state,
    actions: {
      fetchProfile,
      closeProfile,
      followUser,
      unfollowUser,
      startChat,
    },
  };
};
