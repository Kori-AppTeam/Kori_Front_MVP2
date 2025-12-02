import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getMyBookmarks } from '../apis/bookmarks';
import { BookmarkedPostsPage, BookmarkedPostsResp } from '../types';

export function useGetBookmarkedPosts() {
  const query = useInfiniteQuery<BookmarkedPostsResp>({
    queryKey: ['bookmarked-posts'],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => getMyBookmarks({ size: 20, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastItem) => {
      const item: BookmarkedPostsPage = lastItem.data;
      return item.hasNext ? (item.nextCursor ?? undefined) : undefined;
    },
  });

  const bookmarkedPosts = useMemo(() => query.data?.pages.flatMap((p) => p.data.items) ?? [], [query.data]);

  return { bookmarkedPosts, ...query };
}
