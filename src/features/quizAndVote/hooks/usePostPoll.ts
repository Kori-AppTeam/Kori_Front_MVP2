import { useMutation } from '@tanstack/react-query';
import { postPoll } from '../apis/poll';
import { QuizAndVoteResponse } from '../types';

interface PostPollParams {
  pollId: number;
  optionId: number;
}

export const usePostPoll = () => {
  return useMutation<QuizAndVoteResponse, unknown, PostPollParams>({
    mutationFn: ({ pollId, optionId }) => postPoll(pollId, optionId),
  });
};
