import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toggleBookMark } from '../apis/bookmarks';

type Vars = { postId: number; isBookmarked: boolean };
type Context = {
  prevData?: Array<[QueryKey, any]>;
};

export function useToggleBookmark() {
  const qc = useQueryClient();

  return useMutation<boolean, AxiosError, Vars, Context>({
    mutationFn: ({ postId, isBookmarked }) => toggleBookMark(postId, isBookmarked),
    onMutate: async ({ postId, isBookmarked }): Promise<Context> => {
      await qc.cancelQueries({ queryKey: ['post'] });

      const prevData = qc.getQueriesData({ queryKey: ['post'] });

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
                items: page.data.items.map((item: any) =>
                  item.postId === postId ? { ...item, isBookmarked: !isBookmarked } : item,
                ),
              },
            })),
          };
        }

        // PostDetail 타입 (detail)
        if (oldData.postId === postId) {
          return { ...oldData, isBookmarked: !isBookmarked };
        }

        return oldData;
      });

      return { prevData };
    },
    onError: (error, { postId, isBookmarked }, context) => {
      if (context?.prevData) {
        context.prevData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (data, errors, { isBookmarked }) => {
      // 북마크 해제 시 북마크 페이지 안에 있으면 refetch 하지 않고 데이터가 상했다는 표시만 전달
      if (!isBookmarked) {
        qc.invalidateQueries({ queryKey: ['post', 'bookmarked'], refetchType: 'none' });
      }
    },
  });
}
