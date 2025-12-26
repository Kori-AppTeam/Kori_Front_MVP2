import { useDebounce } from '@/src/features/chat/search/hooks/useDebounce';
import { AllowedCategory } from '@/src/features/community/post/types';
import AutoComplete from '@/src/features/community/search/components/AutoComplete';
import RecentSearches from '@/src/features/community/search/components/RecentSearches';
import SearchedPostsResult from '@/src/features/community/search/components/SearchedPostsResult';
import SearchInput from '@/src/features/community/search/components/SearchInput';
import { useGetRecentSearch } from '@/src/features/community/search/hooks/useRecentSearch';
import { CLIENT_CATEGORY_NAME } from '@/src/features/community/shared/constants/constants';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import styled from 'styled-components/native';

export default function CommunityScreen() {
  const { category } = useLocalSearchParams<{ category: AllowedCategory }>();
  const [value, setValue] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { data: recentSearchKeywords } = useGetRecentSearch();
  const debouncedValue = useDebounce(value);
  const effectiveQ = debouncedValue.trim().toLowerCase();

  console.log('[Search] State:', { value, debouncedValue, effectiveQ, isSubmitted, category, recentSearchKeywords });

  // 검색어 변경 처리
  const handleChangeText = (text: string) => {
    setValue(text);
    setIsSubmitted(false);
  };

  // 검색어 제출 처리
  const handleSubmit = () => {
    if (effectiveQ.length === 0) return;
    setIsSubmitted(true);
    Keyboard.dismiss();
  };

  // 자동완성에서 검색어 제출 처리
  const handleSubmitAutoComplete = (text: string) => {
    if (text.length === 0) return;
    setValue(text);
    setIsSubmitted(true);
    Keyboard.dismiss();
  };

  return (
    <Safe>
      <SearchInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={`Search in ${CLIENT_CATEGORY_NAME[category]}`}
        onSubmitEditing={handleSubmit}
      />

      {/* 최근검색어 */}
      {!value && recentSearchKeywords && recentSearchKeywords.length > 0 && !isSubmitted && (
        <RecentSearches data={recentSearchKeywords || []} />
      )}

      {/* 자동완성 */}
      {effectiveQ.length !== 0 && !isSubmitted && (
        <AutoComplete category={category} value={effectiveQ} onSubmitEditing={handleSubmitAutoComplete} />
      )}

      {/* 검색 결과 */}
      {effectiveQ.length !== 0 && isSubmitted && <SearchedPostsResult category={category} value={effectiveQ} />}
    </Safe>
  );
}

const Safe = styled.SafeAreaView`
  flex: 1;
  background: #1d1e1f;
`;
