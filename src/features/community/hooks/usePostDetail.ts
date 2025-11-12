import { getPostDetail } from '@/src/features/community/apis/post';
import { useQuery } from '@tanstack/react-query';

export function usePostDetail(postId?: number) {
  return useQuery({
    queryKey: ['post-detail', postId],
    queryFn: () => getPostDetail(postId!),
    enabled: !!postId,
  });
}
