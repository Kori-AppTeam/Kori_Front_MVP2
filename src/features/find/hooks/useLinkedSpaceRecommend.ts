import { useQuery } from '@tanstack/react-query';
import { fetchLinkedSpaceRecommendation } from '../api/linkedSpaceRecommend';

export const useLinkedSpaceRecommend = (enabled: boolean) => {
  return useQuery({
    queryKey: ['linkedSpaceRecommend'],
    queryFn: fetchLinkedSpaceRecommendation,
    enabled,
    retry: 1,
    staleTime: 0,
  });
};
