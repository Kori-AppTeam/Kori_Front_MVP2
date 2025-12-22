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

      // 리스트형 쿼리 업데이트 (list, bookmark)
      qc.setQueriesData({ queryKey: ['post', 'list'] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

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
      });

      // 상세 쿼리 업데이트
      qc.setQueriesData({ queryKey: ['post', 'detail', postId] }, (oldData: any) => {
        if (!oldData || oldData.postId !== postId) return oldData;

        const prev = Number(oldData.likeCount ?? 0);
        return {
          ...oldData,
          isLiked: !liked,
          likeCount: Math.max(0, Math.min(999, prev + delta)),
        };
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
