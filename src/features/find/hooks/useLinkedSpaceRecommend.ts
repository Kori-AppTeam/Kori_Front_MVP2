import { useQuery } from '@tanstack/react-query';
import { fetchLinkedSpaceRecommendation } from '../api/linkedSpaceRecommend';

/**
 * 링크드 스페이스 추천 데이터를 가져오는 Hook
 * @param enabled 쿼리 활성화 여부
 */
export const useLinkedSpaceRecommend = (enabled: boolean) => {
  return useQuery({
    queryKey: ['linkedSpaceRecommend'],
    queryFn: fetchLinkedSpaceRecommendation,
    enabled,
    retry: 1,
    staleTime: 0,
  });
};
