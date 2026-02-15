import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { postPoll } from '../apis/poll';
import { OptionType, PollBaseType, PostPollParams, QuizAndVoteResponse } from '../types';

interface Context {
  postListData?: Array<[QueryKey, unknown]>;
  postDetailData?: unknown;
  todayPollData?: unknown;
}

export const usePostPoll = () => {
  const queryClient = useQueryClient();

  return useMutation<QuizAndVoteResponse, unknown, PostPollParams, Context>({
    mutationFn: ({ pollId, optionId }) => postPoll(pollId, optionId),
    // 낙관적 업데이트 (선택 즉시 선택값 먼저 반영 - 깜빡임 최소화)
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['post', 'list'] });
      await queryClient.cancelQueries({ queryKey: ['post', 'detail', variables.pollId] });
      await queryClient.cancelQueries({ queryKey: ['todayPoll', variables.pollType] });

      const postListData = queryClient.getQueriesData({ queryKey: ['post', 'list'] });
      const postDetailData = queryClient.getQueryData(['post', 'detail', variables.pollId]);
      const todayPollData = queryClient.getQueryData(['todayPoll', variables.pollType]);

      // update 로직 (선택값 변경)
      const updateFn = (originalData: PollBaseType) => ({
        ...originalData,
        selectedOptionId: variables.optionId,
      });

      queryClient.setQueriesData({ queryKey: ['post', 'list'] }, (old: any) => {
        if (!old?.pages) return old;

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
        return old;
      });

      // 2. 단일 객체 (상세)
      queryClient.setQueryData(['post', 'detail', variables.pollId], (old: any) => {
        if (!old?.pollInfo || old.id !== variables.pollId) return old;

        return {
          ...old,
          pollInfo: updateFn(old.pollInfo),
        };
      });

      // 3. TodayPoll
      queryClient.setQueryData(['todayPoll', variables.pollType], (old: any) => {
        if (!old || old.id !== variables.pollId) return old;
        return updateFn(old);
      });

      return { postListData, postDetailData, todayPollData };
    },
    // 서버 응답 후 데이터 동기화 (결과값 반영)
    onSuccess: (serverResponse, variables) => {
      const { results, correctOptionId, isCorrect } = serverResponse.data;

      if (!results) return;

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
          // 퀴즈인 경우에만 isCorrect 설정
          ...(correctOptionId !== undefined && { isCorrect: isCorrect ?? false }),
        };
      };

      queryClient.setQueriesData({ queryKey: ['post', 'list'] }, (old: any) => {
        if (!old?.pages) return old;

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
        return old;
      });

      // 2. 단일 객체 (상세)
      queryClient.setQueryData(['post', 'detail', variables.pollId], (old: any) => {
        if (!old?.pollInfo || old.id !== variables.pollId) return old;

        return {
          ...old,
          pollInfo: updateFn(old.pollInfo),
        };
      });

      // 3. TodayPoll
      queryClient.setQueryData(['todayPoll', variables.pollType], (old: any) => {
        if (!old || old.id !== variables.pollId) return old;
        return updateFn(old);
      });
    },
    onError: (err, variables, context) => {
      if (context?.postListData) {
        context.postListData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.postDetailData) {
        queryClient.setQueryData(['post', 'detail', variables.pollId], context.postDetailData);
      }
      if (context?.todayPollData) {
        queryClient.setQueryData(['todayPoll', variables.pollType], context.todayPollData);
      }
    },
  });
};
