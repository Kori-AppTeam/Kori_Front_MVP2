import api from '@/api/axiosInstance';
import type { UserProfileData } from '../type';

/** 사용자 프로필 조회 */
export const fetchUserProfile = async (userId: number): Promise<UserProfileData> => {
  const response = await api.get(`/api/v1/member/${userId}/info`);
  return response.data;
};

/** 사용자 팔로우 */
export const followUser = async (userId: number) => {
  const cleanUserId = String(userId).trim();

  if (!cleanUserId || isNaN(Number(cleanUserId))) {
    throw new Error('Invalid user ID');
  }

  const response = await api.post(`/api/v1/home/follow/${cleanUserId}`);
  return response.data;
};

/** 사용자 언팔로우 */
export const unfollowUser = async (userId: number) => {
  const response = await api.delete(`/api/v1/home/follow/${userId}`);
  return response.data;
};

/** 1:1 채팅방 생성 */
export const createOneToOneRoom = async (otherUserId: number) => {
  const response = await api.post('/api/v1/chat/rooms/oneTone', {
    otherUserId,
  });
  return response.data.data;
};
