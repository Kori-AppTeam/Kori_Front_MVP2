import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clearRecentSearchKeywords, deleteRecentSearchKeyword, getRecentSearchKeywords } from '../apis/search';

// 최근 검색어 조회
export const useGetRecentSearch = () => {
  return useQuery<string[]>({
    queryKey: ['recentSearchKeywords'],
    queryFn: () => getRecentSearchKeywords(),
    staleTime: 0,
  });
};

// 최근 검색어 단건 삭제
export const useDeleteRecentSearchKeyword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (q: string) => deleteRecentSearchKeyword(q),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentSearchKeywords'] });
    },
  });
};

// 최근 검색어 전체 삭제
export const useClearRecentSearchKeywords = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearRecentSearchKeywords(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentSearchKeywords'] });
    },
  });
};
