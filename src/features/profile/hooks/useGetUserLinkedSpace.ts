import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getUserLinkedSpaces } from '../apis/profile';
import { ProfileLinkedSpace } from '../types';

export const useGetUserLinkedSpace = (userId: number) => {
  const query = useInfiniteQuery<ProfileLinkedSpace>({
    queryKey: ['profile', 'linkedSpaces', userId],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => getUserLinkedSpaces(userId, { size: 15, cursor: pageParam as string | null }),
    getNextPageParam: (lastItem) => {
      return lastItem.hasNext ? (lastItem.nextCursor ?? undefined) : undefined;
    },
  });

  const linkedSpaces = useMemo(() => query.data?.pages.flatMap((p) => p.items) ?? [], [query.data]);

  return { linkedSpaces, ...query };
};
