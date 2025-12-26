import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { BoardId } from '../../post/types';
import { getSearchPosts } from '../apis/search';
import { SearchedPostCursorPage, SearchedPostServerResp } from '../types';

export const useGetSearchedPosts = (boardId: BoardId, q: string, size = 20) => {
  const query = useInfiniteQuery<SearchedPostServerResp>({
    queryKey: ['post', 'search', boardId, q],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => getSearchPosts({ boardId, q, size, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastPage) => {
      const item: SearchedPostCursorPage = lastPage.data;
      return item.hasNext ? (item.nextCursor ?? undefined) : undefined;
    },
    enabled: !!boardId && !!q && q.trim().length > 0,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((p) => p.data.items.map((data) => data.item)) ?? [],
    [query.data],
  );

  return { ...query, items };
};
