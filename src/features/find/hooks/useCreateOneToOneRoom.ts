// src/features/find/hooks/useCreateOneToOneRoom.ts

import { CHAT_ROOMS_QUERY_KEY } from '@/src/features/chat/list/hooks/useChatRooms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOneToOneRoom } from '../api/chat';

type CreateRoomVars = {
  otherUserId: number | string;
};

/**
 * 1:1 채팅방 생성 Hook
 */
export function useCreateOneToOneRoom() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, CreateRoomVars>({
    mutationFn: async ({ otherUserId }) => {
      return await createOneToOneRoom(otherUserId);
    },
    onSuccess: () => {
      // 채팅방 생성 후 채팅 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_QUERY_KEY });
    },
  });
}
