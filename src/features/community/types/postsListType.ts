import { Category } from '@/components/CategoryChips';
import { Post } from '@/components/PostCard';

export type BoardId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type SortParam = 'LATEST' | 'POPULAR';

export interface PostsListItem {
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

  boardCategory: Category | string;
  categoryId?: number;

  createdAt?: string | number | null;
  createdTime?: string | number | null;

  likeCount?: number | null;
  commentCount?: number | null;
  viewCount?: number | null;
  imageCount?: number | null;
  score?: number | null;

  likedByMe?: boolean | null;
  isLike?: boolean | null;
  isLiked?: boolean | null;

  contentImageUrls?: string[] | null;
  imageUrls?: string[] | null;
  contentImageUrl?: string | null;
  imageUrl?: string | null;
}

export interface PostsListResp {
  success: boolean;
  data: {
    items: PostsListItem[];
    hasNext: boolean;
    nextCursor?: string;
  };
  timestamp?: string;
}

// 게시글 상세
export interface PostDetail extends PostsListItem {
  link?: string | null;
  authorId?: string | number | null;
  userId?: string | number | null;
  memberId?: string | number | null;
  writerId?: string | number | null;
}

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

// 게시글 작성
export interface CreatePostBody {
  content: string;
  isAnonymous: boolean;
  imageUrls?: string[];
}
