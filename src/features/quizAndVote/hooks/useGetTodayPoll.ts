import { useQuery } from '@tanstack/react-query';
import { getTodayPoll } from '../apis/poll';
import { TodayPollType } from '../types';

export const useGetTodayPoll = (type: 'QUIZ' | 'VOTE') => {
  return useQuery<TodayPollType>({
    queryKey: ['todayPoll', type],
    queryFn: async () => {
      const response = await getTodayPoll(type);
      return response.data; // data 부분만 반환
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
