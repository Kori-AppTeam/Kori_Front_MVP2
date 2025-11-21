import api from '@/api/axiosInstance';
import { useCallback, useState } from 'react';
import { ChatRoom } from '../types';

export function useChatRooms() {
  const [chatrooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get('/api/v1/chat/rooms');
      setChatRooms(res.data.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('채팅방 불러오기 실패');
      setError(error);
      console.error('채팅방 불러오기 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRoom = useCallback((updatedRoom: ChatRoom) => {
    setChatRooms((prev) => {
      const filtered = prev.filter((room) => room.roomId !== updatedRoom.roomId);
      return [updatedRoom, ...filtered];
    });
  }, []);

  return {
    chatrooms,
    isLoading,
    error,
    fetchRooms,
    updateRoom,
  };
}
