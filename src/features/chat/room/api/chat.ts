// src/features/find/api/chat.ts

import api from '@/api/axiosInstance';

type CreateChatRoomResponse = {
  id: number;
  isGroup: boolean;
  createdAt: string;
  participants: participant[];
  timestamp: string;
};

type participant = {
  id: number;
  userId: number;
  userName: string;
  joinedAt: string;
  lastLeftAt: string;
  lastReadMessageId: number;
  status: string;
};

/**
 * 1:1 채팅방 생성
 * @param otherUserId 대화 상대 사용자 ID
 * @returns 생성된 채팅방 ID
 */
export async function createOneToOneRoom(otherUserId: number | string): Promise<CreateChatRoomResponse> {
  const res = await api.post('/api/v1/chat/rooms/oneTone', { otherUserId });
  return res.data;
}
