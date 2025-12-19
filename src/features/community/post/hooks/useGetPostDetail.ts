import { getPostDetail } from '@/src/features/community/post/apis/post';
import { useQuery } from '@tanstack/react-query';
import { PostDetail } from '../types';

export function useGetPostDetail(postId: number | undefined) {
  const { data, isLoading, isError, error } = useQuery<PostDetail>({
    queryKey: ['post', 'detail', postId],
    queryFn: async () => {
      const data = await getPostDetail(postId as number);
      const postDetailData = data.data;
      return postDetailData;
    },
    enabled: !!postId,
  });

  return { postDetailData: (data ?? {}) as PostDetail, isLoading, isError, error };
}
