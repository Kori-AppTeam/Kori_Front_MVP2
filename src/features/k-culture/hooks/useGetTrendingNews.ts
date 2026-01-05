import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getTrendingNews } from '../apis/news';
import { NewsPreviewItem, TrendingNewsResp } from '../types';

export const useGetTrendingNews = () => {
  const query = useQuery<TrendingNewsResp>({
    queryKey: ['news', 'trending'],
    queryFn: () => getTrendingNews(),
  });

  const items: NewsPreviewItem[] = useMemo(() => query.data?.data ?? [], [query.data]);

  return { ...query, items };
};
