import api from '@/api/axiosInstance';
import { CreatePostBody, CreateVotePostBody, UpdatePostBody, UpdateVotePostBody } from '../types';

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

// 투표 게시글 작성
export async function createVotePost(body: CreateVotePostBody) {
  const { data } = await api.post(`/api/v2/poll/vote`, body);
  return data as string;
}

// 투표 게시글 수정
export async function updateVotePost(body: UpdateVotePostBody) {
  await api.put(`/api/v2/poll/vote`, body);
}
