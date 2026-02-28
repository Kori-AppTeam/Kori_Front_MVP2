import api from '@/api/axiosInstance';

// 해당 유저가 참여한 채팅방 리스트 조회 API
export const getUserLinkedSpaces = async (userId: number) => {
  const response = await api.get(`/api/v1/member/profile/${userId}/chat-rooms`);
  return response.data.data;
};

// 해당 유저의 게시글 리스트 조회 API
export const getUserPosts = async (userId: number) => {
  const response = await api.get(`/api/v1/member/profile/${userId}/posts`);
  return response.data.data;
};
