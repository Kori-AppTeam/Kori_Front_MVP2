import { NEWS_CATEGORY_MAPPER } from '../constants/categoryMapper';

export type NewsType = keyof typeof NEWS_CATEGORY_MAPPER;
export type NewsSortType = 'TRENDING' | 'NEW';

// 뉴스 상세 아이템 타입
export interface KCultureNewsItem {
  contentId: number;
  title: string;
  htmlContent: string;
  originalUrl: string;
}

// 뉴스 미리보기 아이템 타입
export interface NewsPreviewItem {
  contentId: number;
  title: string;
  type: NewsType;
  ago: number;
  thumbImageUrl: string;
}

// 트렌딩 뉴스 서버 응답 타입
export interface TrendingNewsResp {
  message: string;
  data: NewsPreviewItem[];
  timestamp: string;
}

// k-news 조회 아이템 타입
export interface KNewsItemType extends NewsPreviewItem {
  contentPreview: string;
}

// k-news 서버 응답 타입
export interface KNewsResp {
  message: string;
  data: KNewsItemType[];
  timestamp: string;
}

// k-news 리스트 서버 응답 타입
export interface KNewsListResp {
  message: string;
  data: KNewsListCursorPage;
  timestamp: string;
}

export interface KNewsListCursorPage {
  items: KNewsListData[];
  hasNext: boolean;
  nextCursor?: string | null;
}

// k-news 리스트 데이터 타입
export interface KNewsListData extends NewsPreviewItem {
  createdAt: string;
  score: number;
}

export interface NewsPageParams {
  sort: NewsSortType;
  size: number;
  cursor?: string;
}

// 검색 뉴스 리스트 서버 응답 타입
export interface KNewsSearchListResp {
  message: string;
  data: KNewsSearchListCursorPage;
  timestamp: string;
}

export interface KNewsSearchListCursorPage {
  items: {
    item: KNewsListData;
    score: number;
  }[];
  hasNext: boolean;
  nextCursor?: string | null;
}
