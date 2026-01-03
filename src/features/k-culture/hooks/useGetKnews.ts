import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getKNews } from '../apis/news';
import { KNewsListData, KNewsListResp, NewsSortType, NewsType } from '../types';

export const useGetKnews = (type: NewsType, sort: NewsSortType) => {
  const query = useInfiniteQuery<KNewsListResp>({
    queryKey: ['knews', type, sort],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getKNews(type, sort, pageParam as number, 20),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.data;
      return currentPage < totalPages - 1 ? currentPage + 1 : undefined;
    },
  });

  const items: KNewsListData[] = useMemo(
    () => query.data?.pages.flatMap((page) => page.data.items) ?? [],
    [query.data],
  );

  return { ...query, items };
};
