import api from '@/api/axiosInstance';
import {
  BoardId,
  CreatePostBody,
  PostDetailServerResp,
  PostsListResp,
  RequestPageParams,
  UpdatePostBody,
} from '../types';

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
  const response = await api.get<PostDetailServerResp>(`/api/v1/posts/${postId}`);
  return response.data;
}

// 게시글 작성
export async function createPost(boardId: number, body: CreatePostBody) {
  const { data } = await api.post(`/api/v1/boards/${boardId}/posts`, body);
  return data as string;
}

// 게시글 삭제
export async function deletePost(postId: number) {
  await api.delete(`/api/v1/posts/${postId}`);
  return true;
}

// 게시글 수정
export async function updatePost(postId: number, body: UpdatePostBody) {
  await api.put(`/api/v1/posts/${postId}`, body);
  return true;
}

// 게시글 신고
export async function reportPost(postId: number, reason: string) {
  await api.post(`/api/v1/posts/${postId}/declaration`, { reason });
  return true;
}

// 게시글 작성한 유저 차단
export async function blockUser(userId: number) {
  await api.post(`/api/v1/users/${userId}/block`);
  return true;
}
