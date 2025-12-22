import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockUser } from '../apis/post';

export const useBlockUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => blockUser(postId),
    onMutate: (postId: number) => {
      qc.cancelQueries({ queryKey: ['post'] });

      const prevData = qc.getQueriesData({ queryKey: ['post'] });

      qc.setQueriesData({ queryKey: ['post'] }, (oldData: any) => {
        if (!oldData) return oldData;

        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.filter((item: any) => item.postId !== postId), // filter 처리
              },
            })),
          };
        }

        qc.removeQueries({ queryKey: ['post', postId] });
      });

      return { prevData };
    },
    onError: (error, postId, context) => {
      if (context?.prevData) {
        context.prevData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
    },
  });
};
