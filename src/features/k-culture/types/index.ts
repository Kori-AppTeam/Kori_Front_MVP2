import { NEWS_CATEGORY_MAPPER } from '../constants/categoryMapper';

export type NewsType = keyof typeof NEWS_CATEGORY_MAPPER;

// 뉴스 상세 아이템 타입
export interface KCultureNewsItem {
  id: number;
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
