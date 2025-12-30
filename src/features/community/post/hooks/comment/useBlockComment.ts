import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockComment } from '../../apis/comments';

export const useBlockComment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => blockComment(commentId),
    onMutate: async (commentId) => {
      // 진행 중인 댓글 쿼리 취소
      await qc.cancelQueries({ queryKey: ['comments', 'post'] });

      // 이전 데이터 백업
      const prevData = qc.getQueriesData({ queryKey: ['comments', 'post'] });

      // Optimistic update: 차단한 댓글 즉시 제거
      qc.setQueriesData({ queryKey: ['comments', 'post'] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.filter((item: any) => item.commentId !== commentId),
            },
          })),
        };
      });

      return { prevData };
    },
    onError: (error, commentId, context) => {
      // 에러 시 이전 데이터 복구
      if (context?.prevData) {
        context.prevData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 최종 데이터 동기화
      qc.invalidateQueries({ queryKey: ['comments', 'post'] });
    },
  });
};
