import api from '@/api/axiosInstance';

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

/** 상대에게 요청한 팔로우(FOLLOWING 상태) 취소 */
export const cancelFollowUser = async (userId: number) => {
  const response = await api.delete(`/api/v1/mypage/users/follow/${userId}`);
  return response.data;
};
