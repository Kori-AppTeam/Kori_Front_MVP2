import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { addCommentLike, removeCommentLike } from '../../apis/comments';

type Vars = { commentId: number; liked: boolean };
type Context = {
  prevData?: Array<[QueryKey, any]>;
};

export const useToggleCommentLike = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, liked }: Vars) => (liked ? removeCommentLike(commentId) : addCommentLike(commentId)),
    onMutate: async ({ commentId, liked }): Promise<Context> => {
      await qc.cancelQueries({ queryKey: ['comments'] });

      const prevData = qc.getQueriesData({ queryKey: ['comments'] });

      const delta = liked ? -1 : 1;

      // 댓글 목록 업데이트 (InfiniteData)
      qc.setQueriesData({ queryKey: ['comments'] }, (oldData: any) => {
        if (!oldData) return oldData;

        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((item: any) => {
                  if (item.commentId === commentId) {
                    const prev = Number(item.likeCount ?? 0);
                    return {
                      ...item,
                      isLiked: !liked,
                      likeCount: Math.max(0, Math.min(999, prev + delta)),
                    };
                  }
                  return item;
                }),
              },
            })),
          };
        }

        return oldData;
      });

      return { prevData };
    },
    onError: (error, { commentId, liked }, context) => {
      if (context?.prevData) {
        context.prevData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
    },
  });
};
