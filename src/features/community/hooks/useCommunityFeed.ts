import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '../apis/post';
import { BoardId, SortParam } from '../types';

export function useCommunityFeed(boardId: BoardId, sortKey: 'new' | 'hot') {
  const sort: SortParam = sortKey === 'hot' ? 'POPULAR' : 'LATEST';

  return useInfiniteQuery({
    queryKey: ['communityFeed', boardId, sort],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => getPosts(boardId, { sort, size: 20, cursor: pageParam }),
    getNextPageParam: (last) => (last.hasNext ? (last.nextCursor ?? undefined) : undefined),
    staleTime: 60_000,
  });
}
