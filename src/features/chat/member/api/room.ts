import api from '@/api/axiosInstance';

/**
 * 채팅방 나가기
 * @param roomId 채팅방 ID
 */
export const leaveChatRoom = async (roomId: string | number): Promise<void> => {
  await api.delete(`/api/v1/chat/rooms/${roomId}/leave`);
};
