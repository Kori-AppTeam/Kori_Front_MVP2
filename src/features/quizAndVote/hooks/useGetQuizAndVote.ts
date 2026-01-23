import { useQuery } from '@tanstack/react-query';
import { getTodayQuizAndVote } from '../../k-culture/apis/quizAndVote';
import { QuizAndVoteItem } from '../types';

export const useGetQuizAndVote = (type: 'QUIZ' | 'VOTE') => {
  return useQuery<QuizAndVoteItem>({
    queryKey: ['quizAndVote', type],
    queryFn: () => getTodayQuizAndVote(type),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
