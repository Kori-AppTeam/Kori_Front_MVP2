import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getKNews } from '../apis/news';
import { KNewsListCursorPage, KNewsListData, KNewsListResp, NewsSortType, NewsType } from '../types';

export const useGetKnews = (type: NewsType, sort: NewsSortType) => {
  const query = useInfiniteQuery<KNewsListResp>({
    queryKey: ['knews', 'list', type, sort],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      getKNews(type, {
        sort: sort,
        size: 20,
        cursor: pageParam as string | undefined,
      }),
    getNextPageParam: (lastPage) => {
      const page: KNewsListCursorPage = lastPage.data;
      return page.hasNext ? (page.nextCursor ?? undefined) : undefined;
    },
  });

  const items: KNewsListData[] = useMemo(
    () => query.data?.pages.flatMap((page) => page.data.items) ?? [],
    [query.data],
  );

  return { ...query, items };
};
