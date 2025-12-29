import { BoardId } from '@/src/features/community/post/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { clickedAutoSuggestedKeyword, getAutoCompleteSuggestions } from '../apis/search';

export const useGetAutoSuggestions = (boardId: BoardId, q: string) => {
  return useQuery<string[]>({
    queryKey: ['autoSuggestions', boardId, q],
    queryFn: () => getAutoCompleteSuggestions(boardId, q),
    enabled: !!boardId && !!q && q.trim().length > 0,
    staleTime: 0, // 즉시 stale 처리
  });
};

export const usePostClickedKeyword = () => {
  return useMutation({
    mutationFn: (q: string) => clickedAutoSuggestedKeyword(q),
  });
};
