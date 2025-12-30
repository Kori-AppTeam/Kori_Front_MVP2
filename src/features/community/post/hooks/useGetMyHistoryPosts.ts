import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getMyPosts } from '../apis/my';
import { MyHistoryPostsCursorPage, MyHistoryPostsServerResp } from '../types';

export const useGetMyHistoryPosts = (size = 20) => {
  const query = useInfiniteQuery<MyHistoryPostsServerResp>({
    queryKey: ['post', 'list', 'myHistory'],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => getMyPosts({ size, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastPage) => {
      const item: MyHistoryPostsCursorPage = lastPage.data;
      return item.hasNext ? (item.nextCursor ?? undefined) : undefined;
    },
  });

  const items = useMemo(() => query.data?.pages.flatMap((p) => p.data.items) ?? [], [query.data]);

  return { ...query, items };
};
