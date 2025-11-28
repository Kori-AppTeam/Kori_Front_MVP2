import api from '@/api/axiosInstance';

export const fetchChatRooms = async () => {
  const res = await api.get('/api/v1/chat/rooms');
  return res.data.data;
};
