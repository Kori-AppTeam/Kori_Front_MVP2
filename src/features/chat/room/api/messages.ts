import api from '@/api/axiosInstance';
import { ChatMessage } from '../types/index';

export const readMessageAllAPI = async (roomId: string): Promise<void> => {
  try {
    await api.post(`/api/v1/chat/rooms/${roomId}/read-all`);
  } catch (error) {
    console.error('모든 메시지 읽음 처리 실패:', error);
    throw new Error('모든 메시지 읽음 처리에 실패했습니다');
  }
};

export const loadMessagesAPI = async (roomId: string, lastMessageId: string | number): Promise<ChatMessage[]> => {
  try {
    const res = await api.get(`/api/v1/chat/rooms/${roomId}/messages`, {
      params: { lastMessageId: lastMessageId || '' },
    });
    return res.data.data || [];
  } catch (error) {
    console.error('메시지 로드 실패:', error);
    throw new Error('메시지를 불러오는데 실패했습니다');
  }
};

export const searchMessagesAPI = async (roomId: string, searchText: string): Promise<ChatMessage[]> => {
  try {
    const res = await api.get('/api/v1/chat/search', {
      params: {
        roomId,
        keyword: searchText,
      },
    });
    return res.data.data || [];
  } catch (error) {
    console.error('메시지 검색 실패:', error);
    throw new Error('메시지 검색에 실패했습니다');
  }
};

export const loadMessagesAroundAPI = async (roomId: string, messageId: number): Promise<ChatMessage[]> => {
  try {
    const res = await api.get(`/api/v1/chat/rooms/${roomId}/messages/around`, { params: { messageId } });
    return res.data.data || [];
  } catch (error) {
    console.error('주변 메시지 로드 실패:', error);
    throw error;
  }
};
