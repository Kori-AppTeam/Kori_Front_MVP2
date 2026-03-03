import api from '@/api/axiosInstance';
import { PostsListResp } from '../../community/post/types';
import { ProfileLinkedSpace } from '../types';

// 해당 유저가 참여한 채팅방 리스트 조회 API
export const getUserLinkedSpaces = async (
  userId: number,
  params?: { size?: number; cursor?: string | null },
): Promise<ProfileLinkedSpace> => {
  const { size = 15, cursor } = params ?? {};

  const response = await api.get(`/api/v1/member/profile/${userId}/chat-rooms`, {
    params: { size, cursor },
  });
  return response.data.data;
};

// 해당 유저의 게시글 리스트 조회 API
export const getUserPosts = async (
  userId: number,
  params?: { size?: number; cursor?: string | null },
): Promise<PostsListResp> => {
  const { size = 20, cursor } = params ?? {};

  const response = await api.get(`/api/v1/member/profile/${userId}/posts`, {
    params: { size, cursor },
  });
  return response.data;
};
