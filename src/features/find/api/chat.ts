// src/features/find/api/chat.ts

import api from '@/api/axiosInstance';

type ChatRoom = {
  id: string | number;
  isGroup?: boolean;
  createdAt?: string;
  participants?: any[];
  roomId?: string | number;
};

/**
 * 1:1 채팅방 생성
 * @param otherUserId 대화 상대 사용자 ID
 * @returns 생성된 채팅방 ID
 */
export async function createOneToOneRoom(otherUserId: number | string): Promise<string> {
  const { data } = await api.post('/api/v1/chat/rooms/oneTone', { otherUserId });
  const room = (data?.data ?? data) as ChatRoom | undefined;
  const roomId = room?.id ?? room?.roomId;

  if (!roomId) {
    throw new Error('roomId가 응답에 없습니다.');
  }

  return String(roomId);
}
