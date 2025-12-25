import { BoardId } from '@/src/features/community/post/types';
import { useQuery } from '@tanstack/react-query';
import { getAutoCompleteSuggestions } from '../../post/apis/search';

export const useGetAutoSuggestions = (boardId: BoardId, q: string) => {
  return useQuery<string[]>({
    queryKey: ['autoSuggestions', boardId, q],
    initialData: [],
    queryFn: () => getAutoCompleteSuggestions(boardId, q),
    enabled: !!boardId && !!q,
  });
};
