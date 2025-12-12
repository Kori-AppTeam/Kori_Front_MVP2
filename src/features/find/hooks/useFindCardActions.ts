import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { router } from 'expo-router';
import { Alert, DeviceEventEmitter } from 'react-native';
import type { useFindFriends } from './useFindFriends';

type UseFindFriendsReturn = ReturnType<typeof useFindFriends>;

interface UseFindCardActionsParams {
  myId: number | undefined;
  state: UseFindFriendsReturn['state'];
  mutations: UseFindFriendsReturn['mutations'];
  actions: UseFindFriendsReturn['actions'];
  setProfileModalVisible: (visible: boolean) => void;
}

/**
 * FriendCard에서 사용하는 핸들러 로직을 관리하는 Hook
 * 팔로우, 팔로우 취소, 채팅 생성 등의 액션을 처리합니다.
 */
export function useFindCardActions({
  myId,
  state,
  mutations,
  actions,
  setProfileModalVisible,
}: UseFindCardActionsParams) {
  /**
   * 팔로우 요청 핸들러
   */
  const handleFollowRequest = async (uid: number) => {
    if ((myId && uid === myId) || state.inFlight.has(uid)) return;

    const already = state.requested.has(uid);
    if (!already) actions.markRequested(uid);

    try {
      actions.lock(uid);
      await mutations.followMutation.mutateAsync(uid);
      actions.markRequested(uid);
      DeviceEventEmitter.emit('FOLLOW_REQUEST_SENT', { userId: uid });
    } catch (e: any) {
      const status = e?.response?.status;

      if (status === 428) {
        actions.unmarkRequested(uid);
        setProfileModalVisible(true);
        return;
      }

      Alert.alert('Failed', e?.response?.data?.message ?? 'Failed to send request.');
    } finally {
      actions.unlock(uid);
    }
  };

  /**
   * 팔로우 요청 취소 핸들러
   */
  const handleCancelRequest = async (uid: number) => {
    if ((myId && uid === myId) || state.inFlight.has(uid)) return;
    const wasSent = state.requested.has(uid);
    if (wasSent) actions.unmarkRequested(uid);

    try {
      actions.lock(uid);
      await mutations.cancelReqMutation.mutateAsync(uid);
      DeviceEventEmitter.emit('FOLLOW_REQUEST_CANCELLED', { userId: uid });
    } catch (e: any) {
      if (e?.response?.status !== 404) {
        Alert.alert('Failed', e?.response?.data?.message ?? 'Failed to cancel request.');
      }
      if (wasSent) actions.markRequested(uid);
    } finally {
      actions.unlock(uid);
    }
  };

  /**
   * 채팅 생성 핸들러
   */
  const handleCreateChat = async (uid: number, fullName: string) => {
    try {
      const roomId = await mutations.createRoom({ otherUserId: uid });
      router.push({
        pathname: CHAT_ROUTE(roomId),
        params: { userId: String(uid), roomName: encodeURIComponent(fullName) },
      });
    } catch (err: any) {
      const status = err.response?.status;

      if (status === 428) {
        setProfileModalVisible(true);
        return;
      }

      Alert.alert('Chat Error', err?.response?.data?.message ?? 'Failed to create chat room.');
    }
  };

  return {
    handleFollowRequest,
    handleCancelRequest,
    handleCreateChat,
  };
}
