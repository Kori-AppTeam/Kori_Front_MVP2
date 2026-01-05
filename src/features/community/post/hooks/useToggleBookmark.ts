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

      // 리스트형 쿼리 업데이트 (list, bookmark)
      qc.setQueriesData({ queryKey: ['post', 'list'] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

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
      });

      // 상세 쿼리 업데이트
      qc.setQueriesData({ queryKey: ['post', 'detail', postId] }, (oldData: any) => {
        return { ...oldData, isBookmarked: !isBookmarked };
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
      if (isBookmarked) {
        qc.invalidateQueries({ queryKey: ['post', 'list', 'bookmark'], refetchType: 'none' });
      }
    },
  });
}
