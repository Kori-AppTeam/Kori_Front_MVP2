import { useDebounce } from '@/src/features/chat/search/hooks/useDebounce';
import KNewsAutoComplete from '@/src/features/k-culture/components/KNewsAutoComplete';
import SearchedNewsResult from '@/src/features/k-culture/components/SearchedNewsResult';
import SuggestionHotKeyword from '@/src/features/k-culture/components/SuggestionHotKeyword';
import { useGetNewsHotKeyword } from '@/src/features/k-culture/hooks/useNewsHotKeyword';
import {
  useClearRecentNewsSearches,
  useDeleteRecentNewsSearch,
  useGetRecentNewsSearch,
} from '@/src/features/k-culture/hooks/useRecentNewsSearch';
import RecentSearches from '@/src/shared/components/RecentSearches';
import SearchInput from '@/src/shared/components/SearchInput';
import { theme } from '@/src/styles/theme';
import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

const Index = () => {
  const [value, setValue] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { data: recentNewsSearches } = useGetRecentNewsSearch();
  const { data: newsHotKeywords, refetch: refetchNewsHotKeywords } = useGetNewsHotKeyword();
  const { mutate: deleteRecentNewsSearch } = useDeleteRecentNewsSearch();
  const { mutate: clearRecentNewsSearches } = useClearRecentNewsSearches();
  const debouncedValue = useDebounce(value);
  const effectiveQ = debouncedValue.trim().toLowerCase();

  // 검색어 변경 처리
  const handleChangeText = (text: string) => {
    setValue(text);
    setIsSubmitted(false);
  };

  // 검색어 제출 처리
  const handleSubmit = () => {
    if (value.trim().length === 0) return;
    setIsSubmitted(true);
    Keyboard.dismiss();
  };

  // 최근 검색어, 자동완성에서 검색어 제출 처리
  const handleSubmitAutoComplete = (text: string) => {
    if (text.length === 0) return;
    setValue(text);
    setIsSubmitted(true);
    Keyboard.dismiss();
  };

  // Hot Keyword 클릭 처리
  const handleHotKeywordClick = (keyword: string) => {
    setValue(keyword);
    setIsSubmitted(true);
    Keyboard.dismiss();
  };

  return (
    <Safe>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <SearchInput
            value={value}
            onChangeText={handleChangeText}
            placeholder="Search Anything"
            onSubmitEditing={handleSubmit}
          />

          {/* 최근검색어 */}
          {!value && recentNewsSearches && recentNewsSearches.length > 0 && !isSubmitted && (
            <RecentSearches
              data={recentNewsSearches}
              onPressKeyword={handleSubmitAutoComplete}
              onDeleteKeyword={deleteRecentNewsSearch}
              onClearAll={clearRecentNewsSearches}
            />
          )}

          {/* Hot Keyword */}
          {!value && !isSubmitted && (
            <SuggestionHotKeyword
              data={newsHotKeywords || []}
              onPress={handleHotKeywordClick}
              onRefresh={refetchNewsHotKeywords}
            />
          )}

          {/* 자동완성 */}
          {value.trim().length > 0 && !isSubmitted && (
            <KNewsAutoComplete value={effectiveQ} onSubmitEditing={handleSubmitAutoComplete} />
          )}

          {/* 검색 결과 */}
          {value.trim().length > 0 && isSubmitted && <SearchedNewsResult value={value.trim().toLowerCase()} />}
        </Container>
      </TouchableWithoutFeedback>
    </Safe>
  );
};

export default Index;

const Container = styled.View`
  flex: 1;
`;

const Safe = styled.SafeAreaView`
  flex: 1;
  background: ${theme.colors.primary.black};
`;
