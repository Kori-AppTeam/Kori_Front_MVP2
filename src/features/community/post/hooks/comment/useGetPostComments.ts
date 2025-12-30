import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getPostComments } from '../../apis/comments';
import { CommentsCursorPage, CommentsListResp, SortParam } from '../../types';

export const useGetPostComments = (postId: number | undefined, sort: SortParam) => {
  const query = useInfiniteQuery<CommentsListResp>({
    queryKey: ['comments', 'post', postId, sort],
    initialPageParam: undefined,
    enabled: !!postId,
    queryFn: ({ pageParam }) =>
      getPostComments(postId as number, { sort: sort, size: 20, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastItem) => {
      const item: CommentsCursorPage = lastItem.data;
      return item.hasNext ? (item.nextCursor ?? undefined) : undefined;
    },
  });

  const comments = useMemo(() => query.data?.pages.flatMap((p) => p.data.items) ?? [], [query.data]);

  return { comments, ...query };
};
