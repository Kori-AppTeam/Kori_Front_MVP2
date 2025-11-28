import { useQuery } from '@tanstack/react-query';
import { getPostDetail } from '../apis/post';
import { AllowedCategory } from '../types';

// 이후 삭제 예정(useGetPostDetail.tsx로 대체)
type PostListItem = {
  postId: number;

  title?: string | null;
  contentPreview?: string | null;
  content?: string | null;

  authorName?: string | null;
  userName?: string | null;
  nickname?: string | null;
  memberName?: string | null;
  writerName?: string | null;

  isAnonymous?: boolean;
  userImageUrl?: string | null;

  boardCategory?: string | AllowedCategory;
  categoryId?: number;
  createdAt?: string | number | null;
  createdTime?: string | number | null;
  likeCount?: number | null;
  commentCount?: number | null;
  viewCount?: number | null;
  score?: number | null;

  likedByMe?: boolean;
  isLike?: boolean;
  isLiked?: boolean;

  contentImageUrls?: string[] | null;
  imageUrls?: string[] | null;
  contentImageUrl?: string | null;
  imageUrl?: string | null;

  imageCount?: number | null;
};

type PostsCursorPage = {
  items: PostListItem[];
  hasNext: boolean;
  nextCursor?: string | null;
};

type PostsListServerResp = { success: boolean; data: PostsCursorPage; timestamp?: string };

type PostDetail = {
  postId: number;

  content: string;
  link?: string | null;

  authorId?: string | number | null;
  userId?: string | number | null;
  memberId?: string | number | null;
  writerId?: string | number | null;
  authorName?: string | null;
  userName?: string | null;
  nickname?: string | null;
  memberName?: string | null;
  writerName?: string | null;

  userImageUrl?: string | null;
  isAnonymous?: boolean;

  boardCategory?: string;
  createdTime: number | string | null; // 서버가 epoch(초/밀리초) 또는 ISO 문자열 줄 수 있음

  likeCount: number;
  commentCount: number;
  viewCount: number;

  contentImageUrls?: string[] | null;
  imageUrls?: string[] | null;
  contentImageUrl?: string | null;
  imageCount?: number | null;
};

export function usePostDetail(postId?: number) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['post-detail', postId],
    queryFn: async () => {
      const result = await getPostDetail(postId!);

      return result.data;
    },
    enabled: !!postId,
  });

  return { data, isLoading, isError, error };
}
