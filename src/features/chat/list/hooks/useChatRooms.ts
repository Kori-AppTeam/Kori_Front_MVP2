import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchChatRooms } from '../api/chatRooms';
import { ChatRoom } from '../types';

export const CHAT_ROOMS_QUERY_KEY = ['chatRooms'];

export function useChatRooms() {
  const queryClient = useQueryClient();

  const { data: chatrooms = [], isLoading, error, refetch } = useQuery<ChatRoom[]>({
    queryKey: CHAT_ROOMS_QUERY_KEY,
    queryFn: fetchChatRooms,
  });

  const updateRoom = useCallback((updatedRoom: ChatRoom) => {
    queryClient.setQueryData<ChatRoom[]>(CHAT_ROOMS_QUERY_KEY, (prev) => {
      if (!prev) return [updatedRoom];
      const filtered = prev.filter((room) => room.roomId !== updatedRoom.roomId);
      return [updatedRoom, ...filtered];
    });
  }, [queryClient]);

  return {
    chatrooms,
    isLoading,
    error,
    fetchRooms: refetch,
    updateRoom,
  };
}
