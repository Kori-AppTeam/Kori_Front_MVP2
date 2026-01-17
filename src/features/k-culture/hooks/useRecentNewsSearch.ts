import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAllRecentNewsSearches, deleteRecentNewsSearch, getRecentNewsSearches } from '../apis/search';

// 뉴스 최근 검색어 조회
export const useGetRecentNewsSearch = () => {
  return useQuery<string[]>({
    queryKey: ['recentNewsSearches'],
    queryFn: () => getRecentNewsSearches(),
    staleTime: 0,
    select: (data) => data.slice(0, 10), // 최대 10개까지만 반환
  });
};

// 뉴스 최근 검색어 단건 삭제
export const useDeleteRecentNewsSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (q: string) => deleteRecentNewsSearch(q),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentNewsSearches'] });
    },
  });
};

// 뉴스 최근 검색어 전체 삭제
export const useClearRecentNewsSearches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAllRecentNewsSearches(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentNewsSearches'] });
    },
  });
};
