import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postPoll } from '../apis/poll';
import { PostPollParams, QuizAndVoteResponse, TodayPollType } from '../types';

interface MutationContext {
  previousData?: TodayPollType;
  pollType: 'QUIZ' | 'VOTE';
}

export const usePostPoll = () => {
  const queryClient = useQueryClient();

  return useMutation<QuizAndVoteResponse, unknown, PostPollParams, MutationContext>({
    mutationFn: ({ pollId, optionId }) => postPoll(pollId, optionId),
    onMutate: async ({ pollId, optionId, pollType }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['todayPoll', pollType] });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData<TodayPollType>(['todayPoll', pollType]);

      // 낙관적 업데이트: 캐시를 즉시 업데이트
      if (previousData) {
        queryClient.setQueryData<TodayPollType>(['todayPoll', pollType], {
          ...previousData,
          selectedOptionId: optionId,
        });
      }

      // 롤백용 데이터 반환
      return { previousData, pollType };
    },
    onError: (err, variables, context) => {
      // 실패 시 롤백
      if (context?.previousData) {
        queryClient.setQueryData(['todayPoll', context.pollType], context.previousData);
      }
    },
    onSettled: (data, error, variables) => {
      // 성공/실패와 관계없이 쿼리 무효화하여 서버 상태와 동기화
      queryClient.invalidateQueries({ queryKey: ['todayPoll', variables.pollType] });
    },
  });
};
