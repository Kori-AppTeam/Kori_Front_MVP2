import { CHAT_ROOMS_QUERY_KEY } from '@/src/features/chat/list/hooks/useChatRooms';
import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { createOneToOneRoom } from '../api/chat';

type CreateRoomVars = {
  otherUserId: number;
  userName: string;
  routeType?: 'push' | 'replace';
  dissMissCount?: number;
  closeProfile?: () => void;
};

/**
 * 1:1 채팅방 생성 및 이동 Hook
 * @param userId 대화 상대 사용자 ID
 * @param userName 대화 상대 사용자 이름(fullname)
 * @param routeType 라우터 이동 타입 ('push' | 'replace')
 * @param closeProfile (선택 사항) 프로필 모달 닫기 함수
 */
export function useCreateOneToOneRoom() {
  const queryClient = useQueryClient();

  return useMutation<number, Error, CreateRoomVars>({
    mutationFn: async ({ otherUserId }) => {
      const data = await createOneToOneRoom(otherUserId);
      return data.id;
    },
    onSuccess: (roomId, variables) => {
      // 채팅방 생성 후 채팅 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_QUERY_KEY });

      // 프로필 모달 닫기
      if (variables.closeProfile) {
        variables.closeProfile();
      }

      if (variables.dissMissCount !== undefined && router.canDismiss()) {
        router.dismiss(variables.dissMissCount);
      }

      // 채팅방으로 이동
      const navigation = variables.routeType === 'replace' ? router.replace : router.push;
      navigation({
        pathname: CHAT_ROUTE(roomId),
        params: {
          roomName: variables.userName,
        },
      });
    },
  });
}
