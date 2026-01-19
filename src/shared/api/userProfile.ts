import api from '@/api/axiosInstance';
import { User } from '../types/user';

/** 사용자 프로필 조회 */
export const fetchUserProfile = async (userId: number): Promise<User> => {
  const response = await api.get(`/api/v1/member/${userId}/info`);
  return response.data;
};
