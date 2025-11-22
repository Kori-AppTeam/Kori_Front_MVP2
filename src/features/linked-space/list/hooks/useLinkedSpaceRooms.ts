import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchAllSpaces, fetchBuzzingSpaces } from '../api/linkedSpace';
import { LinkedSpace } from '../types';

export const useBuzzingSpaces = () => {
  return useQuery<LinkedSpace[]>({
    queryKey: ['buzzingSpaces'],
    queryFn: fetchBuzzingSpaces,
  });
};

export const useAllSpaces = () => {
  return useInfiniteQuery<LinkedSpace[]>({
    queryKey: ['allSpaces'],
    queryFn: ({ pageParam }) => fetchAllSpaces(pageParam as number | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].roomId;
    },
  });
};
