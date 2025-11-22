import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { leaveChatRoom } from '../api';

interface UseLeaveChatRoomParams {
  roomId: string | number;
}

interface UseLeaveChatRoomReturn {
  handleLeaveChat: () => Promise<void>;
  isLeaving: boolean;
}

/**
 * 채팅방 나가기 Hook
 */
export const useLeaveChatRoom = ({ roomId }: UseLeaveChatRoomParams): UseLeaveChatRoomReturn => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLeaveChat = async () => {
    try {
      await leaveChatRoom(roomId);

      // 채팅방 목록 쿼리들을 무효화하여 최신 데이터 refetch
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['buzzingSpaces'] });
      queryClient.invalidateQueries({ queryKey: ['allSpaces'] });

      router.replace('/(tabs)/chat');
    } catch (err) {
      console.error('퇴장 실패', err);
      // 에러가 발생해도 사용자에게는 알리지 않고 로그만 남김
      // 필요시 Toast나 Alert 추가 가능
    }
  };

  return {
    handleLeaveChat,
    isLeaving: false, // 필요시 loading 상태 추가 가능
  };
};
