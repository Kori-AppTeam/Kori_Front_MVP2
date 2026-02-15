import { useQuery } from '@tanstack/react-query';
import { getNewsCategories } from '../apis/news';
import { NewsCategory } from '../types';

export const useGetNewsCategories = () => {
  return useQuery<NewsCategory[]>({
    queryKey: ['news', 'categories'],
    queryFn: () => getNewsCategories(),
    staleTime: 1000 * 60 * 60, // 1시간동안은 다시 조회하지 않음
  });
};
