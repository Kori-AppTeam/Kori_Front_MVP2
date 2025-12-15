import { Alert } from 'react-native';
import { useCreateOneToOneRoom } from '../../chat/room/hooks/useCreateOneToOneRoom';
import { useCancelFollowRequest } from './useCancelFollowRequest';
import { useFollowUser } from './useFollowUser';

interface UseFindCardActionsParams {
  setProfileModalVisible: (visible: boolean) => void;
}

/**
 * FriendCard에서 사용하는 핸들러 로직을 관리하는 Hook
 * 팔로우, 팔로우 취소, 채팅 생성 등의 액션을 처리합니다.
 */
export function useFindCardActions({ setProfileModalVisible }: UseFindCardActionsParams) {
  // Mutations
  const followMutation = useFollowUser();
  const cancelReqMutation = useCancelFollowRequest();
  const { mutateAsync: createRoom } = useCreateOneToOneRoom();
  /**
   * 팔로우 요청 핸들러
   */
  const handleFollowRequest = async (uid: number) => {
    try {
      await followMutation.mutateAsync(uid);
    } catch (e: any) {
      const status = e?.response?.status;

      if (status === 428) {
        setProfileModalVisible(true);
        return;
      }

      Alert.alert('Failed', e?.response?.data?.message ?? 'Failed to send request.');
    }
  };

  /**
   * 팔로우 요청 취소 핸들러
   */
  const handleCancelRequest = async (uid: number) => {
    try {
      await cancelReqMutation.mutateAsync(uid);
    } catch (e: any) {
      if (e?.response?.status !== 404) {
        Alert.alert('Failed', e?.response?.data?.message ?? 'Failed to cancel request.');
      }
    }
  };

  return {
    handleFollowRequest,
    handleCancelRequest,
  };
}
