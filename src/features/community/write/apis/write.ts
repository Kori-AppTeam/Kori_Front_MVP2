import api from '@/api/axiosInstance';
import { CreatePostBody, UpdatePostBody } from '../types';

// 게시글 작성
export async function createPost(boardId: number, body: CreatePostBody) {
  const { data } = await api.post(`/api/v1/boards/${boardId}/posts`, body);
  return data as string;
}

// 게시글 수정
export async function updatePost(postId: number, body: UpdatePostBody) {
  await api.put(`/api/v1/posts/${postId}`, body);
  return true;
}
