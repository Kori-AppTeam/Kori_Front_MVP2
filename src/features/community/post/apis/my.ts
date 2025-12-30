import api from '@/api/axiosInstance';
import { MyHistoryCommentsServerResp, MyHistoryPostsServerResp, RequestPageParams } from '../types';

// 작성한 게시글 조회
export async function getMyPosts(params: RequestPageParams) {
  const { size = 20, cursor } = params ?? {};
  const response = await api.get<MyHistoryPostsServerResp>('/api/v1/my/posts', {
    params: { size: size, cursor: cursor },
  });
  return response.data;
}

// 내가 작성한 댓글 조회
export async function getMyComments(params: RequestPageParams) {
  const { size = 20, cursor } = params ?? {};
  const response = await api.get<MyHistoryCommentsServerResp>('/api/v1/my/comments', {
    params: { size: size, cursor: cursor },
  });
  return response.data;
}
