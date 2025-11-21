import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchAllSpaces, fetchBuzzingSpaces } from '../api/groupChatRooms';
import { GroupChatRoom } from '../types';

export const useBuzzingSpaces = () => {
  return useQuery<GroupChatRoom[]>({
    queryKey: ['buzzingSpaces'],
    queryFn: fetchBuzzingSpaces,
  });
};

export const useAllSpaces = () => {
  return useInfiniteQuery<GroupChatRoom[]>({
    queryKey: ['allSpaces'],
    queryFn: ({ pageParam }) => fetchAllSpaces(pageParam as number | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].roomId;
    },
  });
};
