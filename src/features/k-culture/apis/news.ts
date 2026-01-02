import api from '@/api/axiosInstance';
import { NewsType } from '../types';

export const getNewsDetail = async (contentId: number) => {
  const res = await api.get(`/api/v2/main-contents/${contentId}`);
  return res.data;
};

// 메인페이지용 최근 K-컬처 뉴스 3개 조회
export const getRecentThreeNews = async (type: NewsType) => {
  const res = await api.get(`/api/v2/main-contents/${type}/preview`);
  return res.data;
};

// 메인페이지, k-news 페이지 트렌딩 뉴스 조회
export const getTrendingNews = async () => {
  const res = await api.get(`/api/v2/main-contents/trending`);
  return res.data;
};
