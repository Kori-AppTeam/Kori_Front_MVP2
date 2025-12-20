import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { addCommentLike, removeCommentLike } from '../../apis/commentLikes';

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

      // 모든 comment 하위 쿼리 업데이트
      qc.setQueriesData({ queryKey: ['comments'] }, (oldData: any) => {
        if (!oldData) return oldData;

        // InfiniteData 타입 (list)
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

        // 단일 Comment 타입 (detail)
        if (oldData.commentId === commentId) {
          const prev = Number(oldData.likeCount ?? 0);
          return {
            ...oldData,
            isLiked: !liked,
            likeCount: Math.max(0, Math.min(999, prev + delta)),
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
