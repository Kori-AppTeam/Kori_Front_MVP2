import { CHAT_ROOMS_QUERY_KEY } from '@/src/features/chat/list/hooks/useChatRooms';
import { joinLinkedSpace } from '@/src/features/linked-space/detail/api/linkedSpaceDetail';
import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { shouldShowModal, suppressModalForToday } from '../utils/modalStorage';

export const useLinkedSpaceRecommendModal = () => {
  const [visible, setVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    checkAndShowModal();
  }, []);

  const checkAndShowModal = async () => {
    const shouldShow = await shouldShowModal();
    if (shouldShow) {
      setVisible(true);
    }
  };

  const handleJoin = async (roomId: string, roomName: string) => {
    try {
      await joinLinkedSpace(roomId);
      queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_QUERY_KEY });
      router.push({
        pathname: CHAT_ROUTE(roomId),
        params: { roomName },
      });
    } catch (error: any) {
      if (error.response?.status === 428) {
        setProfileModalVisible(true);
        return;
      }

      const message = error.response?.data?.message;
      if (message === '이미 현재의 그룹채팅방에 참여하고 있습니다.') {
        Toast.show({
          type: 'error',
          text1: 'You are already in the current group chat.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: message || 'Failed to join the group chat.',
        });
      }
    }
  };

  const handleDontShowToday = async () => {
    await suppressModalForToday();
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return {
    visible,
    profileModalVisible,
    setProfileModalVisible,
    handleJoin,
    handleDontShowToday,
    handleClose,
  };
};
