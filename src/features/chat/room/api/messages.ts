import api from '@/api/axiosInstance';
import { ChatMessage } from '../types/index';

//TODO: 에러 처리 필요
export const loadMessagesAPI = async (roomId: string, lastMessageId: string | number): Promise<ChatMessage[]> => {
  const res = await api.get(
    `/api/v1/chat/rooms/${roomId}/messages?lastMessageId=${lastMessageId || ''}`
  );
  return res.data.data;
};

//TODO: 에러 처리 필요
export const searchMessagesAPI = async (roomId: string, searchText: string): Promise<ChatMessage[]> => {
  const res = await api.get(
    `/api/v1/chat/search?roomId=${roomId}&keyword=${encodeURIComponent(searchText)}`
  );
  return res.data.data;
};