import { useQuery } from '@tanstack/react-query';
import { getNewsDetail } from '../apis/news';
import { KCultureNewsItem } from '../types';

export const useGetNewsDetail = (contentId: number) => {
  return useQuery<KCultureNewsItem>({
    queryKey: ['news', 'detail', contentId],
    queryFn: () => getNewsDetail(contentId),
    enabled: !!contentId,
  });
};
