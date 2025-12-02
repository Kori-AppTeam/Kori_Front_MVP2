import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getPosts } from '../apis/post';
import { BoardId, PostsCursorPage, PostsListResp, SortParam } from '../types';

export function useGetPosts(boardId: BoardId, sort: SortParam) {
  const query = useInfiniteQuery<PostsListResp>({
    queryKey: ['post-list', boardId, sort],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => getPosts(boardId, { sort: sort, size: 20, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastItem) => {
      const item: PostsCursorPage = lastItem.data;
      return item.hasNext ? (item.nextCursor ?? undefined) : undefined;
    },
  });

  const posts = useMemo(() => query.data?.pages.flatMap((p) => p.data.items) ?? [], [query.data]);

  return { posts, ...query };
}
