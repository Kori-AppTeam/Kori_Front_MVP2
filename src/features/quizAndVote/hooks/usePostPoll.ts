import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { postPoll } from '../apis/poll';
import { PostPollParams, QuizAndVoteResponse } from '../types';

export const usePostPoll = (targetQueryKey?: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation<QuizAndVoteResponse, unknown, PostPollParams>({
    mutationFn: ({ pollId, optionId }) => postPoll(pollId, optionId),
    onSuccess: (serverResponse, variables) => {
      const queryKey = targetQueryKey || ['todayPoll', variables.pollType];
      const { results, correctOptionId, isCorrect } = serverResponse.data;

      // 서버 응답 데이터를 직접 캐시에 반영
      if (results) {
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;

          // 무한스크롤 구조인지 확인 (게시글 리스트)
          if (old.pages && Array.isArray(old.pages)) {
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  items: page.data.items.map((item: any) => {
                    // 해당 pollId를 가진 아이템 찾아서 업데이트
                    if (item.id === variables.pollId && item.pollInfo) {
                      const updatedOptions = item.pollInfo.options.map((option: any) => {
                        const optionId = option.id ?? option.optionId;
                        const serverResult = results.find((r) => r.optionId === optionId);

                        return serverResult ? { ...option, voteCount: serverResult.voteCount } : option;
                      });

                      // totalVoteCount 재계산
                      const newTotalVoteCount = updatedOptions.reduce(
                        (sum: number, option: any) => sum + option.voteCount,
                        0,
                      );

                      return {
                        ...item,
                        pollInfo: {
                          ...item.pollInfo,
                          correctOptionId: correctOptionId ?? item.pollInfo.correctOptionId,
                          selectedOptionId: variables.optionId,
                          totalVoteCount: newTotalVoteCount,
                          options: updatedOptions,
                          isCorrect: isCorrect ?? false,
                        },
                      };
                    }
                    return item;
                  }),
                },
              })),
            };
          }

          // 단순 구조 (상세 페이지, k-culture 탭)
          const isPostType = !!old.pollInfo;
          const targetData = isPostType ? old.pollInfo : old;

          // 서버에서 온 정확한 결과로 업데이트
          const updatedOptions = targetData.options.map((option: any) => {
            const optionId = option.id ?? option.optionId;
            const serverResult = results.find((r) => r.optionId === optionId);

            return serverResult ? { ...option, voteCount: serverResult.voteCount } : option;
          });

          // totalVoteCount 재계산
          const newTotalVoteCount = updatedOptions.reduce((sum: number, option: any) => sum + option.voteCount, 0);

          const updatedTarget = {
            ...targetData,
            correctOptionId: correctOptionId ?? targetData.correctOptionId,
            selectedOptionId: variables.optionId,
            totalVoteCount: newTotalVoteCount,
            options: updatedOptions,
            isCorrect: isCorrect ?? false,
          };

          if (isPostType) {
            return {
              ...old,
              pollInfo: updatedTarget,
            };
          }

          return updatedTarget;
        });
      }
    },
  });
};
