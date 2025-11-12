import { Category } from '@/components/CategoryChips';
import { Post } from '@/components/PostCard';

// index.tsx

export type PostsListItem = {
  postId: number;
  title?: string;
  contentPreview?: string;
  content?: string;

  authorName?: string;
  userName?: string | null;
  nickname?: string;
  memberName?: string;
  writerName?: string;

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
  contentImageUrl?: string | null;
  imageUrl?: string | null;

  userImageUrl?: string;
  boardCategory: Category | string;
  isAnonymous?: boolean;
};

export type PostsListResp = {
  success: boolean;
  data: {
    items: PostsListItem[];
    hasNext: boolean;
    nextCursor?: string;
  };
  timestamp?: string;
};

export type PostEx = Post & {
  postId: number;
  authorName?: string;
  hotScore?: number;
  minutesAgo?: number;
  bookmarked?: boolean;
  likedByMe?: boolean;
  userImageUrl?: string;
  isAnonymous?: boolean;
};
