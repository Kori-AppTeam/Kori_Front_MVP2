import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchChatRooms } from '../api/chatRooms';
import { MyChatRoom } from '../types';

export const CHAT_ROOMS_QUERY_KEY = ['chatRooms'];

export function useChatRooms() {
  const queryClient = useQueryClient();

  const {
    data: chatrooms = [],
    isLoading,
    error,
  } = useQuery<MyChatRoom[]>({
    queryKey: CHAT_ROOMS_QUERY_KEY,
    queryFn: fetchChatRooms,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const updateRoom = useCallback(
    (updatedRoom: MyChatRoom) => {
      queryClient.setQueryData<MyChatRoom[]>(CHAT_ROOMS_QUERY_KEY, (prev) => {
        if (!prev) return [updatedRoom];
        const filtered = prev.filter((room) => room.roomId !== updatedRoom.roomId);
        return [updatedRoom, ...filtered];
      });
    },
    [queryClient],
  );

  return {
    chatrooms,
    isLoading,
    error,
    updateRoom,
  };
}
