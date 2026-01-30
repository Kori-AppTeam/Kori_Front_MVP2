import { useMutation, useQuery } from '@tanstack/react-query';
import { getAutoNewsSuggestions, postClickedAutoNewsSuggestion } from '../apis/search';

// 뉴스 자동완성 검색어 조회
export const useGetNewsAutoSuggestions = (q: string) => {
  return useQuery<string[]>({
    queryKey: ['newsAutoSuggestions', q],
    queryFn: () => getAutoNewsSuggestions(q),
    enabled: !!q && q.trim().length > 0,
    staleTime: 0, // 즉시 stale 처리
  });
};

// 뉴스 자동완성 검색어 클릭 기록 등록
export const usePostClickedNewsSuggestion = () => {
  return useMutation({
    mutationFn: (text: string) => postClickedAutoNewsSuggestion(text),
  });
};
