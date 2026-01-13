import api from '@/api/axiosInstance';
import { User } from '../types/user';

/** 사용자 프로필 조회 */
export const fetchUserProfile = async (userId: number): Promise<User> => {
  const response = await api.get(`/api/v1/member/${userId}/info`);
  return response.data;
};

/** 사용자 팔로우 */
export const followUser = async (userId: number) => {
  const response = await api.post(`/api/v1/mypage/follow/${userId}`);
  return response.data;
};

/** 사용자 언팔로우 */
export const unfollowUser = async (userId: number) => {
  const response = await api.delete(`/api/v1/mypage/users/follow/accepted/${userId}`);
  return response.data;
};

/** 사용자 팔로우 취소 */
export const cancelFollowUser = async (userId: number) => {
  const response = await api.delete(`/api/v1/mypage/users/follow/${userId}`);
  return response.data;
};
