import api from '@/api/axiosInstance';

export async function addBookmark(postId: number) {
  if (!Number.isFinite(postId)) throw new Error(`[likePost] invalid postId: ${postId}`);
  await api.put(`/api/v1/posts/${postId}/bookmarks/me`);
  return true;
}

export async function removeBookmark(postId: number) {
  if (!Number.isFinite(postId)) throw new Error(`[likePost] invalid postId: ${postId}`);
  await api.delete(`/api/v1/posts/${postId}/bookmarks/me`);
  return true;
}

export async function toggleBookMark(postId: number, isBookmarked: boolean) {
  if (!Number.isFinite(postId)) throw new Error(`[likePost] invalid postId: ${postId}`);
  return isBookmarked ? removeBookmark(postId) : addBookmark(postId);
}

// 내 북마크 전체 조회
export async function getMyBookmarks() {
  const res = await api.get('/api/v1/my/bookmarks');
  return res.data.data;
}
