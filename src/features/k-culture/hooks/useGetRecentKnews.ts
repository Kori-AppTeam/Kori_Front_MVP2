import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { KNewsItemType, KNewsResp, NewsType } from '../types';
import { getRecentThreeNews } from './../apis/news';

export const useGetRecentKnews = (category: NewsType) => {
  const query = useQuery<KNewsResp>({
    queryKey: ['news', 'recentKnews', category],
    queryFn: () => getRecentThreeNews(category),
  });

  const items: KNewsItemType[] = useMemo(() => query.data?.data ?? [], [query.data]);

  return { ...query, items };
};
