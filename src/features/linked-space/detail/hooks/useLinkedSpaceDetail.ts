import { useQuery } from '@tanstack/react-query';
import { fetchLinkedSpaceDetail } from '../api/linkedSpaceDetail';
import { LinkedSpaceDetail } from '../types';

export const LINKED_SPACE_DETAIL_QK = (linkedSpaceId: string) => ['linkedSpace', 'detail', linkedSpaceId] as const;

export const useLinkedSpaceDetail = (linkedSpaceId: string) => {
  const { data, isLoading, error } = useQuery<LinkedSpaceDetail>({
    queryKey: LINKED_SPACE_DETAIL_QK(linkedSpaceId),
    queryFn: () => fetchLinkedSpaceDetail(linkedSpaceId),
    enabled: !!linkedSpaceId,
    staleTime: 5 * 60_000, // 5분
    gcTime: 10 * 60_000, // 10분
  });

  return {
    linkedSpaceDetail: data ?? null,
    isLoading,
    error,
  };
};
