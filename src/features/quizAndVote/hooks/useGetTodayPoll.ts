import { useQuery } from '@tanstack/react-query';
import { getTodayPoll } from '../apis/poll';
import { TodayPollType } from '../types';

export const useGetTodayPoll = (type: 'QUIZ' | 'VOTE') => {
  return useQuery<TodayPollType>({
    queryKey: ['todayPoll', type],
    queryFn: () => getTodayPoll(type),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
