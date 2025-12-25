import { AllowedCategory } from '@/src/features/community/post/types';
import AutoComplete from '@/src/features/community/search/components/AutoComplete';
import RecentSearches from '@/src/features/community/search/components/RecentSearches';
import SearchInput from '@/src/features/community/search/components/SearchInput';
import { useGetRecentSearch } from '@/src/features/community/search/hooks/useRecentSearch';
import { CLIENT_CATEGORY_NAME } from '@/src/features/community/shared/constants/constants';
import { useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import styled from 'styled-components/native';

export default function CommunityScreen() {
  const { category } = useLocalSearchParams<{ category: AllowedCategory }>();
  const [value, setValue] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { data: recentSearchKeywords } = useGetRecentSearch();

  const inputRef = useRef<RNTextInput>(null);
  const effectiveQ = value.trim();

  return (
    <Safe>
      <SearchInput value={value} onChangeText={setValue} placeholder={`Search in ${CLIENT_CATEGORY_NAME[category]}`} />

      {/* 최근검색어 */}
      {!value && recentSearchKeywords?.length > 0 && <RecentSearches data={recentSearchKeywords || []} />}

      {/* 자동완성 */}
      {effectiveQ.length !== 0 && !isSubmitted && <AutoComplete category={category} value={value} />}
    </Safe>
  );
}

const Safe = styled.SafeAreaView`
  flex: 1;
  background: #1d1e1f;
`;
