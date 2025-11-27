import api from '@/api/axiosInstance';
import type { ChatMember } from '../types';

/**
 * 채팅방 멤버 목록 조회
 * @param roomId 채팅방 ID
 * @returns 멤버 목록
 */
export const fetchChatMembers = async (roomId: string | number): Promise<ChatMember[]> => {
  const response = await api.get(`/api/v1/chat/rooms/${roomId}/participants`);
  return response.data.data;
};
