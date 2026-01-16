import { useQuery } from '@tanstack/react-query';
import { getNewsDetail } from '../apis/news';
import { getNewsDetailForSearch } from '../apis/search';
import { KCultureNewsItem } from '../types';

export const useGetNewsDetail = (contentId: number, fromSearch: boolean) => {
  return useQuery<KCultureNewsItem>({
    queryKey: ['news', 'detail', fromSearch ? 'search' : 'normal', contentId],
    queryFn: () => {
      return fromSearch ? getNewsDetailForSearch(contentId) : getNewsDetail(contentId);
    },
    enabled: !!contentId,
  });
};
