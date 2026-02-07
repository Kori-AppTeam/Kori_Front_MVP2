import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { postPoll } from '../apis/poll';
import { OptionType, PollBaseType, PostPollParams, QuizAndVoteResponse } from '../types';

interface Context {
  previousData?: any;
  queryKey?: QueryKey;
}

export const usePostPoll = (targetQueryKey?: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation<QuizAndVoteResponse, unknown, PostPollParams, Context>({
    mutationFn: ({ pollId, optionId }) => postPoll(pollId, optionId),

    // 낙관적 업데이트 (선택 즉시 선택값 먼저 반영 - 깜빡임 최소화)
    onMutate: async (variables) => {
      const queryKey = targetQueryKey || ['todayPoll', variables.pollType];

      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        // update 로직 (선택값 변경)
        const updateFn = (originalData: PollBaseType) => ({
          ...originalData,
          selectedOptionId: variables.optionId,
        });

        // 1. 리스트 (무한스크롤)
        if (old.pages && Array.isArray(old.pages)) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((item: any) => {
                  if (item.id === variables.pollId && item.pollInfo) {
                    return { ...item, pollInfo: updateFn(item.pollInfo) };
                  }
                  return item;
                }),
              },
            })),
          };
        }

        // 2. 단일 객체 (상세/투표)
        if (old.pollInfo) {
          // PostPollDetail 구조: { ...postDetail, pollInfo: PollBaseType }
          return {
            ...old,
            pollInfo: updateFn(old.pollInfo),
          };
        } else {
          // TodayPoll 구조: TodayPollType (직접)
          return updateFn(old);
        }
      });

      return { previousData, queryKey };
    },

    // 서버 응답 후 데이터 동기화 (결과값 반영)
    onSuccess: (serverResponse, variables) => {
      const queryKey = targetQueryKey || ['todayPoll', variables.pollType];
      const { results, correctOptionId, isCorrect } = serverResponse.data;

      if (!results) return;

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        // update 로직 (투표 결과 반영)
        const updateFn = (originalData: PollBaseType) => {
          const updatedOptions = originalData.options.map((option: OptionType) => {
            const optionId = option.optionId ?? option.id;
            const serverResult = results.find((r) => r.optionId === optionId);
            return serverResult ? { ...option, voteCount: serverResult.voteCount } : option;
          });

          const newTotalVoteCount = updatedOptions.reduce((acc, cur) => acc + cur.voteCount, 0);

          return {
            ...originalData,
            correctOptionId: correctOptionId ?? originalData.correctOptionId,
            totalVoteCount: newTotalVoteCount,
            options: updatedOptions,
            isCorrect: isCorrect ?? false,
          };
        };

        // 1. 리스트 (무한스크롤)
        if (old.pages && Array.isArray(old.pages)) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((item: any) => {
                  if (item.id === variables.pollId && item.pollInfo) {
                    return { ...item, pollInfo: updateFn(item.pollInfo) };
                  }
                  return item;
                }),
              },
            })),
          };
        }

        // 2. 단일 객체 (상세/투표)
        if (old.pollInfo) {
          // PostPollDetail 구조
          return {
            ...old,
            pollInfo: updateFn(old.pollInfo),
          };
        } else {
          // TodayPoll 구조: TodayPollType (직접)
          return updateFn(old);
        }
      });

      // 3. 모든 관련 캐시 무효화 (페이지 이동 후에도 최신 데이터 보장)
      queryClient.invalidateQueries({ queryKey: ['post', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['todayPoll', variables.pollType] });
      queryClient.invalidateQueries({ queryKey: ['post', 'detail', variables.pollId] });
    },

    onError: (err, variables, context) => {
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
  });
};
