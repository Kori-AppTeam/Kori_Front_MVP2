import { Post } from '@/src/features/community/post/components/PostCard';

export type BoardId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type SortParam = 'LATEST' | 'POPULAR';
export type ClientSortParam = 'New' | 'Hot';
export type AllowedCategory = 'ALL' | 'NEWS' | 'TIP' | 'QNA' | 'EVENT' | 'FREE_TALK' | 'ACTIVITY';
export type AllowedClientCategory = 'All' | 'News' | 'Tip' | 'Q&A' | 'Event' | 'Free talk' | 'Activity';

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
  isBookmarked: boolean;
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
  isBookmarked: boolean;
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

export interface PostsListServerResp {
  success: boolean;
  data: PostsCursorPage;
  timestamp?: string;
}

export interface RequestPageParams {
  sort?: SortParam;
  size?: number;
  cursor?: string | null;
}

// 북마크 게시글 아이템
export interface BookmarkedPostItem {
  bookmarkId: number;
  postId: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  isAnonymous: boolean;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  checkCount: number;
  isBookmarked: boolean;
  userImage: string;
  postImages: string[];
}
// 북마크 게시글 단일 응답 타입
export interface BookmarkedPostsPage {
  items: BookmarkedPostItem[];
  hasNext: boolean;
  nextCursor?: string | null;
}
// 북마크 게시글 서버 응답 타입
export interface BookmarkedPostsResp {
  message: string;
  data: BookmarkedPostsPage;
  timestamp?: string;
}
// 북마크 무한스크롤 요청 바디 타입
export interface BookmarkRequestBody {
  size: number;
  cursor?: string | null;
}

// 게시글 공통 헤더 컴포넌트
export interface PostCommonHeaderProps {
  authorId?: number;
  postId: number;
  isAnonymous?: boolean;
  userImageUrl?: string | null;
  authorName?: string | null;
  createdAt: string;
  boardCategory?: AllowedCategory;
  viewCount: number;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

// 게시글 공통 푸터 컴포넌트
export interface PostCommonFooterProps {
  isLiked: boolean;
  likeCount: number;
  onToggleLike: () => void;
  onToggleComment?: () => void;
  commentCount: number;
  onOpenModal: () => void;
  authorId?: number;
  postId?: number;
}

// 게시글 차단(신고)
export interface BlockReportPostParams {
  reasonCategory: string;
  reasonDetail: string;
}
