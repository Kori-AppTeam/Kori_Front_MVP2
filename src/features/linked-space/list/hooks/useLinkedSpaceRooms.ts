import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchAllSpaces, fetchBuzzingSpaces } from '../api/linkedSpace';
import { LinkedSpace } from '../types';

export const BUZZING_SPACES_QUERY_KEY = ['buzzingSpaces'];
export const ALL_SPACES_QUERY_KEY = ['allSpaces'];

export const useBuzzingSpaces = () => {
  return useQuery<LinkedSpace[]>({
    queryKey: BUZZING_SPACES_QUERY_KEY,
    queryFn: fetchBuzzingSpaces,
  });
};

export const useAllSpaces = () => {
  return useInfiniteQuery<LinkedSpace[]>({
    queryKey: ALL_SPACES_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchAllSpaces(pageParam as number | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].roomId;
    },
  });
};
