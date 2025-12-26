import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { AllowedCategory } from '../../post/types';
import { CATEGORY_TO_BOARD_ID } from '../../shared/constants/constants';
import { useGetAutoSuggestions, usePostClickedKeyword } from '../hooks/useAutoSuggestions';

type AutoCompleteProps = {
  category: AllowedCategory;
  value: string;
  onSubmitEditing: (suggestion: string) => void;
};

const AutoComplete = ({ category, value, onSubmitEditing }: AutoCompleteProps) => {
  const { data: autoSuggestions } = useGetAutoSuggestions(CATEGORY_TO_BOARD_ID[category], value);
  const { mutate: postClickedKeyword } = usePostClickedKeyword();

  console.log('[AutoComplete] Rendered:', {
    category,
    value,
    boardId: CATEGORY_TO_BOARD_ID[category],
    autoSuggestions,
  });

  // 자동완성 결과가 없으면 아무것도 렌더링하지 않음
  if (!autoSuggestions || autoSuggestions.length === 0) {
    return null;
  }

  return (
    <Container>
      {autoSuggestions?.map((suggestion, index) => (
        <SuggestionItem
          key={index}
          onPress={() => {
            postClickedKeyword(suggestion);
            onSubmitEditing(suggestion);
          }}
        >
          <Icon type="search" size={20} color={theme.colors.gray.lightGray_1} />
          <SuggestionText>{suggestion}</SuggestionText>
        </SuggestionItem>
      ))}
    </Container>
  );
};

export default AutoComplete;

const Container = styled.View`
  margin-top: 10px;
  padding: 0 20px;
`;

const SuggestionItem = styled.Pressable`
  width: 100%;
  padding: 10px 0;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

const SuggestionText = styled.Text`
  flex: 1;
  color: ${theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_L)};
`;
