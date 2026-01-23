import api from '@/api/axiosInstance';

// K-컬처 뉴스 일반 검색
export const getSearchNews = async (q: string, params: { size?: number; cursor?: string }) => {
  const { size = 20, cursor } = params;

  const res = await api.get(`/api/v2/main-contents/search/posts`, {
    params: {
      q,
      size,
      cursor,
    },
  });

  return res.data;
};

// 뉴스 최근 검색어 조회
export const getRecentNewsSearches = async () => {
  const res = await api.get(`/api/v2/main-contents/search/recent`);
  return res.data;
};

// 뉴스 자동완성 검색어 조회
export const getAutoNewsSuggestions = async (q: string) => {
  const res = await api.get(`/api/v2/main-contents/search/suggest`, {
    params: {
      q,
    },
  });
  return res.data;
};

// 뉴스 추천 키워드 조회
export const getHotKeywords = async () => {
  const res = await api.get(`/api/v2/main-contents/search/hot-keywords`);
  return res.data.data;
};

// 뉴스 자동완성 검색어 클릭 기록 등록
export const postClickedAutoNewsSuggestion = async (text: string) => {
  const res = await api.post(`/api/v2/main-contents/search/clicked`, {
    text,
  });
  return res.data;
};

// 뉴스 추천 키워드 클릭 후 검색
export const postClickedNewsHotKeyword = async (keyword: string, params: { size?: number; cursor?: string }) => {
  const { size = 20, cursor } = params;

  const res = await api.post(`/api/v2/main-contents/search/hot-keywords/clicked`, {
    keyword,
    size,
    cursor,
  });
  return res.data;
};

// 뉴스 최근 검색어 단건 삭제
export const deleteRecentNewsSearch = async (q: string) => {
  const res = await api.delete(`/api/v2/main-contents/search/recent`, {
    params: { q },
  });
  return res.data;
};

// 뉴스 최근 검색어 전체 삭제
export const deleteAllRecentNewsSearches = async () => {
  const res = await api.delete(`/api/v2/main-contents/search/recent/all`);
  return res.data;
};
