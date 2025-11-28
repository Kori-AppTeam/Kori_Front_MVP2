import { getPostDetail } from '@/src/features/community/apis/post';
import { useQuery } from '@tanstack/react-query';
import { PostDetail } from '../types';

export function useGetPostDetail(postId: number) {
  const { data, isLoading, isError } = useQuery<PostDetail>({
    queryKey: ['post-detail', postId],
    queryFn: async () => {
      const data = await getPostDetail(postId);
      const postDetailData = data.data;
      return postDetailData;
    },
    enabled: !!postId,
  });

  return { postDetailData: (data ?? {}) as PostDetail, isLoading, isError };
}
