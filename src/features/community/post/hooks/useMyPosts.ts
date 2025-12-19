import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

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
  const queryClient = useQueryClient();

  return useMutation<boolean, AxiosError, number>({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
    onError: (error) => {
      console.error('[delete] error', error);
    },
  });
}
