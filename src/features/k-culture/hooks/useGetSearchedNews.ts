import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getSearchNews } from '../apis/search';
import { KNewsSearchListResp } from '../types';

export const useGetSearchedNews = (q: string, size = 20) => {
  const query = useInfiniteQuery<KNewsSearchListResp>({
    queryKey: ['news', 'search', q],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => getSearchNews(q, { size, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastPage) => {
      const cursorPage = lastPage.data;
      return cursorPage.hasNext ? (cursorPage.nextCursor ?? undefined) : undefined;
    },
    enabled: !!q && q.trim().length > 0,
  });

  const items = useMemo(() => query.data?.pages.flatMap((p) => p.data.items.map((i) => i.item)) ?? [], [query.data]);

  return { ...query, items };
};
