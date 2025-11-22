import api from '@/api/axiosInstance';

export const fetchBuzzingSpaces = async () => {
  const res = await api.get('/api/v1/chat/group/popular');
  return res.data.data;
};

export const fetchAllSpaces = async (lastRoomId?: number | null) => {
  const queryParam = lastRoomId ? `?lastChatRoomId=${lastRoomId}` : '';
  const res = await api.get(`/api/v1/chat/group/latest${queryParam}`);
  return res.data.data;
};
