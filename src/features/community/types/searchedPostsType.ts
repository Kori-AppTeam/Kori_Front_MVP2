import { Post } from '@/components/PostCard';

export type SearchedPosts = {
  postId: number;
  title?: string;
  contentPreview?: string;
  content?: string;
  authorName?: string;
  createdAt?: string | number;
  createdTime?: string | number;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  score?: number;
  likedByMe?: boolean;
  isLike?: boolean;
  isLiked?: boolean;

  contentImageUrls?: string[];
  imageUrls?: string[];
  contentImageUrl?: string;
  imageUrl?: string;

  userImageUrl?: string;
};

export type SearchedPostsResp = {
  success: boolean;
  data: {
    items: SearchedPosts[];
    hasNext: boolean;
    nextCursor?: string;
  };
  timestamp?: string;
};

export type SearchedPostEx = Post & {
  postId: number;
  hotScore?: number;
  minutesAgo?: number;
  bookmarked?: boolean;
  likedByMe?: boolean;
  userImageUrl?: string;
};
