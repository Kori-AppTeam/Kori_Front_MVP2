import api from '@/api/axiosInstance';
import { CommentsListResp, CreateCommentReq, RequestPageParams } from '@/src/features/community/post/types';

// 댓글 조회
export async function getPostComments(postId: number, params: RequestPageParams) {
  const { sort = 'LATEST', size = 20, cursor } = params ?? {};

  const { data } = await api.get<CommentsListResp>(`/api/v1/posts/${postId}/comments`, {
    params: { sort, size, cursor },
  });
  return data;
}

// 댓글 작성
export async function createComment(postId: number, body: CreateCommentReq) {
  await api.post<string>(`/api/v1/posts/${postId}/comments`, body);
}

// 댓글 삭제
export async function deleteComment(commentId: number) {
  await api.delete(`/api/v1/comments/${commentId}`);
}

// 댓글 수정
export async function updateComment(commentId: number, body: { content: string }) {
  await api.patch(`/api/v1/comments/${commentId}`, body);
}

//댓글 차단
// 서버 쪽에 reason 필드가 없어 주석처리
// export async function blockComment(commentId: number, reason?: string) {
//   const body = reason && reason.trim().length > 0 ? { reason } : undefined;
//   return api.post(`/api/v1/comments/${commentId}/block`, body);
// }
export async function blockComment(commentId: number) {
  await api.post(`/api/v1/comments/${commentId}/block`);
}

// 댓글 좋아요
export async function addCommentLike(commentId: number): Promise<void> {
  await api.put(`/api/v1/comments/${commentId}/likes/me`);
}

// 댓글 좋아요 취소
export async function removeCommentLike(commentId: number): Promise<void> {
  await api.delete(`/api/v1/comments/${commentId}/likes/me`);
}
