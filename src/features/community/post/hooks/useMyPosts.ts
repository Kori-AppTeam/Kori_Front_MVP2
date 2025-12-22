import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getMyPosts, type MyPostsPage } from '@/api/community/my';
import { deletePost } from '../apis/post';

// 작성한 게시글 조회
export function useMyPosts(size = 20) {
  const query = useInfiniteQuery({
    queryKey: ['post', 'my', { size }],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => getMyPosts({ size, cursor: pageParam }),
    getNextPageParam: (lastPage: MyPostsPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  });

  const items = query.data?.pages.flatMap((p) => p.items) ?? [];
  return { ...query, items };
}

// 게시글 삭제
export function useDeletePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onMutate: (postId: number) => {
      qc.cancelQueries({ queryKey: ['post'] });

      const prevData = qc.getQueriesData({ queryKey: ['post'] });

      qc.setQueriesData({ queryKey: ['post', 'list'] }, (oldData: any) => {
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

        return oldData;
      });

      return { prevData };
    },
    onSuccess: (postId) => {
      qc.removeQueries({ queryKey: ['post', 'detail', postId] });
    },
    onError: (error, postId, context) => {
      if (context?.prevData) {
        context.prevData.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
    },
  });
}
