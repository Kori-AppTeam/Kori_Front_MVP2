import { PollBaseType } from '@/src/features/quizAndVote/types';

export type BoardId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type SortParam = 'LATEST' | 'POPULAR';
export type ClientSortParam = 'New' | 'Hot';
export type AllowedCategory = 'ALL' | 'NEWS' | 'TIP' | 'QNA' | 'EVENT' | 'FREE_TALK' | 'ACTIVITY' | 'QUIZ' | 'VOTE';
export type GeneralCategory = 'NEWS' | 'TIP' | 'QNA' | 'EVENT' | 'FREE_TALK' | 'ACTIVITY';
export type PollCategory = 'QUIZ' | 'VOTE';
export type AllowedClientCategory =
  | 'All'
  | 'News'
  | 'Tip'
  | 'Q&A'
  | 'Event'
  | 'Free talk'
  | 'Activity'
  | 'Quiz'
  | 'Vote';

// 게시글 상세
export interface PostDetail {
  id: number;
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
}

// 일반 게시글 상세
export interface GeneralPostDetail extends PostDetail {
  category: GeneralCategory;
  postInfo: {
    contentImageUrl: string[] | null;
    imageCount: number;
  };
}

// 투표/퀴즈 게시글 상세
export interface PostPollDetail extends PostDetail {
  category: PollCategory;
  pollInfo: PollBaseType;
}

// 게시글 상세 타입 (일반 게시글 + 투표/퀴즈 게시글)
export type PostDetailType = GeneralPostDetail | PostPollDetail;

// 게시글 전체목록 조회 시 게시글
export interface PostsListItem {
  id: number;
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
  score: number | null;
}

// 일반 게시글 타입
export interface GeneralPostItem extends PostsListItem {
  category: GeneralCategory;
  postInfo: {
    contentImageUrl: string | null;
    imageCount: number;
  };
}

// 투표/퀴즈 게시글 타입
export interface PostPollItem extends PostsListItem {
  category: PollCategory;
  pollInfo: PollBaseType;
}

// 게시글 리스트 아이템 타입 (일반 게시글 + 투표/퀴즈 게시글)
export type PostsListItemType = GeneralPostItem | PostPollItem;

// page별 post 호출
export interface PostsCursorPage {
  items: PostsListItemType[];
  hasNext: boolean;
  nextCursor?: string | null;
}

export interface PostsListResp {
  message: string;
  data: PostsCursorPage;
  timestamp?: string;
}

export interface PostDetailServerResp {
  message?: string;
  data: PostDetail;
  timestamp?: string;
}

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
  id: number;
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
  showProfileModal?: boolean;
  onShowProfileModal?: () => void;
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

// 상세게시글 댓글 타입
export interface Comment {
  commentId: number;
  parentCommentId: number;
  authorId: number;
  authorName: string;
  content: string;
  isAnonymous: boolean;
  isLiked: boolean;
  likeCount: number;
  createdAt: string;
  userImage: string;
  deleted: boolean;
}

// 댓글 무한스크롤 페이지 타입
export interface CommentsCursorPage {
  items: Comment[];
  hasNext: boolean;
  nextCursor?: string | null;
}

// 댓글 리스트 서버 응답 타입
export interface CommentsListResp {
  message: string;
  data: CommentsCursorPage;
  timestamp: string;
}

// 댓글 작성 요청 바디 타입
export interface CreateCommentReq {
  comment: string;
  anonymous: boolean;
  parentId: number | null;
}

// 마이 히스토리 게시글 타입
export interface MyHistoryPost {
  id: number;
  content: string;
  createdAt: string;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  imageUrl: string;
  imageCount: number;
}
export interface MyHistoryPostsCursorPage {
  items: MyHistoryPost[];
  hasNext: boolean;
  nextCursor: string | null;
}
export interface MyHistoryPostsServerResp {
  message: string;
  data: MyHistoryPostsCursorPage;
  timestamp?: string;
}

// 마이 히스토리 댓글 타입
export interface MyHistoryComment {
  commentId: number;
  postId: number;
  postContent: string;
  commentContent: string;
  createdAt: string;
}
export interface MyHistoryCommentCursorPage {
  items: MyHistoryComment[];
  hasNext: boolean;
  nextCursor: string | null;
}
export interface MyHistoryCommentsServerResp {
  message: string;
  data: MyHistoryCommentCursorPage;
  timestamp?: string;
}
