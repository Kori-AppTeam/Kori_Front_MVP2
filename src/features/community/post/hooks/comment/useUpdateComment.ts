import { updateComment } from '@/src/features/community/post/apis/comments';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Vars = { commentId: number; content: string };

export function useUpdateComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: Vars) => updateComment(commentId, { content }),

    onMutate: async ({ commentId, content }) => {
      // 진행 중인 쿼리 취소
      await qc.cancelQueries({ queryKey: ['comments'] });

      // 이전 데이터 백업
      const prevData = qc.getQueriesData({ queryKey: ['comments'] });

      // 낙관적 업데이트
      qc.setQueriesData({ queryKey: ['comments'] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => {
            if (!page.data?.items) return page;

            return {
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((item: any) => {
                  // 최상위 댓글이 수정된 경우
                  if (item.commentId === commentId) {
                    return { ...item, content };
                  }
                  // 대댓글이 수정된 경우
                  if (item.replies) {
                    return {
                      ...item,
                      replies: item.replies.map((reply: any) =>
                        reply.commentId === commentId ? { ...reply, content } : reply,
                      ),
                    };
                  }
                  return item;
                }),
              },
            };
          }),
        };
      });

      return { prevData };
    },

    onError: (err, variables, context) => {
      // 에러 시 이전 데이터 복구
      if (context?.prevData) {
        context.prevData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}
