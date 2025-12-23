import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getMyComments } from '../../apis/my';
import { MyHistoryCommentCursorPage, MyHistoryCommentsServerResp } from '../../types';

export const useGetMyHistoryComments = (size = 20) => {
  const query = useInfiniteQuery<MyHistoryCommentsServerResp>({
    queryKey: ['comments', 'list', 'myHistory'],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => getMyComments({ size, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastPage) => {
      const item: MyHistoryCommentCursorPage = lastPage.data;
      return item.hasNext ? (item.nextCursor ?? undefined) : undefined;
    },
  });

  const items = useMemo(() => query.data?.pages.flatMap((p) => p.data.items) ?? [], [query.data]);

  return { ...query, items };
};
