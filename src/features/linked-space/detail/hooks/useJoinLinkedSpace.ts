import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { joinLinkedSpace } from '../api/linkedSpaceDetail';

export const useJoinLinkedSpace = (linkedSpaceId: string, linkedSpaceName?: string) => {
  const router = useRouter();
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const mutation = useMutation({
    mutationFn: () => joinLinkedSpace(linkedSpaceId),
    onSuccess: () => {
      router.push({
        pathname: CHAT_ROUTE(linkedSpaceId),
        params: {
          roomName: linkedSpaceName,
        },
      });
    },
    onError: (error: any) => {
      // TODO: 428 status code에 대한 정확한 의미 확인 필요
      if (error.response?.status === 428) {
        setProfileModalVisible(true);
        return;
      }

      if (error.response) {
        const message = error.response.data?.message;
        if (message === '이미 현재의 그룹채팅방에 참여하고 있습니다.') {
          Toast.show({
            type: 'error',
            text1: 'You are already in the current group chat.',
          });
        } else {
          //TODO: 에러 메시지 노출, if/else 구조 개선 필요
          Toast.show({
            type: 'error',
            text1: message || 'Failed to join the group chat.',
          });
        }
      } else {
        console.error('네트워크 에러:', error.message);
      }
    },
  });

  return {
    handleJoin: mutation.mutate,
    isJoining: mutation.isPending,
    profileModalVisible,
    setProfileModalVisible,
  };
};
