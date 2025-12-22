import { deleteComment } from '@/src/features/community/post/apis/comments';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onMutate: async (commentId: number) => {
      // 진행 중인 쿼리 취소
      await qc.cancelQueries({ queryKey: ['comments'] });

      // 이전 데이터 백업
      const prevData = qc.getQueriesData({ queryKey: ['comments'] });

      // 낙관적 업데이트: 댓글 목록에서 제거
      qc.setQueriesData({ queryKey: ['comments'] }, (oldData: any) => {
        if (!oldData) return oldData;

        // infinite query 페이지 구조
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              items: page.items ? page.items.filter((item: any) => item.commentId !== commentId) : [],
            })),
          };
        }

        return oldData;
      });

      return { prevData };
    },
    onError: (error, commentId, context) => {
      // 에러 발생 시 이전 데이터로 복구
      if (context?.prevData) {
        context.prevData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // 성공/실패와 관계없이 쿼리 무효화
      qc.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}
