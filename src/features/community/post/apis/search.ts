import api from '@/api/axiosInstance';
import { SearchedPostServerResp, SearchReqParams } from '../../search/types';
import { BoardId } from '../types';

export const getSearchPosts = async (params: SearchReqParams) => {
  const { boardId, q, size, cursor } = params;
  const res = await api.get<SearchedPostServerResp>(`/api/v1/search/${boardId}/posts`, {
    params: { q, size, cursor: cursor ?? undefined },
  });
  return res.data;
};

export const getAutoCompleteSuggestions = async (boardId: BoardId, q: string): Promise<string[]> => {
  const res = await api.get(`/api/v1/search/${boardId}/suggest`, {
    params: { q },
  });
  return res.data;
};

export const getRecentSearchKeywords = async (): Promise<string[]> => {
  const res = await api.get<string[]>(`/api/v1/search/recent`);
  return res.data;
};

// 최근 검색어 단건 삭제
export const deleteRecentSearchKeyword = async (q: string): Promise<void> => {
  await api.delete(`/api/v1/search/recent`, {
    params: { q },
  });
};

// 최근 검색어 전체 삭제
export const clearRecentSearchKeywords = async (): Promise<void> => {
  await api.delete(`/api/v1/search/recent/all`);
};
