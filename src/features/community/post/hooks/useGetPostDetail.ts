import { getPostDetail } from '@/src/features/community/post/apis/post';
import { useQuery } from '@tanstack/react-query';
import { PostDetailType } from '../types';

export function useGetPostDetail(postId: number | undefined) {
  const { data, isLoading, isError, error } = useQuery<PostDetailType>({
    queryKey: ['post', 'detail', postId],
    queryFn: async () => {
      const response = await getPostDetail(postId as number);
      return response.data as PostDetailType;
    },
    enabled: !!postId,
  });

  return { postDetailData: (data ?? {}) as PostDetailType, isLoading, isError, error };
}
