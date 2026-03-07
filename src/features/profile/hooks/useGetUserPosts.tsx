import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { PostsCursorPage, PostsListResp } from '../../community/post/types';
import { getUserPosts } from '../apis/profile';

export const useGetUserPosts = (userId: number) => {
  const query = useInfiniteQuery<PostsListResp>({
    queryKey: ['post', 'list', 'profile', userId],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => getUserPosts(userId, { size: 20, cursor: pageParam as string | null }),
    getNextPageParam: (lastItem) => {
      const items: PostsCursorPage = lastItem.data;
      return items.hasNext ? (items.nextCursor ?? undefined) : undefined;
    },
  });

  const posts = useMemo(
    () => query.data?.pages.flatMap((p) => p.data.items.filter((post) => !post.isAnonymous)) ?? [],
    [query.data],
  );

  return { posts, ...query };
};
