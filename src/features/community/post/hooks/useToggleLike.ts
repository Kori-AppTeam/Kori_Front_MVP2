import { toggleLike } from '@/src/features/community/post/apis/likes';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

type Vars = { postId: number; liked: boolean };
type Context = {
  prevData?: Array<[QueryKey, any]>;
};

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation<boolean, AxiosError, Vars, Context>({
    mutationFn: ({ postId, liked }) => toggleLike(postId, liked),
    onMutate: async ({ postId, liked }): Promise<Context> => {
      await qc.cancelQueries({ queryKey: ['post'] });

      const prevData = qc.getQueriesData({ queryKey: ['post'] });

      const delta = liked ? -1 : 1;

      // 모든 post 하위 쿼리 업데이트 (list, bookmarked, detail 등)
      qc.setQueriesData({ queryKey: ['post'] }, (oldData: any) => {
        if (!oldData) return oldData;

        // InfiniteData 타입 (list, bookmarked)
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((item: any) => {
                  if (item.postId === postId) {
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

        // PostDetail 타입 (detail)
        if (oldData.postId === postId) {
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
    onError: (error, { postId, liked }, context) => {
      if (context?.prevData) {
        context.prevData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
    },
  });
}
