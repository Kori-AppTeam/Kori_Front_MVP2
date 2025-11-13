import { Post } from '@/src/features/community/components/PostCard';

export type BoardId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type SortParam = 'LATEST' | 'POPULAR';
export type AllowedCategory = 'ALL' | 'NEWS' | 'TIP' | 'QNA' | 'EVENT' | 'FREE_TALK' | 'ACTIVITY';

// export interface PostsListItem {
//   postId: number;
//   title?: string | null;
//   contentPreview?: string | null;
//   content?: string | null;

//   authorName?: string | null;
//   userName?: string | null;
//   nickname?: string | null;
//   memberName?: string | null;
//   writerName?: string | null;

//   isAnonymous?: boolean;
//   userImageUrl?: string | null;

//   boardCategory: Category | string;
//   categoryId?: number;

//   createdAt?: string | number | null;
//   createdTime?: string | number | null;

//   likeCount?: number | null;
//   commentCount?: number | null;
//   viewCount?: number | null;
//   imageCount?: number | null;
//   score?: number | null;

//   likedByMe?: boolean | null;
//   isLike?: boolean | null;
//   isLiked?: boolean | null;

//   contentImageUrls?: string[] | null;
//   imageUrls?: string[] | null;
//   contentImageUrl?: string | null;
//   imageUrl?: string | null;
// }

// 게시글 상세
export interface PostDetail {
  postId: number;
  content: string;
  authorId: number;
  authorName: string | null;
  boardCategory: AllowedCategory;
  createdTime: string;
  link: string;
  isAnonymous: boolean;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  userImageUrl: string;
  contentImageUrls?: string[];
  imageCount: number;
}

// 게시글 전체목록 조회 시 게시글
export interface PostsListItem {
  postId: number;
  contentPreview: string;
  authorId: number;
  authorName: string | null;
  boardCategory: AllowedCategory;
  createdAt: string;
  isAnonymous: boolean;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  userImageUrl: string | null;
  contentImageUrl: string | null;
  imageCount: number;
  score: number | null;
}

// page별 post 호출
export interface PostsCursorPage {
  items: PostsListItem[];
  hasNext: boolean;
  nextCursor?: string | null;
}

export interface PostsListResp {
  message: string;
  data: {
    items: PostsListItem[];
    hasNext: boolean;
    nextCursor?: string | null;
  };
  timestamp?: string;
}

export interface PostDetailServerResp {
  message?: string;
  data: PostDetail;
  timestamp?: string;
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

export interface PostsListServerResp extends PostsCursorPage {
  success: boolean;
  data: PostsCursorPage;
  timestamp?: string;
}

export interface RequestPageParams {
  sort?: SortParam;
  size?: number;
  cursor?: string;
}
