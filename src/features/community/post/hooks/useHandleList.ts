import { useState } from 'react';
import { AllowedCategory, SortParam } from '../types';
import useScrollToTop from './useScrollToTop';

export const useHandleCommunityList = () => {
  const [sort, setSort] = useState<SortParam>('LATEST');
  const [category, setCategory] = useState<AllowedCategory>('ALL');

  const { scrollRef, scrollToTop } = useScrollToTop();

  // 정렬 방식 변경 핸들러
  const handleSortChange = (sortButton: SortParam) => {
    if (sort === sortButton) return;
    scrollToTop(false);
    setSort(sortButton);
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (cat: AllowedCategory) => {
    if (category === cat) return;
    scrollToTop(false);
    setCategory(cat);
  };

  return {
    sort,
    category,
    handleSortChange,
    handleCategoryChange,
    scrollRef,
    scrollToTop,
  };
};
