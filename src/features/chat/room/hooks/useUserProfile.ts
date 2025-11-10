import api from '@/api/axiosInstance';
import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

interface UserProfileData {
  userId: number;
  id?: number;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  followStatus?: 'FOLLOWING' | 'PENDING' | 'NOT_FOLLOWING';
  // 기타 프로필 데이터 필드들
}

interface UserProfileState {
  selectedUser: UserProfileData | null;
  isVisible: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface UserProfileActions {
  fetchProfile: (userId: number) => Promise<void>;
  closeProfile: () => void;
  followUser: () => Promise<void>;
  unfollowUser: () => Promise<void>;
  startChat: () => Promise<void>;
}

interface UserProfileHook {
  state: UserProfileState;
  actions: UserProfileActions;
}

export const useUserProfile = (): UserProfileHook => {
  const [state, setState] = useState<UserProfileState>({
    selectedUser: null,
    isVisible: false,
    isLoading: false,
    error: null,
  });

  const router = useRouter();

  /** 사용자 프로필 가져오기
   * @param userId 가져올 사용자 ID
   */
  const fetchProfile = useCallback(async (userId: number) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const res = await api.get(`/api/v1/member/${userId}/info`);
      setState(prev => ({
        ...prev,
        selectedUser: res.data,
        isVisible: true,
        isLoading: false,
      }));
    } catch (error) {
      console.error('프로필 불러오기 실패:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }));
      Alert.alert('Error', 'Failed to load user profile');
    }
  }, []);

  /** 프로필 모달 닫기 */
  const closeProfile = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: false,
      selectedUser: null,
      error: null,
    }));
  }, []);

  /** 사용자 팔로우 */
  const followUser = useCallback(async () => {
    if (!state.selectedUser) {
      Alert.alert('Error', 'No user selected');
      return;
    }

    // userId 추출 및 검증
    const userId = state.selectedUser.userId || state.selectedUser.id;
    const cleanUserId = String(userId).trim();

    if (!cleanUserId || isNaN(Number(cleanUserId))) {
      console.error('Invalid userId:', userId);
      Alert.alert('Error', 'Invalid user ID');
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      console.log('Following userId:', cleanUserId);
      await api.post(`/api/v1/home/follow/${cleanUserId}`);

      // 팔로우 상태 업데이트
      setState(prev => ({
        ...prev,
        selectedUser: prev.selectedUser ? {
          ...prev.selectedUser,
          followStatus: 'PENDING'
        } : null,
        isLoading: false,
      }));

      Alert.alert('Follow', 'Follow request sent!');
    } catch (error) {
      console.error('팔로우 실패:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }));
      Alert.alert('Follow Error', 'Failed to send follow request.');
    }
  }, [state.selectedUser]);

  /** 사용자 언팔로우 */
  const unfollowUser = useCallback(async () => {
    if (!state.selectedUser) {
      Alert.alert('Error', 'No user selected');
      return;
    }

    const userId = state.selectedUser.userId || state.selectedUser.id;
    const numericUserId = Number(userId);

    if (!numericUserId) {
      Alert.alert('Error', 'Invalid user ID');
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      await api.delete(`/api/v1/home/follow/${numericUserId}`);

      // 팔로우 상태 업데이트
      setState(prev => ({
        ...prev,
        selectedUser: prev.selectedUser ? {
          ...prev.selectedUser,
          followStatus: 'NOT_FOLLOWING'
        } : null,
        isLoading: false,
      }));

      Alert.alert('Unfollow', 'Unfollowed successfully.');
    } catch (error) {
      console.error('언팔로우 실패:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }));
      Alert.alert('Unfollow Error', 'Failed to unfollow user.');
    }
  }, [state.selectedUser]);

  /** 1:1 채팅 시작 */
  const startChat = useCallback(async () => {
    if (!state.selectedUser) {
      Alert.alert('Error', 'No user selected');
      return;
    }

    const userId = state.selectedUser.userId || state.selectedUser.id;
    const numericUserId = Number(userId);

    if (!numericUserId) {
      Alert.alert('Error', 'Invalid user ID');
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const response = await api.post('/api/v1/chat/rooms/oneTone', {
        otherUserId: numericUserId,
      });

      const newRoom = response.data.data;
      const roomId = newRoom?.id;

      if (!roomId) {
        throw new Error('Chat room ID not found');
      }

      // 프로필 모달 닫기
      closeProfile();

      // 새 채팅방으로 이동
      router.push({
        pathname: CHAT_ROUTE(roomId),
      });

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }));
      Alert.alert('Chat Error', 'Failed to start chat.');
    }
  }, [state.selectedUser, router, closeProfile]);

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