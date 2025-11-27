import api from '@/api/axiosInstance';

export const updateTranslateStateAPI = async (roomId: string, translateEnabled: boolean) => {
  try {
    await api.post(`api/v1/chat/rooms/${roomId}/translation`, { translateEnabled });
  } catch (error) {
    console.error('Error updating translation state:', error);
  }
};