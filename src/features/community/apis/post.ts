import api from '@/api/axiosInstance';
import {
  BoardId,
  CreatePostBody,
  PostDetailServerResp,
  PostsListResp,
  RequestPageParams,
} from '../types/postsListType';

// 게시글 목록 조회
export async function getPosts(boardId: BoardId, params: RequestPageParams): Promise<PostsListResp> {
  const { sort = 'LATEST', size = 20, cursor } = params ?? {};

  const response = await api.get<PostsListResp>(`/api/v1/boards/${boardId}/posts`, {
    params: { sort, size, cursor },
  });

  return response.data;
}

// 게시글 상세조회
export async function getPostDetail(postId: number): Promise<PostDetailServerResp> {
  const { data } = await api.get<PostDetailServerResp>(`/api/v1/posts/${postId}`);
  return data;
}

// 게시글 작성
export async function createPost(boardId: number, body: CreatePostBody) {
  const { data } = await api.post(`/api/v1/boards/${boardId}/posts`, body);
  return data as string;
}
