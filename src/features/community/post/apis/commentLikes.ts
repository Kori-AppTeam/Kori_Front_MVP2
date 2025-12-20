import axiosInstance from '@/api/axiosInstance';

export async function addCommentLike(commentId: number): Promise<void> {
  await axiosInstance.put(`/api/v1/comments/${commentId}/likes/me`);
}

export async function removeCommentLike(commentId: number): Promise<void> {
  await axiosInstance.delete(`/api/v1/comments/${commentId}/likes/me`);
}
